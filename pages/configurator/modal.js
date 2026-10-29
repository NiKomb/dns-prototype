const addProcessorButton = document.getElementById('add-processor');
const processorRow = document.getElementById('processor-row');
const processorModal = document.getElementById('processor-modal');
catalogUI.mountModal(processorModal, {"title": "Процессоры", "countAttributes": {"id": "processor-result-count"}, "countText": "29 товаров", "closeAttributes": {"class": "processor-modal-close", "type": "button", "aria-label": "Закрыть окно выбора процессора"}, "filtersLabel": "Фильтры процессоров", "resultsLabel": "Список процессоров"},
  "\n          " +
  catalogUI.controlMarkup("filter-search", {}, {"input": {"type": "search", "id": "filter-search", "placeholder": "Поиск по фильтрам", "aria-label": "Поиск по фильтрам"}}) +
  "\n          " +
  catalogUI.controlMarkup("filter-panel", {}, "\n            " +
    catalogUI.component('availabilityGroup').outerHTML + "\n            " +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "compatible"}, {"input": {"type": "checkbox", "checked": null}, "text": "Совместимые товары (19)", "wrapped": false, "hint": "", "shield": false}) + "\n            " +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "rating"}, {"input": {"type": "checkbox"}, "text": "Рейтинг 4.5 и выше (19)", "wrapped": false, "hint": "", "shield": false}) + "\n            " +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "reliable"}, {"input": {"type": "checkbox"}, "text": "Надёжные модели (19)", "wrapped": true, "hint": "минимум обращений в сервис", "shield": true}) + "\n            " +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "has-review"}, {"input": {"type": "checkbox"}, "text": "Есть обзор (0)", "wrapped": false, "hint": "", "shield": false}) + "\n            " +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "review-bonus"}, {"input": {"type": "checkbox"}, "text": "Бонусы за отзыв (0)", "wrapped": false, "hint": "", "shield": false}) + "\n            " +
    catalogUI.controlMarkup("filter-section", {"class": "price-filter", "data-filter-id": "price"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Цена"}) + "</h3>" +
    catalogUI.controlMarkup("price-inputs", {}, {"inputs": [{"type": "text", "inputmode": "numeric", "value": "от 9 399", "aria-label": "Цена от"}, {"type": "text", "inputmode": "numeric", "value": "до 67 299", "aria-label": "Цена до"}]}) +
    catalogUI.controlMarkup("price-track", {}, {"handle": true}) +
    catalogUI.controlMarkup("filter-option", {"data-value": "under-4000"}, {"input": {"type": "checkbox"}, "text": "Менее 4 000 ₽ (0)", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-value": "4001-6000"}, {"input": {"type": "checkbox"}, "text": "4 001 - 6 000 ₽ (0)", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-value": "6001-10000"}, {"input": {"type": "checkbox"}, "text": "6 001 - 10 000 ₽ (1)", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-value": "10001-18000"}, {"input": {"type": "checkbox"}, "text": "10 001 - 18 000 ₽ (9)", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-value": "18001-35000"}, {"input": {"type": "checkbox"}, "text": "18 001 - 35 000 ₽ (7)", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-value": "above-35000"}, {"input": {"type": "checkbox"}, "text": "35 001 ₽ и более (2)", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("price-reset", {"type": "button"}, "Сбросить")) + "\n            " +
    catalogUI.controlMarkup("filter-section", {"class": "brand-filter", "data-filter-id": "brand"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Бренд"}) + "</h3>" +
    catalogUI.controlMarkup("filter-option", {"data-value": "AMD"}, {"input": {"type": "checkbox"}, "text": "AMD (12)", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-value": "Intel"}, {"input": {"type": "checkbox"}, "text": "Intel (7)", "wrapped": false, "hint": "", "shield": false})) + "\n            " +
    catalogUI.component('socketGroup').outerHTML + "\n            <p class=\"filter-empty\" hidden>Ничего не найдено</p>\n            <div class=\"all-filters-wrap\">" +
    catalogUI.controlMarkup("all-filters", {"type": "button"}, "Все фильтры") + "</div>\n          ") +
  "\n        ",
  "\n          " +
  catalogUI.controlMarkup("processor-toolbar", {}, "\n            " +
    catalogUI.controlMarkup("toolbar-main", {}, "<div class=\"product-search\"><span>Поиск по комплектующим</span></div>" +
    catalogUI.controlMarkup("toolbar-select", {"class": "sort-control"}, "<small>Сортировка:</small>" +
    catalogUI.controlMarkup("sort-trigger", {"id": "processor-sort", "type": "button", "aria-haspopup": "menu", "aria-expanded": "false"}, {"text": "Сначала популярные"}) +
    catalogUI.controlMarkup("sort-menu", {"role": "menu", "hidden": null}, catalogUI.controlMarkup("sort-option", {"type": "button", "role": "menuitemradio", "aria-checked": "false", "data-sort": "price-asc"}, "Сначала недорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "role": "menuitemradio", "aria-checked": "false", "data-sort": "price-desc"}, "Сначала дорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "role": "menuitemradio", "aria-checked": "true", "data-sort": "popular"}, "Сначала популярные") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "role": "menuitemradio", "aria-checked": "false", "data-sort": "newest"}, "По новинкам") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "role": "menuitemradio", "aria-checked": "false", "data-sort": "reviews-desc"}, "По количеству отзывов") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "role": "menuitemradio", "aria-checked": "false", "data-sort": "rating-desc"}, "Сначала с лучшей оценкой"))) +
    catalogUI.controlMarkup("toolbar-select", {}, "<small>Группировка:</small><span>Отсутствует <b>⌄</b></span>")) + "\n            " +
    (catalogUI.controlMarkup("compatible-chip", {"type": "button"}, {"text": "Совместимые товары"}) + "<span id=\"active-filter-chips\"></span>" +
    catalogUI.controlMarkup("reset-chip", {"type": "button"}, "Сбросить фильтры")) + "\n          ") +
  "\n          <div class=\"processor-products\"></div>\n        ");
