(function () {
  const header = document.querySelector(".site-header");
  const institution = document.querySelector(".institution-bar");
  const lab = document.querySelector(".lab-header");
  const nav = document.querySelector(".primary-nav");
  const wordmark = document.querySelector(".cilab-wordmark");
  const wordmarkText = wordmark && wordmark.querySelector("span");
  let preserveHashAlignment = false;
  if (!header || !institution || !lab || !nav) return;

  function setHeaderMetrics() {
    document.documentElement.style.setProperty("--sticky-utility-height", `${institution.offsetHeight}px`);
    document.documentElement.style.setProperty("--sticky-nav-height", `${nav.offsetHeight}px`);
  }

  function getHashTarget() {
    if (!window.location.hash) return null;
    try {
      return document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    } catch (_error) {
      return null;
    }
  }

  function updateCompactHeader() {
    setHeaderMetrics();
    const threshold = institution.offsetHeight + lab.offsetHeight;
    const compact = window.scrollY >= threshold || preserveHashAlignment;
    document.body.classList.toggle("header-compact-sticky", compact);
    if (wordmark && wordmarkText) {
      wordmark.href = compact ? wordmark.dataset.compactHref : wordmark.dataset.defaultHref;
      wordmarkText.textContent = compact ? wordmark.dataset.compactLabel : wordmark.dataset.defaultLabel;
      wordmark.setAttribute("aria-label", wordmarkText.textContent);
      if (compact || new URL(wordmark.href).origin === window.location.origin) {
        wordmark.removeAttribute("target");
        wordmark.removeAttribute("rel");
      } else {
        wordmark.setAttribute("target", "_blank");
        wordmark.setAttribute("rel", "noopener noreferrer");
      }
    }
  }

  function alignHashTarget() {
    const target = getHashTarget();
    if (!target) {
      preserveHashAlignment = false;
      updateCompactHeader();
      return;
    }

    preserveHashAlignment = true;

    requestAnimationFrame(() => {
      updateCompactHeader();
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start" });
      });
    });
  }

  function releaseHashAlignment() {
    preserveHashAlignment = false;
  }

  window.addEventListener("scroll", updateCompactHeader, { passive: true });
  window.addEventListener("resize", updateCompactHeader);
  window.addEventListener("hashchange", alignHashTarget);
  window.addEventListener("pageshow", alignHashTarget);
  window.addEventListener("wheel", releaseHashAlignment, { passive: true });
  window.addEventListener("touchstart", releaseHashAlignment, { passive: true });
  window.addEventListener("pointerdown", releaseHashAlignment, { passive: true });
  window.addEventListener("keydown", releaseHashAlignment);
  updateCompactHeader();

  if (document.readyState === "complete") {
    alignHashTarget();
  } else {
    window.addEventListener("load", alignHashTarget, { once: true });
  }
})();
