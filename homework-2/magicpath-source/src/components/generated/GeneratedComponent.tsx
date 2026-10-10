import {useRef,useState} from 'react';
import sleep from '../../../assets/stitch/grizzle-sleep-boots.jpg';
import home from '../../../assets/stitch/grizzle-home-doorway.jpg';
import rest from '../../../assets/stitch/trails-rest.jpg';
import './GeneratedComponent.css';

const photos = [
  {src:sleep,alt:'Небольшой рыжий терьер с тёмной спиной спит рядом с ботинком и рюкзаком',caption:'Сон после прогулки'},
  {src:home,alt:'Терьер с рыжей мордой и тёмной спиной лежит у деревянной двери',caption:'Дома рядом'},
  {src:rest,alt:'Рыжий терьер на мху рядом с походным рюкзаком и ботинками',caption:'Хорошо там, где вместе'}
];

export const GeneratedComponent = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement|null>(null);
  const [current,setCurrent]=useState(0);
  function open(index:number,event:React.MouseEvent<HTMLAnchorElement>){
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();returnFocus.current=event.currentTarget;setCurrent(index);dialog.current?.showModal();
  }
  function close(){dialog.current?.close();returnFocus.current?.focus({preventScroll:true});}
  const picture=(index:number,className='')=><figure className={className}><a className="photo-link" href={photos[index].src} onClick={event=>open(index,event)}><img src={photos[index].src} width="512" height="382" alt={photos[index].alt} loading={index===0?'eager':'lazy'}/><span className="image-open">Рассмотреть</span></a><figcaption>{photos[index].caption} · ИИ-иллюстрация, Google Stitch</figcaption></figure>;
  return <div className="magic-album">
    <a className="skip-link" href="#quiet-main">К содержанию</a>
    <header className="masthead wrap"><a className="brand" href="#home">Лейкленд<small>тихие минуты рядом</small></a><nav aria-label="Основная навигация"><a href="#together">Жизнь рядом</a><a href="#album-story">Фотоальбом</a></nav></header>
    <main id="quiet-main">
      <section className="hero wrap" id="home" aria-labelledby="quiet-title"><div className="hero-copy"><h1 id="quiet-title">Маленький друг.<br/>Большая жизнь рядом.</h1><div className="hero-intro"><p>Лейкленд-терьер: прогулки, открытия и тихие минуты вместе.</p><a className="button" href="#together">Побыть рядом</a></div></div>{picture(0,'hero-journal')}</section>
      <section className="together section" id="together" aria-labelledby="quiet-life"><div className="wrap"><div className="section-heading"><h2 id="quiet-life">Лучшее место —<br/>рядом с вами.</h2><p className="lead">Необязательно отправляться далеко. Для маленького приключения достаточно выйти из дома.</p></div><div className="scene">{picture(1)}<div className="scene-copy"><h3>Приключения могут подождать.</h3><p>После прогулки наступает время отдыха. Положить голову на лапы, закрыть глаза и никуда не спешить.</p><p>Быть компаньоном — значит разделять и новые открытия, и тихие минуты рядом.</p></div></div></div></section>
      <section className="illustrations section" id="album-story" aria-labelledby="quiet-album"><div className="wrap"><div className="section-heading"><div><h2 id="quiet-album">Три маленькие<br/>истории рядом.</h2></div><p>Лесная прогулка, любимый уголок дома и спокойный привал. Нажмите на снимок, чтобы рассмотреть его целиком.</p></div><div className="art-gallery">{photos.map((_,index)=><div key={index}>{picture(index)}</div>)}</div><p className="fine" style={{marginTop:36}}>Изображения созданы с помощью ИИ в Google Stitch. Это художественные иллюстрации, а не фотографии собаки владельца.</p></div></section>
    </main>
    <footer className="wrap footer"><a href="#home">Лейкленд-терьер</a><span>С любовью к маленьким приключениям</span></footer>
    <dialog ref={dialog} aria-labelledby="quiet-photo-title" onCancel={event=>{event.preventDefault();close();}} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();setCurrent((current+(event.key==='ArrowRight'?1:2))%3);}}}><div className="album-top"><h2 id="quiet-photo-title">Фотоистория</h2><button type="button" onClick={close}>Закрыть</button></div><img id="album-photo" src={photos[current].src} alt={photos[current].alt}/><div className="album-bottom"><button type="button" aria-label="Предыдущее изображение" onClick={()=>setCurrent((current+2)%3)}>←</button><p id="album-caption" aria-live="polite">{photos[current].caption}</p><button type="button" aria-label="Следующее изображение" onClick={()=>setCurrent((current+1)%3)}>→</button></div><p id="album-counter">{current+1} / 3</p></dialog>
  </div>;
};
