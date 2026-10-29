import {orderedEvents} from '../telemetry/report-model.js';

export const validRecordId=id=>typeof id==='string'&&id.length>0&&id!=='unknown';
// Evaluate the recorded attempt through its first save, including unfinished
// attempts. A sequence gap in a SQL projection is not proof of event loss.
export function attemptEvents(events){
 const list=orderedEvents(events),end=list.findIndex(e=>e.event==='session.complete');
 return end<0?list:list.slice(0,end+1);
}
export function recordingComplete(events){
 const list=attemptEvents(events),start=list.find(e=>e.event==='session.start'&&e.measurement_version===1);
 if(!start)return false;
 for(const e of list){
  if(e.event==='delivery.gap'||e.method==='collection_resumed')return false;
  if(['session.start','session.complete','page.view','navigation.arrive','build.change','build.snapshot'].includes(e.event)&&
   (!Number.isFinite(e.at)||!validRecordId(e.tab_id)||!validRecordId(e.page_view_id)||e.at<start.at))return false;
 }
 return true;
}
