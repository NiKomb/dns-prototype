/* Library composition only. Rendering and interaction belong to shared components. */
window.libraryUI = (() => {
  const groups = new Map(); let serial = 0;
  function namespace(root, prefix = `ds-instance-${++serial}`) {
    const nodes = [root, ...root.querySelectorAll('[id]')], ids = new Map();
    for (const node of nodes) if (node.id) {ids.set(node.id, `${prefix}-${node.id}`);node.id = ids.get(node.id);}
    for (const node of [root, ...root.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]')]) {
      for (const attr of ['aria-controls','aria-labelledby','aria-describedby']) if (node.hasAttribute(attr)) {
        const values = node.getAttribute(attr).split(/\s+/).map(id => ids.get(id) || (document.getElementById(id) ? id : '')).filter(Boolean);
        if (values.length) node.setAttribute(attr, values.join(' ')); else node.removeAttribute(attr);
      }
    }
    for (const label of root.querySelectorAll('label[for]')) if(ids.has(label.htmlFor))label.htmlFor=ids.get(label.htmlFor);
    for (const node of root.querySelectorAll('a[href^="#"]')) {const id=node.getAttribute('href').slice(1);if(ids.has(id))node.href=`#${ids.get(id)}`;}
    return root;
  }
  function group(target, key, title, wide = false) {
    const host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!groups.has(host)) groups.set(host, new Map());
    const entries = groups.get(host);
    if (!entries.has(key)) {
      const root=document.createElement('article');root.className=`ds-component-group${wide?' ds-group-wide':''}`;root.dataset.componentGroup=key;
      const heading=document.createElement('h3');heading.textContent=title;
      const row=document.createElement('div');row.className='ds-state-row';root.append(heading,row);host.append(root);entries.set(key,{root,row});
    }
    return entries.get(key);
  }
  function sample(target, key, title, node, {state='',context='',wide=false,component} = {}) {
    const entry=group(target,key,title,wide),wrapper=document.createElement('div');wrapper.className='ds-element';
    if(component)wrapper.dataset.component=component;
    if(state){const caption=document.createElement('p');caption.className='ds-caption';caption.textContent=state;wrapper.append(caption);}
    const stage=document.createElement('div');stage.className=`ds-element-stage ${context}`;
    stage.append(namespace(node));wrapper.append(stage);entry.row.append(wrapper);return node;
  }
  return {namespace,group,sample};
})();