const updateProcessorArticles = articleSelection.bindModal(processorModal, 'cpu', processorFilters.has, processorFilters.label);
const closeProcessorButton = processorModal.querySelector('.processor-modal-close');
function openProcessorModal() {
  processorCardCollection.ensure();
  syncProcessorButtons();
  catalogUI.openModal(processorModal);
  applyFilters();
}

function closeProcessorModal() {
  catalogUI.closeModal(processorModal, processorRow.querySelector('#add-processor, .processor-replace') || addProcessorButton);
}


closeProcessorButton.addEventListener('click', closeProcessorModal);
document.addEventListener('keydown', (event) => {
  if (!processorModal.hidden && event.key === 'Escape' && processorModal.querySelector('.sort-menu').hidden) closeProcessorModal();
});

const filterSidebar = processorModal.querySelector('.processor-filters');
const filterPanel = processorModal.querySelector('.filter-panel');
const filterSearch = processorModal.querySelector('#filter-search');
const filterEmpty = processorModal.querySelector('.filter-empty');
const socketSearch = processorModal.querySelector('#socket-search');
const socketLabels = [...processorModal.querySelectorAll('.socket-options label')];
const showAllSockets = processorModal.querySelector('.filter-more');

const setSectionExpanded=catalogUI.setSectionExpanded;

processorModal.querySelectorAll('.filter-heading').forEach(button=>catalogUI.bindFacetDisclosure(button.closest('.filter-section')));

catalogUI.bindFilterSearch(filterSearch,filterPanel,{selector:':scope > .filter-section, :scope > .filter-line, :scope > .filter-collapsed',empty:filterEmpty});

const {syncSocketSelectAll, updateSocketVisibility} = catalogUI.bindSocketList(processorModal.querySelector('.socket-filter'), applyFilters);

processorModal.querySelector('.price-reset').addEventListener('click', () => {
  processorModal.querySelectorAll('.price-filter input[type="checkbox"]').forEach((input) => { input.checked = false; });
  const [minPrice, maxPrice] = processorModal.querySelectorAll('.price-inputs input');
  minPrice.value = '';
  maxPrice.value = '';
  applyFilters();
});

