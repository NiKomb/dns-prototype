// Shared HTML rails: native content scrolling, pointer-driven track and thumb.
window.prototypeScrollbars = (() => {
  function bindScrollRail(rail,viewport,axis='y') {
    rail.classList.add('catalog-scrollbar');rail.tabIndex=-1;rail.setAttribute('aria-hidden','true');
    const thumb=document.createElement('div');thumb.className='catalog-scrollbar-thumb';rail.replaceChildren(thumb);
    const horizontal=axis==='x',position=horizontal ? 'scrollLeft' : 'scrollTop';
    const client=horizontal ? 'clientWidth' : 'clientHeight',extent=horizontal ? 'scrollWidth' : 'scrollHeight';
    const size=horizontal ? 'width' : 'height',offset=horizontal ? 'left' : 'top';
    let pointer=null,grab=0;
    function update() {
      const maximum=Math.max(0,viewport[extent]-viewport[client]);rail.hidden=maximum<=0;
      const length=rail[client],handle=Math.min(length,Math.max(24,length*viewport[client]/Math.max(1,viewport[extent])));
      thumb.style[size]=`${handle}px`;thumb.style[offset]=`${maximum ? viewport[position]/maximum*(length-handle) : 0}px`;
    }
    function seek(event) {
      const rect=rail.getBoundingClientRect(),length=rail[client],handle=parseFloat(thumb.style[size]) || 0;
      const coordinate=horizontal ? event.clientX : event.clientY,scale=rect[size]/Math.max(1,length);
      const fraction=Math.max(0,Math.min(1,((coordinate-rect[offset])/scale-grab)/Math.max(1,length-handle)));
      viewport[position]=fraction*Math.max(0,viewport[extent]-viewport[client]);update();
    }
    function down(event) {
      if(event.button!==0)return;update();
      const rect=rail.getBoundingClientRect(),coordinate=horizontal ? event.clientX : event.clientY;
      const scale=rect[size]/Math.max(1,rail[client]);
      grab=event.target===thumb ? (coordinate-rect[offset])/scale-(parseFloat(thumb.style[offset]) || 0) : (parseFloat(thumb.style[size]) || 0)/2;
      pointer=event.pointerId;rail.setPointerCapture(pointer);event.preventDefault();seek(event);
    }
    function move(event) {if(event.pointerId===pointer){event.preventDefault();seek(event);}}
    function up(event) {if(event.pointerId===pointer){if(rail.hasPointerCapture(pointer))rail.releasePointerCapture(pointer);pointer=null;}}
    function wheel(event) {
      const delta=horizontal ? event.deltaX || event.deltaY : event.deltaY;
      if(!delta)return;event.preventDefault();
      viewport[position]+=delta*(event.deltaMode===1 ? 16 : event.deltaMode===2 ? viewport[client] : 1);update();
    }
    viewport.addEventListener('scroll',update,{passive:true});
    rail.addEventListener('pointerdown',down);rail.addEventListener('pointermove',move);
    rail.addEventListener('pointerup',up);rail.addEventListener('pointercancel',up);rail.addEventListener('lostpointercapture',up);
    rail.addEventListener('wheel',wheel,{passive:false});
    rail.update=update;
    rail.destroy=()=>{if(pointer!==null&&rail.hasPointerCapture(pointer))rail.releasePointerCapture(pointer);pointer=null;viewport.removeEventListener('scroll',update);rail.removeEventListener('pointerdown',down);rail.removeEventListener('pointermove',move);rail.removeEventListener('pointerup',up);rail.removeEventListener('pointercancel',up);rail.removeEventListener('lostpointercapture',up);rail.removeEventListener('wheel',wheel);};
    update();return rail;
  }
  return {bind:bindScrollRail};
})();
document.addEventListener('DOMContentLoaded', () => {
  const journal=document.body.classList.contains('journal-ui');
  const configurator=!!document.querySelector('#processor-row');
  const library=location.pathname.endsWith('/components.html');
  if(!journal && !configurator && !library)return;
  const entries=new Map();let frame=0;
  function add(viewport,axis='y') {
    const rail=document.createElement('div');rail.className='page-scroll-rail';rail.dataset.axis=axis;
    document.body.append(rail);
    const binding=window.prototypeScrollbars.bind(rail,viewport,axis);
    viewport.classList.add('has-scroll-rail');
    return {rail,viewport,axis,binding};
  }
  const documentEntry=add(document.scrollingElement);
  document.documentElement.classList.add('has-page-scrollbar');
  function update(entry) {
    const {rail,viewport,axis}=entry;
    const isDocument=viewport===document.scrollingElement;
    const rect=isDocument?{top:0,left:0,right:innerWidth,bottom:innerHeight,width:innerWidth,height:innerHeight}:viewport.getBoundingClientRect();
    const style=getComputedStyle(viewport);
    const journalRoot=isDocument?(journal?document.body:null):viewport.closest('.journal-ui');
    if(journalRoot){const colors=getComputedStyle(journalRoot);rail.style.background=colors.getPropertyValue('--surface-alt');rail.firstElementChild.style.background=colors.getPropertyValue('--scroll-thumb');}
    const visible=rect.width>0 && rect.height>0 && (isDocument || /auto|scroll/.test(axis==='x'?style.overflowX:style.overflowY));
    const top=Math.max(0,rect.top),bottom=Math.min(innerHeight,rect.bottom),left=Math.max(0,rect.left),right=Math.min(innerWidth,rect.right);
    rail.style.top=`${axis==='x'?bottom-4:top}px`;
    rail.style.left=`${axis==='x'?left:right-4}px`;
    rail.style.width=axis==='x'?`${Math.max(0,right-left-4)}px`:'4px';
    rail.style.height=axis==='x'?'4px':`${Math.max(0,bottom-top)}px`;
    rail.update();
    if(!isDocument){resize.observe(viewport);for(const child of viewport.children)resize.observe(child);}
    if(!visible || bottom<=top || right<=left || (isDocument && (/hidden|clip/.test(style.overflowY) || /hidden|clip/.test(getComputedStyle(document.body).overflowY))))rail.hidden=true;
  }
  function sync() {
    frame=0;
    for(const [viewport,list]of entries)if(!viewport.isConnected){for(const entry of list){entry.rail.destroy();resize.unobserve(viewport);for(const child of viewport.children)resize.unobserve(child);entry.rail.remove();}entries.delete(viewport);}
    if(journal || library)for(const viewport of document.querySelectorAll('.journal-ui .table-scroll,.journal-ui .dropdown-options,.journal-ui .scroll-rows,.journal-ui .event-scroll')) {
      if(!entries.has(viewport))entries.set(viewport,[add(viewport),add(viewport,'x')]);
    }
    update(documentEntry);for(const list of entries.values())for(const entry of list)update(entry);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
  const resize=new ResizeObserver(schedule);resize.observe(document.body);resize.observe(document.documentElement);
  const changes=new MutationObserver(records=>{if(records.some(record=>!record.target.closest?.('.catalog-scrollbar')))schedule();});
  changes.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','data-theme','open']});
  window.addEventListener('resize',schedule);document.addEventListener('scroll',schedule,true);
  document.addEventListener('transitionend',schedule);sync();
});
