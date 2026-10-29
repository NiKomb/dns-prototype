import {recordedBuild} from './report-model.js';
import {attemptEvents,recordingComplete,validRecordId} from '../journal/recording.js';
import {median} from '../journal/article-choice.js';
import {categories,evidenceKindNames} from './registry.js';

const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
const ref=e=>({event_id:e.event_id,at:e.at,tab_id:e.tab_id,page_view_id:e.page_view_id});
const key=e=>JSON.stringify([e.tab_id,e.page_view_id]);
const article=e=>e.page_id?.startsWith('article:')?e.page_id.slice(8):null;
const manual=e=>e.event==='build.change'&&e.origin==='user'&&['add','replace'].includes(e.action)&&categories.includes(e.category_id)&&validRecordId(e.product_id);
const byChoice=(a,b)=>a.choice.at-b.choice.at||String(a.choice.event_id).localeCompare(String(b.choice.event_id))||String(a.visit.event_id).localeCompare(String(b.visit.event_id));

// Evaluate one page-view segment. Timer updates are cumulative, never additive.
export function viewingCriterion(visible,depth){
 const time=valid(visible),scroll=valid(depth);
 return {status:time&&visible>=3000||scroll&&depth>50?'viewed':time&&scroll?'below':'unknown',
  branch:time&&visible>=3000&&scroll&&depth>50?'both':time&&visible>=3000?'time':scroll&&depth>50?'depth':null};
}

function intactRecording(list){
 if(!recordingComplete(list)||list.some(e=>e.recording_gap))return false;
 // SQL has already checked continuity before filtering event types.
 if(list.some(e=>Object.hasOwn(e,'recording_gap')))return true;
 const pages=new Map();for(const e of list)if(Number.isInteger(e.sequence)){
  const seq=pages.get(key(e))||new Set();seq.add(e.sequence);pages.set(key(e),seq);
 }
 return [...pages.values()].every(seq=>{const s=[...seq].sort((a,b)=>a-b);return s[0]===1&&s.every((n,i)=>!i||n===s[i-1]+1);});
}

function retainedChoice(list,visit){
 let selected=null,present=null,atOpening=null,removed=false;
 for(const e of list){
  if(e.at>visit.qualified_at)break;
  if(e.at>=visit.at&&atOpening===null)atOpening=present===selected?.product_id?selected:false;
  if(e.event==='build.change'){
   if(e.action==='clear')present=null;
   else if(e.category_id===visit.category_id){
    present=['add','replace'].includes(e.action)?e.product_id:null;
    selected=manual(e)?{...ref(e),category_id:e.category_id,product_id:e.product_id,action:e.action}:null;
   }
  }
  const build=recordedBuild(e.build);if(build)present=build[visit.category_id]?.id||null;
  if(atOpening&&present!==atOpening.product_id)removed=true;
 }
 return atOpening&&!removed&&present===atOpening.product_id&&atOpening.tab_id===visit.tab_id&&atOpening.at<visit.at?atOpening:null;
}

