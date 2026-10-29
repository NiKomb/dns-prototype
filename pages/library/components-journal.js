import {fixtures,specimenFacts} from './journal-fixtures.js';
import {mountJournal} from '../../shared/journal/views.js';
const root=document.querySelector('#journal-specimens');

mountJournal(root,{initial:fixtures,specimenFacts,specimensOnly:true,compactSpecimens:true,navigate(section,id){const key=id?'Прохождение':({overview:'metric',hypotheses:'hypothesis',scenarios:'H2',sessions:'sessions'}[section]||'metric');const group=root.querySelector(`[data-component-group="${key}"]`);if(group){group.scrollIntoView({block:'start'});group.tabIndex=-1;group.focus({preventScroll:true});}}});
const section=document.querySelector('#journal-system');
const toggle=root.querySelector('#journal-specimen-theme');toggle.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';section.dataset.theme=root.dataset.theme;toggle.textContent=root.dataset.theme==='dark'?'Светлая тема':'Тёмная тема';});
