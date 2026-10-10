/* Homepage controls; no shared header or product-page logic is modified. */
(() => {
  'use strict';
  const tablist = document.querySelector('.home-product-tabs');
  const solutionImages = [...document.querySelectorAll('#solutions .home-solution-image img')];
  ['images/about/solution-01.jpg','images/about/solution-02.jpg','images/about/solution-03.jpg','images/about/solution-04.jpg'].forEach((src, i) => { if (solutionImages[i]) { solutionImages[i].src = src; solutionImages[i].removeAttribute('srcset'); } });
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (panels.every(Boolean)) {
      const select = index => {
        tabs.forEach((tab, i) => {
          tab.setAttribute('aria-selected', String(i === index));
          tab.tabIndex = i === index ? 0 : -1;
          panels[i].hidden = i !== index;
          panels[i].setAttribute('role', 'tabpanel');
          panels[i].setAttribute('aria-labelledby', tab.id);
          panels[i].tabIndex = 0;
        });
      };
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => select(index));
        tab.addEventListener('keydown', event => {
          let next;
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
          if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = tabs.length - 1;
          if (next === undefined) return;
          event.preventDefault();
          select(next);
          tabs[next].focus();
        });
      });
      select(0);
      tablist.hidden = false;
    }
  }

  const hero = document.querySelector('.home-quordix');
  if (!hero) return;
  const canvas = hero.querySelector('.home-dot-canvas');
  const ctx = canvas?.getContext('2d');
  const control = hero.querySelector('.home-motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  let manualPause = false;
  let onScreen = true;
  let raf = 0;
  let width = 0, height = 0, lastDraw = 0, mouseX = -1000, mouseY = -1000;
  let particles = [];
  const paused = () => reduced.matches || manualPause;
  const draw = (now = 0) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const motion = !paused();
    const small = width < 768 || coarse.matches;
    const scanTime = now % 6500;
    const scanY = motion && small && scanTime < 2500 ? scanTime / 2500 * (height + 200) - 100 : -1000;
    for (let x = 0; x < width; x += 30) {
      for (let y = 0; y < height; y += 30) {
        const distance = small ? Math.abs(y - scanY) : Math.hypot(x - mouseX, y - mouseY);
        const weight = motion ? Math.max(0, 1 - distance / 100) : 0;
        ctx.beginPath();
        ctx.arc(x, y, 1.15 + weight * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = weight ? `rgba(178,34,34,${.2 + weight * .55})` : 'rgba(148,163,184,.32)';
        ctx.fill();
      }
    }
    if (motion) particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(178,34,34,.14)';ctx.fill();
    });
  };
  const tick = now => {
    raf = 0;
    if (paused() || !onScreen || document.hidden || !ctx) return;
    if (now - lastDraw >= 32) {draw(now);lastDraw = now;}
    raf = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(raf);raf = 0;
    hero.classList.toggle('is-paused', paused() || !onScreen || document.hidden);
    if (control) {
      control.hidden = reduced.matches;
      control.setAttribute('aria-pressed', String(manualPause));
      control.textContent = manualPause ? 'Bật hiệu ứng' : 'Tạm dừng hiệu ứng';
    }
    draw();
    if (!paused() && onScreen && !document.hidden && ctx) raf = requestAnimationFrame(tick);
  };
  const resize = () => {
    if (!ctx) return;
    const rect = hero.getBoundingClientRect();
    width = Math.round(rect.width);height = Math.round(rect.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({length:width < 768 ? 10 : 24}, () => ({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,r:.5+Math.random()}));
    draw();
  };
  hero.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();mouseX = event.clientX - rect.left;mouseY = event.clientY - rect.top;
  });
  hero.addEventListener('pointerleave', () => {mouseX = mouseY = -1000;});
  control?.addEventListener('click', () => {manualPause = !manualPause;sync();});
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if (ctx) {
    hero.classList.add('has-canvas');
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
    else window.addEventListener('resize', resize);
    resize();
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting;sync();
  }, {threshold:0}).observe(hero);
  sync();
})();
