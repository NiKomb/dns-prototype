import {overviewSummary,overviewActivity,overviewActivitySummary} from '../../shared/journal/overview-model.js';
import {journalAttemptState,attemptStateCaption} from '../../shared/journal/attempt-state.js';
export {attemptStatuses as statuses,attemptStatusOptions as statusOptions} from '../../shared/journal/attempt-state.js';
import {hypothesisTexts} from '../../shared/journal/content.js';
export {choiceSpecimens,choiceKpis,articleSelection,emptyArticleSelection,buildSpecimens} from './choice-fixtures.js';
import {h2Attempt,h1Ratio,h2Interpretation} from '../../shared/journal/real-model.js';
import {researchAttempt,researchSummary} from '../../shared/telemetry/research-model.js';
// Independent, fictional fixture. Text metadata copied from current project sources, 03.10.2026.
export const sourceTask = {
  "version": "task-2",
  "title": "Задание",
  "text": "Подберите комплектующие для вашего системного блока который собираетесь купить в ближайшее время в днс, без периферии, и сохраните сборку если решили завершить тест"
};
export const articleDefinitions = [
  {
    "id": "dns-132817",
    "title": "Обзор процессора AMD Ryzen 7 7700",
    "category": "Процессоры",
    "path": "/articles/ryzen-7700.html",
    "duration": "02:18",
    "depth": 82
  },
  {
    "id": "dns-141994",
    "title": "Обзор и сравнение Ryzen 7 9800X3D с 7 7800X3D и Ryzen 5 5800X3D — 300 Мб кэша L3 на троих",
    "category": "Процессоры",
    "path": "/articles/ryzen-x3d.html",
    "duration": "03:42",
    "depth": 94
  },
  {
    "id": "dns-167463",
    "title": "Обзор и тестирование блоков питания мощностью 700-750 Вт стоимостью до 5000 рублей: Azerty, Chieftec, GAMDIAS, Ocypus, ZALMAN",
    "category": "Блоки питания",
    "path": "/articles/psu-700-750-comparison.html",
    "duration": "01:36",
    "depth": 68
  }
];
export {hypothesisTexts} from '../../shared/journal/content.js';
export const catalogBuild = [
  [
    "Процессор",
    "Процессор AMD Ryzen 7 7800X3D OEM",
    28799,
    "cpu-002"
  ],
  [
    "Материнская плата",
    "ASRock B650 Steel Legend WiFi",
    13899,
    "board-003"
  ],
  [
    "Видеокарта",
    "Видеокарта Palit GeForce RTX 5060 Ti Infinity 3 [NE7506T019T1-GB2061S]",
    81990,
    "gpu-5622525"
  ],
  [
    "Блок питания",
    "DEEPCOOL PF750 [R-PF750D-HA0B-EU] черный",
    4399,
    "power-001"
  ],
  [
    "Корпус",
    "ARDOR GAMING Rare M6 черный",
    4599,
    "case-001"
  ]
];

