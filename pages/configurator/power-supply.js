const powerModal = document.getElementById('power-supply-modal');
powerModal.className = 'processor-modal power-modal';
catalogUI.mountModal(powerModal, {"title": "Блоки питания", "countAttributes": {"class": "power-result-count"}, "countText": "", "closeAttributes": {"class": "processor-modal-close power-close", "type": "button", "aria-label": "Закрыть окно выбора блока питания"}, "filtersLabel": "Фильтры блоков питания", "resultsLabel": "Список блоков питания"},
  catalogUI.controlMarkup("filter-search", {}, {"input": {"class": "power-filter-search", "type": "search", "placeholder": "Поиск по фильтрам", "aria-label": "Поиск по фильтрам"}}) +
  catalogUI.controlMarkup("filter-panel", {}, "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "availability", "data-filter-id": "availability"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Наличие в магазинах"}) + "</h3>" +
    catalogUI.controlMarkup("store-select", {}, {"text": "В любом из 12 магазинов"}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "in-stock"}, {"input": {"class": "power-in-stock", "type": "checkbox", "checked": null}, "text": "В наличии", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-today"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: сегодня", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-tomorrow"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: завтра", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-later"}, {"input": {"class": "power-later", "type": "checkbox", "checked": null}, "text": "Под заказ: позже", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "unavailable"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Отсутствующие в продаже", "wrapped": false, "hint": "", "shield": false})) + "\n" +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "compatible"}, {"input": {"class": "power-compatible", "type": "checkbox", "checked": null}, "text": "Совместимые товары", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "rating"}, {"input": {"class": "power-rating", "type": "checkbox"}, "text": "Рейтинг 4.5 и выше", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "reliable"}, {"input": {"class": "power-reliable", "type": "checkbox"}, "text": "Надёжные модели", "wrapped": true, "hint": "минимум обращений в сервис", "shield": true}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "has-review"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Есть обзор (0)", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "review-bonus"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Бонусы за отзыв (0)", "wrapped": true, "hint": "", "shield": false}) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "price-filter", "data-facet": "price"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Цена"}) + "</h3>" +
    catalogUI.controlMarkup("price-inputs", {}, {"inputs": [{"class": "power-min", "type": "text", "inputmode": "numeric", "aria-label": "Цена от", "placeholder": "от 750"}, {"class": "power-max", "type": "text", "inputmode": "numeric", "aria-label": "Цена до", "placeholder": "до 82 999"}]}) +
    catalogUI.controlMarkup("price-track", {}, {"handle": false}) +
    catalogUI.controlMarkup("power-options", {}, "") +
    catalogUI.controlMarkup("price-reset", {"type": "button"}, "Сбросить")) + "\n" +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Создано DNS (0)", "wrapped": true, "hint": "", "shield": false}) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "brand-filter", "data-facet": "brand"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Бренд"}) + "</h3>" +
    catalogUI.controlMarkup("socket-search", {}, {"input": {"class": "power-brand-search", "type": "search", "placeholder": "Поиск", "aria-label": "Поиск по брендам"}}) +
    catalogUI.controlMarkup("power-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "power-facet is-collapsed", "data-facet": "power"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Мощность (номинал)"}) + "</h3>" +
    catalogUI.controlMarkup("power-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "power-facet is-collapsed", "data-facet": "certificate"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Сертификат 80 PLUS"}) + "</h3>" +
    catalogUI.controlMarkup("power-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "power-facet is-collapsed", "data-facet": "fan"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Размер вентилятора"}) + "</h3>" +
    catalogUI.controlMarkup("power-options", {}, "")) + "\n<div class=\"power-extra-facets\"></div><div class=\"all-filters-wrap\">" +
    catalogUI.controlMarkup("all-filters", {"type": "button"}, "Все фильтры") + "</div>"),
  catalogUI.controlMarkup("processor-toolbar", {}, catalogUI.controlMarkup("toolbar-main", {}, "<div class=\"power-quick-wrap\">" +
    catalogUI.controlMarkup("catalog-quick", {"class": "power-quick"}, "") +
    catalogUI.controlMarkup("power-quick-more", {"type": "button", "aria-expanded": "false"}, "Показать ещё") + "</div>" +
    catalogUI.controlMarkup("toolbar-select", {"class": "sort-control"}, "<small>Сортировка:</small>" +
    catalogUI.controlMarkup("sort-trigger", {"class": "power-sort-trigger", "type": "button", "aria-expanded": "false"}, {"text": "Сначала популярные"}) +
    catalogUI.controlMarkup("sort-menu", {"class": "power-sort-menu", "role": "menu", "hidden": null}, catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "popular", "aria-checked": "true"}, "Сначала популярные") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-asc"}, "Сначала недорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-desc"}, "Сначала дорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "rating-desc"}, "Сначала с лучшей оценкой"))) +
    catalogUI.controlMarkup("toolbar-select", {}, "<small>Группировка:</small><span>Отсутствует <b>⌄</b></span>")) +
    (catalogUI.controlMarkup("compatible-chip", {"class": "power-compatible-chip", "type": "button"}, {"text": "Совместимые товары"}) + "<span class=\"power-active-chips\"></span>" +
    catalogUI.controlMarkup("reset-chip", {"class": "power-reset", "type": "button"}, "Сбросить фильтры"))) +
  "<div class=\"processor-products power-products\"></div>" +
  catalogUI.controlMarkup("products-empty", {"class": "power-empty", "hidden": null}, "В прототипе нет блоков питания с такими параметрами"));
