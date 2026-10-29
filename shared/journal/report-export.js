import {node,button,iconButton} from './components.js';

// Export uses already loaded journal data. No fetch, recalculation or server writes.
export function exportControl(onSelect){
 const root=node('div',null,'journal-export'),trigger=iconButton('Экспорт','download',()=>{list.hidden=!list.hidden;trigger.setAttribute('aria-expanded',String(!list.hidden));if(!list.hidden)list.firstElementChild.focus();});
 const list=node('div',null,'dropdown-options journal-export-options');list.hidden=true;list.setAttribute('role','menu');list.setAttribute('aria-label','Формат экспорта');trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');
 const close=()=>{list.hidden=true;trigger.setAttribute('aria-expanded','false');};
 for(const [format,label]of [['md','Markdown (.md)'],['pdf','PDF (печать)'],['json','JSON (.json)']]){const item=button(label,()=>{close();trigger.focus();onSelect(format);},'dropdown-option','export-option');item.setAttribute('role','menuitem');list.append(item);}
 root.append(trigger,list);root.closeExport=close;
 root.addEventListener('keydown',event=>{const choices=[...list.children],i=choices.indexOf(document.activeElement);if(event.key==='Escape'){event.preventDefault();close();trigger.focus();}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();list.hidden=false;trigger.setAttribute('aria-expanded','true');choices[event.key==='Home'?0:event.key==='End'?choices.length-1:i<0?(event.key==='ArrowUp'?choices.length-1:0):(i+(event.key==='ArrowUp'?-1:1)+choices.length)%choices.length].focus();}else if(event.key==='Tab')close();});
 root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget))close();});return root;
}
document.addEventListener('click',event=>{for(const menu of document.querySelectorAll('.journal-ui .journal-export'))if(!menu.contains(event.target))menu.closeExport();});

export function saveReport(text,filename,type){const url=URL.createObjectURL(new Blob([text],{type})),a=node('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

function cleanView(view){
 const clone=view.cloneNode(true);
 for(const e of clone.querySelectorAll('.segments,.approved-pager,.approved-related-scenario,.approved-materials-more,.field,input,select,textarea,dialog,script,style,.journal-icon,svg'))e.remove();
 for(const tooltip of clone.querySelectorAll('.journal-tooltip')){const text=tooltip.querySelector('[role=tooltip]')?.textContent;if(text)tooltip.replaceWith(node('p',text,'export-rule'));else tooltip.remove();}
 for(const e of clone.querySelectorAll('button,a')){const keep=e.closest('table,.metric,.approved-flow,.approved-review,.approved-material,.approved-hypothesis')||e.dataset.groupName||e.dataset.sessionId; if(keep){const replacement=node(e.matches('.approved-hypothesis,.approved-material')?'div':'span',null,e.className);replacement.append(...e.childNodes);e.replaceWith(replacement);}else e.remove();}
 for(const e of clone.querySelectorAll('details'))e.open=true;
 for(const e of clone.querySelectorAll('[hidden]'))e.removeAttribute('hidden');
 for(const e of clone.querySelectorAll('*'))for(const attr of [...e.attributes])if(!['class','open','colspan','rowspan'].includes(attr.name))e.removeAttribute(attr.name);
 return clone;
}
const plain=e=>e.textContent.replace(/\s+/g,' ').trim();
const escapeMarkdown=text=>text.replace(/\\/g,'\\\\').replace(/([`*_\[\]<>])/g,'\\$1');
function markdown(e){
 if(e.nodeType===Node.TEXT_NODE)return escapeMarkdown(e.textContent);
 if(e.nodeType!==Node.ELEMENT_NODE)return '';
 const tag=e.tagName.toLowerCase(),content=()=>[...e.childNodes].map(markdown).join('');
 if(tag==='table'){const rows=[...e.rows].map(row=>[...row.cells].map(cell=>escapeMarkdown(plain(cell)).replace(/\|/g,'\\|')));if(!rows.length)return '';return '\n\n'+[rows[0],rows[0].map(()=> '---'),...rows.slice(1)].map(row=>'| '+row.join(' | ')+' |').join('\n')+'\n\n';}
 if(/^h[1-6]$/.test(tag))return '\n\n'+'#'.repeat(Math.min(6,Number(tag[1])+1))+' '+escapeMarkdown(plain(e))+'\n\n';
 if(tag==='li')return '\n- '+content().trim()+'\n';
 if(['p','summary','dt','dd'].includes(tag))return '\n\n'+content().trim()+'\n\n';
 if(tag==='strong')return '**'+content()+'** ';
 if(tag==='br')return '\n';
 return ['div','section','article','ul','ol','details'].includes(tag)?'\n\n'+content()+'\n\n':content()+' ';
}
export function reportDocument({title,context,sections}){
 const article=node('article');article.append(node('h1',title),node('p',context));
 for(const [label,view]of sections){article.append(node('h2',label),cleanView(view));}
 return {article,markdown:'# '+escapeMarkdown(title)+'\n\n'+escapeMarkdown(context)+'\n\n'+sections.map(([label,view])=>'## '+label+'\n\n'+markdown(cleanView(view))).join('\n\n').replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim()+'\n'};
}
export function printReport(report,popup=window.open('','_blank')){
 if(!popup||popup.closed)return false;
 popup.document.open();popup.document.write('<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Отчёт журнала</title><style>body{font:14px/1.5 Arial,sans-serif;color:#222;background:white;margin:32px}h1{font-size:26px}h2{font-size:21px;margin-top:28px}h3{font-size:17px}table{border-collapse:collapse;width:100%;font-size:12px;margin:12px 0}th,td{border:1px solid #ccc;padding:6px;text-align:left;vertical-align:top;overflow-wrap:anywhere}p{margin:8px 0}strong{font-weight:700}.metric{margin:14px 0;padding:8px;border-bottom:1px solid #ddd}.metric>strong{font-size:22px;display:block}.export-rule{font-size:12px;color:#555}summary{font-weight:bold}section{margin-bottom:20px}li{margin:6px 0}button{font:inherit;padding:8px 12px;cursor:pointer}@page{margin:15mm}@media print{body{margin:0}body>button{display:none}h1,h2,h3,summary{break-after:avoid}tr,.metric{break-inside:avoid}thead{display:table-header-group}}</style></head><body></body></html>');popup.document.close();
 const retry=popup.document.createElement('button');retry.textContent='Печать / сохранить как PDF';retry.addEventListener('click',()=>popup.print());popup.document.body.append(retry,popup.document.importNode(report.article,true));popup.focus();popup.requestAnimationFrame(()=>popup.print());return true;
}
