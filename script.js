const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  const setMenuOpen = (isOpen) => {
    navMenu.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(!navMenu.classList.contains('open'));
  });

  navMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
}

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.product-card').forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

document.querySelectorAll('.spotter-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('aria-controls');
    const target = targetId ? document.getElementById(targetId) : null;
    const card = button.closest('.product-card');
    const shouldOpen = button.getAttribute('aria-expanded') !== 'true';

    document.querySelectorAll('.spotter-toggle[aria-expanded="true"]').forEach((openButton) => {
      if (openButton === button) return;
      const openTarget = document.getElementById(openButton.getAttribute('aria-controls'));
      openButton.setAttribute('aria-expanded', 'false');
      openButton.closest('.product-card')?.classList.remove('is-verdict-open');
      if (openTarget) openTarget.hidden = true;
    });

    button.setAttribute('aria-expanded', String(shouldOpen));
    if (target) target.hidden = !shouldOpen;
    if (card) card.classList.toggle('is-verdict-open', shouldOpen);
  });
});

const uniformBuilder = document.getElementById('build-uniform');

if (uniformBuilder) {
  const uniformModes = {
    training: {
      title: 'Training',
      copy: 'Built for hot sessions, leg days, and cleaner athletic fit.',
      why: 'Light up top, mobile through the legs, finished with a structured cap. It reads athletic without looking plain.',
      hero: 'assets/tees.jpg',
      heroLabel: 'Training BeastFit loadout preview',
      headwear: { label: 'Standard Snapback', image: 'assets/hats.jpg' },
      top: { label: 'Relentless Tee', image: 'assets/tees.jpg' },
      bottom: { label: 'Grind Shorts', image: 'assets/shorts.jpg' }
    },
    pump: {
      title: 'Pump Cover',
      copy: 'Oversized top, hard silhouette, built for cold starts and heavy days.',
      why: 'The hoodie gives the frame, the shorts keep the session practical, and the cap finishes the drop without overthinking it.',
      hero: 'assets/hoodies.jpg',
      heroLabel: 'Pump Cover BeastFit loadout preview',
      headwear: { label: 'Standard Snapback', image: 'assets/hats.jpg' },
      top: { label: 'Iron Discipline Hoodie', image: 'assets/hoodies.jpg' },
      bottom: { label: 'Grind Shorts', image: 'assets/shorts.jpg' }
    },
    streetwear: {
      title: 'Streetwear',
      copy: 'Dark, heavy, simple. Gym-to-street without looking soft.',
      why: 'A structured hat and oversized hoodie do the work. Keep the lower half simple and let the silhouette carry it.',
      hero: 'assets/product-rack.jpg',
      heroLabel: 'Streetwear BeastFit loadout preview',
      headwear: { label: 'Standard Snapback', image: 'assets/hats.jpg' },
      top: { label: 'Iron Discipline Hoodie', image: 'assets/hoodies.jpg' },
      bottom: { label: 'No bottom selected', image: 'assets/drop-flatlay.jpg', empty: true }
    },
    blackout: {
      title: 'All Black',
      copy: 'Minimal color. Maximum intent.',
      why: 'Black and gold stays sharp across the whole drop: hoodie weight, cap structure, and shorts that still train hard.',
      hero: 'assets/product-display.jpg',
      heroLabel: 'All Black BeastFit loadout preview',
      headwear: { label: 'Standard Snapback', image: 'assets/hats.jpg' },
      top: { label: 'Iron Discipline Hoodie', image: 'assets/hoodies.jpg' },
      bottom: { label: 'Grind Shorts', image: 'assets/shorts.jpg' }
    }
  };

  const modeButtons = uniformBuilder.querySelectorAll('.uniform-mode');
  const heroImage = document.getElementById('uniformHeroImage');
  const modeTitle = document.getElementById('uniformModeTitle');
  const modeCopy = document.getElementById('uniformModeCopy');
  const whyCopy = document.getElementById('uniformWhy');
  const slots = {
    headwear: {
      label: document.getElementById('uniformHeadwear'),
      image: document.getElementById('uniformHeadwearImage'),
      card: uniformBuilder.querySelector('[data-uniform-slot="headwear"]')
    },
    top: {
      label: document.getElementById('uniformTop'),
      image: document.getElementById('uniformTopImage'),
      card: uniformBuilder.querySelector('[data-uniform-slot="top"]')
    },
    bottom: {
      label: document.getElementById('uniformBottom'),
      image: document.getElementById('uniformBottomImage'),
      card: uniformBuilder.querySelector('[data-uniform-slot="bottom"]')
    }
  };

  const setBackground = (element, image) => {
    if (!element || !image) return;
    element.style.backgroundImage = `url('${image}')`;
  };

  const renderUniformMode = (modeName) => {
    const mode = uniformModes[modeName] || uniformModes.training;

    uniformBuilder.dataset.uniformMode = modeName;
    uniformBuilder.classList.add('is-swapping');
    window.setTimeout(() => uniformBuilder.classList.remove('is-swapping'), 180);

    modeButtons.forEach((button) => {
      const isActive = button.dataset.uniformMode === modeName;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (modeTitle) modeTitle.textContent = mode.title;
    if (modeCopy) modeCopy.textContent = mode.copy;
    if (whyCopy) whyCopy.textContent = mode.why;
    if (heroImage) {
      heroImage.setAttribute('aria-label', mode.heroLabel);
      setBackground(heroImage, mode.hero);
    }

    Object.entries(slots).forEach(([slotName, elements]) => {
      const item = mode[slotName];
      if (!item) return;
      if (elements.label) elements.label.textContent = item.label;
      if (elements.card) elements.card.classList.toggle('is-empty', Boolean(item.empty));
      setBackground(elements.image, item.image);
    });
  };

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      renderUniformMode(button.dataset.uniformMode || 'training');
    });
  });

  renderUniformMode(uniformBuilder.dataset.uniformMode || 'training');
}

