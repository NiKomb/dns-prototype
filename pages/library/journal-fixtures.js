// Library-only fictional values. Never import this module from /results.
import * as demo from '../journal-demo/data.js';
import {layoutSummary} from '../../shared/journal/layout-facts.js';
const ratio=(numerator,denominator)=>({numerator,denominator,percent:denominator?numerator/denominator*100:null});
const h1={status:'measured',started:ratio(18,24),table_2plus:ratio(12,24),time_to_first_action:{median_ms:12000,sessions:18},not_measured:0,partial:0,incomplete:0,no_catalog:0,excluded_qa:4};
const heart=(id)=>({status:'measured',viewing:ratio(id==='H2'?8:10,id==='H2'?12:20),selection:ratio(id==='H2'?6:7,id==='H2'?8:10),time:{median_ms:id==='H2'?18000:24000,sessions:id==='H2'?6:5},legacy_time:{median_ms:null,sessions:0},excluded:{qa:4,not_measured:0,partial:0,incomplete:0,unknown:0,no_opportunity:id==='H2'?12:4},linkage_unknown:0,unknown_visits:0,no_action:2,after_only:id==='H3'?2:0,before:id==='H2'?6:5,after:id==='H3'?2:0,both:0,diagnostic:{offered:20,opened:14,arrived:14,viewed:10,viewedReturned:8,choice:7,offers:26,visibleOffers:22}});
const hypothesisStats={H1:h1,H2:heart('H2'),H3:heart('H3')};
let researchIndex=0,unfinishedIndex=0;
const sessions=structuredClone(demo.sessions).map(s=>{
 const i=s.qa?99:researchIndex++;
 s.participation=s.qa?'active':s.status==='completed'?'completed':unfinishedIndex++<3?'active':'abandoned';s.participationLabel=({completed:'Завершили участие',active:'В процессе',abandoned:'Прекратили участие'})[s.participation];
 s.route=s.route.map((r,j)=>typeof r==='string'?{label:r,description:'Демонстрационное действие',elapsed_ms:j*15000}:r);
 s.h1={eligible:!s.qa,started:i<18,table_2plus:i<12,time_to_first_action_ms:i<18?12000:null,status:'measured',coverage:'complete',time_status:'measured',first_action:{action:'add',category_id:'gpu'},table_reached:{category_id:'gpu'}};
 for(const id of['H2','H3']){const key=id.toLowerCase(),viewed=i<(id==='H2'?8:10),selected=i<(id==='H2'?6:7);s[key]={...s[key],opening_eligible:!s.qa,choice_eligible:!s.qa,opened:i<(id==='H2'?12:14)?1:0,offered:i<20,viewed,selected,status:'measured',order:selected?(id==='H2'||i<5?'before':'after'):null,time_ms:selected&&(id==='H2'||i<5)?(id==='H2'?18000:24000):null,time_status:'measured'};}
 return s;
});
const research=sessions.filter(s=>!s.qa);
const layoutFacts=sessions.map((s,i)=>({id:s.id,qa:s.qa,eligible:!s.qa,manual:!s.qa,chain:s.qa?null:{ms:16000},core:s.qa?0:s.saved?4:3,build:structuredClone(s.attemptState),quickPicker:{known:!s.qa,started:!s.qa,invoked:!s.qa&&research.indexOf(s)<20,selected:!s.qa&&research.indexOf(s)<17},materials:s.visits.map((v,j)=>({visit:s.id+'-visit-'+j,article_id:v.id})),comparison:{eligible:!s.qa,choice_eligible:!s.qa,tables:!s.qa&&research.indexOf(s)<12?['gpu']:[],inside:!s.qa&&research.indexOf(s)<8?['gpu']:[],returned:!s.qa&&research.indexOf(s)>=8&&research.indexOf(s)<10?['gpu']:[],inside_unknown:[],returned_unknown:[],linked:!s.qa&&research.indexOf(s)<10}}));
const abandoned=research.filter(s=>s.participation==='abandoned');
for(const [i,s]of abandoned.entries()){const f=layoutFacts.find(f=>f.id===s.id);f.manual=i!==0;f.chain=f.manual?{ms:16000}:null;f.build={...f.build,build_count:[0,3,5][i%3],saving:'not_saved'};f.core=f.manual?3:2;}
const layoutTotals={version:1,time:{median_ms:16000,samples:24}};
export const specimenFacts=layoutSummary(sessions,layoutFacts,layoutTotals);
export const fixtures={...demo,sessions,hypothesisStats,hypotheses:demo.hypotheses.map(h=>({...structuredClone(h),value:Math.round((h.id==='H1'?h1.table_2plus:hypothesisStats[h.id].selection).percent)+'%',caption:'Демонстрационные данные',detail:'Заполненный образец, не результаты исследования.',measurements:hypothesisStats[h.id]})),layoutFacts,layoutTotals,h3Denominator:20,scenario:{...demo.scenario},overview:structuredClone(demo.overview),stats:{attempts:24,completed:18},abandonment:{count:3,denominator:24,percent:12.5,caption:'3 из 24 демонстрационных попыток'},historyCaption:'24 демонстрационные попытки и 4 технические проверки',scenarioMetrics:[['Завершили','18 / 24','75% демонстрационных попыток','success'],['В процессе','3','Демонстрационные данные'],['Прервали','3','Демонстрационные данные']],clicks:[['Карточки товаров',148,320],['Фильтры',92,320],['Быстрый подбор',48,320]],scrollNote:'Демонстрационная медиана глубины: 76%.',scenarioRoute:['Начало задания','Каталог','Выбор детали','Сохранение'],routes:[['Каталог → выбор → сохранение',18],['Лента → выбор',6]]};
