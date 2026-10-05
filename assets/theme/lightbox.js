(() => {
  const images = "main img:not([data-lightbox='off']), .lab-logo-link img";
  let overlay;
  let overlayImage;
  let documentOverlay;
  let documentFrame;
  let carouselOverlay;
  let carouselImage;
  let carouselCaption;
  let carouselTitle;
  let carouselTrigger;
  let carouselIndex = 0;
  let carouselImages = [];
  let copyToast;
  let copyToastTimer;
  let previousFocus;

  const isImageHref = (href) => /\.(avif|gif|jpe?g|png|webp|svg)(\?.*)?$/i.test(href);

  const imageSource = (image) => {
    if (image.matches?.("a") && isImageHref(image.href)) {
      return image.href;
    }

    const link = image.closest("a");
    if (link && isImageHref(link.href)) {
      return link.href;
    }
    return image.currentSrc || image.src;
  };

  const closeLightbox = () => {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    overlayImage.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    if (previousFocus) previousFocus.focus();
  };

  const closeDocumentLightbox = () => {
    if (!documentOverlay || documentOverlay.hidden) return;
    documentOverlay.hidden = true;
    documentFrame.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    if (previousFocus) previousFocus.focus();
  };

  const closeCarouselLightbox = () => {
    if (!carouselOverlay || carouselOverlay.hidden) return;
    carouselOverlay.hidden = true;
    carouselImage.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    if (carouselTrigger) carouselTrigger.setAttribute("aria-expanded", "false");
    if (previousFocus) previousFocus.focus();
  };

  const updateCarouselLightbox = () => {
    if (!carouselImages.length) return;
    carouselImage.src = carouselImages[carouselIndex];
    carouselImage.alt = `${carouselTitle} image ${carouselIndex + 1}`;
    carouselCaption.textContent = `${carouselIndex + 1} / ${carouselImages.length}`;
  };

  const shiftCarouselLightbox = (step) => {
    carouselIndex = (carouselIndex + step + carouselImages.length) % carouselImages.length;
    updateCarouselLightbox();
  };

  const ensureCarouselLightbox = () => {
    if (carouselOverlay) return;

    carouselOverlay = document.createElement("div");
    carouselOverlay.className = "image-carousel-lightbox";
    carouselOverlay.hidden = true;
    carouselOverlay.setAttribute("role", "dialog");
    carouselOverlay.setAttribute("aria-modal", "true");

    const panel = document.createElement("div");
    panel.className = "image-carousel-panel";

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.className = "image-carousel-button";
    previousButton.textContent = "Prev";
    previousButton.setAttribute("aria-label", "Show previous image");
    previousButton.addEventListener("click", () => shiftCarouselLightbox(-1));

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "image-carousel-button";
    nextButton.textContent = "Next";
    nextButton.setAttribute("aria-label", "Show next image");
    nextButton.addEventListener("click", () => shiftCarouselLightbox(1));

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "image-carousel-close";
    closeButton.textContent = "x";
    closeButton.setAttribute("aria-label", "Close image carousel");
    closeButton.addEventListener("click", closeCarouselLightbox);

    const stage = document.createElement("div");
    stage.className = "image-carousel-stage";

    carouselImage = document.createElement("img");
    carouselCaption = document.createElement("div");
    carouselCaption.className = "image-carousel-caption";

    stage.append(carouselImage, carouselCaption);
    panel.append(previousButton, stage, nextButton, closeButton);
    carouselOverlay.append(panel);
    carouselOverlay.addEventListener("click", (event) => {
      if (event.target === carouselOverlay || event.target === carouselImage) closeCarouselLightbox();
    });
    document.body.append(carouselOverlay);
  };

  const openCarouselLightbox = (button, gallerySlides = null) => {
    ensureCarouselLightbox();
    if (!carouselOverlay.hidden && carouselTrigger === button) {
      closeCarouselLightbox();
      return;
    }

    carouselImages = gallerySlides
      ? gallerySlides.map((slide) => slide.href)
      : (button.dataset.carouselImages || "").split("|").filter(Boolean);
    if (!carouselImages.length) return;

    carouselOverlay.classList.toggle("gallery-image-lightbox", Boolean(gallerySlides));
    carouselTrigger = button;
    carouselTitle = gallerySlides
      ? button.closest("figure").querySelector(".gallery-caption-text")?.textContent.trim() || "Gallery"
      : button.dataset.carouselTitle || button.textContent.trim() || "Publication";
    carouselIndex = gallerySlides ? Math.max(0, gallerySlides.indexOf(button)) : 0;
    previousFocus = gallerySlides ? button : document.activeElement;
    carouselOverlay.setAttribute("aria-label", carouselTitle);
    updateCarouselLightbox();
    carouselOverlay.hidden = false;
    document.body.classList.add("lightbox-open");
    button.setAttribute("aria-expanded", "true");
    carouselOverlay.querySelector(".image-carousel-close").focus();
  };

  const openLightbox = (image) => {
    if (!overlay) {
      overlay = document.createElement("button");
      overlay.type = "button";
      overlay.className = "image-lightbox";
      overlay.hidden = true;
      overlay.setAttribute("aria-label", "Close image preview");

      overlayImage = document.createElement("img");
      overlay.append(overlayImage);
      overlay.addEventListener("click", closeLightbox);
      document.body.append(overlay);
    }

    previousFocus = document.activeElement;
    overlayImage.src = imageSource(image);
    overlayImage.alt = image.alt || image.textContent?.trim() || "";
    overlayImage.classList.toggle(
      "team-member-placeholder-preview",
      image.classList?.contains("team-member-placeholder")
    );
    overlay.hidden = false;
    document.body.classList.add("lightbox-open");
    overlay.focus();
  };

  const openDocumentLightbox = (link) => {
    if (!documentOverlay) {
      documentOverlay = document.createElement("div");
      documentOverlay.className = "document-lightbox";
      documentOverlay.hidden = true;

      const panel = document.createElement("div");
      panel.className = "document-lightbox-panel";

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "document-lightbox-close";
      closeButton.setAttribute("aria-label", "Close document preview");
      closeButton.textContent = "x";
      closeButton.addEventListener("click", closeDocumentLightbox);

      documentFrame = document.createElement("iframe");
      documentFrame.title = link.textContent.trim() || "Document preview";

      panel.append(closeButton, documentFrame);
      documentOverlay.append(panel);
      documentOverlay.addEventListener("click", (event) => {
        if (event.target === documentOverlay) closeDocumentLightbox();
      });
      document.body.append(documentOverlay);
    }

    previousFocus = document.activeElement;
    documentFrame.src = link.href;
    documentOverlay.hidden = false;
    document.body.classList.add("lightbox-open");
    documentOverlay.querySelector("button").focus();
  };

  const showCopyToast = (event) => {
    if (!copyToast) {
      copyToast = document.createElement("div");
      copyToast.className = "copy-toast";
      copyToast.setAttribute("role", "status");
      copyToast.setAttribute("aria-live", "polite");
      document.body.append(copyToast);
    }

    copyToast.textContent = "Mail copied!";
    copyToast.style.left = `${event.clientX}px`;
    copyToast.style.top = `${event.clientY}px`;
    copyToast.hidden = false;

    window.clearTimeout(copyToastTimer);
    copyToastTimer = window.setTimeout(() => {
      copyToast.hidden = true;
    }, 1000);
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  document.addEventListener("click", (event) => {
    const carouselButton = event.target.closest("[data-carousel-images]");
    if (carouselButton) {
      event.preventDefault();
      openCarouselLightbox(carouselButton);
      return;
    }

    const emailButton = event.target.closest(".member-email-link[data-email]");
    if (emailButton) {
      copyText(emailButton.dataset.email).then(() => showCopyToast(event));
      return;
    }

    const documentLink = event.target.closest("a[data-preview='document']");
    if (documentLink) {
      event.preventDefault();
      openDocumentLightbox(documentLink);
      return;
    }

    const gallerySlide = event.target.closest(".gallery-carousel-slide");
    if (gallerySlide) {
      event.preventDefault();
      const slides = Array.from(gallerySlide.closest(".gallery-carousel").querySelectorAll(".gallery-carousel-slide"));
      openCarouselLightbox(gallerySlide, slides);
      return;
    }

    const imageLink = event.target.closest("a[href]");
    if (imageLink && isImageHref(imageLink.href)) {
      event.preventDefault();
      openLightbox(imageLink.querySelector("img") || imageLink);
      return;
    }

    const logoLink = event.target.closest(".lab-logo-link");
    const figureLink = event.target.closest("a.publication-figure");
    const image = logoLink
      ? logoLink.querySelector("img")
      : figureLink
        ? figureLink.querySelector("img")
        : event.target.closest(images);
    if (!image) return;

    const link = logoLink || figureLink || image.closest("a");
    if (link && link.contains(image)) event.preventDefault();

    openLightbox(image);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
      closeDocumentLightbox();
      closeCarouselLightbox();
    } else if (carouselOverlay && !carouselOverlay.hidden && event.key === "ArrowLeft") {
      event.preventDefault();
      shiftCarouselLightbox(-1);
    } else if (carouselOverlay && !carouselOverlay.hidden && event.key === "ArrowRight") {
      event.preventDefault();
      shiftCarouselLightbox(1);
    }
  });
})();