export const sessions = [
  {id:'DEMO-024',date:'03.10 · 11:42',status:'completed',device:'Компьютер',duration:'12:34',articleCount:3,participant:'Участник 24'},
  {id:'DEMO-023',date:'03.10 · 11:26',status:'active',device:'Компьютер',duration:'08:16',articleCount:1,participant:'Участник 23'},
  {id:'DEMO-022',date:'03.10 · 11:08',status:'stopped',device:'Планшет',duration:'04:52',articleCount:0,participant:'Участник 22'},
  {id:'DEMO-021',date:'03.10 · 10:51',status:'completed',device:'Компьютер',duration:'15:08',articleCount:2,participant:'Участник 21'},
  {id:'DEMO-020',date:'03.10 · 10:33',status:'completed',device:'Компьютер',duration:'09:41',articleCount:1,participant:'Участник 20'},
  {id:'DEMO-QA-04',date:'03.10 · 10:20',status:'qa',device:'Компьютер',duration:'03:12',articleCount:2,participant:'Техническая проверка 4'}
];
for(let n=19;n>=1;n--) {
  const status=n<=15?'completed':n<=17?'active':'stopped';
  sessions.push({id:`DEMO-${String(n).padStart(3,'0')}`,date:`03.10 · 09:${String(n+10).padStart(2,'0')}`,status,device:n%4?'Компьютер':'Планшет',duration:status==='completed'?'12:34':status==='active'?'06:12':'04:52',articleCount:n<=7?(n===1?2:1):n===18?1:0,participant:`Участник ${n}`});
}
for(let n=3;n>=1;n--)sessions.push({id:`DEMO-QA-0${n}`,date:`03.10 · 08:${n}0`,status:'qa',device:'Компьютер',duration:'03:12',articleCount:0,participant:`Техническая проверка ${n}`});
const research=sessions.filter(s=>s.status!=='qa');
// The pool keeps eight CPU guide visits, five X3D visits and three PSU guide visits.
const pool=[0,1,2,0,0,0,0,0,0,0,1,1,1,1,2,2];let cursor=0;
for(const s of research){s.visits=pool.slice(cursor,cursor+s.articleCount).map(i=>({...articleDefinitions[i]}));cursor+=s.articleCount;}
for(const s of sessions.filter(s=>s.status==='qa'))s.visits=articleDefinitions.slice(0,s.articleCount).map(a=>({...a}));
const measured=research.filter(s=>s.visits.length);
for(const [i,s]of measured.entries())s.h2={available:true,action:i<9,choice:i<7,sameCategory:i<6};
for(const s of sessions){
  s.h2 ||= {available:false,action:false,choice:false,sameCategory:false};
  const count=s.status==='completed'?5:s.status==='active'?3+research.filter(x=>x.status==='active').indexOf(s):s.status==='stopped'?research.filter(x=>x.status==='stopped').indexOf(s):2;
  s.build=catalogBuild.slice(0,count);
  s.total=s.build.reduce((sum,row)=>sum+row[2],0);
  s.route=['Начало','Процессоры'];if(s.visits.length)s.route.push('Статья','Возврат');
  s.route.push(...s.build.map(row=>row[0]+' выбран'));s.route.push(s.status==='completed'?'Сохранение':s.status==='active'?'Выбор продолжается':s.status==='qa'?'Конец QA':'Выход');
  s.events=[['00:00','Начало задания','Открыта страница конфигуратора'],['00:42','Каталог процессоров','Фильтр: AM5 · сортировка по популярности']];
  s.visits.forEach((a,i)=>{s.events.push([`0${i+1}:18`,'Открытие статьи',a.title],[`0${i+2}:36`,'Возврат в каталог',`${a.title} · ${a.duration} · ручная глубина ${a.depth}%`]);if(s.h2.action&&i===0)s.events.push([`0${i+2}:40`,'Действие с практическим блоком','Раскрыты условия теста · просмотрена таблица результатов']);});
  s.build.forEach((b,i)=>s.events.push([`0${i+4}:02`,'Выбор: '+b[0],b[1]]));
  s.events.sort((a,b)=>a[0].localeCompare(b[0]));
  s.events.push([s.duration,s.status==='completed'?'Сохранение сборки':s.status==='active'?'Текущее состояние':s.status==='qa'?'Завершение QA':'Выход из задания',`${s.build.length} деталей · ${s.total.toLocaleString('ru-RU')} ₽`]);
  // A compact fixture timeline spans the actual displayed duration.
  const totalSeconds=s.duration.split(':').reduce((a,n)=>a*60+Number(n),0);
  s.events=s.events.map(([time,title,description],i)=>{
    const seconds=i===s.events.length-1?totalSeconds:Math.floor(totalSeconds*i/(s.events.length-1));
    return [`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`,title,description];
  });
}
export const scenario={title:'Подбор комплектующих',task:sourceTask.text,attempts:24,completed:18,active:3,stopped:3};
// Fictional recorded events exercise the same read-only calculation as /results.
const demoSessions=sessions.map(s=>({id:s.id,browser_id:s.status==='qa'?'qa-demo':'demo',started_at:0}));
const demoEvents=sessions.flatMap((s,index)=>{
 const list=[],counts=new Map();
 const add=(at,event,page,data={})=>{const page_view_id=page==='configurator'?'catalog':page,sequence=(counts.get(page_view_id)||0)+1;counts.set(page_view_id,sequence);list.push({event_id:s.id+'-'+list.length,session_id:s.id,tab_id:s.id,page_view_id,at,event,page_id:page,sequence,measurement_version:1,data});};
 add(0,'session.start','configurator');add(1,'build.snapshot','configurator',{build:{}});
 const ids=s.visits.map(v=>v.id),offered=ids.length?ids:['dns-132817'];
 add(2,'articles.offer','configurator',{offer_id:s.id,placement_id:'modal.articles',category_id:'processor',article_ids:offered});
 for(const [i,v]of s.visits.entries()){
  const t=1000+i*20000,category=v.id==='dns-167463'?'power':'processor',page='article:'+v.id;
  add(t-20,'ui.click','configurator',{element_id:'article.open',offer_id:s.id,article_id:v.id});
  add(t-10,'navigation.intent','configurator',{navigation_id:s.id+'-'+i,source_page:'configurator',destination_page:page,source_category:category,article_id:v.id,offer_id:s.id});
  add(t,'page.view',page);add(t,'navigation.arrive',page,{navigation_id:s.id+'-'+i,reason:'page',destination_page:page,offer_id:s.id});
  add(t+1,'evidence.available',page,{article_id:v.id,category_id:category,evidence_ids:['demo-results'],evidence_kinds:['results']});
  if(index%3===0)add(t+1000,'article.disclosure',page,{article_id:v.id,evidence_id:'demo-results',evidence_kinds:['results'],expanded:true});
  add(t+4000,'article.time',page,{article_id:v.id,visible_ms:4000,elapsed_ms:5000});
  add(t+4001,'scroll.summary',page,{container_id:'article.page',origin:'user',depth_pct:v.depth});
  if(index%5!==4){add(t+6000,'navigation.arrive','configurator',{destination_page:'configurator',source_page:page});
   if(index%5<3)add(t+8000,'build.change','configurator',{origin:'user',action:'add',category_id:category,product_id:'demo-'+category,build:{[category]:{id:'demo-'+category}}});}
 }
 return list;
});
const demoResearch=researchSummary(demoSessions,demoEvents);
for(const s of sessions){const f=researchAttempt(demoSessions.find(d=>d.id===s.id),demoEvents.filter(e=>e.session_id===s.id));s.activity=overviewActivity(f);s.qa=f.qa;s.h2=h2Attempt(f);s.h3=f.heart.H3;for(const v of s.visits){const linked=f.heart.visits.find(p=>p.article_id===v.id);v.after=linked?.order?({before:'После просмотра',after:'До просмотра',both:'Оба пути'}[linked.order]):'Выбор не зарегистрирован';}}
export const hypothesisStats={H2:demoResearch.heart.H2,H3:{...demoResearch.heart.H3,diagnostic:{...demoResearch.H3,viewed:demoResearch.facts.filter(f=>f.heart.H3.viewed).length,viewedReturned:demoResearch.facts.filter(f=>f.heart.H3.visits.some(v=>v.status==='viewed'&&v.return)).length,choice:demoResearch.facts.filter(f=>f.heart.H3.visits.some(v=>v.direct_choice)).length,offers:demoEvents.filter(e=>e.event==='articles.offer').reduce((n,e)=>n+e.data.article_ids.length,0),visibleOffers:0}}};
export const title=id=>articleDefinitions.find(a=>a.id===id)?.title||id;
export const articlePath=id=>articleDefinitions.find(a=>a.id===id)?.path||null;
export const hypotheses=hypothesisTexts.map((h,i)=>({...h,value:i?h1Ratio(hypothesisStats[h.id].selection):'—',caption:i?'Сессии с просмотром и связанным выбором':'Нет измерений в демонстрации',detail:i?h2Interpretation:'Демонстрационный образец без измерений сравнения.',measurements:i?hypothesisStats[h.id]:null}));
export const articles=articleDefinitions.map((a,i)=>[a.title,a.category,[8,5,3][i],a.duration,[6,4,2][i]]);
export const funnel=[['Начали задание',24],['Выбрали процессор',23],['Выбрали плату',22],['Выбрали видеокарту',21],['Выбрали блок питания',20],['Выбрали корпус',19],['Сохранили сборку',18]];
export const formatPrice=n=>n.toLocaleString('ru-RU')+' ₽';

