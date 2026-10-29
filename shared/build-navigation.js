// Read-only display projection. The configurator's ID store remains authoritative.
export const buildSnapshotKey = 'dns-prototype-build-navigation-v1';
export const buildSelectionKey = 'dns-prototype-configurator-v2';
export const prototypeBase = new URL('../', import.meta.url);

export function localBuildImage(value) {
  if (typeof value !== 'string' || !value) return '';
  try {
    const url = new URL(value, prototypeBase);
    return url.origin === prototypeBase.origin && url.pathname.startsWith(`${prototypeBase.pathname}assets/configurator/`) ? url.href : '';
  } catch { return ''; }
}

export function configuratorHref(categoryId, opensCatalog = true) {
  const url = new URL('index.html', prototypeBase);
  const source = new URL(location.href);
  const comparisonReturn = source.searchParams.get('comparisonReturn');
  if (source.searchParams.get('from') === 'configurator' && comparisonReturn) url.searchParams.set('comparisonReturn', comparisonReturn);
  if (categoryId && opensCatalog) url.searchParams.set('openCatalog', categoryId);
  else if (categoryId) url.hash = categoryId;
  return url.href;
}

export function saveBuildSnapshot(state, categories, presentation) {
  const categoriesView = Object.entries(presentation).map(([rowId, appearance]) => {
    const id = rowId.replace(/-row$/, '');
    const config = categories[id];
    const item = config ? state[config.key] : null;
    return {
      id, key: config?.key || rowId, opensCatalog: Boolean(config), title: appearance.title, image: localBuildImage(appearance.image),
      selected: item ? {id: item.id, name: item.name, price: Number.isFinite(item.price) ? item.price : null, image: localBuildImage(item.image)} : null
    };
  });
  try { localStorage.setItem(buildSnapshotKey, JSON.stringify({version: 1, categories: categoriesView})); }
  catch { /* Storage restrictions must never interrupt selection or navigation. */ }
}

export function readBuildSnapshot() {
  try {
    const snapshot = JSON.parse(localStorage.getItem(buildSnapshotKey));
    const selection = JSON.parse(localStorage.getItem(buildSelectionKey)) || {};
    if (snapshot?.version !== 1 || !Array.isArray(snapshot.categories)) return [];
    return snapshot.categories.filter(item => item && typeof item.id === 'string' && /^[a-z][a-z0-9-]*$/.test(item.id) && typeof item.key === 'string' && typeof item.title === 'string').map(item => {
      const selected = item.selected?.id === selection[item.key] && typeof item.selected?.name === 'string' ? item.selected : null;
      return {...item, image: localBuildImage(item.image), selected: selected ? {...selected, image: localBuildImage(selected.image)} : null};
    });
  } catch { return []; }
}
