(() => {
const gpus = gpuCatalog;
// GPU modal uses the same catalog card, facet, chip and selection components as other categories.
const gpuModal = document.getElementById('gpu-modal');
gpuModal.className = 'processor-modal power-modal gpu-modal';
catalogUI.mountModal(gpuModal, {"title": "Видеокарты", "countAttributes": {"class": "gpu-result-count"}, "countText": "", "closeAttributes": {"class": "processor-modal-close gpu-close", "type": "button", "aria-label": "Закрыть окно выбора видеокарты"}, "filtersLabel": "Фильтры видеокарт", "resultsLabel": "Список видеокарт"},
  catalogUI.controlMarkup("filter-search", {}, {"input": {"class": "gpu-filter-search", "type": "search", "placeholder": "Поиск по фильтрам", "aria-label": "Поиск по фильтрам"}}) +
  catalogUI.controlMarkup("filter-panel", {}, "\n" +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "compatible"}, {"input": {"class": "gpu-compatible", "type": "checkbox", "checked": null}, "text": "Совместимые товары", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "rating"}, {"input": {"class": "gpu-rating", "type": "checkbox"}, "text": "Рейтинг 4.5 и выше", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "reliable"}, {"input": {"class": "gpu-reliable", "type": "checkbox"}, "text": "Надёжные модели", "wrapped": true, "hint": "минимум обращений в сервис", "shield": true}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "has-review"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Есть обзор (0)", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "review-bonus"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Бонусы за отзыв (0)", "wrapped": true, "hint": "", "shield": false}) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "price-filter", "data-facet": "price"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Цена"}) + "</h3>" +
    catalogUI.controlMarkup("price-inputs", {}, {"inputs": [{"class": "gpu-min", "type": "text", "inputmode": "numeric", "aria-label": "Цена от", "placeholder": "от 0"}, {"class": "gpu-max", "type": "text", "inputmode": "numeric", "aria-label": "Цена до", "placeholder": "до 0"}]}) +
    catalogUI.controlMarkup("price-track", {}, {"handle": false}) +
    catalogUI.controlMarkup("catalog-options", {}, "") +
    catalogUI.controlMarkup("price-reset", {"type": "button"}, "Сбросить")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "brand-filter", "data-facet": "brand"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Бренд"}) + "</h3>" +
    catalogUI.controlMarkup("socket-search", {}, {"input": {"class": "gpu-brand-search", "type": "search", "placeholder": "Поиск", "aria-label": "Поиск по брендам"}}) +
    catalogUI.controlMarkup("catalog-options", {}, "")) + "<div class=\"gpu-facets\"></div><div class=\"all-filters-wrap\">" +
    catalogUI.controlMarkup("all-filters", {"type": "button"}, "Все фильтры") + "</div>"),
  catalogUI.controlMarkup("processor-toolbar", {}, catalogUI.controlMarkup("toolbar-main", {}, "<div class=\"power-quick-wrap\">" +
    catalogUI.controlMarkup("catalog-quick", {"class": "power-quick gpu-quick"}, "") +
    catalogUI.controlMarkup("power-quick-more", {"class": "gpu-quick-more", "type": "button", "aria-expanded": "false"}, "Показать ещё") + "</div>" +
    catalogUI.controlMarkup("toolbar-select", {"class": "sort-control"}, "<small>Сортировка:</small>" +
    catalogUI.controlMarkup("sort-trigger", {"class": "gpu-sort-trigger", "type": "button", "aria-expanded": "false"}, {"text": "Сначала популярные"}) +
    catalogUI.controlMarkup("sort-menu", {"class": "gpu-sort-menu", "role": "menu", "hidden": null}, catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "popular"}, "Сначала популярные") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-asc"}, "Сначала недорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-desc"}, "Сначала дорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "rating-desc"}, "Сначала с лучшей оценкой"))) +
    catalogUI.controlMarkup("toolbar-select", {}, "<small>Группировка:</small><span>Отсутствует <b>⌄</b></span>")) +
    (catalogUI.controlMarkup("compatible-chip", {"class": "gpu-compatible-chip", "type": "button"}, {"text": "Совместимые товары"}) + "<span class=\"gpu-active-chips\"></span>" +
    catalogUI.controlMarkup("reset-chip", {"class": "gpu-reset", "type": "button"}, "Сбросить фильтры"))) +
  "<div class=\"processor-products gpu-products\"></div>" +
  catalogUI.controlMarkup("products-empty", {"class": "gpu-empty", "hidden": null}, "В прототипе нет видеокарт с такими параметрами"));
