(() => {
 const mobile=matchMedia('(max-width: 699px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!mobile.matches||reduced.matches||navigator.connection?.saveData)return;
 const overlay=document.createElement('dialog');overlay.className='mobile-intro';overlay.setAttribute('aria-label','Abertura da Ioiô Tattoo');
 const video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.playsInline=true;video.autoplay=true;video.preload='auto';video.setAttribute('aria-hidden','true');
 const skip=document.createElement('button');skip.type='button';skip.textContent='Pular abertura';skip.className='intro-skip';
 overlay.append(video,skip);document.body.append(overlay);overlay.showModal();document.documentElement.classList.add('intro-active');
 let closing=false,finished=false,playTimer;
 function cleanup(){if(finished)return;finished=true;clearTimeout(failTimer);clearTimeout(playTimer);video.pause();overlay.close();overlay.remove();document.documentElement.classList.remove('intro-active');document.dispatchEvent(new Event('ink-modal'));}
 function finish(immediate=false){if(closing)return;closing=true;clearTimeout(failTimer);if(immediate){cleanup();return;}overlay.classList.add('is-leaving');setTimeout(cleanup,850);}
 const failTimer=setTimeout(()=>finish(true),4000);
 video.addEventListener('playing',()=>{clearTimeout(failTimer);if(!playTimer)playTimer=setTimeout(()=>finish(),11000);},{once:true});
 video.addEventListener('ended',()=>finish());video.addEventListener('error',()=>finish(true));skip.addEventListener('click',()=>finish());
 overlay.addEventListener('cancel',event=>{event.preventDefault();finish();});
 reduced.addEventListener('change',()=>{if(reduced.matches)finish(true);});mobile.addEventListener('change',()=>{if(!mobile.matches)finish(true);});
 addEventListener('pagehide',cleanup,{once:true});
 video.src='assets/ioio-intro.mp4';video.play()?.catch(()=>finish(true));
})();
