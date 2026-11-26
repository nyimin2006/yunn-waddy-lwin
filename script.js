document.addEventListener('DOMContentLoaded', () => {
  initAtmosphere('petals', 'sparks');

  const featuredFrame = document.getElementById('featuredFrame');
  const featuredImg = document.getElementById('featuredImg');
  const featuredKicker = document.getElementById('featuredKicker');
  const featuredTitle = document.getElementById('featuredTitle');
  const featuredDownloadBtn = document.getElementById('featuredDownloadBtn');
  const featuredZoomBtn = document.getElementById('featuredZoomBtn');

  const editionCards = document.querySelectorAll('.edition-card');
  const downloadAllBtn = document.getElementById('downloadAllBtn');

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');

  function selectEdition(card) {
    if (!card || card.classList.contains('active')) return;

    editionCards.forEach((c) => c.classList.remove('active'));
    card.classList.add('active');

    const { src, download, kicker, title, alt } = card.dataset;

    featuredImg.classList.add('is-switching');
    setTimeout(() => {
      featuredImg.src = src;
      featuredImg.alt = alt;
      featuredKicker.textContent = kicker;
      featuredTitle.textContent = title;
      featuredDownloadBtn.href = src;
      featuredDownloadBtn.download = download;

      featuredImg.onload = () => {
        featuredImg.classList.remove('is-switching');
      };
      setTimeout(() => featuredImg.classList.remove('is-switching'), 60);
    }, 150);
  }

  editionCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.ed-dl-icon')) {
        e.stopPropagation();
        return;
      }
      selectEdition(card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectEdition(card);
      }
    });
  });

  function openLightbox() {
    lightboxImg.src = featuredImg.src;
    lightboxImg.alt = featuredImg.alt;
    lightboxDownloadBtn.href = featuredDownloadBtn.href;
    lightboxDownloadBtn.download = featuredDownloadBtn.download;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (featuredFrame) {
    featuredFrame.addEventListener('click', openLightbox);
  }
  if (featuredZoomBtn) {
    featuredZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox();
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  const heroHeartBtn = document.getElementById('heroHeartBtn');
  const heroSecretJumpBtn = document.getElementById('heroSecretJumpBtn');
  const secretCard = document.getElementById('secretCard');
  const secretLockView = document.getElementById('secretLockView');
  const unlockSecretBtn = document.getElementById('unlockSecretBtn');
  const unlockSecretPillBtn = document.getElementById('unlockSecretPillBtn');

  if (heroHeartBtn) {
    heroHeartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = heroHeartBtn.getBoundingClientRect();
      if (window.spawnHeartBurst) {
        window.spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
      }
    });
  }

  function unlockSecretNote(e) {
    if (!secretCard || secretCard.classList.contains('is-unlocked')) return;
    if (e) e.stopPropagation();

    if (unlockSecretBtn && window.spawnHeartBurst) {
      const rect = unlockSecretBtn.getBoundingClientRect();
      window.spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
    }
    secretCard.classList.add('is-unlocked');
    if (window.trackSiteAction) window.trackSiteAction('unlocked-secret-reasons');
  }

  if (heroSecretJumpBtn && secretCard) {
    heroSecretJumpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      secretCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        unlockSecretNote();
      }, 450);
    });
  }

  if (secretLockView) {
    secretLockView.addEventListener('click', unlockSecretNote);
  }
  if (unlockSecretBtn) {
    unlockSecretBtn.addEventListener('click', unlockSecretNote);
  }
  if (unlockSecretPillBtn) {
    unlockSecretPillBtn.addEventListener('click', unlockSecretNote);
  }

  if (featuredDownloadBtn) {
    featuredDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dlName = featuredDownloadBtn.getAttribute('download') || featuredDownloadBtn.download;
      if (window.trackSiteAction) {
        window.trackSiteAction(`download-${dlName}`);
      }
      if (window.triggerFileDownload) {
        window.triggerFileDownload(featuredDownloadBtn.getAttribute('href'), dlName);
      }
    });
  }

  if (lightboxDownloadBtn) {
    lightboxDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dlName = lightboxDownloadBtn.getAttribute('download') || lightboxDownloadBtn.download;
      if (window.trackSiteAction) {
        window.trackSiteAction(`download-${dlName}`);
      }
      if (window.triggerFileDownload) {
        window.triggerFileDownload(lightboxDownloadBtn.getAttribute('href'), dlName);
      }
    });
  }

  document.querySelectorAll('.ed-dl-icon').forEach((icon) => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dlName = icon.getAttribute('download') || icon.download;
      if (window.trackSiteAction) {
        window.trackSiteAction(`download-${dlName}`);
      }
      if (window.triggerFileDownload) {
        window.triggerFileDownload(icon.getAttribute('href'), dlName);
      }
    });
  });

  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', async () => {
      if (downloadAllBtn.disabled) return;
      if (window.trackSiteAction) window.trackSiteAction('download-all-drawings');
      const label = downloadAllBtn.querySelector('span');
      const originalText = label ? label.textContent : '';
      downloadAllBtn.disabled = true;
      if (label) label.textContent = 'Downloading...';
      try {
        for (const card of editionCards) {
          if (window.triggerFileDownload) {
            await window.triggerFileDownload(card.dataset.src, card.dataset.download);
          }
          await new Promise((r) => setTimeout(r, 180));
        }
      } finally {
        downloadAllBtn.disabled = false;
        if (label) label.textContent = originalText;
      }
    });
  }
});
