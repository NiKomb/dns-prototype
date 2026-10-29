const boardModal = document.getElementById('motherboard-modal');
boardModal.className = 'processor-modal motherboard-modal';
catalogUI.mountModal(boardModal, {"title": "Материнские платы", "countAttributes": {"id": "board-result-count"}, "countText": "", "closeAttributes": {"class": "processor-modal-close board-close", "type": "button", "aria-label": "Закрыть окно выбора материнской платы"}, "filtersLabel": "Фильтры материнских плат", "resultsLabel": "Список материнских плат"},
  catalogUI.controlMarkup("filter-search", {}, {"input": {"class": "board-filter-search", "type": "search", "placeholder": "Поиск по фильтрам", "aria-label": "Поиск по фильтрам"}}) +
  catalogUI.controlMarkup("filter-panel", {}, "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "availability", "data-filter-id": "availability"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Наличие в магазинах"}) + "</h3>" +
    catalogUI.controlMarkup("store-select", {}, {"text": "В любом из 12 магазинов"}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "in-stock"}, {"input": {"type": "checkbox", "checked": null}, "text": "В наличии", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-today"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: сегодня", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-tomorrow"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: завтра", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "order-later"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: позже", "wrapped": false, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"data-filter-id": "unavailable"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Отсутствующие в продаже", "wrapped": false, "hint": "", "shield": false})) + "\n" +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "compatible"}, {"input": {"class": "board-compatible", "type": "checkbox", "checked": null}, "text": "Совместимые товары", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line"}, {"input": {"class": "board-rating", "type": "checkbox"}, "text": "Рейтинг 4.8 и выше", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "reliable"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Надёжные модели (0)", "wrapped": true, "hint": "минимум обращений в сервис", "shield": true}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "has-review"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Есть обзор (0)", "wrapped": true, "hint": "", "shield": false}) +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line", "data-filter-id": "review-bonus"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Бонусы за отзыв (0)", "wrapped": true, "hint": "", "shield": false}) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "price-filter", "data-facet": "price"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Цена"}) + "</h3>" +
    catalogUI.controlMarkup("price-inputs", {}, {"inputs": [{"class": "board-min", "type": "text", "inputmode": "numeric", "aria-label": "Цена от"}, {"class": "board-max", "type": "text", "inputmode": "numeric", "aria-label": "Цена до"}]}) +
    catalogUI.controlMarkup("price-track", {}, {"handle": false}) +
    catalogUI.controlMarkup("board-options", {}, "") +
    catalogUI.controlMarkup("price-reset", {"type": "button"}, "Сбросить")) + "\n" +
    catalogUI.controlMarkup("filter-option", {"class": "filter-line"}, {"input": {"type": "checkbox", "disabled": null}, "text": "Создано DNS (0)", "wrapped": true, "hint": "", "shield": false}) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "brand-filter", "data-facet": "brand"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Бренд"}) + "</h3>" +
    catalogUI.controlMarkup("socket-search", {"class": "brand-search"}, {"input": {"class": "board-brand-search", "type": "search", "placeholder": "Поиск", "aria-label": "Поиск по брендам"}}) +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "socket-filter is-collapsed", "data-facet": "socket"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Сокет"}) + "</h3>" +
    catalogUI.controlMarkup("socket-search", {}, {"input": {"class": "board-socket-search", "type": "search", "placeholder": "Поиск", "aria-label": "Поиск по сокетам"}}) +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "memory"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Тип поддерживаемой памяти"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "form"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Форм-фактор"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "chipsetAmd"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Чипсет AMD"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "pciVersion"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Версия PCI Express"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "slots"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Количество слотов памяти"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "chipsetIntel"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Чипсет Intel"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "cpuFamily"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Для процессоров"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "m2"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Количество разъемов M.2"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "wifi"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Стандарт Wi-Fi"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n" +
    catalogUI.controlMarkup("filter-section", {"class": "board-facet is-collapsed", "data-facet": "gaming"}, "<h3>" +
    catalogUI.controlMarkup("filter-heading", {"type": "button", "aria-expanded": "false"}, {"text": "Для игрового компьютера"}) + "</h3>" +
    catalogUI.controlMarkup("board-options", {}, "")) + "\n<div class=\"all-filters-wrap\">" +
    catalogUI.controlMarkup("all-filters", {"type": "button"}, "Все фильтры") + "</div>"),
  catalogUI.controlMarkup("processor-toolbar", {}, catalogUI.controlMarkup("toolbar-main", {}, "<label class=\"product-search\"><input class=\"board-product-search\" type=\"search\" placeholder=\"Поиск по комплектующим\" aria-label=\"Поиск по материнским платам\"></label>" +
    catalogUI.controlMarkup("toolbar-select", {"class": "sort-control"}, "<small>Сортировка:</small>" +
    catalogUI.controlMarkup("sort-trigger", {"class": "board-sort-trigger", "type": "button", "aria-expanded": "false"}, {"text": "Сначала популярные"}) +
    catalogUI.controlMarkup("sort-menu", {"class": "board-sort-menu", "role": "menu", "hidden": null}, catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-asc"}, "Сначала недорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "price-desc"}, "Сначала дорогие") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "popular", "aria-checked": "true"}, "Сначала популярные") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "reviews-desc"}, "По количеству отзывов") +
    catalogUI.controlMarkup("sort-option", {"type": "button", "data-sort": "rating-desc"}, "Сначала с лучшей оценкой"))) +
    catalogUI.controlMarkup("toolbar-select", {}, "<small>Группировка:</small><span>Отсутствует <b>⌄</b></span>")) +
    catalogUI.controlMarkup("catalog-quick", {"class": "board-quick"}, "") +
    (catalogUI.controlMarkup("compatible-chip", {"class": "board-compatible-chip", "type": "button"}, {"text": "Совместимые товары"}) + "<span class=\"board-active-chips\"></span>" +
    catalogUI.controlMarkup("reset-chip", {"class": "board-reset", "type": "button"}, "Сбросить фильтры"))) +
  "<div class=\"processor-products board-products\"></div>" +
  catalogUI.controlMarkup("products-empty", {"class": "board-empty", "hidden": null}, "В прототипе нет материнских плат с такими параметрами"));
