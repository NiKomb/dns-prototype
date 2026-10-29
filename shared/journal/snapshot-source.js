import {apiFetch} from '../telemetry/hosting.js';

export const snapshotURL = new URL('./snapshot.json', import.meta.url);
const reply = (value, status=200) => new Response(JSON.stringify(value), {status, headers:{'Content-Type':'application/json'}});

export function validateSnapshot(value) {
 if(value?.format!==1 || !Number.isFinite(value.created_at) || !value.current_task)throw Error('Неподдерживаемый снимок журнала');
 for(const key of ['sessions','events','attempt_results','report_results','report_pages','collection_changes','versions'])if(!Array.isArray(value[key]))throw Error('Неполный снимок: '+key);
 for(const key of ['sessions','events','attempt_results','report_results','report_pages'])if(value.counts?.[key]!==value[key].length)throw Error('Неполный снимок: '+key);
 const ids=new Set(value.sessions.map(s=>s.id));
 if(ids.size!==value.sessions.length || new Set(value.events.map(e=>e.event_id)).size!==value.events.length || value.events.some(e=>!ids.has(e.session_id)))throw Error('Нарушена история снимка');
 for(const saved of value.report_results){
  if(!saved.payload?.summary || !Array.isArray(saved.payload.list))throw Error('Неполный сохранённый расчёт');
  const generation=saved.payload.generation;
  if(generation && !value.report_pages.some(p=>p.scope===saved.scope && p.generation===generation))throw Error('Нет страниц сохранённого расчёта');
 }
 if(!value.report_results.some(r=>r.scope===value.current_task && r.slot==='current'))throw Error('Нет сохранённой сводки текущего сценария');
 return value;
}

// A source is selected once per opening/explicit refresh. Navigation, detail
// reads and exports keep that choice, even when connectivity changes.
export function createJournalSource({request=apiFetch, snapshot=()=>fetch(snapshotURL,{cache:'no-store'}), timeout=6000}={}) {
 let selected=null, selection, saved,epoch=0;
 async function readSnapshot(){
  const response=await snapshot();if(!response.ok)throw Error('Не удалось загрузить автономный снимок ('+response.status+')');
  return validateSnapshot(await response.json());
 }
 async function timed(path, options){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{const response=await request(path,{...options,signal:controller.signal});await response.clone().text();return response;}finally{clearTimeout(timer);}
 }
 async function choose(path,options){
  const ticket=epoch;
  try{
   const response=await timed(path,options);
   if(response.status>=500 || [408,429].includes(response.status))throw Error('Worker недоступен');
   if(ticket!==epoch)throw Error('Загрузка отменена');
   selected='worker';return response;
  }catch(error){if(ticket!==epoch)throw error;const value=await readSnapshot();if(ticket!==epoch)throw Error('Загрузка отменена');saved=value;selected='snapshot';return offline(path);}
 }
 function offline(path){
  const url=new URL(path,'https://journal.invalid'),task=url.searchParams.get('task')||saved.current_task,scope=task==='all'?'*':task;
  if(url.pathname==='/api/collection')return reply(saved.control);
  if(url.pathname==='/api/results' || url.pathname==='/api/results/summary'){
   const report=saved.report_results.find(r=>r.scope===scope && r.slot==='current');
   if(!report)return reply({error:'Нет сохранённого расчёта сценария'},404);
   if(url.pathname==='/api/results')return reply(saved.sessions.filter(s=>scope==='*'||s.task_version===task).slice(0,500));
   return reply({...report.payload.summary,versions:saved.versions,review:saved.reviews.find(r=>r.task_version===task)||{target:null,verdict:'review'},participation:saved.sessions.filter(s=>scope==='*'||s.task_version===task).slice(0,500),cache:{stale:false},...(report.payload.generation?{facts_generation:report.payload.generation}:{})});
  }
  if(url.pathname==='/api/results/facts'){
   const generation=url.searchParams.get('generation'),after=Number(url.searchParams.get('after')??-1);
   if(!saved.report_results.some(r=>r.scope===scope&&r.payload.generation===generation))return reply({error:'generation'},410);
   // The existing reader accepts full facts for the overview as well. Keeping
   // the original saved rows avoids another projection/calculation algorithm.
   const page=saved.report_pages.filter(p=>p.scope===scope&&p.generation===generation&&p.position>after).sort((a,b)=>a.position-b.position)[0];
   return reply({facts:page?.payload||[],next:page?.position??null});
  }
  const id=decodeURIComponent(url.pathname.slice('/api/results/'.length)),session=saved.sessions.find(s=>s.id===id);
  if(!url.pathname.startsWith('/api/results/')||!session)return reply({error:'not found'},404);
  const events=saved.events.filter(e=>e.session_id===id),result=saved.attempt_results.find(r=>r.session_id===id&&r.slot==='current');
  const end=events.find(e=>e.event==='session.complete')?.at??saved.created_at;
  return reply({session,events,collection_changes:saved.collection_changes.filter(c=>c.at>=session.started_at&&c.at<=end),research:result?.payload.research??null,next:null});
 }
 return {
  get readOnly(){return selected==='snapshot';},
  get message(){return selected==='snapshot'?`Автономный просмотр. Снимок от ${new Date(saved.created_at).toLocaleString('ru-RU',{timeZone:'Asia/Yekaterinburg'})} (Екатеринбург). Запись на сервер отключена. Для проверки связи нажмите «Обновить».`:selected==='worker'?'Источник: Worker. Актуальный журнал.':'';},
  reset(){++epoch;selected=null;selection=null;saved=null;},
  async fetch(path,options={}){
   const write=!['GET','HEAD'].includes((options.method||'GET').toUpperCase());
   if(!selected){
    if(write)return reply({error:'Сначала откройте журнал'},405);
    if(!selection){const attempt=selection=choose(path,options);try{return await attempt;}finally{if(selection===attempt&&!selected)selection=null;}}
    await selection;
   }
   if(selected==='snapshot')return write?reply({error:'Автономный просмотр: запись отключена'},405):offline(path);
   return request(path,options);
  }
 };
}
