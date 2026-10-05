(function () {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-navigation");
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  if (!button || !nav) return;

  function setOpen(open) {
    document.body.classList.toggle("nav-menu-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  button.addEventListener("click", () => {
    setOpen(!document.body.classList.contains("nav-menu-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a") && mobileQuery.matches) setOpen(false);
  });

  function syncMode() {
    if (!mobileQuery.matches) setOpen(false);
  }

  if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncMode);
  else mobileQuery.addListener(syncMode);
  syncMode();
})();
