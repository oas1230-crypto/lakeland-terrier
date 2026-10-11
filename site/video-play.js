(() => {
  'use strict';
  document.querySelectorAll('video[controls]').forEach(video => {
    if (video.closest('.video-invitation')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'video-invitation';
    video.parentNode.insertBefore(wrapper, video);
    wrapper.append(video);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'video-play-button';
    button.setAttribute('aria-label', 'Воспроизвести видео прогулки');
    button.innerHTML = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M3 2.5v23l19-11.5z"/></svg>';
    wrapper.append(button);
    const sound = document.createElement('button');
    sound.type = 'button';
    sound.className = 'video-sound-button';
    const speaker = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path class="sound-waves" d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
    sound.innerHTML = speaker + '<span></span>';
    wrapper.append(sound);
    const updateSound = () => {
      const audible = !video.muted && video.volume > 0;
      sound.setAttribute('aria-pressed', String(audible));
      sound.setAttribute('aria-label', audible ? 'Выключить звук видео' : 'Включить звук видео');
      sound.querySelector('span').textContent = audible ? 'Звук включён' : 'Включить звук';
      sound.querySelector('.sound-waves').style.opacity = audible ? '1' : '.45';
    };
    sound.addEventListener('click', () => {
      const audible = !video.muted && video.volume > 0;
      if (audible) video.muted = true;
      else { video.muted = false; if (video.volume === 0) video.volume = 1; }
      updateSound();
    });
    video.addEventListener('volumechange', updateSound);
    updateSound();
    // Safari supplies a central start button while controls are enabled and the
    // video has never played. Use our invitation first, then native controls.
    // Without JavaScript the controls attribute in the HTML remains available.
    let nativeFallback = false;
    const update = () => { button.hidden = nativeFallback || (!video.paused && !video.ended); };
    const fallback = () => {
      nativeFallback = true;
      video.controls = true;
      update();
    };
    video.addEventListener('play', () => { video.controls = true; });
    video.addEventListener('error', fallback);
    ['play', 'pause', 'ended', 'error'].forEach(event => video.addEventListener(event, update));
    button.addEventListener('click', () => {
      video.play().catch(fallback);
    });
    video.controls = false;
    if (video.error) fallback();
    update();
  });
})();
