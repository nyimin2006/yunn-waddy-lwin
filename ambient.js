function initAtmosphere(petalsContainerId = 'petals', sparksContainerId = 'sparks') {
  const petalsContainer = document.getElementById(petalsContainerId);
  const sparksContainer = document.getElementById(sparksContainerId);
  const isMobile = window.innerWidth <= 640;

  if (petalsContainer) {
    const petalCount = isMobile ? 28 : 46;
    const minSize = isMobile ? 8 : 10;
    const sizeRange = isMobile ? 7 : 10;

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');
      if (i % 2 === 1) {
        petal.classList.add('petal-alt');
      }
      if (i % 3 === 0) {
        petal.classList.add('petal-rise');
      }

      const size = Math.random() * sizeRange + minSize;
      const left = ((i + Math.random()) / petalCount) * 96 + 2;
      const duration = Math.random() * 8 + (isMobile ? 11 : 10);
      const delay = -(Math.random() * duration);
      const depthOpacity = (Math.random() * 0.30 + 0.44).toFixed(2);

      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.24}px`;
      petal.style.left = `${left}%`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      petal.style.setProperty('--petal-opacity', depthOpacity);

      petalsContainer.appendChild(petal);
    }

    const heartCount = isMobile ? 14 : 22;
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('div');
      heart.classList.add('floating-heart');
      if (i % 2 === 1) {
        heart.classList.add('heart-rise');
      }
      heart.textContent = '♥';

      const size = Math.random() * (isMobile ? 8 : 10) + (isMobile ? 11 : 13);
      const left = ((i + Math.random()) / heartCount) * 94 + 3;
      const duration = Math.random() * 7 + 10;
      const delay = -(Math.random() * duration);
      const opacity = (Math.random() * 0.28 + 0.36).toFixed(2);

      heart.style.fontSize = `${size}px`;
      heart.style.left = `${left}%`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;
      heart.style.setProperty('--heart-opacity', opacity);

      petalsContainer.appendChild(heart);
    }
  }

  if (sparksContainer) {
    const sparkCount = isMobile ? 10 : 16;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.classList.add('bokeh-spark');

      const size = Math.random() * 3 + 2;
      const left = ((i + Math.random()) / sparkCount) * 96 + 2;
      const top = Math.random() * 100;
      const duration = Math.random() * 6 + 6;
      const delay = -(Math.random() * duration);

      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${left}%`;
      spark.style.top = `${top}%`;
      spark.style.animationDuration = `${duration}s`;
      spark.style.animationDelay = `${delay}s`;

      sparksContainer.appendChild(spark);
    }
  }

  window.spawnHeartBurst = function (x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.textContent = '♥';
      const size = Math.random() * 11 + 13;
      const dx = (Math.random() - 0.5) * (count > 6 ? 170 : 72);
      const dy = -(Math.random() * (count > 6 ? 160 : 90) + 42);
      const rot = (Math.random() - 0.5) * 46;

      Object.assign(el.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        fontSize: `${size}px`,
        color: i % 2 === 0 ? '#e05a78' : '#f5c2cd',
        textShadow: '0 0 10px rgba(224, 90, 120, 0.45)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: '9999',
        transform: 'translate(-50%, -50%) scale(0.5)',
        opacity: '1',
        transition: 'transform 1.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.15s ease'
      });

      document.body.appendChild(el);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.12) rotate(${rot}deg)`;
          el.style.opacity = '0';
        });
      });

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 1200);
    }
  };

  document.addEventListener('click', (e) => {
    if (e.clientX && e.clientY) {
      window.spawnHeartBurst(e.clientX, e.clientY, 3);
    }
  });

  const themeBtn = document.createElement('button');
  themeBtn.type = 'button';
  themeBtn.className = 'theme-toggle';
  themeBtn.setAttribute('aria-label', 'Switch color theme');
  document.body.appendChild(themeBtn);

  const systemLightQuery = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: light)')
    : null;

  function syncThemeButton() {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    themeBtn.textContent = current === 'light' ? '☾ Dark' : '☀ Light';
    themeBtn.setAttribute('aria-pressed', current === 'light' ? 'true' : 'false');
  }

  syncThemeButton();

  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('site-theme', next);
    } catch {}
    syncThemeButton();
  });

  if (systemLightQuery && systemLightQuery.addEventListener) {
    systemLightQuery.addEventListener('change', (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem('site-theme');
      } catch {}
      if (saved !== 'light' && saved !== 'dark') {
        document.documentElement.dataset.theme = e.matches ? 'light' : 'dark';
        syncThemeButton();
      }
    });
  }

  window.triggerFileDownload = async function (url, filename) {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
}
