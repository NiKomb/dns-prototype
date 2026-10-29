// Critical interaction layer: no catalog data, filters or article registry at startup.
const catalogLoader = (() => {
  const categories = {
    processor:{key:'processor',title:'Процессоры',kind:'processor',file:'modal',data:'processor',items:()=>processorCatalog},
    motherboard:{key:'motherboard',title:'Материнские платы',kind:'board',file:'motherboard',data:'motherboard',items:()=>boards},
    'power-supply':{key:'powerSupply',title:'Блоки питания',kind:'power',file:'power-supply',data:'power-supply',items:()=>powerSupplies},
    case:{key:'computerCase',title:'Корпуса',kind:'case',file:'case',data:'case',items:()=>cases},
    gpu:{key:'gpu',title:'Видеокарты',kind:'gpu',file:'gpu',data:'gpu',items:()=>gpuCatalog}
  };
  const scripts = new Map(), catalogs = new Map(), openers = new Map();
  let connect, active = null, request = 0;
  const core = new Promise(resolve => {connect = resolve;});
  function script(path) {
    const url = new URL(path,document.baseURI).href;
    if (scripts.has(url)) return scripts.get(url);
    const promise = new Promise((resolve,reject) => {
      const element = document.createElement('script');
      element.src = url;
      element.onload = resolve;
      element.onerror = () => {scripts.delete(url);element.remove();reject(new Error(`Unable to load ${path}`));};
      document.head.append(element);
    });
    scripts.set(url,promise);
    return promise;
  }
  async function data(id) {
    const config = categories[id];
    await script(`pages/configurator/data/${config.data}-data.js`);
    return config.items();
  }
  function shell(id) {
    let modal = document.getElementById(`${id}-modal`);
    if (!modal) {
      modal = catalogUI.component('modalShell',{id,title:categories[id].title});
      document.body.append(modal);
    }
    return modal;
  }
  function load(id) {
    if (catalogs.has(id)) return catalogs.get(id);
    shell(id);
    const pending = (async () => {
      const view = await core;
      await Promise.all([view.restore(),data(id),script('shared/catalog/catalog-tags.js'),script('shared/catalog/article-selection.js'),
        ...(id==='processor' ? [script('pages/configurator/processor-filters.js')] : [])]);
      await script(`pages/configurator/${categories[id].file}.js?v=20260930-product-badges`);
      if (!openers.has(id)) throw new Error(`Catalog did not initialize: ${id}`);
      shell(id).dataset.catalogReady = 'true';
      return openers.get(id);
    })().catch(error=>{catalogs.delete(id);throw error;});
    catalogs.set(id,pending);
    return pending;
  }
  function returnButton(id) {
    return document.querySelector(`#${id}-row #add-${id}, #${id}-row .${categories[id].kind}-replace`);
  }
  async function open(id, {initialFocus = 'close'} = {}) {
    const ticket = ++request;
    if (active && active!==id) catalogUI.closeModal(shell(active));
    active = id;
    const modal = shell(id);
    // Keep the entry focus target through both the loading shell and ready catalog.
    // Every new opening resets it, including a retry from the configurator row.
    modal.dataset.initialFocus = initialFocus;
    if (modal.dataset.catalogReady==='true') {openers.get(id)();return;}
    modal.dataset.catalogLoading = 'true';
    catalogUI.openModal(modal);
    try {
      const activate = await load(id);
      delete modal.dataset.catalogLoading;
      modal.dataset.catalogReady = 'true';
      if (ticket===request && active===id && !modal.hidden) activate();
    } catch(error) {
      delete modal.dataset.catalogLoading;
      if (ticket===request && !modal.hidden) catalogUI.closeModal(modal,returnButton(id));
      console.warn('Catalog can be retried by opening it again',error);
    }
  }
  // Delegation is registered in the head, before the first visible Add button.
  document.addEventListener('click',event => {
    const button = event.target.closest('button');
    if (!button) return;
    for (const [id,config] of Object.entries(categories)) {
      if (button.id===`add-${id}` || (button.closest(`#${id}-row`) && button.classList.contains(`${config.kind}-replace`))) {
        event.preventDefault();event.stopImmediatePropagation();void open(id);return;
      }
    }
    const modal = button.closest('.processor-modal');
    if (button.matches('.processor-modal-close') && modal?.dataset.catalogLoading==='true') {
      event.stopImmediatePropagation();request++;
      catalogUI.closeModal(modal,returnButton(active));active=null;
    }
  },true);
  document.addEventListener('keydown',event => {
    if (event.key!=='Escape' || !active) return;
    const modal = shell(active);
    if (!modal.hidden && modal.dataset.catalogLoading==='true') {
      event.stopImmediatePropagation();request++;
      catalogUI.closeModal(modal,returnButton(active));active=null;
    }
  },true);
  return {categories,script,data,load,open,connect,register:(id,opener)=>openers.set(id,opener)};
})();
