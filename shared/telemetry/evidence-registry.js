// Audited content boundaries, using existing permanent block IDs. No text matching
// or positional IDs at runtime. A mixed section keeps both roles.
const range=(start,end,kinds,endOffset=0)=>({start,end,kinds,endOffset});
export const evidenceSections={
 'dns-103315':[range('ryzen-7500f-11fo-0','ryzen-7500f-11gq-0',['conditions']),range('ryzen-7500f-11gq-0','ryzen-7500f-11nv-0',['results'])],
 'dns-141994':[range('sub_Testovyii__stend','sub_Rezultatyi__testirovaniya__benchmarki__i__programmyi__',['conditions']),range('sub_Rezultatyi__testirovaniya__benchmarki__i__programmyi__','sub_Vyivodyi',['results'])],
 'dns-92557':[range('ryzen-5600x-vs-i5-12400-1en7-0','ryzen-5600x-vs-i5-12400-1eqj-0',['conditions']),range('ryzen-5600x-vs-i5-12400-1eqj-0','ryzen-5600x-vs-i5-12400-1evt-0',['results'])],
 'dns-138041':[range('ryzen-9900x-comparison-1e2d-0','ryzen-9900x-comparison-1e63-0',['conditions']),range('ryzen-9900x-comparison-1e6x-0','ryzen-9900x-comparison-1eel-0',['results'])],
 'dns-132817':[range('ryzen-7700-035','ryzen-7700-058',['results','conditions']),range('ryzen-7700-058','ryzen-7700-093',['results'])],
 'dns-154533':[range('b850-matx-comparison-1ffr-0','b850-matx-comparison-1fik-0',['results','conditions']),range('b850-matx-comparison-1fik-0','b850-matx-comparison-1flz-0',['results'])],
 'dns-144656':[range('msi-b850-gaming-plus-wifi-150b-0','msi-b850-gaming-plus-wifi-151x-0',['results','conditions'])],
 'dns-117615':[range('msi-b550-a-pro-14ba-0','msi-b550-a-pro-14c2-0',['results','conditions'])],
 'dns-164524':[range('msi-mag-b650-tomahawk-wifi-14ij-0','msi-mag-b650-tomahawk-wifi-14j7-0',['results','conditions'])],
 'dns-119652':[range('psu-600-650-comparison-15io-0','psu-600-650-comparison-15iu-0',['conditions']),range('psu-600-650-comparison-15iu-0','psu-600-650-comparison-15sx-0',['results'])],
 'dns-164746':[range('psu-850-comparison-16j6-0','psu-850-comparison-16ji-0',['conditions']),range('psu-850-comparison-16ji-0','psu-850-comparison-16ti-0',['results'])],
 'dns-167463':[range('psu-700-750-comparison-18eb-0','psu-700-750-comparison-18en-0',['conditions']),range('psu-700-750-comparison-18en-0','psu-700-750-comparison-18kk-0',['results'])],
 'dns-168919':[range('ardor-element-w4-1k7s-0','ardor-element-w4-1kbj-0',['results','conditions'])],
 'dns-169987':[range('gamdias-aura-gc101m-1l33-0','gamdias-aura-gc101m-1l54-0',['results','conditions'])],
 'dns-177554':[range('deepcool-cg590u-5f-1kod-0','deepcool-cg590u-5f-1kp0-0',['results','conditions'])]
};
// Additional scope explicitly approved by the owner: specifications and hardware construction.
// Keep these roles distinct from test conditions/results in recorded events.
export const hardwareEvidenceSections={
 'dns-103315':[range('ryzen-7500f-11ax-0','ryzen-7500f-11fo-0',['characteristics'])],
 'dns-141994':[range('sub_Podrobnee__o__Ryzen__7__9800X3D','sub_Testovyii__stend',['characteristics','construction'])],
 'dns-92557':[range('ryzen-5600x-vs-i5-12400-1eli-0','ryzen-5600x-vs-i5-12400-1en7-0',['characteristics'])],
 'dns-132817':[range('ryzen-7700-002','ryzen-7700-004',['characteristics']),range('ryzen-7700-004','ryzen-7700-021',['construction'])],
 'dns-154533':[range('b850-matx-comparison-1f04-0','b850-matx-comparison-1f1n-0',['characteristics']),range('b850-matx-comparison-1f37-0','b850-matx-comparison-1ffr-0',['construction'])],
 'dns-144656':[range('msi-b850-gaming-plus-wifi-14o7-0','msi-b850-gaming-plus-wifi-14ps-0',['characteristics']),range('msi-b850-gaming-plus-wifi-14ql-0','msi-b850-gaming-plus-wifi-14rr-0',['construction'])],
 'dns-117615':[range('msi-b550-a-pro-146c-0','msi-b550-a-pro-147t-0',['characteristics']),range('msi-b550-a-pro-1488-0','msi-b550-a-pro-14a8-0',['construction'])],
 'dns-164524':[range('msi-mag-b650-tomahawk-wifi-14ha-0','msi-mag-b650-tomahawk-wifi-14hy-0',['characteristics']),range('msi-mag-b650-tomahawk-wifi-14hy-0','msi-mag-b650-tomahawk-wifi-14ij-0',['construction'])],
 'dns-119652':[range('psu-600-650-comparison-1585-0','psu-600-650-comparison-15c0-0',['characteristics']),range('psu-600-650-comparison-15c0-0','psu-600-650-comparison-15io-0',['construction'])],
 'dns-164746':[range('psu-850-comparison-161x-0','psu-850-comparison-166f-0',['characteristics']),range('psu-850-comparison-166f-0','psu-850-comparison-16j5-0',['construction'])],
 'dns-167463':[range('psu-700-750-comparison-180z-0','psu-700-750-comparison-183z-0',['characteristics']),range('psu-700-750-comparison-183z-0','psu-700-750-comparison-18ea-0',['construction'])],
 'dns-168919':[range('ardor-element-w4-1jyo-0','ardor-element-w4-1k32-0',['characteristics']),range('ardor-element-w4-1k32-0','ardor-element-w4-1k7s-0',['construction'])],
 'dns-169987':[range('gamdias-aura-gc101m-1ktg-0','gamdias-aura-gc101m-1kx2-0',['characteristics']),range('gamdias-aura-gc101m-1kx2-0','gamdias-aura-gc101m-1l33-0',['construction'])],
 'dns-177554':[range('deepcool-cg590u-5f-1khl-0','deepcool-cg590u-5f-1khw-0',['characteristics']),range('deepcool-cg590u-5f-1kia-0','deepcool-cg590u-5f-1knu-0',['construction'])]
};
// Content-based areas in reference/how-to articles: inspect the blocks, not the genre.
// endOffset=1 includes a final table/paragraph without adding a synthetic DOM sentinel.
export const contentEvidenceSections={
 'dns-18432':[
  range('choose-case-1hzr-0','choose-case-1i0j-0',['characteristics']),
  range('choose-case-1i0v-0','choose-case-1i5b-0',['compatibility']),
  range('choose-case-1i5n-0','choose-case-1i65-0',['construction','characteristics']),
  range('choose-case-1i65-0','choose-case-1i66-0',['compatibility','construction']),
  range('choose-case-1i6l-0','choose-case-1i7p-0',['construction','compatibility']),
  range('choose-case-1i81-0','choose-case-1i8c-0',['characteristics','comparison']),
  range('choose-case-1i8c-0','choose-case-1i8r-0',['construction','compatibility']),
  range('choose-case-1i93-0','choose-case-1i9m-0',['construction'])],
 'dns-18597':[
  range('choose-cpu-1frg-0','choose-cpu-1frg-0',['characteristics'],1),
  range('choose-cpu-1fsf-0','choose-cpu-1ft5-0',['characteristics','construction']),
  range('choose-cpu-1ft5-0','choose-cpu-1fu6-0',['characteristics','comparison']),
  range('choose-cpu-1fu6-0','choose-cpu-1fxt-0',['compatibility']),
  range('choose-cpu-1fxt-0','choose-cpu-1fy6-0',['construction','characteristics']),
  range('choose-cpu-1fy6-0','choose-cpu-1g2i-0',['comparison','characteristics']),
  range('choose-cpu-1g2i-0','choose-cpu-1g2u-0',['compatibility','characteristics']),
  range('choose-cpu-1g2u-0','choose-cpu-1g2y-0',['characteristics','compatibility']),
  range('choose-cpu-1g2y-0','choose-cpu-1g3l-0',['characteristics'])],
 'dns-14990':[
  range('choose-gpu-1gx4-0','choose-gpu-1h0e-0',['construction','comparison']),
  range('choose-gpu-1h0e-0','choose-gpu-1h20-0',['comparison','characteristics']),
  range('choose-gpu-1h20-0','choose-gpu-1h4k-0',['characteristics','comparison']),
  range('choose-gpu-1h4k-0','choose-gpu-1h61-0',['compatibility','comparison']),
  range('choose-gpu-1h61-0','choose-gpu-1h7z-0',['compatibility','comparison']),
  range('choose-gpu-1h7z-0','choose-gpu-1h9o-0',['compatibility','comparison']),
  range('choose-gpu-1h9o-0','choose-gpu-1hau-0',['construction','comparison']),
  range('choose-gpu-1hau-0','choose-gpu-1hb2-0',['compatibility']),
  range('choose-gpu-1hb2-0','choose-gpu-1hc8-0',['compatibility','characteristics']),
  range('choose-gpu-1hc8-0','choose-gpu-1hck-0',['compatibility'])],
 'dns-15175':[
  range('choose-motherboard-1g8z-0','choose-motherboard-1gad-0',['compatibility']),
  range('choose-motherboard-1gad-0','choose-motherboard-1gc7-0',['characteristics','comparison']),
  range('choose-motherboard-1gc7-0','choose-motherboard-1gck-0',['characteristics','compatibility']),
  range('choose-motherboard-1gck-0','choose-motherboard-1gdm-0',['construction','characteristics']),
  range('choose-motherboard-1gdm-0','choose-motherboard-1ge7-0',['construction','characteristics']),
  range('choose-motherboard-1ge7-0','choose-motherboard-1ghi-0',['characteristics','compatibility']),
  range('choose-motherboard-1gip-0','choose-motherboard-1gk1-0',['compatibility'])],
 'dns-14934':[
  range('choose-power-supply-1hh7-0','choose-power-supply-1hi4-0',['characteristics','construction']),
  range('choose-power-supply-1hi4-0','choose-power-supply-1hj3-0',['characteristics','comparison']),
  range('choose-power-supply-1hjc-0','choose-power-supply-1hjc-0',['compatibility'],1),
  range('choose-power-supply-1hjo-0','choose-power-supply-1hkd-0',['compatibility']),
  range('choose-power-supply-1hkd-0','choose-power-supply-1hmq-0',['construction','compatibility','characteristics']),
  range('choose-power-supply-1hmq-0','choose-power-supply-1hn6-0',['compatibility']),
  range('choose-power-supply-1hn6-0','choose-power-supply-1ho7-0',['construction']),
  range('choose-power-supply-1ho7-0','choose-power-supply-1hpx-0',['construction','characteristics']),
  range('choose-power-supply-1hpx-0','choose-power-supply-1hpz-0',['characteristics']),
  range('choose-power-supply-1hq4-0','choose-power-supply-1hss-0',['comparison','characteristics']),
  range('choose-power-supply-1hss-0','choose-power-supply-1ht9-0',['construction','compatibility']),
  range('choose-power-supply-1hta-0','choose-power-supply-1hub-0',['compatibility']),
  range('choose-power-supply-1hub-0','choose-power-supply-1hvd-0',['construction','compatibility']),
  range('choose-power-supply-1hvd-0','choose-power-supply-1hvj-0',['characteristics'])],
 'dns-89471':[
  range('heat-xq8-0','heat-xqc-0',['characteristics']),
  ...[['heat-xqc-0','heat-xqd-0'],['heat-xus-0','heat-xut-0'],['heat-y0h-0','heat-y0i-0'],
   ['heat-y5v-0','heat-y5w-0'],['heat-yc9-0','heat-yca-0'],['heat-yfw-0','heat-yfx-0'],
   ['heat-ylj-0','heat-ylk-0'],['heat-yoq-0','heat-yor-0'],['heat-yr2-0','heat-yr3-0'],
   ['heat-yv7-0','heat-yv8-0'],['heat-z1u-0','heat-z1v-0'],['heat-z48-0','heat-z49-0']]
   .map(([start,end])=>range(start,end,['characteristics','comparison'],1))],
 'dns-38267':[
  range('motherboard-vrm-1gnx-0','motherboard-vrm-1gq6-0',['construction']),
  range('motherboard-vrm-1gqc-0','motherboard-vrm-1gqw-0',['characteristics']),
  range('motherboard-vrm-1gqw-0','motherboard-vrm-1gqx-0',['compatibility']),
  range('motherboard-vrm-1gqx-0','motherboard-vrm-1gr9-0',['construction','characteristics']),
  range('motherboard-vrm-1gr9-0','motherboard-vrm-1grv-0',['comparison','compatibility']),
  range('motherboard-vrm-1grv-0','motherboard-vrm-1gs6-0',['compatibility'])]
};
const articleEvidenceSections=id=>[...(evidenceSections[id]||[]),...(hardwareEvidenceSections[id]||[]),...(contentEvidenceSections[id]||[])];
export function evidenceBlocks(article){
 const result=new Map(),blocks=article.blocks||[];
 for(const section of articleEvidenceSections(article.id)){
  const start=blocks.findIndex(b=>b.id===section.start),end=blocks.findIndex(b=>b.id===section.end)+(section.endOffset===1?1:0);
  if(start<0||end<=start)continue;
  const add=block=>{if(['product','product-group','cta','media-placeholder','separator'].includes(block.type))return;if(block.id)result.set(block.id,section.kinds);for(const child of block.blocks||[])add(child);};
  blocks.slice(start,end).forEach(add);
 }
 return result;
}
export function evidenceCategory(articleId){
 if(articleId==='dns-14990'||Object.hasOwn(screenshotEvidence,articleId))return 'gpu';
 if(['dns-18597','dns-89471','dns-103315','dns-141994','dns-92557','dns-138041','dns-132817'].includes(articleId))return 'processor';
 if(['dns-15175','dns-38267','dns-154533','dns-144656','dns-117615','dns-164524'].includes(articleId))return 'board';
 if(['dns-14934','dns-119652','dns-164746','dns-167463'].includes(articleId))return 'power';
 if(['dns-18432','dns-168919','dns-169987','dns-177554'].includes(articleId))return 'case';
 return null;
}