export function heartAttempt(session,events,research){
 const seen=new Set(),list=attemptEvents(events).filter(e=>{if(e.event_id&&seen.has(e.event_id))return false;if(e.event_id)seen.add(e.event_id);return true;});
 const complete=intactRecording(list),offers=research.H3.offers;
 const linked=offers.flatMap(o=>o.visits.map(v=>({...v,offer:o})));
 const pages=new Map(),tabs=new Map();
 for(const e of list){
  const id=article(e),opening=id&&(e.event==='page.view'&&e.method!=='collection_resumed'||e.event==='navigation.arrive'&&e.reason==='page'&&e.destination_page===e.page_id);
  if(opening&&validRecordId(e.tab_id)&&validRecordId(e.page_view_id)&&valid(e.at)){
   let v=pages.get(key(e));
   if(!v){
    const previous=tabs.get(e.tab_id),continuation=e.method==='reload'&&previous?.article_id===id&&!previous.end;
    if(previous&&!previous.end)previous.end=ref(e);
    v={...ref(e),article_id:id,category_id:null,recommendation:null,availability:[],actions:[],exposures:[],visible_ms:null,depth_pct:null,qualified_at:null,end:null,return:null};
    v.group=continuation?previous.group:[v];if(continuation){v.group.push(v);v.recommendation=previous.recommendation;}
    pages.set(key(e),v);tabs.set(e.tab_id,v);
   }
   const match=linked.find(p=>p.tab_id===e.tab_id&&p.page_view_id===e.page_view_id&&p.article_id===id);
   if(match)v.recommendation={offer_id:match.offer.offer_id,placement_id:match.offer.placement_id,category_id:match.category_id||match.offer.category_id,article_ids:match.offer.article_ids,opening:ref(match)};
  }
  const v=pages.get(key(e));
  if(v&&!v.end&&id===v.article_id){
   if(e.event==='evidence.available'&&e.article_id===id)v.availability.push(e);
   if(e.event==='article.time'&&e.article_id===id&&valid(e.visible_ms))v.visible_ms=Math.max(v.visible_ms??0,e.visible_ms);
   if(e.event==='scroll.summary'&&e.container_id==='article.page'&&e.origin==='user'&&valid(e.depth_pct))v.depth_pct=Math.max(v.depth_pct??0,e.depth_pct);
   const action=e.evidence_id&&e.evidence_kinds?.some(k=>['results','conditions'].includes(k))&&
    (e.event==='article.disclosure'&&e.expanded===true||e.event==='scroll.summary'&&e.container_id==='article.table'&&e.origin==='user');
   if(action)v.actions.push(ref(e));
   if(e.event==='evidence.exposure'&&e.article_id===id&&[1,2,3,4].includes(e.exposure_version)&&e.evidence_id&&
    e.evidence_kinds?.some(k=>Object.hasOwn(evidenceKindNames,k))&&valid(e.duration_ms)&&e.duration_ms>=5000&&e.at-e.duration_ms>=v.at){
    v.exposures.push({...ref(e),confirmed_at:e.at,exposure_version:e.exposure_version,at:e.at-e.duration_ms,evidence_id:e.evidence_id});
   }
   if(v.qualified_at===null&&viewingCriterion(v.visible_ms,v.depth_pct).status==='viewed')v.qualified_at=e.at;
  }
  const active=tabs.get(e.tab_id);
  if(active&&e.event==='navigation.arrive'&&e.page_id==='configurator'&&e.reason!=='modal'&&e.destination_page==='configurator'&&e.source_page==='article:'+active.article_id){
   for(const part of active.group){part.return=ref(e);if(!part.end)part.end=ref(e);}tabs.delete(e.tab_id);
  }else if(active&&e.event==='page.view'&&!id){if(!active.end)active.end=ref(e);/* page.view precedes the confirmed return */}
 }
 const visits=[...pages.values()].map(v=>{
  const recorded=[...new Set(v.availability.map(e=>e.category_id).filter(c=>categories.includes(c)))];
  v.category_id=v.recommendation?.category_id||(recorded.length===1?recorded[0]:null);
  if(recorded.some(c=>v.category_id&&c!==v.category_id))v.category_id=null;
  const practical=v.availability.some(e=>e.evidence_ids?.length);
  const gpu=v.recommendation?.category_id==='gpu'&&v.recommendation.placement_id==='modal.articles'&&v.recommendation.article_ids.includes(v.article_id);
  v.practical=practical||gpu;v.practical_source=practical?'evidence.available':gpu?'gpu.modal.offer':null;
  const criterion=viewingCriterion(v.visible_ms,v.depth_pct);Object.assign(v,criterion);
  const direct=criterion.status==='viewed'&&v.return&&v.qualified_at<=v.return.at&&categories.includes(v.category_id)?list.find(e=>manual(e)&&e.tab_id===v.tab_id&&e.page_id==='configurator'&&e.category_id===v.category_id&&e.at>=v.return.at):null;
  v.direct_choice=direct?{...ref(direct),product_id:direct.product_id,category_id:direct.category_id,action:direct.action}:null;
  v.reverse_choice=criterion.status==='viewed'&&categories.includes(v.category_id)?retainedChoice(list,v):null;
  v.other_category=!!v.return&&list.some(e=>manual(e)&&e.tab_id===v.tab_id&&e.at>=v.return.at&&e.category_id!==v.category_id);
  v.order=v.direct_choice&&v.reverse_choice?'both':v.direct_choice?'before':v.reverse_choice?'after':null;
  v.chain_actions=v.group.flatMap(part=>part.actions).filter(a=>!v.return||a.at<=v.return.at).sort((a,b)=>a.at-b.at||String(a.event_id).localeCompare(String(b.event_id)));
  v.exposure_measured=v.group.some(part=>part.availability.some(a=>[1,2,3,4].includes(a.exposure_version)));
  v.chain_exposures=v.group.flatMap(part=>part.exposures).filter(a=>!v.return||a.confirmed_at<=v.return.at).sort((a,b)=>a.at-b.at||String(a.event_id).localeCompare(String(b.event_id)));
  return v;
 });
 const projection=(name)=>{
  const articleRows=visits.filter(v=>name==='H2'?v.practical:!!v.recommendation);
  // H2 uses the existing exposure landmark even when no choice follows it.
  // Keep article-level facts unchanged for H3 and the historical diagnostics.
  const rows=name==='H2'?articleRows.map(v=>{
   const exposure=v.chain_exposures[0],measured=v.exposure_measured||!!exposure;
   const status=exposure?'viewed':measured?'below':'unknown';
   const choice=exposure&&v.return&&categories.includes(v.category_id)?list.find(e=>manual(e)&&e.tab_id===v.tab_id&&e.page_id==='configurator'&&e.category_id===v.category_id&&e.at>=v.return.at):null;
   const direct=choice?{...ref(choice),product_id:choice.product_id,category_id:choice.category_id,action:choice.action}:null;
   const {group,...facts}=v;
   return {...facts,article_status:v.status,status,branch:exposure?'exposure':null,qualified_at:exposure?.confirmed_at??null,exposure_measured:measured,
    previous_choice:v.reverse_choice,direct_choice:direct,reverse_choice:null,order:direct?'before':null};
  }):articleRows,viewed=rows.filter(v=>v.status==='viewed');
  const unknown=rows.some(v=>v.status==='unknown'),offered=offers.some(o=>o.article_ids.length);
  const openingEligible=name==='H2'?rows.length>0&&(viewed.length>0||!unknown):offered&&(viewed.length>0||!unknown);
  const chains=viewed.flatMap(v=>[...(v.direct_choice?[{visit:v,choice:v.direct_choice,order:'before'}]:[]),...(v.reverse_choice?[{visit:v,choice:v.reverse_choice,order:'after'}]:[])]);
  const direct=chains.filter(c=>c.order==='before').sort(byChoice),first=direct[0];
  const legacyFirst=name==='H2'?articleRows.filter(v=>v.status==='viewed'&&v.direct_choice).map(visit=>({visit,choice:visit.direct_choice})).sort(byChoice)[0]:null;
  const legacyStart=legacyFirst?.visit.chain_actions[0]??null;
  const exposureMeasured=rows.some(v=>v.exposure_measured);
  const start=first?(name==='H2'?first.visit.chain_exposures[0]:first.visit.recommendation.opening):null;
  const delta=start?first.choice.at-start.at:null;
  const order=chains.some(c=>c.order==='before')&&chains.some(c=>c.order==='after')?'both':chains[0]?.order||null;
  const linkageUnknown=viewed.some(v=>!categories.includes(v.category_id)||list.some(e=>e.event==='build.change'&&['add','replace'].includes(e.action)&&e.tab_id===v.tab_id&&
   (!categories.includes(e.category_id)||e.category_id===v.category_id)&&(!['user','programmatic'].includes(e.origin)||e.origin==='user'&&(!categories.includes(e.category_id)||!validRecordId(e.product_id)))));
  const status=research.qa?'qa':research.coverage==='not_measured'?'not_measured':research.coverage!=='from_start'?'partial':!complete?'incomplete':name==='H2'&&rows.length&&!exposureMeasured?'not_measured':unknown&&!viewed.length?'unknown':openingEligible?'measured':'no_opportunity';
  const eligible=status==='measured',choiceEligible=eligible&&viewed.length>0&&(name==='H2'||chains.length>0||!linkageUnknown);
  return {status,eligible,opening_eligible:eligible,choice_eligible:choiceEligible,offered,opened:rows.length,viewed:viewed.length>0,selected:chains.length>0,order,visits:rows,chains,
   representative:first||chains.sort(byChoice)[0]||null,time_start:start,time_ms:eligible&&(name!=='H2'||exposureMeasured)&&valid(delta)?delta:null,
   ...(name==='H2'?{exposure_measured:exposureMeasured,legacy_time_start:legacyStart,legacy_time_ms:research.coverage==='from_start'&&complete&&!research.qa&&legacyStart?legacyFirst.choice.at-legacyStart.at:null,
    legacy_time_status:research.coverage!=='from_start'||!complete||research.qa?'not_measured':legacyFirst?legacyStart?'measured':'no_action':articleRows.some(v=>v.reverse_choice)?'after_only':'no_choice'}:{}),
   time_status:!eligible||name==='H2'&&!exposureMeasured?'not_measured':first?start?'measured':'no_exposure':name==='H2'&&!viewed.length?'no_exposure':chains.length?'after_only':'no_choice',unknown_visits:rows.filter(v=>v.status==='unknown').length,
   linkage_unknown:linkageUnknown};
 };
 for(const v of visits)delete v.group;
 return {version:1,H2:projection('H2'),H3:projection('H3'),visits};
}

