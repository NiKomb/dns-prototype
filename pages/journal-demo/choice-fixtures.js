import {journalAttemptState,attemptStateCaption} from '../../shared/journal/attempt-state.js';
import {articleChoiceAttempt,articleChoiceSummary,articleSelectionSummary} from '../../shared/journal/article-choice.js';

// Explicit fictional saved-event fixtures for the component library only.
const registry=[{articleId:'demo-cpu',topicCategoryIds:['cpu']},{articleId:'demo-gpu',topicCategoryIds:['gpu']}];
let seq=0;
const event=(at,type,page,data={},view=page)=>({event_id:'demo-event-'+ ++seq,at,sequence:seq,event:type,page_id:page,tab_id:'demo-tab',page_view_id:view,data});
const begin=()=>event(0,'session.start','configurator',{measurement_version:1});
const open=at=>event(at,'page.view','article:demo-cpu',{method:'direct'},'article-'+at);
const back=at=>event(at,'navigation.arrive','configurator',{source_page:'article:demo-cpu',destination_page:'configurator',reason:'page'});
const chain=(at,ms)=>[open(at),back(at+1000),event(at+ms,'build.change','configurator',{action:'add',origin:'user',category_id:'processor',product_id:'demo-product',build:{processor:{id:'demo-product'},board:null,gpu:null,power:null,case:null}})];
const histories=[
 [begin(),...chain(1000,300000)],
 [begin(),...chain(1000,240000),...chain(242000,480000)],
 [begin(),...chain(1000,480000)],
 [begin(),open(1000),back(2000)],
 [begin(),open(1000)],
 [begin(),...chain(1000,999000)],
 [begin(),open(1000),back(2000),event(3000,'delivery.gap','configurator')],
 [begin()]
];
export const choiceSpecimens=histories.map((events,i)=>{
 events=[events[0],event(0,'build.snapshot','configurator',{build:{processor:null,board:null,gpu:null,power:null,case:null}}),...events.slice(1)];
 const state=journalAttemptState(events);
 const session={id:'DEMO-C0'+(i+1),browser_id:i===5?'qa-demo':'demo-research',started_at:0};
 return {id:session.id,date:'08.10.2026 · 10:00',duration:'—',status:state.status,attemptState:state,qa:i===5,visits:i===7?[]:[{title:'Демонстрационная статья о процессорах'}],visitsMeasured:true,articleChoice:articleChoiceAttempt(session,events,registry)};
});
const calculated=articleChoiceSummary(choiceSpecimens.map(s=>s.articleChoice));
export const choiceKpis={attempts:5,completed:0,completedCaption:'Нет сохранённых сборок в примере',median:`${Math.floor(calculated.median_ms/60000)}:${String(calculated.median_ms/1000%60).padStart(2,'0')}`,medianCaption:`Сессий расчёта: ${calculated.samples} · QA исключены`,opened:5,openedCaption:'Демонстрационный набор событий'};

export const articleSelection=articleSelectionSummary(choiceSpecimens.map(s=>s.articleChoice));
export const emptyArticleSelection=articleSelectionSummary([]);
const fixtureBuild=n=>Object.fromEntries(['processor','board','gpu','power','case'].map((id,i)=>[id,i<n?{id:'demo-'+id}:null]));
const buildHistories=[
 [begin(),event(1,'session.complete','configurator',{build:fixtureBuild(5)})],
 [begin(),event(1,'session.complete','configurator',{build:fixtureBuild(3)})],
 [begin(),event(1,'build.snapshot','configurator',{build:fixtureBuild(5)})],
 [begin()],
 [begin(),event(1,'delivery.gap','configurator'),event(2,'build.snapshot','configurator',{build:fixtureBuild(3)})]
];
export const buildSpecimens=buildHistories.map((events,i)=>{const state=journalAttemptState(events);return {id:'DEMO-B0'+(i+1),date:'08.10.2026 · 10:00',duration:'—',status:state.status,attemptState:state,qa:false,visits:[],visitsMeasured:true,articleChoice:articleChoiceAttempt({id:'build-'+i},events,registry),resultCaption:attemptStateCaption(state)};});
