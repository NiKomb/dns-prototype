// Library-only processor variant. The ordinary factory and catalog objects stay authoritative.
const processorCardTrial = (() => {
  function element(tag,className,text) {
    const node=document.createElement(tag);node.className=className;
    if(text!=null)node.textContent=text;
    return node;
  }
  function chevron() {
    const icon=element('span','processor-trial-chevron');icon.setAttribute('aria-hidden','true');return icon;
  }
  function create({product,selected=null,mode='features'}) {
    if(product.category!=='processor')throw new Error('Processor trial requires a processor');
    const card=catalogUI.component('card',product);
    card.classList.add('processor-card-trial');
    card.dataset.trialLayout='table';
    card.setAttribute('aria-label',`Пробная карточка: ${product.name}`);
    card.append(element('span','processor-trial-test-tag','Тест'));
    const features=card.querySelector('.product-specs');features.classList.add('processor-trial-layer');
    const differences=element('section','product-specs processor-trial-differences processor-trial-layer');features.after(differences);
    const noHover=matchMedia('(hover: none)');
    let currentSelected,enabled=false,active=false,hovered=false,focused=false,showTimer=null,hideTimer=null,showing=false,destroyed=false;
    function cancelTimers() {clearTimeout(showTimer);clearTimeout(hideTimer);showTimer=hideTimer=null;}
    function allowed() {return !destroyed && enabled && currentSelected && active && !card.hidden && card.isConnected;}
    function show(value) {
      showing=Boolean(value && allowed());card.dataset.trialView=showing?'differences':'features';
      for(const [layer,visible] of [[features,!showing],[differences,showing]]) {
        layer.classList.toggle('is-active',visible);layer.inert=!visible;layer.setAttribute('aria-hidden',String(!visible));
      }
    }
    function reconcile() {
      if(!allowed()){cancelTimers();show(false);return;}
      if(focused || noHover.matches){cancelTimers();show(true);return;}
      if(hovered) {
        clearTimeout(hideTimer);hideTimer=null;
        if(!showing && showTimer===null)showTimer=setTimeout(()=>{showTimer=null;if(hovered && allowed())show(true);},300);
      } else {
        clearTimeout(showTimer);showTimer=null;
        if(showing && hideTimer===null)hideTimer=setTimeout(()=>{hideTimer=null;if(!hovered && !focused && !noHover.matches)show(false);},150);
      }
    }
    function renderDifferences(selected) {
      differences.replaceChildren();
      if(selected) {
        const provenRows=productContract.rows('processor',[selected,product],true);
        const table=element('table','processor-trial-table');
        table.setAttribute('aria-label','Различия с выбранным процессором');
        const columns=element('colgroup','');
        for(let index=0;index<3;index++)columns.append(element('col',''));
        const head=element('thead',''),heading=element('tr','');
        for(const [index,title] of ['Различие',product.model ?? product.name,selected.model ?? selected.name].entries()) {
          const cell=element('th','');cell.scope='col';cell.title=title;
          if(index===1) {
            const content=element('span','processor-trial-column-heading');
            content.append(element('span','processor-trial-column-name',title),chevron());cell.append(content);
          } else cell.textContent=title;
          heading.append(cell);
        }
        head.append(heading);
        const body=element('tbody','');
        // Model names are already shown in the table header.
        const rows=provenRows.filter(row=>row.key!=='model').slice(0,5);
        if(rows.length) {
          for(const row of rows) {
            const line=element('tr','processor-trial-value');line.dataset.field=row.key;
            const name=element('th','');name.scope='row';
            const label=element('span','processor-trial-field',row.title);label.title=row.title;name.append(label);line.append(name);
            for(const value of [row.values[1],row.values[0]]){const cell=element('td','',value);cell.title=value;line.append(cell);}
            body.append(line);
          }
        } else {
          const line=element('tr',''),empty=element('td','processor-trial-empty','Нет различий');empty.colSpan=3;line.append(empty);body.append(line);
        }
        table.append(columns,head,body);differences.append(table);
      }
    }
    const enter=event=>{if(event.pointerType!=='touch'){hovered=true;reconcile();}};
    const leave=event=>{if(event.pointerType!=='touch'){hovered=false;reconcile();}};
    const focusIn=()=>{focused=true;reconcile();};
    const focusOut=event=>{if(!card.contains(event.relatedTarget)){focused=false;reconcile();}};
    card.addEventListener('pointerenter',enter);card.addEventListener('pointerleave',leave);
    card.addEventListener('focusin',focusIn);card.addEventListener('focusout',focusOut);
    noHover.addEventListener('change',reconcile);
    card.updateTrial=({selected=null,mode='features',active:nextActive=true}={})=>{
      if(destroyed)return;
      if(selected!==currentSelected){currentSelected=selected;renderDifferences(selected);}
      enabled=mode==='differences';
      if(active!==nextActive) {
        active=nextActive;
        hovered=active && card.matches(':hover') && !noHover.matches;
        focused=active && card.contains(document.activeElement);
      }
      reconcile();
    };
    card.destroyTrial=()=>{
      destroyed=true;cancelTimers();
      card.removeEventListener('pointerenter',enter);card.removeEventListener('pointerleave',leave);
      card.removeEventListener('focusin',focusIn);card.removeEventListener('focusout',focusOut);
      noHover.removeEventListener('change',reconcile);
    };
    show(false);card.updateTrial({selected,mode,active:false});
    return card;
  }
  catalogUI.components.processorComparisonCard={id:'processorComparisonCard',title:'Пробная карточка процессора · различия с выбранным',context:'processor-card-trial',create};

  return {create};
})();