// DNS places popular socket tags above sorting; the search field is hidden in this layout.
const boardQuick = boardModal.querySelector('.board-quick');
const boardQuickWrap = document.createElement('div');
boardQuickWrap.className = 'catalog-quick-wrap board-quick-wrap';
const boardQuickMore = catalogUI.controlElement('power-quick-more', {type:'button', 'aria-expanded':'false'}, 'Показать ещё');
boardQuickWrap.append(boardQuick, boardQuickMore);
boardModal.querySelector('.toolbar-main').prepend(boardQuickWrap);
catalogUI.bindQuickMore(boardQuickMore, boardQuick);

const boardRow = document.getElementById('motherboard-row');
const boardPanel = boardModal.querySelector('.filter-panel');
const boardList = boardModal.querySelector('.board-products');
const boardFacets = {
  price: [['До 7 000 ₽',0,7000],['7 001 - 10 000 ₽',7001,10000],['10 001 - 16 000 ₽',10001,16000],['16 001 - 25 000 ₽',16001,25000],['25 001 ₽ и более',25001,Infinity]],
  brand: ['ASRock','ASUS','GIGABYTE','MSI'],
  socket: ['AM5','AM4','LGA 1700','LGA 1851','LGA 1200'],
  memory: ['DDR4','DDR5'],
  form: ['Standard-ATX','Micro-ATX','Mini-ITX'],
  chipsetAmd: [...new Set(boards.map((board) => board.chipsetAmd).filter(Boolean))].sort(),
  pciVersion: ['4.0','5.0'],
  slots: ['2','4'],
  chipsetIntel: [...new Set(boards.map((board) => board.chipsetIntel).filter(Boolean))].sort(),
  cpuFamily: [...new Set(boards.map((board) => board.cpuFamily).filter(value=>value!=null))],
  m2: [...new Set(boards.map((board) => board.m2).filter((value) => value != null).map(String))].sort(),
  wifi: ['Есть','Нет'],
  gaming: ['Да','Нет']
};
for(const facet of ['brand','socket','memory','form','slots','pciVersion']) {
  boardFacets[facet]=[...new Set([...boardFacets[facet],...boards.flatMap(item=>item[facet]==null ? [] : [facet==='pciVersion' ? item[facet].toFixed(1) : String(item[facet])])])];
}
for (const [facet, options] of Object.entries(boardFacets)) {
  const container = boardPanel.querySelector(`[data-facet="${facet}"] .board-options`);
  options.forEach((option, index) => {
    const value = facet === 'price' ? String(index) : option;
    const label = catalogUI.filterOption();
    label.dataset.value = value;
    label.querySelector('span').textContent = facet === 'price' ? option[0] : option;
    container.append(label);
  });
}

