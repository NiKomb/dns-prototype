import {attemptEvents,recordingComplete,validRecordId} from './recording.js';
import {journalAttemptState} from './attempt-state.js';
import {isQaAttempt} from '../telemetry/research-model.js';
import {comparisonAttempt} from '../telemetry/comparison-research.js';
import {categories} from '../telemetry/registry.js';
import {recordedBuild} from '../telemetry/report-model.js';

export const overviewStages=[['started','Начали'],['selected','Выбрали хотя бы одну деталь'],['assembled','Собрали пять деталей'],['saved_full','Сохранили полную сборку']];

// Positive observations through the first save. Missing records are not refusals.
export function overviewAttempt(session,events,research){
 const list=attemptEvents(events),state=journalAttemptState(list);let lastBuild=null;
 const gaps=research?.H1?.incomplete??comparisonAttempt(events).incomplete;
 let buildIncomplete=state.build_count===null;
 const save=list.find(e=>e.event==='session.complete');
 const stages={started:list.some(e=>e.event==='session.start'&&Number.isFinite(e.at)),selected:false,assembled:false,saved_full:state.status==='completed'&&Number.isFinite(save?.at)};
 for(const e of list){
  if(e.event==='delivery.gap'||e.method==='collection_resumed')lastBuild=null;
  if(!['build.snapshot','build.change','session.complete'].includes(e.event))continue;
  if(Object.hasOwn(e,'build'))lastBuild=recordedBuild(e.build);else if(e.event==='build.change')lastBuild=null;
  const count=journalAttemptState([e]).build_count;
  if(count===null&&(e.event!=='session.complete'||Object.hasOwn(e,'build')))buildIncomplete=true;
  if(!Number.isFinite(e.at))continue;
  if(count>0||e.event==='build.change'&&['add','replace'].includes(e.action)&&categories.includes(e.category_id)&&validRecordId(e.product_id))stages.selected=true;
  if(count===5)stages.assembled=true;
 }
 const sufficient=recordingComplete(list)&&!gaps&&!buildIncomplete;
 return {id:session.id,started_at:session.started_at??null,qa:isQaAttempt(session),stages,sufficient,gaps,build:state,selected_categories:categories.filter(c=>validRecordId(lastBuild?.[c]?.id))};
}

export function overviewSummary(records,research){
 const known=new Map((research?.facts||[]).map(f=>[f.id,f]));
 const grouped=new Map();for(const r of records){const old=grouped.get(r.session.id);if(old)old.events.push(...r.events);else grouped.set(r.session.id,{session:r.session,events:[...r.events]});}
 const all=[...grouped.values()].map(r=>overviewAttempt(r.session,r.events,known.get(r.session.id))),attempts=all.filter(a=>!a.qa);
 const completed=attempts.filter(a=>a.stages.saved_full).length;
 return {attempts:attempts.length,completed,completed_percent:attempts.length?completed/attempts.length*100:null,
  excluded_qa:all.length-attempts.length,gaps:attempts.filter(a=>a.gaps).length,insufficient:attempts.filter(a=>!a.sufficient).length,
  stages:overviewStages.map(([id,label])=>({id,label,count:attempts.filter(a=>a.stages[id]).length,unknown:attempts.filter(a=>!a.stages[id]&&!a.sufficient).length})),
  facts:all};
}

// Present existing research facts; no event replay or new measurement rules.
export function overviewActivity(fact){
 const h1=fact?.H1,visits=fact?.heart?.visits;
 const complete=fact?.coverage==='from_start'&&!fact.incomplete;
 const comparisonKnown=complete&&h1&&!['not_measured','partial','incomplete'].includes(h1.status);
 const compared=h1?.table_2plus===true;
 const products=h1?.table_reached?.product_ids?.length;
 let comparison=compared?`Открыли таблицу${products?' · товаров: '+products:' с двумя и более товарами'}`:
  h1?.first_action?.action==='add'?'Добавили товар; таблица с двумя товарами не зафиксирована':
  h1?.first_action?.action==='open'?'Открыли таблицу; два товара не зафиксированы':
  comparisonKnown?'Действий не записано':'Недостаточно данных';
 if(!comparisonKnown&&(compared||h1?.first_action))comparison+=' · запись неполная';
 const unique=rows=>new Set(rows.map(v=>v.article_id)).size;
 const opened=Array.isArray(visits)?unique(visits):0,viewed=Array.isArray(visits)?unique(visits.filter(v=>v.status==='viewed')):0;
 const articlesKnown=complete&&Array.isArray(visits)&&!visits.some(v=>v.status==='unknown');
 let articles=opened?viewed?`Просмотрели: ${viewed}`:`Открыли: ${opened} · просмотр не зафиксирован`:articlesKnown?'Действий не записано':'Недостаточно данных';
 if(viewed&&opened>viewed)articles+=` · открыли: ${opened}`;
 if(visits?.some(v=>v.direct_choice))articles+=' · после возврата выбрали деталь';
 if(opened&&!articlesKnown)articles+=' · запись неполная';
 return {compared,comparisonKnown,comparison,opened,viewed,articlesKnown,articles};
}
export function overviewActivitySummary(facts,runs){
 const known=new Map(facts.map(f=>[f.id,f]));
 const rows=runs.filter(s=>!isQaAttempt(s)).map(s=>overviewActivity(known.get(s.id)));
 return [['articles','Просмотрели статью','viewed','articlesKnown'],['comparison','Открыли сравнение с 2+ товарами','compared','comparisonKnown']].map(([id,label,positive,certain])=>{
  const count=rows.filter(r=>!!r[positive]).length,unknown=rows.filter(r=>!r[positive]&&!r[certain]).length;
  return {id,label,count:rows.length>0&&unknown===rows.length?null:count,unknown};
 });
}
export function overviewObservations(session){
 const activity=session.activity;
 return [['Сравнение',activity?.comparison||'Недостаточно данных'],['Статьи',activity?.articles||'Недостаточно данных']];
}
