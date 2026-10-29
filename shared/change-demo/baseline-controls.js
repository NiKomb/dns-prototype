// Reuse the existing library factories for the supplied before-change references.
// No alternate card markup, data or new component variants are introduced.
export function beforeComponents(scope) {
  const mounted = new Set(), toggles = new Map();
  let mode = 'visible';
  function apply(next) {
    mode = next;
    for (const toggle of scope.querySelectorAll('.build-board-toggle')) {
      if (!toggles.has(toggle)) toggles.set(toggle, toggle.hidden);
      const hidden = mode === 'hidden' || toggles.get(toggle);
      if (toggle.hidden !== hidden) toggle.hidden = hidden;
    }
    for (const toggle of toggles.keys()) if (!toggle.isConnected) toggles.delete(toggle);
  }
  function sync() {
    if (typeof catalogUI === 'undefined') return;
    for (const card of scope.querySelectorAll('.processor-modal .processor-product')) {
      const meta = card.querySelector('.product-meta'), button = card.querySelector('.catalog-compare-icon');
      if (!meta || !button || meta.querySelector('.catalog-compare') || typeof catalogLoader === 'undefined') continue;
      const category = catalogLoader.categories[button.dataset.category];
      const product = category?.items().find(item => item.id === card.dataset.productId);
      if (!product) continue;
      const compare = catalogUI.component('compare', {product, comparisonContext:card.comparisonContext});
      compare.classList.add('change-demo-before'); meta.prepend(compare); mounted.add(compare);
    }
    const sidebar = scope.querySelector('.side-area');
    if (sidebar && catalogUI.components.appBanner && !sidebar.querySelector('[data-ds-component="catalog.appBanner"]')) {
      const banner = catalogUI.component('appBanner'); banner.classList.add('change-demo-before'); sidebar.append(banner); mounted.add(banner);
      for (const image of banner.querySelectorAll('img[data-image-src]')) prototypeImages.defer(image, image.dataset.imageSrc);
    }
    for (const element of mounted) if (!element.isConnected) mounted.delete(element);
    apply(mode);
  }
  return {sync, apply, destroy() {for (const [toggle, hidden] of toggles) toggle.hidden = hidden; toggles.clear();for (const element of mounted) {globalThis.prototypeImages?.release(element); element.remove();} mounted.clear();}};
}