// Audited practical-data areas. Pixel bounds refer to retained source images;
// one semantic area may span several screenshot parts without resetting its timer.
const shot=(id,first,top,last,bottom,kinds)=>({id,first,top,last,bottom,kinds});
export const screenshotEvidence={
 'dns-168561':[
  shot('gpu-base-comparison',5,1020,10,330,['results']),
  shot('gpu-thermal',10,330,19,500,['results']),
  shot('gpu-test-conditions',19,500,21,2110,['conditions']),
  shot('gpu-test-results',21,2110,31,2100,['results']),
  shot('gpu-pcie-results',40,1280,44,1550,['results'])],
 'dns-168808':[
  shot('gpu-hardware-measurements',3,730,5,1190,['results']),
  shot('gpu-test-conditions',5,1190,7,2100,['conditions']),
  shot('gpu-test-results',7,2100,24,1350,['results'])],
 // The static closed methodology spoiler is excluded; its contents are unavailable.
 'dns-147508':[
  shot('gpu-hardware-measurements',7,430,8,280,['conditions','results']),
  shot('gpu-test-results',8,280,56,2400,['results'])],
 'dns-150257':[
  shot('gpu-hardware-measurements',6,0,16,1650,['conditions','results']),
  shot('gpu-test-conditions',16,1650,17,1100,['conditions']),
  shot('gpu-test-results',17,1100,38,2100,['results'])],
 'dns-145883':[
  shot('gpu-thermal',8,1920,11,960,['results']),
  shot('gpu-test-conditions',11,960,12,80,['conditions']),
  shot('gpu-test-results',12,80,24,800,['results']),
  shot('gpu-additional-comparisons',24,800,28,450,['results']),
  shot('gpu-additional-comparisons-2',28,1650,29,950,['results']),
  shot('gpu-additional-comparisons-3',29,1820,31,1840,['results'])],
 'dns-164299':[shot('gpu-comparison-chart',5,900,6,220,['results'])]
};
export function evidenceExposureTargets(article){
 if(article.screenshotPages)return (screenshotEvidence[article.id]||[]).map(({id,first,top,last,bottom,kinds})=>{
  const start=article.screenshotPages[first-1],end=article.screenshotPages[last-1];
  return {id,target_id:start.id,end_target_id:end.id,offset:top/start.image.height,end_offset:bottom/end.image.height,kinds};
 });
 return articleEvidenceSections(article.id).map(({start,end,kinds,endOffset=0})=>({id:start,target_id:start,end_target_id:end,offset:0,end_offset:endOffset,kinds}));
}
