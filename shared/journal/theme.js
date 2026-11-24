import './loading.js';
import {icon} from './components.js';

const themes=new WeakMap();
// The page supplies the initial theme when there is no saved manual choice.
export function initializeJournalTheme(root,control,key='journal-demo-theme'){
 let state=themes.get(root);
 if(!state){
  const saved=window.journalLoading.readSavedTheme(key);
  state={control:null,apply(theme){
   root.dataset.theme=theme;
   if(root===document.body)document.documentElement.dataset.theme=theme;
   if(state.control){
    const dark=theme==='dark';
    state.control.replaceChildren(icon(dark?'sun':'moon'));
    state.control.setAttribute('aria-label',dark?'Включить светлую тему':'Включить тёмную тему');
    state.control.title=dark?'Светлая тема':'Тёмная тема';
   }
  }};
  themes.set(root,state);
  state.apply(saved||root.dataset.theme||'light');
 }
 if(control&&state.control!==control){
  state.control=control;
  control.addEventListener('click',()=>{
   const theme=root.dataset.theme==='dark'?'light':'dark';state.apply(theme);
   try{localStorage.setItem(key,theme);}catch{}
  });
  state.apply(root.dataset.theme);
 }
}
