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
    return { label: 'Bare Bones', value: '' };
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

    if (!currentFitList) return;

    const selectedItems = Object.entries(state)
      .filter(([, value]) => value !== 'none')
      .map(([category, value]) => fitLabels[category][value]);

    currentFitList.innerHTML = '';

    if (!selectedItems.length) {
      const item = document.createElement('li');
      item.textContent = 'No gear selected';
      currentFitList.appendChild(item);
      return;
    }

    selectedItems.forEach((label) => {
      const item = document.createElement('li');
      item.textContent = label;
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