const money = (amount) => amount == null ? '—' : `${amount.toLocaleString('ru-RU')} ₽`;
function boardCard(board) {
  const card = catalogUI.productCard(catalogUI.motherboardCardData(board));
  card.classList.add('board-product');
  card.querySelector('.product-buttons button:not(.favorite)').classList.add('board-add');
  return card;
}
const boardCardCollection = catalogUI.deferredCards(boards, boardCard);
const cards = boardCardCollection.cards;
const boardById = new Map(boards.map((board) => [board.id, board]));
const boardCardById = boardCardCollection.byId;
let boardSort = 'popular';
const readBoardFilters = catalogUI.createFilterReader(boardModal, {
  inStock: '.availability input[type="checkbox"]',
  compatible: '.board-compatible',
  rating: '.board-rating',
  query: '.board-product-search',
  min: '.board-min',
  max: '.board-max',
});
let boardFilterState;
const selectedFacet = (facet) => boardFilterState.facets.get(facet) || [];
const digits = (value, fallback) => { const match = String(value).replace(/\D/g,''); return match ? Number(match) : fallback; };
const boardCompatible = boardModal.querySelector('.board-compatible');
const boardRating = boardModal.querySelector('.board-rating');
const boardInStock = boardModal.querySelector('.availability input[type="checkbox"]');
function boardMatches(board, skip = '') {
  const cpu = window.configuratorState.processor;
  if (!boardFilterState.controls.inStock.checked) return false;
  if (skip !== 'compatible' && boardFilterState.controls.compatible.checked && (!catalogUI.cpuFitsBoard(cpu,board) || !catalogUI.caseFitsBoard(window.configuratorState.computerCase, board))) return false;
  if (skip !== 'rating' && boardFilterState.controls.rating.checked && board.rating < 4.8) return false;
  const query = boardFilterState.controls.query.value.trim().toLocaleLowerCase('ru');
  if (query && !board.name.toLocaleLowerCase('ru').includes(query)) return false;
  for (const facet of Object.keys(boardFacets).filter((key) => key !== 'price')) {
    const selected = selectedFacet(facet);
    if (facet !== skip && selected.length && !selected.some(value => productContract.has(board,facet,value))) return false;
  }
  const hasManualPrice = boardFilterState.controls.min.value !== '' || boardFilterState.controls.max.value !== '';
  if (board.price == null) return !hasManualPrice && (skip === 'price' || !selectedFacet('price').length);
  if (skip !== 'price') {
    const selected = selectedFacet('price');
    if (selected.length && !selected.some((index) => board.price >= boardFacets.price[Number(index)][1] && board.price <= boardFacets.price[Number(index)][2])) return false;
  }
  const min = digits(boardFilterState.controls.min.value, 0);
  const max = digits(boardFilterState.controls.max.value, Infinity);
  return board.price >= min && board.price <= max;
}
function boardWord(count) { const a=count%10, b=count%100; return a===1&&b!==11?'товар':a>=2&&a<=4&&(b<12||b>14)?'товара':'товаров'; }
const syncBoardTags = catalogUI.bindFacetTags(boardQuick, catalogTags.board, boardPanel, boards,
  (item,facet,value) => productContract.has(item,facet,value), renderBoards);
