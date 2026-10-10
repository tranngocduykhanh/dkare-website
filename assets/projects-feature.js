(() => {
  const track=document.querySelector('.home-project-track');
  if(!track) return;
  const cards=[...track.querySelectorAll('.home-project-card')], dots=[...document.querySelectorAll('.home-project-dots button')];
  const move=(index)=>{const next=Math.max(0,Math.min(cards.length-1,index));track.scrollTo({left:cards[next].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});dots.forEach((dot,i)=>dot.setAttribute('aria-selected',String(i===next)));};
  document.querySelector('.home-project-prev')?.addEventListener('click',()=>move(Math.max(0,Math.round(track.scrollLeft/(cards[0]?.offsetWidth+20||1))-1)));
  document.querySelector('.home-project-next')?.addEventListener('click',()=>move(Math.round(track.scrollLeft/(cards[0]?.offsetWidth+20||1))+1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>move(i)));
})();
