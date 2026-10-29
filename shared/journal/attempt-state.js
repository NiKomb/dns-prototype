import {attemptEvents,recordingComplete,validRecordId} from './recording.js';

const categories=['processor','board','gpu','power','case'];
export const attemptStatuses={completed:['Завершено','success'],incomplete:['Не завершено','neutral'],unknown:['Нет данных','neutral']};
export const attemptStatusOptions=[['all','Все'],['completed','Завершено'],['incomplete','Не завершено'],['unknown','Нет данных']];
function buildCount(build){
 if(!build||typeof build!=='object'||Array.isArray(build)||!categories.every(c=>Object.hasOwn(build,c)&&
  (build[c]===null||typeof build[c]==='object'&&validRecordId(build[c]?.id))))return null;
 return categories.filter(c=>build[c]!==null).length;
}
// Keep legacy outcome/H1/H2/H3 calculations intact. This is the journal's
// presentation of positive build/save evidence, not an inferred save result.
export function journalAttemptState(events){
 const list=attemptEvents(events);let count=null,saved=false;
 for(const e of list){
  if(e.event==='delivery.gap'||e.method==='collection_resumed')count=null;
  if(['build.snapshot','build.change','session.complete'].includes(e.event)){
   if(Object.hasOwn(e,'build'))count=buildCount(e.build);
   else if(e.event==='build.change')count=null;
  }
  if(e.event==='session.complete'){saved=true;break;}
 }
 return {status:count===null?'unknown':saved&&count===5?'completed':'incomplete',build_count:count,
  saving:saved?'saved':recordingComplete(list)&&count!==null?'not_saved':'unknown'};
}
export function attemptStateCaption(state){
 return `${Number.isInteger(state?.build_count)?state.build_count+'/5 деталей':'Детали неизвестны'} · ${{saved:'Сохранено',not_saved:'Не сохранено',unknown:'Сохранение неизвестно'}[state?.saving]||'Сохранение неизвестно'}`;
}