const updateBoardArticles = articleSelection.bindModal(boardModal, 'motherboard', (item,facet,value) => productContract.has(item,facet,value));
function renderBoards() {
  catalogUI.bindPriceRange(boardModal, Math.min(...boards.filter(item => item.price != null).map(item => item.price)), Math.max(...boards.filter(item => item.price != null).map(item => item.price)));
  boardCardCollection.ensure();
  boardFilterState = readBoardFilters();
  const visible = boards.filter((board) => boardMatches(board));
  updateBoardArticles(visible, {compatible: boardFilterState.controls.compatible.checked, facets: boardFilterState.facets});
  visible.sort((a,b) => {
    if (boardSort === 'price-asc' || boardSort === 'price-desc') {
      if (a.price == null || b.price == null) return (a.price == null) - (b.price == null) || a.order - b.order;
      return boardSort === 'price-asc' ? a.price - b.price : b.price - a.price;
    }
    return boardSort === 'reviews-desc' ? b.reviews - a.reviews : boardSort === 'rating-desc' ? b.rating - a.rating : a.order - b.order;
  });
  boardList.replaceChildren(...visible.map((board) => boardCardById.get(board.id)));
  syncBoardButtons();
  boardModal.querySelector('#board-result-count').textContent = `${visible.length} ${boardWord(visible.length)}`;
  boardModal.querySelector('.board-empty').hidden = visible.length>0;
  for (const [facet, options] of Object.entries(boardFacets)) {
    boardPanel.querySelectorAll(`[data-facet="${facet}"] label`).forEach((label, index) => {
      const count = boards.filter((board) => boardMatches(board, facet) && (facet==='price' ? board.price != null && board.price>=options[index][1]&&board.price<=options[index][2] : productContract.has(board,facet,options[index]))).length;
      label.querySelector('span').textContent = `${facet==='price'?options[index][0]:options[index]} (${count})`;
      const input = label.querySelector('input');
      input.disabled = count===0 && !input.checked;
      label.classList.toggle('is-unavailable',input.disabled);
    });
  }
  boardModal.querySelector('.board-compatible-chip').hidden = !boardCompatible.checked;
  boardModal.querySelector('.board-compatible').nextElementSibling.textContent = `Совместимые товары (${boards.filter((board)=>boardMatches(board,'compatible')&&catalogUI.cpuFitsBoard(window.configuratorState.processor,board)&&catalogUI.caseFitsBoard(window.configuratorState.computerCase,board)).length})`;
  boardModal.querySelector('.board-rating').nextElementSibling.textContent = `Рейтинг 4.8 и выше (${boards.filter((board)=>boardMatches(board,'rating')&&board.rating>=4.8).length})`;
  const chips = boardModal.querySelector('.board-active-chips');
  chips.replaceChildren();
  for (const facet of Object.keys(boardFacets)) for (const label of boardPanel.querySelectorAll(`[data-facet="${facet}"] label`)) if (label.querySelector('input').checked) {
    const names = {brand:'Бренд',socket:'Сокет',memory:'Память',form:'Форм-фактор',price:'Цена',chipsetAmd:'Чипсет AMD',pciVersion:'PCI Express',slots:'Слотов памяти',chipsetIntel:'Чипсет Intel',cpuFamily:'Для процессоров',m2:'Разъемов M.2',wifi:'Wi-Fi',gaming:'Игровой компьютер'};
    const text = `${names[facet]}: ${label.querySelector('span').textContent.replace(/ \(\d+\)$/,'')}`;
    chips.append(catalogUI.chip(text,()=>{label.querySelector('input').checked=false;renderBoards();}));
  }
  syncBoardTags();
  catalogUI.refresh(boardList, boardModal);
}
boardPanel.addEventListener('change', renderBoards);
boardPanel.querySelectorAll('.filter-heading').forEach(button=>catalogUI.bindFacetDisclosure(button.closest('.filter-section')));
boardModal.querySelector('.board-compatible-chip').addEventListener('click',()=>{boardCompatible.checked=false;renderBoards();});
boardModal.querySelector('.board-reset').addEventListener('click',()=>{boardPanel.querySelectorAll('[data-facet] input[type=checkbox]').forEach((input)=>input.checked=false);boardCompatible.checked=false;boardRating.checked=false;boardModal.querySelectorAll('.board-min,.board-max,.board-product-search').forEach((input)=>input.value='');renderBoards();});
boardModal.querySelector('.price-reset').addEventListener('click',()=>{boardPanel.querySelectorAll('[data-facet=price] input').forEach((input)=>input.checked=false);boardModal.querySelectorAll('.board-min,.board-max').forEach((input)=>input.value='');renderBoards();});
boardModal.querySelector('.board-product-search').addEventListener('input',renderBoards);
boardModal.querySelectorAll('.board-min,.board-max').forEach((input)=>input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'');renderBoards();}));
catalogUI.bindFilterSearch(boardModal.querySelector('.board-filter-search'),boardPanel);
boardModal.querySelector('.board-socket-search').addEventListener('input',(event)=>{const query=event.target.value.trim().toLocaleLowerCase('ru');boardPanel.querySelectorAll('[data-facet=socket] label').forEach((label)=>label.hidden=!!query&&!label.textContent.toLocaleLowerCase('ru').includes(query));});
boardModal.querySelector('.board-brand-search').addEventListener('input',(event)=>{const query=event.target.value.trim().toLocaleLowerCase('ru');boardPanel.querySelectorAll('[data-facet=brand] label').forEach((label)=>label.hidden=!!query&&!label.textContent.toLocaleLowerCase('ru').includes(query));});
boardModal.querySelector('.all-filters').addEventListener('click',()=>{boardPanel.querySelectorAll('.filter-section').forEach((section)=>{section.classList.remove('is-collapsed');section.querySelector('.filter-heading').setAttribute('aria-expanded','true');});boardModal.querySelector('.processor-filters').scrollTo({top:0,behavior:'smooth'});});
const boardSortTrigger=boardModal.querySelector('.board-sort-trigger');
const boardSortMenu=boardModal.querySelector('.board-sort-menu');
catalogUI.bindSort(boardSortTrigger, boardSortMenu, value => {boardSort = value; renderBoards();});
function openBoardModal(){catalogUI.openModal(boardModal);renderBoards();}
function closeBoardModal(){catalogUI.closeModal(boardModal,boardRow.querySelector('#add-motherboard,.board-replace'));}
boardModal.querySelector('.board-close').addEventListener('click',closeBoardModal);
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!boardModal.hidden){if(!boardSortMenu.hidden){boardSortMenu.hidden=true;boardSortTrigger.setAttribute('aria-expanded','false');}else closeBoardModal();}});
function syncBoardButtons(){
  catalogUI.syncCards(cards,{
    selected:window.configuratorState.motherboard,
    otherSocket:window.configuratorState.processor?.socket,
    socket:(card)=>boardById.get(card.dataset.productId).socket
  });
  cards.forEach((card) => card.classList.toggle('is-alternative-socket',
    !catalogUI.cpuFitsBoard(window.configuratorState.processor,boardById.get(card.dataset.productId)) ||
    !catalogUI.caseFitsBoard(window.configuratorState.computerCase, boardById.get(card.dataset.productId))));
}
function addBoard(board, shouldClose = true) {
  buildView.select('motherboard', board);
  if (shouldClose) closeBoardModal();
}
catalogUI.bindActions(boardList,(card)=>addBoard(boardById.get(card.dataset.productId)), item=>addBoard(item, false));
window.addEventListener('configurator:state-changed', () => { if (!boardModal.hidden) renderBoards(); });

catalogLoader.register('motherboard', openBoardModal);
