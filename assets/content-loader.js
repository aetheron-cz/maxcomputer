'use strict';
/* Progressive enhancement: render ALL /api/content keys into index.html.
   Baked-in HTML is the fallback — if API is down, page stays as-is.
   Everything via textContent / created elements — never innerHTML. */
(function () {
  async function j(url) {
    const r = await fetch(url, { credentials: 'same-origin' });
    if (!r.ok) throw new Error(url);
    return r.json();
  }
  function setText(sel, val) {
    if (val == null || val === '') return;
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  }
  function li2(listSel, lines) {
    // lines: ["left|right", ...] → <li><span>left</span><i></i><b>right</b></li>
    const ul = document.querySelector(listSel);
    if (!ul || !Array.isArray(lines)) return;
    ul.textContent = '';
    lines.forEach(function (ln) {
      const parts = String(ln).split('|');
      const li = document.createElement('li');
      const s = document.createElement('span'); s.textContent = parts[0] || '';
      const i = document.createElement('i');
      const b = document.createElement('b'); b.textContent = parts[1] || '';
      li.append(s, i, b); ul.appendChild(li);
    });
  }
  Promise.allSettled([j('/api/content'), j('/api/health')]).then(function (res) {
    if (res[0].status !== 'fulfilled') return;
    const d = res[0].value || {};
    const h = res[1].status === 'fulfilled' ? res[1].value : null;
    try {
      /* ── hero_main (slide 1) ── */
      if (d.hero_main) {
        const hm = d.hero_main;
        if (hm.enabled === 0) {
          const s = document.querySelector('.slide--store');
          if (s) s.hidden = true;
          const dot = document.querySelectorAll('.slides__dots button')[0];
          if (dot) dot.hidden = true;
        } else {
          if (hm.photo) {
            const img = document.querySelector('.store__pic img');
            if (img) img.src = hm.photo;
          }
          const head = document.querySelector('.store__headline');
          if (head && hm.claim) {
            head.textContent = '';
            if (hm.claim_accent && hm.claim.indexOf(hm.claim_accent) >= 0) {
              const parts = hm.claim.split(hm.claim_accent);
              head.append(document.createTextNode(parts[0]));
              const sp = document.createElement('span'); sp.textContent = hm.claim_accent; head.append(sp);
              head.append(document.createTextNode(parts.slice(1).join(hm.claim_accent)));
            } else head.textContent = hm.claim;
          }
          if (Array.isArray(hm.address_lines) && hm.address_lines.length) {
            const addr = document.querySelector('.store__addr');
            if (addr) {
              addr.textContent = '';
              addr.append(document.createTextNode(hm.address_lines.join(', ')));
              addr.append(document.createElement('br'));
              if (hm.hours_short) { addr.append(document.createTextNode(hm.hours_short)); addr.append(document.createElement('br')); }
              const a = document.createElement('a'); a.className = 'store__link';
              a.textContent = hm.map_link_text || 'Kudy k nám →'; a.href = hm.map_href || '#kontakt'; addr.append(a);
            }
          }
        }
      }
      /* ── hero slides 2–5 on/off ── */
      if (d.hero_slides_2_5) {
        const keys = ['slide2_enabled', 'slide3_enabled', 'slide4_enabled', 'slide5_enabled'];
        const slides = document.querySelectorAll('#slides .slide');
        const dots = document.querySelectorAll('.slides__dots button');
        keys.forEach(function (k, i) {
          if (d.hero_slides_2_5[k] === 0) {
            if (slides[i + 1]) slides[i + 1].hidden = true;
            if (dots[i + 1]) dots[i + 1].hidden = true;
          }
        });
      }
      /* ── duo tiles ── */
      if (d.duo) {
        if (d.duo.left) {
          setText('.duo__tile--shop h3', d.duo.left.title);
          const sub = document.querySelector('.duo__tile--shop p');
          if (sub && d.duo.left.sub) sub.textContent = d.duo.left.sub;
          const cta = document.querySelector('.duo__tile--shop .btn');
          if (cta) { if (d.duo.left.cta) cta.textContent = d.duo.left.cta; if (d.duo.left.href) cta.href = d.duo.left.href; }
          if (Array.isArray(d.duo.left.images)) {
            const thumbs = document.querySelectorAll('.duo__thumbs img');
            d.duo.left.images.forEach(function (src, i) { if (thumbs[i] && src) thumbs[i].src = src; });
          }
        }
        if (d.duo.right) {
          setText('.duo__tile--price h3', d.duo.right.title);
          if (Array.isArray(d.duo.right.lines)) li2('.duo__tile--price .lines', d.duo.right.lines);
          const cta = document.querySelector('.duo__tile--price .btn');
          if (cta) { if (d.duo.right.cta) cta.textContent = d.duo.right.cta; if (d.duo.right.href) cta.href = d.duo.right.href; }
        }
      }
      /* ── services → duo price lines fallback ── */
      if (Array.isArray(d.services) && !(d.duo && d.duo.right && Array.isArray(d.duo.right.lines))) {
        li2('.duo__tile--price .lines', d.services.map(function (s) { return s.title + '|' + s.price; }));
      }
      /* ── eset (ochrana.html: balíčky) ── */
      if (d.eset) {
        setText('.ochrana__title', d.eset.title);
        setText('.ochrana__lead', d.eset.lead);
        if (Array.isArray(d.eset.items)) {
          const packs = document.querySelectorAll('.packs .pack');
          d.eset.items.forEach(function (it, i) {
            const card = packs[i];
            if (!card) return;
            const nm = card.querySelector('.pack__name');
            if (nm && it.name) nm.textContent = it.name;
            const sc = card.querySelector('.pack__scope');
            if (sc && it.detail) sc.textContent = it.detail;
            const pr = card.querySelector('.pack__price');
            if (pr && it.price) pr.textContent = it.price;
          });
        }
      }
      /* ── stamps (#razitka) ── */
      if (d.stamps) {
        setText('#razitka h2', d.stamps.title);
        setText('.stamp__note', d.stamps.note);
        if (Array.isArray(d.stamps.rows)) {
          const tb = document.querySelector('.rtab tbody');
          if (tb) {
            tb.textContent = '';
            d.stamps.rows.forEach(function (r) {
              const tr = document.createElement('tr');
              const th = document.createElement('th'); th.scope = 'row'; th.textContent = r[0];
              tr.appendChild(th);
              for (let c = 1; c <= 4; c++) {
                const td = document.createElement('td'); td.textContent = r[c] == null ? '' : String(r[c]);
                tr.appendChild(td);
              }
              tb.appendChild(tr);
            });
          }
        }
      }
      /* ── hours + contacts (#kontakt, footer) ── */
      if (d.hours) {
        const kh = document.querySelector('.kx__hours');
        if (kh && (d.hours.weekdays || d.hours.weekend)) {
          kh.textContent = '';
          if (d.hours.weekdays) kh.append(document.createTextNode(d.hours.weekdays));
          if (d.hours.weekdays && d.hours.weekend) kh.append(document.createElement('br'));
          if (d.hours.weekend) kh.append(document.createTextNode(d.hours.weekend));
        }
      }
      if (d.contacts) {
        const c = d.contacts;
        const addr = document.querySelector('.kx__addr');
        if (addr && (c.company || c.street || c.city)) {
          addr.textContent = '';
          const st = document.createElement('strong'); st.textContent = c.company || ''; addr.append(st);
          if (c.street) { addr.append(document.createElement('br')); addr.append(document.createTextNode(c.street)); }
          if (c.city) { addr.append(document.createElement('br')); addr.append(document.createTextNode(c.city)); }
        }
        const call = document.querySelector('.kx__call a');
        if (call && c.phone) { call.textContent = c.phone; call.href = 'tel:' + c.phone.replace(/\s/g, ''); }
        const mail = document.querySelector('.kx__mail a');
        if (mail && c.email) { mail.textContent = c.email; mail.href = 'mailto:' + c.email; }
        if (Array.isArray(c.people)) {
          const ul = document.querySelector('.people');
          if (ul) {
            ul.textContent = '';
            c.people.forEach(function (p) {
              const li = document.createElement('li');
              const nm = document.createElement('p'); nm.className = 'people__name';
              nm.append(document.createTextNode(p.name || ' '));
              const sp = document.createElement('span'); sp.textContent = p.role || ''; nm.append(sp);
              const cc = document.createElement('p'); cc.className = 'people__c';
              if (p.phone) { const a = document.createElement('a'); a.href = 'tel:' + p.phone.replace(/\s/g, ''); a.textContent = p.phone; cc.append(a); }
              if (p.phone && p.email) cc.append(document.createTextNode(' · '));
              if (p.email) { const a = document.createElement('a'); a.href = 'mailto:' + p.email; a.textContent = p.email; cc.append(a); }
              li.append(nm, cc); ul.appendChild(li);
            });
          }
        }
        const fine = document.querySelector('.kx__fine');
        if (fine && (c.ico || c.dic)) fine.textContent = 'IČO ' + (c.ico || '') + ' · DIČ ' + (c.dic || '');
        const fc = document.querySelector('.foot__c');
        if (fc && (c.phone || c.email || c.street || c.city)) {
          fc.textContent = '';
          if (c.phone) { const a = document.createElement('a'); a.className = 'foot__tel'; a.href = 'tel:' + c.phone.replace(/\s/g, ''); a.textContent = c.phone; fc.append(a); }
          if (c.email) { const a = document.createElement('a'); a.href = 'mailto:' + c.email; a.textContent = c.email; fc.append(a); }
          if (c.street || c.city) { const p = document.createElement('p'); p.textContent = [c.street, c.city].filter(Boolean).join(', '); fc.append(p); }
        }
      }
      /* ── footer ── */
      if (d.footer && d.footer.claim) {
        const f = document.querySelector('.foot__claim');
        if (f) f.textContent = d.footer.claim;
      }
      /* ── last sync meta ── */
      if (h && h.last_sync) {
        const meta = document.querySelector('.duo__meta');
        if (meta) {
          const dt = new Date(h.last_sync);
          meta.textContent = 'Aktualizováno ' + (isNaN(dt) ? h.last_sync : dt.toLocaleString('cs-CZ'));
        }
      }
    } catch (e) { /* keep baked-in fallback */ }
  });
})();
