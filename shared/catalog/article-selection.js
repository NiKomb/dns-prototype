// Use the category's final result set and its existing facet adapter.
const articleSelection = (() => {
  function select(articles, categoryId, products, hasFacet, {modal = false} = {}) {
    const isGeneral = article => modal && article.alwaysInModalCategoryIds?.includes(categoryId);
    const ids = new Set(products.map(product => product.id));
    const matched = articles.filter(article => article.status === 'ready' && article.topicCategoryIds.includes(categoryId) && (
      isGeneral(article) ||
      article.relations.some(relation => relation.categoryId === categoryId && ids.has(relation.productId)) ||
      article.characteristicRelations.some(relation => relation.categoryId === categoryId && relation.conditions.length > 0 && products.some(product =>
        relation.conditions.every(condition => condition.values.length > 0 && condition.values.some(value => hasFacet(product, condition.facet, value)))
      ))
    ));
    return [...new Map(matched.map(article => [article.articleId, article])).values()].sort((a,b) => {
      if (Boolean(isGeneral(a)) !== Boolean(isGeneral(b))) return isGeneral(a) ? 1 : -1;
      if (a.views !== b.views) return a.views == null ? 1 : b.views == null ? -1 : b.views - a.views;
      return a.articleId < b.articleId ? -1 : a.articleId > b.articleId ? 1 : 0;
    });
  }
  function firstReason(article, categoryId, products, hasFacet) {
    for (const relation of article.relations) {
      const product = products.find(item => relation.categoryId === categoryId && item.id === relation.productId);
      if (product) return product.name.replace(/^Процессор /, '').replace(/\s+(OEM|BOX)$/, '');
    }
    for (const relation of article.characteristicRelations) {
      if (relation.categoryId !== categoryId || !relation.conditions.length) continue;
      const product = products.find(item => relation.conditions.every(condition => condition.values.some(value => hasFacet(item, condition.facet, value))));
      if (product) return relation.conditions.map(condition => {
        const value = condition.values.find(value => hasFacet(product, condition.facet, value));
        return value === 'amd' ? 'AMD' : value === 'intel' ? 'Intel' : value;
      }).join(' · ');
    }
    return '';
  }
  // Only selected thematic facets can explain an article; price and service filters
  // still narrow products upstream, but do not imply editorial coverage.
  function filterReason(article, categoryId, products, hasFacet, facets, label = (facet, value) => String(value)) {
    for (const [facet, values] of facets) {
      if (facet === 'price') continue;
      for (const value of values) {
        const matching = products.filter(product => hasFacet(product, facet, value));
        const modelMatch = article.relations.some(relation => relation.categoryId === categoryId && matching.some(product => product.id === relation.productId));
        const characteristicMatch = article.characteristicRelations.some(relation => relation.categoryId === categoryId &&
          // The filter and the audited article conditions must match the same
          // result product; the filter need not itself be an article condition.
          relation.conditions.length > 0 &&
          matching.some(product => relation.conditions.every(condition => condition.values.some(candidate => hasFacet(product, condition.facet, candidate)))));
        if (modelMatch || characteristicMatch) return value === 'amd' ? 'AMD' : value === 'intel' ? 'Intel' : label(facet, value);
      }
    }
    return '';
  }
  function cards(articles, categoryId, products, hasFacet, previewCount = 0, state = {compatible: true, facets: new Map()}) {
    const matched = select(articles, categoryId, products, hasFacet, {modal: true}).flatMap(article => {
      if (article.alwaysInModalCategoryIds?.includes(categoryId)) return [{...article, reason: ''}];
      const reason = filterReason(article, categoryId, products, hasFacet, state.facets, state.label);
      return reason || state.compatible ? [{...article, reason: reason || firstReason(article, categoryId, products, hasFacet)}] : [];
    });
    // Temporary visual repeats only: original article IDs, links and selection stay intact.
    return matched.some(article => article.alwaysInModalCategoryIds?.includes(categoryId)) ? matched : matched.length && previewCount ? Array.from({length: previewCount}, (_, index) => matched[index % matched.length]) : matched;
  }
  // Shared lifecycle for every catalogue modal. Reuse the carousel if selection is unchanged.
  function bindModal(modal, categoryId, hasFacet, label) {
    let strip = catalogUI.component('articleStrip');
    modal.querySelector('.processor-products').before(strip);
    let key = '', latest, registry;
    const update = (products, state) => {
      latest = [products,state];
      if (modal.hidden) return;
      if (typeof catalogArticles === 'undefined') {
        if (!registry) registry = catalogLoader.script('pages/configurator/data/article-data.js').then(() => update(...latest)).catch(error => {registry=null;console.warn('Article registry can be retried',error);});
        return;
      }
      const articles = cards(catalogArticles, categoryId, products, hasFacet, 9, {...state, label});
      const offer={article_ids:[...new Set(articles.map(a=>a.articleId))],product_ids:products.map(p=>p.id).sort(),compatible:Boolean(state.compatible)};
      const nextKey = JSON.stringify(articles.map(article => [article.articleId, article.reason]));
      if (nextKey === key) {strip.dataset.telemetryOffer=JSON.stringify(offer);return;}
      const next = catalogUI.component('articleStrip', {articles, configuratorCategory: modal.id.replace(/-modal$/, '')});
      next.dataset.telemetryOffer=JSON.stringify(offer);
      prototypeImages.release(strip);
      strip.replaceWith(next);
      strip = next;
      key = nextKey;
    };
    return update;
  }
  function forBuild(articles, state, hasFacet, candidates = {}) {
    const categories = [['cpu','processor'],['motherboard','motherboard'],['powerSupply','powerSupply'],['case','computerCase'],['gpu','gpu']];
    const general = article => article.alwaysInModalCategoryIds?.length > 0;
    const ready = articles.filter(article => article.status === 'ready');
    const sort = items => [...new Map(items.map(article => [article.articleId, article])).values()].sort((a,b) => {
      if (a.views !== b.views) return a.views == null ? 1 : b.views == null ? -1 : b.views - a.views;
      return a.articleId < b.articleId ? -1 : a.articleId > b.articleId ? 1 : 0;
    });
    const common = ready.filter(general);
    if (!categories.some(([, key]) => state[key])) return sort(common).slice(0,7);
    const selectedArticles = new Set();
    for (const [category, key] of categories) {
      if (state[key]) {
        for (const article of select(ready, category, [state[key]], hasFacet)) selectedArticles.add(article.articleId);
      }
    }
    const pools = categories.filter(([, key]) => !state[key]).map(([category]) => {
      // Canonical compatible candidates come from the caller, never modal results.
      const targeted = select(ready, category, candidates[category] || [], hasFacet)
        .filter(article => !general(article) && !selectedArticles.has(article.articleId));
      return sort(targeted);
    });
    // Reserve up to three unique targeted leaders; a shared leader gets one card.
    const leaders = sort(pools.filter(pool => pool.length).map(pool => pool[0])).slice(0,3);
    const chosen = new Map(leaders.map(article => [article.articleId, article]));
    for (const article of sort([...pools.flat(), ...common])) {
      if (chosen.size >= 7) break;
      chosen.set(article.articleId, article);
    }
    return sort([...chosen.values()]).slice(0,7);
  }
  return {select, firstReason, filterReason, cards, bindModal, forBuild};
})();
