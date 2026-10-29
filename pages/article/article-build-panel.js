import {createBuildPanel} from '../../shared/article/build-panel.js';
import {readBuildSnapshot, buildSnapshotKey, buildSelectionKey} from '../../shared/build-navigation.js';

export function mountArticleBuildPanel(root) {
  const url = new URL(location.href);
  const categories = readBuildSnapshot();
  if (url.searchParams.get('from') !== 'configurator' || !categories.length) return () => {};
  const slot = document.createElement('div');
  slot.className = 'club-build-panel-slot';
  const panel = createBuildPanel({categories, currentCategory: url.searchParams.get('category')});
  slot.append(panel.element);
  root.insertBefore(slot, root.querySelector('.club-main'));
  let compact = null;
  function updateScrolled() {
    const next = window.scrollY > 0;
    if (next === compact) return;
    compact = next;
    slot.classList.toggle('is-compact', compact);
  }
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, {passive: true});
  function update(event) {
    if (event.type === 'pageshow') updateScrolled();
    if (event.type === 'storage' && event.key !== null && ![buildSnapshotKey, buildSelectionKey].includes(event.key)) return;
    const categories = readBuildSnapshot();
    if (categories.length) panel.update(categories);
  }
  window.addEventListener('storage', update);
  window.addEventListener('pageshow', update);
  return () => {
    window.removeEventListener('scroll', updateScrolled);
    window.removeEventListener('storage', update);
    window.removeEventListener('pageshow', update);
    panel.destroy(); slot.remove();
  };
}
