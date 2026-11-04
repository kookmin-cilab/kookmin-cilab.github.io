(function () {
  const header = document.querySelector(".site-header");
  const institution = document.querySelector(".institution-bar");
  const menu = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  let preserveHashAlignment = false;
  if (!header || !institution || !nav) return;

  function setHeaderMetrics() {
    document.documentElement.style.setProperty("--sticky-utility-height", `${institution.offsetHeight}px`);
    document.documentElement.style.setProperty("--sticky-nav-height", `${nav.offsetHeight + (menu?.offsetHeight || 0)}px`);
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
    const threshold = institution.offsetHeight;
    const compact = window.scrollY >= threshold || preserveHashAlignment;
    document.body.classList.toggle("header-compact-sticky", compact);
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
