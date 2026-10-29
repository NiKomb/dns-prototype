import {orderedEvents} from './report-model.js';

const categories=new Set(['processor','board','gpu','power','case']);
const reference=e=>({event_id:e.event_id,at:e.at,tab_id:e.tab_id,page_view_id:e.page_view_id,category_id:e.category_id});
const scope=e=>e.tab_id&&e.page_view_id?JSON.stringify([e.tab_id,e.page_view_id]):null;
// Read-only H1 facts. A category's products are never merged with another set.
export function comparisonAttempt(events){
 const seen=new Set(),pages=new Map(),catalogs=[],sequences=new Map();
 let measured=false,incomplete=false,partial=false,first=null,reached=null,ended=false;
 const list=orderedEvents(events).filter(e=>{if(e.event_id&&seen.has(e.event_id))return false;if(e.event_id)seen.add(e.event_id);return true;});
 for(const e of list){
  if(ended)break;
  const key=scope(e);
  if(key&&Number.isInteger(e.sequence)){
   const seq=sequences.get(key)||new Set();seq.add(e.sequence);sequences.set(key,seq);
  }
  if(e.recording_gap||e.event==='delivery.gap'||e.method==='collection_resumed')incomplete=true;
  if(e.event==='session.complete'){ended=true;continue;}
  if(e.page_id!=='configurator'||!key) {
   if(e.event.startsWith('comparison.')){measured=true;partial=true;}
   continue;
  }
  const page=pages.get(key)||{available:false,catalog:null,table:null};pages.set(key,page);
  if(e.event.startsWith('comparison.')){measured=true;if(e.event!=='comparison.available'&&!page.available)partial=true;}
  if(e.event==='comparison.available'&&e.measurement_version===1){measured=true;page.available=true;}
  if(e.event==='modal.open'&&categories.has(e.category_id)){
   const visit={...reference(e),modal_instance_id:e.modal_instance_id,measured:page.available};
   catalogs.push(visit);page.catalog=visit;page.table=null;
   if(!page.available)partial=true;
  }
  if(e.event==='modal.close'||e.event==='page.leave'){page.catalog=null;page.table=null;}
  if(e.event!=='comparison.action')continue;
  measured=true;
  const action=['add','open'].includes(e.action);
  if(action&&(!page.available||!page.catalog))partial=true;
  if(action&&!first){
   first={...reference(e),action:e.action,comparison_id:e.comparison_id,catalog:page.catalog?{...page.catalog}:null};
  }
  if(e.action==='open')page.table=e.comparison_id?{id:e.comparison_id,category_id:e.category_id}:null;
  if(['close','return'].includes(e.action)){page.table=null;continue;}
  const table=page.table;
  if(table&&e.comparison_id===table.id){
   if(['category','category.restore'].includes(e.action))table.category_id=e.category_id;
   if(e.action==='category.close')table.category_id=e.destination_category??null;
   const ids=Array.isArray(e.products)?e.products.map(p=>p.id):e.product_ids;
   if(!reached&&categories.has(e.category_id)&&table.category_id===e.category_id&&Array.isArray(ids)&&new Set(ids.filter(Boolean)).size>=2){
    reached={...reference(e),comparison_id:e.comparison_id,product_ids:[...new Set(ids)]};
   }
  }
 }
 // The summary projection carries the same full-page continuity check from SQL.
 // Never interpret the gaps created by its event-type filter as lost delivery.
 if(!list.some(e=>Object.hasOwn(e,'recording_gap')))for(const seq of sequences.values()){
  const sorted=[...seq].sort((a,b)=>a-b);if(sorted[0]!==1||sorted.some((n,i)=>i&&n!==sorted[i-1]+1))incomplete=true;
 }
 const coverage=!measured?'not_measured':partial?'partial':'from_start';
 const eligible=measured&&catalogs.length>0&&!partial&&!incomplete;
 const delta=first?.catalog?first.at-first.catalog.at:null;
 const time=eligible&&first?.catalog?.measured&&Number.isFinite(delta)&&delta>=0?delta:null;
 return {status:!measured?'not_measured':incomplete?'incomplete':partial?'partial':catalogs.length?'measured':'no_catalog',coverage,incomplete,eligible,
  catalog_visits:catalogs.length,started:first?true:eligible?false:null,table_2plus:reached?true:eligible?false:null,
  first_action:first,time_to_first_action_ms:time,time_status:time!==null?'measured':first?'unconfirmed':eligible?'no_action':'not_measured',table_reached:reached};
}

export function comparisonSummary(facts){
 const values=facts.map(f=>f.H1),count=fn=>values.filter(fn).length,eligible=values.filter(v=>v.eligible);
 const ratio=n=>({numerator:n,denominator:eligible.length,percent:eligible.length?n/eligible.length*100:null});
 const times=eligible.map(v=>v.time_to_first_action_ms).filter(Number.isFinite).sort((a,b)=>a-b),middle=Math.floor(times.length/2);
 return {status:eligible.length?'measured':'no_data',started:ratio(eligible.filter(v=>v.started).length),table_2plus:ratio(eligible.filter(v=>v.table_2plus).length),
  time_to_first_action:{median_ms:times.length?(times.length%2?times[middle]:(times[middle-1]+times[middle])/2):null,sessions:times.length},
  not_measured:count(v=>v.coverage==='not_measured'),partial:count(v=>v.coverage==='partial'),incomplete:count(v=>v.incomplete),no_catalog:count(v=>v.status==='no_catalog')};
}
