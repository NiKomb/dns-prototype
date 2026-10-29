// Reveal each secondary section once, when page scrolling brings it into view.
// Without JS/IntersectionObserver the ordinary document stays fully accessible.
(() => {
  document.querySelectorAll('img[data-image-src]').forEach(image => {
    prototypeImages.defer(image, image.dataset.imageSrc, {srcset:image.dataset.imageSrcset, sizes:image.dataset.imageSizes});
    delete image.dataset.imageSrc; delete image.dataset.imageSrcset; delete image.dataset.imageSizes;
  });
  if (typeof IntersectionObserver !== 'function') return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('is-awaiting-viewport');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0});
  document.querySelectorAll('[data-scroll-reveal]').forEach((section) => {
    section.classList.add('is-awaiting-viewport');
    observer.observe(section);
  });
})();
