import {attemptEvents,recordingComplete,validRecordId} from './recording.js';
import {categories,category} from '../telemetry/registry.js';
import {isQaAttempt} from '../telemetry/research-model.js';
import {journalAttemptState} from './attempt-state.js';
import {median} from './article-choice.js';

const context=e=>validRecordId(e.tab_id)&&validRecordId(e.page_view_id)?JSON.stringify([e.tab_id,e.page_view_id]):null;
export const manualChoice=e=>e.event==='build.change'&&e.origin==='user'&&['add','replace'].includes(e.action)&&categories.includes(e.category_id)&&validRecordId(e.product_id);
const fullSave=e=>e.event==='session.complete'&&categories.every(c=>validRecordId(e.build?.[c]?.id));
function complete(list){
 if(!recordingComplete(list)||list.some(e=>e.recording_gap))return false;
 if(list.some(e=>Object.hasOwn(e,'recording_gap')))return true;
 const pages=new Map();for(const e of list){const key=context(e);if(!key||!Number.isInteger(e.sequence))return false;const seq=pages.get(key)||new Set();seq.add(e.sequence);pages.set(key,seq);}
 return [...pages.values()].every(seq=>{const s=[...seq].sort((a,b)=>a-b);return s[0]===1&&s.every((n,i)=>!i||n===s[i-1]+1);});
}
// Pure event formulas shared by bounded server/browser preparation.
export function layoutAttempt(session,events,research){
 const seen=new Set(),list=attemptEvents(events).filter(e=>{if(e.event_id&&seen.has(e.event_id))return false;if(e.event_id)seen.add(e.event_id);return true;});
 const eligible=!isQaAttempt(session)&&complete(list)&&!list.some(e=>e.event==='build.change'&&['add','replace'].includes(e.action)&&(!['user','programmatic'].includes(e.origin)||e.origin==='user'&&(!categories.includes(e.category_id)||!validRecordId(e.product_id)))),catalogs=new Map(),pages=new Map();
 let firstManual=null,chain=null,core=0;const materialVisits=new Map();
 const quickPicker={known:eligible,started:false,invoked:false,selected:false},pickerInvocations=new Set();
 const comparison={tables:new Set(),inside:new Set(),returned:new Set(),inside_unknown:new Set(),returned_unknown:new Set(),linked:false};
 for(const e of list){
  const key=context(e);
  if(e.event==='page.view'&&key&&e.page_id?.startsWith('article:')&&e.method!=='collection_resumed')materialVisits.set(key,e.page_id.slice(8));
  if(e.event==='session.start'&&core===0)core=1;
  if(e.event==='session.start'&&key)quickPicker.started=true;
  if(e.event==='ui.click'&&e.element_id==='suggestion.toggle'&&e.page_id==='configurator'&&quickPicker.started){
   const trusted=e.origin==='user'||!e.origin&&['pointer','keyboard'].includes(e.method);
   if(trusted&&key&&categories.includes(e.category_id)){quickPicker.invoked=true;pickerInvocations.add(JSON.stringify([key,e.category_id]));}
   else if(e.origin!=='programmatic')quickPicker.known=false;
  }
  if(manualChoice(e)&&e.element_id==='suggestion.select'&&e.page_id==='configurator'&&e.placement_id?.startsWith('configurator.suggestions.')){
   const sourceCategory=category(e.placement_id.slice('configurator.suggestions.'.length));
   if(sourceCategory!==e.category_id)quickPicker.known=false;
   else if(quickPicker.started&&pickerInvocations.has(JSON.stringify([key,e.category_id])))quickPicker.selected=true;
  }
  if(e.event==='session.complete'){if(core===3&&fullSave(e))core=4;break;}
  if(e.event==='modal.open'&&key){if(categories.includes(e.category_id)){catalogs.set(key,e);if(core===1)core=2;}else catalogs.delete(key);pages.delete(key);}
  if(['modal.close','page.leave'].includes(e.event)&&key){catalogs.delete(key);pages.delete(key);}
  if(manualChoice(e)){
   firstManual??=e;if(core===2)core=3;
   const opening=catalogs.get(key);
   if(!chain&&opening&&opening.category_id===e.category_id&&Number.isFinite(e.at)&&e.at>=opening.at&&(!e.modal_instance_id||e.modal_instance_id===opening.modal_instance_id))chain={opening,choice:e,ms:e.at-opening.at};
  }
  if(e.event==='comparison.action'&&key){
   if(e.action==='open'&&validRecordId(e.comparison_id))pages.set(key,{id:e.comparison_id,category:e.category_id,open:true,reached:new Set(),products:new Set(),returned:null,pendingReturn:false});
   const table=pages.get(key);if(!table||e.comparison_id!==table.id)continue;
   if(e.action==='return'){
    if(table.open||table.pendingReturn){
     table.open=false;table.pendingReturn=false;
     if(categories.includes(e.destination_category)&&Number.isFinite(e.at))table.returned={at:e.at,category:e.destination_category};
     else for(const id of table.reached)comparison.returned_unknown.add(id);
    }
    continue;
   }
   if(e.action==='close'){table.open=false;table.returned=null;table.pendingReturn=true;continue;}
   if(['category','category.restore'].includes(e.action))table.category=e.category_id;
   if(e.action==='category.close')table.category=e.destination_category;
   if(table.open&&categories.includes(e.category_id)&&table.category===e.category_id){
    const products=Array.isArray(e.products)?e.products.filter(p=>!p.category_id||p.category_id===e.category_id).map(p=>p.id):e.product_ids;
    if(Array.isArray(products)){table.products=new Set(products.filter(validRecordId));if(table.products.size>=2){table.reached.add(e.category_id);comparison.tables.add(e.category_id);}}
   }
  }
  if(manualChoice(e)){
   const table=pages.get(key);if(!table)continue;
   const same=table.id===e.comparison_id,missing=(!validRecordId(e.comparison_id)||same)&&(!validRecordId(e.comparison_id)||!e.placement_id);
   if(table.reached.has(e.category_id)){
    if(table.open&&table.category===e.category_id&&table.products.has(e.product_id)){
     if(same&&e.placement_id==='comparison.table'){comparison.inside.add(e.category_id);comparison.linked=true;}
     else if(missing&&(!e.element_id||e.element_id==='comparison.select'))comparison.inside_unknown.add(e.category_id);
    }
    if(table.returned&&table.returned.category===e.category_id&&e.at>=table.returned.at){
     if(same&&e.placement_id==='catalog.afterComparison'){comparison.returned.add(e.category_id);comparison.linked=true;}
     else if(missing&&(!e.element_id||e.element_id==='product.select'))comparison.returned_unknown.add(e.category_id);
    }
   }
   // The first actual choice consumes the return, including an unrelated category.
   table.returned=null;table.pendingReturn=false;
  }
 }
 return {id:session.id,quickPicker,materials:[...materialVisits].map(([visit,article_id])=>({visit,article_id})),eligible,manual:eligible?!!firstManual:null,chain:eligible?chain:null,firstManual,core:eligible?core:0,build:journalAttemptState(events),comparison:{eligible:!isQaAttempt(session)&&research?.H1?.eligible===true,choice_eligible:eligible&&research?.H1?.eligible===true,tables:[...comparison.tables],inside:[...comparison.inside],returned:[...comparison.returned],inside_unknown:[...comparison.inside_unknown].filter(id=>!comparison.inside.has(id)),returned_unknown:[...comparison.returned_unknown].filter(id=>!comparison.returned.has(id)),linked:comparison.linked}};
}
export function informationGroups(sessions,id){
 const ids=predicate=>sessions.filter(s=>!s.qa&&predicate(s[id.toLowerCase()])).map(s=>s.id);
 return {opened:ids(h=>h?.opening_eligible&&h.opened>0),viewed:ids(h=>h?.opening_eligible&&h.viewed),direct:ids(h=>h?.choice_eligible&&h.selected&&['before','both'].includes(h.order)),reverse:ids(h=>h?.choice_eligible&&h.selected&&['after','both'].includes(h.order)),before:ids(h=>h?.choice_eligible&&h.selected&&h.order==='before'),after:ids(h=>h?.choice_eligible&&h.selected&&h.order==='after'),both:ids(h=>h?.choice_eligible&&h.selected&&h.order==='both'),time:ids(h=>Number.isFinite(h?.time_ms)),selected:ids(h=>h?.choice_eligible&&h.selected)};
}
// Persist sufficient facts, without copying the opening/choice events. The
// original layoutAttempt remains the single source of the event formulas.
export function savedLayoutAttempt(session,events,research){
 const f=layoutAttempt(session,events,research);
 return {id:f.id,qa:isQaAttempt(session),eligible:f.eligible,manual:f.manual,chain:f.chain?{ms:f.chain.ms}:null,core:f.core,quickPicker:f.quickPicker,build:f.build,comparison:f.comparison,materials:f.materials};
}
export function layoutTotals(facts){
 const research=facts.filter(f=>!f.qa),known=research.filter(f=>f.eligible),timed=known.filter(f=>f.chain);
 return {version:1,attempts:research.length,eligible:known.length,manual:known.filter(f=>f.manual).length,time:{samples:timed.length,median_ms:median(timed.map(f=>f.chain.ms))}};
}
export function layoutSummary(sessions,facts,totals){
 const researchIds=new Set(sessions.filter(s=>!s.qa).map(s=>s.id));facts=[...new Map(facts.filter(f=>researchIds.has(f.id)).map(f=>[f.id,f])).values()];
 const research=sessions.filter(s=>!s.qa),byId=new Map(facts.map(f=>[f.id,f])),known=facts.filter(f=>f.eligible),manual=known.filter(f=>f.manual),timed=known.filter(f=>f.chain);
 const ids=predicate=>research.filter(s=>predicate(s,byId.get(s.id))).map(s=>s.id);
 const pickerFacts=known.filter(f=>f.quickPicker?.known),quickPicker={eligible:pickerFacts.length,unknown:research.length-pickerFacts.length,groups:pickerFacts.length?['started','invoked','selected'].map(step=>pickerFacts.filter(f=>f.quickPicker[step]).map(f=>f.id)):undefined};
 const compareIds=predicate=>ids((s,f)=>f?.comparison.eligible&&predicate(f.comparison));
 const knownChoice=(c,kind,id)=>c.choice_eligible&&(id?c[kind].includes(id)||Array.isArray(c[kind+'_unknown'])&&!c[kind+'_unknown'].includes(id):c[kind].length>0||Array.isArray(c[kind+'_unknown'])&&!c[kind+'_unknown'].length);
 const linkedKnown=c=>c.choice_eligible&&(c.linked||knownChoice(c,'inside')&&knownChoice(c,'returned'));
 const stopped=s=>s.participation==='abandoned',comparisonUnknown=compareIds(c=>!linkedKnown(c));
 const materialCounts=new Map();for(const f of facts)for(const v of f.materials||[])materialCounts.set(v.article_id,(materialCounts.get(v.article_id)||0)+1);
 return {facts:byId,quickPicker,materials:[...materialCounts].map(([id,visits])=>({id,visits})).sort((a,b)=>b.visits-a.visits||a.id.localeCompare(b.id)),eligible:known.length,manual:manual.map(f=>f.id),time:{median_ms:totals?totals.time.median_ms:median(timed.map(f=>f.chain.ms)),ids:timed.map(f=>f.id)},excluded:research.length-known.length,
  review:[{id:'no-choice',label:'Прекратили участие без ручного выбора',ids:ids((s,f)=>stopped(s)&&f?.manual===false)},{id:'partial-build',label:'Прекратили с неполным составом',ids:ids((s,f)=>stopped(s)&&f?.manual===true&&Number.isInteger(f.build.build_count)&&f.build.build_count<5)},{id:'full-unsaved',label:'Прекратили с пятью деталями без сохранения',ids:ids((s,f)=>stopped(s)&&f?.manual===true&&f.build.build_count===5&&f.build.saving==='not_saved')}],
  comparison:{eligible:compareIds(()=>true).length,choice_known:compareIds(linkedKnown).length,choice_unknown:comparisonUnknown,
   inside_known:compareIds(c=>knownChoice(c,'inside')).length,returned_known:compareIds(c=>knownChoice(c,'returned')).length,
   inside_unknown:compareIds(c=>!knownChoice(c,'inside')),returned_unknown:compareIds(c=>!knownChoice(c,'returned')),
   rows:['gpu','processor','board','power','case'].map(id=>({id,table:compareIds(c=>c.tables.includes(id)),
    inside_known:compareIds(c=>c.tables.includes(id)&&knownChoice(c,'inside',id)).length,returned_known:compareIds(c=>c.tables.includes(id)&&knownChoice(c,'returned',id)).length,
    inside:compareIds(c=>c.choice_eligible&&c.inside.includes(id)),returned:compareIds(c=>c.choice_eligible&&c.returned.includes(id))})).filter(r=>r.table.length||r.inside.length),
   inside:compareIds(c=>c.choice_eligible&&c.inside.length>0),returned:compareIds(c=>c.choice_eligible&&c.returned.length>0),
   groups:[ids(s=>s.h1?.eligible),ids(s=>s.h1?.eligible&&s.h1.started),ids(s=>s.h1?.eligible&&s.h1.table_2plus),comparisonUnknown.length?undefined:ids((s,f)=>s.h1?.eligible&&s.h1.table_2plus&&f?.comparison.choice_eligible&&f.comparison.linked)]},
  selection:Array.from({length:4},(_,i)=>known.filter(f=>f.core>i).map(f=>f.id)),H2:informationGroups(research,'H2'),H3:informationGroups(research,'H3')};
}
