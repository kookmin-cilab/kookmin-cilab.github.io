(() => {
  const redirectLegacyTalk = () => {
    if (location.hash !== "#invited-talks" && !/^#talk-\d+$/.test(location.hash)) return false;
    location.replace("talks.html" + (location.hash === "#invited-talks" ? "" : location.hash));
    return true;
  };
  window.addEventListener("hashchange", redirectLegacyTalk);
  if (redirectLegacyTalk()) return;
  const yearGroups = Array.from(document.querySelectorAll(".teaching-year-group"));
  const toggleAllButton = document.querySelector(".teaching-toggle-all");
  const yearTocLinks = Array.from(document.querySelectorAll(".teaching-toc [data-teaching-target-year]"));

  if (!yearGroups.length || !toggleAllButton) return;

  const syncToggleAllButton = () => {
    const allYearsOpen = yearGroups.every((group) => group.open);
    toggleAllButton.textContent = allYearsOpen ? "Collapse all years" : "Expand all years";
    toggleAllButton.setAttribute("aria-expanded", String(allYearsOpen));
  };

  toggleAllButton.addEventListener("click", () => {
    const shouldOpen = !yearGroups.every((group) => group.open);
    yearGroups.forEach((group) => {
      group.open = shouldOpen;
    });
    syncToggleAllButton();
  });

  yearGroups.forEach((group) => {
    group.addEventListener("toggle", syncToggleAllButton);
  });

  yearTocLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetYear = link.dataset.teachingTargetYear;
      const targetGroup = yearGroups.find((group) => group.dataset.teachingYear === targetYear);

      if (targetGroup) {
        targetGroup.open = true;
      }
    });
  });

  const revealHashYear = () => {
    const target = document.getElementById(location.hash.slice(1));
    const group = target && target.closest(".teaching-year-group");
    if (group) group.open = true;
  };
  window.addEventListener("hashchange", revealHashYear);
  revealHashYear();
  syncToggleAllButton();
})();
