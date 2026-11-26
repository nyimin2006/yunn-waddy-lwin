document.addEventListener('DOMContentLoaded', () => {
  initAtmosphere('petals', 'sparks');

  const envelope = document.getElementById('envelope');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const promptHint = document.getElementById('promptHint');
  const toggleEnvelopeBtn = document.getElementById('toggleEnvelopeBtn');
  const toggleText = document.getElementById('toggleText');
  const afterActions = document.getElementById('afterActions');

  let isOpen = false;

  function openEnvelope() {
    if (isOpen) return;
    isOpen = true;

    if (waxSeal && window.spawnHeartBurst) {
      const rect = waxSeal.getBoundingClientRect();
      window.spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
    }

    envelope.classList.add('is-open');
    if (window.trackSiteAction) window.trackSiteAction('opened-letter');

    if (promptHint) {
      promptHint.style.opacity = '0';
      setTimeout(() => {
        promptHint.style.display = 'none';
      }, 300);
    }
    if (afterActions) {
      afterActions.style.display = 'flex';
    }
    if (toggleText) {
      toggleText.textContent = 'Close Envelope';
    }
  }

  function closeEnvelope() {
    if (!isOpen) return;
    isOpen = false;
    envelope.classList.remove('is-open');

    if (promptHint) {
      promptHint.style.display = 'inline-flex';
      setTimeout(() => {
        promptHint.style.opacity = '1';
      }, 80);
    }
    if (afterActions) {
      afterActions.style.display = 'none';
    }
    if (toggleText) {
      toggleText.textContent = 'Open Envelope';
    }
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        openEnvelope();
      }
    });
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      if (!isOpen) {
        openEnvelope();
      }
    });
  }

  if (toggleEnvelopeBtn) {
    toggleEnvelopeBtn.addEventListener('click', () => {
      if (isOpen) {
        closeEnvelope();
      } else {
        openEnvelope();
      }
    });
  }
});
