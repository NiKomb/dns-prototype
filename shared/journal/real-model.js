import {siteBase} from '../telemetry/hosting.js';
import {overviewActivity,overviewActivitySummary} from './overview-model.js';
import {participationLabels,participationIdleMs} from '../telemetry/participation.js';
import {attemptRoute} from './attempt-route.js';
import {journalAttemptState,attemptStatuses,attemptStatusOptions,attemptStateCaption} from './attempt-state.js';
import {articleChoiceAttempt} from './article-choice.js';
import {attemptOutcome,outcomeLabel,quickReturns,targetArticleIds} from '../telemetry/report-model.js';
import {isQaAttempt} from '../telemetry/research-model.js';
import {researchStats,articleVisitFacts,savedAttemptDuration} from './metrics.js';
import {heartSummary} from '../telemetry/heart-research.js';
import {hypothesisTexts} from './content.js';
export const duration=n=>Number.isFinite(n)?`${Math.floor(Math.max(0,n)/60000)}:${String(Math.floor(Math.max(0,n)/1000)%60).padStart(2,'0')}`:'—';
export const date=t=>Number.isFinite(t)?new Date(t).toLocaleString('ru-RU',{timeZone:'Asia/Yekaterinburg'}):'—';
export const formatPrice=n=>Number.isFinite(n)?n.toLocaleString('ru-RU')+' ₽':'—';
const categories={processor:'Процессор',board:'Материнская плата',gpu:'Видеокарта',power:'Блок питания',case:'Корпус'};
const ratios=(n,d)=>Number.isFinite(n)&&d>0?`${n} / ${d}`:'—';
const fraction=(n,d)=>d>0?`${Math.round(n/d*100)}% от всех попыток`:'Нет измеренных попыток';
const statusFor=f=>f?.completed?'completed':f?.build_count==null?'unknown':'incomplete';
export const statuses=attemptStatuses;
const visitsFor=r=>r?.H3?.offers.flatMap(o=>o.visits)||[];
const coverage={from_start:'С начала',partial:'Частично',not_measured:'Не измерялось'};
const h3Labels={not_measured:'Не измерялось',no_recommendations:'Рекомендаций не было',no_opening:'Открытие не зарегистрировано',opening_without_arrival:'Клик без подтверждённого перехода',arrival_without_return:'Возврат не зарегистрирован',return_without_choice:'Выбор после возврата не зарегистрирован',choice_after_return:'Выбор после возврата'};
export const h1Labels={not_measured:'Не измерялось',measured:'Измеряется',partial:'Частичные данные',incomplete:'Разрыв измерения',no_catalog:'Каталог не открывался'};
export const h1Ratio=value=>value?.denominator>0?`${value.numerator} / ${value.denominator} · ${Math.round(value.percent)}%`:'Нет данных';
export const h1Time=value=>Number.isFinite(value)?`${Math.round(value/1000).toLocaleString('ru-RU')} с`:'—';
export const h1Rule='Считаются сессии с открытием рабочего каталога при подключённом измерении сравнения. Одна сессия учитывается один раз. Два товара — только в открытой таблице одной категории. Время связывается с открытием каталога в той же вкладке и посещении.';
export const h1Limit='QA, старые записи, частичные данные и известные разрывы исключены из основной сводки. Отсутствие события в неполной записи не означает отсутствие действия. Наблюдения не подтверждают H1 автоматически.';
export function sessionModel(session,fact,research,title,articleRegistry=[]){
 const h2=h2Attempt(research),h3=research?.heart?.H3||emptyHeart(),h1=research?.H1;
 const visits=visitsFor(research).map(v=>({...v,title:title(v.article_id),duration:v.time_measured?duration(v.elapsed_ms):'—',depth:null,after:v.next_choice?'Выбор детали':v.return?'Возврат без зарегистрированного выбора':'Возврат не зарегистрирован'}));
 return {activity:overviewActivity(research),id:session.id,participation:session.participation,participationLabel:participationLabels[session.participation],abandoned_at:session.abandoned_at,participant:isQaAttempt(session)?'Техническая проверка':'Исследовательская попытка',date:date(session.started_at),status:statusFor(fact),qa:isQaAttempt(session),wandering:fact?.wandering,visits,visitsMeasured:research?.coverage!=='not_measured'&&!!research,h1,coverageLabels:['H1 · '+(h1Labels[h1?.status]||'Не измерялось'),'H2 · '+h2Labels[h2.status],'H3 · '+(h2Labels[h3.status]||'Не измерялось')],
 duration:duration(fact?.complete_ms),device:({desktop:'Компьютер',mobile:'Мобильное'})[session.device]||'Не определено',deviceCaption:'Тип устройства из сохранённого события',h2,h3,build:[],total:null,route:[],events:[],saved:fact?.saved,resultCaption:fact?outcomeLabel(fact):'Состояние сборки неизвестно'};
}
export function detailModel(record,title,describe,eventTitle,articleRegistry=[]){
 const {session,events,research}=record, outcome=attemptOutcome(events);const s=sessionModel({...session,device:events.find(e=>e.event==='session.start')?.data.device},{...outcome,complete_ms:outcome.completed?outcome.saved_at-session.started_at:null},research,title,articleRegistry);
 s.articleChoice=articleChoiceAttempt(session,events,articleRegistry);
 s.attemptState=journalAttemptState(events);s.status=s.attemptState.status;s.saved=s.attemptState.saving==='saved';s.resultCaption=attemptStateCaption(s.attemptState);
 s.returnObservation=quickReturns(events,targetArticleIds(articleRegistry));s.wandering=s.returnObservation.wandering;
 s.duration=duration(savedAttemptDuration(session,events));
 s.route=attemptRoute(events,session.started_at).map(r=>({...r,note:`От старта: ${r.elapsed_ms} мс · ${r.duration_ms==null?'Следующий этап не записан':'До следующего: '+r.duration_ms+' мс'}`}));
 s.build=Object.entries(categories).filter(([id])=>outcome.build?.[id]?.id).map(([id,label])=>{const p=outcome.build[id];return [label,p.name||p.id,Object.hasOwn(p,'price')?(Number.isFinite(p.price)?p.price:null):undefined];});
 s.total=s.build.length&&s.build.every(r=>Number.isFinite(r[2]))?s.build.reduce((a,r)=>a+r[2],0):null;
 s.events=events.map(e=>[duration(e.at-session.started_at),eventTitle(e),describe(e)]);
 // Keep direct entries/reloads as separate page-view segments; cumulative reports use maxima.
 s.visits=articleVisitFacts(events,research).map(p=>({...p,title:title(p.article_id),duration:duration(p.elapsed)}));s.visitsMeasured=events.some(e=>e.event==='session.start');
 const comparisonMeasured=events.some(e=>e.event.startsWith('comparison.')||e.data?.element_id?.startsWith('comparison.')||e.event==='build.change'&&e.data?.comparison_id);
 s.comparisonMeasured=comparisonMeasured;
 s.observations=[['H1 · Найти сравнение',(h1Labels[s.h1?.status]||'Не измерялось')+'. '+h1Rule],['H2 · Проверяемые данные',h2Observation(s.h2,title)],['H3 · Подходящие материалы Клуба DNS',h2Observation(s.h3,title)]];
 const gaps=[],sequences=new Map();for(const e of events){const key=e.tab_id+':'+e.page_view_id;if(!sequences.has(key))sequences.set(key,[]);sequences.get(key).push(e.sequence);}for(const seq of sequences.values()){seq.sort((a,b)=>a-b);if(seq[0]!==1||seq.some((n,i)=>i&&n!==seq[i-1]+1))gaps.push('Есть пропуски последовательности событий');}if(events.some(e=>e.event==='delivery.gap'))gaps.push('Клиент сообщил о потере записей');if(record.collection_changes.some(c=>!c.enabled))gaps.push('Сбор отключался: действия во время паузы не записывались');
 s.technical=[['attempt_id',session.id],['task_id',session.task_version],['build_id',session.prototype_version],['purpose',s.qa?'qa · исключена из сводки':'research'],['Начало',date(session.started_at)+' · UTC+5'],['Доставка',events.length+' событий · '+(gaps.length?[...new Set(gaps)].join(' · '):research?.incomplete?'известный разрыв':'без известного разрыва')],['Окружение',s.device],['Измерение',coverage[research?.coverage]||'Не измерялось'],['Код браузера',session.browser_id]];return s;
}
export function journalModel(summary,runs,control,articleRegistry){
 const titles=new Map(articleRegistry.map(a=>[a.articleId,a]));const title=id=>titles.get(id)?.title||id;const articlePath=id=>titles.get(id)?.localPath||null;const r=summary.research,stats=researchStats(summary);const facts=new Map(summary.facts.map(f=>[f.id,f]));const measured=new Map((r?.facts||[]).map(f=>[f.id,f]));const researchFacts=r?.facts||[];
 const listFacts=new Map((summary.session_observations||[]).map(f=>[f.id,f]));
 const heart=r?.heart||heartSummary(researchFacts),H2=heart.H2,H3=heart.H3;
 const knownH3=H3.viewing.denominator>0;
 const offers=researchFacts.flatMap(f=>f.H3.offers);H3.diagnostic={offered:r?.H3.offered??null,opened:r?.H3.opened??null,arrived:r?.H3.arrived??null,returned:r?.H3.returned??null,viewed:researchFacts.filter(f=>f.heart?.H3.viewed).length,viewedReturned:researchFacts.filter(f=>f.heart?.H3.visits.some(v=>v.status==='viewed'&&v.return&&v.qualified_at<=v.return.at)).length,choice:researchFacts.filter(f=>f.heart?.H3.visits.some(v=>v.direct_choice)).length,offers:offers.reduce((n,o)=>n+o.article_ids.length,0),visibleOffers:offers.reduce((n,o)=>n+o.visible.length,0)};
 const hypotheses=hypothesisTexts.map((h,i)=>({...h,value:i?h1Ratio(heart[h.id].selection):'—',caption:i?'Сессии с просмотром и выбором той же категории':'',detail:i?h2Interpretation:'',measurements:i?heart[h.id]:null}));
 const H1=r?.H1?{...r.H1,excluded_qa:r.excluded_qa}:null;
 Object.assign(hypotheses[0],{value:h1Ratio(H1?.table_2plus),caption:'Дошли до таблицы с 2+ товарами',detail:h1Limit,measurements:H1});
 const articles=(summary.article_observations?.articles||[]).map(a=>{const choices=researchFacts.filter(f=>visitsFor(f).some(v=>v.article_id===a.article_id&&v.next_choice)).length;return [title(a.article_id),(titles.get(a.article_id)?.topicCategoryIds||[]).map(id=>({cpu:'Процессоры',motherboard:'Материнские платы',gpu:'Видеокарты',powerSupply:'Блоки питания',case:'Корпуса'})[id]||id).join(' · ')||'—',a.segments,{median_ms:a.median_visible_ms??null,samples:a.visible_time_samples??0},choices];});
 const eligible=summary.facts.filter(f=>measured.has(f.id));const routeGroups=new Map();for(const f of eligible){if(f.route)routeGroups.set(f.route,(routeGroups.get(f.route)||0)+1);}const group=summary.cohorts.find(c=>c.id==='with');const funnel=(group?.stages||[]).map((s,i)=>[s.label,eligible.filter(f=>f.has_events&&f.read&&f.stage>=i).length]);
 const counts=Object.fromEntries(['incomplete','partial','ready'].map(k=>[k,eligible.filter(f=>f.outcome===k).length]));
 const opened=summary.article_observations?.opened_attempts;
 const participation=summary.participation||[],researchIds=new Set(runs.filter(s=>!isQaAttempt(s)).map(s=>s.id)),participationById=new Map(participation.map(s=>[s.id,s]));
 const participationCounts={active:0,abandoned:0,not_started:0,completed:0,unknown:0};for(const id of researchIds){const state=participationById.get(id)?.participation||'unknown';participationCounts[state in participationCounts?state:'unknown']++;}
 const abandonment={count:researchIds.size>0&&participationCounts.unknown===researchIds.size?null:participationCounts.abandoned,unknown:participationCounts.unknown,caption:`${participationIdleMs/60000} минут без осмысленных действий${participationCounts.not_started?' · Без действий: '+participationCounts.not_started:''}${participationCounts.unknown?' · Недостаточно данных: '+participationCounts.unknown:''}`};
 return {layoutFacts:summary.layout_facts,layoutTotals:summary.layout,activitySummary:overviewActivitySummary(researchFacts,runs),abandonment,participationCounts,overview:summary.overview??null,scenario:{title:'Подбор комплектующих',task:summary.task_definition.text,caption:summary.task===summary.current_task?'Актуальное задание':'Архив '+summary.task,active:summary.task===summary.current_task,link:new URL('new-attempt/',siteBase).href},stats,articleSelection:stats.article_selection,kpis:{attempts:stats.attempts,completed:stats.completed,completedCaption:fraction(stats.completed,stats.attempts),median:duration(stats.article_choice.median_ms),medianCaption:`Сессий расчёта: ${stats.article_choice.samples} · QA исключены`,opened:opened??'—',openedCaption:Number.isFinite(opened)?fraction(opened,stats.attempts):'Открытия не измерялись'},sessions:runs.map(s=>{const base=sessionModel(s,facts.get(s.id),measured.get(s.id),title,articleRegistry),details=listFacts.get(s.id),overview=summary.overview?.facts.find(f=>f.id===s.id);base.started_at=s.started_at;base.overview=overview??null;return details?{...base,attemptState:details.attempt_state,status:details.attempt_state?.status||'unknown',saved:details.attempt_state?.saving==='saved',resultCaption:attemptStateCaption(details.attempt_state),articleChoice:details.article_choice,duration:duration(details.duration_ms),device:({desktop:'Компьютер',mobile:'Мобильное'})[details.device]||'Не определено',visits:details.visits.map(v=>({...v,title:title(v.article_id),duration:duration(v.elapsed)})),visitsMeasured:details.visitsMeasured}:base;}),statuses,hypotheses,hypothesisStats:{H1,H2,H3},h3Denominator:knownH3?r.H3.evaluated:null,articles,funnel,formatPrice,collection:control.enabled,scenarioBadges:[[counts.incomplete+' не завершили','neutral'],[counts.partial+' частичных','neutral']],scenarioMetrics:[['Завершили',ratios(stats.completed,stats.attempts),'Все 5 деталей и «Сохранить»','success'],['В процессе',participationCounts.active,'Участие продолжается'],['Медиана времени от статьи до выбора',duration(stats.article_choice.median_ms),`Сессий расчёта: ${stats.article_choice.samples} · QA исключены`]],clicks:summary.clicks.map(c=>[c.label,c.count,summary.totalClicks]),scrollNote:summary.scroll.map(x=>`${x.id}: ${x.depth==null?'—':Math.round(x.depth)+'%'} (${x.samples} с замером)`).join(' · ')||'Ручная глубина не измерялась.',scenarioRoute:eligible.find(f=>f.route_stages?.length)?.route_stages.map(s=>({label:s.label,note:'Сохранённая последовательность '+eligible.find(f=>f.route_stages?.length).id}))||[],routes:[...routeGroups],historyCaption:`${r.attempts} исследовательских попыток и ${r.excluded_qa} технических проверок`,statusOptions:attemptStatusOptions,title,articlePath};
}

