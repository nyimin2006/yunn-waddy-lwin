// Script for 3-photo romantic gallery
document.addEventListener('DOMContentLoaded', () => {
  const petalsContainer = document.getElementById('petals');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');
  const downloadAllBtn = document.getElementById('downloadAllBtn');

  // Falling Petals (Balanced & Natural)
  const PETAL_COUNT = 34;
  for (let i = 0; i < PETAL_COUNT; i++) {
    createPetal();
  }

  function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 11 + 8; // 8px to 19px
    const left = Math.random() * 100;
    const duration = Math.random() * 7 + 7; // 7s to 14s
    // Negative delay distributes petals across the screen immediately upon load
    const delay = -(Math.random() * duration);

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.left = `${left}%`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    petalsContainer.appendChild(petal);
  }

  // Lightbox View
  function openLightbox(src, filename) {
    lightboxImg.src = src;
    lightboxDownloadBtn.href = src;
    lightboxDownloadBtn.download = filename || 'yunn-waddy-lwin.jpg';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach zoom / lightbox listeners to each photo item
  document.querySelectorAll('.photo-item').forEach((item) => {
    const img = item.querySelector('img');
    const zoomBtn = item.querySelector('.zoom-btn');
    const downloadBtn = item.querySelector('.btn-download-sm');

    const triggerZoom = () => {
      openLightbox(img.src, downloadBtn.download);
    };

    if (zoomBtn) zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerZoom();
    });

    const frame = item.querySelector('.photo-frame');
    if (frame) frame.addEventListener('click', triggerZoom);
  });

  // Download All 3 Photos
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', () => {
      const photos = [
        { id: 'downloadBtn1' },
        { id: 'downloadBtn2' },
        { id: 'downloadBtn3' }
      ];

      photos.forEach((p, idx) => {
        setTimeout(() => {
          const btn = document.getElementById(p.id);
          if (btn) {
            const link = document.createElement('a');
            link.href = btn.href;
            link.download = btn.download;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }, idx * 350); // Stagger downloads slightly to prevent browser blocking
      });
    });
  }
});
