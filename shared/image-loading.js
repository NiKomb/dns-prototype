// Shared by the configurator, articles and the component library (including Shadow DOM).
// Clip-aware observation also respects scrolling lists and the lightbox thumbnail rail.
(() => {
  if (globalThis.prototypeImages) return;
  const pending = new WeakMap();
  const viewportPending = new Set();
  const observeEntries = entries => {
    for (const entry of entries) if (entry.isIntersecting) load(entry.target);
  };
  const canObserve = typeof IntersectionObserver === 'function';
  const observer = canObserve ? new IntersectionObserver(observeEntries, {rootMargin: '120px 0px', threshold: 0}) : null;
  let viewportHeight = document.documentElement.clientHeight || innerHeight;
  let viewportObserver;
  function updateViewportObserver() {
    if (!canObserve) return;
    viewportObserver?.disconnect();
    viewportObserver = new IntersectionObserver(observeEntries, {rootMargin: `${viewportHeight * 2}px 0px`, threshold: 0});
    viewportPending.forEach(image => viewportObserver.observe(image));
  }
  if (canObserve) addEventListener('resize', () => {
    const height = document.documentElement.clientHeight || innerHeight;
    if (height === viewportHeight) return;
    viewportHeight = height;
    if (viewportObserver) updateViewportObserver();
  }, {passive: true});
  function load(image) {
    const source = pending.get(image);
    if (!source) return;
    pending.delete(image); observer?.unobserve(image); viewportObserver?.unobserve(image);
    viewportPending.delete(image);
    // Once the article threshold is reached, native lazy loading must not defer the request again.
    if (source.ahead === 'viewport' && canObserve) image.loading = 'eager';
    image.removeAttribute('data-image-pending');
    if (source.sizes) image.sizes = source.sizes;
    if (source.srcset) image.srcset = source.srcset;
    image.src = source.src;
  }
  function defer(image, src, {srcset, sizes, eager = false, ahead = 'default'} = {}) {
    image.decoding = 'async';
    image.loading = eager ? 'eager' : 'lazy';
    pending.set(image, {src, srcset, sizes, ahead});
    if (eager || !observer) load(image);
    else {
      image.setAttribute('data-image-pending', '');
      if (ahead === 'viewport') {
        if (!viewportObserver) updateViewportObserver();
        viewportPending.add(image); viewportObserver.observe(image);
      } else observer.observe(image);
    }
    return image;
  }
  function release(root) {
    root.querySelectorAll('img[data-image-pending]').forEach(image => { observer?.unobserve(image); viewportObserver?.unobserve(image); viewportPending.delete(image); pending.delete(image); });
  }
  // Explicit consumers (decoding audits, print) can request every image in a root.
  function loadAll(root = document) { root.querySelectorAll('img[data-image-pending]').forEach(load); }
  addEventListener('beforeprint', () => loadAll());
  globalThis.prototypeImages = Object.freeze({defer, load, loadAll, release});
})();
