/* app.js
   Interaksi: sidebar nav, collapse, progress bar, cards carousel controls, card clicks.
*/

(function(){
  // Utils
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Sidebar toggle/collapse
  const sidebar = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('collapseBtn');
  const collapseToggle = document.getElementById('collapseToggle');

  function setSidebarCollapsed(collapsed){
    if(collapsed){
      sidebar.classList.add('collapsed');
      collapseBtn.setAttribute('aria-pressed','true');
    } else {
      sidebar.classList.remove('collapsed');
      collapseBtn.setAttribute('aria-pressed','false');
    }
  }

  collapseBtn.addEventListener('click', () => {
    setSidebarCollapsed(!sidebar.classList.contains('collapsed'));
  });
  collapseToggle.addEventListener('click', () => {
    setSidebarCollapsed(!sidebar.classList.contains('collapsed'));
  });

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
      // update heading maybe
      // Focus the content area for keyboard flow
      const activePage = document.querySelector(`.page[data-page="${page}"]`);
      if(activePage) activePage.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Onboarding progress (dynamic)
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  // Example: set to 80% initially (user requirement).
  // Value can be updated programmatically later, e.g., setProgress(45)
  function setProgress(value){
    const val = Math.max(0, Math.min(100, Number(value) || 0));
    progressBar.style.width = val + '%';
    progressPercent.textContent = val + '%';
    // aria update
    const wrap = progressBar.parentElement;
    if(wrap) wrap.setAttribute('aria-valuenow', String(val));
  }

  // start animation once loaded
  window.addEventListener('load', () => {
    // animate to 80%
    setTimeout(()=> setProgress(80), 150);
    // set footer year
    document.getElementById('year').textContent = new Date().getFullYear();
  });

  // Cards carousel controls
  const carousel = document.getElementById('cardsCarousel');
  const prevBtn = document.getElementById('cardPrev');
  const nextBtn = document.getElementById('cardNext');

  function scrollByCard(direction){
    const card = carousel.querySelector('.card');
    if(!card) return;
    const cardWidth = card.getBoundingClientRect().width + parseFloat(getComputedStyle(card).marginRight || 12);
    const offset = direction === 'next' ? cardWidth * 1.1 : -cardWidth * 1.1;
    carousel.scrollBy({ left: offset, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', ()=> scrollByCard('prev'));
  nextBtn.addEventListener('click', ()=> scrollByCard('next'));

  // keyboard support for carousel (left/right)
  carousel.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') { scrollByCard('next'); e.preventDefault(); }
    if(e.key === 'ArrowLeft') { scrollByCard('prev'); e.preventDefault(); }
  });

  // Card clicks: navigate or invoke actions
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

  // Buttons inside cards (ex: Try Now)
  const cardButtons = $$('.card [data-action-btn]');
  cardButtons.forEach(b => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const fn = b.dataset.actionBtn;
      // map to intent
      if(fn === 'try-automations') showPage('automations');
      else if(fn === 'try-ota') alert('Opening OTA flow (demo) — this would open OTA wizard.');
      else if(fn === 'demo') alert('Starting demo onboarding...');
    });
  });

  function handleCardAction(action){
    switch(action){
      case 'connect-device':
        showPage('devices');
        break;
      case 'automations':
        showPage('automations');
        break;
      case 'events':
        showPage('dashboards'); // example
        break;
      case 'ota':
        showPage('dashboards');
        break;
      case 'white-label':
        alert('Redirecting to White-label demo...');
        break;
      default:
        console.log('Card action', action);
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

  // Accessibility: ensure focus outline visible on keyboard navigation only
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

  // Expose some API for dynamic updates (could be used by other scripts)
  window.DashboardAPI = {
    setProgress
  };

})();
