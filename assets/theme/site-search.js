(function () {
  const storageKey = "cilabPendingSearch";
  const lastSearchKey = "cilabLastSearch";
  const form = document.querySelector(".site-search");
  const input = document.querySelector("#site-search-input");
  const results = document.querySelector(".site-search-results");

  const pages = [
    { title: "Home", url: "index.html" },
    { title: "Team", url: "team.html" },
    { title: "Research", url: "research.html" },
    { title: "Publications", url: "publications.html" },
    { title: "Projects", url: "projects.html" },
    { title: "News", url: "news.html" },
    { title: "Gallery", url: "gallery.html" },
    { title: "Teaching", url: "teaching.html" },
    { title: "Contact", url: "contact.html" },
    { title: "Joining CILAB", url: "joining.html" },
  ];

  const siteRoot = new URL("../../", document.currentScript.src);
  pages.forEach(page => { page.url = new URL(page.url, siteRoot).href; });

  let indexPromise;
  let activeIndex = -1;

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    }[character]));
  }

  function normalize(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function termsFor(query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return words.length > 1 ? words : [query.toLowerCase()];
  }

  function highlight(value, terms) {
    let escaped = escapeHtml(value);
    terms
      .filter((term) => term.length >= 2)
      .sort((a, b) => b.length - a.length)
      .forEach((term) => {
        const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        escaped = escaped.replace(pattern, (match) => `<mark>${match}</mark>`);
      });
    return escaped;
  }

  function hrefPath(url) {
    return new URL(url, window.location.href).pathname.replace(/\/$/, "/index.html");
  }

  function currentPath() {
    const path = window.location.pathname.replace(/\/$/, "/index.html");
    return path.endsWith("/") ? `${path}index.html` : path;
  }

  function storePendingSearch(link) {
    if (!input) return;
    const query = normalize(input.value);
    if (query.length < 2) return;
    sessionStorage.setItem(lastSearchKey, query);
    sessionStorage.setItem(storageKey, JSON.stringify({
      query,
      path: hrefPath(link.href),
      createdAt: Date.now(),
    }));
  }

  function restoreRecentSearch() {
    if (!input || normalize(input.value)) return;
    const query = normalize(sessionStorage.getItem(lastSearchKey) || "");
    if (query.length >= 2) {
      input.value = query;
    }
  }

  function markTextNode(node, terms, firstHit) {
    const text = node.nodeValue;
    const lower = text.toLowerCase();
    const matches = terms
      .filter((term) => term.length >= 2)
      .flatMap((term) => {
        const found = [];
        let index = lower.indexOf(term);
        while (index >= 0) {
          found.push({ index, length: term.length });
          index = lower.indexOf(term, index + term.length);
        }
        return found;
      })
      .sort((a, b) => a.index - b.index || b.length - a.length);

    const merged = [];
    matches.forEach((match) => {
      const last = merged[merged.length - 1];
      if (!last || match.index >= last.index + last.length) {
        merged.push(match);
      }
    });
    if (!merged.length) return firstHit;

    const fragment = document.createDocumentFragment();
    let cursor = 0;
    merged.forEach((match) => {
      if (match.index > cursor) {
        fragment.append(document.createTextNode(text.slice(cursor, match.index)));
      }
      const marker = document.createElement("mark");
      marker.className = "site-search-page-hit";
      marker.textContent = text.slice(match.index, match.index + match.length);
      fragment.append(marker);
      firstHit = firstHit || marker;
      cursor = match.index + match.length;
    });
    if (cursor < text.length) {
      fragment.append(document.createTextNode(text.slice(cursor)));
    }
    node.parentNode.replaceChild(fragment, node);
    return firstHit;
  }

  function highlightDestination() {
    let pending;
    try {
      pending = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch (_) {
      pending = null;
    }
    if (!pending) return;
    sessionStorage.removeItem(storageKey);
    if (!pending.query || !pending.path || Date.now() - pending.createdAt > 30000) return;
    if (pending.path !== currentPath()) return;

    const main = document.querySelector("main");
    if (!main) return;
    const terms = termsFor(pending.query);
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !normalize(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, mark, iframe, input, textarea, select, button")) {
          return NodeFilter.FILTER_REJECT;
        }
        const lower = node.nodeValue.toLowerCase();
        return terms.some((term) => term.length >= 2 && lower.includes(term))
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let firstHit = null;
    nodes.forEach((node) => {
      firstHit = markTextNode(node, terms, firstHit);
    });
    if (firstHit) {
      firstHit.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function makeSnippet(text, terms) {
    const lower = text.toLowerCase();
    const firstMatch = terms
      .map((term) => lower.indexOf(term))
      .filter((position) => position >= 0)
      .sort((a, b) => a - b)[0];
    const center = firstMatch >= 0 ? firstMatch : 0;
    const start = Math.max(0, center - 52);
    const end = Math.min(text.length, center + 112);
    const prefix = start > 0 ? "... " : "";
    const suffix = end < text.length ? " ..." : "";
    return `${prefix}${normalize(text.slice(start, end))}${suffix}`;
  }

  async function loadIndex() {
    if (!indexPromise) {
      indexPromise = Promise.all(pages.map(async (page) => {
        const response = await fetch(page.url, { cache: "force-cache" });
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        doc.querySelectorAll("script, style, header, footer, nav").forEach((node) => node.remove());
        doc.querySelectorAll(
          "button, .publication-filter-panel, .publication-facets, .project-controls, .news-filter-panel, .joining-language-tabs, .publication-actions"
        ).forEach((node) => node.remove());
        const heading = normalize(doc.querySelector("main h1")?.textContent || page.title);
        const text = normalize(doc.querySelector("main")?.textContent || doc.body.textContent || "");
        return {
          title: heading || page.title,
          url: page.url,
          text,
          haystack: `${heading} ${text}`.toLowerCase(),
        };
      })).catch(() => []);
    }
    return indexPromise;
  }

  function scoreDocument(document, terms, query) {
    let score = 0;
    const title = document.title.toLowerCase();
    if (title.includes(query)) score += 16;
    terms.forEach((term) => {
      if (title.includes(term)) score += 8;
      let position = document.haystack.indexOf(term);
      while (position >= 0) {
        score += 1;
        position = document.haystack.indexOf(term, position + term.length);
      }
    });
    return score;
  }

  function setActiveResult(nextIndex) {
    const items = Array.from(results.querySelectorAll(".site-search-result"));
    items.forEach((item) => item.classList.remove("is-active"));
    activeIndex = Math.max(-1, Math.min(nextIndex, items.length - 1));
    if (activeIndex >= 0) items[activeIndex].classList.add("is-active");
  }

  async function renderResults() {
    const query = normalize(input.value);
    if (query.length < 2) {
      results.hidden = true;
      results.innerHTML = "";
      activeIndex = -1;
      return;
    }

    results.hidden = false;
    results.innerHTML = '<div class="site-search-empty">Searching...</div>';
    const documents = await loadIndex();
    const terms = termsFor(query);
    const matches = documents
      .map((document) => ({ ...document, score: scoreDocument(document, terms, query.toLowerCase()) }))
      .filter((document) => document.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 7);

    if (!matches.length) {
      results.innerHTML = '<div class="site-search-empty">No results found.</div>';
      activeIndex = -1;
      return;
    }

    results.innerHTML = matches.map((match) => {
      const snippet = makeSnippet(match.text, terms);
      return `
        <a class="site-search-result" role="option" href="${match.url}">
          <span class="site-search-title">${highlight(match.title, terms)}</span>
          <span class="site-search-snippet">${highlight(snippet, terms)}</span>
        </a>
      `;
    }).join("");
    setActiveResult(-1);
  }

  highlightDestination();

  if (!form || !input || !results) return;

  restoreRecentSearch();

  input.addEventListener("input", () => {
    const query = normalize(input.value);
    if (query.length >= 2) sessionStorage.setItem(lastSearchKey, query);
    else sessionStorage.removeItem(lastSearchKey);
    renderResults();
  });
  input.addEventListener("focus", () => {
    renderResults();
  });

  input.addEventListener("keydown", (event) => {
    const items = Array.from(results.querySelectorAll(".site-search-result"));
    if (event.key === "Escape") {
      results.hidden = true;
      setActiveResult(-1);
    } else if (event.key === "ArrowDown" && items.length) {
      event.preventDefault();
      setActiveResult(activeIndex + 1);
    } else if (event.key === "ArrowUp" && items.length) {
      event.preventDefault();
      setActiveResult(activeIndex <= 0 ? items.length - 1 : activeIndex - 1);
    } else if (event.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
      event.preventDefault();
      items[activeIndex].click();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const first = results.querySelector(".site-search-result");
    if (first) {
      storePendingSearch(first);
      first.click();
    }
  });

  results.addEventListener("click", (event) => {
    const link = event.target.closest(".site-search-result");
    if (link) storePendingSearch(link);
  });

  document.addEventListener("click", (event) => {
    if (!form.contains(event.target)) {
      results.hidden = true;
      setActiveResult(-1);
    }
  });
})();
