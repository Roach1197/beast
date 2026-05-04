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

// Add new products by copying one object and updating slug, category, image, copy, and shopPath.
const beastfitProducts = [
  {
    slug: 'hoodie',
    category: 'hoodies',
    name: 'Iron Discipline Hoodie',
    price: '$65',
    image: 'assets/hoodies.jpg',
    imageLabel: 'Iron Discipline Hoodie',
    drop: '001',
    status: 'Active',
    fit: 'Oversized heavyweight',
    use: 'Pump cover / cold starts / streetwear',
    buyIf: 'You want a heavy pump cover, cold-start layer, or streetwear fit.',
    dontBuyIf: 'You want lightweight gear for hot training sessions.',
    fitCall: 'Oversized. True size for relaxed. Size down for cleaner fit.',
    bestPairing: 'Standard Snapback + Grind Shorts',
    care: 'Cold wash inside out. Hang dry if you care.',
    finalCall: 'The main drop piece.',
    shopPath: 'shop.html#hoodies',
    tags: ['Fit', 'Drop 001', 'Heavyweight', 'Pump Cover'],
    loadoutSlugs: ['hoodie', 'snapback', 'shorts']
  },
  {
    slug: 'tee',
    category: 'tees',
    name: 'Relentless Tee',
    price: '$30',
    image: 'assets/tees.jpg',
    imageLabel: 'Relentless Tee',
    drop: '001',
    status: 'Active',
    fit: 'Athletic-boxy',
    use: 'Training / daily wear / warm sessions',
    buyIf: 'You want a cleaner training fit that still looks aggressive.',
    dontBuyIf: 'You want oversized pump-cover energy.',
    fitCall: 'True size for clean fit. Size up for more room.',
    bestPairing: 'Grind Shorts + Standard Snapback',
    care: 'Cold wash inside out. Do not cook it in the dryer unless you enjoy shrink roulette.',
    finalCall: 'The everyday training piece.',
    shopPath: 'shop.html#tees',
    tags: ['Fit', 'Drop 001', 'Training', 'Athletic'],
    loadoutSlugs: ['tee', 'shorts', 'snapback']
  },
  {
    slug: 'shorts',
    category: 'shorts',
    name: 'Grind Shorts',
    price: '$42',
    image: 'assets/shorts.jpg',
    imageLabel: 'Grind Shorts',
    drop: '001',
    status: 'Active',
    fit: 'Above-knee athletic',
    use: 'Leg day / conditioning / daily training',
    buyIf: 'You want above-knee training shorts built for movement.',
    dontBuyIf: 'You want long, baggy lounge shorts.',
    fitCall: 'True size for training. Size up if you want more thigh room.',
    bestPairing: 'Relentless Tee or Iron Discipline Hoodie',
    care: 'Cold wash. Hang dry for longer life.',
    finalCall: 'Leg day ready.',
    shopPath: 'shop.html#shorts',
    tags: ['Fit', 'Drop 001', 'Training', 'Movement'],
    loadoutSlugs: ['tee', 'shorts', 'snapback']
  },
  {
    slug: 'snapback',
    category: 'hats',
    name: 'Standard Snapback',
    price: '$35',
    image: 'assets/hats.jpg',
    imageLabel: 'Standard Snapback',
    drop: '001',
    status: 'Active',
    fit: 'Adjustable structured',
    use: 'Finish the fit',
    buyIf: 'You want the easiest way to finish the uniform.',
    dontBuyIf: 'You hate structured hats.',
    fitCall: 'Adjustable snapback/trucker fit.',
    bestPairing: 'Everything in Drop 001',
    care: 'Spot clean. Do not murder it in the washer.',
    finalCall: 'No overthinking required.',
    shopPath: 'shop.html#hats',
    tags: ['Fit', 'Drop 001', 'Snapback', 'Finish'],
    loadoutSlugs: ['hoodie', 'snapback', 'shorts']
  }
];

const beastfitProductMap = beastfitProducts.reduce((products, product) => {
  products[product.slug] = product;
  return products;
}, {});

window.beastfitProducts = beastfitProducts;

const gearSheet = document.getElementById('gearSheet');

