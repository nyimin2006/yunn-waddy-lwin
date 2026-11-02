// Interactive Envelope Logic for letter.html
document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const promptHint = document.getElementById('promptHint');
  const toggleEnvelopeBtn = document.getElementById('toggleEnvelopeBtn');
  const toggleText = document.getElementById('toggleText');
  const afterActions = document.getElementById('afterActions');
  const petalsContainer = document.getElementById('petals');

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

  // Open Letter logic
  let isOpen = false;

  function openEnvelope() {
    if (isOpen) return;
    isOpen = true;
    envelope.classList.add('is-open');
    if (promptHint) {
      promptHint.style.opacity = '0';
      setTimeout(() => {
        promptHint.style.display = 'none';
      }, 400);
    }
    if (afterActions) {
      afterActions.style.display = 'flex';
    }
    toggleText.textContent = 'Close Envelope';
  }

  function closeEnvelope() {
    if (!isOpen) return;
    isOpen = false;
    envelope.classList.remove('is-open');
    if (promptHint) {
      promptHint.style.display = 'flex';
      setTimeout(() => {
        promptHint.style.opacity = '1';
      }, 100);
    }
    if (afterActions) {
      afterActions.style.display = 'none';
    }
    toggleText.textContent = 'Open Envelope';
  }

  // Clicking envelope or wax seal opens it
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      if (!isOpen) {
        openEnvelope();
      }
    });
  }

  // Toggle button
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
