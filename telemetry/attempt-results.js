import {summarize,paths,pathsFromFacts} from './summary.js';
import {researchAttempt,researchFactsSummary} from '../shared/telemetry/research-model.js';
import {articleObservations,projectSummaryEvent} from './journal-model.js';
import {articleSessionMedians,sessionListFacts} from '../shared/journal/metrics.js';
import {articleChoiceSummary,articleSelectionSummary} from '../shared/journal/article-choice.js';
import {savedLayoutAttempt,layoutTotals} from '../shared/journal/layout-facts.js';
const measured=new Set(['session.start','session.complete','page.view','page.leave','modal.open','modal.close','comparison.available','comparison.action','articles.offer','articles.visible','evidence.available','evidence.exposure','ui.click','article.disclosure','scroll.summary','navigation.intent','navigation.arrive','article.time','build.change','delivery.gap']);
const basic=new Set(['session.start','session.complete','page.view','modal.open','build.change','build.snapshot','scroll.summary','ui.click']);
export function attemptResult(session,recorded,registry,targets,extra,source=recorded){
 let value={};for(let stage=0;stage<5;stage++)Object.assign(value,attemptStage(stage,session,recorded,registry,targets,extra,value,source));return value;
}
// Same pure formulas in the receiver and in the authenticated researcher's
// browser. New stored facts participate in the calculation algorithm version.
// source is the complete unprojected history; recording gaps in the projection
// cover a different boundary from the layout facts (through the first save).
export function prepareRecorded(recorded){
 const groups=new Map(),gaps=new Map();
 for(const e of recorded){const key=JSON.stringify([e.tab_id,e.page_view_id||null]),list=groups.get(key)||[];list.push(e);groups.set(key,list);}
 for(const list of groups.values()){list.sort((a,b)=>a.sequence-b.sequence);const gap=list.some((e,i)=>e.sequence!==(i?list[i-1].sequence:0)+1);for(const e of list)gaps.set(e,gap);}
 return recorded.filter(e=>measured.has(e.event)||e.event==='build.snapshot'||e.page_id.startsWith('article:')).map(e=>projectSummaryEvent({...e,recording_gap:gaps.get(e)}));
}
export function attemptStage(stage,session,recorded,registry,targets,extra,value={},source=recorded){
 const records=[{session,events:recorded}];
 if(stage===0){const events=recorded.filter(e=>basic.has(e.event)).map(e=>({...e,...e.data}));return {summary:summarize([session],events),path:paths([session],events,targets).facts[0]};}
 if(stage===1)return {research:researchAttempt(session,recorded.filter(e=>measured.has(e.event)))};
 if(stage===2)return {observations:articleObservations([session],recorded),medians:[...articleSessionMedians(records,'all')]};
 const research=researchFactsSummary([value.research]);
 if(stage===3)return {session:sessionListFacts(records,research,registry)[0]};
 return {layout:savedLayoutAttempt(session,source,value.research),...(extra?{extra:extra(records,research)}:{})};
}
const median=values=>{values.sort((a,b)=>a-b);const n=values.length;return n?(values[(n-1)>>1]+values[n>>1])/2:null;};
export function combineAttempts(values,extra){
 const summaries=values.map(v=>v.summary),sum=key=>summaries.reduce((n,s)=>n+s[key],0),first=summaries[0]||summarize([],[]),clicks=new Map(),routes=new Map();
 for(const s of summaries){for(const c of s.clicks){const old=clicks.get(c.id);clicks.set(c.id,old?{...old,count:old.count+c.count,sessions:old.sessions+c.sessions}:{...c});}for(const r of s.routes)routes.set(r.label,(routes.get(r.label)||0)+r.count);}
 const summary=Object.fromEntries(['attempts','completed','totalClicks','assembled','articleTransitions','articleAttempts'].map(k=>[k,sum(k)]));
 Object.assign(summary,{funnel:first.funnel.map((f,i)=>({...f,count:summaries.reduce((n,s)=>n+s.funnel[i].count,0)})),scroll:first.scroll.map((s,i)=>{const depths=summaries.map(s=>s.scroll[i]).filter(s=>s.samples).map(s=>s.depth);return {...s,samples:depths.length,depth:median(depths)};}),clicks:[...clicks.values()].sort((a,b)=>b.count-a.count),routes:[...routes].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count)});
 const observations=articleObservations([],[]),articles=new Map(),times=new Map();
 for(const v of values){for(const key of Object.keys(observations)){if(key==='articles')continue;const n=v.observations[key];if(n!==null)observations[key]=(observations[key]??0)+n;}for(const a of v.observations.articles){let item=articles.get(a.article_id);if(!item){item={...a};articles.set(a.article_id,item);}else for(const key of ['opened_attempts','segments','timed_segments','elapsed_ms','visible_ms'])if(a[key]!==null)item[key]=(item[key]??0)+a[key];}for(const [id,t]of v.medians){const list=times.get(id)||[];list.push(t.median_ms);times.set(id,list);}}
 observations.articles=[...articles.values()].sort((a,b)=>b.segments-a.segments||a.article_id.localeCompare(b.article_id)).map(a=>({...a,median_visible_ms:median(times.get(a.article_id)||[]),visible_time_samples:times.get(a.article_id)?.length||0}));
 // Excluded QA contributes no research facts but still contributes the exclusion count.
 const research=researchFactsSummary(values.map(v=>v.research));
 const session_observations=values.map(v=>v.session);
 return {...summary,...pathsFromFacts(values.map(v=>v.path)),research,layout:layoutTotals(values.map(v=>v.layout)),article_observations:observations,session_observations,article_choice:articleChoiceSummary(session_observations.map(s=>s.article_choice)),article_selection:articleSelectionSummary(session_observations.map(s=>s.article_choice)),...(extra?{overview:extra(values.map(v=>v.extra))}:{})};
}