if (gearSheet) {
  const gearPanel = gearSheet.querySelector('.gear-sheet__panel');
  const closeTriggers = gearSheet.querySelectorAll('[data-gear-close]');
  const openTriggers = document.querySelectorAll('[data-gear-open]');
  const tabButtons = gearSheet.querySelectorAll('.gear-tab');
  const panels = gearSheet.querySelectorAll('[data-gear-panel]');
  const fields = {
    meta: document.getElementById('gearSheetMeta'),
    image: document.getElementById('gearSheetImage'),
    scan: document.getElementById('gearSheetScan'),
    title: document.getElementById('gearSheetTitle'),
    price: document.getElementById('gearSheetPrice'),
    use: document.getElementById('gearSheetUse'),
    buyIf: document.getElementById('gearSheetBuyIf'),
    dontBuyIf: document.getElementById('gearSheetDontBuyIf'),
    finalCall: document.getElementById('gearSheetFinalCall'),
    fit: document.getElementById('gearSheetFit'),
    fitCall: document.getElementById('gearSheetFitCall'),
    useCase: document.getElementById('gearSheetUseCase'),
    pairing: document.getElementById('gearSheetPairing'),
    pairings: document.getElementById('gearSheetPairings'),
    care: document.getElementById('gearSheetCare'),
    shopCopy: document.getElementById('gearSheetShopCopy'),
    shopLink: document.getElementById('gearSheetShopLink'),
    stickyLink: document.getElementById('gearSheetStickyLink'),
    footerCall: document.getElementById('gearSheetFooterCall')
  };
  let lastGearFocus = null;

  openTriggers.forEach((trigger) => {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'gearSheet');
    trigger.setAttribute('aria-expanded', 'false');
  });

  const setText = (element, value) => {
    if (element) element.textContent = value || '';
  };

  const setGearTab = (tabName) => {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.gearTab === tabName;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.gearPanel === tabName);
    });
  };

  const renderScanTags = (product) => {
    if (!fields.scan) return;
    fields.scan.textContent = '';
    product.tags.forEach((tag) => {
      const item = document.createElement('span');
      item.textContent = tag;
      fields.scan.appendChild(item);
    });
  };

  const renderPairings = (product) => {
    if (!fields.pairings) return;
    fields.pairings.textContent = '';

    product.loadoutSlugs.forEach((slug) => {
      const item = beastfitProductMap[slug];
      if (!item) return;

      const card = document.createElement('article');
      card.className = 'gear-pairing-card';

      const image = document.createElement('span');
      image.className = 'gear-pairing-card__image';
      image.style.backgroundImage = `url('${item.image}')`;
      image.setAttribute('role', 'img');
      image.setAttribute('aria-label', item.imageLabel);

      const label = document.createElement('strong');
      label.textContent = item.name;

      const fit = document.createElement('small');
      fit.textContent = item.fit;

      card.append(image, label, fit);
      fields.pairings.appendChild(card);
    });
  };

  const renderGearSheet = (slug) => {
    const product = beastfitProductMap[slug] || beastfitProductMap.hoodie;

    gearSheet.dataset.product = product.slug;
    setText(fields.meta, `DROP ${product.drop} · ${product.status.toUpperCase()}`);
    setText(fields.title, product.name);
    setText(fields.price, product.price);
    setText(fields.use, product.use);
    setText(fields.buyIf, product.buyIf);
    setText(fields.dontBuyIf, product.dontBuyIf);
    setText(fields.finalCall, product.finalCall);
    setText(fields.fit, product.fit);
    setText(fields.fitCall, product.fitCall);
    setText(fields.useCase, product.use);
    setText(fields.pairing, product.bestPairing);
    setText(fields.care, product.care);
    setText(fields.shopCopy, `Open ${product.name} and keep the decision moving.`);
    setText(fields.footerCall, product.finalCall);

    if (fields.image) {
      fields.image.style.backgroundImage = `url('${product.image}')`;
      fields.image.setAttribute('aria-label', product.imageLabel);
    }

    [fields.shopLink, fields.stickyLink].forEach((link) => {
      if (!link) return;
      link.href = product.shopPath;
      link.textContent = 'Shop This Piece →';
    });

    renderScanTags(product);
    renderPairings(product);
    setGearTab('verdict');
  };

  const closeGearSheet = () => {
    gearSheet.classList.remove('is-open');
    gearSheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gear-sheet-open');
    openTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));

    if (lastGearFocus && typeof lastGearFocus.focus === 'function') {
      window.setTimeout(() => {
        try {
          lastGearFocus.focus({ preventScroll: true });
        } catch (error) {
          lastGearFocus.focus();
        }
      }, 40);
    }
  };

  const openGearSheet = (slug, trigger) => {
    const product = beastfitProductMap[slug];
    if (!product) return;

    lastGearFocus = trigger || document.activeElement;
    renderGearSheet(slug);
    gearSheet.classList.add('is-open');
    gearSheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gear-sheet-open');
    openTriggers.forEach((button) => {
      button.setAttribute('aria-expanded', String(button.dataset.gearOpen === slug));
    });

    window.setTimeout(() => {
      if (!gearPanel) return;
      try {
        gearPanel.focus({ preventScroll: true });
      } catch (error) {
        gearPanel.focus();
      }
    }, 40);
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openGearSheet(trigger.dataset.gearOpen, trigger);
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeGearSheet);
  });

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setGearTab(button.dataset.gearTab || 'verdict');
    });
  });

  [fields.shopLink, fields.stickyLink].forEach((link) => {
    if (!link) return;
    link.addEventListener('click', closeGearSheet);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && gearSheet.classList.contains('is-open')) {
      closeGearSheet();
    }
  });
}

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
