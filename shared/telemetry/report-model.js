// Shared, read-only interpretation of recorded events for the API and dashboard.
const categories=['processor','board','power','case','gpu'];
const names={processor:'Процессоры',board:'Материнские платы',power:'Блоки питания',case:'Корпуса',gpu:'Видеокарты'};
const actions={add:'Добавил товар',replace:'Заменил товар',remove:'Удалил товар',clear:'Очистил сборку'};
export const recordedEvent=e=>({...e,...e.data});
export const orderedEvents=events=>events.map(recordedEvent).sort((a,b)=>(a.at??0)-(b.at??0)||(a.sequence??0)-(b.sequence??0));
export function recordedBuild(value){
 if(typeof value==='string'){try{value=JSON.parse(value);}catch{return null;}}
 return value&&typeof value==='object'&&!Array.isArray(value)?value:null;
}
export function attemptOutcome(events){
 let build=null,saved=false,savedAt=null;
 for(const e of orderedEvents(events)){
  const snapshot=recordedBuild(e.build);if(snapshot)build=snapshot;
  if(e.event==='session.complete'){saved=true;savedAt=e.at;break;}
 }
 const build_count=build?categories.filter(key=>build[key]?.id).length:null;
 const completed=saved&&build_count===5;
 return {build,build_count,saved,saved_at:savedAt,completed,
  outcome:completed?'complete':build_count===null?'unknown':build_count<3?'incomplete':build_count===5?'ready':'partial'};
}
export function outcomeLabel(fact={}){
 return ({complete:'Завершил: 5 деталей и сохранение',incomplete:'Не завершил: меньше 3 деталей',partial:'Частичная сборка: '+fact.build_count+' из 5',ready:'5 деталей без сохранения',unknown:'Состояние сборки неизвестно'})[fact.outcome]||'Состояние сборки неизвестно';
}
export function routeStages(events,startedAt=0){
 const stages=[];
 for(const e of orderedEvents(events)){
  if(e.event==='page.view'&&e.method==='collection_resumed')continue;
  const label=e.event==='page.view'?(e.page_id==='configurator'?'Конфигуратор':'Статья'):e.event==='modal.open'?'Выбор: '+(names[e.category_id]||'товар'):e.event==='build.change'?actions[e.action]:e.event==='session.complete'?'Сохранил сборку':null;
  if(label&&stages.at(-1)?.label!==label)stages.push({label,at:e.at});
  if(e.event==='session.complete')break;
 }
 return stages.map((stage,i)=>({...stage,elapsed_ms:Math.max(0,stage.at-startedAt),duration_ms:stages[i+1]?Math.max(0,stages[i+1].at-stage.at):null}));
}
export function targetArticleIds(articles){
 return new Set(articles.filter(a=>!a.alwaysInModalCategoryIds?.length&&(a.relations?.length||a.characteristicRelations?.length)).map(a=>a.articleId));
}
// A review signal, not a diagnosis. General guides and unknown/direct entries
// do not count; browser tabs are kept separate and progress resets the streak.
export function quickReturns(events,targetArticles){
 const tabs=new Map();let revision=0,streak=0,maximum=0;const evidence=[];
 for(const e of orderedEvents(events)){
  if(e.event==='session.complete')break;
  if(e.event==='build.change'&&['add','replace'].includes(e.action)){revision++;streak=0;}
  if(e.event!=='page.view'||e.method==='collection_resumed')continue;
  const key=e.tab_id||'unknown',tab=tabs.get(key)||{page:null,article:null};
  if(e.page_id==='configurator'){
   const visit=tab.article;
   if(visit&&visit.revision===revision&&e.at>=visit.at&&e.at-visit.at<=7000){
    streak++;maximum=Math.max(maximum,streak);evidence.push({article_id:visit.id,return_at:e.at,duration_ms:e.at-visit.at});
   }
   tab.article=null;
  }else if(e.page_id?.startsWith('article:')&&e.method!=='reload'){
   const id=e.page_id.slice(8);
   tab.article=tab.page==='configurator'&&targetArticles.has(id)&&['link','panel','browser_history'].includes(e.method)?{id,at:e.at,revision}:null;
  }
  tab.page=e.page_id;tabs.set(key,tab);
 }
 return {quick_returns:maximum,wandering:maximum>=3,quick_return_evidence:evidence};
}
