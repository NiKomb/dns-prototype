import {orderedEvents} from '../telemetry/report-model.js';
import {isQaAttempt} from '../telemetry/research-model.js';
import {attemptEvents,recordingComplete} from './recording.js';

const categoryIds={cpu:'processor',motherboard:'board',powerSupply:'power',gpu:'gpu',case:'case'};
export const choiceCategoryNames={processor:'Процессоры',board:'Материнские платы',power:'Блоки питания',gpu:'Видеокарты',case:'Корпуса'};
export const median=values=>{const sorted=values.filter(Number.isFinite).sort((a,b)=>a-b),n=sorted.length;return n?(sorted[Math.floor((n-1)/2)]+sorted[Math.floor(n/2)])/2:null;};
const validId=id=>typeof id==='string'&&id.length>0&&id!=='unknown';
const pageArticle=page=>page?.startsWith('article:')?page.slice(8):null;
const reference=e=>({event_id:e.event_id,at:e.at,tab_id:e.tab_id,page_view_id:e.page_view_id});

// Read-only wall-clock chains. Offers and article timers are not prerequisites.
// A page view confirms an opening, but a return requires a recorded arrival
// from that article in the same tab. Missing observations never become zero.
export function articleChoiceAttempt(session,events,registry){
 const result={id:session.id,status:'insufficient',median_ms:null,chains:[],pending:[],issues:[],evaluation:{opened:false,complete:false}};
 if(isQaAttempt(session)){result.status='qa';return result;}
 const list=orderedEvents(events),articles=new Map(registry.map(a=>[a.articleId,a]));
 const active=new Map(),tabs=new Map(),seen=new Set(),openings=new Map(),tainted=new Set();
 const issue=text=>{if(!result.issues.includes(text))result.issues.push(text);};
 const allCategories=Object.keys(choiceCategoryNames);
 const disrupt=text=>{issue(text);for(const c of allCategories)tainted.add(c);for(const chain of active.values())chain.incomplete=true;};
 const completeStart=list.some(e=>e.event==='session.start'&&e.measurement_version===1&&Number.isFinite(e.at));
 if(!completeStart)disrupt('Нет полного начала измерения');
 // Combine the page view and its arrival without moving the first opening.
 // The registry validates recorded categories, including multi-topic articles.
 for(const e of list){
  if(e.event==='session.complete')break;
  const article=pageArticle(e.page_id);
  if(!article||!['page.view','navigation.arrive'].includes(e.event)||e.method==='collection_resumed'||e.event==='navigation.arrive'&&(e.reason!=='page'||e.destination_page!==e.page_id))continue;
  const key=JSON.stringify([e.tab_id,e.page_view_id]),p=openings.get(key)||{article,at:e.at,categories:[],invalid:false};
  if(p.article!==article)p.invalid=true;
  if(e.source_category)p.categories.push(e.source_category);
  if(e.category_id)p.categories.push(e.category_id);
  openings.set(key,p);
 }
 for(const e of list){
  if(e.event_id&&seen.has(e.event_id))continue;if(e.event_id)seen.add(e.event_id);
  if(e.event==='session.complete')break;
  if(e.event==='delivery.gap'||e.method==='collection_resumed'){disrupt('Есть разрыв измерения');continue;}
  const opening=pageArticle(e.page_id)&&['page.view','navigation.arrive'].includes(e.event)&&!(e.event==='navigation.arrive'&&(e.reason!=='page'||e.destination_page!==e.page_id));
  const returning=e.event==='navigation.arrive'&&e.page_id==='configurator'&&e.destination_page==='configurator'&&e.reason!=='modal';
  const selecting=e.event==='build.change'&&['add','replace'].includes(e.action);
  if(!opening&&!returning&&!selecting)continue;
  if(!Number.isFinite(e.at)||!validId(e.tab_id)||!validId(e.page_view_id)){disrupt('Нет времени или идентификаторов перехода');continue;}
  if(opening){
   const key=JSON.stringify([e.tab_id,e.page_view_id]),p=openings.get(key),article=articles.get(p?.article);
   const topics=[...new Set((article?.topicCategoryIds||[]).map(c=>categoryIds[c]).filter(Boolean))];
   const recorded=[...new Set(p?.categories||[])];
   const category=recorded.length===1?recorded[0]:topics.length===1?topics[0]:null;
   if(!p||p.invalid||!category||!topics.includes(category)||recorded.some(c=>c!==category)){
    disrupt('Категория статьи не подтверждена');tabs.delete(e.tab_id);continue;
   }
   const previous=tabs.get(e.tab_id);
   if(previous?.page_view_id===e.page_view_id)continue;
   let chain=active.get(category);
   if(!chain){chain={category_id:category,start:reference(e),article_id:p.article,returns:new Map(),confirmed_return:false,incomplete:tainted.has(category)};active.set(category,chain);}
   chain.returns.delete(e.tab_id);
   tabs.set(e.tab_id,{article_id:p.article,category_id:category,page_view_id:e.page_view_id});
  }
  if(returning){
   const visit=tabs.get(e.tab_id),chain=active.get(visit?.category_id);
   if(!visit||e.source_page!=='article:'+visit.article_id){
    if(!visit&&pageArticle(e.source_page))disrupt('Нет подтверждённого открытия перед возвратом');
    if(visit){issue('Возврат из статьи не подтверждён');if(chain)chain.incomplete=true;}continue;
   }
   if(chain){chain.returns.set(e.tab_id,reference(e));chain.confirmed_return=true;}
   tabs.delete(e.tab_id);
  }
  if(selecting){
   if(!allCategories.includes(e.category_id)){disrupt('Категория выбора не записана');continue;}
   const chain=active.get(e.category_id);
   if(e.origin!=='user'){
    if(chain){chain.incomplete=true;issue('Происхождение выбора не подтверждено');}continue;
   }
   if(chain){
    // The metric is per session/category. Return identity is checked within
    // its tab; a subsequent user choice may come from another configurator tab.
    const returned=[...chain.returns.values()].filter(r=>r.at<=e.at).sort((a,b)=>a.at-b.at)[0];
    if(!chain.incomplete&&returned&&returned.at>=chain.start.at&&e.at>=returned.at&&e.page_id==='configurator'&&validId(e.product_id)){
     result.chains.push({category_id:e.category_id,article_id:chain.article_id,duration_ms:e.at-chain.start.at});
    }else issue('Неполная цепочка до выбора');
    active.delete(e.category_id);
   }
   tainted.delete(e.category_id);
  }
 }
 for(const chain of active.values()){
  const returned=chain.confirmed_return;
  result.pending.push({category_id:chain.category_id,status:chain.incomplete?'insufficient':returned?'no_choice':'no_return'});
  if(chain.incomplete)issue('Неполная цепочка без выбора');
 }
 result.median_ms=median(result.chains.map(c=>c.duration_ms));
 result.status=result.chains.length?'measured':result.issues.length?'insufficient':result.pending.some(c=>c.status==='no_choice')?'no_choice':result.pending.length?'no_return':'no_articles';
 const recorded=attemptEvents(events);
 result.evaluation.opened=recorded.some(e=>Number.isFinite(e.at)&&validId(e.tab_id)&&validId(e.page_view_id)&&pageArticle(e.page_id)&&
  (e.event==='page.view'&&e.method!=='collection_resumed'||e.event==='navigation.arrive'&&e.reason==='page'&&e.destination_page===e.page_id));
 result.evaluation.complete=recordingComplete(recorded)&&!result.issues.length&&!recorded.some(e=>
  e.event==='build.change'&&['add','replace'].includes(e.action)&&(!allCategories.includes(e.category_id)||!validId(e.product_id)||!['user','programmatic'].includes(e.origin)));
 return result;
}

export function articleChoiceSummary(attempts){
 const research=attempts.filter(a=>a.status!=='qa'),values=research.map(a=>a.median_ms).filter(Number.isFinite);
 return {median_ms:median(values),samples:values.length,attempts:research.length,
  no_choice:research.filter(a=>a.status==='no_choice').length,insufficient:research.filter(a=>a.status==='insufficient').length};
}

export function articleSelectionSummary(attempts){
 const eligible=attempts.filter(a=>a.status!=='qa'&&a.evaluation?.opened&&a.evaluation.complete);
 const selected=eligible.filter(a=>a.chains.length>0).length,denominator=eligible.length;
 return {selected,eligible:denominator,percent:denominator?Math.round(selected/denominator*100):null};
}
export const articleSelectionValue=summary=>summary?.eligible>0?`${summary.selected} из ${summary.eligible} · ${summary.percent}%`:'Нет данных';
