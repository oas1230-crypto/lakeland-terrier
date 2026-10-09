(() => {
const variants = {
 original: ['Маленькая собака. <br>Большой мир<br><em>рядом.</em>', 'Лейкленд-терьер · родом из Англии', 'Заголовок из первой редакции сайта. Отдельный макет для сравнения.'],
 current: ['Счастье <br>идёт с вами<br><em>по тропинке.</em>', 'Маленькая собака · большой мир', 'Нынешний заголовок сайта. Та же фотография и то же кадрирование.']
};
function select(key) {
 const [title, eyebrow, note] = variants[key];
 document.getElementById('hero-title').innerHTML = title;
 document.querySelector('.cover-a-copy .eyebrow').textContent = eyebrow;
 document.querySelector('.comparison-note').textContent = note;
 document.querySelectorAll('[data-title]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.title === key)));
 const url = new URL(location.href); url.searchParams.set('title', key); history.replaceState(null, '', url);
}
document.querySelectorAll('[data-title]').forEach(b => b.addEventListener('click', () => select(b.dataset.title)));
const key = new URLSearchParams(location.search).get('title');
select(Object.hasOwn(variants, key) ? key : 'original');
})();