// The journal presents the API result; it does not reclassify article content.
export const h2Interpretation='Наблюдаемый просмотр и связанный выбор — не доказательство понимания, помощи материала, причины выбора или снижения внешнего поиска.';
export const h2Rule='Просмотр: не менее 3 секунд видимого времени либо ручная глубина больше 50% в одном посещении. Выбор той же категории до или после просмотра, в той же вкладке. Одна сессия учитывается один раз; сохранение не требуется.';
export const h2DataRule='Целевые данные достаточно видны пять секунд подряд в верхней половине экрана. После этого — возврат и ручной выбор или замена детали той же категории в той же вкладке. Каждая сессия учитывается один раз; можно выбрать любую модель, сохранять сборку необязательно. Показ означает возможность увидеть данные, а не доказанное чтение.';
export const h2Separation='H2 — подтверждённый показ размеченных целевых данных и последующий выбор; H3 — материалы из зарегистрированного предложения, включая общие руководства. Одна сессия может входить в обе группы; показатели не складываются.';
export const h2Labels={measured:'Измеряется',unknown:'Недостаточные измерения просмотра',partial:'Частичные данные',incomplete:'Разрыв измерения',qa:'QA исключена',not_measured:'Не измерялось',no_opportunity:'Нет подходящей возможности'};
export const emptyHeart=()=>({status:'not_measured',eligible:false,opening_eligible:false,choice_eligible:false,opened:0,viewed:false,selected:false,order:null,visits:[],chains:[],time_ms:null,time_status:'not_measured',representative:null});
export function h2Attempt(research){return research?.heart?.H2||emptyHeart();}
export function h2Summary(facts){return heartSummary(facts).H2;}
export function h2Observation(h,title=id=>id){
 const c=h.representative,v=c?.visit;
 return `${h2Labels[h.status]||'Не измерялось'}. ${h.viewed?'Критерий просмотра выполнен.':'Подходящий просмотр не подтверждён.'} ${h.selected?'Связанный выбор зарегистрирован: '+({before:'просмотр до выбора',after:'просмотр после выбора',both:'оба пути'}[h.order])+'.':'Связанный выбор не подтверждён.'}${v?' Материал: '+title(v.article_id)+'. Товар: '+c.choice.product_id+'.':''} ${h2Interpretation}`;
}