catalogUI.bindAllFilters(processorModal.querySelector('.all-filters'),{search:filterSearch,panel:filterPanel,sidebar:filterSidebar});

const compatibilityCheckbox = filterPanel.querySelector('.filter-line input[type="checkbox"]');
const compatibilityChip = processorModal.querySelector('.compatible-chip');
const cpuFilterLines = [...filterPanel.querySelectorAll('.filter-line')];
const cpuInStock = filterPanel.querySelector('.availability input[type="checkbox"]');
const cpuRating = cpuFilterLines[1].querySelector('input');
const cpuReliable = cpuFilterLines[2].querySelector('input');
const initialCheckboxes = [...filterPanel.querySelectorAll('input[type="checkbox"]')].map((input) => [input, input.checked]);
const brandInputs = [...filterPanel.querySelectorAll('.brand-filter input[type="checkbox"]')];
const resultCount = processorModal.querySelector('#processor-result-count');

brandInputs.forEach((input) => input.addEventListener('change', applyFilters));
[cpuRating, cpuReliable].forEach((input) => input.addEventListener('change', applyFilters));

function syncCompatibilityChip() {
  compatibilityChip.hidden = !compatibilityCheckbox.checked;
}

compatibilityCheckbox.addEventListener('change', () => {
  syncCompatibilityChip();
  applyFilters();
});
compatibilityChip.addEventListener('click', () => {
  compatibilityCheckbox.checked = false;
  syncCompatibilityChip();
  applyFilters();
});

processorModal.querySelector('.reset-chip').addEventListener('click', () => {
  initialCheckboxes.forEach(([input, checked]) => { input.checked = checked; });
  compatibilityCheckbox.checked = false;
  syncCompatibilityChip();
  socketSearch.value = '';
  showAllSockets.setAttribute('aria-expanded', 'false');
  showAllSockets.textContent = 'Показать всё';
  updateSocketVisibility();
  filterSearch.value = '';
  filterSearch.dispatchEvent(new Event('input'));
  const [minPrice, maxPrice] = processorModal.querySelectorAll('.price-inputs input');
  minPrice.value = '';
  maxPrice.value = '';
  cpuFacetSections.forEach(section => section.querySelectorAll('input').forEach(input => {input.checked = false;}));
  catalogUI.syncQuickTags(cpuQuick, []);
  applyFilters();
});

// Every consumer shares the canonical objects from processor-data.js.
const processors = processorCatalog;
const processorById = new Map(processors.map((item) => [item.id, item]));
const productList = processorModal.querySelector('.processor-products');
const processorCardCollection = catalogUI.deferredCards(processors, (item) => {
  const card = catalogUI.productCard(item);
  card.dataset.brand = item.brand;
  card.dataset.socket = item.socket;
  card.dataset.price = item.price == null ? '' : String(item.price);
  card.dataset.reviews = String(item.reviewsCount);
  card.dataset.rating = item.rating;
  card.dataset.reliability = item.reliability;
  card.dataset.order = String(item.order);
  return card;
});
const productCards = processorCardCollection.cards;
const processorCardById = processorCardCollection.byId;

const priceInputs = [...filterPanel.querySelectorAll('.price-inputs input')];
const priceLabels = [...filterPanel.querySelectorAll('.price-filter label')];
const brandLabels = [...filterPanel.querySelectorAll('.brand-filter label')];
const sortTrigger = processorModal.querySelector('#processor-sort');
const sortMenu = processorModal.querySelector('.sort-menu');
const sortOptions = [...sortMenu.querySelectorAll('[data-sort]')];
const activeFilterChips = processorModal.querySelector('#active-filter-chips');
let sortMode = 'popular';
const emptyResults = catalogUI.controlElement('products-empty');
emptyResults.textContent = 'В прототипе нет процессоров с такими параметрами';
emptyResults.hidden = true;
productList.append(emptyResults);

