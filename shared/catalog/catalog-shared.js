// Typed product values shared by all five catalogs. No inference from product text.
const productContract = (() => {
  const field = (key, title, type = 'string', unit = '', shape = null) => ({key, title, type, unit, shape});
  const n = (key,title,unit='') => field(key,title,'number',unit);
  const set = (key,title) => field(key,title,'set');
  const records = (key,title,shape) => field(key,title,'records','',shape);
  const ports = {type:'string',count:'number'};
  const powerPorts = {...ports,standard:'string'};
  const fans = {count:'number',diameterMm:'number'};
  const schemas = {
    processor:[field('socket','Сокет'),field('family','Семейство'),field('model','Модель'),field('generation','Поколение'),n('cores','Общее количество ядер'),n('performanceCores','Производительные ядра'),n('efficientCores','Энергоэффективные ядра'),n('baseClock','Базовая частота производительных ядер','ГГц'),n('boostClock','Максимальная частота производительных ядер','ГГц'),n('efficientBaseClockGhz','Базовая частота энергоэффективных ядер','ГГц'),n('efficientBoostClockGhz','Максимальная частота энергоэффективных ядер','ГГц'),n('tdp','Тепловыделение (TDP)','Вт'),n('cacheL2Mb','Кэш L2','МБ'),n('cacheL3Mb','Кэш L3','МБ'),field('graphics','Встроенная графика','boolean'),field('graphicsModel','Модель встроенной графики'),set('memory','Типы памяти')],
    motherboard:[field('socket','Сокет'),field('form','Форм-фактор'),field('memory','Тип памяти'),field('chipset','Чипсет'),field('chipsetVendor','Производитель чипсета'),n('slots','Слоты памяти'),n('pcie','Слоты PCIe x16'),n('sata','Порты SATA'),n('m2','Разъёмы M.2'),n('pciVersion','Версия PCIe'),set('cpuFamilies','Семейства процессоров'),field('wifi','Wi-Fi','boolean'),field('gaming','Игровое позиционирование','boolean')],
    gpu:[field('gpuVendor','Производитель GPU'),field('chipModel','Графический процессор'),n('pcieGeneration','Версия PCIe'),field('pcieFormFactor','Форм-фактор PCIe'),n('pcieLanes','Линии PCIe'),n('memoryGb','Видеопамять','ГБ'),field('memoryType','Тип видеопамяти'),n('busBits','Шина памяти','бит'),n('clockMinMhz','Нижняя указанная частота видеочипа','МГц'),n('clockMaxMhz','Верхняя указанная частота видеочипа','МГц'),records('videoPorts','Видеоразъёмы',ports),records('powerConnectors','Разъёмы питания GPU',powerPorts),n('adapter8PinCount','8-pin PCIe для переходника'),n('cardLengthMm','Длина карты','мм'),n('cardWidthMm','Ширина карты','мм'),n('cardThicknessMm','Толщина карты','мм'),n('expansionSlots','Занимаемые слоты'),n('recommendedPsuW','Рекомендуемая мощность БП','Вт'),n('boardPowerW','Мощность платы GPU','Вт'),n('fanCount','Количество вентиляторов'),field('fanType','Тип вентиляторов'),field('coolingType','Тип охлаждения'),field('color','Цвет'),field('lighting','Подсветка','boolean'),field('dualBios','Двойной BIOS','boolean')],
    'power-supply':[n('power','Мощность','Вт'),field('certificate','80 PLUS'),field('formFactor','Форм-фактор'),field('standard','Стандарт ATX'),field('detachable','Модульность'),records('fans','Вентиляторы',fans),records('cpuConnectors','Разъёмы питания CPU',ports),records('gpuConnectors','Разъёмы питания GPU',powerPorts),n('sata','Разъёмы SATA'),field('pfc','PFC'),field('color','Цвет'),field('lighting','Подсветка'),field('sleeving','Оплётка')],
    case:[set('forms','Форм-факторы плат'),set('psuForms','Форм-факторы БП'),field('size','Типоразмер'),n('slots','Слоты расширения'),records('fanGroups','Вентиляторы в комплекте',fans),records('interfacePorts','Интерфейсы',ports),n('gpu','Максимальная длина видеокарты','мм'),n('cooler','Максимальная высота кулера','мм'),field('psu','Размещение БП'),field('color','Цвет'),field('lighting','Подсветка'),field('window','Материал окна'),set('features','Особенности')]
  };
  // Additional processor fields from the catalog contract; unverified facts remain null.
  schemas.processor.push(field('warranty','Гарантия'),field('manufacturerCode','Код производителя'),n('releaseYear','Год релиза'),field('coolerIncluded','Система охлаждения в комплекте','boolean'),field('thermalInterface','Термоинтерфейс в комплекте'),n('threads','Максимальное число потоков'),field('processTechnology','Техпроцесс'),field('coreArchitecture','Ядро'),field('unlockedMultiplier','Свободный множитель','boolean'),n('maxMemoryGb','Максимально поддерживаемый объём памяти','ГБ'),n('memoryChannels','Количество каналов'),set('memorySpeeds','Частота оперативной памяти'),field('ecc','Поддержка режима ECC','boolean'),n('basePowerW','Базовое тепловыделение','Вт'),n('maxTemperatureC','Максимальная температура процессора','°C'),n('graphicsClockMhz','Максимальная частота графического ядра','МГц'),n('graphicsUnits','Исполнительные блоки'),n('shadingUnits','Потоковые процессоры (Shading Units)'),field('pcieController','Встроенный контроллер PCI Express'),n('pcieLaneCount','Число линий PCI Express','шт'),field('virtualization','Технология виртуализации','boolean'),set('features','Особенности, дополнительно'));
  const notApplicable=Object.freeze({state:'not-applicable'});
  for(const def of schemas.processor) {
    if(['efficientBaseClockGhz','efficientBoostClockGhz'].includes(def.key)) def.notApplicableWhen={key:'efficientCores',value:0};
    if(['graphicsModel','graphicsClockMhz','graphicsUnits','shadingUnits'].includes(def.key)) def.notApplicableWhen={key:'graphics',value:false};
  }
  const valueFor=(item,def)=>def.notApplicableWhen && item[def.notApplicableWhen.key]===def.notApplicableWhen.value ? notApplicable : item[def.key];
  const known = value => value != null && (Array.isArray(value) ? value.every(known) : typeof value === 'object' ? Object.values(value).every(known) : true);
  const numeric = (value, unit) => {
    if (value == null) return null;
    if (typeof value === 'object') {
      if(value.value==null) return null;
      const scales = {'ГГц':1e9,'МГц':1e6,'кГц':1e3,'Гц':1,'GHz':1e9,'MHz':1e6,'Hz':1,'Вт':1,'W':1,'кВт':1000,'kW':1000,'мм':1,'mm':1,'см':10,'cm':10,'м':1000,'m':1000,'МБ':1,'MB':1,'ГБ':1024,'GB':1024,'бит':1};
      if (!(value.unit in scales) || !(unit in scales)) return null;
      const groups = [['ГГц','МГц','кГц','Гц','GHz','MHz','Hz'],['Вт','W','кВт','kW'],['мм','mm','см','cm','м','m'],['МБ','MB','ГБ','GB'],['бит']];
      if (!groups.some(group => group.includes(unit) && group.includes(value.unit))) return null;
      return Number((Number(value.value) * scales[value.unit] / scales[unit]).toPrecision(12));
    }
    return Number(value);
  };
  function canonical(def, value) {
    if (value == null) return null;
    if(value.state==='not-applicable')return notApplicable;
    if (def.type === 'number') {const result=numeric(value,def.unit);return Number.isFinite(result) ? result : null;}
    if (def.type === 'boolean') return typeof value === 'boolean' ? value : null;
    if (def.type === 'set') return [...new Set(value.map(entry=>String(entry).trim()))].sort();
    if (def.type === 'records') {
      const grouped=new Map();
      for(const row of value) {
        const normalized=Object.fromEntries(Object.entries(def.shape).map(([key,type])=>[key,row[key]==null ? null : type==='number' ? Number(row[key]) : String(row[key]).trim()]));
        const identity=JSON.stringify(Object.fromEntries(Object.entries(normalized).filter(([key])=>key!=='count')));
        const previous=grouped.get(identity);
        if(previous && 'count' in def.shape) previous.count=previous.count==null || normalized.count==null ? null : previous.count+normalized.count;
        else grouped.set(identity,normalized);
      }
      return [...grouped.values()].filter(row=>row.count!==0).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    }
    return String(value).trim();
  }
  function format(def, value) {
    if (value == null) return 'Неизвестно';
    if(value.state==='not-applicable')return 'Не применяется';
    if (def.type === 'boolean') return value ? 'Есть' : 'Нет';
    if (def.type === 'number') return `${Number(value).toLocaleString('ru-RU')}${def.unit ? ' '+def.unit : ''}`;
    if (Array.isArray(value)) {
      if (!value.length) return 'Нет';
      if (def.type === 'set') return value.join(', ');
      if(def.shape.standard && !def.shape.count) return value.map(row=>`${row.type}: ${row.standard ?? 'Неизвестно'}`).join(', ');
      return value.map(row => def.shape.diameterMm ? `${row.count ?? '?'} × ${row.diameterMm ?? '?'} мм` : `${row.count == null ? '' : row.count+' × '}${row.type}${def.shape.standard ? ' ('+(row.standard ?? 'стандарт неизвестен')+')' : ''}`).join(', ');
    }
    return String(value);
  }
  const definition = (category,key) => schemas[category].find(def=>def.key===key);
  const text = (item,key) => {const def=definition(item.category,key);return format(def,valueFor(item,def));};
  const connectorText = list => format({type:'records',shape:list?.some(row=>'standard' in row) ? powerPorts : ports},list);
  const connectorCount = (list,type) => list == null ? null : list.filter(row=>row.type===type).reduce((sum,row)=>row.count == null || sum == null ? null : sum+row.count,0);
  const freeze = value => {if(value && typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
  function create(category, raw, order) {
    const item = {...raw,category,order,contractVersion:1};
    for(const key of ['price','monthly','stores','availability','rating','reviews','questions','reliability','image','brand']) if(!(key in item))item[key]=null;
    for(const def of schemas[category]) {
      const value=raw[def.key];if(value==null)continue;
      const valid=def.type==='number' ? typeof value==='number'&&Number.isFinite(value)&&value>=0 : def.type==='boolean' ? typeof value==='boolean' : def.type==='set' ? Array.isArray(value)&&value.every(v=>typeof v==='string') : def.type==='records' ? Array.isArray(value)&&value.every(row=>Object.entries(def.shape).every(([key,type])=>row[key]==null || typeof row[key]===type && (type!=='number' || Number.isFinite(row[key])&&row[key]>=0))) : typeof value==='string';
      if(!valid)throw new TypeError(`${raw.id}: invalid canonical ${def.key}`);
    }
    for (const def of schemas[category]) item[def.key]=canonical(def,item[def.key]);

    const getter = (key,get) => Object.defineProperty(item,key,{enumerable:true,get});
    getter('reviewsCount',()=>item.reviews ?? null);
    getter('reliable',()=>item.reliability==null ? null : item.reliability==='Отличная');
    if(category==='processor') {
      getter('specs',()=>[['Сокет',text(item,'socket')],['Общее количество ядер',text(item,'cores')],['Производительные ядра',`${text(item,'performanceCores')} × ${text(item,'baseClock')} - ${text(item,'boostClock')}`],['Тепловыделение',text(item,'tdp')],item.graphics===true ? ['Графика',item.graphicsModel ?? 'Есть'] : ['Кэш L3',text(item,'cacheL3Mb')]]);
      getter('summary',()=>['socket','cores','baseClock','boostClock','memory','cacheL3Mb','tdp'].filter(key=>item[key]!=null).map(key=>`${definition(category,key).title}: ${text(item,key)}`).join(', '));
    }
    if(category==='motherboard') {getter('chipsetAmd',()=>item.chipsetVendor==='AMD' ? item.chipset : null);getter('chipsetIntel',()=>item.chipsetVendor==='Intel' ? item.chipset : null);getter('cpuFamily',()=>item.cpuFamilies?.join(', ') ?? null);}
    if(category==='gpu') {
      getter('interface',()=>item.pcieGeneration==null ? 'Неизвестно' : `PCIe ${item.pcieGeneration.toFixed(1)}`);
      getter('videoOutputs',()=>connectorText(item.videoPorts));
      getter('gpuClockDisplay',()=>item.clockMinMhz!=null && item.clockMaxMhz!=null ? `от ${item.clockMinMhz} МГц до ${item.clockMaxMhz} МГц` : item.clockMaxMhz!=null ? `до ${item.clockMaxMhz} МГц` : 'Неизвестно');
      getter('powerConnectorsDisplay',()=>connectorText(item.powerConnectors));
      getter('fansDisplay',()=>item.fanCount==null ? 'Неизвестно' : item.fanCount===0 ? 'нет' : item.fanType==='осевой' ? `${item.fanCount} ${item.fanCount===1 ? 'осевой' : 'осевых'}` : item.fanType==='центробежный' ? `${item.fanCount} центробежный (турбина)` : `${item.fanCount} (тип неизвестен)`);
    }
    if(category==='power-supply') {
      getter('localImage',()=>item.image);
      getter('pcie',()=>connectorCount(item.gpuConnectors,'6+2-pin PCIe'));
      getter('gpu16',()=>item.gpuConnectors==null ? null : item.gpuConnectors.some(row=>row.type==='16-pin') ? item.gpuConnectors.find(row=>row.type==='16-pin').standard : '');
      getter('fan',()=>item.fans?.[0]?.diameterMm ?? null);
      getter('cpuConnector',()=>connectorText(item.cpuConnectors));
      getter('gpuConnector',()=>connectorText(item.gpuConnectors));
    }
    if(category==='case') {getter('fans',()=>text(item,'fanGroups'));getter('interfaces',()=>text(item,'interfacePorts'));}
    return freeze(item);
  }
  function rows(category,items,onlyDifferences=false) {
    const display=[];
    for(const def of schemas[category]) {
      if(def.type==='records' && def.shape.type) {
        display.push({def:{...def,type:'set',title:`Типы: ${def.title}`},key:def.key+'.types',read:item=>item[def.key]==null ? null : canonical(def,item[def.key]).map(row=>row.type)});
        display.push({def:{...def,shape:ports,title:`Количество: ${def.title}`},key:def.key,read:item=>item[def.key]==null ? null : canonical(def,item[def.key]).map(({type,count})=>({type,count}))});
        if(def.shape.standard) display.push({def:{...def,shape:{type:'string',standard:'string'},title:`Стандарт: ${def.title}`},key:def.key+'.standards',read:item=>item[def.key]==null ? null : canonical(def,item[def.key]).map(({type,standard})=>({type,standard}))});
      } else display.push({def,key:def.key,read:item=>valueFor(item,def)});
    }
    return display.map(({def,key,read})=>{
      const raw=items.map(read),values=raw.map(value=>canonical(def,value));
      const distinct=new Set(values.filter(known).map(value=>JSON.stringify(value)));
      return {key,title:def.title,values:values.map(value=>format(def,value)),different:distinct.size>=2,incomplete:values.some(value=>!known(value))};
    }).filter(row=>!onlyDifferences || row.different);
  }
  function has(item,key,value) {
    const v=item[key];
    if(v==null) return false;
    if(key==='wifi') return v===(value==='Есть');
    if(key==='gaming') return v===(value==='Да');
    if(key==='graphics') return v===(value==='true');
    if(key==='pciVersion') return Number(v)===Number(value);
    return Array.isArray(v) ? v.includes(value) : String(v)===String(value);
  }
  return {schemas,create,rows,known,canonical,format,text,has,connectorCount};
})();

// Shared behavior for every component catalog modal.
const catalogUI = (() => {
  // Search inputs are focus-visible on pointer clicks too; preserve the keyboard ring.
  const filterSearchInputs = '.filter-search input,.socket-search input';
  document.addEventListener('pointerdown', event => {
    if (event.target instanceof Element && event.target.matches(filterSearchInputs)) {
      event.target.classList.add('is-pointer-focused');
    }
  }, true);
  document.addEventListener('focusout', event => {
    if (event.target instanceof Element && event.target.matches(filterSearchInputs)) {
      event.target.classList.remove('is-pointer-focused');
    }
  });
  const refreshTimers = new WeakMap();
  const selectedRowKinds = {
    processor: {rowClass: 'processor-selected', removeClass: 'processor-remove', replaceClass: 'processor-replace', label: 'процессор', modalId: 'processor-modal'},
    board: {rowClass: 'processor-selected board-selected', removeClass: 'processor-remove board-remove', replaceClass: 'processor-replace board-replace', label: 'материнскую плату', modalId: 'motherboard-modal'},
    power: {rowClass: 'processor-selected power-selected', removeClass: 'processor-remove power-remove', replaceClass: 'processor-replace power-replace', label: 'блок питания', modalId: 'power-supply-modal'},
    gpu: {rowClass: 'processor-selected gpu-selected', removeClass: 'processor-remove gpu-remove', replaceClass: 'processor-replace gpu-replace', label: 'видеокарту', modalId: 'gpu-modal'},
    case: {rowClass: 'processor-selected case-selected', removeClass: 'processor-remove case-remove', replaceClass: 'processor-replace case-replace', label: 'корпус', modalId: 'case-modal'}
  };

  const filterLoads = new WeakMap();
  const openingModals = new WeakSet();
  const refreshBound = new WeakSet();
  const facetRefreshTriggers = new WeakSet();
  function finishFilterLoading(modal) {
    const load = filterLoads.get(modal);
    if (!load) return;
    clearTimeout(load.timer);
    cancelAnimationFrame(load.frame);
    load.entries.forEach(({panel, skeleton, children, className}) => {
      skeleton.remove();
      panel.classList.remove(className);
      panel.removeAttribute('aria-busy');
      children.forEach(([child, inert]) => { child.inert = inert; });
    });
    if (load.filterPanel) {window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.programmatic',element:load.filterPanel,position:load.scrollTop}}));load.filterPanel.scrollTop = load.scrollTop;}
    filterLoads.delete(modal);
  }
  function startFilterLoading(modal, {products = false} = {}) {
    finishFilterLoading(modal);
    if (modal.hidden) return;
    const load = {entries: [], timer: 0, frame: 0};
    filterLoads.set(modal, load);
    function cover(panel, componentName, className) {
      if (!panel || panel.hidden) return;
      const children = [...panel.children].map(child => [child, child.inert]);
      children.forEach(([child]) => { child.inert = true; });
      const skeleton = component(componentName);
      panel.append(skeleton);
      panel.classList.add(className);
      panel.setAttribute('aria-busy', 'true');
      load.entries.push({panel, children, skeleton, className});
    }
    const panel = modal.querySelector('.processor-filters');
    load.filterPanel = panel;
    load.scrollTop = panel?.scrollTop || 0;
    if (panel) { window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.programmatic',element:panel,position:0}})); panel.scrollTop = 0; }
    cover(panel, 'filterSkeleton', 'is-filter-loading');
    if (products) cover(modal.querySelector('.processor-products') || modal.querySelector('.processor-results'), 'productSkeleton', 'is-product-loading');
    // Opening renders the result articles synchronously after openModal.
    load.frame = requestAnimationFrame(() => {
      cover(modal.querySelector('.catalog-articles'), 'articleSkeleton', 'is-article-loading');
    });
  }
  let backdrop;
  const bindScrollRail = window.prototypeScrollbars.bind;
  function syncModalScrollRail(modal) {
    const scroll=modal.querySelector('.processor-modal-scroll'),rail=modal.querySelector('.processor-modal-scroll-rail');
    if(!scroll || !rail)return;
    if(scroll.syncScrollRail){scroll.syncScrollRail();return;}
    const filters=modal.querySelector('.processor-filters'),filterRail=modal.querySelector('.processor-filters-scroll-rail');
    bindScrollRail(rail,scroll);bindScrollRail(filterRail,filters);
    function syncMetrics() {rail.update();filterRail.update();}
    const resize=new ResizeObserver(syncMetrics);resize.observe(scroll);resize.observe(scroll.firstElementChild);resize.observe(filters);
    for(const child of filters.children)resize.observe(child);
    const changes=new MutationObserver(()=>{for(const child of filters.children)resize.observe(child);syncMetrics();});
    changes.observe(filters,{childList:true,subtree:true});
    scroll.syncScrollRail=syncMetrics;
    scroll.destroyScrollRail=()=>{resize.disconnect();changes.disconnect();rail.destroy();filterRail.destroy();delete scroll.syncScrollRail;delete scroll.destroyScrollRail;};
    syncMetrics();
  }
  function openModal(modal) {
    const wasHidden = modal.hidden;
    if (!refreshBound.has(modal)) {
      modal.addEventListener('click', event => {
        const trigger = event.target.closest('.catalog-quick [data-quick], .processor-toolbar .compatible-chip, .processor-toolbar .active-filter-chip, .processor-toolbar .reset-chip');
        if (!trigger || trigger.disabled) return;
        facetRefreshTriggers.add(modal);
        setTimeout(() => facetRefreshTriggers.delete(modal), 0);
      }, true);
      refreshBound.add(modal);
    }
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'catalog-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.append(backdrop);
    }
    backdrop.hidden = false;
    modal.hidden = false;
    syncModalScrollRail(modal);
    openingModals.add(modal);
    queueMicrotask(() => openingModals.delete(modal));
    if (modal.dataset.catalogLoading === 'true') startFilterLoading(modal,{products:true});
    else finishFilterLoading(modal);
    document.body.classList.add('modal-open');
    document.querySelectorAll('body > header, body > main, body > footer').forEach((section) => { section.inert = true; });
    const focusTarget = modal.dataset.initialFocus === 'dialog' ? modal : modal.querySelector('.processor-modal-close');
    if (focusTarget === modal) modal.tabIndex = -1;
    focusTarget.focus({preventScroll: true});
    if (wasHidden) window.dispatchEvent(new CustomEvent('prototype:telemetry', {detail:{type:'modal.open',element:modal}}));
  }

  function closeModal(modal, returnFocus) {
    const wasOpen = !modal.hidden;
    modal.closeComparison?.();modal.closeFilters?.(false);
    finishFilterLoading(modal);
    const list=modal.querySelector('.processor-products');
    if(list){clearTimeout(refreshTimers.get(list));refreshTimers.delete(list);list.classList.remove('is-filter-loading');list.removeAttribute('aria-busy');}
    modal.classList.remove('is-results-refreshing', 'is-facets-refreshing');
    modal.hidden = true;
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove('modal-open');
    document.querySelectorAll('body > header, body > main, body > footer').forEach((section) => { section.inert = false; });
    returnFocus?.focus({preventScroll: true});
    if (wasOpen) window.dispatchEvent(new CustomEvent('prototype:telemetry', {detail:{type:'modal.close',element:modal}}));
  }

  function node(tag, className, text) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text != null) result.textContent = text;
    return result;
  }
  function markup(html) {
    const template = document.createElement('template'); template.innerHTML = html;
    return template.content.firstElementChild;
  }
  // Original monochrome silhouettes become masks so their paint follows page DNS tokens.
  const categoryIconMasks = {
    "07ER2V8AWTF4MBY3KX9J1Q4490.svg": [
      50,
      50,
      true
    ],
    "0S0GBVNS8GEDB23B1Z4B6ZGESY.svg": [
      50,
      50,
      false
    ],
    "0X607QM29WBC33BJ37AB0N94TY.svg": [
      50,
      50,
      false
    ],
    "12AYWCT9HB3G0WM7V0YQQ57H79.svg": [
      50,
      50,
      false
    ],
    "1QFTWM0CWAPPYDYSN112XV57F4.svg": [
      50,
      50,
      false
    ],
    "33H8MS1HRYVP2EPMJHZ37RC1DC.svg": [
      50,
      50,
      false
    ],
    "423Q22ZXQH511GN19C6YF3J44B.svg": [
      31,
      31,
      false
    ],
    "5M8479QE75YA7JSYA6PD8BTJH7.svg": [
      17,
      32,
      false
    ],
    "5QKA0XSEWYEQR5Y8H9CJHYDF8R.svg": [
      34,
      28,
      false
    ],
    "5T0ER0JHNFDG2K4PR885Z6EH6X.svg": [
      50,
      50,
      false
    ],
    "6BD96VRBSYC6827GH5TH3NCYD8.svg": [
      50,
      50,
      false
    ],
    "78B670FX15N8HP1M86QXPBV8GV.svg": [
      50,
      50,
      false
    ]
  };
  function colorImage(source, {className = '', alt = '', lazy = false} = {}) {
    const url = new URL(source, document.baseURI);
    const metadata = url.pathname.includes('/assets/configurator/') && categoryIconMasks[url.pathname.split('/').pop()];
    if (!metadata) {
      const image = node('img', className); image.alt = alt;
      if (lazy) prototypeImages.defer(image, source); else image.src = source;
      return image;
    }
    const [width, height, primary] = metadata;
    const icon = node('span', ['catalog-color-icon', primary ? 'catalog-color-icon-primary' : '', className].filter(Boolean).join(' '));
    icon.style.maskImage = `url("${url.href}")`;
    if (!className) { icon.style.width = `${width}px`; icon.style.height = `${height}px`; }
    if (alt) { icon.setAttribute('role', 'img'); icon.setAttribute('aria-label', alt); }
    else icon.setAttribute('aria-hidden', 'true');
    return icon;
  }
  let ratingGradientSequence = 0;

  // Canonical component registry: both assembled products and DS render these factories.
  const components = {};
  function define(id, title, context, create) { components[id] = {id, title, context, create}; }
  function component(id, data = {}) {
    const definition = components[id];
    if (!definition) throw new Error(`Unknown catalog component: ${id}`);
    const result = definition.create(data); result.dataset.dsComponent = `catalog.${id}`;
    return result;
  }
  define('modalShell', 'Оболочка модалки до загрузки каталога', 'modal', data => {
    const modal = node('div','processor-modal');
    modal.id = `${data.id}-modal`; modal.hidden = true;
    modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-labelledby',`${data.id}-modal-title`);
    const header = node('header','processor-modal-header');
    const heading = node('div','processor-modal-heading');
    const title = node('h2','',data.title); title.id = `${data.id}-modal-title`;
    heading.append(title,node('strong'));
    const close = node('button','processor-modal-close'); close.type = 'button'; close.setAttribute('aria-label','Закрыть окно выбора');
    header.append(heading,close);
    const scroll = node('div','processor-modal-scroll');
    const layout = node('div','processor-modal-layout');
    const filters = node('aside','processor-filters'); filters.append(node('div','filter-panel'));
    const rail=node('div','processor-modal-scroll-rail');rail.hidden=true;
    const filterFrame=node('div','processor-filters-frame'),filterRail=node('div','processor-filters-scroll-rail');filterRail.hidden=true;filterFrame.append(filters,filterRail);
    layout.append(filterFrame,node('section','processor-results')); scroll.append(layout); modal.append(header,scroll,rail);
    return modal;
  });
  define('catalogFilters','Фильтры каталога · боковая панель','',({modal}={})=>{
    const trigger=node('button','catalog-filter-trigger');trigger.type='button';trigger.setAttribute('aria-label','Открыть фильтры');trigger.setAttribute('aria-expanded','false');
    trigger.append(markup('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h8m4 0h4M4 17h3m4 0h9"/><circle cx="14" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>'));
    const layout=modal.querySelector('.processor-modal-layout'),frame=layout.querySelector('.processor-filters-frame'),filters=frame.querySelector('.processor-filters');
    const results=modal.querySelector('.processor-results'),header=modal.querySelector('.processor-modal-header');
    const drawer=node('section','catalog-filter-drawer');drawer.hidden=true;drawer.id=`${modal.id}-filters`;drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');drawer.setAttribute('aria-label','Фильтры каталога');trigger.setAttribute('aria-controls',drawer.id);
    const close=component('comparisonClose',{onClose:()=>closeDrawer()});close.classList.add('filters-drawer-close');close.setAttribute('aria-label','Закрыть фильтры');close.hidden=true;frame.prepend(close);modal.append(drawer);
    const compact=matchMedia('(max-width:1100px)');
    function closeDrawer(focus=true){
      const wasOpen=!drawer.hidden;drawer.hidden=true;trigger.setAttribute('aria-expanded','false');if(wasOpen){results.inert=false;header.inert=false;}
      if(wasOpen && focus)trigger.focus({preventScroll:true});
    }
    trigger.addEventListener('click',()=>{
      if(!compact.matches)return;drawer.hidden=false;close.hidden=false;trigger.setAttribute('aria-expanded','true');results.inert=true;header.inert=true;
      modal.querySelector('.processor-modal-scroll').syncScrollRail?.();(filters.querySelector('input:not(:disabled)') || close).focus({preventScroll:true});
    });
    drawer.addEventListener('click',event=>{if(event.target===drawer)closeDrawer();});
    modal.addEventListener('keydown',event=>{
      if(drawer.hidden)return;
      if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeDrawer();}
      if(event.key==='Tab'){
        const controls=[...frame.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]')].filter(n=>n.checkVisibility() && !n.closest('[inert]'));
        const first=controls[0],last=controls.at(-1);if(!first)return;
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    },true);
    function placeTrigger(){
      const target=results.querySelector('.catalog-quick-wrap,.power-quick-wrap') || results.querySelector('.processor-toolbar');
      if(target && trigger.parentElement!==target)target.prepend(trigger);
    }
    function switchLayout(){
      const hadFocus=frame.contains(document.activeElement);closeDrawer(false);
      if(compact.matches){drawer.append(frame);close.hidden=false;if(hadFocus && !modal.hidden)trigger.focus({preventScroll:true});}
      else{layout.prepend(frame);close.hidden=true;if(hadFocus && !modal.hidden)(filters.querySelector('input:not(:disabled)') || header.querySelector('button')).focus({preventScroll:true});}
      modal.querySelector('.processor-modal-scroll').syncScrollRail?.();
    }
    const observer=new MutationObserver(placeTrigger);observer.observe(results,{childList:true,subtree:true});placeTrigger();switchLayout();compact.addEventListener('change',switchLayout);
    modal.closeFilters=closeDrawer;
    return trigger;
  });
  define('filterSkeleton', 'Загрузка панели фильтров', 'filters', () => {
    const skeleton = node('div', 'filter-skeleton');
    skeleton.setAttribute('role', 'status');
    skeleton.setAttribute('aria-label', 'Загрузка фильтров');
    const search = node('div', 'filter-skeleton-search');
    search.setAttribute('aria-hidden', 'true');
    search.append(node('span', 'filter-skeleton-bar'));
    skeleton.append(search);
    for (const count of [5, 3, 5]) {
      const group = node('div', 'filter-skeleton-group');
      group.setAttribute('aria-hidden', 'true');
      group.append(node('span', 'filter-skeleton-bar filter-skeleton-heading'));
      for (let i = 0; i < count; i++) {
        const row = node('div', 'filter-skeleton-row');
        row.append(node('span', 'filter-skeleton-check'), node('span', 'filter-skeleton-bar'));
        group.append(row);
      }
      skeleton.append(group);
    }
    return skeleton;
  });
  define('productSkeleton', 'Загрузка карточек товаров', 'products', () => {
    const skeleton = node('div', 'product-skeleton');
    skeleton.setAttribute('role', 'status');
    skeleton.setAttribute('aria-label', 'Загрузка товаров');
    for (let i=0;i<3;i++) {
      const card=node('div','product-skeleton-card');card.setAttribute('aria-hidden','true');
      const text=node('div','product-skeleton-text');
      text.append(node('span','filter-skeleton-bar'),node('span','filter-skeleton-bar'),node('span','filter-skeleton-bar'),node('span','filter-skeleton-bar product-skeleton-meta'));
      const action=node('div','product-skeleton-action');
      action.append(node('span','filter-skeleton-bar product-skeleton-price'),node('span','filter-skeleton-bar product-skeleton-button'));
      card.append(node('div','filter-skeleton-bar product-skeleton-image'),text,action);skeleton.append(card);
    }
    return skeleton;
  });
  define('articleSkeleton', 'Загрузка статей каталога', 'articles', () => {
    const skeleton = node('div', 'article-skeleton');
    skeleton.setAttribute('role', 'status');
    skeleton.setAttribute('aria-label', 'Загрузка статей');
    for (let i = 0; i < 4; i++) {
      const card = node('div', 'article-skeleton-card');
      card.setAttribute('aria-hidden', 'true');
      card.append(node('div', 'filter-skeleton-bar article-skeleton-cover'),
        node('div', 'filter-skeleton-bar'), node('div', 'filter-skeleton-bar'));
      skeleton.append(card);
    }
    return skeleton;
  });
  define('articleCard', 'Карточка статьи в каталоге', 'articles', data => {
    const card = node('a', 'catalog-article');
    card.href = data.localPath;
    // Keep the entry context in the link itself, including copied/new-tab links.
    if (data.configuratorCategory) {
      const url = new URL(card.href);
      url.searchParams.set('from', 'configurator');
      url.searchParams.set('category', data.configuratorCategory);
      card.href = url.href;
    }
    card.dataset.articleId = data.articleId;
    card.dataset.telemetryName = data.title;
    const image = node('img', 'catalog-article-image');
    image.alt = ''; prototypeImages.defer(image, data.image);
    const title = node('h3', 'catalog-article-title', data.title);
    const cover = node('div', 'catalog-article-cover');
    image.draggable = false; card.draggable = false;
    cover.append(image);
    if (data.reason) cover.append(node('span', 'catalog-article-tag', data.reason));
    card.append(cover, title);
    return card;
  });
  define('articleStrip', 'Статьи над выдачей', 'articles', ({articles = [], configuratorCategory} = {}) => {
    const strip = node('section', 'catalog-articles');
    strip.dataset.telemetryPlacement='modal.articles';
    if(configuratorCategory)strip.dataset.categoryId=configuratorCategory;
    strip.setAttribute('aria-label', 'Статьи о комплектующих');
    strip.hidden = !articles.length;
    const track = node('div', 'catalog-articles-track');
    track.tabIndex = 0;
    track.setAttribute('aria-label', 'Лента статей');
    for (const copy of [-1, 0, 1]) {
      for (const article of articles) {
        const card = component('articleCard', {...article, configuratorCategory});
        if (copy) { card.dataset.loopCopy = 'true'; card.tabIndex = -1; card.setAttribute('aria-hidden', 'true'); }
        track.append(card);
      }
    }
    const cardStep = () => (track.firstElementChild?.getBoundingClientRect().width || 248) + 20;
    const cycleWidth = () => articles.length * cardStep();
    let drag = null;
    const normalizeLoop = () => {
      const cycle = cycleWidth();
      if (!cycle || !track.isConnected) return;
      const left = track.scrollLeft;
      const shift = left < cycle * .5 ? cycle : left >= cycle * 1.5 ? -cycle : 0;
      if (!shift) return;
      const snap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.programmatic',element:track,position:left+shift}}));
      track.scrollLeft = left + shift;
      if (drag) drag.left += shift;
      track.style.scrollSnapType = snap;
    };
    let animationFrame = 0;
    const stopAnimation = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      track.style.scrollSnapType = '';
      normalizeLoop();
    };
    const animateScroll = target => {
      const before = track.scrollLeft;
      stopAnimation();
      target += track.scrollLeft - before;
      window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.user',element:track}}));
      const from = track.scrollLeft;
      const to = Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth));
      // Explicit prototype behavior: user-requested 300 ms motion for every slide action.
      const start = performance.now();
      track.style.scrollSnapType = 'none';
      const frame = now => {
        if (!track.isConnected) { stopAnimation(); return; }
        const progress = Math.min(1, (now - start) / 300);
        const eased = progress * progress * (3 - 2 * progress);
        track.scrollLeft = from + (to - from) * eased;
        if (progress < 1) animationFrame = requestAnimationFrame(frame);
        else stopAnimation();
      };
      animationFrame = requestAnimationFrame(frame);
    };
    track.addEventListener('wheel', stopAnimation, {passive: true});
    let suppressClick = false;
    track.addEventListener('pointerdown', event => {
      stopAnimation();
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      suppressClick = false;track.dataset.telemetryDragSuppressed = 'false';
      drag = {id: event.pointerId, x: event.clientX, y: event.clientY, left: track.scrollLeft, moved: false};
    });
    track.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
        drag.moved = true;
        track.setPointerCapture(event.pointerId);
        track.classList.add('is-dragging');
      }
      if (drag.moved) { event.preventDefault(); track.scrollLeft = drag.left - dx; }
    });
    const finishDrag = event => {
      if (!drag || event.pointerId !== drag.id) return;
      suppressClick = drag.moved;track.dataset.telemetryDragSuppressed = String(suppressClick);
      drag = null;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    };
    track.addEventListener('pointerup', finishDrag);
    track.addEventListener('pointercancel', finishDrag);
    track.addEventListener('pointerleave', event => { if (drag && !drag.moved) finishDrag(event); });
    track.addEventListener('click', event => {
      if (suppressClick && event.detail !== 0) {event.preventDefault(); event.stopPropagation(); suppressClick = false;}
    }, true);
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      stopAnimation();
      const step = track.firstElementChild?.getBoundingClientRect().width + 20 || 268;
      const left = event.key === 'Home' ? cycleWidth() : event.key === 'End' ? cycleWidth() + (articles.length - 1) * step : track.scrollLeft + (event.key === 'ArrowRight' ? step : -step);
      animateScroll(left);
    });
    const previous = node('button', 'catalog-articles-arrow is-previous');
    const next = node('button', 'catalog-articles-arrow is-next');
    previous.type = next.type = 'button';
    previous.setAttribute('aria-label', 'Предыдущие статьи');
    next.setAttribute('aria-label', 'Следующие статьи');
    const updateArrows = () => {
      previous.disabled = next.disabled = !articles.length;
      if (!animationFrame) normalizeLoop();
    };
    for (const [button, direction] of [[previous, -1], [next, 1]]) {
      button.addEventListener('click', () => {
        const step = (track.firstElementChild?.getBoundingClientRect().width || 248) + 20;
        const page = Math.max(1, Math.floor(track.clientWidth / step / 2));
        const target = Math.round(track.scrollLeft / step) * step + direction * step * page;
        animateScroll(target);
      });
    }
    track.addEventListener('scroll', updateArrows, {passive: true});
    strip.addEventListener('mouseenter', updateArrows);
    strip.addEventListener('focusin', updateArrows);
    strip.append(track, previous, next);
    requestAnimationFrame(() => {
      if (!track.isConnected || !articles.length) return;
      window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.programmatic',element:track,position:cycleWidth()}}));
      track.scrollLeft = cycleWidth();
    });
    return strip;
  });
  // Semantic controls and outcomes; isolated examples never publish outcomes.
  function comparisonControl(control,id,category,product,placement='comparison.table') {
    control.dataset.telemetryId=id;control.dataset.comparisonCategory=category;
    control.dataset.telemetryPlacement=placement;
    if(product){control.dataset.productId=product.id;control.dataset.telemetryName=product.name;}
    return control;
  }
  function comparisonReport(action,category,products,extra={}) {
    if(window.__studyInstalled)window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'comparison.result',action,category,products:products.map(({id,name})=>({id,name})),...extra}}));
  }
  define('compare', 'Сравнение', 'product-meta', (data) => {
    const label=node('label','catalog-compare','Сравнить');
    const input=filterOption().querySelector('input');input.classList.add('catalog-compare-input');
    label.prepend(input);
    const item=data.product || (data.category ? data : null);
    if(!item) {input.disabled=true;return label;}
    input.dataset.category=item.category;input.dataset.compareId=item.id;
    const context=data.comparisonContext;
    input.checked=comparisonState(item.category,context).has(item.id);
    comparisonControl(input,'comparison.toggle',item.category,item,'catalog.card');
    input.addEventListener('change',()=>{setCompared(item,input.checked,context,input);});
    return label;
  });
  define('rating', 'Рейтинг и отзывы', 'product-meta', data => {
    const gradientId = `catalog-rating-gradient-${++ratingGradientSequence}`;
    const result = markup(`<span class="catalog-rating"><svg class="catalog-rating-icon" viewBox="0 0 13 12" aria-hidden="true" focusable="false" xmlns='http://www.w3.org/2000/svg' width='13' height='12' fill='none'><path d='M9.071 11.166L6.002 9.198l-3.069 1.968c-.191.121-.437.107-.614-.014-.177-.134-.26-.361-.205-.576l.968-3.347L.191 4.833c-.164-.134-.232-.362-.164-.576s.259-.348.478-.375l3.452-.241L5.511.308c.082-.187.273-.308.491-.308s.41.121.491.308l1.555 3.334 3.452.241c.218.014.409.16.478.375.068.201 0 .428-.163.576L8.936 7.217l.968 3.347a.51.51 0 0 1-.205.576c-.095.067-.205.107-.328.107-.109 0-.205-.027-.3-.08v-.001z' fill='url(#${gradientId})'/><defs><linearGradient id='${gradientId}' x1='15.444' y1='11.25' x2='15.444' y2='-.001' gradientUnits='userSpaceOnUse'><stop stop-color='var(--jupiter-orange-200)'/><stop offset='1' stop-color='var(--sunny-yellow-100)'/></linearGradient></defs></svg><b></b><small class="meta-divider">|</small><em></em></span>`);
    result.querySelector('b').textContent = data.rating;
    result.querySelector('em').textContent = `${data.reviews==null ? '—' : data.reviews>=1000 ? (data.reviews/1000).toLocaleString('en-US',{maximumFractionDigits:1})+'k' : data.reviews} отзывов`;
    return result;
  });
  define('questions', 'Вопросы о товаре', 'product-meta', data => {
    const result = markup('<span class="catalog-questions"><svg class="catalog-question-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M5.25 3.25h6.25a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9.75l-2.25 1.75v-1.75H5.25a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/><path d="M3.25 5.25H2.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h.25v1.5L4.5 11.75"/><path d="M7.25 6.2a1.35 1.35 0 1 1 2.1 1.12c-.48.32-.8.65-.8 1.18M8.55 9.92h.01"/></svg><em></em></span>'); result.querySelector('em').textContent = data.questions; return result;
  });
  define('reliability', 'Надёжность', 'product-meta', ({reliability = 'Отличная'}) => {
    const result = markup('<span class="catalog-reliability"><svg class="catalog-shield-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.3 13 3v4.2c0 3.2-2 5.7-5 7.2-3-1.5-5-4-5-7.2V3l5-1.7Z"/><path d="m5.6 7.6 1.6 1.5 3.2-3.2"/></svg><em></em></span>');
    result.querySelector('em').textContent = reliability==null ? 'Надёжность неизвестна' : `${reliability} надежность`;
    result.querySelector('svg').classList.toggle('is-good', reliability === 'Хорошая'); return result;
  });
  define('meta', 'Сравнение и показатели · группа целиком', '', productMeta);
  define('productName', 'Название товара', 'product-detail', ({name}) => node('h3','product-name',name));
  define('badge', 'Бейдж товара', '', data => {
    const variants = {hit:'Хит продаж', exclusive:'Эксклюзивно в DNS', dns:'Создано DNS'};
    const kind = data.badgeKind || (data.badge === 'Создано DNS' ? 'dns' : 'hit');
    const label = data.badgeKind ? variants[kind] : data.badge;
    const result = node('span', `hit-badge product-badge--${kind}`, label);
    result.hidden = !label;
    return result;
  });
  define('spec', 'Строка характеристики', 'product-detail', ({specs = []}) => {
    const dl = node('dl'); const row = node('div'); row.dataset.dsComponent = 'catalog.spec'; const [label, value] = specs[0] || ['', ''];
    row.append(node('dt', '', `${label}:`), node('dd', '', value)); dl.append(row); return dl;
  });
  define('photo', 'Изображение товара', 'product-image', data => colorImage(data.image, {className:'catalog-photo', alt:data.name, lazy:true}));
  define('imageBadge', 'Бейдж на изображении', 'product-image component-image-badge', data => { const result = node('img', 'image-badge'); result.src = data.imageBadge; result.alt = ''; return result; });
  define('pagination', 'Пагинация изображений', 'product-image component-pagination', () => markup('<span class="image-dots"><i></i><i></i></span>'));
  define('price', 'Цена и ежемесячный платёж', '', ({price, monthly}) => {
    const result = node('div', 'product-price');
    const amount = node('strong', '', price == null ? '—' : `${price.toLocaleString('ru-RU')} ₽`);
    const payment = node('small'); payment.hidden = price == null;
    if (price != null) payment.textContent = `от ${(monthly ?? Math.round(price * .0975)).toLocaleString('ru-RU')} ₽/ мес.`;
    result.append(amount, payment); return result;
  });
  define('comparisonPrice','Цена в сравнении','catalog-comparison',data=>{const price=component('price',data);price.classList.add('comparison-price');return price;});
  define('favorite', 'Кнопка «В избранное»', 'product-buttons', () => markup('<button type="button" class="favorite" aria-label="В избранное"></button>'));
  define('compareIcon', 'Кнопка сравнения · иконка', 'product-buttons', (data) => {
    const button=component('favorite');button.classList.add('catalog-compare-icon');
    button.setAttribute('aria-label','Сравнить');button.setAttribute('aria-pressed','false');
    const icon=comparisonIcon();
    button.append(icon);
    const item=data.product || (data.category ? data : null);
    if(!item) {button.disabled=true;return button;}
    button.dataset.category=item.category;button.dataset.compareId=item.id;
    const context=data.comparisonContext;
    button.setAttribute('aria-pressed',String(comparisonState(item.category,context).has(item.id)));
    comparisonControl(button,'comparison.toggle',item.category,item,'catalog.card');
    button.addEventListener('click',()=>setCompared(item,!comparisonState(item.category,context).has(item.id),context,button));
    return button;
  });
  function comparisonIcon() {return component('siteHeader').querySelector('.header-actions svg').cloneNode(true);}
  define('comparisonOpen', 'Открыть сравнение · счётчик', 'product-buttons', ({count=0}={}) => {
    const button=component('favorite');button.classList.add('catalog-compare-icon','comparison-open');
    const badge=node('span','comparison-count');badge.setAttribute('aria-hidden','true');
    button.append(comparisonIcon(),badge);updateComparisonOpener(button,count);return button;
  });
  function updateComparisonOpener(button,count) {
    button.disabled=false;
    button.setAttribute('aria-label',`Сравнить (${count})`);
    button.title=`Сравнить (${count})`;
    const badge=button.querySelector('.comparison-count');badge.hidden=!count;badge.textContent=String(count);
  }
  define('filterSearchToolbar','Поиск фильтров и вход в сравнение','filter-search-toolbar',({search,count=0,onCompare}={})=>{
    const root=node('div','filter-search-toolbar');
    if(search)root.append(search);
    const button=component('comparisonOpen',{count});button.classList.add('comparison-filter-open');
    button.addEventListener('click',()=>onCompare?.());root.append(button);return root;
  });
  define('select', 'Кнопка выбора', 'product-buttons', ({selection = 'add'} = {}) => {
    const result = catalogActionButton();
    setSelectionButton(result, selection); return result;
  });
  function setSelectionButton(button, selection) {
    button.textContent = selection === 'added' ? 'Добавлен' : selection === 'replace' ? 'Заменить' : 'Добавить';
    button.setAttribute('aria-disabled', String(selection === 'added'));
    button.classList.toggle('is-added', selection === 'added');
  }
  define('stock', 'Наличие и доставка · блок целиком', '', ({stores}) => {
    const result = markup('<div class="product-stock"><div class="stock-line"><span>В наличии</span><a>в 12 магазинах</a></div><div class="stock-line"><span>Пункты выдачи</span><a>доступны</a></div></div>');
    result.append(component('delivery')); result.hidden = stores === null; return result;
  });
  define('delivery', 'Строка доставки', 'product-stock', () => markup('<div class="stock-line"><span>Доставим на дом за 2 часа</span></div>'));
  define('selectedName', 'Название товара', 'selected-info', data => node('strong', '', data.name));
  define('selectedSpecs', 'Краткие характеристики', 'selected-info', data => node('span', 'selected-specs', data.specs));
  define('selectedStock', 'Наличие в магазинах', 'selected-info', ({stores = 'в 12 магазинах'}) => {
    const result = markup('<span class="selected-stock">В наличии <span></span></span>');
    result.querySelector('span').textContent = stores; result.hidden = stores === null; return result;
  });
  define('selectedPickup', 'Пункты выдачи', 'selected-info', ({stores}) => {const result = markup('<span class="selected-pickup">Пункты выдачи <span>доступны</span></span>'); result.hidden = stores === null; return result;});
  define('quantity', 'Счётчик количества', '', ({value = 1, min = 1, max = 1, onChange = () => {}} = {}) => {
    const result = markup('<div class="selected-quantity"><button type="button" aria-label="Уменьшить количество"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button><strong aria-live="polite"></strong><button type="button" aria-label="Увеличить количество"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>');
    const [minus, plus] = result.querySelectorAll('button');
    const update = () => {
      result.querySelector('strong').textContent = String(value);
      minus.disabled = value <= min; plus.disabled = value >= max;
      result.classList.toggle('is-disabled', min === max);
    };
    [minus, plus].forEach((button, index) => button.addEventListener('click', () => {
      value = Math.max(min, Math.min(max, value + (index ? 1 : -1))); update(); onChange(value);
    }));
    update(); return result;
  });
  define('status', 'Совместимость', '', ({incompatible = false, unknown = false}) => node('span', `selected-status${unknown ? ' is-unknown' : incompatible ? ' is-incompatible' : ''}`, unknown ? 'Недостаточно данных' : incompatible ? 'Несовместимо' : 'Совместимо'));
  define('remove', 'Кнопка удаления', 'selected-controls', ({kind = 'processor',onRemove}) => {
    const config = selectedRowKinds[kind]; const result = markup('<button type="button" class="" aria-label="Удалить "><span class="catalog-remove-icon" aria-hidden="true">&#xe90d;</span></button>');
    result.className = config.removeClass; result.setAttribute('aria-label', `Удалить ${config.label}`);if(onRemove)result.addEventListener('click',onRemove);return result;
  });
  define('replace', 'Кнопка замены', 'selected-controls', ({kind = 'processor',onReplace,modalId}) => {
    const config = selectedRowKinds[kind]; const result = markup('<button type="button" class="" aria-label="Заменить " aria-haspopup="dialog" aria-controls=""><span class="catalog-replace-icon" aria-hidden="true">&#xe99e;</span></button>');
    result.className = config.replaceClass; result.setAttribute('aria-label', `Заменить ${config.label}`);
    result.setAttribute('aria-controls', modalId||config.modalId);if(onReplace)result.addEventListener('click',onReplace);return result;
  });
  define('controls', 'Управление деталью · группа целиком', '', data => {const result = node('div', 'selected-controls'); result.append(component('remove', data), component('quantity'), component('replace', data)); return result;});

  function renderSelectedRow(row, data) {
    const {kind, name, image, price, imageFallback = ''} = data;
    const config = selectedRowKinds[kind];
    if (!config) throw new Error(`Unknown selected row kind: ${kind}`);
    row.className = config.rowClass;
    const picture = colorImage(image, {className:'selected-image', alt:name});
    if (imageFallback && picture.tagName === 'IMG') picture.onerror = () => {
      picture.onerror = null;
      picture.replaceWith(colorImage(imageFallback, {className:'selected-image', alt:name}));
    };
    const info = node('div', 'selected-info');
    info.append(...['selectedName','selectedSpecs','selectedStock','selectedPickup'].map(id => component(id, data)));
    row.replaceChildren(picture, info, component('status', data), component('controls', data), node('strong', 'selected-price', price));
    row.dataset.dsComponent = 'catalog.selectedRow';
  }

  function clearSelectedRow(row, emptyMarkup) {
    row.className = 'part-row';
    delete row.dataset.dsComponent;
    row.innerHTML = emptyMarkup;
  }

  function refresh(list, modal) {
    if (modal.hidden) return;
    if (window.__studyInstalled) window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'results.change'}}));
    // Initial rendering and real catalog loading are not simulated requests.
    if (openingModals.has(modal) || modal.dataset.catalogLoading === 'true') return;
    clearTimeout(refreshTimers.get(list));
    modal.classList.add('is-results-refreshing');
    modal.classList.toggle('is-facets-refreshing', facetRefreshTriggers.has(modal));
    list.classList.add('is-filter-loading');
    list.setAttribute('aria-busy', 'true');
    refreshTimers.set(list, setTimeout(() => {
      modal.classList.remove('is-results-refreshing', 'is-facets-refreshing');
      list.classList.remove('is-filter-loading');
      list.setAttribute('aria-busy', 'false');
      refreshTimers.delete(list);
    }, 300));
  }

  function syncCards(cards, {selected, otherSocket, socket}) {
    cards.forEach((card) => {
      const button = card.querySelector('.product-buttons button:not(.favorite)');
      const isSelected = Boolean(selected?.id && card.dataset.productId === selected.id);
      setSelectionButton(button, isSelected ? 'added' : selected ? 'replace' : 'add');
      card.classList.toggle('is-alternative-socket', Boolean(otherSocket && socket?.(card) !== otherSocket));
    });
  }

  function resolveSavedProduct(value, products) {
    if (typeof value !== 'string') return null;
    return products.find((item) => item.id === value || item.name === value) || null;
  }

  function bindActions(list, onSelect, onSelectProduct) {
    if(onSelectProduct) list.closest('.processor-modal').selectComparisonProduct=onSelectProduct;
    list.addEventListener('click', (event) => {
      const button = event.target.closest('.product-buttons button:not(.favorite)');
      if (button && button.getAttribute('aria-disabled') !== 'true') {
        onSelect(button.closest('.processor-product'));
      }
    });
  }

  function chip(label, onRemove) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'active-filter-chip';
    button.textContent = label;
    const icon = node('span','catalog-dismiss-icon');icon.setAttribute('aria-hidden','true');button.append(icon);
    button.setAttribute('aria-label', `Удалить фильтр ${label}`);
    button.addEventListener('click', onRemove);
    return button;
  }

  function syncQuickTags(container, activeValues) {
    container.querySelectorAll('button[data-quick]').forEach((button) => {
      const active = activeValues.includes(button.dataset.quick);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    container.updateQuickOverflow?.();
  }

  function bindQuickMore(button, container) {
    function updateQuickOverflow() {
      container.querySelectorAll('button.is-overflow').forEach((chip) => chip.classList.remove('is-overflow'));
      if (button.getAttribute('aria-expanded') === 'true') return;
      const bounds = container.getBoundingClientRect();
      if (!bounds.width) return;
      let firstTop;
      let overflowStarted = false;
      container.querySelectorAll('button[data-quick]').forEach((chip) => {
        if (getComputedStyle(chip).display === 'none') return;
        const rect = chip.getBoundingClientRect();
        firstTop ??= rect.top;
        overflowStarted ||= rect.top > firstTop + 2 || rect.right > bounds.right + 1;
        chip.classList.toggle('is-overflow', overflowStarted);
      });
    }
    container.updateQuickOverflow = () => requestAnimationFrame(updateQuickOverflow);
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      button.textContent = expanded ? 'Показать ещё' : 'Свернуть';
      container.classList.toggle('is-expanded', !expanded);
      container.updateQuickOverflow();
    });
    new ResizeObserver(() => container.updateQuickOverflow()).observe(button.parentElement);
    container.updateQuickOverflow();
  }

  // Unknown Moscow prices must never sort as zero or enter a price range.
  function comparePrice(a, b, descending = false) {
    if (a.price == null || b.price == null) return (a.price == null) - (b.price == null) || a.order - b.order;
    return descending ? b.price - a.price : a.price - b.price;
  }

  // Three-valued fit: false = proven violation, null = missing evidence.
  const combineFit = (...results) => results.includes(false) ? false : results.includes(null) ? null : true;
  const compareKnown = (a,b,test) => a==null || b==null ? null : test(a,b);
  function cpuBoardFit(cpu,board) {return !cpu || !board ? true : compareKnown(cpu.socket,board.socket,(a,b)=>a===b);}
  function caseBoardFit(computerCase,board) {return !computerCase || !board ? true : compareKnown(computerCase.forms,board.form,(a,b)=>a.includes(b));}
  function casePowerFit(computerCase,power) {return !computerCase || !power ? true : compareKnown(computerCase.psuForms,power.formFactor,(a,b)=>a.includes(b));}
  function gpuCaseFit(gpu,computerCase) {
    if(!gpu || !computerCase) return true;
    return combineFit(compareKnown(gpu.compatibilityLengthMm,computerCase.gpu,(a,b)=>a<=b),compareKnown(gpu.expansionSlots,computerCase.slots,(a,b)=>Math.ceil(a)<=b));
  }
  function gpuPowerFit(gpu,power) {
    if(!gpu || !power) return true;
    const wattage=compareKnown(power.power,gpu.recommendedPsuW,(a,b)=>a>=b);
    if(gpu.powerConnectors==null || power.gpuConnectors==null) return combineFit(wattage,null);
    const connectors=gpu.powerConnectors.map(({type,count})=>{
      if(count==null) return null;
      if(type==='8-pin PCIe') return compareKnown(productContract.connectorCount(power.gpuConnectors,'6+2-pin PCIe'),count,(a,b)=>a>=b);
      if(type==='16-pin') {
        const native=power.gpuConnectors.filter(row=>row.type==='16-pin');
        if(native.some(row=>row.count>=count)) return true;
        if(native.some(row=>row.count==null)) return null;
        if(count!==1) return false;
        return compareKnown(productContract.connectorCount(power.gpuConnectors,'6+2-pin PCIe'),gpu.adapter8PinCount,(a,b)=>a>=b);
      }
      return null;
    });
    return combineFit(wattage,...connectors);
  }
  const cpuFitsBoard=(cpu,board)=>cpuBoardFit(cpu,board)===true;
  const caseFitsBoard=(computerCase,board)=>caseBoardFit(computerCase,board)===true;
  const caseFitsPower=(computerCase,power)=>casePowerFit(computerCase,power)===true;
  const gpuFitsCase=(gpu,computerCase)=>gpuCaseFit(gpu,computerCase)===true;
  const gpuFitsPower=(gpu,power)=>gpuPowerFit(gpu,power)===true;

  // Trusted template slots only; catalog/user strings still use textContent.
  const controlDefinitions = {"filter-search": {"tag": "div", "className": "filter-search"}, "filter-heading": {"tag": "button", "className": "filter-heading"}, "store-select": {"tag": "div", "className": "store-select"}, "price-inputs": {"tag": "div", "className": "price-inputs"}, "price-track": {"tag": "div", "className": "price-track"}, "price-reset": {"tag": "button", "className": "price-reset"}, "socket-search": {"tag": "div", "className": "socket-search"}, "filter-more": {"tag": "button", "className": "filter-more"}, "all-filters": {"tag": "button", "className": "all-filters"}, "sort-trigger": {"tag": "button", "className": "sort-trigger"}, "sort-menu": {"tag": "div", "className": "sort-menu"}, "toolbar-select": {"tag": "div", "className": "toolbar-select"}, "reset-chip": {"tag": "button", "className": "reset-chip"}, "compatible-chip": {"tag": "button", "className": "compatible-chip"}, "products-empty": {"tag": "p", "className": "products-empty"}, "processor-toolbar": {"tag": "div", "className": "processor-toolbar"}, "toolbar-main": {"tag": "div", "className": "toolbar-main"}, "filter-panel": {"tag": "div", "className": "filter-panel"}, "catalog-options": {"tag": "div", "className": "catalog-options"}, "board-options": {"tag": "div", "className": "board-options"}, "power-options": {"tag": "div", "className": "power-options"}, "socket-options": {"tag": "div", "className": "socket-options"}, "filter-section": {"tag": "div", "className": "filter-section"}, "power-quick-more": {"tag": "button", "className": "power-quick-more"}, "catalog-quick": {"tag": "div", "className": "catalog-quick"}, "filter-option": {"tag": "label", "className": ""}, "sort-option": {"tag": "button", "className": ""}};
  function controlMarkup(kind, attributes = {}, content = '') {
    const definition = controlDefinitions[kind];
    if (!definition) throw new Error(`Unknown catalog control: ${kind}`);
    const element = document.createElement(definition.tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value ?? '');
    element.className = [definition.className, attributes.class].filter(Boolean).join(' ');
    element.dataset.dsComponent = `catalog.${kind}`;
    if (content && typeof content === 'object') {
      const input = attributes => {
        const field = document.createElement('input');
        for (const [key,value] of Object.entries(attributes || {})) field.setAttribute(key,value ?? '');
        return field;
      };
      const label = () => document.createTextNode(content.text || '');
      if (kind === 'filter-search' || kind === 'socket-search') element.append(input({...content.input,...(kind==='filter-search'?{'data-filter-id':'filter-search'}:{})}));
      else if (kind === 'price-inputs') element.append(...content.inputs.map((attributes,index)=>input({...attributes,'data-option-id':index?'maximum':'minimum'})));
      else if (kind === 'price-track') {} // Interactive handles are supplied below for every consumer.
      else if (kind === 'filter-option') {
        element.append(input(content.input));
        const text = content.wrapped || content.hint ? node('span','',content.text) : label();
        element.append(text);
        if (content.hint) {
          element.classList.add('filter-option-with-hint'); text.classList.add('filter-option-text');
          text.append(node('small','',content.hint)); setFilterLabel(element, content.text);
        }
        if (content.shield) element.append(markup('<svg class="power-filter-shield" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.3 13 3v4.2c0 3.2-2 5.7-5 7.2-3-1.5-5-4-5-7.2V3l5-1.7Z"/><path d="m5.6 7.6 1.6 1.5 3.2-3.2"/></svg>'));
      } else if (kind === 'filter-heading') {
        const arrow=node('span','filter-arrow'); arrow.setAttribute('aria-hidden','true'); element.append(arrow,label());
      } else if (kind === 'sort-trigger' || kind === 'store-select') {
        const arrow=node('span'); arrow.setAttribute('aria-hidden','true'); element.append(document.createTextNode((content.text || '')+' '),arrow);
      } else if (kind === 'compatible-chip') {const icon=node('span','catalog-dismiss-icon');icon.setAttribute('aria-hidden','true');element.append(label(),icon);}
      else throw new Error(`Unsupported structured control: ${kind}`);
    } else element.innerHTML = content;
    if (kind === 'price-track') {
      for (const [index, label] of ['Минимальная цена', 'Максимальная цена'].entries()) {
        const handle = document.createElement('input'); handle.type = 'range'; handle.min = '0'; handle.max = '50000'; handle.value = index ? '50000' : '0'; handle.step = '1';
        handle.setAttribute('aria-label', label); element.append(handle);
      }
    }
    return element.outerHTML;
  }
  define('availabilityGroup', 'Наличие в магазинах · группа фильтра', '', () => markup(
    controlMarkup("filter-section", {"class": "availability", "data-filter-id": "availability"}, "<h3>" +
    controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Наличие в магазинах"}) + "</h3>" +
    controlMarkup("store-select", {}, {"text": "В любом из 12 магазинов"}) +
    controlMarkup("filter-option", {"data-filter-id": "in-stock"}, {"input": {"type": "checkbox", "checked": null}, "text": "В наличии", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-filter-id": "order-today"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: сегодня", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-filter-id": "order-tomorrow"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: завтра", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-filter-id": "order-later"}, {"input": {"type": "checkbox", "checked": null}, "text": "Под заказ: позже", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-filter-id": "unavailable"}, {"input": {"type": "checkbox"}, "text": "Отсутствующие в продаже", "wrapped": false, "hint": "", "shield": false}))
  ));
  define('socketGroup', 'Сокет · группа фильтра процессоров', '', () => markup(
    controlMarkup("filter-section", {"class": "socket-filter", "data-filter-id": "socket"}, "<h3>" +
    controlMarkup("filter-heading", {"type": "button", "aria-expanded": "true"}, {"text": "Сокет"}) + "</h3>" +
    controlMarkup("socket-search", {}, {"input": {"type": "search", "id": "socket-search", "placeholder": "Поиск", "aria-label": "Поиск по сокетам"}}) +
    controlMarkup("filter-option", {}, {"input": {"type": "checkbox", "id": "socket-select-all"}, "text": "Выбрать все", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("socket-options", {}, controlMarkup("filter-option", {"data-value": "AM5"}, {"input": {"type": "checkbox"}, "text": "AM5 (8)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-value": "AM4"}, {"input": {"type": "checkbox"}, "text": "AM4 (4)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-value": "LGA 1851"}, {"input": {"type": "checkbox"}, "text": "LGA 1851 (0)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-value": "LGA 1700"}, {"input": {"type": "checkbox"}, "text": "LGA 1700 (7)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-value": "LGA 1200"}, {"input": {"type": "checkbox"}, "text": "LGA 1200 (0)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-value": "LGA 1151-v2"}, {"input": {"type": "checkbox"}, "text": "LGA 1151-v2 (0)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"data-value": "LGA 1151"}, {"input": {"type": "checkbox"}, "text": "LGA 1151 (0)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"class": "socket-extra", "hidden": null, "data-value": "LGA 2066"}, {"input": {"type": "checkbox"}, "text": "LGA 2066 (0)", "wrapped": false, "hint": "", "shield": false}) +
    controlMarkup("filter-option", {"class": "socket-extra", "hidden": null, "data-value": "FM2+"}, {"input": {"type": "checkbox"}, "text": "FM2+ (0)", "wrapped": false, "hint": "", "shield": false})) +
    controlMarkup("filter-more", {"type": "button", "aria-expanded": "false"}, "Показать всё"))
  ));
  function controlElement(kind, attributes = {}, content = '') { return markup(controlMarkup(kind,attributes,content)); }
  function bindSocketList(root, onChange = () => {}) {
    const socketSearch = root.querySelector('input[type=search]');
    const socketLabels = [...root.querySelectorAll('.socket-options label')];
    const socketSelectAll = root.querySelector('#socket-select-all');
    const showAllSockets = root.querySelector('.filter-more');
    function syncSocketSelectAll() {
      const available = socketLabels.map((label) => label.querySelector('input')).filter((input) => !input.disabled);
      const checked = available.filter((input) => input.checked).length;
      socketSelectAll.checked = available.length > 0 && checked === available.length;
      socketSelectAll.indeterminate = checked > 0 && checked < available.length;
    }

    function updateSocketVisibility() {
      const query = socketSearch.value.trim().toLocaleLowerCase('ru');
      const expanded = showAllSockets.getAttribute('aria-expanded') === 'true';
      socketLabels.forEach((label) => {
        label.hidden = (label.classList.contains('socket-extra') && !expanded && !query)
          || (Boolean(query) && !label.textContent.toLocaleLowerCase('ru').includes(query));
      });
    }

    socketSearch.addEventListener('input', updateSocketVisibility);
    showAllSockets.addEventListener('click', () => {
      const expanded = showAllSockets.getAttribute('aria-expanded') !== 'true';
      showAllSockets.setAttribute('aria-expanded', String(expanded));
      showAllSockets.textContent = expanded ? 'Свернуть' : 'Показать всё';
      updateSocketVisibility();
    });
    socketSelectAll.addEventListener('change', () => {
      socketLabels.forEach((label) => { const input = label.querySelector('input'); if (!input.disabled) input.checked = socketSelectAll.checked; });
      socketSelectAll.indeterminate = false;
      onChange();
    });
    socketLabels.forEach((label) => label.querySelector('input').addEventListener('change', () => {syncSocketSelectAll();onChange();}));

    return {syncSocketSelectAll, updateSocketVisibility};
  }
  function setFilterLabel(label, caption) {
    const text = label.querySelector('.filter-option-text');
    const hint = text.querySelector('small');
    const match = caption.match(/^(.*?)\s*(\(\d+\))$/);
    text.replaceChildren(document.createTextNode(match ? match[1] + ' ' : caption));
    if (match) text.append(node('span','filter-count',match[2]));
    if (hint) text.append(hint);
  }
  function filterOption() {
    return markup(controlMarkup('filter-option', {}, {input:{type:'checkbox'},text:'',wrapped:true}));
  }
  const priceRanges = new WeakMap();
  function setSectionExpanded(section, expanded) {
    section.classList.toggle('is-collapsed', !expanded);
    section.querySelector('.filter-heading').setAttribute('aria-expanded', String(expanded));
  }
  function bindFilterSearch(input,panel,{selector='.filter-section,.filter-line',empty}={}){
    if(empty===true){empty=node('p','filter-empty','Фильтры не найдены');empty.hidden=true;panel.append(empty);}
    const update=()=>{const query=input.value.trim().toLocaleLowerCase('ru');let found=0;
      for(const item of panel.querySelectorAll(selector)){const matches=item.textContent.toLocaleLowerCase('ru').includes(query);item.hidden=!matches;if(matches)found++;}
      if(empty)empty.hidden=found!==0;
    };
    input.addEventListener('input',update);return update;
  }
  function bindFacetDisclosure(section) {
    section.querySelector('.filter-heading').addEventListener('click',()=>setSectionExpanded(section,section.classList.contains('is-collapsed')));
  }
  function bindAllFilters(button,{search,panel,sidebar}) {
    button.addEventListener('click',()=>{
      search.value='';search.dispatchEvent(new Event('input'));
      panel.querySelectorAll('.filter-section').forEach(section=>setSectionExpanded(section,true));
      sidebar.scrollTo({top:0,behavior:'smooth'});search.focus();
    });
  }
  // The fields are authoritative; every catalog render also synchronizes the handles.
  function bindPriceRange(root, min, max) {
    const existing = priceRanges.get(root);
    if (existing) {existing(); return existing;}
    const fields = [...root.querySelectorAll('.price-inputs input')];
    const track = root.querySelector('.price-track');
    const handles = [...track.querySelectorAll('input')];
    const number = (field, fallback) => field.value.trim() ? Number(field.value.replace(/\D/g, '')) : fallback;
    const clamp = value => Math.max(min, Math.min(max, value));
    const sync = () => {
      const values = [clamp(number(fields[0], min)), clamp(number(fields[1], max))];
      handles.forEach((handle, index) => {handle.value = values[index]; handle.disabled = min === max;});
      const percent = value => 100 * (value - min) / (max - min || 1);
      track.style.setProperty('--range-start', `${percent(values[0])}%`);
      track.style.setProperty('--range-end', `${percent(values[1])}%`);
    };
    handles.forEach((handle, index) => {
      handle.min = min; handle.max = max;
      handle.addEventListener('input', () => {
        const other = Number(handles[1 - index].value);
        fields[index].value = String(index ? Math.max(other, Number(handle.value)) : Math.min(other, Number(handle.value)));
        fields[index].dispatchEvent(new Event('input', {bubbles: true}));
        sync();
      });
    });
    fields.forEach(field => field.addEventListener('input', sync));
    fields.forEach(field => field.addEventListener('change', sync));
    priceRanges.set(root, sync); sync(); return sync;
  }
  function bindSort(trigger, menu, onChange) {
    const options = [...menu.querySelectorAll('[data-sort]')];
    trigger.setAttribute('aria-haspopup','menu');
    menu.setAttribute('role','menu');
    const close = () => {menu.hidden = true; trigger.setAttribute('aria-expanded','false');};
    trigger.addEventListener('click', () => {menu.hidden = !menu.hidden; trigger.setAttribute('aria-expanded',String(!menu.hidden));});
    options.forEach(option => {
      option.setAttribute('role','menuitemradio');
      if (!option.hasAttribute('aria-checked')) option.setAttribute('aria-checked',String(option.dataset.sort === 'popular'));
      option.addEventListener('click', () => {
        options.forEach(item => item.setAttribute('aria-checked',String(item === option)));
        trigger.firstChild.textContent = `${option.textContent} `;
        close(); onChange(option.dataset.sort); trigger.focus();
      });
    });
    document.addEventListener('click',event => {if (!trigger.contains(event.target) && !menu.contains(event.target)) close();});
    // Stop Escape before the page-level modal handler: first close the menu.
    menu.parentElement.addEventListener('keydown',event => {
      if (event.key === 'Escape' && !menu.hidden) {event.stopPropagation(); close(); trigger.focus();}
    });
    return close;
  }
  function mountModal(modal, config, filtersMarkup, resultsMarkup) {
    const shell = component('modalShell', {id: modal.id.replace(/-modal$/, ''), title: config.title});
    const count = shell.querySelector('.processor-modal-heading strong');
    for (const [key,value] of Object.entries(config.countAttributes)) count.setAttribute(key,value);
    count.textContent = config.countText;
    const close = shell.querySelector('.processor-modal-close');
    for (const [key,value] of Object.entries(config.closeAttributes)) close.setAttribute(key,value);
    const filters = shell.querySelector('.processor-filters');
    filters.setAttribute('aria-label',config.filtersLabel); filters.innerHTML = filtersMarkup;
    const results = shell.querySelector('.processor-results');
    results.setAttribute('aria-label',config.resultsLabel); results.innerHTML = resultsMarkup;
    modal.querySelector('.processor-modal-scroll')?.destroyScrollRail?.();
    modal.replaceChildren(...shell.childNodes);
    if(!modal.hidden)syncModalScrollRail(modal);
    mountComparison(modal);component('catalogFilters',{modal});
  }
  function updateFitStatus(element, fit) {
    updateStatus(element,fit===false);
    element.dataset.compatibility=fit==null ? 'unknown' : fit ? 'compatible' : 'incompatible';
    element.classList.toggle('is-unknown',fit==null);
    if(fit==null) element.textContent='Недостаточно данных';
  }
  function updateStatus(element, incompatible) {
    const source = component('status', {incompatible});
    element.className = source.className;
    element.textContent = source.textContent;
  }
  function facetSection(title, facet, options = []) {
    const section = controlElement('filter-section', {class:'power-facet catalog-facet is-collapsed'});
    section.dataset.facet = facet;
    section.innerHTML = '<h3>' + controlMarkup('filter-heading', {type:'button', 'aria-expanded':'false'}, {text:''}) + '</h3>' + controlMarkup('catalog-options');
    section.querySelector('button').append(document.createTextNode(title));
    options.forEach((value) => {
      const label = filterOption();
      label.dataset.value = String(value);
      label.querySelector('span').textContent = value;
      section.querySelector('.catalog-options').append(label);
    });
    return section;
  }

  // Bind stable controls once; snapshot their values once per render, never per product.
  function createFilterReader(root, selectors) {
    const facets = [...root.querySelectorAll('[data-facet]')].map(section => [
      section.dataset.facet,
      [...section.querySelectorAll('label[data-value]')].map(label => ({value: label.dataset.value, input: label.querySelector('input')}))
    ]);
    const controls = Object.entries(selectors).map(([key, selector]) => [key, root.querySelector(selector)]);
    return () => ({
      facets: new Map(facets.map(([key, options]) => [key, options.filter(option => option.input.checked).map(option => option.value)])),
      controls: Object.fromEntries(controls.map(([key, input]) => [key, {
        checked: input.checked, value: input.value, productQuery: input.dataset.productQuery || ''
      }]))
    });
  }

  function productMeta(data) {
    const meta = node('div', 'product-meta');
    if(data.showCompare !== false) meta.append(component('compare',data));
    meta.append(component('rating', data));
    if (data.questions != null) meta.append(component('questions', data));
    meta.append(component('reliability', data));
    return meta;
  }

  function normalizeProductStock(card) {
    const stock = card.querySelector('.product-stock');
    if (!stock || stock.querySelector('.stock-line')) return;
    const parts = [...stock.children];
    if (parts.length !== 5) return;
    const lines = [parts.slice(0, 2), parts.slice(2, 4), parts.slice(4)];
    stock.replaceChildren(...lines.map((items) => {
      const line = document.createElement('div');
      line.className = 'stock-line';
      line.append(...items);
      return line;
    }));
  }

  // Display adapters contain no independently maintained technical values.
  function motherboardCardData(item) {return categoryCardData(item,'motherboard');}
  function categoryCardData(item,kind=item.category) {
    const data={...item,product:item,image:item.image};
    if(kind==='processor') return data;
    const names={'motherboard':'Материнская плата','power-supply':'Блок питания',case:'Корпус'};
    if(names[kind]) data.name=`${names[kind]} ${item.name}`;
    const keys={motherboard:['socket','form','slots','pcie','sata'],'power-supply':['power','fans','certificate'],case:['forms','size','slots','fanGroups','interfacePorts'],gpu:['pcieGeneration','clockMaxMhz','memoryGb','busBits','videoPorts']}[kind];
    data.specs=keys.map(key=>[productContract.schemas[kind].find(def=>def.key===key).title,productContract.text(item,key)]);
    if(kind==='motherboard') {data.imageBadge='assets/configurator/507Q37PZ190BKMH19E4FJ73JMF.webp';data.badge=item.badge ?? 'Хит продаж';}
    if(kind==='power-supply') data.badgeKind=item.badgeKind;
    if(kind==='gpu') {data.badgeKind=item.reviewsCount>=1000 ? 'hit' : undefined;data.specs[0]=['Интерфейс',item.interface];data.specs[1]=['Частота видеочипа',item.gpuClockDisplay];data.specs[2]=['Видеопамять',`${productContract.text(item,'memoryGb')} ${item.memoryType ?? 'Неизвестно'}`];}
    return data;
  }

  define('comparisonAdd','Добавить из сравнения','selected-controls',({product,selected=false,onSelect}={})=>{
    const button=component('select');button.classList.add('comparison-add');button.dataset.productId=product.id;
    comparisonControl(button,'comparison.select',product.category,product);
    function sync() {
      setSelectionButton(button,selected ? 'added' : 'add');
      button.innerHTML=selected ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M15 14h.01M9 6h6M9 10h6"/></svg>';
      button.setAttribute('aria-label',`${selected ? 'Добавлен в сборку' : 'Добавить в сборку'}: ${product.name}`);
    }
    button.setSelected=value=>{selected=!!value;sync();};
    button.addEventListener('click',()=>{if(selected)return;onSelect?.(product);button.setSelected(true);});sync();return button;
  });
  define('comparisonClose','Закрыть сравнение','catalog-comparison',({onClose}={})=>{
    const button=node('button','comparison-close');button.type='button';button.setAttribute('aria-label','Закрыть сравнение и вернуться к товарам');
    button.addEventListener('click',()=>onClose?.());return button;
  });
  define('quickPickerButton','Быстрый подбор · шеврон','',({label='',compact=!label,onBrowse}={})=>{
    const button=node('button','quick-picker-button');button.type='button';button.setAttribute('aria-expanded','false');
    button.append(node('span','quick-picker-label',label));button.classList.toggle('is-compact',compact);
    button.addEventListener('click',()=>onBrowse?.());return button;
  });
  define('comparisonBrowse','Добавить товары в сравнение','catalog-comparison',({onBrowse,compact=false}={})=>{
    const button=component('quickPickerButton',{label:'Добавить',compact,onBrowse});button.classList.add('comparison-browse');
    button.setAttribute('aria-label','Добавить товары в сравнение');return button;
  });
  define('comparisonDifferences','Только различия · переключатель','catalog-comparison',({checked=false}={})=>{
    const label=filterOption();label.querySelector('span').textContent='Только различия';
    label.classList.add('comparison-differences');
    const input=label.querySelector('input');input.className='comparison-only-differences';input.checked=checked;input.setAttribute('role','switch');
    return label;
  });
  define('comparisonGroup','Заголовок секции сравнения','catalog-comparison',({title='Общие параметры',expanded=true,onToggle}={})=>{
    const button=controlElement('filter-heading',{type:'button','aria-expanded':String(expanded)},{text:title});
    button.classList.add('comparison-group-toggle');
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));onToggle?.(open);});
    return button;
  });
  const processorComparisonGroups = [
    ['Заводские данные',['warranty'],'factory'],
    ['Общие параметры',['model','socket','manufacturerCode','releaseYear','coolerIncluded','thermalInterface','family','generation'],'general'],
    ['Ядро и архитектура',['cores','performanceCores','efficientCores','threads','cacheL2Mb','cacheL3Mb','processTechnology','coreArchitecture'],'architecture'],
    ['Частота и возможность разгона',['baseClock','boostClock','efficientBaseClockGhz','efficientBoostClockGhz','unlockedMultiplier'],'frequency'],
    ['Параметры оперативной памяти',['memory','maxMemoryGb','memoryChannels','memorySpeeds','ecc'],'memory'],
    ['Тепловые характеристики',['tdp','basePowerW','maxTemperatureC'],'thermal'],
    ['Графическое ядро',['graphics','graphicsModel','graphicsClockMhz','graphicsUnits','shadingUnits'],'graphics'],
    ['Шина и контроллеры',['pcieController','pcieLaneCount'],'bus'],
    ['Дополнительная информация',['virtualization','features'],'additional']
  ];
  let comparisonInstance=0;
  const comparisonCategoryNames={processor:'Процессоры',motherboard:'Материнские платы','power-supply':'Блоки питания',case:'Корпуса',gpu:'Видеокарты'};
  define('comparisonCategories','Категории сравнения','catalog-comparison',({category,categories=[],counts={},onCategory,onCloseCategory}={})=>{
    const result=node('div','comparison-categories');result.setAttribute('aria-label','Категории сравнения');
    for(const id of categories) {
      const chip=node('div','comparison-category-chip');
      const select=comparisonControl(node('button','comparison-category-select',comparisonCategoryNames[id]),'comparison.category',id);select.type='button';select.dataset.category=id;select.append(node('span','comparison-category-count',String(counts[id] || 0)));select.setAttribute('aria-pressed',String(id===category));select.addEventListener('click',()=>onCategory?.(id));
      const clear=comparisonControl(node('button','comparison-category-clear'),'comparison.category.close',id);const icon=node('span','catalog-dismiss-icon');icon.setAttribute('aria-hidden','true');clear.append(icon);clear.type='button';clear.dataset.category=id;clear.title=`Закрыть вкладку: ${comparisonCategoryNames[id]}`;clear.setAttribute('aria-label',clear.title);clear.addEventListener('click',()=>onCloseCategory?.(id));
      chip.classList.toggle('is-active',id===category);chip.append(select,clear);result.append(chip);
    }
    return result;
  });
  function comparisonTable({category,products=[],onRemove,onClose,onSelect,selectedProduct,onlyDifferences=false,categories=[category],counts={},onCategory,onClear,onCloseCategory,undoCategory,onUndo,hasActive=true,collapsedGroups=[],onCompare,browseProducts,getBuildState=()=>window.configuratorState || {},browseOpen=false,browseScrollLeft=0,browseFocusId,browsePositions,revealProductId,tableScrollLeft=0,tableScrollTop=0,onMeasure=()=>{},comparisonId,telemetry=false}={}) {
    const root=node('section','catalog-comparison');
    root.dataset.dsComponent='catalog.comparison';
    root.dataset.comparisonContext=telemetry?'working':'isolated';
    root.dataset.comparisonId=comparisonId || '';
    root.dataset.comparisonCategory=category;
    root.dataset.comparisonProducts=JSON.stringify(products.map(({id,name})=>({id,name})));
    root.dataset.telemetryPlacement='comparison.table';
    const instance=++comparisonInstance;
    const collapsed=new Set(collapsedGroups);
    root.comparisonCollapsedGroups=collapsed;
    const label=component('comparisonDifferences',{checked:onlyDifferences});
    const toolbar=node('div','comparison-toolbar');toolbar.append(component('comparisonCategories',{category,categories,counts,onCategory,onCloseCategory}),label);
    const toggle=label.querySelector('input');toggle.disabled=!hasActive;
    comparisonControl(toggle,'comparison.differences',category);
    const close=comparisonControl(component('comparisonClose',{onClose}),'comparison.close',category);
    const scrollFrame=node('div','comparison-scroll-frame');
    const scrollRail=node('div','comparison-scroll-rail');
    const horizontalRail=node('div','comparison-horizontal-rail');
    const viewport=node('div','comparison-viewport');viewport.dataset.comparisonScroll='table';scrollRail.dataset.comparisonScrollControl='y';horizontalRail.dataset.comparisonScrollControl='x';viewport.tabIndex=0;viewport.setAttribute('aria-label','Таблица сравнения, прокрутка');
    bindScrollRail(scrollRail,viewport);bindScrollRail(horizontalRail,viewport,'x');
    const table=node('table','comparison-table');
    table.style.setProperty('--comparison-columns',products.length);table.classList.toggle('is-empty',!products.length);
    const caption=node('caption','comparison-caption','Характеристики товаров');
    const columns=node('colgroup');for(const product of products) {const col=node('col');col.style.width='270px';columns.append(col);}columns.append(node('col'));
    const head=node('thead'),heading=node('tr');
    for(const product of products) {
      const cell=node('th','comparison-product');cell.scope='col';
      const info=node('div','comparison-product-info');
      if(product.image) info.append(component('photo',product));
      info.append(node('span','comparison-product-name',product.name));cell.append(info);
      const bar=node('div','comparison-product-bar');const price=component('comparisonPrice',product);bar.append(price);
      const actions=node('div','selected-controls comparison-actions');bar.append(actions);cell.append(bar);
      actions.append(component('favorite'));
      if(onRemove) {const remove=component('remove',{kind:{motherboard:'board','power-supply':'power'}[category] || category});remove.classList.add('comparison-remove');comparisonControl(remove,'comparison.remove',category,product);remove.setAttribute('aria-label',`Убрать из сравнения: ${product.name}`);remove.addEventListener('click',()=>onRemove(product));actions.append(remove);}
      actions.append(component('comparisonAdd',{product,selected:selectedProduct?.id===product.id,onSelect}));
      heading.append(cell);
    }
    const filler=node('td','comparison-fill');
    const browse=comparisonControl(component('comparisonBrowse',{onBrowse:()=>{showPicker(!root.comparisonBrowseOpen);onMeasure('browse',{expanded:root.comparisonBrowseOpen});}}),'comparison.browse',category);heading.append(filler);
    toolbar.insertBefore(browse,label);browse.disabled=!hasActive;
    const clearSet=node('button','comparison-clear','Очистить сравнение');clearSet.type='button';comparisonControl(clearSet,'comparison.clear',category);clearSet.disabled=!hasActive || !products.length;clearSet.addEventListener('click',()=>onClear?.(category));toolbar.append(clearSet);
    const undoNotice=node('div','comparison-undo-notice');undoNotice.hidden=!undoCategory;undoNotice.setAttribute('role','status');
    if(undoCategory){const undo=node('button','comparison-undo','Отменить');undo.type='button';comparisonControl(undo,'comparison.category.restore',undoCategory);undo.addEventListener('click',()=>onUndo?.());undoNotice.append(undo,node('span','',`Закрыта вкладка «${comparisonCategoryNames[undoCategory]}»`));}
    const previousArrow=catalogUI.railArrow('previous'),nextArrow=catalogUI.railArrow('next');
    comparisonControl(previousArrow,'comparison.previous',category);comparisonControl(nextArrow,'comparison.next',category);
    previousArrow.classList.add('comparison-header-arrow');nextArrow.classList.add('comparison-header-arrow');
    previousArrow.setAttribute('aria-label','Предыдущие товары в сравнении');nextArrow.setAttribute('aria-label','Следующие товары в сравнении');
    function pageHeader(direction) {
      const maximum=Math.max(0,viewport.scrollWidth-viewport.clientWidth),left=viewport.scrollLeft;
      const step=Math.max(1,Math.floor((viewport.clientWidth-118)/270))*270;
      viewport.scrollLeft=direction>0 && left>=maximum-1 ? 0 : Math.max(0,Math.min(maximum,(direction>0 ? Math.floor(left/270) : Math.ceil(left/270))*270+direction*step));
    }
    previousArrow.addEventListener('click',()=>pageHeader(-1));nextArrow.addEventListener('click',()=>pageHeader(1));
    const pickerHost=node('div','comparison-picker-host');pickerHost.dataset.comparisonScrollInput='table';pickerHost.hidden=true;
    pickerHost.id=`comparison-picker-${instance}`;browse.setAttribute('aria-controls',pickerHost.id);
    let strip=null,request=0,pickerScrollLeft=browseScrollLeft;
    function releaseStrip() {if(strip){pickerScrollLeft=strip.querySelector('.build-board-track').scrollLeft;strip.destroy();prototypeImages.release(strip);strip=null;}}
    async function showPicker(open) {
      const current=++request;
      root.comparisonBrowseOpen=open;pickerHost.hidden=!open;browse.setAttribute('aria-expanded',String(open));
      if(!open){syncScrollMetrics();return;}
      releaseStrip();pickerHost.replaceChildren(node('p','comparison-picker-status','Загрузка товаров…'));syncScrollMetrics();
      try {
        const candidates=browseProducts || await catalogLoader.data(category);
        if(current!==request || !root.isConnected)return;
        const comparedIds=new Set(products.map(product=>product.id));
        const items=catalogUI.quickPickerItems(category,candidates,getBuildState()).filter(product=>!comparedIds.has(product.id));
        if(!items.length){pickerHost.replaceChildren(node('p','comparison-picker-status','Нет товаров для добавления'));if(browseFocusId)browse.focus({preventScroll:true});syncScrollMetrics();return;}
        strip=component('boardSuggestions',{category,products:items,selectionTarget:'comparison',onSelect(product){
          if(products.some(item=>item.id===product.id))return;
          const index=items.findIndex(item=>item.id===product.id);
          onCompare?.(product,(items[index+1] || items[index-1])?.id || product.id);
        }});
        strip.dataset.comparisonContext=telemetry?'working':'isolated';
        strip.querySelectorAll('.build-board-add').forEach(button=>{const product=items.find(item=>item.id===button.closest('[data-product-id]').dataset.productId);comparisonControl(button,'comparison.add',category,product,'comparison.picker');});
        pickerHost.replaceChildren(strip);
        strip.querySelector('.build-board-track').scrollLeft=pickerScrollLeft;
        if(browsePositions){strip.animateShift(browsePositions);browsePositions=null;}
        if(browseFocusId){
          const card=Array.from(strip.querySelectorAll('.build-board-card')).find(card=>card.dataset.productId===browseFocusId);
          const next=card?.querySelector('.build-board-add') || strip.querySelector('.build-board-add') || browse;
          next.focus({preventScroll:true});browseFocusId=null;
        }
        syncScrollMetrics();
      } catch(error) {
        if(current!==request || !root.isConnected)return;
        const retry=node('button','catalog-action-button','Повторить');retry.type='button';retry.addEventListener('click',()=>showPicker(true));
        pickerHost.replaceChildren(node('p','comparison-picker-status','Не удалось загрузить товары'),retry);syncScrollMetrics();
      }
    }
    pickerHost.addEventListener('wheel',event=>{
      if(event.shiftKey || Math.abs(event.deltaX)>=Math.abs(event.deltaY))return;
      const unit=event.deltaMode===1 ? 16 : event.deltaMode===2 ? viewport.clientHeight : 1;
      event.preventDefault();viewport.scrollTop+=event.deltaY*unit;
    },{passive:false});
    function dismissPicker(event) {
      if(root.comparisonBrowseOpen && root.isConnected && !pickerHost.contains(event.target) && !toolbar.contains(event.target) && !head.contains(event.target) && !undoNotice.contains(event.target))showPicker(false);
    }
    document.addEventListener('click',dismissPicker,true);
    root.closePicker=()=>{showPicker(false);browse.focus({preventScroll:true});};
    root.addEventListener('keydown',event=>{if(event.key==='Escape' && root.comparisonBrowseOpen){event.preventDefault();event.stopPropagation();showPicker(false);browse.focus({preventScroll:true});}});
    table.addEventListener('focusin',event=>{
      if(!root.comparisonBrowseOpen || head.contains(event.target))return;
      const box=event.target.getBoundingClientRect(),overlay=pickerHost.getBoundingClientRect();
      if(box.bottom>overlay.top && box.top<overlay.bottom)browse.focus({preventScroll:true});
    });
    head.append(heading);table.append(caption,columns,head);viewport.append(table);scrollFrame.append(viewport,previousArrow,nextArrow,scrollRail,horizontalRail);
    function syncHeaderTools() {
      const height=heading.getBoundingClientRect().height,width=viewport.clientWidth;
      const natural=products.length*270;
      const overflow=viewport.scrollWidth>width+1;
      previousArrow.hidden=!overflow || viewport.scrollLeft<=1;nextArrow.hidden=!overflow || natural<=width;
      previousArrow.style.top=nextArrow.style.top=`${height/2}px`;nextArrow.style.left=`${Math.max(18,close.offsetLeft+close.offsetWidth/2-scrollFrame.offsetLeft-nextArrow.offsetWidth/2)}px`;
      if(previousArrow.hidden && document.activeElement===previousArrow)(nextArrow.hidden ? browse : nextArrow).focus({preventScroll:true});
      if(nextArrow.hidden && document.activeElement===nextArrow)browse.focus({preventScroll:true});
    }
    function syncScrollPositions() {
      syncHeaderTools();
      scrollRail.update();horizontalRail.update();
    }
    function syncScrollMetrics() {
      // Keep overflowing product columns visible without an empty trailing page.
      const width=viewport.clientWidth;
      toolbar.style.paddingRight=`${58+clearSet.offsetWidth+12}px`;
      const maximum=Math.max(0,products.length*270-width);
      table.style.width=`${width+maximum}px`;
      pickerHost.style.width=`${width}px`;
      pickerHost.style.top=`${scrollFrame.getBoundingClientRect().top-root.getBoundingClientRect().top+heading.getBoundingClientRect().height}px`;
      table.style.setProperty('--comparison-product-header-height',`${heading.getBoundingClientRect().height}px`);
      table.style.setProperty('--comparison-toggle-row-height','0px');
      table.style.setProperty('--comparison-viewport-width',`${viewport.clientWidth}px`);
      const verticalOverflow=Math.max(0,viewport.scrollHeight-viewport.clientHeight),horizontalOverflow=Math.max(0,viewport.scrollWidth-viewport.clientWidth);
      scrollRail.hidden=!verticalOverflow;horizontalRail.hidden=!horizontalOverflow;
      scrollRail.style.height=`${Math.max(0,viewport.clientHeight-(horizontalOverflow ? horizontalRail.offsetHeight : 0))}px`;
      horizontalRail.style.width=`${Math.max(0,viewport.clientWidth-(verticalOverflow ? scrollRail.offsetWidth : 0))}px`;

      syncScrollPositions();
    }
    viewport.addEventListener('scroll',syncScrollPositions);
    const resize=new ResizeObserver(()=>{if(!root.isConnected){resize.disconnect();return;}syncScrollMetrics();});resize.observe(heading);resize.observe(table);resize.observe(viewport);resize.observe(toolbar);
    const empty=node('p','comparison-empty');

    function appendRow(body,row,index) {
      const heading=node('tr','comparison-parameter');
      const title=node('th','comparison-parameter-title',row.title);title.id=`comparison-${instance}-${row.key}`;title.colSpan=products.length+1;
      if(row.different) title.classList.add('has-difference');
      if(row.incomplete) title.append(node('small','comparison-row-incomplete','Неполные данные'));
      heading.append(title);
      const tr=node('tr','comparison-values');tr.dataset.field=row.key;tr.classList.toggle('is-different',row.different);
      tr.append(...row.values.map(value=>{const cell=node('td','',value);cell.setAttribute('headers',title.id);return cell;}));
      const filler=node('td','comparison-fill');filler.setAttribute('aria-hidden','true');tr.append(filler);
      for(const element of [heading,tr]) element.classList.toggle('is-shaded',index%2===0);
      body.append(heading,tr);
    }
    function render() {
      const rows=productContract.rows(category,products,toggle.checked);
      table.querySelectorAll('tbody').forEach(body=>body.remove());
      if(products.length && !toggle.checked) {
        const codes=node('tbody','comparison-codes');
        appendRow(codes,{key:'dnsCode',title:'Код товара на сайте DNS',values:products.map(product=>product.dnsCode ?? 'Неизвестно')},1);table.append(codes);
      }
      const groups=category==='processor' ? processorComparisonGroups : [['Общие параметры',rows.map(row=>row.key),'general']];
      for(const [name,keys,groupKey] of groups) {
        const groupRows=keys.map(key=>rows.find(row=>row.key===key)).filter(Boolean);
        if(!groupRows.length || !products.length) continue;
        const body=node('tbody','comparison-group');body.dataset.group=name;
        const tr=node('tr','comparison-group-heading'),cell=node('th');cell.colSpan=products.length+1;
        const groupId=category+'.'+groupKey;
        const button=comparisonControl(component('comparisonGroup',{title:name,expanded:!collapsed.has(name),onToggle(open){if(open)collapsed.delete(name);else collapsed.add(name);sync();onMeasure('group',{target_id:groupId,target_name:name,expanded:open});}}),'comparison.group',category);button.dataset.telemetryTarget=groupId;
        const content=[];
        function sync() {const open=!collapsed.has(name);button.setAttribute('aria-expanded',String(open));content.forEach(row=>row.hidden=!open);}
        cell.append(button);tr.append(cell);body.append(tr);
        groupRows.forEach((row,index)=>appendRow(body,row,index));
        content.push(...Array.from(body.children).slice(1));sync();table.append(body);
      }
      empty.hidden=products.length<2 || rows.length>0;
      empty.textContent=products.length>=2 && !rows.length ? 'Доказанных технических отличий нет' : '';
    }
    root.destroy=()=>{if(telemetry && window.__studyInstalled)window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'comparison.unwatch',element:root}}));++request;document.removeEventListener('click',dismissPicker,true);resize.disconnect();scrollRail.destroy();horizontalRail.destroy();viewport.removeEventListener('scroll',syncScrollPositions);releaseStrip();};
    toggle.addEventListener('change',()=>{render();onMeasure('differences',{selected:toggle.checked});});root.append(close,toolbar,undoNotice,pickerHost,scrollFrame,empty);render();
    requestAnimationFrame(()=>{if(!root.isConnected)return;syncScrollMetrics();viewport.scrollLeft=tableScrollLeft;viewport.scrollTop=tableScrollTop;if(revealProductId){const index=products.findIndex(p=>p.id===revealProductId);if(index>=0)viewport.scrollLeft=Math.max(0,Math.ceil(((index+1)*270-viewport.clientWidth)/270)*270);}});
    if(browseOpen) queueMicrotask(()=>showPicker(true));
    return root;
  }
  define('comparison','Таблица сравнения','catalog-comparison',comparisonTable);
  // Shared tab/set controller for the working catalogs and the isolated DS sample.
  define('comparisonWorkspace','Наборы сравнения','',({sets=new Map(),tabs=new Set(),settings=new Map(),history={},getProducts,getSelected,getBuildState,onSelect,onChange,onExit,telemetry=false}={})=>{
    const host=node('div','comparison-host');let active=null,lastCategory='processor',comparisonId=null;
    function report(action,id=active,extra={}){if(telemetry)comparisonReport(action,id,[...items(id).values()],{comparison_id:comparisonId,placement_id:'comparison.table',...extra});}
    function items(id){if(!sets.has(id))sets.set(id,new Map());return sets.get(id);}
    function capture(){
      const previous=host.firstElementChild;if(!previous || !active)return;
      const viewport=previous.querySelector('.comparison-viewport');
      settings.set(active,{onlyDifferences:previous.querySelector('.comparison-only-differences').checked,
        collapsedGroups:[...previous.comparisonCollapsedGroups],browseOpen:!!previous.comparisonBrowseOpen,
        browseScrollLeft:previous.querySelector('.build-board-track')?.scrollLeft ?? settings.get(active)?.browseScrollLeft ?? 0,
        tableScrollLeft:viewport.scrollLeft,tableScrollTop:viewport.scrollTop});
    }
    function syncSelected(){const selected=getSelected?.(active);host.querySelectorAll('.comparison-add').forEach(button=>button.setSelected(String(selected?.id)===button.dataset.productId));}
    function render({focus=false,focusId,revealProductId}={}){
      const previous=host.firstElementChild;const positions=focusId ? previous?.querySelector('.build-board-suggestions')?.cardPositions() : null;
      previous?.destroy();
      const category=active || lastCategory,products=active ? [...items(active).values()] : [];
      const state=active ? settings.get(active) || {} : {};
      const root=component('comparison',{category,categories:[...tabs],counts:Object.fromEntries([...tabs].map(id=>[id,items(id).size])),products,
        ...state,telemetry,comparisonId,onMeasure:(action,extra)=>report(action,category,extra),hasActive:!!active,undoCategory:history.closed?.category,browseFocusId:focusId,browsePositions:positions,revealProductId,
        browseProducts:getProducts?.(category),getBuildState,selectedProduct:getSelected?.(category),onClose:onExit,
        onCategory(id){if(id===active)return;const previous=active;capture();active=id;lastCategory=id;render({focus:true});report('category',id,{source_category:previous});},
        onClear(id){if(!items(id).size)return;capture();const previous_products=[...items(id).values()].map(({id,name})=>({id,name}));items(id).clear();onChange?.(id);render({focus:true});report('clear',id,{previous_products});},
        onCloseCategory(id){
          capture();history.closed={category:id,index:[...tabs].indexOf(id),products:new Map(items(id)),settings:{...settings.get(id)}};
          tabs.delete(id);sets.set(id,new Map());settings.delete(id);onChange?.(id);
          if(active===id)active=[...tabs][Math.min(history.closed.index,tabs.size-1)] || null;
          if(active)lastCategory=active;render({focus:true});report('category.close',id,{previous_products:[...history.closed.products.values()].map(({id,name})=>({id,name})),destination_category:active});
        },
        onUndo(){
          capture();const snapshot=history.closed;if(!snapshot)return;
          const ids=[...tabs];ids.splice(snapshot.index,0,snapshot.category);tabs.clear();ids.forEach(id=>tabs.add(id));
          sets.set(snapshot.category,new Map(snapshot.products));settings.set(snapshot.category,snapshot.settings);
          active=lastCategory=snapshot.category;history.closed=null;onChange?.(active);render({focus:true});report('category.restore');
        },
        onCompare(product,nextId){if(product.category!==active || items(active).has(product.id))return;capture();items(active).set(product.id,product);onChange?.(active);render({focusId:nextId,revealProductId:product.id});report('add',active,{product_id:product.id,name:product.name,placement_id:'comparison.picker'});},
        onRemove(product){if(!items(active).has(product.id))return;capture();items(active).delete(product.id);onChange?.(active);render({focus:true});report('remove',active,{product_id:product.id,name:product.name});},
        onSelect(product){onSelect?.(product,active);syncSelected();}});
      root.dataset.category=active || '';host.replaceChildren(root);
      if(telemetry && window.__studyInstalled)window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'comparison.watch',element:root,category,comparison_id:comparisonId,products:products.map(({id,name})=>({id,name}))}}));
      if(focus)(root.querySelector('.comparison-category-chip.is-active .comparison-category-select') || root.querySelector('.comparison-undo') || root.querySelector('.comparison-close')).focus({preventScroll:true});
    }
    host.open=(id,instance,resume)=>{comparisonId=instance;active=resume ? resume.active : id;lastCategory=resume?.lastCategory || id;if(!resume){tabs.add(id);items(id);if(history.closed?.category===id)history.closed=null;}render({focus:true});};
    host.snapshot=()=>({active,lastCategory,comparisonId});
    host.capture=capture;host.syncSelected=syncSelected;
    host.comparisonData=()=>({category:active || lastCategory,products:[...items(active || lastCategory).values()].map(({id,name})=>({id,name})),comparison_id:comparisonId});
    return host;
  });
  const comparisons=new Map(),comparisonTabs=new Set(),comparisonSettings=new Map(),comparisonHistory={};
  let comparisonRevision=0;
  // Navigation stores IDs and UI settings only; restore resolves canonical products.
  function snapshotComparison() {
    const modal=[...document.querySelectorAll('.processor-modal')].find(modal=>!modal.hidden && modal.captureComparison);
    const view=modal?.captureComparison() || null,closed=comparisonHistory.closed;
    return {version:1,sets:[...comparisons].map(([id,items])=>[id,[...items.keys()]]),tabs:[...comparisonTabs],settings:[...comparisonSettings],
      closed:closed ? {...closed,products:[...closed.products.keys()]} : null,view};
  }
  async function restoreComparison(snapshot,getProducts,isCurrent=()=>true) {
    if(snapshot?.version!==1 || !Array.isArray(snapshot.sets) || !Array.isArray(snapshot.tabs) || !Array.isArray(snapshot.settings))return null;
    const revision=comparisonRevision;
    const valid=id=>Object.hasOwn(comparisonCategoryNames,id),sets=new Map(),settings=new Map();
    const entries=snapshot.sets.filter(entry=>Array.isArray(entry) && valid(entry[0]));
    const ids=[...new Set([...entries.map(entry=>entry[0]),snapshot.closed?.category].filter(valid))];
    const catalogs=new Map(await Promise.all(ids.map(async id=>[id,new Map((await getProducts(id)).map(item=>[item.id,item]))])));
    if(!isCurrent() || revision!==comparisonRevision)return null;
    const resolve=(id,ids)=>new Map((Array.isArray(ids) ? ids : []).map(key=>catalogs.get(id)?.get(key)).filter(Boolean).map(item=>[item.id,item]));
    const clean=value=>({onlyDifferences:value?.onlyDifferences===true,collapsedGroups:Array.isArray(value?.collapsedGroups) ? value.collapsedGroups.filter(x=>typeof x==='string') : [],
      browseOpen:value?.browseOpen===true,...Object.fromEntries(['browseScrollLeft','tableScrollLeft','tableScrollTop'].map(key=>[key,Number.isFinite(value?.[key]) ? Math.max(0,value[key]) : 0]))});
    for(const [id,products] of entries)sets.set(id,resolve(id,products));
    for(const entry of snapshot.settings)if(Array.isArray(entry) && valid(entry[0]))settings.set(entry[0],clean(entry[1]));
    const tabs=snapshot.tabs.filter(valid),closed=snapshot.closed;
    comparisons.clear();sets.forEach((items,id)=>comparisons.set(id,items));comparisonTabs.clear();tabs.forEach(id=>comparisonTabs.add(id));
    comparisonSettings.clear();settings.forEach((value,id)=>comparisonSettings.set(id,value));delete comparisonHistory.closed;
    if(closed && valid(closed.category))comparisonHistory.closed={category:closed.category,index:Number.isInteger(closed.index) ? Math.max(0,closed.index) : 0,products:resolve(closed.category,closed.products),settings:clean(closed.settings)};
    for(const id of ids)syncComparison(id);
    const view=snapshot.view;
    return view && valid(view.catalog) ? {...view,active:tabs.includes(view.active) ? view.active : null,lastCategory:valid(view.lastCategory) ? view.lastCategory : view.catalog} : null;
  }
  function resetComparison() {
    comparisonRevision++;
    document.querySelectorAll('.processor-modal').forEach(modal=>modal.resetComparison?.());
    comparisons.clear();comparisonTabs.clear();comparisonSettings.clear();delete comparisonHistory.closed;
    for(const id of Object.keys(comparisonCategoryNames))syncComparison(id);
  }
  // This classic script runs before the study module. Capture while its modal
  // still exists, before the study's pagehide handler closes it for measurement.
  window.addEventListener('pagehide',()=>window.dispatchEvent(new CustomEvent('configurator:before-leave',{detail:snapshotComparison()})));

  // The working catalogs share one context. Embedded consumers can own a separate one.
  function createComparisonContext({root=document,sets=new Map(),tabs=new Set(),history={},onChange}={}) {
    return {root,sets,tabs,history,onChange,setCompared(item,active){setCompared(item,active,this);}};
  }
  const defaultComparisonContext=createComparisonContext({sets:comparisons,tabs:comparisonTabs,history:comparisonHistory});
  function comparisonState(category,context=defaultComparisonContext) {
    if(!context.sets.has(category))context.sets.set(category,new Map());return context.sets.get(category);
  }
  function setCompared(item,active,context=defaultComparisonContext,control) {
    const selected=comparisonState(item.category,context);
    const changed=selected.has(item.id)!==active;
    if(changed && context===defaultComparisonContext)comparisonRevision++;
    if(active){selected.set(item.id,item);context.tabs.add(item.category);if(context.history.closed?.category===item.category)context.history.closed=null;}else selected.delete(item.id);
    syncComparison(item.category,context);
    if(changed && context===defaultComparisonContext && control?.isConnected && !control.closest('.processor-card-trial,[data-telemetry-exclude]'))comparisonReport(active?'add':'remove',item.category,[...selected.values()],{product_id:item.id,name:item.name,placement_id:'catalog.card'});
  }
  function syncComparison(category,context=defaultComparisonContext) {
    const selected=comparisonState(category,context),root=context.root;
    root.querySelectorAll('.catalog-compare-input[data-category]').forEach(input=>{
      if(input.dataset.category!==category)return;input.checked=selected.has(input.dataset.compareId);
    });
    root.querySelectorAll('.catalog-compare-icon[data-category]').forEach(button=>{
      if(button.dataset.category===category)button.setAttribute('aria-pressed',String(selected.has(button.dataset.compareId)));
    });
    root.querySelector(`#${category}-modal`)?.querySelectorAll('.comparison-open').forEach(button=>updateComparisonOpener(button,selected.size));
    context.onChange?.(category,selected);
  }
  function mountComparison(modal) {
    const category=modal.id.replace(/-modal$/,'');
    let comparisonId=null,pendingResume=null;
    const header=modal.querySelector('.processor-modal-header');
    const search=modal.querySelector('.processor-filters .filter-search');
    const searchToolbar=component('filterSearchToolbar');
    search.replaceWith(searchToolbar);searchToolbar.prepend(search);
    const filterOpener=searchToolbar.querySelector('.comparison-open');
    const returnOpener=filterOpener;comparisonControl(filterOpener,'comparison.open',category,null,'catalog.filters');
    const panel=node('section','catalog-comparison-panel');panel.hidden=true;panel.setAttribute('aria-label','Сравнение товаров');
    const controls=[modal.querySelector('.processor-filters'),modal.querySelector('.processor-results')];
    const title=header.querySelector('h2'),count=header.querySelector('.processor-modal-heading strong');
    let catalogTitle=title.textContent,catalogCountHidden=count?.hidden;
    const keys={processor:'processor',motherboard:'motherboard','power-supply':'powerSupply',case:'computerCase',gpu:'gpu'};
    const host=component('comparisonWorkspace',{telemetry:true,sets:comparisons,tabs:comparisonTabs,settings:comparisonSettings,history:comparisonHistory,
      getSelected:id=>window.configuratorState?.[keys[id]],onSelect:(product,id)=>document.getElementById(`${id}-modal`).selectComparisonProduct(product),
      onChange:id=>{comparisonRevision++;syncComparison(id);},onExit:()=>close(true,'close_button')});panel.append(host);modal.append(panel);
    function close(focus=true,reason='modal'){
      if(panel.hidden)return;host.capture();
      const data=host.comparisonData();
      panel.hidden=true;controls.forEach(element=>element.inert=false);
      title.textContent=catalogTitle;if(count)count.hidden=catalogCountHidden;
      if(focus)(returnOpener.checkVisibility() ? returnOpener : modal.querySelector('.catalog-filter-trigger')).focus({preventScroll:true});
      comparisonReport('close',data.category,data.products,{comparison_id:comparisonId,reason,placement_id:'comparison.table'});
      if(focus)comparisonReport('return',data.category,data.products,{comparison_id:comparisonId,reason,placement_id:'comparison.table',destination_category:category});
    }
    modal.closeComparison=()=>close(false);
    function open(instance,resume,measure=true){
      if(measure)comparisonRevision++;
      catalogTitle=title.textContent;catalogCountHidden=count?.hidden;
      modal.closeFilters?.(false);panel.hidden=false;controls.forEach(element=>element.inert=true);
      title.textContent='Сравнение';if(count)count.hidden=true;comparisonId=instance;host.open(category,comparisonId,resume);
      const data=host.comparisonData();if(measure)comparisonReport('open',data.category,data.products,{comparison_id:comparisonId,placement_id:'catalog.filters'});
    }
    modal.captureComparison=()=>{if(!panel.hidden)host.capture();return {...(pendingResume || host.snapshot()),catalog:category,tableOpen:!panel.hidden};};
    modal.restoreComparison=view=>{pendingResume=view.comparisonId ? view : null;if(view.tableOpen){open(view.comparisonId,view,false);pendingResume=null;}};
    modal.resetComparison=()=>{pendingResume=null;host.firstElementChild?.destroy();host.replaceChildren();panel.hidden=true;controls.forEach(element=>element.inert=false);title.textContent=catalogTitle;if(count)count.hidden=catalogCountHidden;comparisonId=null;};
    filterOpener.addEventListener('click',()=>{
      if(!panel.hidden){close(true,'toggle');return;}
      open(`comparison-${Date.now()}-${++comparisonInstance}`,pendingResume);pendingResume=null;
    });
    modal.addEventListener('keydown',event=>{if(event.key==='Escape' && !panel.hidden){event.preventDefault();event.stopImmediatePropagation();const comparison=host.firstElementChild;if(comparison?.comparisonBrowseOpen)comparison.closePicker();else close(true,'escape');}},true);
    window.addEventListener('configurator:state-changed',()=>host.syncSelected());
    syncComparison(category);
  }

  function productCard(data) {
    const {id, index, name, imageBadge, specs = []} = data;
    const card = node('article', 'processor-product catalog-product-card');
    card.dataset.dsComponent = 'catalog.card';
    card.comparisonContext = data.comparisonContext || defaultComparisonContext;
    if (id) card.dataset.productId = id;
    card.dataset.telemetryName = name;
    if (index != null) card.dataset.index = index;
    const picture = node('div', 'product-image'); picture.append(component('photo', data));
    if (imageBadge) picture.append(component('imageBadge', data));
    picture.append(component('pagination'));
    const detail = node('div', 'product-detail'); const dl = node('dl','product-specs');
    specs.forEach(spec => dl.append(component('spec', {specs:[spec]}).firstElementChild));
    detail.append(component('productName',data), component('badge', data), component('meta', {...data,showCompare:false}));
    const side = node('div', 'product-side'); const buttons = node('div', 'product-buttons');
    buttons.append(component('compareIcon',data), component('favorite'), component('select'));
    side.append(component('price', data), buttons);
    card.append(picture, detail, side, dl, component('stock', data)); return card;
  }
  define('card','Карточка товара','',productCard);

  function bindQuickPickerToggle({root,trigger,isOpen,open,close,preservePointerState=false}) {
    const currentTrigger=()=>typeof trigger==='function'?trigger():trigger;
    let pressedOpen;
    const press=event=>{
      const button=currentTrigger();
      pressedOpen=button && !button.disabled && button.contains(event.target)?isOpen():undefined;
    };
    const release=event=>{
      if(event.type==='pointercancel' || !currentTrigger()?.contains(event.target))pressedOpen=undefined;
    };
    const toggle=event=>{
      const button=currentTrigger();
      if(button && !button.disabled && button.contains(event.target)){
        // Focus restoration may dismiss the rail between pointerdown and click.
        const wasOpen=event.detail>0 && pressedOpen!==undefined?pressedOpen:isOpen();
        pressedOpen=undefined;
        wasOpen?close():open();
      }
    };
    if(preservePointerState)root.addEventListener('pointerdown',press);
    root.addEventListener('click',toggle);
    if(preservePointerState){document.addEventListener('pointerup',release);document.addEventListener('pointercancel',release);}
    const dismiss=event=>{
      if(!isOpen())return;
      if(event.type==='keydown'){
        if(event.key==='Escape'&&root.contains(event.target)){event.preventDefault();close();currentTrigger()?.focus({preventScroll:true});}
      }else if(!root.contains(event.target))close();
    };
    for(const type of ['click','focusin','keydown'])document.addEventListener(type,dismiss);
    return ()=>{root.removeEventListener('pointerdown',press);root.removeEventListener('click',toggle);document.removeEventListener('pointerup',release);document.removeEventListener('pointercancel',release);for(const type of ['click','focusin','keydown'])document.removeEventListener(type,dismiss);};
  }

  function save(key, selection, session = false) {
    try { (session ? sessionStorage : localStorage).setItem(key, JSON.stringify(selection)); }
    catch (error) { /* Storage may be unavailable in a local browser. */ }
  }

  function read(key, session = false) {
    try { return JSON.parse((session ? sessionStorage : localStorage).getItem(key) || 'null'); }
    catch (error) { return null; }
  }

  function hasSaved(key) {
    try { return localStorage.getItem(key) !== null; }
    catch (error) { return false; }
  }

  // One visual source; category adapters keep their own keys and filtering rules.
  function quickTagButton({text, key, title = text, onClick}) {
    const button = document.createElement('button');
    button.type = 'button'; button.append(node('span','catalog-quick-label',text));
    button.dataset.quick = key;
    if (title != null) button.title = title;
    if (onClick) button.addEventListener('click', onClick);
    return button;
  }

  // Tags and sidebar controls share one filter state; values within a facet are ORed.
  function bindFacetTags(container, entries, panel, items, has, render) {
    const tags = [];
    for (const [title, facet, raw] of entries) {
      if (!facet) continue;
      const values = (Array.isArray(raw) ? raw : [raw]).map(String);
      const labels = [...panel.querySelectorAll(`[data-facet="${facet}"] label`)];
      const inputs = labels.filter((label) => values.includes(label.dataset.value)
        && items.some((item) => has(item, facet, label.dataset.value))).map((label) => label.querySelector('input'));
      if (!inputs.length) continue;
      const button = quickTagButton({text:title, key:`${facet}:${values.join('|')}`, onClick:() => {
        const selected = inputs.every((input) => input.checked);
        inputs.forEach((input) => { input.checked = !selected; });
        render();
      }});
      container.append(button);
      tags.push({button, inputs});
    }
    return () => {
      const active = [];
      tags.forEach(({button, inputs}) => {
        const selected = inputs.every((input) => input.checked);
        button.disabled = !selected && inputs.every((input) => input.disabled);
        if (selected) active.push(button.dataset.quick);
      });
      syncQuickTags(container, active);
    };
  }
  // Keep catalog data available for restoration/compatibility, but build cards only on demand.
  function deferredCards(items, createCard) {
    const cards = [], byId = new Map();
    let ready = false;
    return {cards, byId, ensure() {
      if (ready) return;
      for (const item of items) {
        const card = createCard(item);
        cards.push(card);
        byId.set(item.id, card);
      }
      ready = true;
    }};
  }
  return {snapshotComparison, restoreComparison, resetComparison, colorImage, quickTagButton, bindAllFilters, bindFilterSearch, setSectionExpanded, bindFacetDisclosure, createComparisonContext, bindQuickPickerToggle, bindSocketList, setFilterLabel, bindPriceRange, controlElement, filterOption, bindSort, controlDefinitions, controlMarkup, mountModal, updateFitStatus, updateStatus, categoryCardData, comparePrice, deferredCards, createFilterReader, components, component, openModal, closeModal, renderSelectedRow, clearSelectedRow, refresh, syncCards, resolveSavedProduct, bindActions, chip, bindFacetTags, syncQuickTags, bindQuickMore, combineFit, cpuBoardFit, caseBoardFit, casePowerFit, gpuCaseFit, gpuPowerFit, cpuFitsBoard, caseFitsBoard, caseFitsPower, gpuFitsCase, gpuFitsPower, facetSection, productMeta, normalizeProductStock, motherboardCardData, productCard, save, read, hasSaved};
})();
