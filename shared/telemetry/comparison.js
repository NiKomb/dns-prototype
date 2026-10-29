import {category} from './registry.js';

// One open comparison has one ID across tab switches and table rerenders.
// Measurement 1 is additive: no historical events or hypothesis totals change.
export function createComparisonTelemetry({emit,active}) {
 const watched=new Map(),returns=new Map();
 const context=d=>({comparison_id:d.comparison_id,category_id:category(d.category),products:d.products,
  product_ids:d.products?.map(p=>p.id),measurement_version:1});
 function unwatch(root){const stop=watched.get(root);if(stop){stop();watched.delete(root);}}
 function watch(d){
  const root=d.element,viewport=root.querySelector('[data-comparison-scroll=table]');if(!viewport)return;
  unwatch(root);
  let inputAt=-Infinity,disposed=false;
  const previous={x:viewport.scrollLeft,y:viewport.scrollTop},series=new Map();
  function finish(axis){const s=series.get(axis);if(!s)return;clearTimeout(s.timer);series.delete(axis);
   emit('comparison.scroll',{...context(d),placement_id:'comparison.table',origin:'user',axis,
    start_px:s.start,end_px:s.end,travel_px:s.travel,scrollable_px:s.max,
    duration_ms:Math.round(performance.now()-s.started),direction:s.forward&&s.backward?'mixed':s.forward?(axis==='x'?'right':'down'):(axis==='x'?'left':'up')});}
  function input(e){
   if(!e.isTrusted || e.type==='pointermove'&&!e.buttons)return;
   if(e.type==='keydown'&&!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','PageDown','PageUp','Home','End',' '].includes(e.key))return;
   // Picker vertical wheel also scrolls the table; its horizontal drag does not.
   if(!viewport.contains(e.target)&&!e.target.closest('[data-comparison-scroll-control],[data-comparison-scroll-input=table]'))return;
   inputAt=performance.now();
  }
  function scroll(){for(const axis of ['x','y']){
   const pos=Math.max(0,axis==='x'?viewport.scrollLeft:viewport.scrollTop),before=previous[axis];previous[axis]=pos;
   if(disposed||!active()||document.hidden||Math.abs(pos-before)<.1||performance.now()-inputAt>1200)continue;
   const max=Math.max(0,axis==='x'?viewport.scrollWidth-viewport.clientWidth:viewport.scrollHeight-viewport.clientHeight);
   let s=series.get(axis);if(s&&s.max!==max){finish(axis);s=null;}
   if(!s){s={start:before,end:before,travel:0,max,started:performance.now()};series.set(axis,s);}
   const delta=pos-s.end;s.travel+=Math.abs(delta);s.forward ||= delta>0;s.backward ||= delta<0;s.end=pos;
   clearTimeout(s.timer);s.timer=setTimeout(()=>finish(axis),250);
  }}
  function reset(){for(const axis of ['x','y'])finish(axis);inputAt=-Infinity;}
  function hide(){if(document.hidden)reset();}
  function action(e){if(!e.target.closest('[data-comparison-scroll-control]'))reset();}
  // Clicks may reveal a column or change row geometry. They are separate actions,
  // never manual scrolling, even immediately after wheel/drag input.
  root.addEventListener('click',action,true);root.addEventListener('change',reset,true);
  for(const name of ['wheel','touchmove','pointerdown','pointermove','keydown'])root.addEventListener(name,input,{capture:true,passive:true});
  viewport.addEventListener('scroll',scroll);document.addEventListener('visibilitychange',hide);
  watched.set(root,()=>{reset();disposed=true;root.removeEventListener('click',action,true);root.removeEventListener('change',reset,true);
   for(const name of ['wheel','touchmove','pointerdown','pointermove','keydown'])root.removeEventListener(name,input,true);
   viewport.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',hide);});
 }
 return {
  resetReturn(){returns.clear();},
  start(){returns.clear();emit('comparison.available',{measurement_version:1});},
  handle(d){
   if(d.type==='comparison.watch'){watch(d);return;}
   if(d.type==='comparison.unwatch'){unwatch(d.element);return;}
   if(d.type!=='comparison.result')return;
   if(d.action==='close')for(const root of [...watched.keys()])unwatch(root);
   if(d.action==='open')returns.clear();
   const data={...context(d),action:d.action,placement_id:d.placement_id,product_id:d.product_id,name:d.name,
    previous_products:d.previous_products,source_category:d.source_category?category(d.source_category):undefined,
    destination_category:d.destination_category===null?null:category(d.destination_category)||undefined,
    reason:d.reason,selected:d.selected,expanded:d.expanded,target_id:d.target_id,target_name:d.target_name};
   emit('comparison.action',data);
   if(d.action==='return'&&active()&&data.destination_category&&typeof data.comparison_id==='string'&&data.comparison_id!=='unknown')returns.set(data.destination_category,data);
  },
  choice(selection,categoryId){
   if(!selection?.trusted)return {};
   const prior=returns.get(category(categoryId));returns.clear();
   if(selection.element_id==='comparison.select')return {comparison_id:selection.comparison_id,placement_id:'comparison.table',measurement_version:1};
   if(selection.element_id!=='product.select'||!prior)return {};
   return {comparison_id:prior.comparison_id,placement_id:'catalog.afterComparison',measurement_version:1};
  },
  finish(){for(const root of [...watched.keys()])unwatch(root);returns.clear();}
 };
}