const priceBands = [[0, 4000], [4001, 6000], [6001, 10000], [10001, 18000], [18001, 35000], [35001, Infinity]];
const priceNames = ['Менее 4 000 ₽', '4 001 - 6 000 ₽', '6 001 - 10 000 ₽', '10 001 - 18 000 ₽', '18 001 - 35 000 ₽', '35 001 ₽ и более'];
const socketNames = socketLabels.map((label) => label.textContent.replace(/\s*\(\d+\)$/, '').trim());
const cpuFacetSections = new Map();
let cpuSelectionState = new Map();
let cpuBasicState;
for (const [key, title] of processorFilters.definitions) {
  if (!processorFilters.options(processors, key).length) continue;
  const section = processorFilters.section(processors, key, title);
  filterPanel.insertBefore(section, filterEmpty);
  catalogUI.bindFacetDisclosure(section);
  section.addEventListener('change', applyFilters);
  cpuFacetSections.set(key, section);
}
const selectedCpuFacet = key => [...cpuFacetSections.get(key).querySelectorAll('label')].filter(label => label.querySelector('input').checked).map(label => label.dataset.value);
const cpuFacetInput = (key, value) => [...(cpuFacetSections.get(key)?.querySelectorAll('label') || [])].find(label => label.dataset.value === value)?.querySelector('input');
const cpuQuick = document.createElement('div');
cpuQuick.className = 'catalog-quick cpu-quick';
const cpuTagEntries = catalogTags.cpu.filter(([, facet, value]) => facet && processors.some((item) => String(item[facet]) === value));
const cpuSocketInput = (value) => socketLabels[socketNames.indexOf(value)]?.querySelector('input');
function syncCpuTags() {
  const active = cpuTagEntries.filter(([name, facet, value]) => facet === 'socket' ? cpuSocketInput(value)?.checked : cpuFacetInput(facet, value)?.checked).map(([name]) => name);
  catalogUI.syncQuickTags(cpuQuick, active);
  for (const button of cpuQuick.querySelectorAll('button')) {
    const [, facet, value] = cpuTagEntries.find(([name]) => name === button.dataset.quick);
    button.disabled = !active.includes(button.dataset.quick) && !processors.some((item) => String(item[facet]) === value && processorMatches(item, facet));
  }
}
cpuTagEntries.forEach(([name, facet, value]) => {
  const button = catalogUI.quickTagButton({text:name, key:name, onClick:() => {
    if (facet === 'socket') {
      const input = cpuSocketInput(value); if (input) input.checked = !input.checked;
    } else {
      const input = cpuFacetInput(facet, value); if (input) input.checked = !input.checked;
    }
    applyFilters();
  }});
  cpuQuick.append(button);
});
const cpuQuickWrap = document.createElement('div');
cpuQuickWrap.className = 'catalog-quick-wrap cpu-quick-wrap';
const cpuQuickMore = catalogUI.controlElement('power-quick-more', {type:'button', 'aria-expanded':'false'}, 'Показать ещё');
cpuQuickWrap.append(cpuQuick, cpuQuickMore);
processorModal.querySelector('.processor-toolbar').prepend(cpuQuickWrap);
catalogUI.bindQuickMore(cpuQuickMore, cpuQuick);

function selectedValues(labels, names) {
  return labels.flatMap((label, index) => label.querySelector('input').checked ? [names[index]] : []);
}

function manualPrice(value, fallback) {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : fallback;
}

function processorMatches(item, skipFacet = '') {
  const selectedBoard = window.configuratorState?.motherboard;
  if (!cpuBasicState.inStock) return false;
  if (skipFacet !== 'compatible' && cpuBasicState.compatible && !catalogUI.cpuFitsBoard(item,selectedBoard)) return false;
  if (skipFacet !== 'rating' && cpuBasicState.rating && Number(item.rating) < 4.5) return false;
  if (skipFacet !== 'reliable' && cpuBasicState.reliable && item.reliability !== 'Отличная') return false;
  for (const [facet] of cpuFacetSections) {
    const values = cpuSelectionState.get(facet) || [];
    if (facet !== skipFacet && values.length && !values.some(value => processorFilters.has(item, facet, value))) return false;
  }
  const brands = cpuBasicState.brands;
  const sockets = cpuBasicState.sockets;
  const bands = cpuBasicState.bands;
  if (skipFacet !== 'brand' && brands.length && !brands.includes(item.brand)) return false;
  if (skipFacet !== 'socket' && sockets.length && !sockets.includes(item.socket)) return false;
  if (item.price == null) return !bands.length && !cpuBasicState.manualPrice;
  if (skipFacet !== 'price' && bands.length && !bands.some(([min, max]) => item.price >= min && item.price <= max)) return false;
  return item.price >= cpuBasicState.min && item.price <= cpuBasicState.max;
}