const impactPopup = document.getElementById('impactSignupPopup');

if (impactPopup) {
  const impactStorageKey = 'beastfitImpactPopupSeenSession';
  const closeTriggers = impactPopup.querySelectorAll('[data-impact-close]');
  const impactForm = impactPopup.querySelector('.impact-popup__form');
  const impactEmailInput = impactPopup.querySelector('#impactPopupEmail');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let impactTimer = null;
  let impactHasOpened = false;

  const hasStoredImpactDismissal = () => {
    try {
      return window.sessionStorage.getItem(impactStorageKey) === 'true';
    } catch (error) {
      return false;
    }
  };

  const storeImpactDismissal = () => {
    try {
      window.sessionStorage.setItem(impactStorageKey, 'true');
    } catch (error) {
      // Storage can be unavailable in strict privacy modes; the popup still closes for this pageview.
    }
  };

  const clearImpactTimer = () => {
    if (!impactTimer) return;
    window.clearTimeout(impactTimer);
    impactTimer = null;
  };

  const focusImpactEmail = () => {
    if (!impactEmailInput) return;

    try {
      impactEmailInput.focus({ preventScroll: true });
    } catch (error) {
      impactEmailInput.focus();
    }
  };

  const getScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return window.scrollY / scrollable;
  };

  function handleImpactScroll() {
    if (getScrollProgress() < .35) return;
    openImpactPopup();
  }

  const closeImpactPopup = (shouldRemember = true) => {
    if (shouldRemember) storeImpactDismissal();
    clearImpactTimer();
    window.removeEventListener('scroll', handleImpactScroll);
    impactPopup.classList.remove('is-open');
    impactPopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('impact-popup-open');
  };

  const openImpactPopup = () => {
    if (impactHasOpened || hasStoredImpactDismissal()) return;

    impactHasOpened = true;
    clearImpactTimer();
    window.removeEventListener('scroll', handleImpactScroll);
    impactPopup.classList.add('is-open');
    impactPopup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('impact-popup-open');

    window.setTimeout(focusImpactEmail, motionQuery.matches ? 90 : 950);
  };

  if (!hasStoredImpactDismissal()) {
    impactTimer = window.setTimeout(openImpactPopup, 6800);
    window.addEventListener('scroll', handleImpactScroll, { passive: true });
  }

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => closeImpactPopup(true));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && impactPopup.classList.contains('is-open')) {
      closeImpactPopup(true);
    }
  });

  if (impactForm) {
    impactForm.addEventListener('submit', () => {
      storeImpactDismissal();
    });
  }
}

document.querySelectorAll('[data-focus-join]').forEach((link) => {
  link.addEventListener('click', () => {
    window.setTimeout(() => {
      const joinInput = document.querySelector('#contact .join-form input[type="email"]');
      if (!joinInput) return;

      try {
        joinInput.focus({ preventScroll: true });
      } catch (error) {
        joinInput.focus();
      }
    }, 250);
  });
});

const mobileDropBar = document.getElementById('mobileDropBar');

if (mobileDropBar) {
  const mobileDropQuery = window.matchMedia('(max-width: 760px)');
  const mobileDropKey = `beastfitMobileDropClosed:${mobileDropBar.dataset.mobileDropPage || 'page'}`;
  const mobileDropClose = mobileDropBar.querySelector('[data-mobile-drop-close]');
  let mobileDropTimer = null;
  let mobileDropShown = false;

  const isMobileDropClosed = () => {
    try {
      return window.sessionStorage.getItem(mobileDropKey) === 'true';
    } catch (error) {
      return false;
    }
  };

  const markMobileDropClosed = () => {
    try {
      window.sessionStorage.setItem(mobileDropKey, 'true');
    } catch (error) {
      // Session storage can be unavailable; the close still works for this pageview.
    }
  };

  const showMobileDrop = () => {
    if (mobileDropShown || !mobileDropQuery.matches || isMobileDropClosed()) return;
    mobileDropShown = true;
    mobileDropBar.classList.add('is-visible');
    mobileDropBar.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-mobile-drop');
  };

  const hideMobileDrop = () => {
    markMobileDropClosed();
    mobileDropBar.classList.remove('is-visible');
    mobileDropBar.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-mobile-drop');
    if (mobileDropTimer) window.clearTimeout(mobileDropTimer);
    window.removeEventListener('scroll', handleMobileDropScroll);
  };

  function handleMobileDropScroll() {
    const hero = document.querySelector('.hero-exact');
    const triggerPoint = hero ? hero.offsetTop + hero.offsetHeight - 80 : 520;
    if (window.scrollY < triggerPoint) return;
    showMobileDrop();
    window.removeEventListener('scroll', handleMobileDropScroll);
  }

  if (!isMobileDropClosed()) {
    if (mobileDropBar.dataset.mobileDropPage === 'shop') {
      mobileDropTimer = window.setTimeout(showMobileDrop, 2600);
    } else {
      window.addEventListener('scroll', handleMobileDropScroll, { passive: true });
    }
  }

  if (mobileDropClose) {
    mobileDropClose.addEventListener('click', hideMobileDrop);
  }
}
