(() => {
 const source=document.querySelector('#sumi'),disc=document.querySelector('.yoyo-disc'),canvas=document.querySelector('.yoyo-ink');
 if(!source||!disc||!canvas)return;
 const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 canvas.width=canvas.height=256;
 document.addEventListener('ink-frame',()=>{
  if(reduced.matches)return;
  const rect=disc.getBoundingClientRect();if(rect.bottom<76||rect.top>innerHeight)return;
  const hue=95+(performance.now()*.014)%220;
  ctx.globalCompositeOperation='source-over';ctx.filter=`hue-rotate(${hue}deg) saturate(1.65) brightness(1.18) contrast(1.08)`;
  // A separate view into the same ink, tinted independently inside the object.
  const crop=Math.min(source.width,source.height)*.42;
  ctx.drawImage(source,(source.width-crop)/2,(source.height-crop)/2,crop,crop,0,0,256,256);
  ctx.filter='none';ctx.globalCompositeOperation='source-over';
 });
})();
