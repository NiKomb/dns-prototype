import {articleChoiceAttempt} from './article-choice.js';
import {journalAttemptState} from './attempt-state.js';
import {orderedEvents} from '../telemetry/report-model.js';
import {isQaAttempt,researchAttempt} from '../telemetry/research-model.js';
// Existing read-only journal calculation, preserved without changing its rules.
export function researchStats(summary){
 const r=summary.research,ids=new Set((r?.facts||[]).map(f=>f.id)),facts=(summary.facts||[]).filter(f=>ids.has(f.id));
 const times=facts.filter(f=>f.complete_ms!=null).map(f=>f.complete_ms).sort((a,b)=>a-b),n=times.length;
 return {attempts:r?.attempts??0,completed:facts.filter(f=>f.completed).length,assembled:facts.filter(f=>f.build_count===5).length,
  median_complete_ms:n?(times[Math.floor((n-1)/2)]+times[Math.floor(n/2)])/2:null,completed_samples:n,article_choice:summary.article_choice??{median_ms:null,samples:0},article_selection:summary.article_selection??{selected:0,eligible:0,percent:null}};
}

// The receiver stores cumulative visible time per visit. Never sum timer updates.
export function articleSessionMedians(records,task){
 const totals=new Map();
 for(const {session,events} of records){
  if(isQaAttempt(session)||task!=='all'&&session.task_version!==task)continue;
  const visits=new Map();
  for(const e of events){
   if(e.event!=='article.time'||!e.page_view_id)continue;
   const article=e.page_id?.startsWith('article:')?e.page_id.slice(8):e.data?.article_id;
   const value=e.data?.visible_ms;
   if(!article||typeof value!=='number'||!Number.isFinite(value)||value<0)continue;
   const key=JSON.stringify([article,e.tab_id||e.data?.tab_id||'',e.page_view_id]);
   const previous=visits.get(key);visits.set(key,{article,value:Math.max(previous?.value??0,value)});
  }
  const sums=new Map();for(const {article,value} of visits.values())sums.set(article,(sums.get(article)??0)+value);
  for(const [article,value] of sums){let sessions=totals.get(article);if(!sessions)totals.set(article,sessions=new Map());sessions.set(session.id,value);}
 }
 return new Map([...totals].map(([article,sessions])=>{const values=[...sessions.values()].sort((a,b)=>a-b),n=values.length;return [article,{median_ms:(values[Math.floor((n-1)/2)]+values[Math.floor(n/2)])/2,samples:n}];}));
}


// Compact list data and full details share the same visit interpretation.
export function articleVisitFacts(events,research){
 const pages=new Map();
 for(const e of events){const id=e.page_id?.startsWith('article:')?e.page_id.slice(8):e.event==='article.time'?e.data.article_id:null;if(!id||!e.page_view_id||e.data.method==='collection_resumed')continue;const key=(e.tab_id||'')+':'+e.page_view_id;let p=pages.get(key);if(!p){p={article_id:id,elapsed:null,depth:null,at:e.at,page_view_id:e.page_view_id};pages.set(key,p);}if(e.event==='article.time'&&Number.isFinite(e.data.elapsed_ms))p.elapsed=Math.max(p.elapsed??0,e.data.elapsed_ms);if(e.event==='scroll.summary'&&e.data.container_id==='article.page'&&e.data.origin==='user'&&Number.isFinite(e.data.depth_pct))p.depth=Math.max(p.depth??0,e.data.depth_pct);}
 const visits=research?.H3?.offers.flatMap(o=>o.visits)||[];
 return [...pages.values()].sort((a,b)=>a.at-b.at).map(p=>{const linked=research?.heart?.visits.find(v=>v.article_id===p.article_id&&v.page_view_id===p.page_view_id);return {...p,after:linked?.order?({before:'После просмотра',after:'До просмотра',both:'Оба пути'}[linked.order]):linked?.other_category?'Другая категория':linked?.status==='unknown'?'Связь не измерена':'Выбор не зарегистрирован'};});
}
// elapsed_ms on session.complete belongs to the current page, not the session.
export function savedAttemptDuration(session,events){const saved=events.find(e=>e.event==='session.complete');return saved&&Number.isFinite(saved.at)&&Number.isFinite(session.started_at)&&saved.at>=session.started_at?saved.at-session.started_at:null;}
export function sessionListFacts(records,research,registry=[]){
 const known=new Map(research.facts.map(f=>[f.id,f]));
 return records.map(({session,events})=>{
  const ordered=orderedEvents(events),observations=known.get(session.id)||researchAttempt(session,events);
  return {id:session.id,attempt_state:journalAttemptState(events),article_choice:articleChoiceAttempt(session,events,registry),duration_ms:savedAttemptDuration(session,ordered),device:ordered.find(e=>e.event==='session.start')?.data.device??null,visits:articleVisitFacts(ordered,observations).map(({article_id,elapsed,depth,after})=>({article_id,elapsed,depth,after})),visitsMeasured:ordered.some(e=>e.event==='session.start'),h2:{available:observations.H2.availability.some(a=>a.evidence_ids?.length)||false,action:observations.H2.action||false,choice:observations.H2.choice_after_action||false}};
 });
}
