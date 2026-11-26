(function () {
  const WEBHOOK_URL = '';

  function detectBrowser(ua) {
    if (/WhatsApp/i.test(ua)) return 'WhatsApp In-App';
    if (/Instagram/i.test(ua)) return 'Instagram In-App';
    if (/FBAN|FBAV|Messenger/i.test(ua)) return 'Messenger/FB In-App';
    if (/Line\//i.test(ua)) return 'LINE In-App';
    if (/Telegram/i.test(ua)) return 'Telegram In-App';
    if (/EdgA|EdgiOS|Edg\//i.test(ua)) return 'Edge';
    if (/OPR\/|Opera/i.test(ua)) return 'Opera';
    if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
    if (/CriOS/i.test(ua)) return 'Chrome (iOS)';
    if (/FxiOS/i.test(ua)) return 'Firefox (iOS)';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    if (/Chrome\//i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua)) return 'Chrome';
    if (/Safari\//i.test(ua) && !/Chrome|CriOS|FxiOS|Edg/i.test(ua)) return 'Safari';
    return 'Unknown Browser';
  }

  function detectOS(ua, platformHint, platformVersion) {
    if (/iPhone|iPad|iPod/i.test(ua)) {
      const match = ua.match(/OS (\d+[_\.]\d+(?:[_\.]\d+)?)/);
      const ver = match ? ' ' + match[1].replace(/_/g, '.') : '';
      return `iOS${ver}`;
    }
    if (/Android/i.test(ua)) {
      const match = ua.match(/Android (\d+(?:\.\d+)?)/);
      const ver = match ? ' ' + match[1] : '';
      return `Android${ver}`;
    }
    if (/Windows/i.test(ua) || platformHint === 'Windows') {
      const major = platformVersion ? parseInt(platformVersion.split('.')[0], 10) : 0;
      if (major >= 13) return 'Windows 11';
      if (major > 0) return 'Windows 10';
      return 'Windows';
    }
    if (/Mac OS X|Macintosh/i.test(ua) || platformHint === 'macOS') return 'macOS';
    if (/CrOS/i.test(ua)) return 'ChromeOS';
    if (/Linux/i.test(ua) || platformHint === 'Linux') return 'Linux';
    return 'Unknown OS';
  }

  function parseDeviceFromUA(ua) {
    if (/iPhone/i.test(ua)) return 'iPhone';
    if (/iPad/i.test(ua)) return 'iPad';
    if (/iPod/i.test(ua)) return 'iPod';
    if (/Macintosh/i.test(ua)) return 'Mac';

    const androidMatch = ua.match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build\/|\))/i);
    if (androidMatch && androidMatch[1]) {
      const candidate = androidMatch[1].trim();
      if (candidate && candidate !== 'K' && !/^wv$/i.test(candidate)) {
        return candidate;
      }
      return 'Android Device';
    }

    if (/Windows/i.test(ua)) return 'Windows PC';
    if (/Linux/i.test(ua)) return 'Linux PC';
    return 'Unknown Device';
  }

  async function getDeviceHints() {
    const ua = navigator.userAgent || '';
    let model = '';
    let platformHint = '';
    let platformVersion = '';

    if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
      try {
        const hints = await navigator.userAgentData.getHighEntropyValues([
          'model',
          'platform',
          'platformVersion'
        ]);
        model = (hints.model || '').trim();
        platformHint = (hints.platform || '').trim();
        platformVersion = (hints.platformVersion || '').trim();
      } catch (_) {}
    }

    const os = detectOS(ua, platformHint, platformVersion);
    const browser = detectBrowser(ua);
    const fallbackDevice = parseDeviceFromUA(ua);
    const device = model || fallbackDevice;
    const screenRes = `${window.screen.width}x${window.screen.height}`;

    return { os, browser, device, screenRes };
  }

  async function getSilentLocation() {
    let timezone = '';
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (_) {}

    let ipLocation = null;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.city || data.country_name)) {
          ipLocation = [data.city, data.region, data.country_code || data.country_name]
            .filter(Boolean)
            .join(', ');
        }
      }
    } catch (_) {}

    let gpsCoords = null;
    if (navigator.permissions && navigator.geolocation) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        if (status && status.state === 'granted') {
          gpsCoords = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(`${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`),
              () => resolve(null),
              { maximumAge: 600000, timeout: 3000, enableHighAccuracy: false }
            );
          });
        }
      } catch (_) {}
    }

    return { timezone, ipLocation, gpsCoords };
  }

  function slugify(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'unknown';
  }

  function sendToGoatCounter(eventPath, eventTitle, retries = 25) {
    if (window.goatcounter && typeof window.goatcounter.count === 'function') {
      try {
        window.goatcounter.count({
          path: eventPath,
          title: eventTitle,
          event: true
        });
      } catch (_) {}
      return;
    }
    if (retries > 0) {
      setTimeout(() => sendToGoatCounter(eventPath, eventTitle, retries - 1), 250);
    }
  }

  function sendToWebhook(payload) {
    if (!WEBHOOK_URL) return;
    try {
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content:
            `**New Visit** (${payload.page})\n` +
            `• **OS:** ${payload.os}\n` +
            `• **Browser:** ${payload.browser}\n` +
            `• **Device:** ${payload.device} (${payload.screenRes})\n` +
            `• **Location:** ${payload.locationLabel}`
        }),
        keepalive: true
      }).catch(() => {});
    } catch (_) {}
  }

  async function trackVisit() {
    const rawPage = (window.location.pathname.split('/').filter(Boolean).pop() || 'index').replace(/\.html$/i, '');
    const pageName = rawPage === 'index' ? 'drawings' : rawPage;

    const [deviceInfo, locInfo] = await Promise.all([getDeviceHints(), getSilentLocation()]);

    const locParts = [];
    if (locInfo.ipLocation) locParts.push(locInfo.ipLocation);
    if (locInfo.timezone) locParts.push(locInfo.timezone);
    if (locInfo.gpsCoords) locParts.push(`GPS:${locInfo.gpsCoords}`);
    const locationLabel = locParts.length ? locParts.join(' | ') : 'Location unavailable';

    const eventPath = [
      'visit',
      slugify(pageName),
      slugify(deviceInfo.os),
      slugify(deviceInfo.browser),
      slugify(deviceInfo.device),
      slugify(locInfo.ipLocation || locInfo.timezone || 'noloc')
    ].join('/');

    const eventTitle = `${pageName} | ${deviceInfo.os} | ${deviceInfo.browser} | ${deviceInfo.device} (${deviceInfo.screenRes}) | ${locationLabel}`;

    sendToGoatCounter(eventPath, eventTitle);
    sendToWebhook({
      page: pageName,
      ...deviceInfo,
      locationLabel
    });
  }

  window.trackSiteAction = function (actionName) {
    sendToGoatCounter(`action/${slugify(actionName)}`, actionName);
  };

  if (document.readyState === 'complete') {
    trackVisit();
  } else {
    window.addEventListener('load', trackVisit);
  }
})();
