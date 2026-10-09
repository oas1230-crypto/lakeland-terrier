(() => {
  const variants = [...document.querySelectorAll('[data-variant]')];
  const concepts = [...document.querySelectorAll('.concept')];
  const setVariant = id => {
    document.querySelectorAll('.concept video').forEach(video => video.pause());
    concepts.forEach(el => { el.hidden = el.id !== id; });
    variants.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.variant === id)));
  };
  document.querySelector('.variants').hidden = false;
  const initial = new URLSearchParams(location.search).get('variant');
  setVariant(initial === 'journal' ? 'journal' : 'immersive');
  variants.forEach(button => button.addEventListener('click', () => {
    setVariant(button.dataset.variant);
    const url = new URL(location.href);
    url.searchParams.set('variant', button.dataset.variant);
    url.hash = '';
    history.replaceState(null, '', url);
    window.scrollTo({top:0, behavior:'instant'});
  }));
  const dialog = document.querySelector('#album');
  if (typeof dialog.showModal !== 'function') return;
  const links = [...document.querySelectorAll('.photo-link')];
  let collection = [], current = 0;
  function render() {
    const link = collection[current];
    const photo = document.querySelector('#album-photo');
    photo.src = link.href;
    photo.alt = link.querySelector('img').alt;
    document.querySelector('#album-caption').textContent = link.dataset.caption;
    document.querySelector('#album-counter').textContent = `${current + 1} / ${collection.length}`;
  }
  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const visible = links.filter(item => !item.closest('.concept').hidden);
    collection = visible.filter((item, index) => visible.findIndex(other => other.href === item.href) === index);
    current = collection.findIndex(item => item.href === link.href);
    render(); dialog.showModal(); document.body.classList.add('modal-open');
  }));
  const step = delta => { current = (current + delta + collection.length) % collection.length; render(); };
  document.querySelector('#previous').addEventListener('click', () => step(-1));
  document.querySelector('#next').addEventListener('click', () => step(1));
  const closeAlbum = () => { dialog.close(); document.body.classList.remove('modal-open'); };
  document.querySelector('#close-album').addEventListener('click', closeAlbum);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeAlbum(); });
  dialog.addEventListener('close', () => { if (!dialog.open) document.body.classList.remove('modal-open'); });
  dialog.addEventListener('keydown', event => {
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
  });
  dialog.addEventListener('click', event => {
    if(event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeAlbum();
  });
})();