function setOption(label, name, count) {
  const input = label.querySelector('input');
  const labelText = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
  if (label.classList.contains('filter-option-with-hint')) catalogUI.setFilterLabel(label, `${name} (${count})`);
  else labelText.textContent = `${name} (${count})`;
  input.disabled = count === 0 && !input.checked;
  label.classList.toggle('is-unavailable', input.disabled);
}

function productWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  return mod10 === 1 && mod100 !== 11 ? 'товар' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'товара' : 'товаров';
}

function applyFilters() {
  catalogUI.bindPriceRange(processorModal, Math.min(...processors.filter(item => item.price != null).map(item => item.price)), Math.max(...processors.filter(item => item.price != null).map(item => item.price)));
  processorCardCollection.ensure();
  if (productCards.length && !productList.contains(productCards[0])) sortProducts();
  cpuBasicState = {
    inStock: cpuInStock.checked, compatible: compatibilityCheckbox.checked,
    rating: cpuRating.checked, reliable: cpuReliable.checked,
    brands: selectedValues(brandLabels, ['amd', 'intel']), sockets: selectedValues(socketLabels, socketNames),
    bands: priceLabels.flatMap((label, index) => label.querySelector('input').checked ? [priceBands[index]] : []),
    manualPrice: priceInputs.some(input => input.value.trim()),
    min: manualPrice(priceInputs[0].value, 9399), max: manualPrice(priceInputs[1].value, 67299)
  };
  cpuSelectionState = new Map([...cpuFacetSections.keys()].map(key => [key, selectedCpuFacet(key)]));
  const visible = processors.filter((item) => processorMatches(item));
  updateProcessorArticles(visible, {compatible: cpuBasicState.compatible,
    facets: new Map([['brand', cpuBasicState.brands], ['socket', cpuBasicState.sockets], ...cpuSelectionState])});
  const visibleIds = new Set(visible.map((item) => item.id));
  productCards.forEach((card) => { card.hidden = !visibleIds.has(card.dataset.productId); });
  resultCount.textContent = `${visible.length} ${productWord(visible.length)}`;
  emptyResults.hidden = visible.length !== 0;
  brandLabels.forEach((label, index) => setOption(label, ['AMD', 'Intel'][index], processors.filter((item) => processorMatches(item, 'brand') && item.brand === ['amd', 'intel'][index]).length));
  socketLabels.forEach((label, index) => setOption(label, socketNames[index], processors.filter((item) => processorMatches(item, 'socket') && item.socket === socketNames[index]).length));
  priceLabels.forEach((label, index) => setOption(label, priceNames[index], processors.filter((item) => processorMatches(item, 'price') && item.price != null && item.price >= priceBands[index][0] && item.price <= priceBands[index][1]).length));
  const selectedBoard = window.configuratorState?.motherboard;
  const filterCounts = [
    processors.filter((item) => processorMatches(item, 'compatible') && catalogUI.cpuFitsBoard(item,selectedBoard)).length,
    processors.filter((item) => processorMatches(item, 'rating') && Number(item.rating) >= 4.5).length,
    processors.filter((item) => processorMatches(item, 'reliable') && item.reliability === 'Отличная').length,
    0,
    0
  ];
  ['Совместимые товары', 'Рейтинг 4.5 и выше', 'Надёжные модели', 'Есть обзор', 'Бонусы за отзыв']
    .forEach((name, index) => setOption(cpuFilterLines[index], name, filterCounts[index]));
  for (const [facet, section] of cpuFacetSections) {
    section.querySelectorAll('label').forEach(label => {
      const count = processors.filter(item => processorMatches(item, facet) && processorFilters.has(item, facet, label.dataset.value)).length;
      const input = label.querySelector('input');
      input.disabled = count === 0 && !input.checked;
      label.classList.toggle('is-unavailable', input.disabled);
      label.querySelector('span').textContent = `${processorFilters.label(facet, label.dataset.value)} (${count})`;
    });
  }
  syncSocketSelectAll();
  syncCpuTags();
  renderActiveChips();
  catalogUI.refresh(productList, processorModal);
}

