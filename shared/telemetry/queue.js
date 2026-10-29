// Durable outbox: pending attempts are discovered from indexes, never from attempt history.
export function createQueue(name = 'dns-study-outbox') {
 let dbPromise,memory=new Map(),dropped=0;
 const db=()=>dbPromise ||= new Promise((resolve,reject)=>{
  const r=indexedDB.open(name,2);
  r.onupgradeneeded=()=>{
   const store=!r.result.objectStoreNames.contains('events')?r.result.createObjectStore('events',{keyPath:'event_id'}):r.transaction.objectStore('events');
   if(!store.indexNames.contains('session'))store.createIndex('session','session_id');
   if(!store.indexNames.contains('order'))store.createIndex('order',['session_id','at','sequence','event_id']);
   if(!store.indexNames.contains('at'))store.createIndex('at','at');
  };
  r.onsuccess=()=>{r.result.onversionchange=()=>{r.result.close();dbPromise=null;};resolve(r.result);};r.onerror=()=>{dbPromise=null;reject(r.error);};
 });
 async function operation(mode,run){
  const database=await db();
  return new Promise((resolve,reject)=>{
   const tx=database.transaction('events',mode);let result;
   run(tx.objectStore('events'),value=>{result=value;});
   tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
 }
 return {
  async add(record){
   try{await operation('readwrite',s=>{
    s.put(record);const count=s.count();count.onsuccess=()=>{let excess=count.result-10000;if(excess<=0)return;const cursor=s.index('at').openCursor();cursor.onsuccess=()=>{const c=cursor.result;if(c&&excess-->0){c.delete();dropped++;c.continue();}};};
   });return true;}catch{memory.set(record.event_id,record);if(memory.size>2000){memory.delete(memory.keys().next().value);dropped++;}return false;}
  },
  async pending(){
   const ids=new Set([...memory.values()].map(e=>e.session_id));
   try{await operation('readonly',(s,done)=>{const cursor=s.index('session').openKeyCursor(null,'nextunique');cursor.onsuccess=()=>{const c=cursor.result;if(c){ids.add(c.key);c.continue();}else done();};});}catch{}
   return [...ids];
  },
  async take(sessionId){
   let rows=[];
   try{rows=await operation('readonly',(s,done)=>{const r=s.index('order').getAll(IDBKeyRange.bound([sessionId],[sessionId,[]]),40);r.onsuccess=()=>done(r.result);});}catch{}
   const candidates=[...new Map([...rows,...[...memory.values()].filter(e=>e.session_id===sessionId)].map(e=>[e.event_id,e])).values()].sort((a,b)=>a.at-b.at||a.sequence-b.sequence);
   const batch=[];let bytes=0;for(const e of candidates){const size=new TextEncoder().encode(JSON.stringify(e)).length+1;if(batch.length===40||bytes+size>60000)break;batch.push(e);bytes+=size;}return batch;
  },
  async ack(ids){
   try{await operation('readwrite',s=>ids.forEach(id=>s.delete(id)));ids.forEach(id=>memory.delete(id));return true;}
   catch{ids.forEach(id=>memory.delete(id));return false;}
  },
  loss(){const n=dropped;dropped=0;return n;}
 };
}