const overviewRecords=[];
// Explicit fictional snapshots for the same shared attempt-status presentation.
for(const s of sessions){
 const saved=s.status==='completed';s.qa=s.status==='qa';
 const build=Object.fromEntries(['processor','board','gpu','power','case'].map((id,i)=>[id,s.build[i]?{id:s.build[i][3]||'demo-'+id}:null]));
 const event=(at,type,data)=>({at,event:type,page_id:'configurator',tab_id:s.id,page_view_id:'demo-configurator',data});
 const recorded=[event(0,'session.start',{measurement_version:1}),event(1,'build.snapshot',{build})];
 if(saved)recorded.push(event(2,'session.complete',{build}));
 const session={id:s.id,browser_id:s.qa?'qa-demo':'research-demo',started_at:(sessions.length-sessions.indexOf(s))*1000};s.started_at=session.started_at;overviewRecords.push({session,events:recorded});
 s.attemptState=journalAttemptState(recorded);s.status=s.attemptState.status;s.saved=saved;s.resultCaption=attemptStateCaption(s.attemptState);
}

export const overview=overviewSummary(overviewRecords);
for(const s of sessions)s.overview=overview.facts.find(f=>f.id===s.id);

export const activitySummary=overviewActivitySummary(demoSessions.map(s=>researchAttempt(s,demoEvents.filter(e=>e.session_id===s.id))),demoSessions);
