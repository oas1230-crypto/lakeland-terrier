(() => {
  'use strict';
  const names={original:'Исходное',journal:'Фотожурнал',trails:'Озёрные тропы',album:'Тихие минуты'};
  const routes={original:'original/index.html',journal:'story.html?design=journal',trails:'story-trails.html',album:'story-album.html'};
  const frame=document.getElementById('preview');
  let active='trails',position=null;
  const buttons=[...document.querySelectorAll('[data-design]')];
  function capture(){
    try {
      const doc=frame.contentDocument;
      if(doc.documentElement.scrollTop<40)return null;
      if(doc.querySelector('dialog[open]'))return null;
      const sections=[...doc.querySelectorAll('main section[id]')];
      const section=sections.filter(s=>s.getBoundingClientRect().top<frame.clientHeight*.35).at(-1);
      if(!section)return null;
      return {id:section.id,ratio:Math.max(0,Math.min(1,-section.getBoundingClientRect().top/section.offsetHeight))};
    }catch{return null;}
  }
  function select(design,restore=true){
    if(!routes[design])return;
    if(restore&&design===active)return;
    position=restore?capture():null;
    try{frame.contentDocument.querySelectorAll('video').forEach(v=>v.pause());}catch{}
    active=design;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.design===design)));
    frame.title=names[design]+' — оформление сайта';
    document.getElementById('standalone').href=routes[design];
    frame.src=routes[design];
    const url=new URL(location.href);url.searchParams.set('design',design);history.replaceState(null,'',url);
    try{localStorage.setItem('lakeland-prototype-design',design);}catch{}
    document.getElementById('selection-status').textContent='Выбрано оформление «'+names[design]+'»';
  }
  frame.addEventListener('load',()=>{
    if(!position)return;
    try{const section=frame.contentDocument.getElementById(position.id);if(section)frame.contentWindow.scrollTo({top:section.offsetTop+section.offsetHeight*position.ratio,behavior:'instant'});}catch{}
    position=null;
  });
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.design)));
  let initial=new URLSearchParams(location.search).get('design');
  if(!initial){try{initial=localStorage.getItem('lakeland-prototype-design');}catch{}}
  select(routes[initial]?initial:'trails',false);
})();
