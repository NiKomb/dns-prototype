/* Compact specimens made by production factories, never copied page markup. */
(() => {
  const control = catalogUI.controlElement;
  function sample(target, title, children, context = '') {
    const nodes=Array.isArray(children)?children:[children];
    for(const node of nodes){const key=(node.dataset.dsComponent==='catalog.filter-panel'?node.querySelector('[data-ds-component]')?.dataset.dsComponent:node.dataset.dsComponent)||node.dataset.dsControl||title;
      libraryUI.sample(target,key,title.split(' · ')[0],node,{state:title.includes(' · ')?title.split(' · ').slice(1).join(' · '):'',context});}
    return nodes[0];
  }

  const option = (text, {checked=false, disabled=false} = {}) => {
    const node = catalogUI.filterOption(); node.querySelector('span').textContent = text;
    Object.assign(node.querySelector('input'),{checked,disabled});
    if(disabled) node.classList.add('is-unavailable'); return node;
  };
  const availability= catalogUI.component('availabilityGroup');
  catalogUI.bindFacetDisclosure(availability);
  const availabilityPanel=control('filter-panel');availabilityPanel.append(availability);
  sample('#ds-control-elements','Наличие в магазинах · группа фильтра',availabilityPanel,'ds-control-context');
  const reviewFacet = catalogUI.component('socketGroup');
  catalogUI.bindFacetDisclosure(reviewFacet);
  catalogUI.bindSocketList(reviewFacet);
  const reviewPanel=control('filter-panel'); reviewPanel.append(reviewFacet);
  sample('#ds-control-elements','Сокет · группа фильтра процессоров',reviewPanel,'ds-control-context');
  const reliable=control('filter-panel'); reliable.append(control('filter-option',{class:'filter-line'},{input:{type:'checkbox'},text:'Надёжные модели (28)',wrapped:true,hint:'минимум обращений в сервис',shield:true}));
  sample('#ds-control-elements','Надёжные модели · строка с пояснением',reliable,'ds-control-context');
  const states = control('filter-panel');const group=control('filter-section',{class:'catalog-facet'});const options=control('catalog-options');
  options.append(option('Обычный'),option('Выбранный',{checked:true}),option('Недоступный',{disabled:true})); group.append(options); states.append(group);
  sample('#ds-control-elements','Строка фильтра · состояния',states,'ds-control-context');
  for (const [kind,title,attrs,content] of [
    ['store-select','Выбор магазина · статичный',{},{text:'В любом из 12 магазинов'}],
    ['compatible-chip','Совместимые товары',{type:'button'},{text:'Совместимые товары '}],
    ['products-empty','Пустая выдача',{},'В прототипе нет товаров с такими параметрами']
  ]) sample('#ds-control-elements',title,control(kind,attrs,content),'ds-control-context');
  const price = control('filter-section',{class:'price-filter'});
  price.append(control('price-inputs',{}, {inputs:[{type:'text',inputmode:'numeric',placeholder:'от 0','aria-label':'Цена от'},{type:'text',inputmode:'numeric',placeholder:'до 50 000','aria-label':'Цена до'}]}),control('price-track'),control('price-reset',{type:'button'},'Сбросить'));
  const syncPrice = catalogUI.bindPriceRange(price,0,50000);
  price.querySelector('.price-reset').addEventListener('click',()=>{price.querySelectorAll('.price-inputs input').forEach(input=>input.value='');syncPrice();});
  sample('#ds-control-elements','Цена · границы и шкала',price,'ds-control-context ds-price-stage');
  const facet=catalogUI.facetSection('Характеристика','example',['Значение']);
  catalogUI.bindFacetDisclosure(facet);
  const panel=control('filter-panel');panel.append(facet);sample('#ds-control-elements','Группа фильтра · раскрыть / свернуть',panel,'ds-control-context power-modal');
  const sort=control('toolbar-select',{class:'sort-control'});
  const trigger=control('sort-trigger',{type:'button','aria-expanded':'true'},{text:'Сначала популярные'});
  const menu=control('sort-menu');
  for (const [value,text] of [['popular','Сначала популярные'],['price-asc','Сначала недорогие'],['price-desc','Сначала дорогие']]) menu.append(control('sort-option',{'type':'button','data-sort':value},text));
  sort.append(trigger,menu);catalogUI.bindSort(trigger,menu,()=>{});
  sample('#ds-control-elements','Сортировка · раскрытое меню',sort,'ds-control-context ds-sort-stage');
  sample('#ds-card-elements','Цена · неизвестна',catalogUI.component('price',{price:null}));
  sample('#ds-card-elements','Наличие · неизвестно (строки скрыты)',catalogUI.component('stock',{stores:null}));
  for (const [id,title] of [['buildProgress','Заполнение сборки'],['buildTips','Подсказки'],['buildSummary','Итог сборки'],['buildWarning','Предупреждение'],['appBanner','Баннер приложения']]) {
    const node=catalogUI.component(id);node.hidden=false;
    sample('#ds-build-elements',title,node,'ds-main-sample');
  }
  for(const [id,title]of [['siteHeader','Шапка сайта'],['siteFooter','Подвал сайта'],['homeArticles','Материалы главной'],['communityBuilds','Пользовательские сборки'],['homeGuides','Полезные материалы']]) {
    const node=catalogUI.component(id);
    libraryUI.sample('#ds-build-elements',`catalog.${id}`,title,node,{wide:true,context:'ds-page-fragment',component:`catalog.${id}`});
  }
})();
