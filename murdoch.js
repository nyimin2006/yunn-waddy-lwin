document.addEventListener('DOMContentLoaded', () => {
  initAtmosphere('petals', 'sparks');

  const photos = [
    {
      src: 'assets/murdoch/Yunn-5.jpg',
      download: 'murdoch-welcome-party-collage.jpg',
      alt: 'Murdoch Welcome Party 2026 Photo Booth Collage'
    },
    {
      src: 'assets/murdoch/Yunn-1.jpeg',
      download: 'murdoch-welcome-party-1.jpeg',
      alt: 'Murdoch Welcome Party Frame 1'
    },
    {
      src: 'assets/murdoch/Yunn-2.jpeg',
      download: 'murdoch-welcome-party-2.jpeg',
      alt: 'Murdoch Welcome Party Frame 2'
    },
    {
      src: 'assets/murdoch/Yunn-3.jpeg',
      download: 'murdoch-welcome-party-3.jpeg',
      alt: 'Murdoch Welcome Party Frame 3'
    },
    {
      src: 'assets/murdoch/Yunn-4.jpeg',
      download: 'murdoch-welcome-party-4.jpeg',
      alt: 'Murdoch Welcome Party Frame 4'
    }
  ];

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');
  const downloadAllPartyBtn = document.getElementById('downloadAllPartyBtn');

  let currentIndex = 0;

  function renderLightbox(index) {
    currentIndex = (index + photos.length) % photos.length;
    const item = photos[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxDownloadBtn.href = item.src;
    lightboxDownloadBtn.download = item.download;
  }

  function openLightbox(index) {
    renderLightbox(index);
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.party-frame[data-lightbox-index]').forEach((frame) => {
    const idx = parseInt(frame.dataset.lightboxIndex, 10) || 0;
    frame.addEventListener('click', () => openLightbox(idx));

    const zoomBtn = frame.querySelector('.zoom-fab');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(idx);
      });
    }
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightbox(currentIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightbox(currentIndex + 1);
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') renderLightbox(currentIndex + 1);
  });

  if (lightboxDownloadBtn) {
    lightboxDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dlName = lightboxDownloadBtn.getAttribute('download') || lightboxDownloadBtn.download || 'party-item';
      if (window.trackSiteAction) {
        window.trackSiteAction(`download-${dlName}`);
      }
      if (window.triggerFileDownload) {
        window.triggerFileDownload(lightboxDownloadBtn.getAttribute('href'), dlName);
      }
    });
  }

  document.querySelectorAll('.party-dl-item').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dlName = anchor.getAttribute('download') || anchor.download || 'party-item';
      if (window.trackSiteAction) {
        window.trackSiteAction(`download-${dlName}`);
      }
      if (window.triggerFileDownload) {
        window.triggerFileDownload(anchor.getAttribute('href'), dlName);
      }
    });
  });

  if (downloadAllPartyBtn) {
    downloadAllPartyBtn.addEventListener('click', async () => {
      if (downloadAllPartyBtn.disabled) return;
      if (window.trackSiteAction) window.trackSiteAction('download-all-murdoch-party');
      const label = downloadAllPartyBtn.querySelector('span');
      const originalText = label ? label.textContent : '';
      downloadAllPartyBtn.disabled = true;
      if (label) label.textContent = 'Downloading...';
      try {
        const items = document.querySelectorAll('.party-dl-item');
        for (const anchor of items) {
          if (window.triggerFileDownload) {
            await window.triggerFileDownload(
              anchor.getAttribute('href'),
              anchor.getAttribute('download') || anchor.download || ''
            );
          }
          await new Promise((r) => setTimeout(r, 220));
        }
      } finally {
        downloadAllPartyBtn.disabled = false;
        if (label) label.textContent = originalText;
      }
    });
  }
});
