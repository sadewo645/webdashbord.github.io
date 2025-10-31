/* app.js
   Interaksi: progress bar, cards carousel controls, card clicks.
   Sidebar sudah ditangani oleh script.js (SB Admin)
*/

(function(){
  // Utils
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Navigation: change visible page
  const navItems = $$('.nav-item');
  const pages = $$('.page');

  function showPage(pageKey){
    pages.forEach(p => {
      if(p.dataset.page === pageKey) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    });

    navItems.forEach(btn => {
      if(btn.dataset.page === pageKey){
        btn.classList.add('active');
        btn.setAttribute('aria-current','page');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const page = btn.dataset.page;
      if(page) showPage(page);
      const activePage = document.querySelector(`.page[data-page="${page}"]`);
      if(activePage) activePage.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Onboarding progress (dynamic)
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  function setProgress(value){
    const val = Math.max(0, Math.min(100, Number(value) || 0));
    if(progressBar){
      progressBar.style.width = val + '%';
      progressPercent.textContent = val + '%';
      const wrap = progressBar.parentElement;
      if(wrap) wrap.setAttribute('aria-valuenow', String(val));
    }
  }

  window.addEventListener('load', () => {
    setTimeout(()=> setProgress(80), 150);
    const year = document.getElementById('year');
    if(year) year.textContent = new Date().getFullYear();
  });

  // Cards carousel controls
  const carousel = document.getElementById('cardsCarousel');
  if(carousel){
    const prevBtn = document.getElementById('cardPrev');
    const nextBtn = document.getElementById('cardNext');

    function scrollByCard(direction){
      const card = carousel.querySelector('.card');
      if(!card) return;
      const cardWidth = card.getBoundingClientRect().width + parseFloat(getComputedStyle(card).marginRight || 12);
      const offset = direction === 'next' ? cardWidth * 1.1 : -cardWidth * 1.1;
      carousel.scrollBy({ left: offset, behavior: 'smooth' });
    }

    if(prevBtn) prevBtn.addEventListener('click', ()=> scrollByCard('prev'));
    if(nextBtn) nextBtn.addEventListener('click', ()=> scrollByCard('next'));

    carousel.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowRight') { scrollByCard('next'); e.preventDefault(); }
      if(e.key === 'ArrowLeft') { scrollByCard('prev'); e.preventDefault(); }
    });

    const cards = $$('.card', carousel);
    cards.forEach(card => {
      card.addEventListener('click', () => handleCardAction(card.dataset.action));
      card.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
          handleCardAction(card.dataset.action);
          e.preventDefault();
        }
      });
    });

    const cardButtons = $$('.card [data-action-btn]');
    cardButtons.forEach(b => {
      b.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const fn = b.dataset.actionBtn;
        if(fn === 'try-automations') showPage('automations');
        else if(fn === 'try-ota') alert('Opening OTA flow (demo) — this would open OTA wizard.');
        else if(fn === 'demo') alert('Starting demo onboarding...');
      });
    });
  }

  function handleCardAction(action){
    switch(action){
      case 'connect-device': showPage('devices'); break;
      case 'automations': showPage('automations'); break;
      case 'events': showPage('dashboards'); break;
      case 'ota': showPage('dashboards'); break;
      case 'white-label': alert('Redirecting to White-label demo...'); break;
      default: console.log('Card action', action);
    }
  }

  // Quick links under Get Started
  const quickLinks = $$('.link-btn');
  quickLinks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const a = btn.dataset.action;
      if(a === 'devices') showPage('devices');
      else if(a === 'templates') showPage('developer');
      else if(a === 'members') showPage('users');
    });
  });

  // Accessibility
  (function keyboardOutline(){
    let usingKeyboard = false;
    window.addEventListener('keydown', (e) => {
      if(e.key === 'Tab') {
        if(!usingKeyboard) document.body.classList.add('using-keyboard');
        usingKeyboard = true;
      }
    });
    window.addEventListener('mousedown', () => {
      if(usingKeyboard){
        usingKeyboard = false;
        document.body.classList.remove('using-keyboard');
      }
    });
  })();

  window.DashboardAPI = { setProgress };

})();
