(() => {
  const carousels = document.querySelectorAll(".gallery-carousel");

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
  });
})();
