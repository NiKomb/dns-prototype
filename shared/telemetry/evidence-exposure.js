// One qualified exposure per page visit. Geometry and waiting stay in the browser.
export function createEvidenceExposure({active,qualify}){
 let targets=[],pending=null,timer=null,frame=null,done=false,running=false;
 const cancel=()=>{clearTimeout(timer);timer=null;pending=null;};
 function visible(target){
  const node=document.getElementById(target.target_id);
  if(!node||!node.getClientRects().length||node.closest('details:not([open])'))return false;
  const end=document.getElementById(target.end_target_id);
  if(!end||!end.getClientRects().length)return false;
  const rect=node.getBoundingClientRect(),endRect=end.getBoundingClientRect();
  const top=rect.top+rect.height*target.offset,bottom=endRect.top+endRect.height*target.end_offset;
  const visibleTop=Math.max(0,top),visibleBottom=Math.min(innerHeight/2,bottom);
  // At least half of the smaller of the area and the upper half-viewport.
  if(!(rect.width>0&&bottom>top&&visibleBottom-visibleTop>=Math.min(bottom-top,innerHeight/2)/2))return false;
  const hit=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,rect.left+rect.width/2)),(visibleTop+visibleBottom)/2);
  const root=node.closest('.article-screenshots,.article-body');
  if(!hit||!root?.contains(hit)||hit.closest('.article-product,.article-product-group'))return false;
  if(hit.tagName==='IMG'&&(!hit.complete||!hit.naturalWidth||hit.hasAttribute('data-image-pending')))return false;
  // Boundaries may be off screen and unloaded; the image actually shown must be ready.
  if(root.classList.contains('article-screenshots'))return hit.tagName==='IMG';
  return Boolean(hit.closest('[data-evidence-id]'));
 }
 function candidate(){return !document.hidden&&active()?(pending&&visible(pending.target)?pending.target:targets.find(visible)):null;}
 function check(){
  frame=null;if(!running||done)return;
  const target=candidate();
  if(pending&&target===pending.target)return;
  cancel();if(!target)return;
  pending={target,at:performance.now()};
  timer=setTimeout(()=>{
   timer=null;
   if(!running||!pending)return;
   if(candidate()!==pending.target){cancel();check();return;}
   const duration_ms=Math.floor(performance.now()-pending.at),target=pending.target;
   if(duration_ms<5000){cancel();check();return;}
   done=true;cancel();qualify({target,duration_ms});
  },5000);
 }
 function schedule(){if(frame===null)frame=requestAnimationFrame(check);}
 function visibility(){cancel();schedule();}
 const resize=new ResizeObserver(schedule);
 const listeners=[[window,'scroll',schedule,true],[window,'resize',schedule],[document,'visibilitychange',visibility],[document,'toggle',schedule,true],[document,'load',schedule,true]];
 function stop(){running=false;cancel();if(frame!==null)cancelAnimationFrame(frame);frame=null;resize.disconnect();for(const args of listeners)args[0].removeEventListener(...args.slice(1));}
 return {
  start(value){stop();targets=value;done=false;if(!targets.length)return;running=true;for(const args of listeners)args[0].addEventListener(...args.slice(1));resize.observe(document.documentElement);check();},
  stop
 };
}
