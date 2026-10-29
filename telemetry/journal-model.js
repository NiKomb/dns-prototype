import {isQaAttempt} from '../shared/telemetry/research-model.js';

// Read-only observations, independent of recommendation coverage and H3 sequences.
export function articleObservations(sessions,events){
 const eligible=new Set(sessions.filter(s=>!isQaAttempt(s)).map(s=>s.id));
 const opened=new Set(),timed=new Set(),segments=new Map(),seen=new Set();let unidentified=0;
 const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
 for(const e of events){
  if(!eligible.has(e.session_id)||!['page.view','article.time'].includes(e.event))continue;
  if(e.event_id){const id=e.session_id+':'+e.event_id;if(seen.has(id))continue;seen.add(id);}
  const article=e.page_id?.startsWith('article:')?e.page_id.slice(8):e.event==='article.time'?e.data?.article_id:null;
  if(!article||e.event==='page.view'&&e.data?.method==='collection_resumed')continue;
  if(e.event==='page.view')opened.add(e.session_id);
  if(!e.page_view_id){if(e.event==='article.time')unidentified++;continue;}
  const key=e.session_id+':'+e.page_view_id,part=segments.get(key)||{session_id:e.session_id,article_id:article,opened:false,elapsed_ms:null,visible_ms:null};
  if(e.event==='page.view')part.opened=true;
  else for(const field of ['elapsed_ms','visible_ms'])if(valid(e.data?.[field]))part[field]=Math.max(part[field]??0,e.data[field]);
  if(part.elapsed_ms!==null||part.visible_ms!==null)timed.add(e.session_id);
  segments.set(key,part);
 }
 const records=[...segments.values()],sum=(rows,key)=>{const values=rows.map(r=>r[key]).filter(valid);return values.length?values.reduce((a,b)=>a+b,0):null;};
 const byArticle=new Map();for(const part of records){const rows=byArticle.get(part.article_id)||[];rows.push(part);byArticle.set(part.article_id,rows);}
 return {attempts:eligible.size,opened_attempts:opened.size,timed_attempts:timed.size,
  segments:records.filter(r=>r.opened).length,timed_segments:records.filter(r=>r.elapsed_ms!==null||r.visible_ms!==null).length,
  elapsed_ms:sum(records,'elapsed_ms'),visible_ms:sum(records,'visible_ms'),unidentified_time_events:unidentified,
  articles:[...byArticle].map(([article_id,rows])=>({article_id,opened_attempts:new Set(rows.filter(r=>r.opened).map(r=>r.session_id)).size,
   segments:rows.filter(r=>r.opened).length,timed_segments:rows.filter(r=>r.elapsed_ms!==null||r.visible_ms!==null).length,
   elapsed_ms:sum(rows,'elapsed_ms'),visible_ms:sum(rows,'visible_ms')})).sort((a,b)=>b.segments-a.segments||a.article_id.localeCompare(b.article_id))};
}

// SQL projection shared by all summary consumers. Preserve missing vs explicit null.
const summaryDataFields=['exposure_version','duration_ms','measurement_version','element_id','action','category_id','method','build','container_id','origin','depth_pct','device','article_id','product_ids','evidence_ids','evidence_kinds','reason','evidence_id','source_id','expanded','offer_id','placement_id','article_ids','compatible','navigation_id','source_page','destination_page','source_category','destination_category','product_id','previous_product_id','elapsed_ms','visible_ms','comparison_id','products','modal_instance_id'];
export const summaryEventColumns=`session_id,event,page_id,at,sequence,json_extract(payload,'$.event_id') event_id,json_extract(payload,'$.tab_id') tab_id,json_extract(payload,'$.page_view_id') page_view_id,json_extract(payload,'$.measurement_version') measurement_version,`+summaryDataFields.map(key=>`json_extract(payload,'$.data.${key}') ${key},json_type(payload,'$.data.${key}') ${key}_type`).join(',');
export function summaryEvent(row){
 const data={};for(const key of summaryDataFields){const type=row[key+'_type'];if(type==null)continue;const value=row[key];data[key]=type==='array'||type==='object'?JSON.parse(value):type==='true'?true:type==='false'?false:value;}
 const event={recording_gap:!!row.recording_gap,session_id:row.session_id,event:row.event,page_id:row.page_id,at:row.at,sequence:row.sequence,data};
 for(const key of ['event_id','tab_id','page_view_id','measurement_version'])if(row[key]!=null)event[key]=row[key];return event;
}

// The per-attempt reader parses payload once and preserves the former SQL
// projection, including absent fields and explicit null, without JSON SQL per field.
export function projectSummaryEvent(e){
 const data=Object.fromEntries(summaryDataFields.filter(k=>Object.hasOwn(e.data,k)).map(k=>[k,e.data[k]]));
 return {session_id:e.session_id,event:e.event,page_id:e.page_id,at:e.at,sequence:e.sequence,data,event_id:e.event_id,tab_id:e.tab_id,page_view_id:e.page_view_id,...(e.measurement_version!=null?{measurement_version:e.measurement_version}:{}),recording_gap:!!e.recording_gap};
}
