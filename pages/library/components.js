/* Documentation specimens share production components; no build state is saved. */
(() => {
  let pickerSequence=0;
  let openInitialPicker;
  const pickerSamples=[];
  const pickerCatalogs={processor:processorCatalog,motherboard:boards,'power-supply':powerSupplies,case:cases,gpu:gpuCatalog};
  function pickerExample(category,title,products=pickerCatalogs[category],expanded=false){
    const anchor=document.createElement('div');anchor.className='ds-picker-anchor build-board-anchor';
    const row=libraryUI.namespace(catalogUI.component('emptyCategory',catalogUI.configuratorCategories[`${category}-row`]));
    const selection=document.createElement('div');selection.hidden=true;
    const host=document.createElement('div');host.id=`ds-picker-${category}-${++pickerSequence}`;host.hidden=true;
    const toggle=row.querySelector('.build-board-toggle');toggle.setAttribute('aria-controls',host.id);toggle.setAttribute('aria-expanded','false');
    const add=row.querySelector('button:not(.build-board-toggle)');
    add.setAttribute('aria-controls','ds-catalog-modal');add.addEventListener('click',event=>openDemoCatalog(category,event.currentTarget));
    const close=()=>{host.hidden=true;toggle.setAttribute('aria-expanded','false');};
    const open=()=>{
      for(const entry of pickerSamples)entry.close();
      if(!host.firstElementChild){
        const rail=catalogUI.component('boardSuggestions',{category,products,onSelect(item){
          const kind={processor:'processor',motherboard:'board','power-supply':'power',case:'case',gpu:'gpu'}[category];
          catalogUI.renderSelectedRow(selection,{kind,name:item.name,image:item.image,specs:item.summary??catalogUI.categoryCardData(item).specs.map(([label,value])=>`${label}: ${value}`).join(', '),price:item.price==null?'—':`${item.price.toLocaleString('ru-RU')} ₽`,stores:item.stores,modalId:'ds-catalog-modal',onRemove(){catalogUI.clearSelectedRow(selection,'');selection.hidden=true;row.hidden=false;},onReplace:event=>openDemoCatalog(category,event.currentTarget)});
          libraryUI.namespace(selection);selection.hidden=false;row.hidden=true;close();
        }});
        host.append(rail);
      }
      host.hidden=false;toggle.setAttribute('aria-expanded','true');
    };
    pickerSamples.push({close});
    catalogUI.bindQuickPickerToggle({root:anchor,trigger:toggle,isOpen:()=>!host.hidden,open,close,preservePointerState:true});
    anchor.append(row,host,selection);
    if(expanded)openInitialPicker=open;
    return anchor;
  }
  for(const [category,products] of Object.entries(pickerCatalogs)){
    document.querySelector('#ds-board-suggestions').append(pickerExample(category,'',products,category==='processor'));
  }
  for(const [id,data]of Object.entries(catalogUI.configuratorCategories))if(id.startsWith('empty-')){
    document.querySelector('#ds-board-suggestions').append(libraryUI.namespace(catalogUI.component('emptyCategory',data)));
  }
  for(const [state,articles]of [['Рекомендации',articleSelection.forBuild(catalogArticles,{},()=>false)],['Нет рекомендаций',[]]])
    libraryUI.sample('#ds-build-articles','buildArticles','Статьи по сборке',catalogUI.component('buildArticles',{articles}),{state});
  const loadingCatalog = catalogUI.component('modalShell',{id:'ds-loading-catalog',title:'Процессоры'});
  loadingCatalog.hidden=false;
  loadingCatalog.classList.add('catalog-loading-preview');
  loadingCatalog.setAttribute('role','group');
  loadingCatalog.removeAttribute('aria-modal');
  loadingCatalog.querySelector('.processor-modal-close').disabled=true;
  const loadingFilters=loadingCatalog.querySelector('.processor-filters');
  loadingFilters.id='ds-filter-skeleton';
  loadingFilters.classList.add('is-filter-loading');
  loadingFilters.setAttribute('aria-busy','true');
  loadingFilters.replaceChildren(catalogUI.component('filterSkeleton'));
  const loadingArticles=document.createElement('section');
  loadingArticles.id='ds-article-skeleton';
  loadingArticles.className='catalog-articles is-article-loading';
  loadingArticles.setAttribute('aria-busy','true');
  loadingArticles.append(catalogUI.component('articleSkeleton'));
  const loadingProducts=document.createElement('div');
  loadingProducts.id='ds-product-skeleton';
  loadingProducts.className='processor-products is-product-loading';
  loadingProducts.setAttribute('aria-busy','true');
  loadingProducts.append(catalogUI.component('productSkeleton'));
  loadingCatalog.querySelector('.processor-results').append(loadingArticles,loadingProducts);
  document.querySelector('#ds-catalog-loading').append(loadingCatalog);
  document.querySelector('#ds-catalog-articles').append(catalogUI.component('articleStrip',{configuratorCategory:'processor',articles:articleSelection.cards(catalogArticles,'cpu',processorCatalog.filter(item=>item.socket==='AM4'),processorFilters.has,9,{compatible:false,facets:new Map([['socket',['AM4']]])})}));
  document.querySelector('#ds-general-guides').append(catalogUI.component('articleStrip',{configuratorCategory:'processor',articles:articleSelection.cards(catalogArticles,'cpu',[],()=>false,0,{compatible:false,facets:new Map()})}));
  const rootStyle = getComputedStyle(document.documentElement);
  const textTokens = [
    ['--text-primary', 'Основной текст'],
    ['--text-secondary', 'Вторичный текст'],
    ['--text-tertiary', 'Пояснения'],
    ['--text-primary-inverse', 'На тёмном фоне'],
    ['--text-disabled', 'Недоступный текст'],
    ['--text-brand', 'Брендовый текст'],
    ['--text-brand-hover', 'Брендовый текст · наведение'],
    ['--text-link', 'Ссылка'],
    ['--text-error', 'Ошибка'],
    ['--text-input-default', 'Поле ввода'],
    ['--text-input-disabled', 'Недоступное поле'],
    ['--text-wobbler-green', 'Бейдж «Хит» · текст']
  ];
  const iconTokens = [
    ['--icon-primary', 'Основные'],
    ['--icon-secondary', 'Вторичные'],
    ['--icon-primary-inverse', 'На тёмном фоне'],
    ['--icon-selected', 'Выбранные'],
    ['--icon-hover', 'Наведение'],
    ['--icon-brand', 'Брендовые'],
    ['--icon-brand-main', 'Брендовый акцент'],
    ['--icon-error', 'Ошибка'],
    ['--icon-success-main', 'Успех'],
    ['--icon-success-dark', 'Успех · тёмный']
  ];
  const backgroundTokens = [
    ['--background-primary', 'Страница'],
    ['--background-primary-surface', 'Основная поверхность'],
    ['--background-secondary', 'Карточки и панели'],
    ['--background-primary-inverse', 'Тёмная поверхность'],
    ['--background-neutral-light', 'Нейтральный'],
    ['--background-brand-dark', 'Брендовый'],
    ['--background-brand-light', 'Светлый брендовый'],
    ['--background-brand-transparent', 'Прозрачный брендовый'],
    ['--background-info-light', 'Информационный'],
    ['--background-success-main', 'Прогресс сборки'],
    ['--background-warning-light', 'Предупреждение · наведение фильтров'],
    ['--background-warning-transparent', 'Прозрачное предупреждение'],
    ['--background-wobbler-green', 'Бейдж «Хит»'],
    ['--background-wobbler-red', 'Красный бейдж'],
    ['--background-switch-bg', 'Переключатель'],
    ['--background-footer-social-bg', 'Соцсети подвала'],
    ['--background-skeleton', 'Скелетон'],
    ['--background-white-transparency', 'Белая остановка мерцания'],
    ['--background-input-white-default', 'Поле ввода · белый'],
    ['--background-input-gray-default', 'Поле ввода · серый'],
    ['--background-input-gray-hover', 'Поле ввода · наведение'],
    ['--background-input-gray-disabled', 'Поле ввода · недоступное']
  ];
  function colorSample(token, label, isBranch) {
    const value = rootStyle.getPropertyValue(token).trim();
    const item = document.createElement(isBranch ? 'li' : 'div'); item.className = isBranch ? 'ds-swatch ds-tree-color-swatch' : 'ds-swatch';
    const color = document.createElement('div'); color.className = 'ds-color'; color.style.background = value;
    const info = document.createElement('div'); info.className = 'ds-swatch-label';
    const name = document.createElement('strong'); name.textContent = label;
    const detail = document.createElement('code'); detail.textContent = isBranch ? `${token} ${value}` : `${value} · ${token}`;
    info.append(name, detail); item.append(color, info); return item;
  }
  const colorTree = document.createElement('details'); colorTree.className = 'ds-color-tree';
  const colorHeading = document.createElement('summary'); colorHeading.textContent = 'Цвета конфигуратора';
  const branches = document.createElement('div'); branches.className = 'ds-color-tree-branches';
  for (const [title, className, entries] of [
    ['Текст', 'ds-text-colors', textTokens],
    ['Иконки', 'ds-icon-colors', iconTokens],
    ['Фоны', 'ds-background-colors', backgroundTokens]
  ]) {
    const branch = document.createElement('details'); branch.className = `ds-color-branch ${className}`;
    const heading = document.createElement('summary'); heading.textContent = title;
    const list = document.createElement('ul'); list.className = 'ds-color-branch-list';
    for (const [token, label] of entries) list.append(colorSample(token, label, true));
    branch.append(heading, list); branches.append(branch);
  }
  colorTree.append(colorHeading, branches);
  const tokens = [
    ['--button-start', 'Основное действие · начало градиента'],
    ['--button-end', 'Основное действие · конец градиента'],
    ['--controls-hover-orange', 'Плюс подбора сборки · наведение'],
    ['--controls-hover-gray', 'Плюс сравнения · наведение'],
    ['--stroke-border', 'Границы контролов'],
    ['--stroke-divider-light', 'Разделители'],
    ['--stroke-border-brand', 'Клавиатурный фокус'],
    ...[0,5,10,25,50,100,200,300,400,500,600,700,800,900,1000].map(step => [`--space-gray-${step}`, `Шкала серого · ${step}`]),
    ['--transparency-dark-dark-2', 'Серые действия итогового блока · наведение 2%']
  ];
  const scales=document.createElement('div');scales.className='ds-color-scales';
  for(const [title,prefix] of [['Действия',/^--(?:button|controls)-/],['Границы',/^--stroke-/],['Шкала серого',/^--space-gray-/],['Прозрачность',/^--transparency-/]]){
    const column=document.createElement('details');column.className='ds-color-scale ds-color-branch';
    const heading=document.createElement('summary');heading.textContent=title;
    const list=document.createElement('ul');list.className='ds-color-branch-list';
    for(const [token,label] of tokens.filter(([token])=>prefix.test(token)))list.append(colorSample(token,label,true));
    column.append(heading,list);scales.append(column);
  }
  document.querySelector('#ds-colors').append(scales,colorTree);
  for (const name of ['card', 'control']) document.querySelector(`#ds-${name}-radius`).textContent = rootStyle.getPropertyValue(`--${name}-radius`).trim();

  // Read the actual shared typography recipes; do not maintain a second size table.
  for (const row of document.querySelectorAll('#typography .ds-type-row')) {
    const style = getComputedStyle(row.querySelector('p'));
    row.querySelector('.ds-type-metrics').textContent = `${parseFloat(style.fontSize)}/${parseFloat(style.lineHeight)}`;
  }

  const searchHost = document.querySelector('#ds-search').parentElement;
  searchHost.replaceWith(catalogUI.component('filterSearchToolbar',{
    search:catalogUI.controlElement('filter-search',{},{input:{id:'ds-search',type:'search',placeholder:'Поиск по фильтрам','aria-label':'Поиск по фильтрам'}}),count:2,
    onCompare(){const table=document.querySelector('#ds-comparison-tables .catalog-comparison');table?.scrollIntoView({block:'center'});table?.querySelector('.comparison-only-differences').focus({preventScroll:true});}
  }));
  document.querySelector('#ds-reset').replaceWith(catalogUI.controlElement('reset-chip',{id:'ds-reset',type:'button'},'Сбросить фильтры'));
  const sockets = [...new Set(processorCatalog.map(product => product.socket))];
  const facet = catalogUI.facetSection('Сокет', 'socket', sockets);
  facet.classList.remove('is-collapsed');
  facet.querySelector('.catalog-options').classList.add('power-options');
  const heading = facet.querySelector('.filter-heading'); heading.setAttribute('aria-expanded', 'true');
  catalogUI.bindFacetDisclosure(facet);
  document.querySelector('#ds-facets').append(facet);
  const chips = catalogUI.controlElement('processor-toolbar',{id:'ds-chips'});
  document.querySelector('#ds-chips').replaceWith(chips);
  const tags = catalogUI.controlElement('catalog-quick',{id:'ds-tags'});
  const quickWrap=document.createElement('div');quickWrap.className='catalog-quick-wrap';
  const quickMore=catalogUI.controlElement('power-quick-more',{type:'button','aria-expanded':'false'},'Показать ещё');
  document.querySelector('#ds-tags').replaceWith(quickWrap);quickWrap.append(tags,quickMore);
  catalogUI.bindQuickMore(quickMore,tags);
  const inputs = [...facet.querySelectorAll('input')];
  let syncTags;
  function renderFilters() {
    chips.replaceChildren();
    inputs.forEach(input => { if (input.checked) chips.append(catalogUI.chip(input.parentElement.dataset.value, () => {input.checked = false; renderFilters();})); });
    document.querySelector('#ds-filter-empty').hidden = inputs.some(input => input.checked);
    syncTags?.();
  }
  syncTags = catalogUI.bindFacetTags(tags, sockets.map(socket => [socket, 'socket', socket]), facet.parentElement, processorCatalog, (item, key, value) => item[key] === value, renderFilters);
  facet.addEventListener('change', renderFilters);
  document.querySelector('#ds-reset').addEventListener('click', () => {inputs.forEach(input => {input.checked = false;}); renderFilters();});
  catalogUI.bindFilterSearch(document.querySelector('#ds-search'),facet.parentElement,{empty:true});
  const allFilters=catalogUI.controlElement('all-filters',{type:'button'},'Все фильтры');
  facet.parentElement.append(allFilters);
  catalogUI.bindAllFilters(allFilters,{search:document.querySelector('#ds-search'),panel:facet.parentElement,sidebar:facet.parentElement});
  renderFilters();

  function specimen(parent,title,component){
    if(parent==='#ds-cards'){
      const wrapper=document.createElement('div');wrapper.className='ds-specimen';
      const caption=document.createElement('p');caption.className='ds-caption';caption.textContent=title;
      wrapper.append(caption,component);document.querySelector(parent).append(wrapper);return component;
    }
    const key=component.dataset.dsComponent||component.querySelector('[data-ds-component]')?.dataset.dsComponent||title;
    libraryUI.sample(parent,key,catalogUI.components[key.replace('catalog.','')]?.title||title,component,{state:title,wide:parent==='#ds-comparison-tables'||parent==='#ds-rows'});
    return component;
  }
  specimen('#ds-comparison-elements','Цена в сравнении',catalogUI.component('comparisonPrice',processorCatalog[0]));
  for(const selected of [false,true]) {
    const controls=document.createElement('div');controls.className='selected-controls comparison-actions';
    controls.append(catalogUI.component('comparisonAdd',{product:processorCatalog[0],selected}));
    specimen('#ds-comparison-elements',`Добавить в сборку · ${selected ? 'добавлен' : 'не добавлен'}`,controls);
  }
  for(const compact of [false,true]) {
    const browseTile=document.createElement('div');
    const button=catalogUI.component('comparisonBrowse',{compact,onBrowse(){button.setAttribute('aria-expanded',String(button.getAttribute('aria-expanded')!=='true'));}});browseTile.append(button);
    specimen('#ds-comparison-elements',`Добавить · ${compact ? 'узкая кнопка' : 'кнопка с подписью'}`,browseTile);
  }
  specimen('#ds-comparison-elements','Закрыть сравнение',catalogUI.component('comparisonClose'));
  const comparisonHeader=catalogUI.component('modalShell',{id:'ds-comparison-header',title:'Процессоры'}).querySelector('.processor-modal-header');
  specimen('#ds-comparison-elements','Шапка каталога',comparisonHeader);
  for(const checked of [false,true]) specimen('#ds-comparison-elements',`Только различия · ${checked ? 'включено' : 'выключено'}`,catalogUI.component('comparisonDifferences',{checked}));
  for(const expanded of [true,false]) specimen('#ds-comparison-elements',`Секция · ${expanded ? 'раскрыта' : 'свёрнута'}`,catalogUI.component('comparisonGroup',{title:'Общие параметры',expanded}));
  {
    const catalogs={processor:processorCatalog,motherboard:boards,'power-supply':powerSupplies,case:cases,gpu:gpuCatalog};
    const comparedByCategory=new Map(Object.entries(catalogs).map(([id,items])=>[id,new Map(items.slice(0,id==='processor' ? 6 : 2).map(product=>[product.id,product]))]));
    const selectedByCategory=new Map();
    const sample=catalogUI.component('comparisonWorkspace',{sets:comparedByCategory,tabs:new Set(Object.keys(catalogs)),
      getProducts:id=>catalogs[id],getSelected:id=>selectedByCategory.get(id),
      getBuildState:()=>({processor:selectedByCategory.get('processor'),motherboard:selectedByCategory.get('motherboard'),powerSupply:selectedByCategory.get('power-supply'),computerCase:selectedByCategory.get('case'),gpu:selectedByCategory.get('gpu')}),onSelect:(product,id)=>selectedByCategory.set(id,product)});
    specimen('#ds-comparison-tables','Сравнение · интерактивная таблица',sample);sample.open('processor');
  }
  const product = processorCatalog[0];
  const trialBaseline = processorCatalog.find(item => item.id === 'cpu-003');
  const trialCard = catalogUI.component('processorComparisonCard', {product,selected:trialBaseline,mode:'differences'});
  specimen('#ds-cards','Различия с процессором в сборке · наведение и фокус',trialCard);
  trialCard.updateTrial({selected:trialBaseline,mode:'differences'});
  // The same factories assemble production cards and render isolated DS examples.
  function isolatedCard(data){
    const context=catalogUI.createComparisonContext({root:document.createElement('div')});
    const card=catalogUI.component('card',{...data,comparisonContext:context});context.root=card;
    catalogUI.bindActions(card,()=>catalogUI.syncCards([card],{selected:data,socket:()=>data.socket}));
    return card;
  }
  function elementSample(parent,id,data,title){
    const definition=catalogUI.components[id],context=document.createElement('div');
    context.className=`${definition.context} catalog-component-preview`;
    if(['compare','compareIcon','meta'].includes(id)){
      const item=data.product||data,selected=title?.toLowerCase().includes('выбран');
      const sets=new Map([[item.category,new Map(selected?[[item.id,item]]:[])]]);
      data={...data,comparisonContext:catalogUI.createComparisonContext({root:context,sets})};
    }
    if(['compare','compareIcon'].includes(id)){title=data.comparisonContext.sets.get((data.product||data).category)?.size?'Выбрано':'Не выбрано';data.comparisonContext.onChange=()=>{const caption=context.closest('.ds-element')?.querySelector('.ds-caption');if(caption)caption.textContent=data.comparisonContext.sets.get((data.product||data).category)?.size?'Выбрано':'Не выбрано';};}
    const component=catalogUI.component(id,data);context.append(component);
    libraryUI.sample(parent,`catalog.${id}`,definition.title,context,{state:title||'',component:`catalog.${id}`});
    return component;
  }
  for (const id of ['compare','rating','questions','reliability','badge','spec','meta','photo','imageBadge','pagination','price','favorite','select','stock','delivery']) {
    elementSample('#ds-card-elements', id, product, id === 'select' ? 'Кнопка «Добавить»' : id === 'badge' ? 'Хит продаж' : undefined);
    if (id === 'compare') elementSample('#ds-card-elements','compare',processorCatalog[1],'Выбрано');
  }
  elementSample('#ds-card-elements','compareIcon',product);
  elementSample('#ds-card-elements','compareIcon',processorCatalog[1],'Кнопка сравнения · выбрано');
  for (const count of [0,1,2]) elementSample('#ds-card-elements','comparisonOpen',{count},`Открыть сравнение · ${count} товаров`);
  for(const [badgeKind,state]of [['exclusive','Эксклюзивно в DNS'],['dns','Создано DNS']])elementSample('#ds-card-elements','badge',{badgeKind},state);
  elementSample('#ds-card-elements','select',{selection:'replace'},'Кнопка «Заменить»');
  elementSample('#ds-card-elements','select',{selection:'added'},'Кнопка «Добавлен»');
  specimen('#ds-cards','Расширенные характеристики',isolatedCard({...product,specs:productContract.schemas.processor.slice(0,16).map(field=>[field.title,productContract.text(product,field.key)])}));
  const longestNameProduct = processorCatalog.reduce((longest, item) => item.name.length > longest.name.length ? item : longest);
  elementSample('#ds-card-elements','productName',longestNameProduct,'Длинное название');
  const selectedData = {kind:'processor', name:product.name, specs:product.summary, stores:product.stores,modalId:'ds-catalog-modal',onReplace:event=>openDemoCatalog('processor',event.currentTarget)};
  for (const id of ['selectedName','selectedSpecs','selectedStock','selectedPickup','quantity','status','remove','replace','controls']) {
    elementSample('#ds-selection-elements', id, id === 'selectedName' ? {...selectedData, name:longestNameProduct.name} : selectedData, id === 'selectedName' ? 'Название · перенос в границах блока' : id === 'status' ? 'Совместимость · совместимо' : undefined);
  }
  elementSample('#ds-selection-elements','quantity',{value:2,min:1,max:4},'Изменяемое количество');
  elementSample('#ds-selection-elements','status',{incompatible:true},'Совместимость · несовместимо');
  elementSample('#ds-selection-elements','status',{unknown:true},'Совместимость · недостаточно данных');
  for (const [title, selected, otherSocket] of [
    ['Обычная · «Добавить»', null, null],
  ]) {
    const card=isolatedCard(product);
    catalogUI.syncCards([card], {selected, otherSocket, socket: () => product.socket});
    specimen('#ds-cards', title, card);
  }
  for (const incompatible of [false, true]) {
    const row = document.createElement('div');
    catalogUI.renderSelectedRow(row, {kind:'processor', name:product.name, image:product.image, specs:product.summary, price:`${product.price.toLocaleString('ru-RU')} ₽`, stores:product.stores, incompatible,onRemove(){row.replaceWith(pickerExample('processor','Незаполненная категория'));},onReplace:event=>openDemoCatalog('processor',event.currentTarget)});
    specimen('#ds-rows', incompatible ? 'Несовместимая деталь' : 'Совместимая деталь', row);
  }

  // Live catalog shell: the same geometry, backdrop and components as all five catalogs.
  const modalButton = document.querySelector('#ds-open-modal');

  const modal = catalogUI.component('modalShell',{id:'ds-catalog',title:'Процессоры'});
  const demoProducts = document.createElement('div'); demoProducts.className = 'processor-products';
  modal.querySelector('.processor-results').append(demoProducts);
  modal.querySelector('.processor-results').prepend(catalogUI.controlElement('processor-toolbar'));
  catalogUI.component('catalogFilters',{modal});
  const closeButton = modal.querySelector('.processor-modal-header .processor-modal-close');
  document.body.append(modal);
  document.querySelectorAll('.processor-replace').forEach(button=>button.setAttribute('aria-controls',modal.id));
  let modalReturnFocus = modalButton;
  function openDemoCatalog(category,trigger,initialFocus='close'){
    const catalogs={processor:processorCatalog,motherboard:boards,'power-supply':powerSupplies,case:cases,gpu:gpuCatalog};
    const titles={processor:'Процессоры',motherboard:'Материнские платы','power-supply':'Блоки питания',case:'Корпуса',gpu:'Видеокарты'};
    const item=catalogs[category][0],field=productContract.schemas[category].find(field=>item[field.key]!=null);
    prototypeImages.release(demoProducts);demoProducts.replaceChildren(isolatedCard(catalogUI.categoryCardData(item)));
    const panel=modal.querySelector('.filter-panel');panel.replaceChildren();
    if(field){const section=catalogUI.facetSection(field.title,field.key,[productContract.text(item,field.key)]);catalogUI.setSectionExpanded(section,true);section.querySelectorAll('input').forEach(input=>input.disabled=true);catalogUI.bindFacetDisclosure(section);panel.append(section);}
    modal.querySelector('.processor-modal-heading strong').textContent=titles[category];
    modal.dataset.libraryCategory=category;modalReturnFocus=trigger;modal.dataset.initialFocus=initialFocus;catalogUI.openModal(modal);
  }
  modalButton.addEventListener('click',event=>openDemoCatalog('processor',event.currentTarget));
  document.querySelector('#ds-open-modal-from-article').addEventListener('click',event=>openDemoCatalog('processor',event.currentTarget,'dialog'));
  const closeDemo = () => catalogUI.closeModal(modal, modalReturnFocus);
  closeButton.addEventListener('click', closeDemo);
  document.addEventListener('keydown', event => {if (!modal.hidden && event.key === 'Escape') closeDemo();});
  openInitialPicker?.();
})();
