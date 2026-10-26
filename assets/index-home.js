/* Play the portrait video only while its section is being viewed. */
(() => {
  'use strict';
  const video = document.querySelector('.home-why-video');
  if (!video || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let userControlled = false;
  const sync = () => {
    if (!inView || document.hidden) { video.pause(); return; }
    if (!userControlled && !reduced.matches) video.play().catch(() => {});
  };
  video.addEventListener('pointerdown', () => { userControlled = true; });
  video.addEventListener('keydown', () => { userControlled = true; });
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .25;
    sync();
  }, {threshold:[0,.25]}).observe(video);
  document.addEventListener('visibilitychange', sync);
})();
