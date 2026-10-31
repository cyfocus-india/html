/* ==========================================================================
   Dashmile Couriers — dashboard.js
   --------------------------------------------------------------------------
   Customer dashboard: pickups, live tracking, shipment history, invoices,
   profile & settings, notifications. All data lives in localStorage
   (key "dm-dashboard-v1") and is seeded with realistic sample records the
   first time the page opens. Depends on window.DM from main.js.
   1. Session guard & helpers      2. Sample data (seed)
   3. Shell: routing, sidebar, dropdowns, modals, toasts
   4. Overview (KPIs, canvas chart, CSS donut)
   5. Pickups   6. Live tracking   7. Shipments   8. Invoices
   9. Settings  10. Live simulation  11. Boot
   ========================================================================== */
(function () {
  'use strict';

  var DM = window.DM;
  if (!DM) return;

  /* ======================================================================
     1. Session guard & helpers
     ====================================================================== */
  var SESSION_KEY = 'dm-session';
  var STORE_KEY = 'dm-dashboard-v1';
  var USERS_KEY = 'dm-users';

  function readSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return { name: 'Demo Customer', email: 'demo@dashmile.in' }; // storage blocked: run in demo mode
    }
  }

  var session = readSession();
  if (!session) {
    session = { name: 'Demo Customer', email: 'demo@dashmile.in', company: 'Kesar & Clay Ceramics' };
  }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  var esc = DM.esc;
  var money = DM.money;
  var DAY = 864e5, HOUR = 36e5, MIN = 6e4;

  function startOfDay(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function isoDate(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function parseISO(str) { var p = str.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtDate(ts) { return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function fmtShort(ts) { return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
  function nextWorkingDay(from, n) {
    var d = new Date(from); d.setHours(0, 0, 0, 0);
    n = n || 1;
    while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) n--; }
    return d;
  }
  function initials(name) {
    var parts = (name || 'Dashmile Member').split(/\s+/).filter(Boolean);
    var pick = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
    return pick.map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  function serviceName(id) { return (DM.SERVICES[id] || {}).name || id; }
  function hash(str) { // same simple hash as main.js, used to update demo passwords
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return 'h' + (h >>> 0).toString(36);
  }
  function rng(seed) { // deterministic PRNG so sample data looks the same for everyone
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var STAGES = [[0, 'Booked'], [10, 'Picked up'], [30, 'At hub'], [55, 'In transit'], [80, 'Out for delivery'], [100, 'Delivered']];
  function statusFor(p) {
    var s = 'Booked';
    STAGES.forEach(function (st) { if (p >= st[0]) s = st[1]; });
    return s;
  }
  var PILL = {
    'Booked': 'pill--muted', 'Picked up': 'pill--brand', 'At hub': 'pill--brand', 'In transit': 'pill--info',
    'Out for delivery': 'pill--amber', 'Delivered': 'pill--success', 'Attempted': 'pill--danger', 'Returned': 'pill--danger',
    'Scheduled': 'pill--info', 'Collected': 'pill--success', 'Cancelled': 'pill--muted', 'Due': 'pill--amber', 'Paid': 'pill--success'
  };
  function pill(status) { return '<span class="pill ' + (PILL[status] || '') + '">' + esc(status) + '</span>'; }
  function isActive(s) { return s.status !== 'Delivered' && s.status !== 'Returned'; }
  function isMoving(s) { return isActive(s) && s.status !== 'Attempted'; }

  // Hours for a full journey, used for ETA estimates
  var JOURNEY = { dash: 1.5, same: 7, next: 24, air: 26 };
  var SURFACE_HOURS = { R: 36, M: 84, N: 120, S: 168 };
  function journeyHours(s) {
    if (s.service === 'surface') { var z = DM.zoneFor(s.pin); return SURFACE_HOURS[z ? z.code : 'N']; }
    return JOURNEY[s.service] || 24;
  }
  function etaText(s) {
    if (s.status === 'Delivered') return 'Delivered ' + DM.fmtWhen(s.deliveredAt);
    if (s.status === 'Returned') return 'Returned to you';
    if (s.status === 'Attempted') return 'Awaiting reattempt';
    return DM.fmtWhen(Date.now() + (100 - s.progress) / 100 * journeyHours(s) * HOUR);
  }
  function placeFor(stage, s) {
    var area = s.city.split(',')[0];
    return {
      'Booked': 'Customer dashboard',
      'Picked up': 'Pickup from ' + (state.profile.area || 'Pune'),
      'At hub': 'Hadapsar sortation hub, Pune',
      'In transit': s.service === 'air' ? 'Flight out of Pune airport (PNQ)' : (DM.zoneFor(s.pin) || {}).code === 'L' ? 'On the way across Pune' : 'Linehaul towards ' + s.city.split(',').pop().trim(),
      'Out for delivery': area + ' beat, rider assigned',
      'Delivered': 'Handed over in ' + area + ', OTP verified'
    }[stage];
  }

  /* ======================================================================
     2. Sample data
     ====================================================================== */
  var RECEIVERS = [
    ['Priya Menon', 'Koramangala, Bengaluru', '560034'], ['Arjun Rao', 'Banjara Hills, Hyderabad', '500034'],
    ['Sana Qureshi', 'Andheri West, Mumbai', '400058'], ['Vikram Sethi', 'Malviya Nagar, Delhi', '110017'],
    ['Neha Kulkarni', 'Baner, Pune', '411045'], ['Rahul Deshmukh', 'Dharampeth, Nagpur', '440010'],
    ['Ishita Bose', 'Salt Lake, Kolkata', '700091'], ['Karan Mehta', 'Navrangpura, Ahmedabad', '380009'],
    ['Meenakshi Iyer', 'Adyar, Chennai', '600020'], ['Omkar Patil', 'Rajarampuri, Kolhapur', '416008'],
    ['Tanvi Naik', 'Panaji, Goa', '403001'], ['Rohit Agarwal', 'C-Scheme, Jaipur', '302001'],
    ['Aditi Nair', 'Kadavanthra, Kochi', '682020'], ['Farhan Ali', 'Gomti Nagar, Lucknow', '226010'],
    ['Pooja Shinde', 'Wakad, Pune', '411057'], ['Nikhil Jain', 'Vijay Nagar, Indore', '452010'],
    ['Riya Das', 'Zoo Road, Guwahati', '781024'], ['Siddharth Gokhale', 'Kothrud, Pune', '411038'],
    ['Ayesha Khan', 'Camp, Pune', '411001'], ['Manish Gupta', 'Sector 17, Chandigarh', '160017'],
    ['Lavanya Reddy', 'Gachibowli, Hyderabad', '500032'], ['Devika Pawar', 'Chinchwad, Pune', '411033'],
    ['Harsh Vora', 'Thane West, Thane', '400601'], ['Kavya Hegde', 'Indiranagar, Bengaluru', '560038']
  ];

  function chargeFor(s) {
    var q = DM.quote({ pin: s.pin, service: s.service, weight: s.weight, cod: s.cod > 0, codAmount: s.cod });
    return q ? q.total : 0;
  }

  function buildLog(s, bookedAt, upto) {
    var span = journeyHours(s) * HOUR;
    return STAGES.filter(function (st) { return st[0] <= upto; }).map(function (st) {
      return { s: st[1], t: Math.min(Date.now() - MIN, bookedAt + span * st[0] / 100), at: placeFor(st[1], s) };
    });
  }

  function seed() {
    var now = Date.now();
    var r = rng(4821);
    var profile = {
      name: session.name || 'Customer', email: session.email || '', company: session.company || 'Kesar & Clay Ceramics',
      phone: '98230 55417', address: 'Lane 4, Prabhat Road, Erandwane', area: 'Erandwane, Pune', pin: '411004', gstin: '',
      notify: { whatsapp: true, sms: true, email: false }
    };
    state = { version: 1, profile: profile, pickups: [], shipments: [], invoices: [], notifs: [] };

    // Active parcels: [receiver index, service, progress, hours ago, cod]
    var active = [
      [4, 'same', 88, 4, 0], [0, 'air', 62, 20, 1499], [2, 'surface', 45, 26, 0],
      [17, 'next', 18, 3, 0], [7, 'air', 81, 22, 2399], [23, 'surface', 0, 1, 899]
    ];
    var list = [];
    // Older delivered parcels spread over the last 30 days
    var deliveredIdx = [1, 3, 5, 6, 8, 9, 10, 11, 12, 13, 15, 18, 19, 20, 21, 22, 0, 2];
    deliveredIdx.forEach(function (ri, i) {
      var rec = RECEIVERS[ri];
      var local = DM.zoneFor(rec[2]).code === 'L';
      var service = local ? ['same', 'next', 'dash'][i % 3] : (r() > 0.45 ? 'surface' : 'air');
      var bookedAt = startOfDay(now) - (2 + Math.floor(i * 1.55)) * DAY + (9 + Math.floor(r() * 8)) * HOUR;
      list.push({ rec: rec, service: service, progress: 100, bookedAt: bookedAt, weight: Math.round((0.4 + r() * 3.2) * 10) / 10, cod: r() > 0.6 ? Math.round(499 + r() * 2500) : 0 });
    });
    // One returned and one failed attempt
    list.push({ rec: RECEIVERS[16], service: 'surface', progress: 100, bookedAt: now - 18 * DAY, weight: 1.6, cod: 1250, returned: true });
    list.push({ rec: RECEIVERS[14], service: 'same', progress: 85, bookedAt: now - 27 * HOUR, weight: 0.9, cod: 0, attempted: true });
    active.forEach(function (a) {
      list.push({ rec: RECEIVERS[a[0]], service: a[1], progress: a[2], bookedAt: now - a[3] * HOUR, weight: Math.round((0.6 + r() * 2.4) * 10) / 10, cod: a[4] });
    });
    list.sort(function (a, b) { return a.bookedAt - b.bookedAt; });

    var num = 48229180;
    state.shipments = list.map(function (x) {
      num += 11 + Math.floor(r() * 46);
      var s = {
        id: 'DM' + num, bookedAt: x.bookedAt, name: x.rec[0], city: x.rec[1], pin: x.rec[2],
        phone: '9' + String(Math.floor(100000000 + r() * 899999999)), service: x.service, weight: x.weight, cod: x.cod,
        progress: x.progress, status: statusFor(x.progress)
      };
      s.charge = chargeFor(s);
      s.log = buildLog(s, x.bookedAt, x.progress);
      if (x.progress >= 100) s.deliveredAt = s.log[s.log.length - 1].t;
      if (x.returned) {
        s.status = 'Returned';
        s.log = buildLog(s, x.bookedAt, 80);
        s.log.push({ s: 'Returned', t: x.bookedAt + 9 * DAY, at: 'Back at Hadapsar hub after two failed attempts' });
        delete s.deliveredAt;
      }
      if (x.attempted) {
        s.status = 'Attempted';
        s.log.push({ s: 'Delivery attempted', t: now - 2 * HOUR, at: 'Receiver not reachable, two calls unanswered' });
      }
      return s;
    }).reverse();

    // Pickups
    var first = new Date(now).getHours() < 15 && new Date(now).getDay() !== 0 ? new Date(now) : nextWorkingDay(now, 1);
    state.pickups = [
      { id: 'PU-3191', date: isoDate(nextWorkingDay(first, 1)), slot: '11:00 AM – 1:00 PM', address: profile.address, pin: profile.pin, parcels: 14, weight: 18, service: 'surface', status: 'Scheduled', notes: 'Fourteen cartons, please bring a trolley' },
      { id: 'PU-3184', date: isoDate(first), slot: '3:00 – 5:00 PM', address: profile.address, pin: profile.pin, parcels: 6, weight: 7.5, service: 'same', status: 'Scheduled', notes: 'Parcels at the security desk' },
      { id: 'PU-3152', date: isoDate(new Date(now - DAY)), slot: '3:00 – 5:00 PM', address: profile.address, pin: profile.pin, parcels: 9, weight: 11.2, service: 'air', status: 'Collected', notes: '' },
      { id: 'PU-3139', date: isoDate(new Date(now - 3 * DAY)), slot: '11:00 AM – 1:00 PM', address: profile.address, pin: profile.pin, parcels: 4, weight: 3.8, service: 'same', status: 'Collected', notes: '' },
      { id: 'PU-3127', date: isoDate(new Date(now - 4 * DAY)), slot: '5:00 – 7:00 PM', address: 'Unit 3, Sai Industrial Park, Kondhwa', pin: '411048', parcels: 22, weight: 31, service: 'surface', status: 'Cancelled', notes: 'Cancelled: stock not ready' },
      { id: 'PU-3120', date: isoDate(new Date(now - 6 * DAY)), slot: '9:00 – 11:00 AM', address: profile.address, pin: profile.pin, parcels: 11, weight: 9.6, service: 'next', status: 'Collected', notes: '' }
    ];

    // Invoices: one per half-month, newest first
    var d = new Date(now);
    var periodStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() <= 15 ? 1 : 16);
    for (var k = 1; k <= 6; k++) {
      var end = new Date(periodStart.getTime() - DAY);
      var start = new Date(end.getFullYear(), end.getMonth(), end.getDate() > 15 ? 16 : 1);
      var same = 8 + Math.floor(r() * 18), surf = 6 + Math.floor(r() * 16), air = 2 + Math.floor(r() * 8), cod = 3 + Math.floor(r() * 9);
      var lines = [
        ['Same-Day and Next-Day Local parcels', same, 84],
        ['Surface parcels (Regional & National)', surf, 118],
        ['Air Express parcels', air, 296],
        ['Cash on Delivery fees', cod, 46]
      ];
      var sub = lines.reduce(function (t, l) { return t + l[1] * l[2]; }, 0);
      var month = String(end.getMonth() + 1);
      state.invoices.push({
        id: 'INV-' + end.getFullYear() + (month.length < 2 ? '0' : '') + month + (start.getDate() === 1 ? 'A' : 'B'),
        from: start.getTime(), to: end.getTime(), parcels: same + surf + air,
        lines: lines, subtotal: sub, gst: Math.round(sub * 18) / 100, amount: Math.round(sub * 118) / 100,
        due: end.getTime() + 15 * DAY, status: k === 1 ? 'Due' : 'Paid', paidAt: k === 1 ? null : end.getTime() + (6 + k) * DAY
      });
      periodStart = start;
    }

    var latestInv = state.invoices[0];
    var moving = state.shipments.filter(function (s) { return s.status === 'Out for delivery'; })[0];
    state.notifs = [
      { id: 1, text: moving ? moving.id + ' is out for delivery to ' + moving.name + ', ' + moving.city.split(',').pop().trim() + '.' : 'A parcel is out for delivery.', t: now - 25 * MIN, read: false, view: 'tracking' },
      { id: 2, text: 'Pickup PU-3184 is confirmed for ' + DM.fmtDay(parseISO(state.pickups[1].date)) + ', 3:00 – 5:00 PM.', t: now - 2 * HOUR, read: false, view: 'pickups' },
      { id: 3, text: 'Invoice ' + latestInv.id + ' is ready: ' + money(latestInv.amount) + ' due by ' + fmtShort(latestInv.due) + '.', t: now - 20 * HOUR, read: false, view: 'invoices' },
      { id: 4, text: 'COD payout of ₹12,450.00 was credited to your bank account ending 4417.', t: now - 2 * DAY, read: true, view: 'shipments' },
      { id: 5, text: 'Weight for a Surface parcel was updated from 1.2 kg to 1.5 kg after hub scanning (photo attached).', t: now - 4 * DAY, read: true, view: 'shipments' }
    ];
    save();
    return state;
  }

  var state = null;
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.version === 1 && s.shipments) { state = s; return; }
    } catch (e) { /* fall through to seed */ }
    seed();
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage blocked */ } }

  function notify(text, view) {
    var id = state.notifs.reduce(function (m, n) { return Math.max(m, n.id); }, 0) + 1;
    state.notifs.unshift({ id: id, text: text, t: Date.now(), read: false, view: view });
    state.notifs = state.notifs.slice(0, 25);
  }

  /* ======================================================================
     3. Shell — routing, sidebar, dropdowns, modals, toasts
     ====================================================================== */
  var VIEWS = ['overview', 'pickups', 'tracking', 'shipments', 'invoices', 'settings'];
  var currentView = 'overview';

  function showView(name, focusHeading) {
    if (name === 'book') {
      window.location.replace('contact.html?topic=pickup');
      return;
    }
    if (VIEWS.indexOf(name) === -1) name = 'overview';
    currentView = name;
    $$('.view').forEach(function (v) { v.hidden = v.getAttribute('data-panel') !== name; });
    $$('.dash-nav a').forEach(function (a) {
      var on = a.getAttribute('data-view') === name;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    renderView(name);
    if (focusHeading) {
      var h = $('[data-panel="' + name + '"] h1');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener('hashchange', function () {
    closeSide();
    closeDropdowns();
    showView(window.location.hash.slice(1), true);
  });

  // Sidebar (off-canvas on tablet & mobile)
  var side = $('#dash-side');
  var burger = $('.dash-burger');
  var overlay = $('.dash-overlay');
  function openSide() {
    side.classList.add('is-open');
    overlay.classList.add('is-visible');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close dashboard menu');
    document.body.classList.add('no-scroll');
    var first = $('.dash-nav a', side);
    if (first) window.setTimeout(function () { first.focus(); }, 60);
  }
  function closeSide(returnFocus) {
    if (!side.classList.contains('is-open')) return;
    side.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open dashboard menu');
    document.body.classList.remove('no-scroll');
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', function () { side.classList.contains('is-open') ? closeSide() : openSide(); });
  overlay.addEventListener('click', function () { closeSide(); });

  // Dropdowns (notifications + profile)
  function closeDropdowns(except) {
    $$('.dd').forEach(function (dd) {
      if (dd === except) return;
      $('.dd-panel', dd).hidden = true;
      $('.dd-toggle', dd).setAttribute('aria-expanded', 'false');
    });
  }
  $$('.dd').forEach(function (dd) {
    var btn = $('.dd-toggle', dd), panel = $('.dd-panel', dd);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.hidden;
      closeDropdowns(dd);
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) { var f = $('button, a', panel); if (f) f.focus(); }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dd')) closeDropdowns();
    if (side.classList.contains('is-open') && !side.contains(e.target) && !burger.contains(e.target)) closeSide();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openDd = $$('.dd').filter(function (dd) { return !$('.dd-panel', dd).hidden; })[0];
    if (openDd) { closeDropdowns(); $('.dd-toggle', openDd).focus(); return; }
    if (side.classList.contains('is-open')) closeSide(true);
  });
  // Keep focus inside the off-canvas sidebar while it is open
  side.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !side.classList.contains('is-open')) return;
    var f = $$('a[href], button', side);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  // Modals (native <dialog>)
  function openModal(dlg) {
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    var first = $('input, select, textarea, button:not(.modal-x)', dlg);
    if (first) first.focus();
  }
  function closeModal(dlg) {
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeModal(dlg);
      if (e.target === dlg) closeModal(dlg); // click on the backdrop
    });
  });

  var confirmCb = null;
  function confirmAction(title, text, okLabel, cb) {
    var dlg = $('#confirm-modal');
    $('#confirm-title').textContent = title;
    $('#confirm-text').textContent = text;
    $('#confirm-ok').textContent = okLabel;
    confirmCb = cb;
    openModal(dlg);
    $('#confirm-ok').focus();
  }
  $('#confirm-ok').addEventListener('click', function () {
    closeModal($('#confirm-modal'));
    if (confirmCb) confirmCb();
    confirmCb = null;
  });

  function toast(html) {
    var box = $('#toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span aria-hidden="true">✓</span><div>' + html + '</div>';
    box.appendChild(el);
    window.setTimeout(function () { el.remove(); }, 4200);
  }

  function setErr(input, msg) {
    var field = input.closest('.field');
    var err = field && $('.field-error', field);
    if (field) field.classList.toggle('has-error', !!msg);
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    if (err) err.textContent = msg || '';
    return !msg;
  }
  function clearErrors(form) {
    $$('.has-error', form).forEach(function (f) { f.classList.remove('has-error'); });
    $$('.field-error', form).forEach(function (f) { f.textContent = ''; });
    $$('[aria-invalid]', form).forEach(function (f) { f.removeAttribute('aria-invalid'); });
  }
  function focusFirstError(form) { var bad = $('[aria-invalid="true"]', form); if (bad) bad.focus(); }

  function download(filename, content, type) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // Global actions via data-action buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    if (action === 'book') {
      window.location.href = 'contact.html?topic=pickup';
      return;
    }
    if (action === 'new-shipment') openShipModal();
    if (action === 'export') exportCSV();
    if (action === 'read-all') {
      state.notifs.forEach(function (n) { n.read = true; });
      save(); renderNotifs();
    }
    if (action === 'logout') {
      try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); } catch (err) { /* ignore */ }
      window.location.href = 'signin.html?logout=1';
    }
    if (action === 'reset') {
      confirmAction('Reset sample data?', 'This replaces your pickups, shipments, invoices and notifications with the original sample set. Your profile details are kept.', 'Reset data', function () {
        var keep = state.profile;
        seed();
        state.profile = keep;
        save();
        renderAll();
        toast('Sample data restored.');
      });
    }
  });

  /* ---------- Header: greeting, avatar, notifications, sidebar counts ---------- */
  function renderHeader() {
    var p = state.profile;
    var hour = new Date().getHours();
    var part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    $('#dash-greeting').textContent = part + ', ' + p.name.split(' ')[0] + (p.company ? ' · ' + p.company : '');
    $('#avatar-initials').textContent = initials(p.name);
    $('#profile-name').textContent = p.name;
    $('#profile-email').textContent = p.email;
    var sched = state.pickups.filter(function (x) { return x.status === 'Scheduled'; }).length;
    var moving = state.shipments.filter(isActive).length;
    var due = state.invoices.filter(function (i) { return i.status === 'Due'; }).length;
    $('[data-count="pickups"]').textContent = sched || '';
    $('[data-count="tracking"]').textContent = moving || '';
    $('[data-count="invoices"]').textContent = due || '';
  }

  function renderNotifs() {
    var unread = state.notifs.filter(function (n) { return !n.read; }).length;
    var badge = $('#notif-badge');
    badge.hidden = !unread;
    badge.textContent = unread;
    $('#notif-dd .dd-toggle').setAttribute('aria-label', 'Notifications' + (unread ? ', ' + unread + ' unread' : ''));
    $('#notif-list').innerHTML = state.notifs.length ? state.notifs.map(function (n) {
      return '<li class="' + (n.read ? '' : 'is-unread') + '"><button type="button" data-notif="' + n.id + '"><span class="dot" aria-hidden="true"></span><span><strong>' + esc(n.text) + '</strong><time>' + DM.fmtWhen(n.t) + '</time></span></button></li>';
    }).join('') : '<li class="notif-empty">You\'re all caught up.</li>';
  }
  $('#notif-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-notif]');
    if (!b) return;
    var n = state.notifs.filter(function (x) { return x.id === +b.getAttribute('data-notif'); })[0];
    if (!n) return;
    n.read = true;
    save();
    renderNotifs();
    closeDropdowns();
    if (n.view) window.location.hash = n.view;
  });

  /* ======================================================================
     4. Overview
     ====================================================================== */
  var chartRange = 14;

  function kpi(icon, value, label, sub, amber) {
    return '<div class="kpi"><span class="icon-tile' + (amber ? ' icon-tile--amber' : '') + '" aria-hidden="true">' + icon + '</span><div><strong>' + value + '</strong><span class="kpi-label">' + label + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div>';
  }

  function renderOverview() {
    var active = state.shipments.filter(isActive);
    var ofd = active.filter(function (s) { return s.status === 'Out for delivery'; }).length;
    var monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    var deliveredMonth = state.shipments.filter(function (s) { return s.status === 'Delivered' && s.deliveredAt >= monthStart; }).length;
    var bookedMonth = state.shipments.filter(function (s) { return s.bookedAt >= monthStart; }).length;
    var sched = state.pickups.filter(function (p) { return p.status === 'Scheduled'; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var due = state.invoices.filter(function (i) { return i.status === 'Due'; });
    var dueSum = due.reduce(function (t, i) { return t + i.amount; }, 0);

    $('#overview-sub').textContent = active.length + ' parcels on the move and ' + sched.length + ' pickups coming up.';
    $('#kpis').innerHTML =
      kpi('🚚', active.length, 'Active shipments', ofd + ' out for delivery') +
      kpi('✅', deliveredMonth, 'Delivered this month', bookedMonth + ' booked this month') +
      kpi('🗓', sched.length, 'Upcoming pickups', sched[0] ? 'Next: ' + DM.fmtDay(parseISO(sched[0].date)) : 'None booked') +
      kpi('🧾', money(dueSum), 'Amount due', due.length ? due.length + ' invoice' + (due.length > 1 ? 's' : '') + ' open' : 'All invoices paid', true);

    drawChart();
    renderDonut();
    renderMiniLive();

    var np = sched[0];
    $('#next-pickup').innerHTML = np
      ? '<div class="next-pickup"><span class="big">' + DM.fmtDay(parseISO(np.date)) + '</span><div class="muted">' + esc(np.slot) + '</div>' +
        '<dl><div><dt>Pickup</dt><dd class="mono">' + np.id + '</dd></div><div><dt>Parcels</dt><dd>' + np.parcels + ' · ' + np.weight + ' kg</dd></div><div><dt>Service</dt><dd>' + serviceName(np.service) + '</dd></div><div><dt>Address</dt><dd>' + esc(np.address) + '</dd></div></dl>' +
        '<div class="row-actions" style="justify-content:flex-start"><button class="act" type="button" data-edit-pickup="' + np.id + '" data-key="ov-edit">Reschedule</button><button class="act act--danger" type="button" data-cancel-pickup="' + np.id + '" data-key="ov-cancel">Cancel pickup</button></div></div>'
      : '<p class="empty-note">No pickups booked. Book one and a rider will come in your chosen 2-hour slot.</p><button class="btn btn-sm mt-s" type="button" data-action="book">Book a pickup</button>';
  }

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  function drawChart() {
    var canvas = $('#ship-chart');
    if (!canvas || currentView !== 'overview') return;
    var wrap = canvas.parentNode;
    var w = wrap.clientWidth, h = 240;
    if (!w) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var days = chartRange;
    var start = startOfDay(Date.now()) - (days - 1) * DAY;
    var counts = [];
    for (var i = 0; i < days; i++) counts.push(0);
    state.shipments.forEach(function (s) {
      var idx = Math.floor((startOfDay(s.bookedAt) - start) / DAY);
      if (idx >= 0 && idx < days) counts[idx]++;
    });
    var total = counts.reduce(function (a, b) { return a + b; }, 0);
    var max = Math.max(4, Math.max.apply(null, counts));
    max = Math.ceil(max / 2) * 2;

    var rtl = document.documentElement.getAttribute('dir') === 'rtl';
    var axisW = 28;
    var padL = rtl ? 6 : axisW, padR = rtl ? axisW : 6, padT = 12, padB = 26;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var cBar = cssVar('--brand-text'), cGrid = cssVar('--border'), cText = cssVar('--muted'), cToday = cssVar('--cta');

    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    for (var g = 0; g <= 4; g++) {
      var y = padT + plotH - plotH * g / 4;
      ctx.strokeStyle = cGrid;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, Math.round(y) + 0.5); ctx.lineTo(padL + plotW, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillStyle = cText;
      ctx.textAlign = rtl ? 'left' : 'right';
      ctx.fillText(String(max * g / 4), rtl ? w - axisW + 8 : axisW - 8, y);
    }
    var slot = plotW / days;
    var bw = Math.max(4, Math.min(28, slot * 0.62));
    var busiest = 0;
    counts.forEach(function (c, i) {
      if (c > counts[busiest]) busiest = i;
      var pos = rtl ? days - 1 - i : i;
      var x = padL + pos * slot + (slot - bw) / 2;
      var bh = plotH * c / max;
      var y = padT + plotH - bh;
      ctx.fillStyle = i === days - 1 ? cToday : cBar;
      if (bh > 0) {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, [4, 4, 0, 0]); else ctx.rect(x, y, bw, bh);
        ctx.fill();
      }
      var every = days <= 14 ? 2 : 5;
      if ((days - 1 - i) % every === 0) {
        ctx.fillStyle = cText;
        ctx.textAlign = 'center';
        ctx.fillText(String(new Date(start + i * DAY).getDate()), x + bw / 2, h - 10);
      }
    });

    var busiestDay = new Date(start + busiest * DAY);
    var summary = total + ' parcels booked in the last ' + days + ' days' + (total ? '. Busiest day: ' + DM.fmtDay(busiestDay) + ' with ' + counts[busiest] : '');
    $('#chart-caption').textContent = 'Last ' + days + ' days · ' + total + ' parcels · today in amber';
    canvas.setAttribute('aria-label', 'Bar chart. ' + summary + '.');
    $('#chart-table').innerHTML = '<caption>Parcels booked per day</caption><tr><th>Date</th><th>Parcels</th></tr>' +
      counts.map(function (c, i) { return '<tr><td>' + fmtShort(start + i * DAY) + '</td><td>' + c + '</td></tr>'; }).join('');
  }

  $$('[data-range]').forEach(function (b) {
    b.addEventListener('click', function () {
      chartRange = +b.getAttribute('data-range');
      $$('[data-range]').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
      drawChart();
    });
  });

  function renderDonut() {
    var groups = [
      ['Delivered', cssVar('--brand-text'), function (s) { return s.status === 'Delivered'; }],
      ['In progress', '#5B8DEF', function (s) { return ['Booked', 'Picked up', 'At hub', 'In transit'].indexOf(s.status) > -1; }],
      ['Out for delivery', '#FFC233', function (s) { return s.status === 'Out for delivery'; }],
      ['Needs attention', '#E5484D', function (s) { return s.status === 'Attempted' || s.status === 'Returned'; }]
    ];
    var total = state.shipments.length || 1;
    var acc = 0;
    var stops = [];
    var legend = groups.map(function (g) {
      var n = state.shipments.filter(g[2]).length;
      var from = acc / total * 360, to = (acc + n) / total * 360;
      acc += n;
      if (n) stops.push(g[1] + ' ' + from + 'deg ' + to + 'deg');
      return '<li><i style="background:' + g[1] + '"></i><span>' + g[0] + '</span><b>' + n + '</b></li>';
    });
    var donut = $('#donut');
    donut.style.background = stops.length ? 'conic-gradient(' + stops.join(', ') + ')' : '';
    $('#donut-total').innerHTML = '<b>' + state.shipments.length + '</b>shipments';
    $('#legend').innerHTML = legend.join('');
    donut.setAttribute('aria-label', 'Status mix: ' + groups.map(function (g) { return g[0] + ' ' + state.shipments.filter(g[2]).length; }).join(', '));
  }

  function renderMiniLive() {
    var list = state.shipments.filter(isMoving).sort(function (a, b) { return b.progress - a.progress; }).slice(0, 4);
    $('#mini-live').innerHTML = list.length ? list.map(function (s) {
      return '<li><a href="#tracking" data-select="' + s.id + '"><span class="row"><span class="mono">' + s.id + '</span>' + pill(s.status) + '</span>' +
        '<span class="row"><span>' + esc(s.city) + '</span><span class="muted" data-mini-pct="' + s.id + '">' + Math.floor(s.progress) + '%</span></span>' +
        '<span class="bar-track"><span data-mini-bar="' + s.id + '" style="width:' + s.progress + '%"></span></span></a></li>';
    }).join('') : '<li class="empty-note">Nothing on the move right now.</li>';
  }

  document.addEventListener('click', function (e) {
    var sel = e.target.closest('[data-select]');
    if (sel) selectedId = sel.getAttribute('data-select');
  });

  /* ======================================================================
     5. Pickups
     ====================================================================== */
  var pickupFilter = 'all';
  var editingPickup = null;

  function renderPickups() {
    var q = $('#pickup-search').value.trim().toLowerCase();
    var rows = state.pickups.filter(function (p) {
      return (pickupFilter === 'all' || p.status === pickupFilter) &&
        (!q || (p.id + ' ' + p.address + ' ' + p.pin).toLowerCase().indexOf(q) > -1);
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    $('#pickup-rows').innerHTML = rows.length ? rows.map(function (p) {
      var actions = '';
      if (p.status === 'Scheduled') {
        actions += '<button class="act" type="button" data-edit-pickup="' + p.id + '" data-key="edit-' + p.id + '">Edit</button>';
        actions += '<button class="act act--danger" type="button" data-cancel-pickup="' + p.id + '" data-key="cancel-' + p.id + '">Cancel</button>';
      }
      actions += '<button class="act act--danger" type="button" data-delete-pickup="' + p.id + '" data-key="del-' + p.id + '" aria-label="Delete pickup ' + p.id + '">Delete</button>';
      return '<tr><td data-label="Pickup"><strong class="mono">' + p.id + '</strong></td>' +
        '<td data-label="Date & slot">' + DM.fmtDay(parseISO(p.date)) + '<span class="sub">' + esc(p.slot) + '</span></td>' +
        '<td data-label="Address">' + esc(p.address) + '<span class="sub">' + esc(p.pin) + (p.notes ? ' · ' + esc(p.notes) : '') + '</span></td>' +
        '<td data-label="Parcels">' + p.parcels + '<span class="sub">' + p.weight + ' kg</span></td>' +
        '<td data-label="Service">' + serviceName(p.service) + '</td>' +
        '<td data-label="Status">' + pill(p.status) + '</td>' +
        '<td class="actions-cell" data-label="Actions"><div class="row-actions">' + actions + '</div></td></tr>';
    }).join('') : '<tr class="empty-row"><td colspan="7">No pickups match. Try another filter or book a new pickup.</td></tr>';
  }

  $('#pickup-filter').addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]');
    if (!b) return;
    pickupFilter = b.getAttribute('data-filter');
    $$('[data-filter]', this).forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    renderPickups();
  });
  $('#pickup-search').addEventListener('input', renderPickups);

  function findPickup(id) { return state.pickups.filter(function (p) { return p.id === id; })[0]; }

  function openPickupModal(p) {
    var form = $('#pickup-form');
    form.reset();
    clearErrors(form);
    editingPickup = p ? p.id : null;
    var now = new Date();
    var defaultDate = now.getHours() < 16 && now.getDay() !== 0 ? now : nextWorkingDay(now, 1);
    $('#pk-date').min = isoDate(now);
    $('#pk-date').max = isoDate(new Date(Date.now() + 30 * DAY));
    $('#pk-date').value = p ? p.date : isoDate(defaultDate);
    $('#pk-slot').value = p ? p.slot : '';
    $('#pk-address').value = p ? p.address : state.profile.address;
    $('#pk-pin').value = p ? p.pin : state.profile.pin;
    $('#pk-service').value = p ? p.service : 'same';
    $('#pk-parcels').value = p ? p.parcels : 1;
    $('#pk-weight').value = p ? p.weight : '';
    $('#pk-notes').value = p ? p.notes : '';
    $('#pickup-modal-title').textContent = p ? 'Reschedule pickup ' + p.id : 'Book a pickup';
    $('#pickup-submit').textContent = p ? 'Save changes' : 'Confirm pickup';
    openModal($('#pickup-modal'));
  }

  function slotStartHour(slot) {
    var m = slot.match(/^(\d{1,2}):/);
    if (!m) return 0;
    var h = +m[1];
    return h < 8 ? h + 12 : h; // "1:00 – 3:00 PM" style slots are afternoon
  }

  $('#pickup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this;
    var date = $('#pk-date'), slot = $('#pk-slot'), addr = $('#pk-address'), pin = $('#pk-pin');
    var parcels = $('#pk-parcels'), weight = $('#pk-weight'), service = $('#pk-service');
    var today = isoDate(new Date());
    var dOk = date.value && date.value >= today && date.value <= date.max;
    var ok = setErr(date, !date.value ? 'Choose a pickup date.' : !dOk ? 'Pick a date between today and the next 30 days.' : parseISO(date.value).getDay() === 0 ? 'We don\'t collect on Sundays. Choose Monday to Saturday.' : '');
    var late = date.value === today && slot.value && slotStartHour(slot.value) <= new Date().getHours();
    ok = setErr(slot, !slot.value ? 'Choose a 2-hour slot.' : late ? 'That slot has already started. Pick a later one or another day.' : '') && ok;
    ok = setErr(addr, addr.value.trim().length < 8 ? 'Enter the full pickup address.' : '') && ok;
    var z = DM.zoneFor(pin.value.trim());
    ok = setErr(pin, !z ? 'Enter a valid 6-digit PIN.' : z.code !== 'L' ? 'We collect from Pune & PCMC only.' : '') && ok;
    var n = +parcels.value;
    ok = setErr(parcels, !(n >= 1 && n <= 200 && Math.floor(n) === n) ? 'Enter between 1 and 200 parcels.' : '') && ok;
    var w = parseFloat(weight.value);
    ok = setErr(weight, !(w > 0) ? 'Enter the approximate total weight.' : (service.value === 'dash' && w > 8) ? 'Dash 90 carries up to 8 kg. Choose Same-Day instead.' : w > 500 ? 'Over 500 kg needs a dedicated vehicle. Call us.' : '') && ok;
    if (!ok) { focusFirstError(form); return; }

    var data = { date: date.value, slot: slot.value, address: addr.value.trim(), pin: pin.value.trim(), parcels: n, weight: w, service: service.value, notes: $('#pk-notes').value.trim() };
    if (editingPickup) {
      var p = findPickup(editingPickup);
      Object.keys(data).forEach(function (k) { p[k] = data[k]; });
      toast('Pickup <b>' + p.id + '</b> updated to ' + DM.fmtDay(parseISO(p.date)) + ', ' + esc(p.slot) + '.');
      notify('Pickup ' + p.id + ' was rescheduled to ' + DM.fmtDay(parseISO(p.date)) + ', ' + p.slot + '.', 'pickups');
    } else {
      var max = state.pickups.reduce(function (m, x) { return Math.max(m, +x.id.slice(3)); }, 3100);
      data.id = 'PU-' + (max + 1);
      data.status = 'Scheduled';
      state.pickups.push(data);
      toast('Pickup <b>' + data.id + '</b> booked for ' + DM.fmtDay(parseISO(data.date)) + ', ' + esc(data.slot) + '.');
      notify('Pickup ' + data.id + ' is confirmed for ' + DM.fmtDay(parseISO(data.date)) + ', ' + data.slot + '.', 'pickups');
    }
    save();
    closeModal($('#pickup-modal'));
    renderAll();
  });

  document.addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit-pickup]');
    if (ed) openPickupModal(findPickup(ed.getAttribute('data-edit-pickup')));
    var ca = e.target.closest('[data-cancel-pickup]');
    if (ca) {
      var p = findPickup(ca.getAttribute('data-cancel-pickup'));
      confirmAction('Cancel pickup ' + p.id + '?', 'The rider slot for ' + DM.fmtDay(parseISO(p.date)) + ', ' + p.slot + ' will be released. Cancelling before a rider is assigned is free.', 'Cancel pickup', function () {
        p.status = 'Cancelled';
        p.notes = 'Cancelled by you';
        save(); renderAll();
        toast('Pickup <b>' + p.id + '</b> cancelled.');
      });
    }
    var de = e.target.closest('[data-delete-pickup]');
    if (de) {
      var id = de.getAttribute('data-delete-pickup');
      confirmAction('Delete pickup ' + id + '?', 'This removes the record from your list. It cannot be undone.', 'Delete', function () {
        state.pickups = state.pickups.filter(function (x) { return x.id !== id; });
        save(); renderAll();
        toast('Pickup <b>' + id + '</b> deleted.');
      });
    }
  });

  /* ======================================================================
     6. Live tracking
     ====================================================================== */
  var selectedId = null;

  function findShip(id) { return state.shipments.filter(function (s) { return s.id === id; })[0]; }

  function trackCandidates() {
    var q = $('#track-search').value.trim().toLowerCase();
    var list = state.shipments.filter(isActive);
    if (q) list = state.shipments.filter(function (s) { return (s.id + ' ' + s.city + ' ' + s.name).toLowerCase().indexOf(q) > -1; });
    // Moving parcels first (furthest along at the top), then stalled ones
    return list.sort(function (a, b) { return (isMoving(b) - isMoving(a)) || (b.progress - a.progress); });
  }

  function renderTracking() {
    var list = trackCandidates();
    var searching = !!$('#track-search').value.trim();
    var inList = list.some(function (s) { return s.id === selectedId; });
    if (!selectedId || !findShip(selectedId) || (searching && !inList)) selectedId = list[0] ? list[0].id : null;
    $('#track-list').innerHTML = list.length ? list.map(function (s) {
      return '<li><button type="button" data-track="' + s.id + '" data-key="trk-' + s.id + '" aria-pressed="' + (s.id === selectedId) + '">' +
        '<span class="row"><span class="mono">' + s.id + '</span><span data-list-status="' + s.id + '">' + pill(s.status) + '</span></span>' +
        '<span>' + esc(s.name) + ' · ' + esc(s.city) + '</span>' +
        '<span class="bar-track"><span data-list-bar="' + s.id + '" style="width:' + s.progress + '%"></span></span></button></li>';
    }).join('') : '<li class="empty-note">No parcels match. Clear the search to see everything on the move.</li>';
    renderTrackDetail();
  }

  function renderTrackDetail() {
    var box = $('#track-detail');
    var s = selectedId && findShip(selectedId);
    if (!s) {
      box.innerHTML = '<p class="empty-note">Nothing is on the move right now. New shipments appear here as soon as they are booked.</p><div class="detail-actions"><button class="btn btn-sm" type="button" data-action="new-shipment">+ New shipment</button></div>';
      return;
    }
    var last = s.log[s.log.length - 1];
    var timeline = s.log.slice().reverse().map(function (l, i) {
      return '<li class="' + (i === 0 ? 'is-latest' : '') + '"><strong>' + esc(l.s) + '</strong><span class="t-meta">' + DM.fmtWhen(l.t) + ' · ' + esc(l.at) + '</span></li>';
    }).join('');
    var extra = s.status === 'Attempted'
      ? '<button class="btn btn-sm" type="button" data-reattempt="' + s.id + '">Reattempt tomorrow</button>'
      : '';
    box.innerHTML =
      '<div class="detail-head"><div><span class="mono muted">' + s.id + ' · ' + serviceName(s.service) + '</span><h2 data-detail-status>' + esc(s.status) + '</h2></div>' + pill(s.status) + '</div>' +
      '<div class="route" aria-hidden="true"><div class="route-line"></div><div class="route-fill" data-detail-fill style="width:' + s.progress + '%"></div>' +
      '<span class="route-pin route-pin--from"></span><span class="route-pin route-pin--to"></span>' +
      '<span class="route-van" data-detail-van style="inset-inline-start:' + s.progress + '%">' + (s.service === 'air' ? '✈' : '🛵') + '</span></div>' +
      '<div class="route-labels"><div><strong>Pune ' + esc(state.profile.pin) + '</strong>' + esc(state.profile.area) + '</div><div><strong>' + esc(s.city) + '</strong>' + esc(s.name) + ', ' + s.pin + '</div></div>' +
      '<div class="detail-facts">' +
      '<div><span>Progress</span><strong data-detail-pct>' + Math.floor(s.progress) + '%</strong></div>' +
      '<div><span>' + (s.status === 'Delivered' ? 'Delivered' : 'Expected') + '</span><strong data-detail-eta>' + etaText(s) + '</strong></div>' +
      '<div><span>Last scan</span><strong>' + esc(last.at) + '</strong></div></div>' +
      '<h3>Scan history</h3><ol class="timeline">' + timeline + '</ol>' +
      '<div class="detail-actions">' + extra +
      '<button class="act" type="button" data-copy-link="' + s.id + '">Copy tracking link</button>' +
      '<a class="act" href="contact.html?topic=tracking&amp;id=' + s.id + '">Report a problem</a></div>';
  }

  // Lightweight in-place update used by the live ticker (keeps focus and scroll)
  function softUpdateTracking() {
    state.shipments.filter(isMoving).forEach(function (s) {
      var bar = $('[data-list-bar="' + s.id + '"]');
      if (bar) bar.style.width = s.progress + '%';
      var mb = $('[data-mini-bar="' + s.id + '"]');
      if (mb) mb.style.width = s.progress + '%';
      var mp = $('[data-mini-pct="' + s.id + '"]');
      if (mp) mp.textContent = Math.floor(s.progress) + '%';
    });
    var s = selectedId && findShip(selectedId);
    if (s && currentView === 'tracking') {
      var fill = $('[data-detail-fill]'), van = $('[data-detail-van]'), pct = $('[data-detail-pct]'), eta = $('[data-detail-eta]');
      if (fill) fill.style.width = s.progress + '%';
      if (van) van.style.insetInlineStart = s.progress + '%';
      if (pct) pct.textContent = Math.floor(s.progress) + '%';
      if (eta) eta.textContent = etaText(s);
    }
  }

  $('#track-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-track]');
    if (!b) return;
    selectedId = b.getAttribute('data-track');
    $$('[data-track]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    renderTrackDetail();
  });
  $('#track-search').addEventListener('input', renderTracking);

  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-copy-link]');
    if (c) {
      var id = c.getAttribute('data-copy-link');
      var url = new URL('tracking.html?id=' + id, window.location.href).href;
      var done = function () { toast('Tracking link for <b>' + id + '</b> copied.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { toast('Copy this link: ' + esc(url)); });
      else toast('Copy this link: ' + esc(url));
    }
    var r = e.target.closest('[data-reattempt]');
    if (r) {
      var s = findShip(r.getAttribute('data-reattempt'));
      s.status = 'In transit';
      s.progress = 70;
      s.log.push({ s: 'Reattempt scheduled', t: Date.now(), at: 'Next delivery window: tomorrow, 10 AM – 1 PM' });
      save(); renderAll();
      toast('Reattempt booked for <b>' + s.id + '</b>. The receiver gets an SMS with the new window.');
    }
  });

  /* ======================================================================
     7. Shipments
     ====================================================================== */
  var shipPage = 1;
  var PAGE_SIZE = 8;
  var editingShip = null;

  function filteredShipments() {
    var q = $('#ship-search').value.trim().toLowerCase();
    var st = $('#ship-status').value, sv = $('#ship-service').value;
    return state.shipments.filter(function (s) {
      return (st === 'all' || s.status === st) && (sv === 'all' || s.service === sv) &&
        (!q || (s.id + ' ' + s.name + ' ' + s.city + ' ' + s.pin).toLowerCase().indexOf(q) > -1);
    }).sort(function (a, b) { return b.bookedAt - a.bookedAt; });
  }

  function renderShipments() {
    var all = filteredShipments();
    var pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    shipPage = Math.min(shipPage, pages);
    var rows = all.slice((shipPage - 1) * PAGE_SIZE, shipPage * PAGE_SIZE);
    $('#ship-count').textContent = state.shipments.length + ' shipments in the last 30 days · ' + all.length + ' shown with current filters.';
    $('#ship-rows').innerHTML = rows.length ? rows.map(function (s) {
      return '<tr><td data-label="DM number"><strong class="mono">' + s.id + '</strong></td>' +
        '<td data-label="Booked">' + fmtShort(s.bookedAt) + '</td>' +
        '<td data-label="Receiver">' + esc(s.name) + '<span class="sub">' + esc(s.city) + ' · ' + s.pin + '</span></td>' +
        '<td data-label="Service">' + serviceName(s.service) + (s.cod ? '<span class="sub">COD ' + money(s.cod).replace('.00', '') + '</span>' : '') + '</td>' +
        '<td data-label="Weight">' + s.weight + ' kg</td>' +
        '<td data-label="Status">' + pill(s.status) + '</td>' +
        '<td data-label="Charge">' + money(s.charge) + '</td>' +
        '<td class="actions-cell" data-label="Actions"><div class="row-actions">' +
        '<a class="act" href="#tracking" data-select="' + s.id + '">Track</a>' +
        '<button class="act" type="button" data-edit-ship="' + s.id + '" data-key="sedit-' + s.id + '">Edit</button>' +
        '<button class="act act--danger" type="button" data-delete-ship="' + s.id + '" data-key="sdel-' + s.id + '" aria-label="Delete shipment ' + s.id + '">Delete</button></div></td></tr>';
    }).join('') : '<tr class="empty-row"><td colspan="8">No shipments match these filters.</td></tr>';
    var from = all.length ? (shipPage - 1) * PAGE_SIZE + 1 : 0;
    $('#ship-pager').innerHTML = '<span>Showing ' + from + '–' + Math.min(shipPage * PAGE_SIZE, all.length) + ' of ' + all.length + '</span>' +
      '<div class="row-actions">' +
      (shipPage > 1 ? '<button class="act" type="button" data-page="' + (shipPage - 1) + '" data-key="pg-prev">← Previous</button>' : '') +
      '<span class="pill pill--muted">Page ' + shipPage + ' of ' + pages + '</span>' +
      (shipPage < pages ? '<button class="act" type="button" data-page="' + (shipPage + 1) + '" data-key="pg-next">Next →</button>' : '') + '</div>';
  }

  ['#ship-search', '#ship-status', '#ship-service'].forEach(function (sel) {
    $(sel).addEventListener('input', function () { shipPage = 1; renderShipments(); });
  });
  $('#ship-pager').addEventListener('click', function (e) {
    var b = e.target.closest('[data-page]');
    if (!b) return;
    shipPage = +b.getAttribute('data-page');
    renderShipments();
    var again = $('#ship-pager [data-page]');
    if (again) again.focus();
  });

  function fillServiceOptions(pin, current) {
    var sel = $('#sh-service');
    var zone = DM.zoneFor(pin);
    var list = zone ? DM.servicesFor(zone) : [];
    sel.innerHTML = list.length ? list.map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === current ? ' selected' : '') + '>' + s.name + ' (up to ' + s.max + ' kg)</option>';
    }).join('') : '<option value="">Enter a valid PIN first</option>';
  }

  function updateQuote() {
    var pin = $('#sh-pin').value.trim(), svc = $('#sh-service').value, w = parseFloat($('#sh-weight').value), cod = parseFloat($('#sh-cod').value) || 0;
    var q = (pin && svc && w > 0) ? DM.quote({ pin: pin, service: svc, weight: w, cod: cod > 0, codAmount: cod }) : null;
    $('#sh-quote').textContent = q ? (q.overweight ? q.service.name + ' carries up to ' + q.service.max + ' kg.' : 'Estimated charge: ' + money(q.total) + ' incl. GST · ' + q.zone.name + ' zone · ' + DM.etaFor(q)) : '';
  }

  function openShipModal(s) {
    var form = $('#ship-form');
    form.reset();
    clearErrors(form);
    editingShip = s ? s.id : null;
    $('#sh-name').value = s ? s.name : '';
    $('#sh-phone').value = s ? s.phone : '';
    $('#sh-city').value = s ? s.city : '';
    $('#sh-pin').value = s ? s.pin : '';
    $('#sh-weight').value = s ? s.weight : '';
    $('#sh-cod').value = s && s.cod ? s.cod : '';
    fillServiceOptions(s ? s.pin : '', s ? s.service : '');
    $('#ship-modal-title').textContent = s ? 'Edit shipment ' + s.id : 'New shipment';
    $('#ship-submit').textContent = s ? 'Save changes' : 'Create shipment';
    updateQuote();
    openModal($('#ship-modal'));
  }

  $('#sh-pin').addEventListener('input', function () {
    var v = this.value.trim();
    if (v.length === 6 || !v) fillServiceOptions(v, $('#sh-service').value);
    updateQuote();
  });
  ['#sh-service', '#sh-weight', '#sh-cod'].forEach(function (sel) { $(sel).addEventListener('input', updateQuote); });

  $('#ship-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this;
    var name = $('#sh-name'), phone = $('#sh-phone'), city = $('#sh-city'), pin = $('#sh-pin'), svc = $('#sh-service'), weight = $('#sh-weight'), cod = $('#sh-cod');
    var ok = setErr(name, name.value.trim().length < 2 ? 'Enter the receiver\'s name.' : '');
    var digits = phone.value.replace(/[\s-]/g, '').replace(/^\+?91/, '');
    ok = setErr(phone, !/^[6-9]\d{9}$/.test(digits) ? 'Enter a 10-digit mobile number.' : '') && ok;
    ok = setErr(city, city.value.trim().length < 2 ? 'Enter the area and city.' : '') && ok;
    var zone = DM.zoneFor(pin.value.trim());
    ok = setErr(pin, !zone ? 'Enter a valid 6-digit PIN.' : '') && ok;
    ok = setErr(svc, !svc.value ? 'Choose a service.' : '') && ok;
    var w = parseFloat(weight.value);
    var maxW = (DM.SERVICES[svc.value] || {}).max || 50;
    ok = setErr(weight, !(w > 0) ? 'Enter the parcel weight.' : w > maxW ? 'This service carries up to ' + maxW + ' kg.' : '') && ok;
    var c = cod.value === '' ? 0 : parseFloat(cod.value);
    ok = setErr(cod, (c < 0 || c > 50000 || isNaN(c)) ? 'COD must be between ₹0 and ₹50,000.' : '') && ok;
    if (!ok) { focusFirstError(form); return; }

    var data = { name: name.value.trim(), phone: digits, city: city.value.trim(), pin: pin.value.trim(), service: svc.value, weight: w, cod: c };
    if (editingShip) {
      var s = findShip(editingShip);
      Object.keys(data).forEach(function (k) { s[k] = data[k]; });
      s.charge = chargeFor(s);
      toast('Shipment <b>' + s.id + '</b> updated.');
    } else {
      var max = state.shipments.reduce(function (m, x) { return Math.max(m, +x.id.slice(2)); }, 48229180);
      var ns = { id: 'DM' + (max + 7 + Math.floor(Math.random() * 30)), bookedAt: Date.now(), progress: 0, status: 'Booked' };
      Object.keys(data).forEach(function (k) { ns[k] = data[k]; });
      ns.charge = chargeFor(ns);
      ns.log = [{ s: 'Booked', t: Date.now(), at: 'Customer dashboard' }];
      state.shipments.unshift(ns);
      selectedId = ns.id;
      notify(ns.id + ' booked to ' + ns.name + ', ' + ns.city + '. Add it to your next pickup.', 'tracking');
      toast('Shipment <b>' + ns.id + '</b> created · ' + money(ns.charge) + '. Watch it on Live Tracking.');
    }
    save();
    closeModal($('#ship-modal'));
    renderAll();
  });

  document.addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit-ship]');
    if (ed) openShipModal(findShip(ed.getAttribute('data-edit-ship')));
    var de = e.target.closest('[data-delete-ship]');
    if (de) {
      var id = de.getAttribute('data-delete-ship');
      confirmAction('Delete shipment ' + id + '?', 'The record and its scan history will be removed from your dashboard. This cannot be undone.', 'Delete', function () {
        state.shipments = state.shipments.filter(function (x) { return x.id !== id; });
        if (selectedId === id) selectedId = null;
        save(); renderAll();
        toast('Shipment <b>' + id + '</b> deleted.');
      });
    }
  });

  function exportCSV() {
    var rows = filteredShipments();
    var head = ['DM number', 'Booked on', 'Receiver', 'Mobile', 'Area / city', 'PIN', 'Service', 'Weight (kg)', 'COD (INR)', 'Charge (INR)', 'Status'];
    var csv = [head].concat(rows.map(function (s) {
      return [s.id, fmtDate(s.bookedAt), s.name, s.phone, s.city, s.pin, serviceName(s.service), s.weight, s.cod || 0, s.charge.toFixed(2), s.status];
    })).map(function (r) {
      return r.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',');
    }).join('\n');
    download('dashmile-shipments-' + isoDate(new Date()) + '.csv', '﻿' + csv, 'text/csv;charset=utf-8');
    toast(rows.length + ' shipments exported to CSV.');
  }

  /* ======================================================================
     8. Invoices
     ====================================================================== */
  var invoiceFilter = 'all';

  function renderInvoices() {
    var due = state.invoices.filter(function (i) { return i.status === 'Due'; });
    var dueSum = due.reduce(function (t, i) { return t + i.amount; }, 0);
    var paid90 = state.invoices.filter(function (i) { return i.status === 'Paid' && i.paidAt > Date.now() - 90 * DAY; }).reduce(function (t, i) { return t + i.amount; }, 0);
    var d = new Date();
    var next = d.getDate() < 16 ? new Date(d.getFullYear(), d.getMonth(), 16) : new Date(d.getFullYear(), d.getMonth() + 1, 1);
    $('#invoice-kpis').innerHTML =
      kpi('🧾', money(dueSum), 'Outstanding', due.length ? 'Due by ' + fmtShort(due[0].due) : 'Nothing to pay', true) +
      kpi('✅', money(paid90), 'Paid in the last 90 days', '') +
      kpi('📅', DM.fmtDay(next), 'Next invoice date', 'Covers the current half-month');
    var rows = state.invoices.filter(function (i) { return invoiceFilter === 'all' || i.status === invoiceFilter; });
    $('#invoice-rows').innerHTML = rows.length ? rows.map(function (i) {
      return '<tr><td data-label="Invoice"><strong class="mono">' + i.id + '</strong></td>' +
        '<td data-label="Billing period">' + fmtShort(i.from) + ' – ' + fmtShort(i.to) + '</td>' +
        '<td data-label="Parcels">' + i.parcels + '</td>' +
        '<td data-label="Amount"><strong>' + money(i.amount) + '</strong><span class="sub">incl. ' + money(i.gst) + ' GST</span></td>' +
        '<td data-label="Due date">' + fmtDate(i.due) + '</td>' +
        '<td data-label="Status">' + pill(i.status) + (i.paidAt ? '<span class="sub">Paid ' + fmtShort(i.paidAt) + '</span>' : '') + '</td>' +
        '<td class="actions-cell" data-label="Actions"><div class="row-actions">' +
        '<button class="act" type="button" data-download="' + i.id + '" data-key="dl-' + i.id + '" aria-label="Download invoice ' + i.id + '">Download</button>' +
        (i.status === 'Due' ? '<button class="act" type="button" data-pay="' + i.id + '" data-key="pay-' + i.id + '">Pay now</button>' : '') +
        '</div></td></tr>';
    }).join('') : '<tr class="empty-row"><td colspan="7">No invoices in this view.</td></tr>';
  }

  $('#invoice-filter').addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]');
    if (!b) return;
    invoiceFilter = b.getAttribute('data-filter');
    $$('[data-filter]', this).forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    renderInvoices();
  });

  function findInvoice(id) { return state.invoices.filter(function (i) { return i.id === id; })[0]; }

  function invoiceHTML(inv) {
    var p = state.profile;
    var lines = inv.lines.map(function (l) {
      return '<tr><td>' + esc(l[0]) + '</td><td class="r">' + l[1] + '</td><td class="r">' + money(l[2]) + '</td><td class="r">' + money(l[1] * l[2]) + '</td></tr>';
    }).join('');
    var half = Math.round(inv.gst * 50) / 100;
    return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' + inv.id + ' | Dashmile Couriers</title>' +
      '<style>body{font-family:Inter,Segoe UI,Arial,sans-serif;color:#13201D;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.5}' +
      'h1{font-size:26px;margin:0}header{display:flex;justify-content:space-between;gap:24px;border-bottom:3px solid #0A6B5C;padding-bottom:16px}' +
      '.brand{font-weight:700;font-size:20px;color:#0A6B5C}.muted{color:#4B5B57;font-size:14px}table{width:100%;border-collapse:collapse;margin:24px 0}' +
      'th,td{padding:10px;border-bottom:1px solid #DDE4E2;text-align:left;font-size:14px}th{background:#F3F5F4}.r{text-align:right}' +
      '.tot td{font-weight:700;font-size:16px;border-top:2px solid #13201D}.grid{display:flex;justify-content:space-between;gap:24px;margin-top:20px}' +
      '.stamp{display:inline-block;padding:4px 12px;border-radius:999px;font-weight:700;font-size:13px;background:' + (inv.status === 'Paid' ? '#E5F5EC;color:#146C43' : '#FFF4D6;color:#8A5A00') + '}</style></head><body>' +
      '<header><div><div class="brand">Dashmile Couriers Pvt. Ltd.</div><div class="muted">Plot 14, Phase 2, Hadapsar Industrial Estate, Pune 411013<br>GSTIN 27AAJCD4821K1ZQ · billing@dashmile.in · +91 20 4859 2210</div></div>' +
      '<div style="text-align:right"><h1>Tax Invoice</h1><div class="muted">' + inv.id + '<br>Issued ' + fmtDate(inv.to + DAY) + '</div><p><span class="stamp">' + inv.status + '</span></p></div></header>' +
      '<div class="grid"><div><strong>Billed to</strong><div class="muted">' + esc(p.name) + (p.company ? '<br>' + esc(p.company) : '') + '<br>' + esc(p.address) + ', Pune ' + esc(p.pin) + '<br>GSTIN: ' + (p.gstin ? esc(p.gstin) : 'not provided') + '</div></div>' +
      '<div style="text-align:right"><strong>Billing period</strong><div class="muted">' + fmtDate(inv.from) + ' – ' + fmtDate(inv.to) + '<br>Due by ' + fmtDate(inv.due) + '</div></div></div>' +
      '<table><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Avg. rate</th><th class="r">Amount</th></tr></thead><tbody>' + lines +
      '<tr><td colspan="3" class="r">Taxable value</td><td class="r">' + money(inv.subtotal) + '</td></tr>' +
      '<tr><td colspan="3" class="r">CGST @ 9%</td><td class="r">' + money(half) + '</td></tr>' +
      '<tr><td colspan="3" class="r">SGST @ 9%</td><td class="r">' + money(inv.gst - half) + '</td></tr>' +
      '<tr class="tot"><td colspan="3" class="r">Total</td><td class="r">' + money(inv.amount) + '</td></tr></tbody></table>' +
      '<p class="muted">SAC 996812 (courier services). Pay by UPI to dashmile@hdfcbank or by NEFT, quoting the invoice number. Questions? billing@dashmile.in</p>' +
      '</body></html>';
  }

  document.addEventListener('click', function (e) {
    var dl = e.target.closest('[data-download]');
    if (dl) {
      var inv = findInvoice(dl.getAttribute('data-download'));
      download(inv.id + '.html', invoiceHTML(inv), 'text/html;charset=utf-8');
      toast('Invoice <b>' + inv.id + '</b> downloaded. Open it in your browser to print or save as PDF.');
    }
    var pay = e.target.closest('[data-pay]');
    if (pay) {
      var iv = findInvoice(pay.getAttribute('data-pay'));
      confirmAction('Pay ' + money(iv.amount) + '?', 'Mark invoice ' + iv.id + ' as paid. In the live portal this opens UPI, card or net banking.', 'Pay ' + money(iv.amount), function () {
        iv.status = 'Paid';
        iv.paidAt = Date.now();
        notify('Payment of ' + money(iv.amount) + ' received for ' + iv.id + '. Thank you.', 'invoices');
        save(); renderAll();
        toast('Payment received for <b>' + iv.id + '</b>.');
      });
    }
  });

  /* ======================================================================
     9. Settings
     ====================================================================== */
  function renderSettings() {
    var p = state.profile;
    $('#pf-name').value = p.name;
    $('#pf-company').value = p.company;
    $('#pf-email').value = p.email;
    $('#pf-phone').value = p.phone;
    $('#pf-address').value = p.address;
    $('#pf-pin').value = p.pin;
    $('#pf-gstin').value = p.gstin;
    var prefs = $('#prefs-form');
    ['whatsapp', 'sms', 'email'].forEach(function (k) { $('[name="' + k + '"]', prefs).checked = !!p.notify[k]; });
    syncPrefSelects();
  }
  function syncPrefSelects() {
    $('#pref-theme').value = document.documentElement.getAttribute('data-theme');
    $('#pref-dir').value = document.documentElement.getAttribute('dir');
  }

  $('#profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = this;
    var name = $('#pf-name'), email = $('#pf-email'), phone = $('#pf-phone'), addr = $('#pf-address'), pin = $('#pf-pin'), gst = $('#pf-gstin');
    var ok = setErr(name, name.value.trim().length < 2 ? 'Enter your full name.' : '');
    ok = setErr(email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? 'Enter a valid email address.' : '') && ok;
    var digits = phone.value.replace(/[\s-]/g, '').replace(/^\+?91/, '');
    ok = setErr(phone, !/^[6-9]\d{9}$/.test(digits) ? 'Enter a 10-digit mobile number.' : '') && ok;
    ok = setErr(addr, addr.value.trim().length < 8 ? 'Enter your full pickup address.' : '') && ok;
    var z = DM.zoneFor(pin.value.trim());
    ok = setErr(pin, !z || z.code !== 'L' ? 'Use a Pune or PCMC PIN code.' : '') && ok;
    var g = gst.value.trim().toUpperCase();
    ok = setErr(gst, g && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(g) ? 'GSTIN should be 15 characters, like 27ABCDE1234F1Z5.' : '') && ok;
    if (!ok) { focusFirstError(f); return; }
    var p = state.profile;
    p.name = name.value.trim();
    p.company = $('#pf-company').value.trim();
    p.email = email.value.trim().toLowerCase();
    p.phone = phone.value.trim();
    p.address = addr.value.trim();
    p.pin = pin.value.trim();
    p.gstin = g;
    save();
    try { // keep the session label in sync
      var key = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage;
      var sess = JSON.parse(key.getItem(SESSION_KEY) || '{}');
      sess.name = p.name; sess.email = p.email; sess.company = p.company;
      key.setItem(SESSION_KEY, JSON.stringify(sess));
    } catch (err) { /* ignore */ }
    renderHeader();
    toast('Profile saved.');
  });

  $('#prefs-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = this;
    ['whatsapp', 'sms', 'email'].forEach(function (k) { state.profile.notify[k] = $('[name="' + k + '"]', f).checked; });
    save();
    DM.setTheme($('#pref-theme').value);
    DM.setDir($('#pref-dir').value);
    toast('Preferences saved.');
  });

  $('#password-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = this;
    var cur = $('#pw-current'), nw = $('#pw-new'), cf = $('#pw-confirm');
    var users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (err) { users = []; }
    var me = users.filter(function (u) { return u.email === state.profile.email || u.email === session.email; })[0];
    var ok = setErr(cur, cur.value.length < 8 ? 'Enter your current password.' : (me && me.pass !== hash(cur.value)) ? 'That isn\'t your current password.' : '');
    ok = setErr(nw, nw.value.length < 8 ? 'Use at least 8 characters.' : (!/[A-Za-z]/.test(nw.value) || !/\d/.test(nw.value)) ? 'Include a letter and a number.' : nw.value === cur.value ? 'Choose a password you haven\'t used here.' : '') && ok;
    ok = setErr(cf, cf.value !== nw.value ? 'Passwords don\'t match.' : '') && ok;
    if (!ok) { focusFirstError(f); return; }
    if (me) {
      me.pass = hash(nw.value);
      try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (err) { /* ignore */ }
    }
    f.reset();
    toast('Password updated. Use it next time you sign in.');
  });

  document.addEventListener('dm:prefs', function () {
    syncPrefSelects();
    drawChart();
    renderDonut();
  });

  /* ======================================================================
     10. Live simulation — parcels advance every few seconds
     ====================================================================== */
  function tick() {
    if (document.hidden) return;
    var changed = false;
    state.shipments.forEach(function (s) {
      if (!isMoving(s)) return;
      var before = s.status;
      var step = s.status === 'Out for delivery' ? 0.9 + Math.random() * 1.4 : 0.5 + Math.random() * 1.1;
      s.progress = Math.min(100, Math.round((s.progress + step) * 10) / 10);
      var now = statusFor(s.progress);
      if (now !== before) {
        changed = true;
        s.status = now;
        s.log.push({ s: now, t: Date.now(), at: placeFor(now, s) });
        if (now === 'Out for delivery') notify(s.id + ' is out for delivery to ' + s.name + ', ' + s.city + '.', 'tracking');
        if (now === 'Delivered') {
          s.deliveredAt = Date.now();
          notify(s.id + ' was delivered to ' + s.name + ' in ' + s.city + '.', 'shipments');
          toast('<b>' + s.id + '</b> delivered to ' + esc(s.name) + '.');
        }
      }
    });
    save();
    if (changed) renderAll(); else softUpdateTracking();
  }

  /* ======================================================================
     11. Boot
     ====================================================================== */
  function renderView(name) {
    if (name === 'overview') renderOverview();
    if (name === 'pickups') renderPickups();
    if (name === 'tracking') renderTracking();
    if (name === 'shipments') renderShipments();
    if (name === 'invoices') renderInvoices();
    if (name === 'settings') renderSettings();
  }

  function renderAll() {
    var key = document.activeElement && document.activeElement.getAttribute('data-key');
    renderHeader();
    renderNotifs();
    renderView(currentView);
    if (key) {
      var el = $('[data-key="' + key + '"]');
      if (el) el.focus({ preventScroll: true });
    }
  }

  load();
  // Profile follows the signed-in account the first time it is used
  if (session.email && state.profile.email !== session.email) {
    state.profile.email = session.email;
    state.profile.name = session.name || state.profile.name;
    if (session.company) state.profile.company = session.company;
    save();
  }
  renderHeader();
  renderNotifs();
  showView((window.location.hash || '#overview').slice(1), false);

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(drawChart, 150);
  });
  window.setInterval(tick, 4000);
})();
