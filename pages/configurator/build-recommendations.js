(() => {
  const articleHost = document.getElementById('build-articles-host');
  const pickers = new Map();
  let active = null;
  let restoring = true;
  buildView.restore().then(() => { restoring = false; }, () => { restoring = false; });
  function sync(picker) {
    const button = picker.row.querySelector('.build-board-toggle');
    button?.setAttribute('aria-expanded', String(!!picker.strip && !picker.strip.hidden));
    button?.setAttribute('aria-controls', `quick-picker-${picker.id}`);
  }
  function close() {
    active = null;
    for (const picker of pickers.values()) { if (picker.strip) picker.strip.hidden = true; sync(picker); }
  }
  function render(picker) {
    if (!picker.products) return;
    if (picker.strip) { picker.strip.destroy(); prototypeImages.release(picker.strip); picker.strip.remove(); }
    const products = catalogUI.quickPickerItems(picker.id, picker.products, buildStore.state);
    picker.strip = catalogUI.component('boardSuggestions', {category:picker.id, products, onSelect(item) {
      if (buildStore.state[picker.key] || !catalogUI.quickPickerItems(picker.id, [item], buildStore.state).length) return;
      close(); buildView.select(picker.key, item);
      picker.row.querySelector(`.${picker.kind}-replace`)?.focus({preventScroll:true});
    }});
    picker.strip.id = `quick-picker-${picker.id}`;
    picker.strip.hidden = active !== picker || !!buildStore.state[picker.key] || !products.length;
    picker.anchor.append(picker.strip); sync(picker);
  }
  async function load(picker) {
    if (!picker.pending) picker.pending = Promise.all([catalogLoader.data(picker.id), buildView.restore()]).then(([items]) => {
      picker.products = items; render(picker); return items;
    }).catch(error => {
      picker.pending = null;
      if (active === picker) close();
      console.warn('Quick picker can be retried', error);
      return null;
    });
    return picker.pending;
  }
  for (const [id, config] of Object.entries(catalogLoader.categories)) {
    const row = document.getElementById(`${id}-row`);
    const anchor = document.createElement('div'); anchor.className = 'build-board-anchor';
    row.before(anchor); anchor.append(row);
    const picker = {id, key:config.key, kind:config.kind, row, anchor}; pickers.set(id,picker);
    catalogUI.bindQuickPickerToggle({root:anchor,trigger:()=>row.querySelector('.build-board-toggle'),isOpen:()=>active===picker,
      close,open(){
        close();
        if(buildStore.state[picker.key]||document.querySelector('.processor-modal:not([hidden])'))return;
        active=picker;if(picker.products)render(picker);else void load(picker);
      }});
    row.addEventListener('click',event=>{if(event.target.closest(`#add-${id}`))close();});
    sync(picker);
  }
  let articlesKey = '', articlesRequest = 0;
  async function renderArticles() {
    const request = ++articlesRequest;
    try {
      await Promise.all([buildView.restore(), catalogLoader.script('shared/catalog/article-selection.js'), catalogLoader.script('pages/configurator/data/article-data.js')]);
      if (request !== articlesRequest) return;
      const state = {...buildStore.state};
      const candidates = {};
      const hasSelection = Object.values(state).some(Boolean);
      // Saved selections are compact; article facets come from catalog objects.
      await Promise.all(Object.entries(catalogLoader.categories).map(async ([id, config]) => {
        if (!hasSelection) return;
        const products = await catalogLoader.data(id);
        if (state[config.key]) state[config.key] = products.find(item => item.id === state[config.key].id) || state[config.key];
        else candidates[({processor:'cpu','power-supply':'powerSupply'}[id] || id)] = products;
      }));
      for (const [id, config] of Object.entries(catalogLoader.categories)) {
        const category = {processor:'cpu','power-supply':'powerSupply'}[id] || id;
        if (candidates[category]) candidates[category] = catalogUI.quickPickerItems(id, candidates[category], state);
      }
      if (request !== articlesRequest) return;
      const articles = articleSelection.forBuild(catalogArticles, state, (item, facet, value) => {
        return productContract.has(item, facet, value);
      }, candidates);
      const productIds = Object.values(state).filter(Boolean).map(item => item.id);
      const key = JSON.stringify(articles.map(article => article.articleId));
      if (key === articlesKey && articleHost.firstElementChild) {
        articleHost.firstElementChild.dataset.telemetryOffer = JSON.stringify({article_ids:articles.map(article=>article.articleId),product_ids:productIds.sort(),compatible:true});
        return;
      }
      articleHost.firstElementChild?.destroy();
      prototypeImages.release(articleHost);
      articleHost.replaceChildren(catalogUI.component('buildArticles', {articles, productIds}));
      articlesKey = key;
    } catch (error) { console.warn('Build articles can be retried', error); }
  }
  buildStore.subscribe(() => {
    // Restoration publishes before awaiting picker loads resume. Keep the user's
    // pending request unless that category has itself been restored as selected.
    if (!restoring || (active && buildStore.state[active.key])) close();
    for (const picker of pickers.values()) render(picker);
    renderArticles();
  });
  // Quick-picker preload is independent of the article registry and its candidate loads.
  void load(pickers.get('motherboard'));
  void renderArticles();
})();