const gpuRow = document.getElementById('gpu-row');
const gpuPanel = gpuModal.querySelector('.filter-panel');
const gpuList = gpuModal.querySelector('.gpu-products');
gpuModal.querySelector('.gpu-min').placeholder = `от ${Math.min(...gpus.filter(item => item.price != null).map(item => item.price)).toLocaleString('ru-RU')}`;
gpuModal.querySelector('.gpu-max').placeholder = `до ${Math.max(...gpus.filter(item => item.price != null).map(item => item.price)).toLocaleString('ru-RU')}`;
const gpuMoney = (value) => value == null ? '—' : `${value.toLocaleString('ru-RU')} ₽`;
const gpuRanges = {
  price: [['Менее 10 000 ₽', 0, 10000], ['10 001 - 20 000 ₽', 10001, 20000], ['20 001 - 30 000 ₽', 20001, 30000], ['30 001 - 50 000 ₽', 30001, 50000], ['50 001 - 100 000 ₽', 50001, 100000], ['100 001 ₽ и более', 100001, Infinity]]
};
const gpuFacetDefinitions = [
  ['Графический процессор', 'chipModel', [...new Set(gpus.map(item => item.chipModel))]],
  ['Объем видеопамяти (ГБ)', 'memoryGb', ['16', '1', '2', '4', '6', '8', '10', '12', '24', '32']],
  ['Производитель графического процессора', 'gpuVendor', ['NVIDIA', 'AMD', 'Intel']],
  ['Назначение', 'purpose', ['игровая видеокарта', 'профессиональная видеокарта', 'видеокарта для дома и офиса']],
  ['Разрядность шины памяти (бит)', 'busBits', ['128', '256', '64', '96', '160', '192', '384']],
  ['Тип и количество установленных вентиляторов', 'fansDisplay', ['1 центробежный (турбина)', '2 осевых', '3 осевых', '4 осевых', 'нет', '1 осевой']],
  ['Интерфейс подключения', 'interface', ['PCIe 4.0', 'PCIe 5.0', 'PCIe 2.0', 'PCIe 3.0']],
  ['Линейка графических процессоров', 'gpuLine', ['AMD Radeon', 'NVIDIA GeForce', 'NVIDIA RTX', 'NVIDIA Tesla', 'Intel Arc', 'NVIDIA L', 'NVIDIA Quadro']],
  ['Тип памяти', 'memoryType', ['GDDR6', 'GDDR7', 'GDDR6X', 'GDDR5', 'GDDR3', 'HBM2', 'DDR4']],
  ['Цвет', 'color', ['бежевый', 'белый', 'золотистый', 'серебристый', 'серый', 'черный']],
  ['Тип охлаждения', 'coolingType', ['активное воздушное', 'активное жидкостное', 'водоблок', 'пассивное']]
];
for(const [,facet,options] of gpuFacetDefinitions) {
  options.push(...[...new Set(gpus.flatMap(item=>item[facet]==null ? [] : [String(item[facet])]))].filter(value=>!options.includes(value)));
}
for (const [title, facet, options] of gpuFacetDefinitions) gpuModal.querySelector('.gpu-facets').append(catalogUI.facetSection(title, facet, options));
for (const [facet, options] of [['brand', [...new Set(gpus.map((item) => item.brand))].sort()], ['price', gpuRanges.price.map((range) => range[0])]]) {
  const container = gpuPanel.querySelector(`[data-facet="${facet}"] .catalog-options`);
  options.forEach((value, index) => {
    const label = catalogUI.filterOption();
    label.dataset.value = facet === 'price' ? String(index) : value;
    label.querySelector('span').textContent = value;
    container.append(label);
  });
}
// Only tags backed by the local catalog; each toggles the same facet checkbox.
const gpuQuick = gpuModal.querySelector('.gpu-quick');
const gpuQuickEntries = [
  ['RTX 5070 Ti', 'chipModel', 'RTX 5070 Ti'],
  ['RTX 5060 Ti 16 ГБ', 'chipModel', 'RTX 5060 Ti'],
  ['RTX 5080', 'chipModel', 'RTX 5080'],
  ['RTX 5050', 'chipModel', 'RTX 5050'],
  ['RTX 5060', 'chipModel', 'RTX 5060'],
  ['RTX 5070', 'chipModel', 'RTX 5070'],
  ['Radeon RX 9070', 'chipModel', 'RX 9070'],
  ['Radeon RX 9070 XT', 'chipModel', 'RX 9070 XT'],
  ['Radeon RX 9060 XT 16 ГБ', 'chipModel', 'RX 9060 XT'],
  ['Видеокарты NVIDIA', 'gpuVendor', 'NVIDIA'],
  ['Видеокарты AMD', 'gpuVendor', 'AMD']
].filter(([, facet, value]) => gpus.some(item => String(item[facet]) === value));
for (const [title, facet, value] of gpuQuickEntries) {
  const button = catalogUI.quickTagButton({text:title, key:`${facet}:${value}`, title:null});
  gpuQuick.append(button);
}
const gpuQuickInput = (facet, value) => [...gpuPanel.querySelectorAll(`[data-facet="${facet}"] label`)].find(label => label.dataset.value === value)?.querySelector('input');
const gpuCardCollection = catalogUI.deferredCards(gpus, (item) => {
  const card = catalogUI.productCard(catalogUI.categoryCardData(item, 'gpu'));
  card.classList.add('gpu-product');
  return card;
});
const gpuCards = gpuCardCollection.cards;
const gpuById = new Map(gpus.map((item) => [item.id, item]));
const gpuCardById = gpuCardCollection.byId;
let gpuSort = 'popular';
const readGpuFilters = catalogUI.createFilterReader(gpuModal, {
  compatible: '.gpu-compatible',
  rating: '.gpu-rating',
  reliable: '.gpu-reliable',
  min: '.gpu-min',
  max: '.gpu-max',
});
let gpuFilterState;
const selectedGpuFacet = (facet) => gpuFilterState.facets.get(facet) || [];
const gpuCompatibleWithBuild = (item) => catalogUI.gpuFitsCase(item, window.configuratorState.computerCase) && catalogUI.gpuFitsPower(item, window.configuratorState.powerSupply);
function gpuFacetHas(item, facet, value) {
  if (facet === 'price') return item.price != null && item.price >= gpuRanges.price[Number(value)][1] && item.price <= gpuRanges.price[Number(value)][2];
  return item[facet] != null && String(item[facet]) === value;
}
function gpuMatches(item, skip = '') {
  if (skip !== 'compatible' && gpuFilterState.controls.compatible.checked && !gpuCompatibleWithBuild(item)) return false;
  if (skip !== 'rating' && gpuFilterState.controls.rating.checked && item.rating < 4.5) return false;
  if (skip !== 'reliable' && gpuFilterState.controls.reliable.checked && !item.reliable) return false;
  for (const facet of ['brand', 'price', ...gpuFacetDefinitions.map((entry) => entry[1])]) {
    if (facet === skip) continue;
    const values = selectedGpuFacet(facet);
    if (values.length && !values.some((value) => gpuFacetHas(item, facet, value))) return false;
  }
  if (item.price == null) return !gpuFilterState.controls.min.value.trim() && !gpuFilterState.controls.max.value.trim() && (skip === 'price' || !selectedGpuFacet('price').length);
  const min = Number(gpuFilterState.controls.min.value.replace(/\D/g, '')) || 0;
  const maxText = gpuFilterState.controls.max.value.replace(/\D/g, '');
  const max = maxText === '' ? Infinity : Number(maxText);
  return item.price != null && item.price >= min && item.price <= max;
}
function gpuCountWord(count) {const n = count % 10, h = count % 100; return n === 1 && h !== 11 ? 'товар' : n >= 2 && n <= 4 && (h < 12 || h > 14) ? 'товара' : 'товаров';}
const updateGpuArticles = articleSelection.bindModal(gpuModal, 'gpu', gpuFacetHas);
function renderGpus() {
  catalogUI.bindPriceRange(gpuModal, Math.min(...gpus.filter(item => item.price != null).map(item => item.price)), Math.max(...gpus.filter(item => item.price != null).map(item => item.price)));
  gpuCardCollection.ensure();
  gpuFilterState = readGpuFilters();
  const visible = gpus.filter((item) => gpuMatches(item));
  updateGpuArticles(visible, {compatible: gpuFilterState.controls.compatible.checked, facets: gpuFilterState.facets});
  visible.sort((a, b) => gpuSort === 'price-asc' ? catalogUI.comparePrice(a,b) : gpuSort === 'price-desc' ? catalogUI.comparePrice(a,b,true) : gpuSort === 'rating-desc' ? b.rating - a.rating : a.order - b.order);
  gpuList.replaceChildren(...visible.map((item) => gpuCardById.get(item.id)));
  catalogUI.syncCards(gpuCards, {selected: window.configuratorState.gpu, otherSocket: null});
  gpuCards.forEach((card) => card.classList.toggle('is-alternative-socket', !gpuCompatibleWithBuild(gpuById.get(card.dataset.productId))));
  gpuModal.querySelector('.gpu-result-count').textContent = `${visible.length} ${gpuCountWord(visible.length)}`;
  gpuModal.querySelector('.gpu-empty').hidden = visible.length > 0;
  gpuModal.querySelector('.gpu-compatible-chip').hidden = !gpuModal.querySelector('.gpu-compatible').checked;
  gpuPanel.querySelector('.gpu-compatible').nextElementSibling.textContent = `Совместимые товары (${gpus.filter((item) => gpuMatches(item, 'compatible') && gpuCompatibleWithBuild(item)).length})`;
  gpuPanel.querySelector('.gpu-rating').nextElementSibling.textContent = `Рейтинг 4.5 и выше (${gpus.filter((item) => gpuMatches(item, 'rating') && item.rating >= 4.5).length})`;
  catalogUI.setFilterLabel(gpuPanel.querySelector('.gpu-reliable').closest('label'), `Надёжные модели (${gpus.filter((item) => gpuMatches(item, 'reliable') && item.reliable).length})`);
  for (const section of gpuPanel.querySelectorAll('[data-facet]')) {
    const facet = section.dataset.facet;
    section.querySelectorAll('label').forEach((label) => {
      const count = gpus.filter((item) => gpuMatches(item, facet) && gpuFacetHas(item, facet, label.dataset.value)).length;
      const input = label.querySelector('input');
      label.querySelector('span').textContent = `${facet === 'price' ? gpuRanges.price[Number(label.dataset.value)][0] : label.dataset.value} (${count})`;
      input.disabled = count === 0 && !input.checked;
      label.classList.toggle('is-unavailable', input.disabled);
    });
  }
  catalogUI.syncQuickTags(gpuQuick, gpuQuickEntries.filter(([, facet, value]) => selectedGpuFacet(facet).includes(value)).map(([, facet, value]) => `${facet}:${value}`));
  for (const button of gpuQuick.querySelectorAll('[data-quick]')) {
    const [facet, value] = button.dataset.quick.split(':');
    button.disabled = !gpuQuickInput(facet, value) || gpuQuickInput(facet, value).disabled;
  }
  const chips = gpuModal.querySelector('.gpu-active-chips'); chips.replaceChildren();
  for (const section of gpuPanel.querySelectorAll('[data-facet]')) for (const label of section.querySelectorAll('label')) if (label.querySelector('input').checked) {
    const title = section.querySelector('.filter-heading').textContent.trim();
    chips.append(catalogUI.chip(`${title}: ${section.dataset.facet === 'price' ? gpuRanges.price[Number(label.dataset.value)][0] : label.dataset.value}`, () => {label.querySelector('input').checked = false; renderGpus();}));
  }
  catalogUI.refresh(gpuList, gpuModal);
  updateGpuStatus();
}
gpuPanel.addEventListener('change', renderGpus);
gpuPanel.querySelectorAll('.filter-heading').forEach(button=>catalogUI.bindFacetDisclosure(button.closest('.filter-section')));
gpuModal.querySelector('.gpu-compatible-chip').addEventListener('click', () => {gpuModal.querySelector('.gpu-compatible').checked = false; renderGpus();});
gpuModal.querySelector('.gpu-reset').addEventListener('click', () => {gpuPanel.querySelectorAll('[data-facet] input[type=checkbox]').forEach((input) => input.checked = false); gpuPanel.querySelector('.gpu-compatible').checked = false; gpuPanel.querySelector('.gpu-rating').checked = false; gpuPanel.querySelector('.gpu-reliable').checked = false; gpuModal.querySelectorAll('.gpu-min,.gpu-max').forEach((input) => input.value = ''); renderGpus();});
gpuModal.querySelector('.price-reset').addEventListener('click', () => {gpuPanel.querySelectorAll('[data-facet=price] input').forEach((input) => input.checked = false); gpuModal.querySelectorAll('.gpu-min,.gpu-max').forEach((input) => input.value = ''); renderGpus();});
gpuModal.querySelectorAll('.gpu-min,.gpu-max').forEach((input) => input.addEventListener('input', () => {input.value = input.value.replace(/\D/g, ''); renderGpus();}));
catalogUI.bindFilterSearch(gpuModal.querySelector('.gpu-filter-search'),gpuPanel);
gpuModal.querySelector('.gpu-brand-search').addEventListener('input', (event) => {const query = event.target.value.trim().toLocaleLowerCase('ru'); gpuPanel.querySelectorAll('[data-facet=brand] label').forEach((label) => label.hidden = !!query && !label.textContent.toLocaleLowerCase('ru').includes(query));});
gpuModal.querySelector('.all-filters').addEventListener('click', () => {gpuPanel.querySelectorAll('.filter-section').forEach((section) => {section.classList.remove('is-collapsed'); section.querySelector('.filter-heading').setAttribute('aria-expanded', 'true');}); gpuModal.querySelector('.processor-filters').scrollTo({top: 0, behavior: 'smooth'});});
gpuQuick.addEventListener('click', (event) => {
  const button = event.target.closest('[data-quick]');
  if (!button || button.disabled) return;
  const [facet, value] = button.dataset.quick.split(':');
  const input = gpuQuickInput(facet, value);
  if (input && !input.disabled) { input.checked = !input.checked; renderGpus(); }
});
catalogUI.bindQuickMore(gpuModal.querySelector('.gpu-quick-more'), gpuQuick);
const gpuSortTrigger = gpuModal.querySelector('.gpu-sort-trigger'), gpuSortMenu = gpuModal.querySelector('.gpu-sort-menu');
catalogUI.bindSort(gpuSortTrigger, gpuSortMenu, value => {gpuSort = value; renderGpus();});
function openGpuModal() {catalogUI.openModal(gpuModal); renderGpus();}
function closeGpuModal() {catalogUI.closeModal(gpuModal, gpuRow.querySelector('#add-gpu,.gpu-replace'));}
gpuModal.querySelector('.gpu-close').addEventListener('click', closeGpuModal);
document.addEventListener('keydown', (event) => {if (event.key === 'Escape' && !gpuModal.hidden) {if (!gpuSortMenu.hidden) {gpuSortMenu.hidden = true; gpuSortTrigger.setAttribute('aria-expanded', 'false');} else closeGpuModal();}});
function updateGpuStatus() {const status=gpuRow.querySelector('.selected-status');if(!status)return;const selected=gpuById.get(window.configuratorState.gpu?.id);catalogUI.updateFitStatus(status,catalogUI.combineFit(catalogUI.gpuCaseFit(selected,window.configuratorState.computerCase),catalogUI.gpuPowerFit(selected,window.configuratorState.powerSupply)));}
function addGpu(item, shouldClose = true) {
  buildView.select('gpu', item);
  if (shouldClose) closeGpuModal();
}
catalogUI.bindActions(gpuList, (card) => addGpu(gpuById.get(card.dataset.productId)), item=>addGpu(item, false));
window.addEventListener('configurator:state-changed', () => { if (!gpuModal.hidden) renderGpus(); else updateGpuStatus(); });

catalogLoader.register('gpu', openGpuModal);
})();
