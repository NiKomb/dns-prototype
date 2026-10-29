import {orderedEvents} from './report-model.js';
import {comparisonAttempt,comparisonSummary} from './comparison-research.js';
import {heartAttempt,heartSummary} from './heart-research.js';
export const isQaAttempt=session=>/^qa(?:[-_.]|$)/i.test(session.browser_id||'');
const choice=e=>e.event==='build.change'&&['add','replace'].includes(e.action)&&e.origin==='user';
const ref=e=>({event_id:e.event_id,at:e.at,page_view_id:e.page_view_id,tab_id:e.tab_id});
// One attempt and recorded order. Links describe chronology, never causation.
export function researchAttempt(session,events){
 const list=orderedEvents(events),offers=new Map(),intents=new Map(),tabs=new Map(),evidence=[],availability=[];
 const measured=list.some(e=>e.measurement_version===1);
 const full=list.some(e=>e.event==='session.start'&&e.measurement_version===1);
 let incomplete=list.some(e=>e.event==='delivery.gap'||e.method==='collection_resumed');
 for(const e of list){
  if(e.event==='session.complete')break;
  const tab=e.tab_id||'unknown';
  if(e.event==='evidence.available')availability.push({...ref(e),article_id:e.article_id,category_id:e.category_id,evidence_ids:e.evidence_ids,evidence_kinds:e.evidence_kinds,reason:e.reason,product_ids:e.product_ids});
  const evidenceAction=e.evidence_id&&((e.event==='ui.click'&&e.element_id!=='article.disclosure')||e.event==='article.disclosure'||e.event==='scroll.summary'&&e.container_id==='article.table'&&e.origin==='user');
  if(evidenceAction)evidence.push({...ref(e),article_id:e.article_id,category_id:e.category_id,product_ids:e.product_ids,evidence_id:e.evidence_id,evidence_kinds:e.evidence_kinds,source_id:e.source_id,action:e.element_id||'table.scroll',expanded:e.expanded,next_choice:null});
  if(e.event==='articles.offer'&&e.offer_id&&!offers.has(e.offer_id))offers.set(e.offer_id,{...ref(e),offer_id:e.offer_id,placement_id:e.placement_id,category_id:e.category_id,article_ids:e.article_ids||[],product_ids:e.product_ids,compatible:e.compatible,visible:[],opens:[],visits:[]});
  const offer=offers.get(e.offer_id);
  if(e.event==='articles.visible'&&offer?.article_ids.includes(e.article_id)&&!offer.visible.some(v=>v.article_id===e.article_id))offer.visible.push({...ref(e),article_id:e.article_id});
  if(e.event==='ui.click'&&e.element_id==='article.open'&&offer?.article_ids.includes(e.article_id))offer.opens.push({...ref(e),article_id:e.article_id});
  if(e.event==='navigation.intent'&&e.source_page==='configurator'&&offer?.article_ids.includes(e.article_id)&&e.destination_page==='article:'+e.article_id&&offer.opens.some(o=>o.tab_id===e.tab_id&&o.article_id===e.article_id&&o.at<=e.at))intents.set(e.navigation_id,e);
  if(e.event==='navigation.arrive'&&e.reason==='page'&&e.destination_page?.startsWith('article:')){
   const intent=intents.get(e.navigation_id);
   if(intent&&intent.tab_id===e.tab_id&&intent.destination_page===e.destination_page&&intent.offer_id===e.offer_id){
    const visit={...ref(e),navigation_id:e.navigation_id,article_id:e.destination_page.slice(8),category_id:intent.source_category,return:null,next_choice:null,time_by_page:{}};
    offers.get(intent.offer_id).visits.push(visit);tabs.set(tab,visit);intents.delete(e.navigation_id);
   }else tabs.delete(tab);
  }
  // A reload continues the same visit. A direct/unrelated article entry must
  // not inherit an earlier recommendation merely because its ID is identical.
  if(e.event==='page.view'&&e.page_id?.startsWith('article:')&&e.method!=='reload'&&e.method!=='collection_resumed')tabs.delete(tab);
  const visit=tabs.get(tab);
  if(visit&&e.event==='article.time'&&e.article_id===visit.article_id&&!visit.return){
   const old=visit.time_by_page[e.page_view_id]||{elapsed_ms:0,visible_ms:0};
   visit.time_by_page[e.page_view_id]={elapsed_ms:Math.max(old.elapsed_ms,e.elapsed_ms||0),visible_ms:Math.max(old.visible_ms,e.visible_ms||0)};
  }
  if(visit&&!visit.return&&e.event==='navigation.arrive'&&e.destination_page==='configurator'&&e.source_page==='article:'+visit.article_id)visit.return=ref(e);
  if(choice(e)){
   const next={...ref(e),category_id:e.category_id,product_id:e.product_id,previous_product_id:e.previous_product_id,action:e.action};
   for(const action of evidence)if(!action.next_choice&&action.tab_id===e.tab_id)action.next_choice={...next,same_category:action.category_id===e.category_id};
   if(visit?.return&&!visit.next_choice)visit.next_choice={...next,same_category:visit.category_id===e.category_id};
  }
 }
 const result=[...offers.values()];
 for(const offer of result)for(const visit of offer.visits){
  const times=Object.values(visit.time_by_page);visit.elapsed_ms=times.reduce((n,t)=>n+t.elapsed_ms,0);visit.visible_ms=times.reduce((n,t)=>n+t.visible_ms,0);
  visit.time_measured=times.length>0;delete visit.time_by_page;
 }
 const offered=result.some(o=>o.article_ids.length),opened=result.some(o=>o.opens.length),arrived=result.some(o=>o.visits.length),returned=result.some(o=>o.visits.some(v=>v.return)),changed=result.some(o=>o.visits.some(v=>v.next_choice));
 const fact={id:session.id,qa:isQaAttempt(session),coverage:!measured?'not_measured':full?'from_start':'partial',incomplete,
  H1:comparisonAttempt(events),
  H2:{status:availability.length?'measured':'not_measured',availability,actions:evidence,action:!!evidence.length,choice_after_action:evidence.some(a=>a.next_choice)},
  H3:{status:!result.length?'not_measured':!offered?'no_recommendations':!opened?'no_opening':!arrived?'opening_without_arrival':!returned?'arrival_without_return':!changed?'return_without_choice':'choice_after_return',offers:result,offered,visible:result.some(o=>o.visible.length),opened,arrived,returned,changed}};
 fact.heart=heartAttempt(session,events,fact);return fact;
}
export function researchSummary(sessions,events){
 const grouped=new Map(sessions.map(s=>[s.id,[]]));for(const e of events)grouped.get(e.session_id)?.push(e);
 return researchFactsSummary(sessions.map(s=>researchAttempt(s,grouped.get(s.id))));
}
export function researchFactsSummary(all){
 const facts=all.filter(f=>!f.qa);
 const count=fn=>facts.filter(fn).length;
 return {measurement_version:1,heart:heartSummary(all),attempts:facts.length,excluded_qa:all.length-facts.length,
  measured:count(f=>f.coverage!=='not_measured'),from_start:count(f=>f.coverage==='from_start'),partial:count(f=>f.coverage==='partial'),not_measured:count(f=>f.coverage==='not_measured'),incomplete:count(f=>f.incomplete),
  H1:comparisonSummary(facts),
  H2:{available:count(f=>f.H2.availability.some(a=>a.evidence_ids?.length)),action:count(f=>f.H2.action),choice_after_action:count(f=>f.H2.choice_after_action),choice_same_category:count(f=>f.H2.actions.some(a=>a.next_choice?.same_category))},
  H3:{evaluated:count(f=>f.H3.offers.length>0),no_recommendations:count(f=>f.H3.status==='no_recommendations'),offered:count(f=>f.H3.offered),visible:count(f=>f.H3.visible),opened:count(f=>f.H3.opened),arrived:count(f=>f.H3.arrived),returned:count(f=>f.H3.returned),choice_after_return:count(f=>f.H3.changed),
   choice_same_category:count(f=>f.H3.offers.some(o=>o.visits.some(v=>v.next_choice?.same_category))),arrival_without_choice:count(f=>f.H3.arrived&&!f.H3.changed),no_opening:count(f=>f.H3.status==='no_opening'),opening_without_arrival:count(f=>f.H3.status==='opening_without_arrival'),arrival_without_return:count(f=>f.H3.status==='arrival_without_return'),return_without_choice:count(f=>f.H3.status==='return_without_choice')},facts};
}