// Optional journal composition supplied by the caller; no event history needed.
export function combineSupplemental(values,empty){
 if(!values.length)return empty||{attempts:0,completed:0,completed_percent:null,excluded_qa:0,gaps:0,insufficient:0,stages:[],facts:[]};
 const out={...values[0],facts:values.flatMap(v=>v.facts)};
 for(const key of ['attempts','completed','excluded_qa','gaps','insufficient'])out[key]=values.reduce((n,v)=>n+v[key],0);
 out.completed_percent=out.attempts?out.completed/out.attempts*100:null;
 out.stages=values[0].stages.map((stage,i)=>({...stage,count:values.reduce((n,v)=>n+v.stages[i].count,0),unknown:values.reduce((n,v)=>n+v.stages[i].unknown,0)}));
 return out;
}

// Sufficient inputs for the existing aggregate formulas, without the detailed
// action/visit references. Full facts are retained in the attempt result.
export function aggregateInput(v){
 const f=v.research,pick=(o,keys)=>Object.fromEntries(keys.map(k=>[k,o[k]]));
 const research={...pick(f,['id','qa','coverage','incomplete']),H1:pick(f.H1,['eligible','started','table_2plus','time_to_first_action_ms','coverage','incomplete','status']),
  H2:{availability:f.H2.availability.some(a=>a.evidence_ids?.length)?[{evidence_ids:[1]}]:[],action:f.H2.action,choice_after_action:f.H2.choice_after_action,actions:f.H2.actions.some(a=>a.next_choice?.same_category)?[{next_choice:{same_category:true}}]:[]},
  H3:{...pick(f.H3,['status','offered','visible','opened','arrived','returned','changed']),offers:f.H3.offers.length?[{visits:f.H3.offers.some(o=>o.visits.some(v=>v.next_choice?.same_category))?[{next_choice:{same_category:true}}]:[]}]:[]},
  heart:Object.fromEntries(['H2','H3'].map(k=>[k,pick(f.heart[k],['opening_eligible','choice_eligible','viewed','selected','time_ms','status','linkage_unknown','unknown_visits','time_status','eligible','order','legacy_time_ms','exposure_measured'])]))};
 const choice=v.session.article_choice;
 return {...v,research,path:pick(v.path,['id','has_events','read','stage','complete_ms']),session:{article_choice:{...pick(choice,['status','median_ms','evaluation']),chains:choice.chains.length?[1]:[]}},extra:v.extra?{...v.extra,facts:[]}:undefined};
}
