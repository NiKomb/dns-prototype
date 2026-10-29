// One mutation boundary for selection, restoration, persistence and notifications.
const buildStore = (() => {
  const keys = ['processor', 'motherboard', 'powerSupply', 'computerCase', 'gpu'];
  const storageKey = 'dns-prototype-configurator-v2';
  const legacyKey = 'dns-prototype-configurator-v1';
  const saved = catalogUI.read(catalogUI.hasSaved(storageKey) ? storageKey : legacyKey);
  const savedSelection = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : null;
  const selections = Object.fromEntries(keys.map(key => [key, null]));
  // Stable read-only view: consumers cannot bypass persistence by assigning a slot.
  const state = Object.freeze(Object.defineProperties({}, Object.fromEntries(keys.map(key => [key, {
    enumerable: true, get: () => selections[key]
  }]))));
  const listeners = new Set();
  let restoring = true;
  let batchDepth = 0;
  let dirty = false;

  let previousBuild = {};
  const telemetryBuild = () => Object.fromEntries(keys.map(key => [({processor:'processor',motherboard:'board',powerSupply:'power',computerCase:'case',gpu:'gpu'})[key], selections[key] ? {id:selections[key].id,name:selections[key].name,price:selections[key].price ?? null} : null]));
  function publish(isRestore = false) {
    if (restoring || batchDepth || !dirty) return;
    dirty = false;
    catalogUI.save(storageKey, Object.fromEntries(keys.map(key => [key, selections[key]?.id || null])));
    for (const listener of listeners) listener(state);
    window.dispatchEvent(new CustomEvent('configurator:state-changed', {detail: state}));
    const build = telemetryBuild();
    if (window.__studyInstalled) window.dispatchEvent(new CustomEvent('prototype:telemetry', {detail:{type:'build.state',build,previous:previousBuild,restoring:isRestore}}));
    previousBuild = build;
  }

  function setSelection(key, item) {
    if (!keys.includes(key)) throw new Error(`Unknown build category: ${key}`);
    if (item !== null && (!item || typeof item.id !== 'string' || !item.id)) throw new Error('Selection requires a product ID');
    selections[key] = item === null ? null : Object.isFrozen(item) ? item : Object.freeze({...item});
    dirty = true;
    publish();
  }

  function batch(update) {
    batchDepth++;
    try { update(); }
    finally { batchDepth--; publish(); }
  }

  function finishRestore() {
    if (!restoring) return;
    restoring = false;
    dirty = true;
    publish(true);
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  window.configuratorState = state;
  return Object.freeze({state, savedSelection, setSelection, batch, finishRestore, subscribe});
})();
