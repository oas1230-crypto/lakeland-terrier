(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tablist = document.querySelector('.scene-tabs');
  const tabs = [...tablist.querySelectorAll('button')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  tablist.hidden = false;
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  function selectScene(index, focus = false, animate = true) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
      panels[i].classList.remove('is-entering');
    });
    if (animate && !reducedMotion.matches) panels[index].classList.add('is-entering');
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectScene(index));
    tab.addEventListener('keydown', event => {
      const next = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1}[event.key];
      if (next !== undefined) { event.preventDefault(); selectScene(next, true); }
    });
  });
  selectScene(3, false, false);

  // Anchor links still open the image itself when JavaScript or dialog is unavailable.
  const dialog = document.querySelector('#album');
  if (typeof dialog.showModal === 'function') {
    const links = [...document.querySelectorAll('.photo-link')];
    const photos = [];
    links.forEach(link => {
      const src = link.href;
      if (!photos.some(photo => photo.src === src)) {
        photos.push({src, caption: link.dataset.caption || '', alt: link.dataset.alt || link.querySelector('img')?.alt || ''});
      }
    });
    let current = 0;
    let returnFocus = null;
    const photoElement = document.querySelector('#album-photo');
    const captionElement = document.querySelector('#album-caption');
    const counter = document.querySelector('#album-counter');
    function renderPhoto() {
      const photo = photos[current];
      photoElement.src = photo.src;
      photoElement.alt = photo.alt;
      captionElement.textContent = photo.caption;
      counter.textContent = `${current + 1} / ${photos.length}`;
    }
    function closeAlbum() {
      dialog.close();
      document.body.classList.remove('modal-open');
      returnFocus?.focus({preventScroll: true});
    }
    links.forEach(link => link.addEventListener('click', event => {
      // Preserve opening in a new tab with standard modifier keys.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      current = photos.findIndex(photo => photo.src === link.href);
      returnFocus = link;
      renderPhoto();
      document.querySelectorAll('video').forEach(video => video.pause());
      dialog.showModal();
      document.body.classList.add('modal-open');
    }));
    function step(delta) { current = (current + delta + photos.length) % photos.length; renderPhoto(); }
    document.querySelector('#previous').addEventListener('click', () => step(-1));
    document.querySelector('#next').addEventListener('click', () => step(1));
    document.querySelector('#close-album').addEventListener('click', closeAlbum);
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeAlbum(); });
    dialog.addEventListener('close', () => { if (!dialog.open) document.body.classList.remove('modal-open'); });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeAlbum();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.querySelectorAll('video').forEach(video => video.pause());
  });
})();
