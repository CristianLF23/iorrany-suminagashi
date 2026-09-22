(() => {
 const mobile=matchMedia('(max-width: 699px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!mobile.matches||reduced.matches||navigator.connection?.saveData)return;
 const overlay=document.createElement('dialog');overlay.className='mobile-intro';overlay.setAttribute('aria-label','Abertura da Ioiô Tattoo');
 const video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.playsInline=true;video.autoplay=true;video.preload='auto';video.setAttribute('aria-hidden','true');
 const audio=document.createElement('audio');audio.preload='auto';audio.volume=.85;audio.setAttribute('aria-hidden','true');
 const skip=document.createElement('button');skip.type='button';skip.textContent='Pular abertura';skip.className='intro-skip';
 const sound=document.createElement('button');sound.type='button';sound.textContent='Ativar som';sound.className='intro-sound';sound.hidden=true;
 overlay.append(video,sound,skip);document.body.append(overlay,audio);overlay.showModal();document.documentElement.classList.add('intro-active');
 let closing=false,visualFinished=false,audioStarted=false,audioFading=false,playTimer,failTimer;
 function removeAudio(){audio.pause();audio.remove();}
 function fadeAudio(duration=1800){
  if(audioFading||!audioStarted){if(!audioStarted)removeAudio();return;}
  audioFading=true;const initial=audio.volume,start=performance.now();
  function fade(now){const t=Math.min(1,(now-start)/duration);audio.volume=Math.max(0,initial*Math.pow(1-t,2.2));if(t<1)requestAnimationFrame(fade);else removeAudio();}
  requestAnimationFrame(fade);
 }
 function cleanupVisual(){
  if(visualFinished)return;visualFinished=true;clearTimeout(failTimer);clearTimeout(playTimer);video.pause();
  if(overlay.open)overlay.close();overlay.remove();document.documentElement.classList.remove('intro-active');document.dispatchEvent(new Event('ink-modal'));
 }
 function finishVisual(immediate=false){
  if(closing)return;closing=true;clearTimeout(failTimer);
  if(immediate){cleanupVisual();fadeAudio(450);return;}
  overlay.classList.add('is-leaving');setTimeout(()=>{cleanupVisual();fadeAudio(1800);},850);
 }
 function stopAll(){cleanupVisual();audioStarted=false;removeAudio();}
 function startAudio(){
  try{audio.currentTime=Math.min(video.currentTime,audio.duration||video.currentTime);}catch{}
  audio.volume=.85;audio.muted=false;
  const attempt=audio.play();
  if(attempt)attempt.then(()=>{audioStarted=true;sound.hidden=true;}).catch(()=>{sound.hidden=false;});
 }
 failTimer=setTimeout(()=>finishVisual(true),4000);
 video.addEventListener('playing',()=>{clearTimeout(failTimer);startAudio();if(!playTimer)playTimer=setTimeout(()=>finishVisual(),9000);},{once:true});
 video.addEventListener('timeupdate',()=>{if(video.duration&&video.duration-video.currentTime<=.85)finishVisual();});
 video.addEventListener('ended',()=>{cleanupVisual();fadeAudio(1800);});
 video.addEventListener('error',()=>finishVisual(true));
 audio.addEventListener('error',()=>{sound.hidden=true;audioStarted=false;removeAudio();});
 sound.addEventListener('click',startAudio);skip.addEventListener('click',()=>finishVisual(true));
 overlay.addEventListener('cancel',event=>{event.preventDefault();finishVisual(true);});
 reduced.addEventListener('change',()=>{if(reduced.matches)stopAll();});mobile.addEventListener('change',()=>{if(!mobile.matches)stopAll();});
 addEventListener('pagehide',stopAll,{once:true});
 video.src='assets/ioio-intro.mp4';audio.src='assets/ioio-intro-audio.m4a';
 video.play()?.catch(()=>finishVisual(true));
})();
