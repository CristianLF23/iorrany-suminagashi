(() => {
 'use strict';
 const source=document.querySelector('#sumi');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function decorate(heading){
  if(!heading.textContent.trim()||heading.querySelector('.ink-word'))return;
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
  const node=heading.classList.contains('statement')?nodes.find(n=>n.textContent.includes('VOCÊ')):nodes.at(-1);
  if(!node)return;
  const matches=[...node.textContent.matchAll(/\S+/g)],match=heading.classList.contains('statement')?matches.find(m=>m[0]==='VOCÊ'):matches.at(-1);
  if(!match)return;
  const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
  let el;
  if(node.parentElement.tagName==='SPAN'&&node.textContent===match[0])el=node.parentElement;
  else{el=document.createElement('span');range.surroundContents(el);}
  el.classList.add('ink-word');
 }
 document.querySelectorAll('h1,h2,h3,h4,.statement').forEach(decorate);
 document.addEventListener('ink-title-change',event=>decorate(event.detail));
 const targets=[...document.querySelectorAll('main .ink-word')];
 const windows=targets.map(el=>{
  el.classList.add('ink-word');
  const canvas=document.createElement('canvas');canvas.className='letter-ink';canvas.setAttribute('aria-hidden','true');el.append(canvas);
  const mask=document.createElement('canvas');
  return {el,canvas,mask,ctx:canvas.getContext('2d'),m:mask.getContext('2d'),text:el.textContent,rect:null,vertical:!!el.closest('.rail')};
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
   const ascent=metrics.fontBoundingBoxAscent||parseFloat(css.fontSize)*.8,descent=metrics.fontBoundingBoxDescent||parseFloat(css.fontSize)*.2;
   w.m.fillStyle='#fff';
   if(w.vertical){w.m.translate(rect.width,0);w.m.rotate(Math.PI/2);w.m.fillText(w.text,0,(rect.width-ascent-descent)/2+ascent);}
   else w.m.fillText(w.text,0,(rect.height-ascent-descent)/2+ascent);
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
   if(w.vertical){c.translate(w.canvas.width,w.canvas.height);c.rotate(Math.PI);}
   c.drawImage(source,(scene.left-r.left)*scale,(scene.top-r.top)*scale,scene.width*scale,scene.height*scale);
   w.el.classList.add('ink-ready');
  }
 });
})();