function renderActiveChips() {
  activeFilterChips.replaceChildren();
  for (const [facet, section] of cpuFacetSections) {
    const title = processorFilters.definitions.find(([key]) => key === facet)[1];
    for (const value of selectedCpuFacet(facet)) activeFilterChips.append(catalogUI.chip(`${title}: ${processorFilters.label(facet, value)}`, () => {
      cpuFacetInput(facet, value).checked = false; applyFilters();
    }));
  }
  const selections = [
    ...brandLabels.map((label, index) => ({label, text: `Бренд: ${['AMD', 'Intel'][index]}`})),
    ...socketLabels.map((label, index) => ({label, text: `Сокет: ${socketNames[index]}`}))
  ];
  selections.filter(({label}) => label.querySelector('input').checked).forEach(({label, text}) => {
    activeFilterChips.append(catalogUI.chip(text, () => {
      label.querySelector('input').checked = false;
      applyFilters();
    }));
  });
}

function sortProducts() {
  const originalOrder = (a, b) => a.order - b.order;
  const sorted = [...processors].sort((a, b) => {
    if (sortMode === 'price-asc' || sortMode === 'price-desc') {
      if (a.price == null || b.price == null) return (a.price == null) - (b.price == null) || originalOrder(a, b);
      return (sortMode === 'price-asc' ? a.price - b.price : b.price - a.price) || originalOrder(a, b);
    }
    if (sortMode === 'reviews-desc') return b.reviewsCount - a.reviewsCount || originalOrder(a, b);
    if (sortMode === 'rating-desc') return Number(b.rating) - Number(a.rating) || originalOrder(a, b);
    if (sortMode === 'newest') return originalOrder(b, a);
    return originalOrder(a, b);
  });
  productList.append(...sorted.map((item) => processorCardById.get(item.id)), emptyResults);
  catalogUI.refresh(productList, processorModal);
}

const closeSortMenu = catalogUI.bindSort(sortTrigger, sortMenu, value => {sortMode = value; sortProducts();});

priceLabels.forEach((label) => label.querySelector('input').addEventListener('change', applyFilters));
filterPanel.querySelectorAll('.availability input[type="checkbox"]').forEach((input) => input.addEventListener('change', applyFilters));
priceInputs.forEach((input) => input.addEventListener('change', applyFilters));
priceInputs.forEach((input) => {
  input.value = '';
  input.inputMode = 'numeric';
  input.setAttribute('pattern', '[0-9]*');
  input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, ''); applyFilters(); });
});
priceInputs[0].placeholder = 'от 9 399';
priceInputs[1].placeholder = 'до 67 299';


function addProcessor(item, shouldClose = true) {
  buildView.select('processor', item);
  if (shouldClose) closeProcessorModal();
}

function syncProcessorButtons() {
  catalogUI.syncCards(productCards, {
    selected: configuratorState.processor,
    otherSocket: configuratorState.motherboard?.socket,
    socket: (card) => processorById.get(card.dataset.productId).socket
  });
}

catalogUI.bindActions(productList, (card) => addProcessor(processorById.get(card.dataset.productId)), item=>addProcessor(item, false));
window.addEventListener('configurator:state-changed', () => {
  if (!processorModal.hidden) { applyFilters(); syncProcessorButtons(); }
});

catalogLoader.register('processor', openProcessorModal);
