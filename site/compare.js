(() => {
  'use strict';
  const names={original:'Исходное',journal:'Фотожурнал',trails:'Озёрные тропы',album:'Тихие минуты',day:'День рядом'};
  const routes={original:'original/index.html',journal:'story.html?design=journal&v=video-play-3',trails:'story-trails.html?v=video-play-3',album:'story-album.html?v=video-play-3',day:'day-together/index.html?v=video-play-3'};
  const frame=document.getElementById('preview');
  let active='trails';
  const buttons=[...document.querySelectorAll('[data-design]')];
  function select(design,initial=false){
    if(!routes[design])return;
    if(!initial&&design===active){
      try{frame.contentWindow.scrollTo({top:0,behavior:'instant'});}catch{}
      return;
    }
    try{frame.contentDocument.querySelectorAll('video').forEach(v=>v.pause());}catch{}
    active=design;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.design===design)));
    frame.title=names[design]+' — оформление сайта';
    document.getElementById('standalone').href=routes[design];
    frame.src=routes[design];
    const url=new URL(location.href);url.searchParams.set('design',design);history.replaceState(null,'',url);
    document.getElementById('selection-status').textContent='Выбрано оформление «'+names[design]+'»';
  }
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.design)));
  const initial=new URLSearchParams(location.search).get('design');
  if(new URLSearchParams(location.search).get('preview')==='desktop')document.title='Лейкленд — десктопное сравнение';
  select(routes[initial]?initial:'trails',true);
})();
