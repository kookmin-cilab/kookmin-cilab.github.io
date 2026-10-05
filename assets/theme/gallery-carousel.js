(() => {
  const carousels = document.querySelectorAll(".gallery-carousel");

  const advanceCarousels = [];

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".gallery-carousel-slide"));
    const counter = carousel.querySelector(".gallery-carousel-count");
    const previous = carousel.querySelector(".gallery-carousel-prev");
    const next = carousel.querySelector(".gallery-carousel-next");
    if (slides.length === 0) return;

    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

    const show = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
    };

    if (previous) previous.addEventListener("click", () => show(index - 1));
    if (next) next.addEventListener("click", () => show(index + 1));
    show(index);
    if (slides.length > 1) advanceCarousels.push(() => show(index + 1));
  });

  // A shared timer keeps every carousel on the same three-second cadence.
  if (advanceCarousels.length > 0) {
    window.setInterval(() => {
      if (document.hidden || document.body.classList.contains("lightbox-open")) return;
      advanceCarousels.forEach((advance) => advance());
    }, 3000);
  }
})();
