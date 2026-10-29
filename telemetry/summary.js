import {elementNames,categoryNames} from '../shared/telemetry/registry.js';
import {attemptOutcome,routeStages,quickReturns} from '../shared/telemetry/report-model.js';
// Counts describe the selected attempts, never inferred task success or attention.
export function summarize(sessions,events){
 const bySession=new Map(sessions.map(s=>[s.id,[]]));for(const e of events)bySession.get(e.session_id)?.push(e);
 const stages=['Начали задание','Открыли выбор товара','Открыли статью','Вернулись в конфигуратор','Выбрали / заменили товар','Сохранили все 5 деталей'];
 const funnel=stages.map(label=>({label,count:0})),clicks=new Map(),routes=new Map();let completed=0,totalClicks=0,assembled=0,articleTransitions=0,articleAttempts=0;
 const depths=new Map(['article.page','configurator.page','modal.filters','modal.results'].map(id=>[id,[]]));
 for(const list of bySession.values()){
  list.sort((a,b)=>a.at-b.at||a.sequence-b.sequence);const outcome=attemptOutcome(list);let stage=-1;const path=[];let ready=false,visited=false;const maxima=new Map();
  for(const e of list){
   if(e.event==='page.view'&&e.method==='collection_resumed')continue;
   if(e.event==='page.view'&&e.page_id.startsWith('article:')&&['link','panel','browser_history'].includes(e.method)){articleTransitions++;visited=true;}
   let build=e.build;if(typeof build==='string'){try{build=JSON.parse(build);}catch{build=null;}}
   if(build&&['processor','board','power','case','gpu'].every(key=>build[key]?.id))ready=true;
   if(e.event==='scroll.summary'&&e.origin==='user'&&depths.has(e.container_id)&&typeof e.depth_pct==='number'&&e.depth_pct>=0&&e.depth_pct<=100)maxima.set(e.container_id,Math.max(maxima.get(e.container_id)??0,e.depth_pct));
   if(e.event==='session.start'&&stage===-1)stage=0;
   else if(e.event==='modal.open'&&stage===0)stage=1;
   else if(e.event==='page.view'&&e.page_id.startsWith('article:')&&stage===1)stage=2;
   else if(e.event==='page.view'&&e.page_id==='configurator'&&stage===2)stage=3;
   else if(e.event==='build.change'&&['add','replace'].includes(e.action)&&stage===3)stage=4;
   else if(e.event==='session.complete'&&stage===4&&outcome.completed)stage=5;
   if(e.event==='ui.click'){totalClicks++;const key=e.element_id||'unknown';const item=clicks.get(key)||{id:key,label:elementNames[key]||key,count:0,sessions:new Set()};item.count++;item.sessions.add(e.session_id);clicks.set(key,item);}
   const step=e.event==='modal.open'?'Выбор: '+(categoryNames[e.category_id]||'товар'):e.event==='page.view'?(e.page_id==='configurator'?'Конфигуратор':'Статья'):e.event==='build.change'?({add:'Добавил товар',replace:'Заменил товар',remove:'Удалил товар',clear:'Очистил сборку'})[e.action]:e.event==='session.complete'?'Сохранил сборку':null;
   if(step&&path.at(-1)!==step)path.push(step);
   if(e.event==='session.complete'){if(outcome.completed)completed++;break;}
  }
  if(ready)assembled++;if(visited)articleAttempts++;for(const [id,value]of maxima)depths.get(id).push(value);
  for(let i=0;i<=stage;i++)funnel[i].count++;
  if(path.length){const full=path.join(' → ');routes.set(full,(routes.get(full)||0)+1);}
 }
 return {attempts:sessions.length,completed,totalClicks,assembled,articleTransitions,articleAttempts,
  scroll:[...depths].map(([id,values])=>{values.sort((a,b)=>a-b);const n=values.length;return {id,samples:n,depth:n?(values[Math.floor((n-1)/2)]+values[Math.floor(n/2)])/2:null};}),funnel,
  clicks:[...clicks.values()].sort((a,b)=>b.count-a.count).map(x=>({...x,sessions:x.sessions.size})),
  routes:[...routes].sort((a,b)=>b[1]-a[1]).map(([label,count])=>({label,count}))};
}

// Ordered cohorts use recorded transitions, including repeated visits. They do not
// equate absence of an event with leaving the website or a usability problem.
export function paths(sessions, events, targetArticles=new Set()) {
 const groups=new Map(sessions.map(s=>[s.id,[]]));
 for(const e of events)groups.get(e.session_id)?.push(e);
 const facts=sessions.map(s=>{
  const list=groups.get(s.id).sort((a,b)=>a.at-b.at||a.sequence-b.sequence);
  const {build,...outcome}=attemptOutcome(list);
  let read=false,returned=false,changed=false,modal=false,selected=false,completed=outcome.completed,completeAt=null;
  const route=[];
  for(const e of list){
   if(e.event==='page.view'&&e.method==='collection_resumed')continue;
   if(e.event==='page.view'&&e.page_id.startsWith('article:'))read=true;
   if(read&&e.event==='page.view'&&e.page_id==='configurator')returned=true;
   if(e.event==='modal.open')modal=true;
   if(e.event==='build.change'&&['add','replace'].includes(e.action)){
    if(returned)changed=true;if(modal)selected=true;
   }
   const label=e.event==='modal.open'?'Выбор: '+(categoryNames[e.category_id]||'товар'):e.event==='page.view'?(e.page_id==='configurator'?'Конфигуратор':'Статья'):e.event==='build.change'?({add:'Добавил товар',replace:'Заменил товар',remove:'Удалил товар',clear:'Очистил сборку'})[e.action]:e.event==='session.complete'?'Сохранил сборку':null;
   if(label&&route.at(-1)!==label)route.push(label);
   if(e.event==='session.complete'){if(completed)completeAt=e.at;break;}
  }
  return {id:s.id,has_events:list.length>0,read,returned,changed,...outcome,...quickReturns(list,targetArticles),complete_ms:completeAt==null?null:Math.max(0,completeAt-s.started_at),route:route.join(' → '),route_stages:routeStages(list,s.started_at),stage:read?(completed&&changed?3:changed?2:returned?1:0):(completed&&selected?3:selected?2:modal?1:0)};
 });
 return pathsFromFacts(facts);
}
export function pathsFromFacts(facts){
 const cohorts=['with','without'].map(id=>{
  const members=facts.filter(f=>f.has_events&&f.read===(id==='with'));
  const labels=id==='with'?['Открыли статью','Вернулись в конфигуратор','Добавили / заменили после возврата','Сохранили все 5 деталей']:['Открыли конфигуратор','Открыли выбор товара','Добавили / заменили товар','Сохранили все 5 деталей'];
  return {id,total:members.length,stages:labels.map((label,i)=>({label,count:members.filter(f=>f.stage>=i).length}))};
 });
 const durations=facts.filter(f=>f.complete_ms!=null).map(f=>f.complete_ms).sort((a,b)=>a-b),n=durations.length;
 return {facts,cohorts,missing:facts.filter(f=>!f.has_events).length,median_complete_ms:n?(durations[Math.floor((n-1)/2)]+durations[Math.floor(n/2)])/2:null,completed_samples:n};
}
