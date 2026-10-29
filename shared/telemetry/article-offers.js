import {uid,category} from './registry.js';
// Offers are output states, never human actions. Persist the last semantic state
// per attempt/tab/placement/category so reload and DOM replacement reuse its ID.
export function articleOffers({emit,active,sessionId,read,write}){
 const cards=new Map();
 let memory=null;
 const load=()=>{if(memory?.session_id!==sessionId()){
  const saved=read('dns-study-offers');memory=saved?.session_id===sessionId()?saved:{session_id:sessionId(),last:{},seen:{}};
 }return memory;};
 function cancel(){for(const entry of cards.values()){clearTimeout(entry.timer);entry.timer=null;}}
 function offer(root){
  if(!active()||root.closest('.processor-modal[hidden]'))return;
  let data;try{data=JSON.parse(root.dataset.telemetryOffer);}catch{return;}
  const category_id=category(root.dataset.categoryId);if(!category_id)return;
  const placement_id=root.dataset.telemetryPlacement;
  const key=placement_id+':'+category_id,state=load();
  const fingerprint=JSON.stringify([data.article_ids,[...data.product_ids].sort(),data.compatible]);
  let item=state.last[key];
  if(!item||item.fingerprint!==fingerprint){
   item={fingerprint,id:uid()};state.last[key]=item;write('dns-study-offers',state);
   emit('articles.offer',{...data,category_id,placement_id,offer_id:item.id,list_id:item.id,measurement_version:1});
  }
  root.dataset.telemetryOfferId=item.id;
 }
 function schedule(node,entry){
  const covered=!node.closest('.processor-modal')&&document.querySelector('.processor-modal:not([hidden])');
  if(!entry.visible||!active()||document.hidden||node.closest('[hidden]')||covered){clearTimeout(entry.timer);entry.timer=null;return;}
  const root=node.closest('[data-telemetry-offer]');if(!root?.dataset.telemetryOfferId)return;
  const offer_id=root.dataset.telemetryOfferId,article_id=node.dataset.articleId;
  const key=offer_id+':'+article_id;
  if(entry.timer&&entry.key===key)return;
  clearTimeout(entry.timer);entry.timer=null;entry.key=key;
  if(load().seen[key])return;
  // Continuous >=50% intersection for 500ms while foregrounded. It is a
  // visibility observation, not reading, noticing or understanding.
  entry.timer=setTimeout(()=>{
   entry.timer=null;
   if(!active()||document.hidden||!node.isConnected||!entry.visible||node.closest('[hidden]')||!node.closest('.processor-modal')&&document.querySelector('.processor-modal:not([hidden])')||root.dataset.telemetryOfferId!==offer_id)return;
   const state=load(),key=offer_id+':'+article_id;if(state.seen[key])return;
   state.seen[key]=true;write('dns-study-offers',state);
   emit('articles.visible',{offer_id,list_id:offer_id,article_id,category_id:category(root.dataset.categoryId),placement_id:root.dataset.telemetryPlacement,duration_ms:500,measurement_version:1});
  },500);
 }
 const observer=new IntersectionObserver(entries=>{for(const e of entries){const entry=cards.get(e.target);if(entry){entry.visible=e.isIntersecting&&e.intersectionRatio>=.5;schedule(e.target,entry);}}},{threshold:[0,.5]});
 function scan(){
  document.querySelectorAll('[data-telemetry-offer]').forEach(offer);
  for(const [node,entry]of cards)if(!node.isConnected){clearTimeout(entry.timer);observer.unobserve(node);cards.delete(node);}
  for(const node of document.querySelectorAll('[data-telemetry-offer] [data-article-id]')){
   if(!cards.has(node)){cards.set(node,{visible:false,timer:null});observer.observe(node);}
   else schedule(node,cards.get(node));
  }
 }
 const mutations=new MutationObserver(scan);
 function onVisibility(){cancel();if(!document.hidden)scan();}
 function stop(){cancel();mutations.disconnect();observer.disconnect();cards.clear();document.removeEventListener('visibilitychange',onVisibility);}
 function resume(){mutations.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-telemetry-offer','hidden']});document.addEventListener('visibilitychange',onVisibility);scan();}
 return {scan,cancel,stop,resume};
}
