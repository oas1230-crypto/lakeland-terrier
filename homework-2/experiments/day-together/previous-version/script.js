(() => {
  const dialog = document.querySelector('#photo-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const picture = document.querySelector('#viewer-image');
  const caption = document.querySelector('#viewer-caption');
  let opener;
  document.querySelectorAll('a.photo').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      picture.src = link.href;
      picture.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption;
      dialog.showModal();
      document.body.classList.add('modal-open');
      document.querySelector('#close-viewer').focus();
    });
  });
  document.querySelector('#close-viewer').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    opener?.focus({preventScroll:true});
  });
})();
