(() => {
 'use strict';
 const source=document.querySelector('#sumi');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const heading=document.querySelector('.works h3');
 const last=heading?.lastChild;
 if(last?.nodeType===Node.TEXT_NODE){
  const word=document.createElement('span');word.textContent='IDENTIDADE.';
  last.textContent='COM ';heading.append(word);
 }
 const targets=[...document.querySelectorAll('.hero h1 span,.works h3 span,.contact h3 span')];
 const windows=targets.map(el=>{
  el.classList.add('ink-word');
  const canvas=document.createElement('canvas');canvas.className='letter-ink';canvas.setAttribute('aria-hidden','true');el.append(canvas);
  const mask=document.createElement('canvas');
  return {el,canvas,mask,ctx:canvas.getContext('2d'),m:mask.getContext('2d'),text:el.textContent,rect:null};
 });
 let dirty=true,ready=false;
 function measure(){
  for(const w of windows){
   const rect=w.el.getBoundingClientRect(),css=getComputedStyle(w.el),dpr=Math.min(devicePixelRatio,1.5);
   w.rect=rect;
   const width=Math.max(1,Math.ceil(rect.width*dpr)),height=Math.max(1,Math.ceil(rect.height*dpr));
   w.canvas.width=w.mask.width=width;w.canvas.height=w.mask.height=height;
   w.m.setTransform(dpr,0,0,dpr,0,0);
   w.m.font=`${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
   w.m.letterSpacing=css.letterSpacing;
   const metrics=w.m.measureText(w.text);
   const ascent=metrics.fontBoundingBoxAscent,descent=metrics.fontBoundingBoxDescent;
   w.m.fillStyle='#fff';
   w.m.fillText(w.text,0,(rect.height-ascent-descent)/2+ascent);
  }
  dirty=false;
 }
 function reset(){windows.forEach(w=>w.el.classList.remove('ink-ready'));}
 document.fonts.ready.then(()=>{ready=true;dirty=true;});
 const observer=new ResizeObserver(()=>{dirty=true;});windows.forEach(w=>observer.observe(w.el));
 addEventListener('resize',()=>{dirty=true;},{passive:true});
 reduced.addEventListener('change',reset);
 source.addEventListener('webglcontextlost',reset);
 // Copy the actual WebGL frame synchronously, before its drawing buffer is cleared.
 document.addEventListener('ink-frame',()=>{
  if(!ready||reduced.matches||navigator.connection?.saveData){reset();return;}
  if(dirty)measure();
  const scene=source.getBoundingClientRect();
  for(const w of windows){
   const r=w.el.getBoundingClientRect();
   if(r.bottom<76||r.top>innerHeight)continue;
   const c=w.ctx,scale=w.canvas.width/r.width;
   c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,w.canvas.width,w.canvas.height);
   c.globalCompositeOperation='source-over';c.drawImage(w.mask,0,0);
   c.globalCompositeOperation='source-in';
   c.drawImage(source,(scene.left-r.left)*scale,(scene.top-r.top)*scale,scene.width*scale,scene.height*scale);
   w.el.classList.add('ink-ready');
  }
 });
})();
