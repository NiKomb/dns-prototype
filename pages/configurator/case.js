// Case modal uses the same catalog card, facet, chip and selection components as other categories.
const caseModal = document.getElementById('case-modal');
caseModal.className = 'processor-modal power-modal case-modal';
catalogUI.mountModal(caseModal, {"title": "Корпуса", "countAttributes": {"class": "case-result-count"}, "countText": "", "closeAttributes": {"class": "processor-modal-close case-close", "type": "button", "aria-label": "Закрыть окно выбора корпуса"}, "filtersLabel": "Фильтры корпусов", "resultsLabel": "Список корпусов"},
  catalogUI.controlMarkup("filter-search", {}, {"input": {"class": "case-filter-search", "type": "search", "placeholder": "Поиск по фильтрам", "aria-label": "Поиск по фильтрам"}}) +
  catalogUI.controlMarkup("filter-panel", {}, "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "availability", "data-filter-id": "availability"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Наличие в магазинах"}) + "</h3>" +
    catalogUI.controlMarkup("store-select", {}, {"text": "В любом из 12 магазинов"}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "in-stock"}, {"input": {"type": "checkbox", "class": "case-in-stock", "checked": null}, "text": "В наличии", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-today"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: сегодня", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-tomorrow"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: завтра", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-later"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: позже", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "unavailable"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Отсутствующие в продаже", "wrapped": false, "hint": "", "shield": false})) + "\n" +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "compatible"}, {"input": {"class": "case-compatible", "type": "checkbox", "checked": null}, "text": "Совместимые товары", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "rating"}, {"input": {"class": "case-rating", "type": "checkbox"}, "text": "Рейтинг 4.5 и выше", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "reliable"}, {"input": {"class": "case-reliable", "type": "checkbox"}, "text": "Надёжные модели", "wrapped": true, "hint": "минимум обращений в сервис", "shield": true}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "has-review"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Есть обзор (0)", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "review-bonus"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Бонусы за отзыв (0)", "wrapped": true, "hint": "", "shield": false}) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "price-filter", "data-facet": "price"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Цена"}) + "</h3>" +
    catalogUI.controlMarkup("price-inputs", {}, {"inputs": [{"class": "case-min", "type": "text", "inputmode": "numeric", "aria-label": "Цена от", "placeholder": "от 1 250"}, {"class": "case-max", "type": "text", "inputmode": "numeric", "aria-label": "Цена до", "placeholder": "до 25 599"}]}) +
    catalogUI.controlMarkup("price-track", {}, {"handle": false}) +
    catalogUI.controlMarkup("catalog-options", {}, "") +
    catalogUI.controlMarkup("price-reset", {"type": "button"}, "Сбросить")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "brand-filter", "data-facet": "brand"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Бренд"}) + "</h3>" +
    catalogUI.controlMarkup("socket-search", {}, {"input": {"class": "case-brand-search", "type": "search", "placeholder": "Поиск", "aria-label": "Поиск по брендам"}}) +
    catalogUI.controlMarkup("catalog-options", {}, "")) + "<div class=\"case-facets\"></div><div class=\"all-filters-wrap\">" +
    catalogUI.controlMarkup("all-filters", {"type": "button"}, "Все фильтры") + "</div>"),
  catalogUI.controlMarkup("processor-toolbar", {}, catalogUI.controlMarkup("toolbar-main", {}, "<div class=\"power-quick-wrap\">" +
    catalogUI.controlMarkup("catalog-quick", {"class": "power-quick case-quick"}, "") +
    catalogUI.controlMarkup("power-quick-more", {"class": "case-quick-more", "type": "button", "aria-expanded": "false"}, "Показать ещё") + "</div>" +
    catalogUI.controlMarkup("toolbar-select", {"class": "sort-control"}, "<small>Сортировка:</small>" +
    catalogUI.controlMarkup("sort-trigger", {"class": "case-sort-trigger", "type": "button", "aria-expanded": "false"}, {"text": "Сначала популярные"}) +
    catalogUI.controlMarkup("sort-menu", {"class": "case-sort-menu", "role": "menu", "hidden": null}, catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "popular"}, "Сначала популярные") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-asc"}, "Сначала недорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-desc"}, "Сначала дорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "rating-desc"}, "Сначала с лучшей оценкой"))) +
    catalogUI.controlMarkup("toolbar-select", {}, "<small>Группировка:</small><span>Отсутствует <b>⌄</b></span>")) +
    (catalogUI.controlMarkup("compatible-chip", {"class": "case-compatible-chip", "type": "button"}, {"text": "Совместимые товары"}) + "<span class=\"case-active-chips\"></span>" +
    catalogUI.controlMarkup("reset-chip", {"class": "case-reset", "type": "button"}, "Сбросить фильтры"))) +
  "<div class=\"processor-products case-products\"></div>" +
  catalogUI.controlMarkup("products-empty", {"class": "case-empty", "hidden": null}, "В прототипе нет корпусов с такими параметрами"));
