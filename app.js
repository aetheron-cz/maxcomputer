/* MAX COMPUTER — ukázka návrhu.  © 2026 Aetheron. Všechna práva vyhrazena. */
(function () {
  'use strict';

  /* ── nav: solid po odscrollování ─────────────────────────────────── */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── mobilní menu ────────────────────────────────────────────────── */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  function setDrawer(open) {
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) nav.classList.add('is-solid'); else onScroll();
  }
  burger.addEventListener('click', function () { setDrawer(drawer.hidden); });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) setDrawer(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) setDrawer(false);
  });

  /* ── živý stav prodejny (Po–Pá 8:00–12:30, 13:00–17:00, Praha) ───── */
  var SLOTS = [[480, 750], [780, 1020]];          // minuty od půlnoci
  var PREP = { '8:00': 'v 8:00', '12:30': 've 12:30', '13:00': 've 13:00', '17:00': 'v 17:00' };

  function prague() {
    var p = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Prague', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date()).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[p.weekday], mins: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10) };
  }

  function statusText() {
    var t = prague(), d = t.day, m = t.mins, weekday = d >= 1 && d <= 5;
    if (weekday) {
      for (var i = 0; i < SLOTS.length; i++) {
        if (m >= SLOTS[i][0] && m < SLOTS[i][1]) {
          return { open: true, state: 'Otevřeno', more: 'zavíráme ' + PREP[i === 0 ? '12:30' : '17:00'] };
        }
      }
      if (m >= SLOTS[0][1] && m < SLOTS[1][0]) return { open: true, state: 'Polední pauza', more: 'otevíráme ' + PREP['13:00'] };
      if (m < SLOTS[0][0]) return { open: false, state: 'Zavřeno', more: 'otevíráme dnes ' + PREP['8:00'] };
      return { open: false, state: 'Zavřeno', more: 'otevíráme ' + (d === 5 ? 'v pondělí' : 'zítra') + ' v 8:00' };
    }
    return { open: false, state: 'Zavřeno', more: 'otevíráme v pondělí v 8:00' };
  }

  function paintStatus() {
    var s = statusText();
    var box = document.getElementById('status');
    if (box) {
      box.querySelector('.status__state').textContent = s.state;
      box.querySelector('.status__more').textContent = ' · ' + s.more;
      box.classList.toggle('is-open', s.open);
      box.classList.toggle('is-closed', !s.open);
    }
    var alt = document.getElementById('status2');
    if (alt) {
      alt.textContent = s.state + ' · ' + s.more;
      alt.parentElement.classList.toggle('is-open', s.open);
      alt.parentElement.classList.toggle('is-closed', !s.open);
    }
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  /* ── karusel v hlavní dlaždici ───────────────────────────────────── */
  var box = document.getElementById('slides');
  if (box) {
    var slides = box.querySelectorAll('.slide');
    var dots = box.querySelectorAll('.slides__dots button');
    var cur = 0, timer = null, touched = false;
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(n) {
      cur = (n + slides.length) % slides.length;
      for (var k = 0; k < slides.length; k++) {
        var on = k === cur;
        slides[k].classList.toggle('is-active', on);
        slides[k].setAttribute('aria-hidden', on ? 'false' : 'true');
        var focusables = slides[k].querySelectorAll('a, button');
        for (var q = 0; q < focusables.length; q++) focusables[q].tabIndex = on ? 0 : -1;
        if (dots[k]) {
          dots[k].classList.toggle('is-active', on);
          if (on) dots[k].setAttribute('aria-current', 'true'); else dots[k].removeAttribute('aria-current');
        }
      }
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { if (still || touched) return; stop(); timer = setInterval(function () { show(cur + 1); }, 6500); }
    function manual(n) { touched = true; stop(); show(n); }

    box.querySelector('.slides__arrow--prev').addEventListener('click', function () { manual(cur - 1); });
    box.querySelector('.slides__arrow--next').addEventListener('click', function () { manual(cur + 1); });
    Array.prototype.forEach.call(dots, function (dot, k) {
      dot.addEventListener('click', function () { manual(k); });
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') manual(cur - 1);
      else if (e.key === 'ArrowRight') manual(cur + 1);
    });

    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) manual(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });

    box.addEventListener('mouseenter', stop);
    box.addEventListener('mouseleave', start);
    box.addEventListener('focusin', stop);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

    show(0);
    start();
  }

  /* ── formulář (v ukázce neodesílá) ───────────────────────────────── */
  var form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formMsg');
      if (!form.checkValidity()) {
        msg.textContent = 'Vyplňte prosím jméno, e-mail a zprávu.';
        return;
      }
      msg.textContent = 'Ukázka návrhu — formulář zatím neodesílá. Napište prosím na info@maxcomputer.cz nebo volejte 770 130 605.';
    });
  }

  /* ── ochrana autorství ───────────────────────────────────────────── */
  console.log(
    '%cMAX COMPUTER — ukázka návrhu\n%c© 2026 Aetheron · Všechna práva vyhrazena.\nKopírování, šíření nebo úprava tohoto návrhu je bez písemného souhlasu zakázáno.',
    'font:600 15px/1.4 sans-serif;color:#e8581f', 'font:12px/1.5 sans-serif;color:#767d87'
  );
  function block(e) { e.preventDefault(); return false; }
  document.addEventListener('contextmenu', block, true);
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') return block(e);
  }, true);
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (e.key === 'F12') return block(e);
    if (mod && (k === 's' || k === 'u')) return block(e);
    if (mod && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) return block(e);
  }, true);
})();
