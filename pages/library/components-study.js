import {studyDialog,studyCompleteDialog,studyUnavailableDialog,updateSaveButton} from '../../shared/telemetry/study-dialog.js';
const task=await fetch('telemetry/task.json').then(r=>r.json());
document.querySelector('#ds-study-start').append(studyDialog({...task,specimen:true}));
document.querySelector('#ds-study-complete').append(studyCompleteDialog({specimen:true,illustrated:false}));

// Journal specimens live in components-journal.js and share the approved UI.

document.querySelector('#ds-study-unavailable').append(studyUnavailableDialog({specimen:true}));

document.querySelector('#ds-study-pending').append(studyUnavailableDialog({specimen:true,pending:true}));

document.querySelector('#ds-study-start-illustrated').append(studyDialog({...task,specimen:true,illustrated:true}));
document.querySelector('#ds-study-complete-illustrated').append(studyCompleteDialog({specimen:true}));

for(const completed of [false,true]) {
  const actions=catalogUI.component('buildSummary').querySelector('.summary-actions');
  const save=actions.querySelector('[data-telemetry-id="build.save"]');
  updateSaveButton(save,completed);
  save.addEventListener('click',()=>updateSaveButton(save,true));
  actions.querySelector('#clear-build').addEventListener('click',()=>updateSaveButton(save,false));
  libraryUI.sample('#ds-study-save','study.save','Действия сборки',actions,{state:completed?'Сохранено':'Сохранить',context:'ds-main-sample'});
}
