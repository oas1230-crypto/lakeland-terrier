(() => {
  const buttons = [...document.querySelectorAll('[data-variant]')];
  const variants = {current: document.getElementById('preview-current'), new: document.getElementById('preview-new'), duo: document.getElementById('preview-duo'), chair: document.getElementById('preview-chair')};
  const notes = {chair: 'Вариант 04 — отдых в карповом кресле у озера. Фото владельца.', current: 'Вариант 01 — отдых на солнечном мху. Фото владельца.', new: 'Вариант 02 — крупный портрет из первой редакции. Фото: Srinayan Puppala · CC BY-SA 2.0.', duo: 'Вариант 03 — крупный портрет сверху, отдых на мху снизу. Два кадра в одной композиции.'};
  function select(variant) {
    Object.entries(variants).forEach(([key, section]) => section.hidden = key !== variant);
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.variant === variant)));
    document.querySelector('.comparison-note').textContent = notes[variant];
    const url = new URL(location.href); url.searchParams.set('photo', variant); history.replaceState(null, '', url);
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.variant)));
  const requested = new URLSearchParams(location.search).get('photo');
  select(Object.hasOwn(variants, requested) ? requested : 'duo');
})();
