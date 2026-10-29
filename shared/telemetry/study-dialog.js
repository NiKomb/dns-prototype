import {lucideMarkup} from '../journal/icons/lucide.js';
import '../catalog/action-button.js';
let studyStatusSequence=0;
// One component for the study entrance and its library specimen. No analytics here.
export function studyDialog({title, text, onStart, specimen=false, completed=false, actionLabel, titleId, illustrated=false}) {
  const dialog=document.createElement('dialog'); dialog.className='study-dialog';
  dialog.dataset.dsComponent=completed?'study.complete':'study.start';
  dialog.dataset.dsVariant=illustrated?'illustrated':'plain';
  if(illustrated)dialog.classList.add('study-dialog-illustrated',completed?'study-dialog-complete-art':'study-dialog-start-art');
  const h=document.createElement('h2'); h.textContent=title; h.id=titleId||((completed?'study-complete-title':'study-title')+(illustrated?'-illustrated':''));
  dialog.setAttribute('aria-labelledby',h.id);
  const body=document.createElement('p'); body.textContent=text;body.id=h.id+'-description';dialog.setAttribute('aria-describedby',body.id);
  const start=catalogActionButton({label:actionLabel||(completed?'Понятно':'Начать'),variant:'brand'});start.classList.add('study-start');
  const header=document.createElement('div');header.className='study-dialog-header';
  const footer=document.createElement('div');footer.className='study-dialog-footer';
  header.append(h,body);footer.append(start);dialog.append(header,footer);
  if(illustrated){
    const art=document.createElement('span');art.className='study-dialog-art';art.setAttribute('aria-hidden','true');
    const image=document.createElement('img');image.alt='';image.width=completed?1536:1048;image.height=completed?1024:590;
    if(!specimen&&!completed)image.fetchPriority='high';
    const src=new URL(completed?'../../assets/shared/study/optimized/8e6ff5d7c1417383.webp':'../../assets/shared/study/optimized/c274ebd112dc4837.webp',import.meta.url).href;
    art.append(image);dialog.append(art);
    if(globalThis.prototypeImages)prototypeImages.defer(image,src,{eager:!specimen});
    else {image.decoding='async';image.loading=specimen?'lazy':'eager';image.src=src;}
  }
  start.addEventListener('click',()=>{onStart?.();if(!specimen){dialog.close();globalThis.prototypeImages?.release(dialog);dialog.remove();}});
  dialog.addEventListener('cancel',event=>event.preventDefault());
  // Repeated Escape can bypass cancel prevention in native dialog close watchers.
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();}});
  if(specimen){dialog.setAttribute('open','');dialog.classList.add('study-specimen');}
  return dialog;
}
// Same save-button state in the configurator and the component library.
export function updateSaveButton(button,completed){
  if(!button)return;
  button.dataset.dsComponent='study.save';
  button.textContent=completed?'Сохранено':'Сохранить';button.disabled=Boolean(completed);
}

export function studyCompleteDialog({specimen=false,illustrated=true}={}) {
  return studyDialog({title:'Сборка сохранена',text:'Спасибо за участие! Прохождение завершено.',completed:true,specimen,illustrated});
}

export function studyUnavailableDialog({specimen=false,pending=false}={}) {
  const root=document.createElement('div');root.className='study-recording-status';root.dataset.dsComponent='study.unavailable';
  root.dataset.state=pending?'pending':'unavailable';
  if(specimen)root.classList.add('study-status-specimen');else root.setAttribute('popover','manual');
  const trigger=catalogActionButton({label:'',variant:'brand'});trigger.classList.add('study-status-trigger');
  trigger.setAttribute('aria-label',pending?'Ожидающая отправка событий':'Запись прохождения недоступна');
  trigger.setAttribute('aria-expanded','false');trigger.innerHTML=lucideMarkup['refresh-cw'];
  trigger.querySelector('svg').classList.add('refresh-icon-spinning');trigger.querySelector('svg').setAttribute('aria-hidden','true');
  const message=document.createElement('section');message.className='study-status-message';message.setAttribute('popover','auto');
  message.setAttribute('role','status');message.id=`study-recording-message-${++studyStatusSequence}`;trigger.setAttribute('aria-controls',message.id);
  const title=document.createElement('h2');title.textContent='Запись прохождения недоступна';
  const text=document.createElement('p');text.textContent=pending?'Отправка событий пока не подтверждена. Данные остаются в этом браузере; отправка повторится при восстановлении связи.':'Сейчас действия не записываются. Подбор деталей доступен. Чтобы начать записываемое прохождение, обновите страницу после восстановления сервиса.';
  message.append(title,text);root.append(trigger,message);
  const events=new AbortController();
  function position(){const r=trigger.getBoundingClientRect(),width=message.getBoundingClientRect().width;message.style.left=Math.max(16,Math.min(r.left-width-8,innerWidth-width-16))+'px';message.style.top=Math.max(16,Math.min(r.top,innerHeight-message.getBoundingClientRect().height-16))+'px';}
  trigger.addEventListener('click',()=>{if(message.matches(':popover-open'))message.hidePopover();else{message.showPopover();position();}});
  message.addEventListener('toggle',()=>trigger.setAttribute('aria-expanded',String(message.matches(':popover-open'))));
  root.addEventListener('keydown',event=>{if(event.key==='Escape' && message.matches(':popover-open')){event.preventDefault();event.stopPropagation();message.hidePopover();trigger.focus();}});
  window.addEventListener('resize',()=>{if(message.matches(':popover-open'))position();},{signal:events.signal});
  document.addEventListener('toggle',event=>{if(!specimen && event.target instanceof HTMLDialogElement && event.target.open && root.isConnected){root.hidePopover();root.showPopover();}},{capture:true,signal:events.signal});
  root.show=()=>{if(!specimen)root.showPopover();};
  root.destroy=()=>{events.abort();if(message.matches(':popover-open'))message.hidePopover();if(!specimen && root.matches(':popover-open'))root.hidePopover();root.remove();};
  return root;
}
