import {orderedEvents,routeStages} from '../telemetry/report-model.js';
import {categoryNames} from '../telemetry/registry.js';
import {comparisonActionNames,comparisonPlacementNames} from './comparison-labels.js';

// Session detail only. The aggregate route/funnel retains its existing projection.
export function attemptRoute(events,startedAt=0) {
 const stages=[],seen=new Set(),entries=new Map(),productNames=new Map();
 const category=id=>categoryNames[id]||'Категория не записана';
 const productKey=(categoryId,id)=>JSON.stringify([categoryId,id]);
 const product=(categoryId,id)=>productNames.get(productKey(categoryId,id))||id;
 for(const e of orderedEvents(events)){
  if(e.event_id&&seen.has(e.event_id))continue;
  if(e.event_id)seen.add(e.event_id);
  for(const p of e.products||[])productNames.set(productKey(e.category_id,p.id),p.name||p.id);
  for(const [id,p] of Object.entries(e.build||{}))if(p?.id)productNames.set(productKey(id,p.id),p.name||p.id);
  if(e.product_id&&e.name)productNames.set(productKey(e.category_id,e.product_id),e.name);
  // Never join different tabs, page visits, or comparison visits by their labels.
  const key=e.comparison_id?JSON.stringify([e.tab_id,e.page_view_id,e.comparison_id]):null;
  if(e.event==='comparison.action'&&e.action==='open'&&key)entries.set(key,e.placement_id);
  let label=routeStages([e],startedAt)[0]?.label,details=[];
  if(e.event==='comparison.action'&&['open','category','close','return'].includes(e.action)){
   label=comparisonActionNames[e.action];
   details.push(e.action==='category'&&e.source_category?category(e.source_category)+' → '+category(e.category_id):category(e.category_id));
   if(e.action==='return')details.push(e.destination_category?'В каталог: '+category(e.destination_category):'Категория каталога не записана');
   const products=Array.isArray(e.products)?e.products.map(p=>p.name||p.id):Array.isArray(e.product_ids)?e.product_ids.map(id=>product(e.category_id,id)):null;
   details.push(products?products.length?'Товары: '+products.join(', '):'Сравнение пустое':'Товары не записаны');
   const source=e.action==='open'?e.placement_id:key?entries.get(key):null;
   details.push(source?'Вход: '+(comparisonPlacementNames[source]||source):'Источник входа не записан');
  }else if(e.event==='build.change'&&['add','replace'].includes(e.action)){
   const comparisonChoice=e.origin==='user'&&e.product_id&&['comparison.table','catalog.afterComparison'].includes(e.placement_id);
   if(comparisonChoice)label+=e.placement_id==='comparison.table'?' из сравнения':' · выбор после сравнения';
   details.push(category(e.category_id),e.name||product(e.category_id,e.product_id)||'Товар не записан');
   if(e.previous_product_id)details.push('Предыдущий товар: '+product(e.category_id,e.previous_product_id));
   if(e.placement_id)details.push('Источник выбора: '+(comparisonPlacementNames[e.placement_id]||e.placement_id));
   if(comparisonChoice){const source=key?entries.get(key):null;details.push(source?'Вход: '+(comparisonPlacementNames[source]||source):'Источник входа не записан');}
  }else if(label&&e.event==='modal.open')details.push(category(e.category_id));
  else if(label&&e.event==='build.change'&&e.category_id)details.push(category(e.category_id),e.name||product(e.category_id,e.product_id||e.previous_product_id));
  if(label)stages.push({label,description:details.filter(Boolean).join(' · '),at:e.at,event_id:e.event_id,
   tab_id:e.tab_id,page_view_id:e.page_view_id,comparison_id:e.comparison_id,category_id:e.category_id,product_id:e.product_id});
  if(e.event==='session.complete')break;
 }
 return stages.map((stage,i)=>({...stage,elapsed_ms:Math.max(0,stage.at-startedAt),duration_ms:stages[i+1]?Math.max(0,stages[i+1].at-stage.at):null}));
}
