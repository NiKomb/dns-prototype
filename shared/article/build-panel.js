import {element} from './article-components.js?v=20260929-cpu-comparisons';
import {configuratorHref, localBuildImage} from '../build-navigation.js';

// The article and library use the same rendering and category paging behavior.
export function createBuildPanel({categories, currentCategory = 'processor'}) {
  const panel = element('nav', 'club-build-panel');
  panel.dataset.dsComponent = 'article.buildPanel';panel.dataset.telemetryPlacement='article.buildPanel';
  panel.setAttribute('aria-label', 'Ваша сборка ПК');
  const overview = element('a', 'club-build-overview');
  overview.href = configuratorHref(); overview.dataset.telemetryId='panel.overview';overview.dataset.telemetryMethod='panel';
  overview.append(element('span', 'club-build-back'), element('span', '', 'В конфигуратор'));
  overview.firstChild.setAttribute('aria-hidden', 'true');
  overview.setAttribute('aria-label', 'Открыть обзор всей сборки в конфигураторе');
  const summary = element('div', 'club-build-summary');
  const priceBlock = element('div', 'club-build-price-block');
  const price = element('strong', 'club-build-price');
  const monthly = element('span', 'club-build-monthly');
  priceBlock.setAttribute('aria-label', 'Стоимость сборки');
  priceBlock.append(price, monthly);
  summary.append(priceBlock, overview);
  const track = element('div', 'club-build-track');track.dataset.telemetryScroll='article.categories';
  const next = element('button', 'club-build-next');
  next.type = 'button';
  next.setAttribute('aria-label', 'Листать категории сборки');
  next.append(element('span', 'club-build-chevron'));
  next.firstChild.setAttribute('aria-hidden', 'true');
  const previous = next.cloneNode(true);
  previous.className = 'club-build-previous'; previous.dataset.telemetryId='panel.previous';next.dataset.telemetryId='panel.next';
  previous.hidden = true;
  previous.setAttribute('aria-label', 'Предыдущие категории сборки');
  const strip = element('div', 'club-build-strip');
  strip.append(track, previous, next);
  panel.append(summary, strip);
  let items = categories;
  let start = Math.max(0, categories.findIndex(item => item.id === currentCategory));

  const positions = () => [...track.children].map(tile => tile.offsetLeft - track.firstElementChild.offsetLeft);
  function nearestIndex(left) {
    const offsets = positions();
    return offsets.reduce((best, offset, index) => Math.abs(offset - left) < Math.abs(offsets[best] - left) ? index : best, 0);
  }
  let animationFrame = 0;
  function stopAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    track.style.scrollSnapType = '';
  }
  function animateScroll(target) {
    stopAnimation();
    const from = track.scrollLeft;
    const to = Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth));
    const began = performance.now();
    track.style.scrollSnapType = 'none';
    // Match the article-card carousel: 300 ms with smoothstep easing.
    const frame = now => {
      if (!track.isConnected) { stopAnimation(); return; }
      const progress = Math.min(1, (now - began) / 300);
      const eased = progress * progress * (3 - 2 * progress);
      track.scrollLeft = from + (to - from) * eased;
      if (progress < 1) animationFrame = requestAnimationFrame(frame);
      else stopAnimation();
    };
    animationFrame = requestAnimationFrame(frame);
  }
  track.addEventListener('wheel', stopAnimation, {passive: true});
  let drag = null, suppressClick = false;
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('pointerdown', event => {
    stopAnimation();
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    suppressClick = false; track.dataset.telemetryDragSuppressed='false';
    if (track.scrollWidth <= track.clientWidth + 1) return;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, left: track.scrollLeft, moved: false};
  });
  track.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
      drag.moved = true;track.dataset.telemetryDragSuppressed='true';
      track.setPointerCapture(event.pointerId);
      track.classList.add('is-dragging');
    }
    if (drag.moved) { event.preventDefault(); track.scrollLeft = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, drag.left - dx)); }
  });
  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    suppressClick = drag.moved;
    drag = null;
    start = nearestIndex(track.scrollLeft);
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
  }
  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('lostpointercapture', finishDrag);
  track.addEventListener('pointerleave', event => { if (drag && !drag.moved) finishDrag(event); });
  track.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); suppressClick = false; track.dataset.telemetryDragSuppressed='false'; }
  }, true);
  function updateArrows() {
    const hadFocus = previous.getRootNode().activeElement === previous;
    previous.hidden = next.hidden || track.scrollLeft <= 1;
    if (previous.hidden && hadFocus) {
      (next.hidden ? overview : next).focus({preventScroll: true});
    }
  }
  track.addEventListener('scroll', updateArrows, {passive: true});
  function layout() {
    if (drag) finishDrag({pointerId: drag.id});
    stopAnimation();
    if (!track.clientWidth || !items.length) return;
    start = Math.min(start, items.length - 1);
    const offsets = positions();
    const currentIndex = Math.max(0, items.findIndex(item => item.id === currentCategory));
    const last = track.lastElementChild;
    const contentWidth = offsets[offsets.length - 1] + last.offsetWidth;
    // A wide strip may fit every tile. Keep enough trailing space to place
    // the article's category at the start instead of clamping scrollLeft to 0.
    track.style.paddingInlineEnd = `${Math.max(0, track.clientWidth + offsets[currentIndex] - contentWidth)}px`;
    window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.programmatic',element:track,position:positions()[start]}}));
    track.scrollLeft = positions()[start];
    next.hidden = track.scrollWidth <= track.clientWidth + 1;
    track.classList.toggle('is-scrollable', !next.hidden);
    updateArrows();
  }
  function render() {
    const selected = items.map(item => item.selected).filter(Boolean);
    const unknownPrice = selected.some(item => !Number.isFinite(item.price));
    const total = selected.reduce((sum, item) => sum + (item.price || 0), 0);
    price.textContent = unknownPrice ? '—' : `${total.toLocaleString('ru-RU')} ₽`;
    monthly.hidden = unknownPrice || selected.length === 0;
    monthly.textContent = unknownPrice ? '' : `от ${Math.round(total * .0975).toLocaleString('ru-RU')} ₽/ мес.`;
    const tiles = items.map(item => {
      const tile = element('a', 'club-build-category');
      tile.href = configuratorHref(item.id, item.opensCatalog !== false);
      const actionLabel = item.selected ? 'Заменить' : 'Добавить';
      tile.setAttribute('aria-label', `${actionLabel}: ${item.title}${item.selected ? '. ' + item.selected.name : ''}. ${item.opensCatalog === false ? 'Открыть категорию' : 'Открыть выбор'} в конфигураторе`);
      tile.title = item.selected?.name || item.title;
      tile.dataset.categoryId = item.id; tile.dataset.returnCategory=item.opensCatalog!==false?item.id:'';tile.dataset.telemetryId='panel.category';tile.dataset.telemetryMethod='panel';tile.dataset.telemetryAction=item.opensCatalog===false?'open_row':item.selected?'open_replace':'open_add';
      if (item.id === currentCategory) tile.classList.add('is-current');
      const visual = element('span', 'club-build-visual');
      const photo = element('img', 'club-build-photo');
      photo.alt = '';
      if (!item.selected) photo.classList.add('is-category-icon');
      photo.loading = 'lazy'; photo.decoding = 'async';
      const source = localBuildImage(item.selected?.image || item.image);
      if (source) photo.src = source;
      else photo.hidden = true;
      const label = item.selected
        ? (Number.isFinite(item.selected.price) ? `${item.selected.price.toLocaleString('ru-RU')} ₽` : '—')
        : item.title;
      const title = element('span', 'club-build-title', label);
      if (item.selected) tile.dataset.productId = item.selected.id;
      visual.append(photo);
      tile.append(visual, title);
      return tile;
    });
    track.replaceChildren(...tiles);
    layout();
  }
  for (const [button, direction] of [[previous, -1], [next, 1]]) {
    button.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.user',element:track}}));
      if (button.hidden) return;
      const offsets = positions();
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      const position = animationFrame ? Math.min(offsets[start], max) : track.scrollLeft;
      const page = Math.max(1, track.clientWidth - 40);
      if (direction > 0) {
        if (position >= max - 1) start = 0;
        else {
          start = nearestIndex(position);
          for (let i = start + 1; i < offsets.length && offsets[i] <= position + page; i++) start = i;
          if (offsets[start] <= position + 1) start = Math.min(start + 1, offsets.length - 1);
        }
      } else {
        start = offsets.findIndex(offset => offset >= Math.max(0, position - page));
        if (offsets[start] >= position - 1) start = Math.max(0, start - 1);
      }
      animateScroll(offsets[start]);
    });
  }
  render();
  let layoutFrame = 0;
  const scheduleLayout = () => {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(() => { layoutFrame = 0; layout(); });
  };
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleLayout) : null;
  if (resize) resize.observe(track);
  else window.addEventListener('resize', scheduleLayout);
  scheduleLayout();
  return {
    element: panel,
    update(categories) { items = categories; render(); },
    destroy() { if (drag) finishDrag({pointerId: drag.id}); stopAnimation(); resize?.disconnect(); cancelAnimationFrame(layoutFrame); window.removeEventListener('resize', scheduleLayout); }
  };
}