const powerRow = document.getElementById('power-supply-row');
const powerPanel = powerModal.querySelector('.filter-panel');
const powerList = powerModal.querySelector('.power-products');
const powerExtraFacetTitles = [
  ['Отстегивающиеся кабели','detachable'],['Форм-фактор','formFactor'],['Разъемы для питания видеокарты (PCI-E)','gpuConnector'],
  ['Цвет','color'],['Соответствие стандартам','standard'],['Корректор коэффициента мощности (PFC)','pfc'],
  ['Разъемы для питания процессора (CPU)','cpuConnector'],['Тип подсветки','lighting'],['Оплетка проводов','sleeving']
];
powerExtraFacetTitles.forEach(([title,facet])=>{
  const section=catalogUI.facetSection(title,facet);
  section.querySelector('.catalog-options').className='power-options';
  powerModal.querySelector('.power-extra-facets').append(section);
});
const powerConnectorOptions = new Map([
  ...['12V-2x6','12VHPWR'].map(type=>[`16 pin (${type})`,item=>item.gpuConnectors?.some(row=>row.type==='16-pin'&&row.standard===type&&row.count>0)]),
  ...[...new Set([1,2,3,4,5,6,...powerSupplies.map(item=>productContract.connectorCount(item.gpuConnectors,'6+2-pin PCIe')).filter(count=>count!=null&&count>0)])].map(count=>[`${count} x 6+2 pin`,item=>productContract.connectorCount(item.gpuConnectors,'6+2-pin PCIe')===count])
]);
const powerFacets = {
  price: [['Менее 2 000 ₽',0,2000],['2 001 - 3 000 ₽',2001,3000],['3 001 - 4 000 ₽',3001,4000],['4 001 - 7 000 ₽',4001,7000],['7 001 - 12 000 ₽',7001,12000],['12 001 ₽ и более',12001,Infinity]],
  brand: [...new Set(['1STPLAYER','ARDOR GAMING','Cougar','DEEPCOOL','GamerStorm (DEEPCOOL)','Lian Li','Montech','MSI', ...powerSupplies.map(item=>item.brand)])],
  power: [...new Set(['400','450','500','550','600','650','700','750','800','850','1000','1200',...powerSupplies.filter(item=>item.power!=null).map(item=>String(item.power))])],
  certificate: ['Standard','Bronze','Gold','Platinum'],
  fan: [...new Set(['120','135', ...powerSupplies.flatMap(item=>item.fans?.map(group=>String(group.diameterMm)) ?? [])])],
  gpuConnector: [...powerConnectorOptions.keys()],
  color: [...new Set(['черный','белый', ...powerSupplies.map(item=>item.color)])],
  detachable: [...new Set(powerSupplies.map((item)=>item.detachable).filter(value=>value!=null))],
  formFactor: [...new Set(powerSupplies.map((item)=>item.formFactor).filter(value=>value!=null))],
  standard: [...new Set(powerSupplies.map((item)=>item.standard).filter(value=>value!=null))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})),
  pfc: ['активный'],
  cpuConnector: [...new Set(powerSupplies.filter(item=>item.cpuConnectors!=null).map((item)=>item.cpuConnector))],
  lighting: [...new Set(powerSupplies.map((item)=>item.lighting).filter(value=>value!=null))],
  sleeving: [...new Set(powerSupplies.map((item)=>item.sleeving).filter(value=>value!=null))]
};
for(const facet of ['power','certificate','color','detachable','formFactor','standard','lighting','sleeving']) {
  powerFacets[facet]=[...new Set([...powerFacets[facet],...powerSupplies.flatMap(item=>item[facet]==null ? [] : [String(item[facet])])])];
}
for (const [facet,options] of Object.entries(powerFacets)) {
  const container = powerPanel.querySelector(`[data-facet="${facet}"] .power-options`);
  options.forEach((option,index)=>{
    const label=catalogUI.filterOption();
    label.dataset.value=facet==='price'?String(index):option;
    label.querySelector('span').textContent=facet==='price'?option[0]:facet==='power'?`${option} Вт`:facet==='fan'?`${option} × ${option} мм`:option;
    container.append(label);
  });
}
const powerQuick = powerModal.querySelector('.power-quick');
const powerFacetHas=(item,facet,value)=>facet==='gpuConnector' ? (powerConnectorOptions.get(value)?.(item) ?? false) : facet==='pfc' ? item.pfc==='APFC'&&value==='активный' : facet==='fan' ? item.fans?.some(group=>group.diameterMm===Number(value)) : facet==='cpuConnector' ? item.cpuConnector===value : productContract.has(item,facet,value);

