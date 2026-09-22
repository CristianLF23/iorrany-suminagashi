(() => {
 const source=document.querySelector('#sumi'),disc=document.querySelector('.yoyo-disc'),canvas=document.querySelector('.yoyo-ink');
 if(!source||!disc||!canvas)return;
 const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const palette=[[224,225,222],[86,139,255],[246,74,104],[183,119,255]];
 canvas.width=canvas.height=256;
 function paletteAt(phase){
  const a=Math.floor(phase)%4,b=(a+1)%4,t=phase-Math.floor(phase),ease=t*t*(3-2*t);
  return palette[a].map((value,index)=>Math.round(value+(palette[b][index]-value)*ease));
 }
 document.addEventListener('ink-frame',event=>{
  if(reduced.matches)return;
  const rect=disc.getBoundingClientRect();if(rect.bottom<76||rect.top>innerHeight)return;
  const backgroundPhase=event.detail?.palettePhase||0;
  // One and a half palette stages guarantees a contrasting color instead of mirroring the hero.
  const yoyoPhase=(backgroundPhase+1.5)%4,color=paletteAt(yoyoPhase);
  ctx.globalCompositeOperation='source-over';ctx.filter='grayscale(1) contrast(1.18) brightness(1.06)';
  // A separate view into the same ink with an independently offset palette inside the object.
  const crop=Math.min(source.width,source.height)*.42;
  ctx.drawImage(source,(source.width-crop)/2,(source.height-crop)/2,crop,crop,0,0,256,256);
  ctx.filter='none';ctx.globalCompositeOperation='color';ctx.fillStyle=`rgb(${color.join(' ')})`;ctx.fillRect(0,0,256,256);
  ctx.globalCompositeOperation='source-over';
  canvas.dataset.backgroundPhase=backgroundPhase.toFixed(3);canvas.dataset.yoyoPhase=yoyoPhase.toFixed(3);canvas.dataset.tint=color.join(',');
 });
})();
