// Build rows and restoration do not depend on any modal being initialized.
const buildView = (() => {
const configuratorState = buildStore.state;
const processorRow = document.getElementById('processor-row');
const boardRow = document.getElementById('motherboard-row');
const powerRow = document.getElementById('power-supply-row');
const caseRow = document.getElementById('case-row');
const gpuRow = document.getElementById('gpu-row');
const rows = {processor:processorRow,motherboard:boardRow,powerSupply:powerRow,computerCase:caseRow,gpu:gpuRow};
const emptyRows = new Map(Object.entries(rows).map(([key,row]) => [key,row.innerHTML]));
const money = value => value == null ? '—' : `${value.toLocaleString('ru-RU')} ₽`;
const powerMoney = money, caseMoney = money, gpuMoney = money;
const buildSummary = document.getElementById('build-summary');
const buildWarning = document.getElementById('build-warning');
const tipsCard = document.querySelector('.tips-card');
function renderBuildState() {
  const selected = [configuratorState.processor, configuratorState.motherboard, configuratorState.powerSupply, configuratorState.computerCase, configuratorState.gpu].filter(Boolean);
  const count = selected.length;
  const requiredCount = selected.filter(item => item.id !== configuratorState.gpu?.id).length;
  document.getElementById('required-count').textContent = String(requiredCount);
  document.getElementById('progress-fill').style.width = `${requiredCount * 100 / 7}%`;
  tipsCard.hidden = count > 0;
  buildSummary.hidden = count === 0;
  buildWarning.hidden = count === 0;
  if (!count) {
    return;
  }
  const hasUnknownPrice = selected.some((item) => item.price == null);
  const total = hasUnknownPrice ? null : selected.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('summary-item-count').textContent = `${count} ${count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}`;
  document.getElementById('summary-price').textContent = hasUnknownPrice ? '—' : `${total.toLocaleString('ru-RU')} ₽`;
  const summaryMonthly = document.getElementById('summary-monthly');
  summaryMonthly.hidden = hasUnknownPrice;
  if (!hasUnknownPrice) summaryMonthly.textContent = `от ${Math.round(total * .0975).toLocaleString('ru-RU')} ₽/ мес.`;
  const summaryAvailability = buildSummary.querySelector('.summary-availability');
  summaryAvailability.hidden = selected.some((item) => item.stores == null);
  if (!summaryAvailability.hidden) document.getElementById('summary-stores').textContent = selected[0].stores;
  const cpuFit=catalogUI.cpuBoardFit(configuratorState.processor,configuratorState.motherboard);
  const boardFit=catalogUI.caseBoardFit(configuratorState.computerCase,configuratorState.motherboard);
  const powerFit=catalogUI.casePowerFit(configuratorState.computerCase,configuratorState.powerSupply);
  const gpuCaseFit=catalogUI.gpuCaseFit(configuratorState.gpu,configuratorState.computerCase);
  const gpuPowerFit=catalogUI.gpuPowerFit(configuratorState.gpu,configuratorState.powerSupply);
  const all=catalogUI.combineFit(cpuFit,boardFit,powerFit,gpuCaseFit,gpuPowerFit);
  for(const [row,fit] of [[processorRow,cpuFit],[boardRow,catalogUI.combineFit(cpuFit,boardFit)],[powerRow,catalogUI.combineFit(powerFit,gpuPowerFit)],[caseRow,catalogUI.combineFit(boardFit,powerFit,gpuCaseFit)],[gpuRow,catalogUI.combineFit(gpuCaseFit,gpuPowerFit)]]) {
    const status=row.querySelector('.selected-status');if(status) catalogUI.updateFitStatus(status,fit);
  }
  const caseFit=catalogUI.combineFit(boardFit,powerFit,gpuCaseFit);
  buildWarning.querySelector('strong').textContent=cpuFit===false ? 'Процессор и материнская плата несовместимы' : caseFit===false ? 'Корпус несовместим с выбранными комплектующими' : gpuPowerFit===false ? 'Видеокарта несовместима с блоком питания' : all==null ? 'Недостаточно данных для проверки совместимости' : 'Отсутствуют обязательные комплектующие';
  buildWarning.querySelector('span').textContent=cpuFit===false ? 'Выберите плату с подходящим сокетом' : caseFit===false ? 'Выберите корпус для выбранных комплектующих' : gpuPowerFit===false ? 'Выберите блок питания подходящей мощности и с нужными разъёмами' : all==null ? 'Совместимость не подтверждена для неполных характеристик' : 'Добавьте их для завершения сборки';
}
function addProcessor(item) {
  catalogUI.renderSelectedRow(processorRow, {kind: 'processor', name: item.name, image: item.image, specs: item.summary, price: item.price == null ? '—' : `${item.price.toLocaleString('ru-RU')} ₽`, stores: item.stores});
  buildStore.setSelection('processor', item);
}
function addBoard(board){
  catalogUI.renderSelectedRow(boardRow, {
    kind: 'board',
    name: `Материнская плата ${board.name}`,
    image: board.image,
    specs: catalogUI.categoryCardData(board).specs.map(([key,value])=>`${key}: ${value}`).join(', '),
    price: money(board.price), stores: board.stores
  });
  buildStore.setSelection('motherboard', board);
}
function addPower(item){
  catalogUI.renderSelectedRow(powerRow, {
    kind: 'power',
    name: `Блок питания ${item.name}`,
    image: powerImage(item),
    imageFallback: item.imageFallback,
    specs: catalogUI.categoryCardData(item).specs.map(([key,value])=>`${key}: ${value}`).join(', '),
    price: powerMoney(item.price), stores: item.stores
  });
  buildStore.setSelection('powerSupply', item);
}
function addCase(item) {
  catalogUI.renderSelectedRow(caseRow, {
    kind: 'case',
    name: `Корпус ${item.name}`,
    image: item.image,
    imageFallback: 'assets/configurator/12AYWCT9HB3G0WM7V0YQQ57H79.svg',
    specs: catalogUI.categoryCardData(item).specs.map(([key,value])=>`${key}: ${value}`).join(', '),
    price: caseMoney(item.price), stores: item.stores
  });
  buildStore.setSelection('computerCase', item);
}
function addGpu(item) {
  catalogUI.renderSelectedRow(gpuRow, {
    kind: 'gpu',
    name: item.name,
    image: item.image,
    specs: catalogUI.categoryCardData(item).specs.map(([key,value])=>`${key}: ${value}`).join(', '),
    price: gpuMoney(item.price), stores: item.stores
  });
  buildStore.setSelection('gpu', item);
}

const selectors = {processor:addProcessor,motherboard:addBoard,powerSupply:addPower,computerCase:addCase,gpu:addGpu};
function select(key,item) { selectors[key](item); }
function clear(key) { catalogUI.clearSelectedRow(rows[key],emptyRows.get(key)); buildStore.setSelection(key,null); }
buildStore.subscribe(renderBuildState);
let restoration;
let discardRestoredBuild = false;
function restore() {
  if (restoration) return restoration;
  restoration = (async () => {
    const entries = await Promise.all(Object.entries(catalogLoader.categories).map(async ([id,config]) => {
      const saved = buildStore.savedSelection?.[config.key];
      if (!saved) return null;
      const catalog = await catalogLoader.data(id);
      const item = catalogUI.resolveSavedProduct(saved,catalog);
      return item ? [config.key,item] : null;
    }));
    if (!discardRestoredBuild) for (const entry of entries) if(entry) select(...entry);
    buildStore.finishRestore();
  })().catch(error => {restoration = null; throw error;});
  return restoration;
}
document.addEventListener('click',event => {
  const remove = event.target.closest('.processor-remove,.board-remove,.power-remove,.case-remove,.gpu-remove');
  if (remove) { const entry=Object.entries(rows).find(([,row])=>row.contains(remove)); if(entry) clear(entry[0]); }
});
const clearBuildButton = document.getElementById('clear-build');
const configArea = document.querySelector('.config-area');
let clearBuildAnimation;
clearBuildButton.addEventListener('click', () => {
  const returnFocus = document.activeElement === clearBuildButton;
  clearBuildAnimation?.cancel();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearBuildAnimation = configArea.animate([{opacity:.45,offset:0},{opacity:.45,offset:.25},{opacity:1,offset:1}], {duration:420,easing:'ease-out'});
  }
  buildStore.batch(() => {Object.keys(rows).forEach(clear); window.dispatchEvent(new Event('configurator:clear-build'));});
  if (returnFocus) processorRow.querySelector('#add-processor').focus({preventScroll:true});
});
// Study preparation is synchronous and wins over a pending catalog restoration.
function resetForStudy() {
  discardRestoredBuild = true;
  window.dispatchEvent(new Event('configurator:study-reset'));
  buildStore.batch(() => {
    buildStore.finishRestore();
    Object.keys(rows).forEach(clear);
    window.dispatchEvent(new Event('configurator:clear-build'));
  });
}
return {select,clear,restore,resetForStudy};
})();
catalogLoader.connect(buildView);
buildView.restore().catch(error => console.warn('Build restoration will retry on the next interaction',error));
