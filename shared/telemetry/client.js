import {resumableAttempt,participantActivity,participationIdleMs} from './participation.js';
import {createComparisonTelemetry} from './comparison.js';
import {schemaVersion,uid,category,validateEvent} from './registry.js';
import {createQueue} from './queue.js';
import {studyDialog,studyCompleteDialog,studyUnavailableDialog,updateSaveButton} from './study-dialog.js';
import {articleOffers} from './article-offers.js';
import {createEvidenceExposure} from './evidence-exposure.js';
import {createReceiverClock} from './receiver-clock.js';

// Bootstrapped by the study host only on respondent pages; service pages stay inactive.
const config=window.__studyConfig;
const siteBase=new URL('../../',import.meta.url);
const localPath='/'+location.pathname.slice(siteBase.pathname.length);
const storageKey=key=>key.replace(/^dns-study/,config?.storageNamespace||'dns-study');
const request=(path,options)=>fetch(new URL(path,config?.apiOrigin||location.origin),options);
const isConfig=['/','/index.html','/new-attempt','/new-attempt/','/new-attempt/index.html'].includes(localPath);
const isArticle=/^\/articles\/[a-z0-9-]+\.html$/.test(localPath);
if(config?.version && (isConfig||isArticle) && !window.__studyInstalled) {
 window.__studyInstalled=true;window.__studyReady=false;
 let readyComplete=false;
 let receiverClock=createReceiverClock(config.clock,window.__studyClockStart);
 const now=()=>receiverClock?.now();
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(storageKey(key)))??fallback;}catch{return fallback;}};
 const write=(key,value)=>{try{localStorage.setItem(storageKey(key),JSON.stringify(value));return true;}catch{return false;}};
 const sread=(key)=>{try{return JSON.parse(sessionStorage.getItem(storageKey(key)));}catch{return null;}};
 const swrite=(key,value)=>{try{sessionStorage.setItem(storageKey(key),JSON.stringify(value));}catch{}};
 const browserId=read('dns-study-browser',null)||uid();write('dns-study-browser',browserId);
 const tabId=sread('dns-study-tab')||uid();swrite('dns-study-tab',tabId); // page_view_id disambiguates cloned tabs
 let collecting=Boolean(config.enabled);
 let session=read('dns-study-session',null), pageId=isConfig?'configurator':null, pageName=isConfig?'Конфигуратор':'',pageView=uid(),sequence=0;
 let queue=createQueue(config.storageNamespace?config.storageNamespace+'-outbox':undefined),pendingWrites=Promise.resolve(),sending=false,nextSend=0,failures=0,entered=false,hidden=document.hidden;
 const registered=new Map();
 let collectionSending=false,lastCollectionCheck=-Infinity,sendTimer=null,idleTimer=null,deliveryPending=false,measurementEnd=null,endingAttempt=false;
 let restartRequired=false,onlineListening=false;
 const recordingListeners=[];
 function recordingListener(target,type,handler,options){recordingListeners.push([target,type,handler,options]);target.addEventListener(type,handler,options);}
 function onOnline(){nextSend=0;void syncCollection();void flush();}
 function syncOnlineListener(){const needed=deliveryPending||!session?.completed_at;if(needed===onlineListening)return;onlineListening=needed;window[needed?'addEventListener':'removeEventListener']('online',onOnline);}
 let unavailableShown=false,unavailableNotice=null,deliveryWarning=false;
 function showUnavailable(pending=false){if(unavailableShown)return;unavailableShown=true;deliveryWarning=pending;unavailableNotice=studyUnavailableDialog({pending});document.body.append(unavailableNotice);unavailableNotice.show();}
 function deliveryRestored(){if(!deliveryWarning)return;unavailableNotice?.destroy();unavailableNotice=null;deliveryWarning=false;unavailableShown=false;}
 function registrationKnown(attempt){return registered.get(attempt.id)===attempt.token||read('dns-study-registrations',{})[attempt.id]===attempt.token;}
 function rememberRegistration(attempt){registered.set(attempt.id,attempt.token);const saved=read('dns-study-registrations',{});saved[attempt.id]=attempt.token;write('dns-study-registrations',saved);}
 function forgetRegistration(attempt){registered.delete(attempt.id);const saved=read('dns-study-registrations',{});delete saved[attempt.id];write('dns-study-registrations',saved);}
 let pageClock=null,modalClock=null,lastMethod='unknown',lastReason='other',lastActionAt=0;
 let clearAt=0,closeReasonAt=0,lastBuild=null,dialog=null,hover=null,listRevision=uid();
 const scrolls=new Map(),inputs=new WeakMap(),programmatic=new WeakMap();
 let intended=null,lastSelection=null,articleDetail=null,articleContext={};
 const comparison=createComparisonTelemetry({emit,active:()=>entered&&collecting&&Boolean(session)&&!session.completed_at});
 const evidenceExposure=createEvidenceExposure({
  active:()=>entered&&collecting&&Boolean(session)&&!session.completed_at&&!restartRequired,
  qualify:({target,duration_ms})=>{
   if(expireAttempt())return;
   articleTime(false);
   emit('evidence.exposure',{...articleContext,category_id:articleContext.category_id||articleDetail.evidenceCategory,
    article_id:articleDetail.id,evidence_id:target.id,evidence_kinds:target.kinds,source_id:articleDetail.id,exposure_version:4,duration_ms});
  }
 });
 const lists=new WeakMap();
 function placement(node){const root=node?.closest?.('[data-telemetry-placement]');if(!root)return {};if(!lists.has(root))lists.set(root,uid());return {placement_id:root.dataset.telemetryPlacement,list_id:root.dataset.telemetryOfferId||lists.get(root),offer_id:root.dataset.telemetryOfferId,category_id:category(node.closest('[data-category-id]')?.dataset.categoryId)};}

 const newAttempt=new URL(location.href).searchParams.has('new_attempt');
 if(newAttempt){session=null;write('dns-study-session',null);const u=new URL(location.href);u.searchParams.delete('new_attempt');history.replaceState(history.state,'',u);}
 const clock=()=>({start:performance.now(),visible:0,since:document.hidden?null:performance.now()});
 function sample(c){const at=measurementEnd??performance.now();return {elapsed_ms:Math.max(0,Math.round(at-c.start)),visible_ms:Math.max(0,Math.round(c.visible+(c.since==null?0:Math.max(0,at-c.since))))};}
 function visibility(c){if(!c)return;const now=performance.now();if(c.since!=null)c.visible+=now-c.since;c.since=document.hidden?null:now;}
 function currentSession(){return session;}
 function rememberActivity(at=now()){
  if(endingAttempt||!session||session.completed_at||!Number.isFinite(at))return;
  session.last_meaningful_at=Math.max(session.last_meaningful_at??session.started_at,at);write('dns-study-session',session);scheduleExpiry();
 }
 function scheduleExpiry(){
  clearTimeout(idleTimer);idleTimer=null;
  if(!session||session.completed_at||restartRequired||!receiverClock)return;
  const left=(session.last_meaningful_at??session.started_at)+participationIdleMs-now();
  idleTimer=setTimeout(()=>{idleTimer=null;if(!expireAttempt())scheduleExpiry();},Math.max(0,left));
 }
 function expireAttempt(){
  if(restartRequired)return true;
  if(!session||session.completed_at||!receiverClock||!Number.isFinite(now())||resumableAttempt(session,now()))return false;
  // A suspended tab may wake much later. Do not count that extra time.
  endingAttempt=true;measurementEnd=performance.now()-Math.max(0,now()-(session.last_meaningful_at??session.started_at)-participationIdleMs);
  if(entered){finishScrolls();comparison.finish();articleTime(true);modalTime();for(const root of exposures.keys())endExposure(root,'idle');}
  measurementEnd=null;endingAttempt=false;restartRequired=true;entered=false;stopRecording();syncSaveButton();showStart();void flush();return true;
 }
 // Run before the prototype's handlers, without generating an activity event.
 function guardInput(event){
  if(!event.isTrusted||dialog?.contains(event.target))return;
  if(!collecting&&performance.now()-lastCollectionCheck>=30000)void syncCollection();
  if(expireAttempt()){
   if(event.cancelable)event.preventDefault();event.stopImmediatePropagation();
  }
 }
 for(const type of ['pointerdown','touchstart','touchmove','wheel','keydown','click','input','change'])window.addEventListener(type,guardInput,{capture:true,passive:false});
 function scheduleSend(delay=15000){
  if(document.hidden||sendTimer!==null||failures>=3)return;
  sendTimer=setTimeout(()=>{sendTimer=null;void flush();},Math.max(delay,nextSend-performance.now()));
 }
 function stopRecording(){
  clearTimeout(idleTimer);idleTimer=null;
  evidenceExposure.stop();offers.stop();comparison.finish();exposureMutations.disconnect();exposureObserver.disconnect();observer.disconnect();observed.clear();
  for(const [target,type,handler,options]of recordingListeners)target.removeEventListener(type,handler,options);
  for(const node of scrolls.keys())clearTimeout(scrolls.get(node).timer);scrolls.clear();exposures.clear();hover=null;modalClock=null;
 }
 function startRecording(){
  for(const [target,type,handler,options]of recordingListeners)target.addEventListener(type,handler,options);
  exposureMutations.observe(document.documentElement,{childList:true,subtree:true});scanExposures();
  observer.observe(document.documentElement,{subtree:true,childList:true});offers.resume();scheduleExpiry();
 }
 function emit(event,data={}){
  if(restartRequired||!collecting||!session||session.completed_at||!pageId)return;
  const clean=Object.fromEntries(Object.entries(data).filter(([,v])=>v!==undefined));
  if(!receiverClock)return;
  if(participantActivity(event,data)&&!endingAttempt){
   // Time must precede the action that may depend on the article viewing it proves.
   articleTime(false);modalTime();if(failures>=3){failures=0;nextSend=0;}
  }
  const record={event_id:event==='session.complete'?session.id+'.complete':uid(),session_id:session.id,tab_id:tabId,page_view_id:pageView,sequence:++sequence,...receiverClock.stamp(),event,page_id:pageId,prototype_version:config.version,task_version:session.task_version,schema_version:schemaVersion,viewport:[innerWidth,innerHeight],data:clean};
  if(!validateEvent(record)){console.warn('Study event rejected',event);sequence--;return;}
  if(participantActivity(event,data))rememberActivity(record.at);
  // Credentials must become durable again before a new tail can outlive the active pointer.
  const attempts=read('dns-study-attempts',[]);if(!attempts.some(a=>a.id===session.id)){attempts.push({...session});write('dns-study-attempts',attempts);}
  // Synchronous small tail survives pagehide, where an IndexedDB transaction may never run.
  const tailKey='dns-study-tail:'+pageView;
  const tail=read(tailKey,[]);tail.push(record);if(tail.length>200)tail.shift();write(tailKey,tail);
  deliveryPending=true;syncOnlineListener();scheduleSend();
  pendingWrites=pendingWrites.then(async()=>{const durable=await queue.add(record);if(!durable)return;const remaining=read(tailKey,[]).filter(e=>e.event_id!==record.event_id);try{remaining.length?write(tailKey,remaining):localStorage.removeItem(storageKey(tailKey));}catch{}}).catch(()=>{});
 }
 async function flush(){
  if(navigator.locks)return navigator.locks.request(storageKey('dns-study-delivery'),{ifAvailable:true},lock=>{if(lock)return deliver();if(deliveryPending)scheduleSend();});
  return deliver();
 }
 async function deliver(){
  if(sending)return;if(performance.now()<nextSend){if(deliveryPending)scheduleSend();return;}
  clearTimeout(sendTimer);sendTimer=null;sending=true;
  try{
   await pendingWrites;
   try {for(const key of Object.keys(localStorage).filter(k=>k.startsWith(storageKey('dns-study-tail:')))){const rows=read(key,[]);let durable=true;for(const row of rows)durable=(await queue.add(row))&&durable;if(durable)localStorage.removeItem(key);}}catch{}
   // Old attempts' undelivered records retain their own credentials.
   const known=read('dns-study-attempts',[]);if(session&&!known.some(s=>s.id===session.id))known.push(session);
   const credentials=new Map(known.map(a=>[a.id,a]));
   for(const id of await queue.pending()){
    const attempt=credentials.get(id);if(!attempt)throw Error('credentials');
    const events=await queue.take(attempt.id);if(!events.length)continue;
    if(!registrationKnown(attempt)){
     const r=await request('/api/sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(attempt)});
     if(!r.ok)throw Error('session');const registration=await r.json();if(registration.id!==attempt.id)throw Error('session');
     if(registration.discard){if(!await queue.ack(events.map(e=>e.event_id)))throw Error('local acknowledgement');continue;}
     rememberRegistration(attempt);
    }
    const r=await request('/api/study-records',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:attempt.id,token:attempt.token,events})});
    if(r.status===403)forgetRegistration(attempt);
    if(!r.ok)throw Error('delivery');const data=await r.json();if(!Array.isArray(data.ack)||data.ack.length!==events.length)throw Error('ack');
    if(!await queue.ack(data.ack))throw Error('local acknowledgement');
    if(data.collection)applyCollection(data.collection);
    try{for(const key of Object.keys(localStorage).filter(k=>k.startsWith(storageKey('dns-study-tail:')))){const left=read(key,[]).filter(e=>!data.ack.includes(e.event_id));left.length?write(key,left):localStorage.removeItem(key);}}catch{}
   }
   const remaining=new Set(await queue.pending());deliveryPending=remaining.size>0;
   // Keep credentials only for pending delivery. The active pointer is independent.
   const latestKnown=new Map([...known,...read('dns-study-attempts',[])].map(a=>[a.id,a]));
   write('dns-study-attempts',[...latestKnown.values()].filter(a=>remaining.has(a.id)));
   for(const id of registered.keys())if(!remaining.has(id)&&id!==session?.id)registered.delete(id);
   const confirmations=read('dns-study-registrations',{});for(const id of Object.keys(confirmations))if(!remaining.has(id)&&id!==session?.id)delete confirmations[id];write('dns-study-registrations',confirmations);
   failures=0;nextSend=0;if(!deliveryPending)deliveryRestored();const loss=queue.loss();if(loss)emit('delivery.gap',{dropped:loss,reason:'queue_limit'});
  }catch{deliveryPending=true;failures++;nextSend=performance.now()+Math.min(60000,1000*2**Math.min(failures,6));showUnavailable(true);}
  finally{sending=false;syncOnlineListener();if(deliveryPending)scheduleSend();}
 }
 function captureBuild(){const state=window.configuratorState;if(!state)return null;const result={};for(const [k,v]of Object.entries(state)){const c=category(k);if(c)result[c]=v?{id:v.id,name:v.name,price:v.price ?? null}:null;}return result;}
 function initialBuild(){const build=captureBuild();if(build){lastBuild=build;emit('build.snapshot',{build,reason:'initial'});}}
 function pageEntry(method){
  if(restartRequired||method!=='collection_resumed'&&expireAttempt())return;if(!receiverClock||!collecting||!session||session.completed_at||!pageId||entered)return;entered=true;pageClock=clock();
  const nav=sread('dns-study-navigation');
  const follows=method==='direct'&&nav?.destination_page===pageId&&now()-nav.at<300000;
  emit('page.view',{name:pageName,method:follows?nav.method:method,measurement_version:1});if(isConfig)comparison.start();for(const root of observed){exposureObserver.unobserve(root);exposureObserver.observe(root);}
  const lastPage=sread('dns-study-last-page');
  if(method==='browser_history'){
   emit('navigation.arrive',{method:'browser_history',destination_page:pageId,...(lastPage||{})});
   swrite('dns-study-navigation',null);
  }else if(nav&&nav.destination_page===pageId&&now()-nav.at<300000){
   intended=nav;emit('navigation.arrive',{...navData(nav),method:nav.method,destination_page:pageId,reason:'page'});swrite('dns-study-navigation',null);
  }
  if(isArticle){
   const saved=sread('dns-study-article-context');
   articleContext=follows?{category_id:nav.source_category,product_ids:nav.product_ids,offer_id:nav.offer_id}:saved?.session_id===session.id&&saved.page_id===pageId?saved.context:{};
   swrite('dns-study-article-context',{session_id:session.id,page_id:pageId,context:articleContext});
   emit('evidence.available',{...articleContext,category_id:articleContext.category_id||articleDetail.evidenceCategory,article_id:articleDetail.id,evidence_ids:articleDetail.evidenceIds||[],evidence_kinds:articleDetail.evidenceKinds||[],source_id:articleDetail.id,reason:articleDetail.evidenceReason||'not_instrumented',measurement_version:1,exposure_version:4});
  }
  if(isConfig)initialBuild();
  document.querySelectorAll('.processor-modal:not([hidden])').forEach(modal=>openModal(modal));
  scanOffers();startRecording();
  if(isArticle)evidenceExposure.start(articleDetail.evidenceTargets||[]);
 }
 function navData(n){return {navigation_id:n.navigation_id,source_page:n.source_page,source_category:n.source_category,source_article:n.source_article,destination_page:n.destination_page,destination_category:n.destination_category,element_id:n.element_id,placement_id:n.placement_id,list_id:n.list_id,offer_id:n.offer_id,article_id:n.article_id,product_ids:n.product_ids,target_id:n.target_id,action:n.action};}
 function start(){
  if(!receiverClock||!collecting)return;restartRequired=false;session=null;entered=false;
  endHover('new_attempt');modalClock=null;scrolls.clear();
  // Reset before creating the attempt: preparation is not a respondent action.
  if(isConfig)buildView.resetForStudy();
  else write('dns-prototype-configurator-v2',{});
  const stamp=receiverClock.stamp();
  session={entry_token:config.entry_token,last_meaningful_at:stamp.at,id:uid(),browser_id:browserId,token:uid()+uid(),started_at:stamp.at,time:stamp.time,task_version:config.task.version,prototype_version:config.version};
  write('dns-study-session',session);const old=read('dns-study-attempts',[]);old.push(session);write('dns-study-attempts',old);
  entered=false;syncSaveButton();pageView=uid();sequence=0;emit('session.start',{measurement_version:1,name:config.task.title,device:(navigator.userAgentData?.mobile||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'mobile':'desktop'});pageEntry('start');void flush();
 }
 function syncSaveButton(){
  const button=document.getElementById('save-build');if(!button)return;
  updateSaveButton(button,session?.completed_at);
 }
 function complete(){
  if(!readyComplete){window.__studySaveRequested=true;return;}
  window.__studySaveRequested=false;
  if(expireAttempt())return;
  const build=captureBuild();if(!build||!Object.values(build).some(Boolean))return;
  if(!collecting||!session||session.completed_at||!entered)return;
  write('dns-study-saved-build',{build,saved_at:now()});
  for(const root of exposures.keys())endExposure(root,'complete');endHover('complete');finishScrolls();comparison.finish();articleTime(true);closeModal('selection');
  emit('session.complete',{build,reason:'save',...sample(pageClock)});
  session.completed_at=now();write('dns-study-session',session);entered=false;stopRecording();syncSaveButton();void flush();
  const confirmation=studyCompleteDialog();document.body.append(confirmation);confirmation.showModal();
 }
 function applyCollection(state){
  if(session?.completed_at||Boolean(state.enabled)===collecting)return;
  collecting=Boolean(state.enabled);
  if(!collecting){entered=false;stopRecording();exposures.clear();hover=null;modalClock=null;scrolls.clear();dialog?.close();dialog?.remove();dialog=null;}
  else{pageView=uid();sequence=0;pageEntry('collection_resumed');showStart();}
 }
 async function syncCollection(){
  if(document.hidden||session?.completed_at||collectionSending)return;
  collectionSending=true;lastCollectionCheck=performance.now();
  try{const requested=performance.now(),response=await request('/api/collection?time=1',{cache:'no-store'});if(!response.ok)return;const state=await response.json();
   if(session?.completed_at)return;
   receiverClock?.sync(state.server_at,requested,performance.now());
   applyCollection(state);
  }catch{/* A server outage must not block the prototype. */}
  finally{collectionSending=false;}
 }
 window.addEventListener('storage',event=>{if(event.key==='dns-study-session'){const updated=read('dns-study-session',null);if(updated&&updated.id===session?.id){session=updated;if(updated.completed_at){entered=false;stopRecording();syncSaveButton();}else scheduleExpiry();}}});
 window.addEventListener('click',event=>{if(event.target.closest('#save-build'))complete();});
 function showStart(){
  if(!receiverClock||!collecting||(session&&!restartRequired)||dialog||!config.task?.text||!pageId)return;
  dialog=studyDialog({title:config.task.title,text:restartRequired?'Попытка завершена после паузы без действий. Чтобы продолжить подбор, начните новую попытку.':config.task.text,actionLabel:restartRequired?'Начать новую попытку':undefined,illustrated:true,onStart:()=>{dialog=null;start();}});
  document.body.append(dialog);dialog.showModal();
 }
 function bootArticle(detail){articleDetail=detail;pageId='article:'+detail.id;pageName=detail.title;const nav=(performance.getEntriesByType('navigation')[0]?.type||({1:'reload',2:'back_forward'})[performance.navigation?.type]);pageEntry(nav==='back_forward'?'browser_history':nav==='reload'?'reload':'direct');showStart();}
 function openModal(modal){
  if(!entered)return;
  const c=category(modal.id.replace(/-modal$/,''));if(!c)return;
  if(modalClock?.element===modal)return;
  if(modalClock)closeModal('category_switch');
  comparison.resetReturn();lastSelection=null;
  modalClock={...clock(),element:modal,id:uid(),category:c};listRevision=uid();
  emit('modal.open',{modal_instance_id:modalClock.id,category_id:c});
  scanOffers();
  if(intended?.destination_category===c){emit('navigation.arrive',{...navData(intended),method:intended.method,reason:'modal',category_id:c});intended=null;}
 }
 function closeModal(reason){
  comparison.resetReturn();lastSelection=null;
  if(!modalClock)return;endHover('modal_close');finishScrolls();
  emit('modal.close',{...sample(modalClock),modal_instance_id:modalClock.id,category_id:modalClock.category,reason});modalClock=null;
 }
 function modalTime(){if(!modalClock)return;const timing=sample(modalClock);if(timing.visible_ms===modalClock.savedVisible)return;modalClock.savedVisible=timing.visible_ms;emit('modal.time',{...timing,modal_instance_id:modalClock.id,category_id:modalClock.category});}
 function articleTime(complete=false){if(isArticle&&pageClock&&entered){const timing=sample(pageClock);if(!complete&&timing.visible_ms===pageClock.savedVisible)return;pageClock.savedVisible=timing.visible_ms;emit('article.time',{...timing,article_id:pageId.slice(8),name:pageName,complete});}}
 function evidenceContext(node){
  const block=node?.closest?.('[data-evidence-id]');if(!block)return {};
  return {...articleContext,category_id:articleContext.category_id||articleDetail?.evidenceCategory,article_id:pageId?.slice(8),evidence_id:block.dataset.evidenceId,evidence_kinds:JSON.parse(block.dataset.evidenceKinds),source_id:block.dataset.sourceId};
 }
 function target(element){
  if(!(element instanceof Element))return null;
  const actionable=element.closest('[data-telemetry-id],button,a[href],input,summary,[data-ds-component="catalog.card"]');
  if(!actionable||actionable.disabled||actionable.getAttribute('aria-disabled')==='true'||actionable.closest('.study-dialog,.study-recording-status,.processor-card-trial,[data-telemetry-exclude],[data-comparison-context=isolated]'))return null;
  let id=actionable.dataset.telemetryId;
  const ds=actionable.dataset.dsComponent||'';
  if(!id){
   if(actionable.id==='save-build')id='build.save';
   else if(actionable.id.startsWith('add-'))id='build.add';
   else if(actionable.id==='clear-build')id='build.clear';
   else if(ds==='catalog.remove')id='build.remove';else if(ds==='catalog.replace')id='build.replace';
   else if(actionable.matches('.processor-modal-close'))id='modal.close';
   else if(actionable.matches('.product-buttons button:not(.favorite)'))id='product.select';
   else if(actionable.matches('.favorite'))id='product.favorite';
   else if(actionable.matches('.catalog-article'))id='article.open';
   else if(actionable.matches('.catalog-articles-arrow'))id=actionable.matches('.is-previous')?'articles.previous':'articles.next';
   else if(actionable.matches('.filter-heading'))id='filter.group';
   else if(actionable.matches('.reset-chip'))id='filter.reset';
   else if(actionable.matches('.active-filter-chip'))id='filter.remove';
   else if(actionable.matches('[data-quick]'))id='filter.quick';
   else if(actionable.matches('.compatible-chip'))id='filter.compatible';
   else if(actionable.matches('[data-sort]'))id='sort.option';
   else if(actionable.matches('.sort-trigger'))id='sort.open';
   else if(actionable.matches('input[type=checkbox]'))id='filter.option';
   else if(actionable.matches('input[type=search]'))id='filter.search';
   else if(actionable.matches('.price-inputs input'))id='filter.price';
   else if(actionable.matches('.price-reset'))id='filter.price.reset';
   else if(actionable.matches('.filter-more'))id='filter.more';
   else if(actionable.matches('.all-filters'))id='filter.all';
   else if(actionable.matches('.article-lightbox-close'))id='article.image.close';
   else if(actionable.matches('.article-lightbox-next'))id='article.image.next';
   else if(actionable.matches('.article-lightbox-previous'))id='article.image.previous';
   else if(actionable.matches('.article-lightbox-thumbnail'))id='article.image.thumbnail';
   else if(actionable.matches('.club-back-top'))id='article.top';
   else if(actionable.matches('summary'))id='article.disclosure';
   else if(actionable.closest('.article-contents')&&actionable.matches('a'))id='article.contents';
   else if(actionable.matches('.article-media'))id='article.image';
   else if(actionable.matches('[data-ds-component="catalog.card"]'))id='product.card';
   else if(ds.startsWith('article.'))id=ds;
   else if(actionable.matches('a')&&new URL(actionable.href,location.href).origin===location.origin)id='page.link';
   else return null;
  }
  const modal=actionable.closest('.processor-modal'),row=actionable.closest('[id$="-row"]'),card=actionable.closest('[data-product-id]');
  const c=category((modal?.id||row?.id||'').replace(/-(modal|row)$/,''));
  const label=actionable.closest('label'),facet=actionable.closest('[data-facet],[data-filter-id]');
  const data={...placement(actionable),element_id:id,category_id:placement(actionable).category_id||c,product_id:card?.dataset.productId,article_id:actionable.closest('[data-article-id]')?.dataset.articleId,filter_id:facet?.dataset.facet||facet?.dataset.filterId,option_id:actionable.dataset.optionId||label?.dataset.value||actionable.dataset.quick||actionable.dataset.sort};
  if(id.startsWith('comparison.')){const root=actionable.closest('[data-comparison-id]');data.category_id=category(actionable.dataset.comparisonCategory||root?.dataset.comparisonCategory);data.comparison_id=root?.dataset.comparisonId||undefined;data.product_id=actionable.dataset.productId;data.name=actionable.dataset.telemetryName;data.measurement_version=1;if(root)data.products=JSON.parse(root.dataset.comparisonProducts);data.target_id=actionable.dataset.telemetryTarget;}
  if(id==='panel.category'){data.target_id=actionable.dataset.categoryId;data.action=actionable.dataset.telemetryAction;}
  if(!data.filter_id&&actionable.closest('.availability'))data.filter_id='availability';
  if(actionable.matches('input')){const cl=actionable.className;data.filter_id ||= cl.includes('filter-search')?'filter-search':cl.includes('product-search')?'product-search':undefined;for(const suffix of ['in-stock','compatible','rating','reliable','later'])if(cl.endsWith(suffix))data.filter_id=suffix==='later'?'order-later':suffix;if(cl.endsWith('-min'))data.option_id='minimum';if(cl.endsWith('-max'))data.option_id='maximum';}
  if(id==='article.open'&&!data.placement_id)data.placement_id='modal.articles';
  if(id==='article.contents'){const hash=new URL(actionable.href,location.href).hash;if(hash)data.target_id=hash;}
  if(id==='article.disclosure')data.target_id=actionable.parentElement.id||actionable.parentElement.dataset.dsComponent||'article.block';
  if(id==='article.image'){const img=actionable.querySelector('img');if(img){const path=new URL(img.dataset.src||img.currentSrc||img.src,location.href).pathname;data.target_id=path.split('/').pop();}}
  if(modalClock&&modal===modalClock.element)data.modal_instance_id=modalClock.id;
  Object.assign(data,evidenceContext(id==='article.contents'?document.getElementById(data.target_id?.slice(1)):actionable));
  if(id.startsWith('article.image.')&&actionable.closest('.article-lightbox'))data.target_id=actionable.closest('.article-lightbox').dataset.telemetryTarget;
  if(id==='article.open'){const root=actionable.closest('[data-telemetry-offer]');if(root)data.product_ids=JSON.parse(root.dataset.telemetryOffer).product_ids;}
  if(actionable.dataset.telemetryName||card?.dataset.telemetryName)data.name=actionable.dataset.telemetryName||card.dataset.telemetryName; // catalog-owned metadata, never DOM text
  return {node:actionable,data};
 }
 function interaction(){lastActionAt=now();}
 function intentFromLink(t){
  const a=t.node.closest('a');if(!a)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname&&u.hash)return;
  const path='/'+u.pathname.slice(siteBase.pathname.length);
  let dest=['/','/index.html','/new-attempt','/new-attempt/','/new-attempt/index.html'].includes(path)?'configurator':t.data.article_id?'article:'+t.data.article_id:null;
  if(!dest)return;
  const nav={navigation_id:uid(),source_page:pageId,source_category:modalClock?.category||category(new URL(location.href).searchParams.get('category'))||t.data.category_id||null,source_article:isArticle?pageId.slice(8):undefined,destination_page:dest,destination_category:category(a.dataset.returnCategory),placement_id:t.data.placement_id,list_id:t.data.list_id,offer_id:t.data.offer_id,article_id:t.data.article_id,product_ids:t.data.product_ids,target_id:t.data.target_id,action:t.data.action,element_id:t.data.element_id,method:a.dataset.telemetryMethod==='panel'?'panel':'link',at:now()};
  swrite('dns-study-navigation',nav);emit('navigation.intent',{...navData(nav),method:nav.method});
 }
 recordingListener(window,'click',event=>{
  if(!session||!entered)return;if(event.target.matches?.('.processor-modal')){lastReason='backdrop';closeReasonAt=now();}const t=target(event.target);if(!t)return;
  if(event.detail!==0&&t.node.closest('[data-telemetry-drag-suppressed="true"]'))return;
  if(['product.select','suggestion.select','comparison.select'].includes(t.data.element_id))lastSelection={...t.data,at:now(),trusted:event.isTrusted};
  if(t.data.element_id==='build.clear')clearAt=now();
  if(['article.top','article.contents','build.add','build.replace','modal.close','product.select'].includes(t.data.element_id)){const node=document.scrollingElement;finishScroll(node);programmatic.set(node,{until:performance.now()+1000});}
  t.data.origin=event.isTrusted?'user':'programmatic';interaction();lastMethod=event.isTrusted?(event.detail===0?'keyboard':'pointer'):'programmatic';emit('ui.click',{...t.data,method:lastMethod});
  if(t.data.element_id==='modal.close'){lastReason='close_button';closeReasonAt=now();}
  if(t.data.element_id==='product.select'){lastReason='selection';closeReasonAt=now();}
  if(t.data.element_id==='article.disclosure')setTimeout(()=>emit('article.disclosure',{...t.data,expanded:t.node.parentElement.open}));
  if(t.data.element_id==='filter.group')queueMicrotask(()=>emit('filter.group',{...t.data,expanded:t.node.getAttribute('aria-expanded')==='true'}));
  if(['filter.reset','filter.remove','filter.quick','filter.compatible','filter.price.reset'].includes(t.data.element_id))emit(t.data.element_id==='filter.reset'?'filter.reset':'filter.change',t.data);
  if(t.data.element_id==='sort.option')emit('sort.change',t.data);
  queueMicrotask(()=>{if(!event.defaultPrevented&&!event.cancelBubble)intentFromLink(t);});
 },true);
 recordingListener(window,'keydown',event=>{if(event.isTrusted&&event.key==='Escape'){lastReason='escape';closeReasonAt=now();}},true);
 recordingListener(window,'change',event=>{if(event.target.matches?.('.processor-filters input')){const t=target(event.target);if(t){interaction();emit('filter.change',{...t.data,origin:event.isTrusted?'user':'programmatic',selected:event.target.type==='checkbox'?event.target.checked:undefined});}}},true);
 // Hover is not used by H1/H2/H3 or journal metrics; historic records remain readable.
 function endHover(){hover=null;}
 function area(node){
  if(node===document||node===document.documentElement||node===document.body)return {node:document.scrollingElement,id:isArticle?'article.page':'configurator.page',axis:'y'};
  if(!(node instanceof Element))return null;
  if(node.dataset.telemetryScroll)return {node,id:node.dataset.telemetryScroll,axis:'x',...placement(node)};
  if(node.matches('.processor-filters'))return {node,id:'modal.filters',axis:'y'};
  if(node.matches('.processor-modal-scroll'))return {node,id:'modal.results',axis:'y'};
  if(node.matches('.catalog-articles-track'))return {node,id:'modal.articles',axis:'x'};
  if(node.matches('.article-table-scroll'))return {node,id:'article.table',axis:'x',...evidenceContext(node)};
  return null;
 }
 function markInput(event){if(!event.isTrusted||!entered||document.hidden)return;let n=event.target instanceof Element?event.target:null;let a;while(n){a=area(n);if(a)break;n=n.parentElement;}a ||= area(document);programmatic.delete(a.node);inputs.set(a.node,performance.now());}
 recordingListener(window,'wheel',markInput,{capture:true,passive:true});recordingListener(window,'touchmove',markInput,{capture:true,passive:true});recordingListener(window,'pointermove',e=>{if(e.buttons)markInput(e);},{capture:true,passive:true});recordingListener(window,'keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','PageDown','PageUp','Home','End',' '].includes(e.key))markInput(e);},true);
 const positions=new WeakMap();
 function finishScroll(node){const s=scrolls.get(node);if(!s)return;clearTimeout(s.timer);scrolls.delete(node);emit('scroll.summary',{...evidenceContext(node),placement_id:s.placement_id,list_id:s.list_id,container_id:s.id,axis:s.axis,origin:s.origin,start_px:s.start,end_px:s.end,travel_px:s.travel,duration_ms:Math.round(performance.now()-s.started),depth_pct:s.depth,scrollable_px:s.max,direction:s.forward&&s.backward?'mixed':s.forward?(s.axis==='x'?'right':'down'):(s.axis==='x'?'left':'up'),category_id:s.category||s.category_id,modal_instance_id:s.modalId,list_revision_id:s.revision});}
 function finishScrolls(){for(const node of [...scrolls.keys()])finishScroll(node);}
 recordingListener(window,'scroll',event=>{
  const a=area(event.target);if(!a)return;const pos=a.axis==='x'?a.node.scrollLeft:a.node.scrollTop;
  const previous=positions.get(a.node)??0;positions.set(a.node,pos);
  if(!session||!entered||document.hidden)return;
  const max=Math.max(0,a.axis==='x'?a.node.scrollWidth-a.node.clientWidth:a.node.scrollHeight-a.node.clientHeight);
  const auto=programmatic.get(a.node);
  if(auto&&Math.abs(pos-auto.position)<1){programmatic.delete(a.node);return;}
  if(Math.abs(pos-previous)<0.1)return;
  const origin=auto?.until>performance.now()?'programmatic':performance.now()-(inputs.get(a.node)||-Infinity)<1200?'user':'unknown';
  if(origin==='programmatic'){finishScroll(a.node);return;}
  if(origin==='user')rememberActivity();
  let s=scrolls.get(a.node);if(s&&(s.max!==max||s.origin!==origin)){finishScroll(a.node);s=null;}
  if(!s){s={...a,origin,start:previous,end:previous,travel:0,started:performance.now(),max,depth:null,category:a.category_id||modalClock?.category,modalId:modalClock?.id,revision:listRevision};scrolls.set(a.node,s);}
  const diff=pos-s.end;s.travel+=Math.abs(diff);s.forward ||= diff>0;s.backward ||= diff<0;s.end=pos;
  if(a.axis==='y'&&max)s.depth=Math.max(s.depth||0,Math.max(0,Math.min(100,pos/max*100)));
  clearTimeout(s.timer);s.timer=setTimeout(()=>finishScroll(a.node),250);
 },true);
 window.addEventListener('prototype:telemetry',event=>{
  const d=event.detail||{};
  try{
   if(d.type?.startsWith('comparison.')){comparison.handle(d);return;}
   if(d.type==='article.ready'){bootArticle(d);return;}
   if(d.type==='scroll.user'){inputs.set(d.element,performance.now());programmatic.delete(d.element);return;}
   if(d.type==='scroll.programmatic'){finishScroll(d.element);positions.set(d.element,d.position);programmatic.set(d.element,{position:d.position});return;}
   if(d.type==='modal.open')openModal(d.element);
   if(d.type==='modal.close'&&modalClock?.element===d.element)closeModal(now()-closeReasonAt<1500?lastReason:'other');
   if(d.type==='build.state'){
    const build=d.build;lastBuild=build;
    if(d.restoring)emit('build.snapshot',{build,reason:'restore'});
    else {const changes=Object.keys(build).filter(k=>build[k]?.id!==d.previous[k]?.id);if(changes.length){
     if((changes.length>1||now()-clearAt<1000)&&changes.every(k=>!build[k]))emit('build.change',{action:'clear',build});
     else changes.forEach(k=>{const selection=lastSelection&&now()-lastSelection.at<1000&&lastSelection.product_id===build[k]?.id?lastSelection:null;emit('build.change',{...(selection?{placement_id:selection.placement_id,list_id:selection.list_id,element_id:selection.element_id}:{}),...comparison.choice(selection,k),origin:selection?.trusted?'user':'unknown',category_id:k,action:!build[k]?'remove':d.previous[k]?'replace':'add',product_id:build[k]?.id||null,previous_product_id:d.previous[k]?.id||null,name:build[k]?.name||d.previous[k]?.name,build});});
    }}
    lastSelection=null;
   }
   if(d.type==='results.change'){finishScrolls();listRevision=uid();}
  }catch{ /* Instrumentation never interrupts product behavior. */ }
 });
 const exposures=new Map();
 const offers=articleOffers({emit,active:()=>entered&&collecting&&Boolean(session)&&!session.completed_at,sessionId:()=>session?.id,read:sread,write:swrite});
 function scanOffers(){offers.scan();}
 function endExposure(root,reason){const c=exposures.get(root);if(!c)return;emit('recommendation.close',{...placement(root),...sample(c),reason});exposures.delete(root);}
 const exposureObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting&&entered&&collecting&&!session?.completed_at&&!exposures.has(e.target)){exposures.set(e.target,clock());emit('recommendation.open',placement(e.target));}else if(!e.isIntersecting)endExposure(e.target,'hidden');}});
 const observed=new Set();
 function scanExposures(){for(const root of observed)if(!root.isConnected){endExposure(root,'replaced');exposureObserver.unobserve(root);observed.delete(root);}for(const root of document.querySelectorAll('[data-telemetry-exposure]'))if(!observed.has(root)){observed.add(root);exposureObserver.observe(root);}}
 const exposureMutations=new MutationObserver(scanExposures);
 function leave(){if(expireAttempt())return;offers.cancel();for(const root of exposures.keys())endExposure(root,'page_leave');if(!entered)return;swrite('dns-study-last-page',{source_page:pageId,source_article:isArticle?pageId.slice(8):undefined,source_category:modalClock?.category||null});endHover('page_leave');finishScrolls();comparison.finish();articleTime(true);closeModal('navigation');emit('page.leave',{...sample(pageClock),reason:'leave'});entered=false;stopRecording();void flush();}
 window.addEventListener('pagehide',leave);
 document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(expireAttempt())return;if(hidden){clearTimeout(sendTimer);sendTimer=null;}else{void syncCollection();scheduleExpiry();if(deliveryPending)void flush();}for(const c of exposures.values())visibility(c);visibility(pageClock);visibility(modalClock);if(!entered)return;emit('page.visibility',{visible:!hidden});if(hidden){endHover('hidden');finishScrolls();articleTime(false);modalTime();void flush();}});
 window.addEventListener('pageshow',event=>{if(event.persisted){void syncCollection();pageView=uid();sequence=0;entered=false;pageEntry('browser_history');}});

 const observer=new MutationObserver(()=>{if(hover&&!hover.node.isConnected)endHover('removed');if(isArticle&&!pageId&&window.__studyArticle)bootArticle(window.__studyArticle);});
 async function ready(){
  if(config.unavailable)showUnavailable();
  // Compatibility with HTML opened before the host gained receiver time.
  if(!receiverClock){try{const requested=performance.now(),response=await request('/api/study-config',{cache:'no-store'});if(response.ok){const fresh=await response.json();receiverClock=createReceiverClock(fresh.clock,(requested+performance.now())/2);}}catch{}}
  expireAttempt();syncSaveButton();syncOnlineListener();void flush();
  if(isArticle&&window.__studyArticle)bootArticle(window.__studyArticle);
  if(isConfig){const nav=(performance.getEntriesByType('navigation')[0]?.type||({1:'reload',2:'back_forward'})[performance.navigation?.type]);pageEntry(nav==='back_forward'?'browser_history':nav==='reload'?'reload':'direct');showStart();}
  readyComplete=true;window.__studyReady=true;
  if(window.__studySaveRequested&&session&&!session.completed_at&&entered)complete();else window.__studySaveRequested=false;
  void syncCollection();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else void ready();
}
