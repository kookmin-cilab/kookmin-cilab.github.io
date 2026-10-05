(() => {
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

  syncToggleAllButton();
})();
