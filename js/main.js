// Marks JS availability so CSS can enhance without hiding content from no-JS users.
document.documentElement.classList.add('js');

const DESKTOP_QUERY = '(min-width: 75rem)';

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const toggle = header.querySelector('.header__toggle');
  const panel = header.querySelector('.header__panel');
  const items = [...header.querySelectorAll('.nav__item:has(.nav__trigger)')];
  const desktop = window.matchMedia(DESKTOP_QUERY);
  let openedByHover = null;

  const openItem = () => items.find((item) => item.classList.contains('nav__item--open'));

  const syncHeaderState = () => {
    const isPanelOpen = toggle.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('header--active', isPanelOpen || Boolean(openItem()));
  };

  const setItem = (item, isOpen) => {
    item.classList.toggle('nav__item--open', isOpen);
    item.querySelector('.nav__trigger').setAttribute('aria-expanded', String(isOpen));
    syncHeaderState();
  };

  const closeItems = () => items.forEach((item) => setItem(item, false));

  const setPanel = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
    panel.classList.toggle('header__panel--open', isOpen);
    if (!isOpen) closeItems();
    syncHeaderState();
  };

  toggle.addEventListener('click', () => {
    setPanel(toggle.getAttribute('aria-expanded') !== 'true');
  });

  items.forEach((item) => {
    const trigger = item.querySelector('.nav__trigger');

    trigger.addEventListener('click', () => {
      // A click on a dropdown opened by hover keeps it open instead of toggling it.
      if (openedByHover === item) {
        openedByHover = null;
        return;
      }
      const shouldOpen = !item.classList.contains('nav__item--open');
      if (desktop.matches) closeItems();
      setItem(item, shouldOpen);
    });

    item.addEventListener('pointerenter', (event) => {
      if (!desktop.matches || event.pointerType !== 'mouse') return;
      closeItems();
      setItem(item, true);
      openedByHover = item;
    });

    item.addEventListener('pointerleave', (event) => {
      if (!desktop.matches || event.pointerType !== 'mouse') return;
      openedByHover = null;
      if (!item.contains(document.activeElement)) setItem(item, false);
    });

    item.addEventListener('focusout', (event) => {
      if (desktop.matches && !item.contains(event.relatedTarget)) setItem(item, false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const item = openItem();
    if (item) {
      setItem(item, false);
      item.querySelector('.nav__trigger').focus();
    } else if (toggle.getAttribute('aria-expanded') === 'true') {
      setPanel(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (desktop.matches && !header.contains(event.target)) closeItems();
  });

  desktop.addEventListener('change', () => setPanel(false));
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('.hero__slide')];
  const bars = [...hero.querySelectorAll('.hero__bar')];
  const pauseButton = hero.querySelector('.hero__pause');
  const lightSwitch = hero.querySelector('.hero__switch');
  const lamps = [...hero.querySelectorAll('.hero__lamp')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Temporary holds (focus, hover on controls) never override the user's pause choice.
  const holds = new Set();
  let current = 0;
  let isUserPaused = reducedMotion.matches;

  const syncPaused = () => {
    hero.classList.toggle('hero--paused', isUserPaused || holds.size > 0);
    hero.classList.toggle('hero--stopped', isUserPaused);
    pauseButton.setAttribute(
      'aria-label',
      isUserPaused ? 'Wznów automatyczną zmianę slajdów' : 'Zatrzymaj automatyczną zmianę slajdów',
    );
  };

  const isLit = (lamp) => lamp.classList.contains('hero__lamp--lit');

  const setLamp = (lamp, isOn) => {
    lamp.classList.toggle('hero__lamp--lit', isOn);
    lamp.querySelector('.hero__lamp-button').setAttribute('aria-pressed', String(isOn));
  };

  const syncLights = () => {
    const anyLit = lamps.some(isLit);
    hero.classList.toggle('hero--lit', anyLit);
    lightSwitch.setAttribute('aria-checked', String(anyLit));
    lightSwitch.setAttribute('aria-label', anyLit ? 'Zgaś lampy' : 'Zapal lampy');
    if (anyLit) holds.add('lights');
    else holds.delete('lights');
    syncPaused();
  };

  const showSlide = (index) => {
    const next = (index + slides.length) % slides.length;

    lamps.forEach((lamp) => setLamp(lamp, false));
    syncLights();

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === next;
      slide.classList.toggle('hero__slide--active', isActive);
      slide.classList.toggle('hero__slide--zoom', isActive);
      if (isActive) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
    });
    bars.forEach((bar, barIndex) => {
      bar.classList.toggle('hero__bar--active', barIndex === next);
    });

    current = next;
  };

  hero.querySelector('.hero__arrow--prev').addEventListener('click', () => showSlide(current - 1));
  hero.querySelector('.hero__arrow--next').addEventListener('click', () => showSlide(current + 1));

  // Lamps exist only on the first slide, so using them from another slide returns to it.
  const showLampSlide = () => {
    if (current !== 0) showSlide(0);
  };

  lightSwitch.addEventListener('click', () => {
    const shouldLight = !lamps.some(isLit);
    if (shouldLight) showLampSlide();
    lamps.forEach((lamp) => setLamp(lamp, shouldLight));
    syncLights();
  });

  lamps.forEach((lamp) => {
    lamp.querySelector('.hero__lamp-button').addEventListener('click', () => {
      showLampSlide();
      setLamp(lamp, !isLit(lamp));
      syncLights();
    });
  });

  pauseButton.addEventListener('click', () => {
    isUserPaused = !isUserPaused;
    syncPaused();
  });

  // The progress animation is the autoplay timer, so the bar and the slide stay in sync.
  bars.forEach((bar) => {
    bar.addEventListener('animationend', () => showSlide(current + 1));
  });

  hero.addEventListener('focusin', (event) => {
    if (!event.target.matches(':focus-visible')) return;
    holds.add('focus');
    syncPaused();
  });

  hero.addEventListener('focusout', (event) => {
    if (hero.contains(event.relatedTarget)) return;
    holds.delete('focus');
    syncPaused();
  });

  // Holding on the whole section would stop autoplay under a resting cursor.
  hero.querySelectorAll('a, button').forEach((control) => {
    control.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      holds.add('hover');
      syncPaused();
    });

    control.addEventListener('pointerleave', () => {
      holds.delete('hover');
      syncPaused();
    });
  });

  syncPaused();
}

// WebGL code loads only when the section gets close, so it never slows the first paint.
function initShaderSection() {
  const section = document.querySelector('.shader-cta');
  if (!section) return;

  const observer = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const { initShaderCta } = await import('./modules/shader.js');
      initShaderCta(section);
    },
    { rootMargin: '50% 0px' },
  );
  observer.observe(section);
}

initHeader();
initHero();
initShaderSection();
