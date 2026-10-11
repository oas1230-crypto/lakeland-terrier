(() => {
  'use strict';
  const names={original:'Исходное',journal:'Фотожурнал',trails:'Озёрные тропы',album:'Тихие минуты',day:'День рядом'};
  const routes={original:'original/index.html',journal:'story.html?design=journal&v=video-start-4',trails:'story-trails.html?v=video-start-4',album:'story-album.html?v=video-start-4',day:'day-together/index.html?v=video-start-4'};
  const frame=document.getElementById('preview');
  // The comparison always opens on its cover, including browser history restores.
  history.scrollRestoration='manual';
  function startAtCover(){
    try{
      frame.contentWindow.history.scrollRestoration='manual';
      frame.contentWindow.scrollTo({top:0,left:0,behavior:'instant'});
    }catch{}
  }
  frame.addEventListener('load',startAtCover);
  window.addEventListener('pageshow',startAtCover);
  const phone=matchMedia('(max-width:760px), (max-width:960px) and (pointer:coarse)');
  const initial=new URLSearchParams(location.search).get('design');
  let desktopDesign=routes[initial]?initial:'trails';
  let active='trails';
  const buttons=[...document.querySelectorAll('[data-design]')];
  function select(design,initial=false){
    if(phone.matches)design='trails';
    if(!routes[design])return;
    if(!phone.matches)desktopDesign=design;
    if(!initial&&design===active){
      startAtCover();
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
  if(new URLSearchParams(location.search).get('preview')==='desktop')document.title='Лейкленд — десктопное сравнение';
  select(desktopDesign,true);
  phone.addEventListener('change',()=>select(phone.matches?'trails':desktopDesign,true));
})();
