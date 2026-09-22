(() => {
const works=[...document.querySelectorAll('.work')],dialog=document.querySelector('#work-dialog'),photo=document.querySelector('#dialog-image'),title=document.querySelector('#dialog-title'),description=document.querySelector('#dialog-description'),other=document.querySelector('#other-photo');
let index=0,alternate=false,origin;
function show(i){index=(i+works.length)%works.length;const work=works[index];alternate=false;photo.src=work.href;photo.alt=work.querySelector('img').alt;title.textContent=work.dataset.title;description.textContent=work.dataset.description;other.hidden=!work.dataset.extra;other.textContent='Ver outra fotografia';document.querySelector('#counter').textContent=(index+1)+' / '+works.length;}
works.forEach((work,i)=>work.dataset.workIndex=String(i));
const gallery=document.querySelector('.gallery');
gallery.addEventListener('click',event=>{const work=event.target.closest('[data-work-index]');if(!work||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();const i=Number(work.dataset.workIndex);origin=works[i];show(i);dialog.showModal();document.body.classList.add('modal-open');document.dispatchEvent(new Event('ink-modal'));});
// Two identical groups per track make the half-width translation seamless.
gallery.classList.add('flow-gallery');
for(let rowIndex=0;rowIndex<2;rowIndex++){
 const row=document.createElement('div'),track=document.createElement('div'),group=document.createElement('div');
 row.className='flow-row';row.setAttribute('role','group');row.setAttribute('aria-label',`Fileira ${rowIndex+1} de trabalhos`);
 track.className='flow-track';group.className='flow-group';
 works.slice(rowIndex*4,rowIndex*4+4).forEach(work=>group.append(work));
 const copy=group.cloneNode(true);copy.classList.add('flow-copy');copy.setAttribute('aria-hidden','true');
 copy.querySelectorAll('a').forEach(link=>{link.tabIndex=-1;link.dataset.duplicate='true';});
 track.append(group,copy);row.append(track);gallery.append(row);
}
const pause=document.createElement('button');pause.type='button';pause.className='gallery-pause';pause.textContent='Pausar galeria';pause.setAttribute('aria-pressed','false');gallery.before(pause);
pause.addEventListener('click',()=>{const paused=gallery.classList.toggle('is-paused');pause.textContent=paused?'Retomar movimento':'Pausar galeria';pause.setAttribute('aria-pressed',String(paused));});
gallery.addEventListener('pointerdown',()=>gallery.classList.add('is-touching'),{passive:true});
const release=()=>gallery.classList.remove('is-touching');addEventListener('pointerup',release,{passive:true});addEventListener('pointercancel',release,{passive:true});
gallery.addEventListener('focusin',event=>{if(event.target.matches('.work'))requestAnimationFrame(()=>{if(document.activeElement===event.target)event.target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});});});
gallery.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;gallery.querySelectorAll('.flow-row').forEach(row=>{if(!row.contains(document.activeElement))row.scrollLeft=0;});}));
new IntersectionObserver(entries=>gallery.classList.toggle('is-offscreen',!entries[0].isIntersecting)).observe(gallery);
document.addEventListener('visibilitychange',()=>gallery.classList.toggle('is-hidden',document.hidden));
document.querySelector('#close-dialog').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');document.dispatchEvent(new Event('ink-modal'));origin?.focus({preventScroll:true});});
document.querySelector('#previous').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);other.onclick=()=>{alternate=!alternate;photo.src=alternate?works[index].dataset.extra:works[index].href;other.textContent=alternate?'Voltar à primeira foto':'Ver outra fotografia';};
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight')show(index+1);if(event.key==='ArrowLeft')show(index-1);});
const form=document.querySelector('#project-form'),result=document.querySelector('#form-result');form.addEventListener('submit',event=>{event.preventDefault();const d=new FormData(form),message='Olá, Ioiô! Quero conversar sobre uma tatuagem.\n\nNome: '+(d.get('nome')||'Não informado')+'\nIdeia: '+d.get('ideia')+'\nRegião: '+d.get('regiao')+'\nTamanho: '+(d.get('tamanho')||'A definir');document.querySelector('#message-link').href='https://wa.me/5561993941961?text='+encodeURIComponent(message);result.hidden=false;});form.addEventListener('input',()=>result.hidden=true);
document.querySelector('#load-spotify').onclick=event=>{const frame=document.createElement('iframe');frame.src='https://open.spotify.com/embed/playlist/0EWjd0QwA0xibeRbZ0B7ZD?theme=0';frame.title='Play na tattoo, playlist da Iorrany';frame.allow='encrypted-media; fullscreen; picture-in-picture';document.querySelector('#spotify-player').append(frame);event.currentTarget.hidden=true;};
})();
