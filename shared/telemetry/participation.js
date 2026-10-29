// Test threshold shared by the browser's local cutoff and the journal.
export const participationIdleMs=20*60*1000;
export const participationRuleVersion=2;
export const participationLabels={active:'В процессе',completed:'Завершено',abandoned:'Без завершения',not_started:'Нет действий',unknown:'Неизвестно'};
export const participationOptions=[['all','Все'],...Object.entries(participationLabels)];
export function resumableAttempt(attempt,at){
 if(!attempt||!Number.isFinite(at))return false;
 const last=attempt.last_meaningful_at??attempt.started_at;
 return Number.isFinite(last)&&at>=last-60000&&at-last<participationIdleMs;
}
// Existing event kinds only. Generate the SQL predicate from these same rules.
const rules=[
 {events:['ui.click'],fields:{method:['pointer','keyboard']}},
 {events:['filter.change','filter.group','filter.reset','sort.change','article.disclosure']},
 {events:['build.change'],fields:{origin:['user']}},
 {events:['scroll.summary'],fields:{origin:['user']}},
 {events:['modal.close'],fields:{reason:['escape']}}
];
export const actionEvents=rules.flatMap(r=>r.events);
export function participantActivity(event,data){
 if(data?.origin==='programmatic')return false;
 return rules.some(r=>r.events.includes(event)&&Object.entries(r.fields||{}).every(([field,values])=>values.includes(data?.[field])));
}
export function participantActivitySQL(alias='e'){
 const field=k=>`json_extract(${alias}.payload,'$.data.${k}')`;
 const values=items=>items.map(v=>`'${v}'`).join(',');
 return `(${field('origin')} IS NOT 'programmatic' AND (`+rules.map(r=>`(${alias}.event IN (${values(r.events)})`+Object.entries(r.fields||{}).map(([k,v])=>` AND ${field(k)} IN (${values(v)})`).join('')+')').join(' OR ')+'))';
}
export function participationState(attempt,at){
 if(Number.isFinite(attempt.completed_at))return 'completed';
 const last=attempt.last_meaningful_at;
 if(attempt.meaningful_version!==participationRuleVersion||attempt.activity_uncertain||!Number.isFinite(last)||!Number.isFinite(at)||at<last)return 'unknown';
 if(at-last<participationIdleMs)return 'active';
 // The initial activity marker is the start time; meaningful input advances it.
 // Use existing metadata, without rereading events or scheduling server work.
 return Number.isFinite(attempt.started_at)&&last===attempt.started_at?'not_started':'abandoned';
}