const syncPowerTags = catalogUI.bindFacetTags(powerQuick, catalogTags.power, powerPanel, powerSupplies, powerFacetHas, renderPower);
catalogUI.bindQuickMore(powerModal.querySelector('.power-quick-more'), powerQuick);
const powerMoney=(value)=>value == null ? '—' : `${value.toLocaleString('ru-RU')} ₽`;
function powerCard(item){
  const card = catalogUI.productCard(catalogUI.categoryCardData(item, 'power-supply'));
  card.classList.add('power-product');
  const badge=document.createElement('span');badge.className='power-certificate-badge';badge.innerHTML='80<small>PLUS</small>';
  card.querySelector('.product-image').insertBefore(badge,card.querySelector('.image-dots'));
  card.querySelector('h3').title=`${item.power} Вт; ${item.certificate}; ${item.pfc}; ${item.cpuConnector}; ${item.sata} SATA; ${item.gpuConnector}`;
  card.querySelector('.product-image>img').onerror=()=>{card.querySelector('.product-image>img').src=item.imageFallback;};
  card.querySelector('.product-stock span').textContent=item.availability==='now'?'В наличии':'Под заказ';
  if(item.availability!=='now')card.querySelector('.product-stock a').textContent='доставка позже';
  if(item.certificate==='Gold')badge.classList.add('is-gold');
  if(item.certificate==='Platinum')badge.classList.add('is-platinum');
  return card;
}
const powerCardCollection = catalogUI.deferredCards(powerSupplies, powerCard);
const powerCards = powerCardCollection.cards;
const powerById=new Map(powerSupplies.map((item)=>[item.id,item]));
const powerCardById = powerCardCollection.byId;
let powerSort='popular';
const readPowerFilters = catalogUI.createFilterReader(powerModal, {
  inStock: '.power-in-stock',
  later: '.power-later',
  compatible: '.power-compatible',
  rating: '.power-rating',
  reliable: '.power-reliable',
  query: '.power-filter-search',
  min: '.power-min',
  max: '.power-max',
});
let powerFilterState;
const selectedPowerFacet = (facet) => powerFilterState.facets.get(facet) || [];
const powerDigits=(value,fallback)=>{const digits=String(value).replace(/\D/g,'');return digits?Number(digits):fallback;};
const powerCompatible=powerModal.querySelector('.power-compatible');
const powerRating=powerModal.querySelector('.power-rating');
const powerReliable=powerModal.querySelector('.power-reliable');
const powerCompatibleWithBuild = (item) => catalogUI.caseFitsPower(window.configuratorState.computerCase, item) && catalogUI.gpuFitsPower(window.configuratorState.gpu, item);
function powerMatches(item,skip=''){
  if(item.availability==='now'&&!powerFilterState.controls.inStock.checked)return false;
  if(item.availability==='later'&&!powerFilterState.controls.later.checked)return false;
  if(skip!=='compatible'&&powerFilterState.controls.compatible.checked&&!powerCompatibleWithBuild(item))return false;
  if(skip!=='rating'&&powerFilterState.controls.rating.checked&&item.rating<4.5)return false;
  if(skip!=='reliable'&&powerFilterState.controls.reliable.checked&&!item.reliable)return false;
  const query=powerFilterState.controls.query.productQuery||'';
  if(query&&!item.name.toLocaleLowerCase('ru').includes(query))return false;
  for(const facet of Object.keys(powerFacets).filter((facet)=>facet!=='price')){
    const values=selectedPowerFacet(facet);
    if(facet!==skip&&values.length&&!values.some((value)=>powerFacetHas(item,facet,value)))return false;
  }
  if(item.price == null) return !powerFilterState.controls.min.value.trim() && !powerFilterState.controls.max.value.trim() && (skip === 'price' || !selectedPowerFacet('price').length);
  if(skip!=='price'){
    const ranges=selectedPowerFacet('price');
    if(ranges.length&&!ranges.some((index)=>item.price>=powerFacets.price[Number(index)][1]&&item.price<=powerFacets.price[Number(index)][2]))return false;
  }
  return item.price>=powerDigits(powerFilterState.controls.min.value,0)&&item.price<=powerDigits(powerFilterState.controls.max.value,Infinity);
}
function powerWord(count){const n=count%10,h=count%100;return n===1&&h!==11?'товар':n>=2&&n<=4&&(h<12||h>14)?'товара':'товаров';}
const updatePowerArticles = articleSelection.bindModal(powerModal, 'powerSupply', powerFacetHas);
function renderPower(){
  catalogUI.bindPriceRange(powerModal, Math.min(...powerSupplies.filter(item => item.price != null).map(item => item.price)), Math.max(...powerSupplies.filter(item => item.price != null).map(item => item.price)));
  powerCardCollection.ensure();
  powerFilterState = readPowerFilters();
  const visible=powerSupplies.filter((item)=>powerMatches(item));
  updatePowerArticles(visible, {compatible: powerFilterState.controls.compatible.checked, facets: powerFilterState.facets});
  visible.sort((a,b)=>powerSort==='price-asc'?catalogUI.comparePrice(a,b):powerSort==='price-desc'?catalogUI.comparePrice(a,b,true):powerSort==='rating-desc'?b.rating-a.rating:a.order-b.order);
  powerList.replaceChildren(...visible.map((item)=>powerCardById.get(item.id)));
  catalogUI.syncCards(powerCards,{selected:window.configuratorState.powerSupply,otherSocket:null});
  powerCards.forEach((card)=>card.classList.toggle('is-alternative-socket',!powerCompatibleWithBuild(powerById.get(card.dataset.productId))));
  powerModal.querySelector('.power-result-count').textContent=`${visible.length} ${powerWord(visible.length)}`;
  powerModal.querySelector('.power-empty').hidden=visible.length>0;
  for(const [facet,options] of Object.entries(powerFacets))powerPanel.querySelectorAll(`[data-facet="${facet}"] label`).forEach((label,index)=>{
    const count=powerSupplies.filter((item)=>powerMatches(item,facet)&&(facet==='price'?item.price!=null&&item.price>=options[index][1]&&item.price<=options[index][2]:powerFacetHas(item,facet,options[index]))).length;
    const display=facet==='price'?options[index][0]:facet==='power'?`${options[index]} Вт`:facet==='fan'?`${options[index]} × ${options[index]} мм`:options[index];
    label.querySelector('span').textContent=`${display} (${count})`;
    const input=label.querySelector('input');input.disabled=count===0&&!input.checked;label.classList.toggle('is-unavailable',input.disabled);
  });
  powerModal.querySelector('.power-compatible-chip').hidden=!powerCompatible.checked;
  powerCompatible.nextElementSibling.textContent=`Совместимые товары (${powerSupplies.filter((item)=>powerMatches(item,'compatible')&&powerCompatibleWithBuild(item)).length})`;
  powerRating.nextElementSibling.textContent=`Рейтинг 4.5 и выше (${powerSupplies.filter((item)=>powerMatches(item,'rating')&&item.rating>=4.5).length})`;
  catalogUI.setFilterLabel(powerReliable.closest('label'), `Надёжные модели (${powerSupplies.filter((item)=>powerMatches(item,'reliable')&&item.reliable).length})`);
  const chips=powerModal.querySelector('.power-active-chips');chips.replaceChildren();
  for(const facet of Object.keys(powerFacets))for(const label of powerPanel.querySelectorAll(`[data-facet="${facet}"] label`))if(label.querySelector('input').checked){
    const names={price:'Цена',brand:'Бренд',power:'Мощность',certificate:'80 PLUS',fan:'Вентилятор',gpuConnector:'PCI-E',color:'Цвет',detachable:'Кабели',formFactor:'Форм-фактор',standard:'Стандарт',pfc:'PFC',cpuConnector:'Питание процессора',lighting:'Подсветка',sleeving:'Оплетка'};
    chips.append(catalogUI.chip(`${names[facet]}: ${label.querySelector('span').textContent.replace(/ \(\d+\)$/,'')}`,()=>{label.querySelector('input').checked=false;renderPower();}));
  }
  syncPowerTags();
  catalogUI.refresh(powerList,powerModal);
}
powerPanel.addEventListener('change',renderPower);
powerPanel.querySelectorAll('.filter-heading').forEach(button=>catalogUI.bindFacetDisclosure(button.closest('.filter-section')));
powerModal.querySelector('.power-compatible-chip').addEventListener('click',()=>{powerCompatible.checked=false;renderPower();});
powerModal.querySelector('.power-reset').addEventListener('click',()=>{
  powerPanel.querySelectorAll('[data-facet] input[type=checkbox]').forEach((input)=>input.checked=false);
  powerCompatible.checked=false;powerRating.checked=false;powerReliable.checked=false;powerModal.querySelector('.power-in-stock').checked=true;powerModal.querySelector('.power-later').checked=true;
  powerModal.querySelectorAll('.power-min,.power-max').forEach((input)=>input.value='');renderPower();
});
powerModal.querySelector('.price-reset').addEventListener('click',()=>{
  powerPanel.querySelectorAll('[data-facet=price] input').forEach((input)=>input.checked=false);
  powerModal.querySelectorAll('.power-min,.power-max').forEach((input)=>input.value='');renderPower();
});
powerModal.querySelectorAll('.power-min,.power-max').forEach((input)=>input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'');renderPower();}));
catalogUI.bindFilterSearch(powerModal.querySelector('.power-filter-search'),powerPanel);
powerModal.querySelector('.power-brand-search').addEventListener('input',(event)=>{
  const query=event.target.value.trim().toLocaleLowerCase('ru');
  powerPanel.querySelectorAll('[data-facet=brand] label').forEach((label)=>label.hidden=!!query&&!label.textContent.toLocaleLowerCase('ru').includes(query));
});
powerModal.querySelector('.all-filters').addEventListener('click',()=>{
  powerPanel.querySelectorAll('.filter-section').forEach((section)=>{section.classList.remove('is-collapsed');section.querySelector('.filter-heading').setAttribute('aria-expanded','true');});
  powerModal.querySelector('.processor-filters').scrollTo({top:0,behavior:'smooth'});
});
const powerSortTrigger=powerModal.querySelector('.power-sort-trigger'),powerSortMenu=powerModal.querySelector('.power-sort-menu');
catalogUI.bindSort(powerSortTrigger, powerSortMenu, value => {powerSort = value; renderPower();});
function openPowerModal(){
  catalogUI.openModal(powerModal);
  renderPower();
}
function closePowerModal(){
  catalogUI.closeModal(powerModal,powerRow.querySelector('#add-power-supply,.power-replace'));
}
powerModal.querySelector('.power-close').addEventListener('click',closePowerModal);
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!powerModal.hidden){if(!powerSortMenu.hidden){powerSortMenu.hidden=true;powerSortTrigger.setAttribute('aria-expanded','false');}else closePowerModal();}});
function addPower(item, shouldClose = true) {
  buildView.select('powerSupply', item);
  if (shouldClose) closePowerModal();
}
catalogUI.bindActions(powerList,(card)=>addPower(powerById.get(card.dataset.productId)), item=>addPower(item, false));
window.addEventListener('configurator:state-changed', () => { if (!powerModal.hidden) renderPower(); });

catalogLoader.register('power-supply', openPowerModal);