export function heartSummary(facts){
 const result={version:1};
 for(const name of ['H2','H3']){
  const rows=facts.map(f=>f.heart?.[name]).filter(Boolean),opened=rows.filter(r=>r.opening_eligible),viewed=rows.filter(r=>r.choice_eligible);
  const ratio=(n,d)=>({numerator:n,denominator:d,percent:d?n/d*100:null});
  const times=rows.map(r=>r.time_ms).filter(valid),count=fn=>rows.filter(fn).length;
  result[name]={status:opened.length?'measured':'no_data',viewing:ratio(opened.filter(r=>r.viewed).length,opened.length),selection:ratio(viewed.filter(r=>r.selected).length,viewed.length),
   time:{median_ms:median(times),sessions:times.length},
   ...(name==='H2'?{legacy_time:{median_ms:median(rows.map(r=>r.legacy_time_ms).filter(valid)),sessions:rows.filter(r=>valid(r.legacy_time_ms)).length},exposure_measured:count(r=>r.exposure_measured)}:{}),excluded:Object.fromEntries(['qa','not_measured','partial','incomplete','unknown','no_opportunity'].map(s=>[s,count(r=>r.status===s)])),
   linkage_unknown:count(r=>r.linkage_unknown),unknown_visits:rows.reduce((n,r)=>n+r.unknown_visits,0),no_action:count(r=>r.time_status==='no_exposure'),after_only:count(r=>r.time_status==='after_only'),
   before:count(r=>r.eligible&&r.order==='before'),after:count(r=>r.eligible&&r.order==='after'),both:count(r=>r.eligible&&r.order==='both')};
 }
 return result;
}
