(() => {
 const mobile=matchMedia('(max-width: 699px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!mobile.matches||reduced.matches||navigator.connection?.saveData)return;
 const overlay=document.createElement('dialog');overlay.className='mobile-intro';overlay.setAttribute('aria-label','Abertura da Ioiô Tattoo');
 const video=document.createElement('video');video.playsInline=true;video.autoplay=true;video.preload='auto';video.volume=.75;video.setAttribute('aria-hidden','true');
 const skip=document.createElement('button');skip.type='button';skip.textContent='Pular abertura';skip.className='intro-skip';
 const sound=document.createElement('button');sound.type='button';sound.textContent='Ativar som';sound.className='intro-sound';sound.hidden=true;
 overlay.append(video,sound,skip);document.body.append(overlay);overlay.showModal();document.documentElement.classList.add('intro-active');
 let closing=false,finished=false,playTimer;
 function cleanup(){if(finished)return;finished=true;clearTimeout(failTimer);clearTimeout(playTimer);video.pause();overlay.close();overlay.remove();document.documentElement.classList.remove('intro-active');document.dispatchEvent(new Event('ink-modal'));}
 function finish(immediate=false){if(closing)return;closing=true;clearTimeout(failTimer);if(immediate){cleanup();return;}overlay.classList.add('is-leaving');const initial=video.volume,start=performance.now();function fade(now){const t=Math.min(1,(now-start)/700);video.volume=Math.max(0,initial*(1-t));if(t<1)requestAnimationFrame(fade);}requestAnimationFrame(fade);setTimeout(cleanup,850);}
 const failTimer=setTimeout(()=>finish(true),4000);
 video.addEventListener('playing',()=>{clearTimeout(failTimer);if(!playTimer)playTimer=setTimeout(()=>finish(),11000);},{once:true});
 video.addEventListener('timeupdate',()=>{if(video.duration&&video.duration-video.currentTime<=.85)finish();});
 video.addEventListener('ended',()=>{if(closing)cleanup();else finish(true);});video.addEventListener('error',()=>finish(true));skip.addEventListener('click',()=>finish());sound.addEventListener('click',()=>{video.muted=false;video.volume=.75;sound.hidden=true;});
 overlay.addEventListener('cancel',event=>{event.preventDefault();finish();});
 reduced.addEventListener('change',()=>{if(reduced.matches)finish(true);});mobile.addEventListener('change',()=>{if(!mobile.matches)finish(true);});
 addEventListener('pagehide',cleanup,{once:true});
 video.src='assets/ioio-intro.mp4';video.muted=false;video.play()?.catch(()=>{video.muted=true;sound.hidden=false;return video.play();}).catch(()=>finish(true));
})();
