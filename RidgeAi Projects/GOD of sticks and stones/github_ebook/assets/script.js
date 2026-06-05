(function () {
  'use strict';

  /* ── Theme ────────────────────────────────────────────────────────────── */
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('gosss-theme') || 'light';
  root.dataset.theme = savedTheme;
  syncThemeBtn();

  function toggleTheme() {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('gosss-theme', next);
    syncThemeBtn();
  }

  function syncThemeBtn() {
    var btn = document.getElementById('theme-btn');
    if (!btn) return;
    if (root.dataset.theme === 'dark') {
      btn.textContent = '☀'; // sun
      btn.title = 'Switch to light mode';
    } else {
      btn.textContent = '☽'; // crescent moon
      btn.title = 'Switch to dark mode';
    }
  }

  /* ── Font size ────────────────────────────────────────────────────────── */
  var MIN_FONT = 14, MAX_FONT = 28;
  var fontSize = parseInt(localStorage.getItem('gosss-font') || '18', 10);
  applyFont();

  function adjustFont(delta) {
    fontSize = Math.max(MIN_FONT, Math.min(MAX_FONT, fontSize + delta));
    localStorage.setItem('gosss-font', String(fontSize));
    applyFont();
  }

  function applyFont() {
    document.documentElement.style.setProperty('--font-size', fontSize + 'px');
  }

  /* ── Accordion ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all panels
      document.querySelectorAll('.accordion-header').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });

      // Open the clicked panel if it was closed
      if (!wasOpen) {
        btn.setAttribute('aria-expanded', 'true');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      }
    });
  });

  /* ── Expose to onclick handlers ───────────────────────────────────────── */
  window.toggleTheme = toggleTheme;
  window.adjustFont = adjustFont;

  /* ── GoatCounter analytics ────────────────────────────────────────────── */
  // GoatCounter analytics — godofsticks.goatcounter.com
  (function () {
    var gc = document.createElement('script');
    gc.dataset.goatcounter = 'https://godofsticks.goatcounter.com/count';
    gc.async = true;
    gc.src = '//gc.zgo.at/count.js';
    document.head.appendChild(gc);
  }());

  /* ── Visitor counter (homepage only) ─────────────────────────────────── */
  // Requires GoatCounter to be configured above and public stats enabled.
  // Displays "Readers served: N" in the footer of the homepage only.
  var counterEl = document.getElementById('reader-count');
  if (counterEl) {
    fetch('https://godofsticks.goatcounter.com/counter//.json')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.count) {
          counterEl.textContent = 'Readers served: ' + d.count;
        }
      })
      .catch(function () {}); // fails silently if not configured
  }

}());
