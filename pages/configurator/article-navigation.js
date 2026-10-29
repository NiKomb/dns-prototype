import {hosting} from '../../shared/telemetry/hosting.js';
import {saveBuildSnapshot, buildSelectionKey} from '../../shared/build-navigation.js';

async function initializeArticleNavigation() {
  const storageNamespace=window.__studyRoute?(await hosting()).storageNamespace:null;
  const snapshot = () => saveBuildSnapshot(buildStore.state, catalogLoader.categories, catalogUI.configuratorCategories);
  const url = new URL(location.href);
  let returnId = url.searchParams.get('comparisonReturn') || history.state?.comparisonReturn;
  let resetRevision = 0;
  const comparisonKey = () => 'dns-prototype-comparison-v1:' + returnId;
  const attemptId = () => storageNamespace?catalogUI.read(storageNamespace+'-session')?.id||null:null;
  const saveComparison = (state = catalogUI.snapshotComparison()) => {
    if (returnId && comparisonReady) catalogUI.save(comparisonKey(), {attemptId:attemptId(),state}, true);
  };
  const pending = returnId ? catalogUI.read(comparisonKey(), true) : null;
  let comparisonReady = !pending;
  url.searchParams.delete('comparisonReturn');
  history.replaceState({...history.state, comparisonReturn:returnId}, '', url);
  window.addEventListener('configurator:study-reset', () => {
    resetRevision++;
    comparisonReady = true;
    if (returnId) catalogUI.save(comparisonKey(), null, true);
    returnId = null;
    history.replaceState({...history.state, comparisonReturn:null}, '', location.href);
    catalogUI.resetComparison();
  });
  buildStore.subscribe(snapshot);
  // Restoration can finish before this deferred module. Capture an already
  // restored build, but never retry a failed restoration merely to draw a panel.
  const saved = catalogUI.read(catalogUI.hasSaved(buildSelectionKey) ? buildSelectionKey : 'dns-prototype-configurator-v1') || {};
  if (Object.entries(saved).every(([key, value]) => !value || value === buildStore.state[key]?.id)) snapshot();

  // All ready articles share the build panel. Resolve their links from the same
  // registry that supplied the modal cards, including when hosted in a subdirectory.
  function markArticleLink(event) {
    const anchor = event.target.closest('a[href]');
    const modal = anchor?.closest('.processor-modal');
    const sidebar = anchor?.closest('#build-articles-host');
    if (!modal && !sidebar) return;
    const url = new URL(anchor.href);
    const categoryId = modal ? modal.id.replace(/-modal$/, '') : url.searchParams.get('category');
    if (!Object.hasOwn(catalogLoader.categories, categoryId)) return;
    if (url.origin !== location.origin || typeof catalogArticles === 'undefined') return;
    const article = catalogArticles.find(item => item.status === 'ready' && url.pathname.endsWith(item.localPath));
    if (!article) return;
    snapshot();
    returnId ||= [...crypto.getRandomValues(new Uint32Array(4))].map(value => value.toString(16)).join('-');
    comparisonReady = true;
    // Reuse the project's guarded save/read helpers, scoped to this tab and
    // navigation entry. Build selection keeps its existing independent key.
    saveComparison();
    history.replaceState({...history.state, comparisonReturn:returnId}, '', location.href);
    url.searchParams.set('from', 'configurator');
    url.searchParams.set('category', categoryId);
    url.searchParams.set('comparisonReturn', returnId);
    anchor.href = url.href;
  }
  document.addEventListener('click', markArticleLink, true);
  document.addEventListener('auxclick', markArticleLink, true);
  document.addEventListener('contextmenu', markArticleLink, true);
  // The early shared handler supplies a snapshot before the study closes its
  // modal; preserve edits made before a history transition to the article too.
  window.addEventListener('configurator:before-leave', event => saveComparison(event.detail));

  const categoryId = url.searchParams.get('openCatalog');
  url.searchParams.delete('openCatalog');
  history.replaceState(history.state, '', url);
  async function resumeComparison(saved) {
    if (!saved || saved.attemptId !== attemptId()) return;
    const revision = resetRevision;
    const current = () => revision === resetRevision && saved.attemptId === attemptId();
    try {
      const view = await catalogUI.restoreComparison(saved.state, async id => {
        await catalogLoader.load(id);
        return catalogLoader.data(id);
      }, current);
      if (current()) comparisonReady = true;
      if (!current() || !view || categoryId && categoryId !== view.catalog) return;
      await catalogLoader.open(view.catalog, {initialFocus:'dialog'});
      if (current()) document.getElementById(`${view.catalog}-modal`)?.restoreComparison(view);
    } catch (error) {
      // Keep the saved IDs for a subsequent navigation/reload retry.
      console.warn('Comparison restoration will retry on return', error);
    }
  }
  window.addEventListener('pageshow', event => {
    if (event.persisted && returnId) void resumeComparison(catalogUI.read(comparisonKey(), true));
  });
  await resumeComparison(pending);
  if (!categoryId || resetRevision) return;
  if (!Object.hasOwn(catalogLoader.categories, categoryId)) return;
  // Reuse the early-interaction loader: its shell, cancellation and retry paths.
  // Focus a real trigger so Escape returns focus to the matching build row.
  document.querySelector(`#${categoryId}-row button[aria-haspopup="dialog"]`)?.focus({preventScroll: true});
  void catalogLoader.open(categoryId, {initialFocus: 'dialog'});
}

if (document.readyState === 'complete') initializeArticleNavigation();
else document.addEventListener('DOMContentLoaded', initializeArticleNavigation, {once: true});