const caseRow = document.getElementById('case-row');
const casePanel = caseModal.querySelector('.filter-panel');
const caseList = caseModal.querySelector('.case-products');
const caseMoney = (value) => value == null ? '—' : `${value.toLocaleString('ru-RU')} ₽`;
const caseRanges = {
  price: [['До 3 000 ₽', 0, 3000], ['3 001 - 5 000 ₽', 3001, 5000], ['5 001 - 8 000 ₽', 5001, 8000], ['8 001 - 12 000 ₽', 8001, 12000], ['От 12 001 ₽', 12001, Infinity]],
  gpu: [['До 300 мм', 0, 300], ['301 - 350 мм', 301, 350], ['351 - 400 мм', 351, 400], ['От 401 мм', 401, Infinity]],
  cooler: [['До 150 мм', 0, 150], ['151 - 170 мм', 151, 170], ['От 171 мм', 171, Infinity]]
};
const caseFacetDefinitions = [
  ['Форм-фактор совместимых плат', 'forms', ['Mini-ITX', 'Micro-ATX', 'Standard-ATX', 'E-ATX', 'Mini-DTX', 'SSI-CEB', 'SSI-EEB']],
  ['Типоразмер корпуса', 'size', ['Mid-Tower', 'Mini-Tower', 'Full-Tower']],
  ['Основной цвет', 'color', ['черный', 'белый']],
  ['Вентиляторы в комплекте', 'fans', [...new Set(cases.map(item=>item.fans))]],
  ['Размещение блока питания', 'psu', [...new Set(['нижнее', 'верхнее', 'за материнской платой', ...cases.map(item=>item.psu)])]],
  ['Максимальная длина устанавливаемой видеокарты (мм)', 'gpu', caseRanges.gpu.map((range) => range[0])],
  ['Материал окна', 'window', ['закаленное стекло', 'нет']],
  ['Тип подсветки', 'lighting', ['нет', 'ARGB', 'FRGB']],
  ['Дополнительные характеристики', 'features', ['Аквариумы', 'Игровые', 'Продуваемые (Mesh)', 'С подсветкой', 'Подходит для установки СЖО', 'С дисплеем', 'С вертикальным расположением видеокарты', 'С блоком питания', 'Type-C', 'SFF', 'Back-Connect', 'USB 3.2', 'RGB']],
  ['Максимальная высота процессорного кулера (мм)', 'cooler', caseRanges.cooler.map((range) => range[0])]
];
for(const [,facet,options] of caseFacetDefinitions) if(!['gpu','cooler'].includes(facet)) {
  options.push(...[...new Set(cases.flatMap(item=>item[facet]==null ? [] : Array.isArray(item[facet]) ? item[facet] : [String(item[facet])]))].filter(value=>!options.includes(value)));
}
for (const [title, facet, options] of caseFacetDefinitions) caseModal.querySelector('.case-facets').append(catalogUI.facetSection(title, facet, options));
for (const [facet, options] of [['brand', [...new Set(cases.map((item) => item.brand))].sort()], ['price', caseRanges.price.map((range) => range[0])]]) {
  const container = casePanel.querySelector(`[data-facet="${facet}"] .catalog-options`);
  options.forEach((value, index) => {
    const label = catalogUI.filterOption();
    label.dataset.value = facet === 'price' ? String(index) : value;
    label.querySelector('span').textContent = value;
    container.append(label);
  });
}
const caseQuick = caseModal.querySelector('.case-quick');
const quickEntries = catalogTags.case.filter(([, facet, value]) => cases.some((item) =>
  Array.isArray(item[facet]) ? item[facet].includes(value) : String(item[facet]) === value));
