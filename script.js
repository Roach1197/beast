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

const fitBuilder = document.getElementById('build-your-fit');

if (fitBuilder) {
  // Future transparent asset hooks:
  // assets/fit-builder/mannequin-base.png
  // assets/fit-builder/hat-standard.png
  // assets/fit-builder/top-hoodie-iron.png
  // assets/fit-builder/top-tee-relentless.png
  // assets/fit-builder/bottom-shorts-grind.png
  const fitLabels = {
    hat: {
      none: 'No hat',
      snapback: 'Standard Snapback'
    },
    top: {
      none: 'No top',
      hoodie: 'Iron Discipline Hoodie',
      tee: 'Relentless Tee'
    },
    bottom: {
      none: 'No bottom',
      shorts: 'Grind Shorts'
    }
  };
  const fitCategoryLabels = {
    hat: 'Hat',
    top: 'Top',
    bottom: 'Bottom'
  };

  const state = {
    hat: 'none',
    top: 'none',
    bottom: 'none'
  };

  const currentFitList = document.getElementById('currentFitList');
  const fitModeTitle = document.getElementById('fitModeTitle');
  const resetButton = document.getElementById('fitReset');
  const bestComboButton = document.getElementById('fitBestCombo');

  const getMode = () => {
    if (state.top === 'hoodie') return { label: 'Pump Cover / Streetwear', value: 'pump streetwear' };
    if (state.top === 'tee') return { label: 'Training / Clean Fit', value: 'training' };
    return { label: 'Build Your Fit', value: '' };
  };

  const renderFitBuilder = () => {
    Object.entries(state).forEach(([category, value]) => {
      fitBuilder.dataset[category] = value;

      fitBuilder.querySelectorAll(`[data-fit-category="${category}"]`).forEach((button) => {
        const isActive = button.dataset.fitValue === value;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    });

    const mode = getMode();
    fitBuilder.dataset.mode = mode.value;
    if (fitModeTitle) fitModeTitle.textContent = mode.label;
    if (resetButton) {
      resetButton.disabled = Object.values(state).every((value) => value === 'none');
    }

    if (!currentFitList) return;

    currentFitList.innerHTML = '';

    Object.entries(state).forEach(([category, value]) => {
      const item = document.createElement('li');
      const categoryLabel = document.createElement('span');

      categoryLabel.textContent = fitCategoryLabels[category];
      item.appendChild(categoryLabel);
      item.append(fitLabels[category][value]);
      item.classList.toggle('empty', value === 'none');
      currentFitList.appendChild(item);
    });
  };

  fitBuilder.querySelectorAll('.fit-option').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.fitCategory;
      const value = button.dataset.fitValue;

      if (!category || !value || !Object.prototype.hasOwnProperty.call(state, category)) return;

      state[category] = value;
      renderFitBuilder();
    });
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      state.hat = 'none';
      state.top = 'none';
      state.bottom = 'none';
      renderFitBuilder();
    });
  }

  if (bestComboButton) {
    bestComboButton.addEventListener('click', () => {
      state.hat = 'snapback';
      state.top = 'hoodie';
      state.bottom = 'shorts';
      renderFitBuilder();
    });
  }

  renderFitBuilder();
}

const impactPopup = document.getElementById('impactSignupPopup');

if (impactPopup) {
  const impactStorageKey = 'beastfitImpactPopupDismissed';
  const closeTriggers = impactPopup.querySelectorAll('[data-impact-close]');
  const impactForm = impactPopup.querySelector('.impact-popup__form');
  const impactEmailInput = impactPopup.querySelector('#impactPopupEmail');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  let impactTimer = null;
  let impactHasOpened = false;

  const hasStoredImpactDismissal = () => {
    try {
      return window.localStorage.getItem(impactStorageKey) === 'true';
    } catch (error) {
      return false;
    }
  };

  const storeImpactDismissal = () => {
    try {
      window.localStorage.setItem(impactStorageKey, 'true');
    } catch (error) {
      try {
        window.sessionStorage.setItem(impactStorageKey, 'true');
      } catch (sessionError) {
        // Storage can be unavailable in strict privacy modes; the popup still closes for this pageview.
      }
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

  const closeImpactPopup = (shouldRemember = true) => {
    if (shouldRemember) storeImpactDismissal();
    clearImpactTimer();
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

  function handleImpactScroll() {
    if (!mobileQuery.matches || window.scrollY < 320) return;
    openImpactPopup();
  }

  if (!hasStoredImpactDismissal()) {
    impactTimer = window.setTimeout(openImpactPopup, mobileQuery.matches ? 7600 : 6000);
    window.addEventListener('scroll', handleImpactScroll, { passive: true });

    document.addEventListener('mouseout', (event) => {
      if (mobileQuery.matches || event.clientY > 0 || event.relatedTarget) return;
      openImpactPopup();
    }, { once: true });
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
