// Shared early route handling. Merely viewing the prototype never resumes a study.
(() => {
  const base = new URL('../',document.currentScript.src);
  window.__prototypeBase = base.href;
  const current = new URL(location.href), local = current.pathname.slice(base.pathname.length);
  const changesDemo = current.searchParams.get('demo') === 'changes';
  const preview = changesDemo || current.searchParams.get('preview') === '1';
  const entry = /^new-attempt(?:\/|\/index\.html)?$/.test(local);
  let routeActive = false;
  try {
    routeActive = !preview && (entry || /^articles\/[^/]+\.html$/.test(local) && current.searchParams.get('study') === '1' && sessionStorage.getItem('dns-pages-route') === '1');
    if (entry && !preview) sessionStorage.setItem('dns-pages-route','1');
  } catch {routeActive = !preview && entry;}
  window.__studyRoute = routeActive;
  if (preview || !routeActive) delete window.__studyConfig;
  if (changesDemo) {
    document.documentElement.dataset.changeDemo = '';
    current.searchParams.set('preview','1'); history.replaceState(history.state,'',current);
    import('./change-demo/index.js');
  }
  function updateLink(link) {
    let url;
    try {url = new URL(link.getAttribute('href'),location.href);} catch {return;}
    if (url.origin !== location.origin) return;
    if (!url.pathname.startsWith(base.pathname) && /^\/(?:articles\/|index\.html$|new-attempt(?:\/|$)|results$|$)/.test(url.pathname)) {
      url.pathname = base.pathname + url.pathname.slice(1);
    }
    const path = url.pathname.slice(base.pathname.length);
    if (path === 'results') url.pathname = base.pathname+'journal/';
    if (url.searchParams.has('new_attempt')) {
      url.pathname = base.pathname+'new-attempt/'; url.searchParams.delete('new_attempt'); url.searchParams.delete('study');
    } else if (routeActive && /^(?:|index\.html|new-attempt\/|articles\/[^/]+\.html)$/.test(path)) {
      if (!path || path === 'index.html') url.pathname = base.pathname+'new-attempt/';
      url.searchParams.set('study','1');
    }
    if (preview && /^(?:|index\.html|articles\/[^/]+\.html)$/.test(path)) {
      url.searchParams.set('preview','1');
      if (changesDemo) url.searchParams.set('demo','changes');
    }
    if (url.href !== link.href) link.href = url.href;
  }
  function updateLinks(root) {if(root.matches?.('a[href]'))updateLink(root);root.querySelectorAll?.('a[href]').forEach(updateLink);}
  updateLinks(document);
  new MutationObserver(records => {for(const r of records)if(r.type==='attributes')updateLink(r.target);else r.addedNodes.forEach(updateLinks);})
    .observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
  document.addEventListener('click',event=>{const link=event.target.closest?.('a[href]');if(link)updateLink(link);if(routeActive&&event.target.closest?.('#save-build'))window.__studySaveRequested=true;},true);
  if (routeActive) import('./telemetry/bootstrap.js');
})();