quickEntries.forEach(([title, facet, value], index) => {
  const button = catalogUI.quickTagButton({text:title, key:`${facet}:${value}`});
  caseQuick.append(button);
});
const caseCardCollection = catalogUI.deferredCards(cases, (item) => {
  const card = catalogUI.productCard(catalogUI.categoryCardData(item, 'case'));
  card.classList.add('case-product');
  card.querySelector('.product-image>img').onerror = () => {card.querySelector('.product-image>img').src = 'assets/configurator/12AYWCT9HB3G0WM7V0YQQ57H79.svg';};
  return card;
});
const caseCards = caseCardCollection.cards;
const caseById = new Map(cases.map((item) => [item.id, item]));
const caseCardById = caseCardCollection.byId;
let caseSort = 'popular';
const readCaseFilters = catalogUI.createFilterReader(caseModal, {
  inStock: '.case-in-stock',
  compatible: '.case-compatible',
  rating: '.case-rating',
  reliable: '.case-reliable',
  query: '.case-filter-search',
  min: '.case-min',
  max: '.case-max',
});
let caseFilterState;
const selectedCaseFacet = (facet) => caseFilterState.facets.get(facet) || [];
const caseCompatibleWithBuild = (item) => {
  const board = window.configuratorState.motherboard;
  const power = window.configuratorState.powerSupply;
  return catalogUI.caseFitsBoard(item, board) && catalogUI.caseFitsPower(item, power) && catalogUI.gpuFitsCase(window.configuratorState.gpu, item);
};
function caseFacetHas(item, facet, value) {
  if (facet === 'forms') return item.forms?.includes(value) ?? false;
  if (facet === 'features') return item.features?.includes(value) ?? false;
  if (facet === 'gpu' || facet === 'cooler') return item[facet]!=null && item[facet] >= caseRanges[facet].find((range) => range[0] === value)[1] && item[facet] <= caseRanges[facet].find((range) => range[0] === value)[2];
  if (facet === 'price') return item.price != null && item.price >= caseRanges.price[Number(value)][1] && item.price <= caseRanges.price[Number(value)][2];
  return String(item[facet]) === value;
}
function caseMatches(item, skip = '') {
  if (!caseFilterState.controls.inStock.checked) return false;
  if (skip !== 'compatible' && caseFilterState.controls.compatible.checked && !caseCompatibleWithBuild(item)) return false;
  if (skip !== 'rating' && caseFilterState.controls.rating.checked && item.rating < 4.5) return false;
  if (skip !== 'reliable' && caseFilterState.controls.reliable.checked && !item.reliable) return false;
  const query = caseFilterState.controls.query.productQuery || '';
  if (query && !item.name.toLocaleLowerCase('ru').includes(query)) return false;
  for (const facet of ['brand', 'price', ...caseFacetDefinitions.map((entry) => entry[1])]) {
    if (facet === skip) continue;
    const values = selectedCaseFacet(facet);
    if (values.length && !values.some((value) => caseFacetHas(item, facet, value))) return false;
  }
  if (item.price == null) return !caseFilterState.controls.min.value.trim() && !caseFilterState.controls.max.value.trim() && (skip === 'price' || !selectedCaseFacet('price').length);
  const min = Number(caseFilterState.controls.min.value.replace(/\D/g, '')) || 0;
  const max = Number(caseFilterState.controls.max.value.replace(/\D/g, '')) || Infinity;
  return item.price != null && item.price >= min && item.price <= max;
}
function caseCountWord(count) {const n = count % 10, h = count % 100; return n === 1 && h !== 11 ? 'товар' : n >= 2 && n <= 4 && (h < 12 || h > 14) ? 'товара' : 'товаров';}
const updateCaseArticles = articleSelection.bindModal(caseModal, 'case', caseFacetHas);
function renderCases() {
  catalogUI.bindPriceRange(caseModal, Math.min(...cases.filter(item => item.price != null).map(item => item.price)), Math.max(...cases.filter(item => item.price != null).map(item => item.price)));
  caseCardCollection.ensure();
  caseFilterState = readCaseFilters();
  const visible = cases.filter((item) => caseMatches(item));
  updateCaseArticles(visible, {compatible: caseFilterState.controls.compatible.checked, facets: caseFilterState.facets});
  visible.sort((a, b) => caseSort === 'price-asc' ? catalogUI.comparePrice(a,b) : caseSort === 'price-desc' ? catalogUI.comparePrice(a,b,true) : caseSort === 'rating-desc' ? b.rating - a.rating : a.order - b.order);
  caseList.replaceChildren(...visible.map((item) => caseCardById.get(item.id)));
  catalogUI.syncCards(caseCards, {selected: window.configuratorState.computerCase, otherSocket: null});
  caseCards.forEach((card) => card.classList.toggle('is-alternative-socket', !caseCompatibleWithBuild(caseById.get(card.dataset.productId))));
  caseModal.querySelector('.case-result-count').textContent = `${visible.length} ${caseCountWord(visible.length)}`;
  caseModal.querySelector('.case-empty').hidden = visible.length > 0;
  caseModal.querySelector('.case-compatible-chip').hidden = !caseModal.querySelector('.case-compatible').checked;
  casePanel.querySelector('.case-compatible').nextElementSibling.textContent = `Совместимые товары (${cases.filter((item) => caseMatches(item, 'compatible') && caseCompatibleWithBuild(item)).length})`;
  casePanel.querySelector('.case-rating').nextElementSibling.textContent = `Рейтинг 4.5 и выше (${cases.filter((item) => caseMatches(item, 'rating') && item.rating >= 4.5).length})`;
  catalogUI.setFilterLabel(casePanel.querySelector('.case-reliable').closest('label'), `Надёжные модели (${cases.filter((item) => caseMatches(item, 'reliable') && item.reliable).length})`);
  for (const section of casePanel.querySelectorAll('[data-facet]')) {
    const facet = section.dataset.facet;
    section.querySelectorAll('label').forEach((label) => {
      const count = cases.filter((item) => caseMatches(item, facet) && caseFacetHas(item, facet, label.dataset.value)).length;
      const input = label.querySelector('input');
      label.querySelector('span').textContent = `${facet === 'price' ? caseRanges.price[Number(label.dataset.value)][0] : label.dataset.value} (${count})`;
      input.disabled = count === 0 && !input.checked;
      label.classList.toggle('is-unavailable', input.disabled);
    });
  }
  const active = quickEntries.filter(([, facet, value]) => selectedCaseFacet(facet).includes(value)).map(([, facet, value]) => `${facet}:${value}`);
  catalogUI.syncQuickTags(caseQuick, active);
  caseQuick.querySelectorAll('[data-quick]').forEach((button) => {
    const [facet, value] = button.dataset.quick.split(':');
    const input = [...casePanel.querySelectorAll(`[data-facet="${facet}"] label`)].find((label) => label.dataset.value === value)?.querySelector('input');
    button.disabled = !input || input.disabled;
  });
  const chips = caseModal.querySelector('.case-active-chips'); chips.replaceChildren();
  for (const section of casePanel.querySelectorAll('[data-facet]')) for (const label of section.querySelectorAll('label')) if (label.querySelector('input').checked) {
    const title = section.querySelector('.filter-heading').textContent.trim();
    chips.append(catalogUI.chip(`${title}: ${label.dataset.value}`, () => {label.querySelector('input').checked = false; renderCases();}));
  }
  catalogUI.refresh(caseList, caseModal);
  updateCaseStatus();
}
casePanel.addEventListener('change', renderCases);
casePanel.querySelectorAll('.filter-heading').forEach(button=>catalogUI.bindFacetDisclosure(button.closest('.filter-section')));
caseModal.querySelector('.case-compatible-chip').addEventListener('click', () => {caseModal.querySelector('.case-compatible').checked = false; renderCases();});
caseModal.querySelector('.case-reset').addEventListener('click', () => {casePanel.querySelectorAll('[data-facet] input[type=checkbox]').forEach((input) => input.checked = false); casePanel.querySelector('.case-compatible').checked = false; casePanel.querySelector('.case-rating').checked = false; casePanel.querySelector('.case-reliable').checked = false; casePanel.querySelector('.case-in-stock').checked = true; caseModal.querySelectorAll('.case-min,.case-max').forEach((input) => input.value = ''); renderCases();});
caseModal.querySelector('.price-reset').addEventListener('click', () => {casePanel.querySelectorAll('[data-facet=price] input').forEach((input) => input.checked = false); caseModal.querySelectorAll('.case-min,.case-max').forEach((input) => input.value = ''); renderCases();});
caseModal.querySelectorAll('.case-min,.case-max').forEach((input) => input.addEventListener('input', () => {input.value = input.value.replace(/\D/g, ''); renderCases();}));
catalogUI.bindFilterSearch(caseModal.querySelector('.case-filter-search'),casePanel);
caseModal.querySelector('.case-brand-search').addEventListener('input', (event) => {const query = event.target.value.trim().toLocaleLowerCase('ru'); casePanel.querySelectorAll('[data-facet=brand] label').forEach((label) => label.hidden = !!query && !label.textContent.toLocaleLowerCase('ru').includes(query));});
caseModal.querySelector('.all-filters').addEventListener('click', () => {casePanel.querySelectorAll('.filter-section').forEach((section) => {section.classList.remove('is-collapsed'); section.querySelector('.filter-heading').setAttribute('aria-expanded', 'true');}); caseModal.querySelector('.processor-filters').scrollTo({top: 0, behavior: 'smooth'});});
caseQuick.addEventListener('click', (event) => {const button = event.target.closest('[data-quick]'); if (!button) return; const [facet, value] = button.dataset.quick.split(':'); const input = [...casePanel.querySelectorAll(`[data-facet="${facet}"] label`)].find((label) => label.dataset.value === value)?.querySelector('input'); if (input && !input.disabled) {input.checked = !input.checked; renderCases();}});
catalogUI.bindQuickMore(caseModal.querySelector('.case-quick-more'), caseQuick);
const caseSortTrigger = caseModal.querySelector('.case-sort-trigger'), caseSortMenu = caseModal.querySelector('.case-sort-menu');
catalogUI.bindSort(caseSortTrigger, caseSortMenu, value => {caseSort = value; renderCases();});
function openCaseModal() {catalogUI.openModal(caseModal); renderCases();}
function closeCaseModal() {catalogUI.closeModal(caseModal, caseRow.querySelector('#add-case,.case-replace'));}
caseModal.querySelector('.case-close').addEventListener('click', closeCaseModal);
document.addEventListener('keydown', (event) => {if (event.key === 'Escape' && !caseModal.hidden) {if (!caseSortMenu.hidden) {caseSortMenu.hidden = true; caseSortTrigger.setAttribute('aria-expanded', 'false');} else closeCaseModal();}});
function updateCaseStatus() {const status=caseRow.querySelector('.selected-status');if(!status)return;const selected=caseById.get(window.configuratorState.computerCase?.id);catalogUI.updateFitStatus(status,catalogUI.combineFit(catalogUI.caseBoardFit(selected,window.configuratorState.motherboard),catalogUI.casePowerFit(selected,window.configuratorState.powerSupply),catalogUI.gpuCaseFit(window.configuratorState.gpu,selected)));}
function addCase(item, shouldClose = true) {
  buildView.select('computerCase', item);
  if (shouldClose) closeCaseModal();
}
catalogUI.bindActions(caseList, (card) => addCase(caseById.get(card.dataset.productId)), item=>addCase(item, false));
window.addEventListener('configurator:state-changed', () => { if (!caseModal.hidden) renderCases(); else updateCaseStatus(); });

catalogLoader.register('case', openCaseModal);
