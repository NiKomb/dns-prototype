import {apiFetch as fetch} from '../shared/telemetry/hosting.js';
import {comparisonActionNames as comparisonActions,comparisonPlacementNames as comparisonPlaces} from '../shared/journal/comparison-labels.js';
import {mountJournal,loading} from '../shared/journal/views.js';
import {journalModel,detailModel} from '../shared/journal/real-model.js';
import {node as el,button,field,empty,refreshButton,systemStatus} from '../shared/journal/components.js';
import {elementNames,eventNames,category} from '../shared/telemetry/registry.js';
import {initializeJournalTheme} from '../shared/journal/theme.js';
const $=s=>document.querySelector(s),root=document.body;
root.classList.add('approved-journal');
initializeJournalTheme(root,null,'dns-report-theme');
$('#page-title').after(systemStatus($('#status')));
const url=new URL(location.href),sections=['overview','hypotheses','scenarios','sessions'];
const state={section:url.searchParams.has('run')?'sessions':sections.includes(url.hash.slice(1))?url.hash.slice(1):'overview',task:url.searchParams.get('task')||'',purpose:['qa','all'].includes(url.searchParams.get('purpose'))?url.searchParams.get('purpose'):'respondent'};
let aggregate,data,runs=[],control,current,ui,version=0,factsVersion=0,model;
const cache=new Map(),pending=new Map();let cacheEpoch=0;
function clearDetails(){cacheEpoch++;cache.clear();pending.clear();}
const duration=n=>Number.isFinite(n)?`${Math.floor(Math.max(0,n)/60000)}:${String(Math.floor(Math.max(0,n)/1000)%60).padStart(2,'0')}`:'—';
async function prepareInBrowser(job,epoch){
 const checkpoint=async()=>{while(document.hidden)await new Promise(resolve=>document.addEventListener('visibilitychange',resolve,{once:true}));if(epoch!==version)throw Error('Загрузка отменена');};
 let attempt,overview,report;
 try{
  attempt=await import('./attempt-results.js');
  overview=job.extra?await import('../shared/journal/overview-model.js'):undefined;
  report=await import('../shared/telemetry/report-model.js');
 }catch(cause){
  const error=new Error('Не удалось загрузить журнал. Повторите загрузку страницы.',{cause});
  error.journalModuleFailure=true;throw error;
 }
 const {attemptResult,prepareRecorded,aggregateInput}=attempt,extra=overview?.overviewSummary,{targetArticleIds}=report;
 let after=0;const events=[];
 do{await checkpoint();const r=await fetch('/api/results/preparation?id='+encodeURIComponent(job.session.id)+'&revision='+job.revision+'&after='+after,{cache:'no-store'});if(r.status===409)return false;if(!r.ok)throw Error('Не удалось подготовить попытку');const page=await r.json();events.push(...page.events);after=page.after;}while(after!==null);
 await checkpoint();events.sort((a,b)=>a.at-b.at||a.sequence-b.sequence);
 const registry=typeof catalogArticles==='undefined'?[]:catalogArticles;
 const value=attemptResult(job.session,prepareRecorded(events),registry,targetArticleIds(registry),extra,events),texts={payload:JSON.stringify(value),input:JSON.stringify(aggregateInput(value))},parts={};
 for(const [kind,text]of Object.entries(texts)){
  // UTF-16 boundaries are rejoined before JSON parsing in D1. This small
  // character limit also bounds UTF-8 and the escaped request envelope.
  const chunks=[];for(let start=0;start<text.length;){let end=Math.min(text.length,start+6000);if(end<text.length&&/[\uD800-\uDBFF]/.test(text[end-1]))end--;chunks.push(text.slice(start,end));start=end;}
  parts[kind+'_parts']=chunks.length;
  if(chunks.length>256)throw Error('Расчёт попытки слишком большой');
  for(let part=0;part<chunks.length;part++){await checkpoint();const r=await fetch('/api/results/preparation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:job.session.id,revision:job.revision,algorithm:job.algorithm,kind,part,chunk:chunks[part]})});if(r.status===409)return false;if(!r.ok)throw Error('Не удалось сохранить расчёт');}
 }
 await checkpoint();const r=await fetch('/api/results/preparation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:job.session.id,revision:job.revision,algorithm:job.algorithm,finish:true,...parts})});if(!r.ok&&r.status!==409)throw Error('Не удалось завершить расчёт');return r.status!==409;
}
// Compact overview and full detail facts always belong to the same saved
// generation. Hydrate a copy so a failed/cancelled request keeps the shown model.
async function readFacts(value,compact=false,active){
 const epoch=version,isCurrent=active||(()=>epoch===version);
 const result={...value,facts:[],layout_facts:[],session_observations:[],research:{...value.research,facts:[]},...(value.overview?{overview:{...value.overview,facts:[]}}:{})};
 const task=value.task||'all';let after=-1;
 do{if(!isCurrent())throw Error('Загрузка отменена');const page=await get('/api/results/facts?task='+encodeURIComponent(task)+'&generation='+encodeURIComponent(value.facts_generation)+'&after='+after+(compact?'&view=overview':''),{active:isCurrent});
  if(!isCurrent())throw Error('Загрузка отменена');
  for(const row of page.facts){result.facts.push(row.fact);if(row.layout)result.layout_facts.push(row.layout);if(row.session)result.session_observations.push(row.session);if(row.research)result.research.facts.push(row.research);if(row.extra&&result.overview)result.overview.facts.push(row.extra);}
  after=page.next;
 }while(after!==null);
 if(!compact)delete result.facts_generation;
 return result;
}
const factRequests=new WeakMap();
async function completeFacts(reload=true){
 const snapshot=data,ticket=version;if(!snapshot.facts_generation)return true;
 $('#status').textContent='Загрузка подробных данных…';
 // A snapshot's fact pages can serve successive section choices. Only returning
 // to overview or replacing the snapshot cancels their shared request.
 let entry=factRequests.get(snapshot);
 if(!entry||entry.epoch!==factsVersion){
  const epoch=factsVersion;
  entry={epoch,request:readFacts(snapshot,false,()=>epoch===factsVersion&&data===snapshot)};
  factRequests.set(snapshot,entry);
  entry.request.catch(()=>{if(factRequests.get(snapshot)===entry)factRequests.delete(snapshot);});
 }
 let full;try{full=await entry.request;}catch(error){
  if(ticket!==version||data!==snapshot)return false;
  if(error.status===410&&reload){if(!await load())return false;return completeFacts(false);}
  throw error;
 }
 if(ticket!==version||data!==snapshot)return false;
 data=full;aggregate=full;
 if(full.cache?.stale)$('#status').textContent='Показан последний готовый расчёт. Нажмите «Обновить», чтобы продолжить подготовку новых данных.';
 else $('#status').replaceChildren();return true;
}
async function get(path,{compact=false,active}={}){
 const epoch=version,isCurrent=active||(()=>epoch===version);let busyRetries=0,changedCalculations=0;
 for(let step=0;step<2600;step++){
  if(!isCurrent())throw Error('Загрузка отменена');
  while(document.hidden)await new Promise(resolve=>document.addEventListener('visibilitychange',resolve,{once:true}));
  if(!isCurrent())throw Error('Загрузка отменена');
  const requestPath=step>0&&step%64===0&&/^\/api\/results(?:\/summary)?(?:\?|$)/.test(path)?path+(path.includes('?')?'&':'?')+'fallback=1':path;
  let r=await fetch(requestPath,{cache:'no-store'});
  if(!isCurrent())throw Error('Загрузка отменена');
  if(r.status===202){
   const progress=await r.json();$('#status').textContent='Готовим результаты';
   if(progress.calculation){
    if(await prepareInBrowser(progress.calculation,epoch)!==false||++changedCalculations<3)continue;
    r=await fetch(path+(path.includes('?')?'&':'?')+'fallback=1',{cache:'no-store'});
    if(r.status===202)throw Error('Данные продолжают меняться. Повторите обновление журнала позже.');
   }else{if(progress.retry_after_ms&&++busyRetries>15)throw Error('Подготовка занята. Повторите обновление позже.');await new Promise(resolve=>setTimeout(resolve,progress.retry_after_ms||0));continue;}
  }
  if(!r.ok){const error=Error('Не удалось получить данные ('+r.status+')');error.status=r.status;throw error;}
  if(r.headers.get('X-Journal-Cache')==='stale')$('#status').textContent='Показан последний готовый расчёт. Нажмите «Обновить», чтобы продолжить подготовку новых данных.';
  const value=await r.json();
  if(!isCurrent())throw Error('Загрузка отменена');
  if(value.facts_generation)return readFacts(value,compact,isCurrent);
  return value;
 }
 throw Error('Подготовка ещё не завершена. Повторите обновление.');
}
async function post(path,body){const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw Error(r.status===409?'Режим изменён в другой вкладке. Обновите данные.':'Не удалось сохранить ('+r.status+')');return r.json();}
function retryAction(error,retry){return error.journalModuleFailure?()=>location.reload():retry;}
function showError(error,retry){const status=$('#status');status.setAttribute('role','alert');status.replaceChildren(document.createTextNode(error.message+' '),button('Повторить',retryAction(error,retry)));}
async function safe(fn){$('#status').setAttribute('role','status');$('#status').replaceChildren();try{await fn();}catch(e){if(!ui){$('#screen').replaceChildren(empty('Не удалось загрузить данные','Попробуйте ещё раз.',button('Повторить загрузку',retryAction(e,()=>safe(fn)),'primary'),'error'));}showError(e,()=>safe(fn));}}

function setURL(run,push=false){const u=new URL(location.href);u.hash=state.section;u.searchParams.set('task',state.task);if(run)u.searchParams.set('run',run);else u.searchParams.delete('run');if(state.purpose!=='respondent')u.searchParams.set('purpose',state.purpose);else u.searchParams.delete('purpose');history[push?'pushState':'replaceState'](null,'',u);}
async function record(id){
 const epoch=cacheEpoch,key=state.task+':'+id;if(cache.has(key))return cache.get(key);if(pending.has(key))return pending.get(key);
 const request=(async()=>{let after=0,events=[],session,changes=[],research;do{const r=await get('/api/results/'+encodeURIComponent(id)+'?after='+after);session=r.session;research=r.research;changes=r.collection_changes||[];events.push(...r.events);after=r.next;}while(after!==null);events.sort((a,b)=>a.at-b.at||a.sequence-b.sequence);const value={session,events,collection_changes:changes,research};if(epoch===cacheEpoch)cache.set(key,value);return value;})();
 pending.set(key,request);try{return await request;}finally{if(pending.get(key)===request)pending.delete(key);}
}

function rebuild(){model=journalModel(data,runs,control,typeof catalogArticles==='undefined'?[]:catalogArticles);if(current){const details=detailModel(current,model.title,describe,eventTitle,typeof catalogArticles==='undefined'?[]:catalogArticles),i=model.sessions.findIndex(s=>s.id===current.session.id);if(i>=0)model.sessions[i]=details;else model.sessions.push(details);}}

function render(){root.classList.remove('journal-starting');rebuild();source.route=current?'sessions/'+current.session.id:state.section;if(!ui)ui=mountJournal(root,source);ui.update(model,state.section,current?.session.id);}
async function load(){
 const ticket=++version;++factsVersion;$('#status').replaceChildren();if(!ui)$('#screen').replaceChildren(loading('Обновление данных…',state.section));
 const requested=state.task==='all'&&state.section!=='sessions'?(aggregate?.current_task||''):state.task,suffix=requested?'?task='+encodeURIComponent(requested):'';
 let d,r,c;try{d=await get('/api/results/summary'+suffix,{compact:state.section==='overview'});if(ticket!==version)return false;[r,c]=await Promise.all([get('/api/results'+suffix+(d.cache?.stale?(suffix?'&':'?')+'fallback=1':'')),get('/api/collection')]);}catch(error){if(ticket!==version)return false;throw error;}if(ticket!==version)return false;
 const task=d.task||'all';if(task!==state.task)clearDetails();state.task=task;aggregate=d;data=d;runs=r;control=c;if($('#status').textContent==='Готовим результаты')$('#status').replaceChildren();render();return true;
}
async function detail(id,{push=true}={}){
 let ticket=++version;$('#status').setAttribute('role','status');$('#status').textContent='Загрузка истории…';
 try{const d=await record(id);if(ticket!==version)return;
  if(state.task!=='all'&&d.session.task_version!==state.task){clearDetails();current=null;state.task=d.session.task_version;if(!await load())return;ticket=version;}
  current=d;state.section='sessions';$('#status').replaceChildren();setURL(id,push);render();window.scrollTo(0,0);$('#page-title').tabIndex=-1;$('#page-title').focus({preventScroll:true});
 }catch(e){if(ticket===version)showError(e,()=>detail(id,{push}));}
}

const source={live:true,async copyLink(address){const input=el('input');input.readOnly=true;input.value=address;input.style.cssText='position:fixed;left:-9999px';root.append(input);input.focus();input.select();let ok=false;try{if(navigator.clipboard){await navigator.clipboard.writeText(input.value);ok=true;}}catch{}if(!ok){try{ok=document.execCommand('copy');}catch{}}input.remove();return ok?'Ссылка скопирована':'Скопируйте ссылку вручную: '+address;},purpose:state.purpose==='respondent'?'research':state.purpose,themeKey:'dns-report-theme',get initial(){return model;},navigate(section,id,filters){safe(async()=>{state.purpose=filters?.purpose==='research'?'respondent':filters?.purpose||state.purpose;++version;if(section==='overview')++factsVersion;if(id){if(!await completeFacts())return;return detail(id);}$('#status').replaceChildren();current=null;state.section=section;if(state.task==='all'&&section!=='sessions'){state.task=aggregate.current_task;if(!await load())return;}else if(section!=='overview'&&!await completeFacts())return;setURL(null,true);render();window.scrollTo(0,0);});},refresh(){return safe(async()=>{clearDetails();const previous=current,id=previous?.session.id;current=null;try{if(await load()&&id)await detail(id,{push:false});}catch(error){current=previous;throw error;}});},setCollection(enabled,toggle){return safe(async()=>{toggle.disabled=true;try{control=await post('/api/results/control',{enabled,revision:control.revision});render();}finally{toggle.disabled=false;}});},taskFilter(all=false){const items=aggregate.versions.map(v=>[v.task_version,'Подбор комплектующих'+(v.task_version===aggregate.current_task?'':' · архив '+v.task_version)]);if(!items.some(x=>x[0]===aggregate.current_task))items.unshift([aggregate.current_task,'Подбор комплектующих']);if(all)items.unshift(['all','Все сценарии']);const f=field('Сценарий',items,id=>safe(async()=>{clearDetails();current=null;state.task=id;setURL(null);await load();}));f.setValue(state.task);return f;},prepareExport(action,cancel){return safe(async()=>{try{const compact=!!data.facts_generation;if(!await completeFacts()){cancel?.();return;}if(compact)render();return action();}catch(error){cancel?.(error);throw error;}});},exportData(){return safe(async()=>{if(current){download('json');return;}if(!await completeFacts())return;const dataExport={summary:data,sessions:runs};save(JSON.stringify(dataExport,null,2),'journal.json','application/json');});},detailActions(){return [refreshButton(()=>source.refresh()),button('JSON',()=>download('json')),button('CSV',()=>download('csv'))];}};
function save(text,filename,type){const u=URL.createObjectURL(new Blob([text],{type})),a=el('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}

// Existing recorded-event descriptions and export handler.
const names={...eventNames,'session.complete':'Сохранил сборку','session.start':'Начал задание','page.view':'Открыл страницу','page.leave':'Покинул страницу','page.visibility':'Видимость вкладки','article.time':'Время статьи','navigation.intent':'Нажал ссылку','navigation.arrive':'Переход состоялся','ui.click':'Клик','ui.hover':'Наведение','filter.change':'Изменил фильтр','filter.group':'Раскрытие фильтра','filter.reset':'Сбросил фильтры','sort.change':'Сортировка','modal.open':'Открыл модалку','modal.close':'Закрыл модалку','modal.time':'Время модалки','scroll.summary':'Прокрутка','build.change':'Изменил сборку','build.snapshot':'Состояние сборки','delivery.gap':'Потеря части событий'};
function eventTitle(e){if(e.event==='comparison.action')return comparisonActions[e.data.action]||names[e.event];if(e.event==='ui.click'&&e.data.element_id?.startsWith('comparison.'))return 'Нажал: '+(elementNames[e.data.element_id]||e.data.element_id);if(e.event==='build.change'&&e.data.comparison_id)return (e.data.action==='replace'?'Заменил товар':'Добавил товар')+(e.data.placement_id==='comparison.table'?' из сравнения':' · выбор после сравнения');return e.event==='page.view'&&e.data.method==='collection_resumed'?'Возобновил измерение страницы':names[e.event]||e.event;}
const cats={processor:'Процессоры',board:'Материнские платы',power:'Блоки питания',case:'Корпуса',gpu:'Видеокарты'};
const areas={'configurator.suggestions':'Лента быстрого подбора','article.categories':'Лента категорий панели','configurator.page':'Страница конфигуратора','article.page':'Страница статьи','modal.filters':'Панель фильтров','modal.results':'Выдача модалки','modal.articles':'Лента статей'};
const actions={open_add:'Открыть выбор категории',open_replace:'Открыть замену категории',open_row:'Перейти к строке категории',start:'Начало',pointer:'Мышь',keyboard:'Клавиатура',add:'Добавил',replace:'Заменил',remove:'Удалил',clear:'Очистил',restore:'Восстановил',browser_history:'Возврат браузером',panel:'Панель клуба DNS',link:'Ссылка',reload:'Обновление',direct:'Прямой вход',collection_resumed:'Сбор возобновлён'};

function describe(e){const d=e.data;if(e.event.startsWith('comparison.')||d.element_id?.startsWith('comparison.')||d.comparison_id){const products=d.products?.map(p=>p.name||p.id).join(', '),previous=d.previous_products?.map(p=>p.name||p.id).join(', ');return [comparisonPlaces[d.placement_id]||d.placement_id,cats[d.category_id],d.source_category?'из категории '+cats[d.source_category]:'',d.destination_category?'в каталог / категорию '+cats[d.destination_category]:'',d.name,d.target_name,products?'В сравнении: '+products:Array.isArray(d.products)?'Сравнение пустое':'',previous?'До изменения: '+previous:'',d.selected===true?'Включено':d.selected===false?'Выключено':'',d.expanded===true?'Раскрыто':d.expanded===false?'Свёрнуто':'',d.reason==='escape'?'Escape':d.reason==='close_button'?'Кнопка закрытия':d.reason==='modal'?'Закрытие модалки':'',e.event==='comparison.available'?'Смысловые действия · измерение 1':'',measure(e)].filter(Boolean).join(' · ');}const placement=d.placement_id==='article.buildPanel'?'Панель сборки в статье':d.placement_id?.startsWith('configurator.suggestions.')?'Быстрый подбор конфигуратора':d.placement_id?.startsWith('configurator.articles.')?'Блок статей конфигуратора':d.placement_id==='modal.articles'?'Статьи в модалке':d.placement_id;return [placement,actions[d.method]||d.method,actions[d.action]||d.action,cats[d.category_id],d.source_category?'из категории '+cats[d.source_category]:'',d.destination_category?'в категорию '+cats[d.destination_category]:'',d.name,d.target_name,d.article_id,d.product_id,elementNames[d.element_id]||d.element_id,d.filter_id,d.option_id,d.selected===true?'Включён':d.selected===false?'Выключен':'',d.expanded===true?'Раскрыт':d.expanded===false?'Свёрнут':'',d.visible===true?'Вкладка видима':d.visible===false?'Вкладка скрыта':'',d.target_id,areas[d.container_id],d.destination_page?'→ '+d.destination_page:'',({save:'Кнопка «Сохранить»',navigation:'Уход со страницы',selection:'Выбор товара',escape:'Escape',close_button:'Кнопка закрытия',restore:'Восстановление',initial:'При входе',page:'Страница открыта',modal:'Модалка открыта'})[d.reason]||d.reason].filter(Boolean).join(' · ')||e.page_id;}
function measure(e){const d=e.data,p=[];if(d.visible_ms!=null)p.push('Видимо '+duration(d.visible_ms));if(d.elapsed_ms!=null)p.push('Всего '+duration(d.elapsed_ms));if(d.duration_ms!=null)p.push(duration(d.duration_ms));if(d.start_px!=null)p.push(Math.round(d.start_px)+' → '+Math.round(d.end_px)+' px');if(d.travel_px!=null)p.push('Путь '+Math.round(d.travel_px)+' px');if(d.depth_pct!=null)p.push('Глубина '+Math.round(d.depth_pct)+'%');if(d.direction)p.push(({up:'Вверх',down:'Вниз',left:'Влево',right:'Вправо',mixed:'В обе стороны'})[d.direction]||d.direction);if(d.origin)p.push('Источник: '+({user:'Участник',programmatic:'Автоматически',unknown:'Не определён'})[d.origin]);return p.join(' · ');}
function download(type){if(!current)return;let text;if(type==='json')text=JSON.stringify(current,null,2);else{const csvCell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';text=[['event_id','time','event','page','description','measurements','prototype','data'],...current.events.map(e=>[e.event_id,new Date(e.at).toISOString(),e.event,e.page_id,describe(e),measure(e),e.prototype_version,JSON.stringify(e.data)])].map(r=>r.map(csvCell).join(',')).join('\r\n');}const u=URL.createObjectURL(new Blob([text],{type:type==='json'?'application/json':'text/csv;charset=utf-8'})),a=el('a');a.href=u;a.download=current.session.id+'.'+type;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}

window.addEventListener('popstate',()=>safe(async()=>{const u=new URL(location.href);current=null;state.section=u.searchParams.has('run')?'sessions':sections.includes(u.hash.slice(1))?u.hash.slice(1):'overview';state.task=u.searchParams.get('task')||aggregate?.current_task;state.purpose=['qa','all'].includes(u.searchParams.get('purpose'))?u.searchParams.get('purpose'):'respondent';if(!await load())return;const id=u.searchParams.get('run');if(id)await detail(id,{push:false});else ui.update(model,state.section,null,{purpose:state.purpose==='respondent'?'research':state.purpose});}));
$('#screen').replaceChildren(loading('Обновление данных…',state.section));
safe(async()=>{if(!await load())return;const id=url.searchParams.get('run');if(id&&state.section==='sessions')await detail(id,{push:false});});
