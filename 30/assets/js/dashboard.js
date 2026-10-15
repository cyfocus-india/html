/* ==========================================================================
   Beadwell customer dashboard
   - Views: Overview, Bookings, Service Status, History, Loyalty, Profile, Settings
   - Starts with realistic sample data; every change is saved to localStorage
   - Depends on main.js (theme/direction helpers exposed as window.BW)
   ========================================================================== */
(function () {
  'use strict';

  var BW = window.BW;
  if (!BW) return;

  var session = BW.getJSON(BW.KEYS.session, null);
  if (!session) {
    session = { name: 'Jordan Reyes', email: 'jordan@example.com', at: Date.now() };
    BW.setItem(BW.KEYS.session, JSON.stringify(session));
  }
  var DATA_KEY = 'bw-dash-v1:' + session.email;

  /* ---------- Catalog (matches the Pricing page) ---------- */
  var SIZES = ['Sedan / Coupe', 'SUV / Crossover', 'Truck / Van / 3-row'];
  var SIZE_SHORT = ['SED', 'SUV', 'TRK'];
  var SERVICE_ORDER = ['rinse', 'foam', 'hand', 'shield', 'interior', 'full', 'inspect'];
  var SERVICES = {
    rinse:    { id: 'rinse',    name: 'Rinse & Go',            mins: 10,  prices: [15, 21, 25],    type: 'wash' },
    foam:     { id: 'foam',     name: 'Foam Bath',             mins: 25,  prices: [29, 37, 43],    type: 'wash' },
    hand:     { id: 'hand',     name: 'Hand Finish',           mins: 45,  prices: [45, 55, 63],    type: 'wash' },
    shield:   { id: 'shield',   name: 'Bead Shield',           mins: 60,  prices: [69, 83, 93],    type: 'wash' },
    interior: { id: 'interior', name: 'Interior Reset',        mins: 210, prices: [159, 183, 199], type: 'studio' },
    full:     { id: 'full',     name: 'Full Detail',           mins: 390, prices: [289, 332, 361], type: 'studio' },
    inspect:  { id: 'inspect',  name: 'Free paint inspection', mins: 15,  prices: [0, 0, 0],       type: 'studio' }
  };
  var STAGES = {
    rinse:  ['Checked in', 'Foam & rinse', 'Air dry', 'Ready for pickup'],
    foam:   ['Checked in', 'Pre-rinse & foam', 'Hand wash', 'Rinse & dry', 'Final inspection', 'Ready for pickup'],
    hand:   ['Checked in', 'Pre-rinse & foam', 'Hand wash', 'Rinse & dry', 'Interior & glass', 'Final inspection', 'Ready for pickup'],
    shield: ['Checked in', 'Pre-rinse & foam', 'Hand wash', 'Decon & sealant', 'Rinse & dry', 'Interior & glass', 'Final inspection', 'Ready for pickup'],
    studio: ['Checked in', 'Paint & cabin inspection', 'Deep clean', 'Detailing', 'Final inspection', 'Ready for pickup']
  };
  var ADDONS = [
    { id: 'shine',     name: 'Tire shine',                price: 6,  mins: 5 },
    { id: 'underbody', name: 'Underbody flush',           price: 8,  mins: 5 },
    { id: 'glass',     name: 'Rain-repellent windshield', price: 35, mins: 15 },
    { id: 'wax',       name: 'Carnauba hand wax',         price: 49, mins: 25 }
  ];
  var TIERS = [
    { name: 'Clear Coat', min: 0,    bonus: 0,    perk: '1 point per $1 spent' },
    { name: 'Gloss',      min: 500,  bonus: 0.10, perk: '+10% bonus points on every visit' },
    { name: 'Mirror',     min: 1500, bonus: 0.25, perk: '+25% bonus points and a monthly free tire shine' }
  ];
  var REWARDS = [
    { id: 'shine',  pts: 60,  name: 'Tire shine' },
    { id: 'rinse',  pts: 150, name: 'Free Rinse & Go' },
    { id: 'foam',   pts: 290, name: 'Free Foam Bath' },
    { id: 'hand',   pts: 450, name: 'Free Hand Finish' },
    { id: 'studio', pts: 600, name: '$60 off a studio detail' }
  ];
  var VIEWS = {
    overview: ['Overview', 'Your car, bookings and points at a glance'],
    bookings: ['Bookings', 'Book a wash slot and manage upcoming visits'],
    status:   ['Service Status', 'Follow your car through the bay as it happens'],
    history:  ['History', 'Every visit, receipt and rating'],
    loyalty:  ['Loyalty', 'Points, rewards and vouchers'],
    profile:  ['Profile', 'Your details and vehicles'],
    settings: ['Settings', 'Notifications, appearance and demo data']
  };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Small helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function toDate(dateStr, timeStr) {
    var p = dateStr.split('-'), t = (timeStr || '00:00').split(':');
    return new Date(+p[0], +p[1] - 1, +p[2], +t[0], +t[1]);
  }
  function toMin(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function fmtDate(dateStr, withYear) {
    var o = { weekday: 'short', month: 'short', day: 'numeric' };
    if (withYear) o = { month: 'short', day: 'numeric', year: 'numeric' };
    return toDate(dateStr).toLocaleDateString('en-US', o);
  }
  function fmtTime(t) { return toDate('2000-01-01', t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function fmtClock(d) { return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function relTime(iso) {
    var mins = (Date.now() - new Date(iso).getTime()) / 60000;
    if (mins < 1) return 'Just now';
    if (mins < 60) return Math.round(mins) + ' min ago';
    if (mins < 1440) return Math.round(mins / 60) + ' h ago';
    var days = Math.round(mins / 1440);
    return days === 1 ? 'Yesterday' : days + ' days ago';
  }
  function starsHTML(n) {
    if (!n) return '<span class="muted">Not rated</span>';
    var s = '';
    for (var i = 1; i <= 5; i++) s += i <= n ? '&#9733;' : '<span class="off">&#9733;</span>';
    return '<span class="rating" role="img" aria-label="' + n + ' out of 5 stars">' + s + '</span>';
  }
  function initials(name) {
    var parts = String(name).trim().split(/\s+/);
    return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
  function shortName(v) {
    var words = v.name.replace(/^\d{4}\s+/, '').split(' ');
    return words.length > 1 ? words.slice(1).join(' ') : v.name;
  }
  function voucherCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', c = 'BW-';
    for (var i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
    return c;
  }

  /* ---------- Points maths ---------- */
  function tierFor(points) {
    var t = TIERS[0];
    TIERS.forEach(function (x) { if (points >= x.min) t = x; });
    return t;
  }
  function yearPointsUntil(activity, dateStr) {
    var y = toDate(dateStr).getFullYear();
    return activity.filter(function (a) {
      return a.pts > 0 && a.date <= dateStr && toDate(a.date).getFullYear() === y;
    }).reduce(function (s, a) { return s + a.pts; }, 0);
  }
  function earnFor(total, yearPts) { return Math.round(total * (1 + tierFor(yearPts).bonus)); }

  /* ---------- Sample data (dates relative to today) ---------- */
  function seed() {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    function day(offset, studio) {
      var d = addDays(today, offset);
      if (studio && d.getDay() === 0) d = addDays(d, 1); // studio is closed on Sundays
      return isoDate(d);
    }
    var vehicles = [
      { id: 'v1', name: '2021 Subaru Outback', plate: 'BXR-4471', size: 1, color: 'Autumn Green' },
      { id: 'v2', name: '2018 Honda Civic', plate: 'AKT-2093', size: 0, color: 'Lunar Silver' }
    ];
    var pastVisits = [
      [-195, 'rinse', 'v1', 5], [-171, 'foam', 'v2', 4], [-150, 'full', 'v1', 5], [-128, 'hand', 'v1', 5],
      [-110, 'rinse', 'v2', 4], [-94, 'foam', 'v1', 5], [-80, 'shield', 'v1', 5], [-66, 'hand', 'v2', 5],
      [-52, 'foam', 'v1', 4], [-45, 'interior', 'v2', 5], [-33, 'foam', 'v2', 5], [-24, 'hand', 'v1', 4],
      [-11, 'shield', 'v1', 5], [-3, 'foam', 'v2', 5]
    ];
    var times = ['09:20', '11:40', '14:00', '16:20', '10:40'];
    var activity = [{ id: uid('a'), date: day(-200), text: 'Welcome bonus for joining', pts: 50 }];
    var oneOffs = [
      { offset: -60, text: 'Redeemed: Free Foam Bath', pts: -290 },
      { offset: -40, text: '#BeadwellShine photo bonus', pts: 50 },
      { offset: -30, text: 'Redeemed: Free Hand Finish', pts: -450 },
      { offset: -20, text: 'Redeemed: Tire shine', pts: -60 }
    ];
    var history = [];
    pastVisits.forEach(function (v, i) {
      // add any one-off entries that happened before this visit, so tier bonuses build up in order
      oneOffs.filter(function (o) { return !o.done && o.offset < v[0]; }).forEach(function (o) {
        activity.push({ id: uid('a'), date: day(o.offset), text: o.text, pts: o.pts }); o.done = true;
      });
      var car = vehicles.filter(function (x) { return x.id === v[2]; })[0];
      var svc = SERVICES[v[1]];
      var date = day(v[0], svc.type === 'studio');
      var total = svc.prices[car.size];
      var pts = earnFor(total, yearPointsUntil(activity, date));
      history.push({ id: 'h' + (i + 1), date: date, time: svc.type === 'studio' ? '08:30' : times[i % times.length], bay: svc.type === 'studio' ? 'Studio 1' : 'Bay ' + (1 + i % 3), vehicleId: car.id, serviceId: svc.id, addons: [], base: total, total: total, points: pts, rating: v[3], review: '' });
      activity.push({ id: uid('a'), date: date, text: 'Earned: ' + svc.name, pts: pts });
    });
    oneOffs.filter(function (o) { return !o.done; }).forEach(function (o) {
      activity.push({ id: uid('a'), date: day(o.offset), text: o.text, pts: o.pts });
    });

    // A car already in the bay so the live tracker has something to show
    var checkedIn = new Date(now.getTime() - 18 * 60000);
    var slotMin = Math.floor((checkedIn.getHours() * 60 + checkedIn.getMinutes()) / 20) * 20;
    var activeBooking = { id: 'b0', date: isoDate(checkedIn), time: pad(Math.floor(slotMin / 60)) + ':' + pad(slotMin % 60), vehicleId: 'v1', serviceId: 'hand', status: 'In service', notes: 'Please check the rear wiper' };

    return {
      version: 1,
      profile: { name: session.name || 'Beadwell Member', email: session.email, phone: '(303) 555-0148' },
      prefs: { emailReminders: true, smsReady: true, offers: false },
      vehicles: vehicles,
      bookings: [
        activeBooking,
        { id: 'b1', date: day(2), time: '09:20', vehicleId: 'v1', serviceId: 'shield', status: 'Confirmed', notes: 'Dog hair on the rear seats' },
        { id: 'b2', date: day(9, true), time: '08:30', vehicleId: 'v2', serviceId: 'interior', status: 'Pending', notes: 'Coffee spill on the passenger seat' },
        { id: 'b3', date: day(23), time: '16:20', vehicleId: 'v1', serviceId: 'foam', status: 'Confirmed', notes: '' },
        { id: 'b4', date: day(-3), time: '10:40', vehicleId: 'v2', serviceId: 'foam', status: 'Completed', notes: '' },
        { id: 'b5', date: day(-12), time: '13:20', vehicleId: 'v2', serviceId: 'foam', status: 'Cancelled', notes: 'Moved to another day' }
      ],
      active: {
        bookingId: 'b0', vehicleId: 'v1', serviceId: 'hand', bay: 'Bay 2', stage: 2, addons: ['shine'],
        checkedIn: checkedIn.toISOString(),
        stageTimes: [checkedIn.toISOString(), new Date(checkedIn.getTime() + 4 * 60000).toISOString(), new Date(checkedIn.getTime() + 12 * 60000).toISOString()],
        messages: [
          { from: 'bay', text: 'Checked in. Keys are with the front desk.', at: checkedIn.toISOString() },
          { from: 'bay', text: 'Foam is off, starting the hand wash now.', at: new Date(now.getTime() - 6 * 60000).toISOString() }
        ]
      },
      history: history,
      activity: activity,
      vouchers: [
        { code: 'BW-7Q2K', rewardId: 'shine', name: 'Tire shine', date: day(-20), status: 'Active' },
        { code: 'BW-H4LM', rewardId: 'hand', name: 'Free Hand Finish', date: day(-30), status: 'Used' },
        { code: 'BW-3FQ8', rewardId: 'foam', name: 'Free Foam Bath', date: day(-60), status: 'Used' }
      ],
      shares: ['https://www.instagram.com/p/beadwell-outback-shine'],
      notifications: [
        { id: 'n1', text: 'Bay 2: your Outback moved to Hand wash.', at: new Date(now.getTime() - 6 * 60000).toISOString(), read: false },
        { id: 'n2', text: 'Booking confirmed: Bead Shield on ' + fmtDate(day(2)) + ' at 9:20 AM.', at: new Date(now.getTime() - 26 * 3600000).toISOString(), read: false },
        { id: 'n3', text: 'Studio request received. We’ll confirm your Interior Reset within 4 business hours.', at: new Date(now.getTime() - 50 * 3600000).toISOString(), read: true },
        { id: 'n4', text: 'You earned ' + history[history.length - 1].points + ' points for a Foam Bath.', at: new Date(now.getTime() - 72 * 3600000).toISOString(), read: true }
      ]
    };
  }

  /* ---------- State ---------- */
  var state = BW.getJSON(DATA_KEY, null);
  if (!state || state.version !== 1) state = seed();
  var ui = { view: 'overview', chartMode: 'spend', showAllActivity: false };

  function save() { BW.setItem(DATA_KEY, JSON.stringify(state)); }
  function commit() { save(); renderAll(); }

  /* ---------- Derived data ---------- */
  function vehicle(id) {
    return state.vehicles.filter(function (v) { return v.id === id; })[0] || { id: id, name: 'Removed vehicle', plate: '—', size: 0, color: '' };
  }
  function priceFor(serviceId, vehicleId) { return SERVICES[serviceId].prices[vehicle(vehicleId).size]; }
  function addonTotal(ids) {
    return ADDONS.filter(function (a) { return ids.indexOf(a.id) !== -1; }).reduce(function (s, a) { return s + a.price; }, 0);
  }
  function balance() { return state.activity.reduce(function (s, a) { return s + a.pts; }, 0); }
  function yearPoints() { return yearPointsUntil(state.activity, isoDate(new Date())); }
  function currentTier() { return tierFor(yearPoints()); }
  function nextTier() {
    var yp = yearPoints();
    return TIERS.filter(function (t) { return t.min > yp; })[0] || null;
  }
  function byWhen(a, b) { return toDate(a.date, a.time) - toDate(b.date, b.time); }
  function upcoming() {
    var cutoff = new Date(Date.now() - 15 * 60000);
    return state.bookings.filter(function (b) {
      return (b.status === 'Confirmed' || b.status === 'Pending') && toDate(b.date, b.time) >= cutoff;
    }).sort(byWhen);
  }
  function stagesFor(serviceId) { return SERVICES[serviceId].type === 'studio' ? STAGES.studio : STAGES[serviceId]; }
  function etaFor(job) {
    var svc = SERVICES[job.serviceId];
    var extra = ADDONS.filter(function (a) { return job.addons.indexOf(a.id) !== -1; }).reduce(function (s, a) { return s + a.mins; }, 0);
    var planned = new Date(new Date(job.checkedIn).getTime() + (svc.mins + extra) * 60000);
    var remaining = stagesFor(job.serviceId).length - 1 - job.stage;
    var floor = new Date(Date.now() + remaining * 3 * 60000);
    return planned > floor ? planned : floor;
  }

  /* ---------- Toasts, notifications ---------- */
  var toastWrap = $('.toast-wrap');
  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    while (toastWrap.children.length >= 3) toastWrap.firstChild.remove(); // keep at most three on screen
    toastWrap.appendChild(el);
    setTimeout(function () { el.remove(); }, 3800);
  }
  function notify(text) {
    state.notifications.unshift({ id: uid('n'), text: text, at: new Date().toISOString(), read: false });
    state.notifications = state.notifications.slice(0, 30);
  }

  /* ---------- Modal ---------- */
  var modal = $('#modal');
  var modalBody = $('[data-modal-body]');
  var modalTitle = $('#modal-title');
  var modalReturn = null;

  function openModal(title, html, onMount) {
    modalReturn = document.activeElement;
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    if (onMount) onMount(modalBody);
    var first = modalBody.querySelector('input, select, textarea, button');
    (first || modal.querySelector('[data-modal-close]')).focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    modalBody.innerHTML = '';
    document.body.classList.remove('modal-open');
    if (modalReturn && document.body.contains(modalReturn)) modalReturn.focus();
  }
  function confirmBox(opts) {
    openModal(opts.title,
      '<p>' + opts.text + '</p><div class="modal-actions"><button class="link-btn" type="button" data-modal-close>' + esc(opts.cancel || 'Keep it') + '</button>' +
      '<button class="btn" type="button" data-confirm>' + esc(opts.ok) + '</button></div>',
      function (body) {
        body.querySelector('[data-confirm]').addEventListener('click', function () { closeModal(); opts.onOk(); });
      });
  }
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('[data-modal-close]')) closeModal();
  });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.stopPropagation(); closeModal(); }
    BW.trapTab(e, modal);
  });

  /* ---------- Form validation ---------- */
  function fieldError(input, msg) {
    var field = input.closest('.field');
    if (field) {
      field.classList.toggle('invalid', !!msg);
      var m = field.querySelector('.error-msg');
      if (m) m.textContent = msg || '';
    }
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  function validate(form) {
    var ok = true, first = null;
    $all('[required]', form).forEach(function (input) {
      var v = input.value.trim(), msg = '';
      var label = input.getAttribute('data-label') || 'This field';
      if (!v) msg = label + ' is required.';
      else if (input.type === 'email' && !EMAIL_RE.test(v)) msg = 'Enter a valid email, like name@example.com.';
      else if (input.type === 'tel' && v.replace(/\D/g, '').length < 10) msg = 'Enter a 10-digit phone number.';
      else if (input.type === 'url' && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v)) msg = 'Paste the full link, starting with https://';
      else if (input.getAttribute('data-min') && v.length < +input.getAttribute('data-min')) msg = label + ' needs at least ' + input.getAttribute('data-min') + ' characters.';
      if (!fieldError(input, msg)) { ok = false; if (!first) first = input; }
    });
    if (first) first.focus();
    return ok;
  }

  /* ---------- Booking slots ---------- */
  function slotsFor(dateStr, serviceId) {
    if (!dateStr || !SERVICES[serviceId]) return [];
    var d = toDate(dateStr), dow = d.getDay(), list = [];
    if (SERVICES[serviceId].type === 'studio') {
      if (dow === 0) return [];
      list = ['08:00', '08:30', '09:00', '09:30'];           // studio drop-off times
    } else {
      var open = dow === 0 ? 9 * 60 : 7 * 60 + 40;          // bays: Mon–Sat 7:30–7, Sun 9–5
      var close = dow === 0 ? 17 * 60 : 19 * 60;
      for (var m = open; m <= close - 20; m += 20) list.push(pad(Math.floor(m / 60)) + ':' + pad(m % 60));
    }
    var now = new Date();
    if (dateStr === isoDate(now)) {
      var limit = now.getHours() * 60 + now.getMinutes() + 40;
      list = list.filter(function (t) { return toMin(t) >= limit; });
    }
    if (dateStr < isoDate(now)) return [];
    return list;
  }
  function takenTimes(dateStr, exceptId) {
    return state.bookings.filter(function (b) {
      return b.date === dateStr && b.id !== exceptId && b.status !== 'Cancelled' && b.status !== 'Completed';
    }).map(function (b) { return b.time; });
  }
  function firstOpenDate(serviceId) {
    var d = new Date();
    for (var i = 0; i < 8; i++) {
      var s = isoDate(addDays(d, i));
      if (slotsFor(s, serviceId).length) return s;
    }
    return isoDate(d);
  }
  function fillVehicleSelect(select, selected) {
    if (!state.vehicles.length) {
      select.innerHTML = '<option value="">Add a vehicle in Profile first</option>';
      return;
    }
    select.innerHTML = state.vehicles.map(function (v) {
      return '<option value="' + v.id + '">' + esc(v.name) + ' (' + esc(v.plate) + ')</option>';
    }).join('');
    if (selected && state.vehicles.some(function (v) { return v.id === selected; })) select.value = selected;
  }
  function fillServiceSelect(select, vehicleId, selected) {
    var size = vehicle(vehicleId).size;
    function opts(type) {
      return SERVICE_ORDER.filter(function (id) { return SERVICES[id].type === type; }).map(function (id) {
        var s = SERVICES[id];
        var price = s.prices[size] ? (type === 'studio' ? 'from ' : '') + money(s.prices[size]) : 'free';
        return '<option value="' + id + '">' + esc(s.name) + ' — ' + price + '</option>';
      }).join('');
    }
    select.innerHTML = '<optgroup label="Wash bays">' + opts('wash') + '</optgroup><optgroup label="Detail studio">' + opts('studio') + '</optgroup>';
    if (selected) select.value = selected;
  }
  function fillTimeSelect(select, dateStr, serviceId, exceptId, selected) {
    var slots = slotsFor(dateStr, serviceId);
    var taken = takenTimes(dateStr, exceptId);
    if (!slots.length) {
      select.innerHTML = '<option value="">No times left — pick another day</option>';
      return;
    }
    select.innerHTML = slots.map(function (t) {
      var busy = taken.indexOf(t) !== -1;
      return '<option value="' + t + '"' + (busy ? ' disabled' : '') + '>' + fmtTime(t) + (busy ? ' — booked' : '') + '</option>';
    }).join('');
    if (selected && slots.indexOf(selected) !== -1 && taken.indexOf(selected) === -1) select.value = selected;
    else {
      var free = slots.filter(function (t) { return taken.indexOf(t) === -1; })[0];
      if (free) select.value = free;
    }
  }

  /* ==========================================================================
     Rendering
     ========================================================================== */
  function renderShell() {
    var p = state.profile;
    var first = p.name.split(' ')[0];
    $all('[data-first-name]').forEach(function (el) { el.textContent = first; });
    $all('[data-full-name]').forEach(function (el) { el.textContent = p.name; });
    $all('[data-email]').forEach(function (el) { el.textContent = p.email; });
    $all('[data-initials]').forEach(function (el) { el.textContent = initials(p.name); });

    var up = upcoming().length;
    $('[data-upcoming-badge]').textContent = up ? up : '';
    $('[data-live-badge]').hidden = !state.active;

    // Notifications
    var unread = state.notifications.filter(function (n) { return !n.read; }).length;
    var count = $('[data-notif-count]');
    count.hidden = !unread;
    count.textContent = unread;
    $('#notif-btn').setAttribute('aria-label', 'Notifications, ' + unread + ' unread');
    $('[data-notif-list]').innerHTML = state.notifications.length ? state.notifications.map(function (n) {
      return '<li><button type="button" class="notif-item' + (n.read ? '' : ' unread') + '" data-notif="' + n.id + '">' +
        '<span>' + esc(n.text) + '<time datetime="' + n.at + '">' + relTime(n.at) + '</time></span></button></li>';
    }).join('') : '<li class="notif-empty">You’re all caught up.</li>';

    // Next reward card in the sidebar
    var bal = balance();
    var next = REWARDS.filter(function (r) { return r.pts > bal; })[0];
    $('[data-next-reward]').innerHTML = next
      ? '<strong>' + (next.pts - bal) + ' pts to ' + esc(next.name) + '</strong><p>You have ' + bal + ' points.</p>' +
        '<div class="progress" role="progressbar" aria-label="Progress to next reward" aria-valuemin="0" aria-valuemax="' + next.pts + '" aria-valuenow="' + bal + '"><span style="--w:' + Math.min(100, bal / next.pts * 100) + '%"></span></div>'
      : '<strong>Every reward unlocked</strong><p>' + bal + ' points ready to spend.</p><button class="link-btn" type="button" data-view="loyalty">Redeem a reward</button>';
  }

  function renderOverview() {
    var p = state.profile, first = p.name.split(' ')[0];
    var h = new Date().getHours();
    $('[data-greeting]').textContent = (h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening') + ', ' + first;
    var next = upcoming()[0];
    var title, text;
    if (state.active) {
      var a = state.active, v = vehicle(a.vehicleId), stages = stagesFor(a.serviceId);
      var ready = a.stage >= stages.length - 1;
      title = 'Your ' + shortName(v) + (ready ? ' is ready for pickup.' : ' is in ' + a.bay + '.');
      text = SERVICES[a.serviceId].name + ' · ' + (ready ? 'Parked in the exit lane with the keys at the desk.' : 'Now: ' + stages[a.stage] + '. Estimated ready ' + fmtClock(etaFor(a)) + '.');
    } else if (next) {
      title = 'Next up: ' + SERVICES[next.serviceId].name + ' on ' + fmtDate(next.date) + '.';
      text = 'Arrive by ' + fmtTime(next.time) + ' at 2140 Foundry St. We’ll text you when the bay is ready.';
    } else {
      title = 'Nothing booked yet.';
      text = 'Same-day wash slots open every 20 minutes. Pick one and skip the line.';
    }
    $('[data-welcome-title]').textContent = title;
    $('[data-welcome-text]').textContent = text;

    // KPI cards
    var ups = upcoming();
    $('[data-kpi="upcoming"]').textContent = ups.length;
    $('[data-kpi="upcoming-sub"]').textContent = ups.length ? 'Next: ' + fmtDate(ups[0].date) + ', ' + fmtTime(ups[0].time) : 'Nothing booked';
    if (state.active) {
      var st = stagesFor(state.active.serviceId);
      $('[data-kpi="active"]').textContent = st[state.active.stage];
      $('[data-kpi="active-sub"]').textContent = state.active.stage >= st.length - 1 ? 'Waiting at the exit lane' : 'Ready about ' + fmtClock(etaFor(state.active));
    } else {
      $('[data-kpi="active"]').textContent = 'None';
      $('[data-kpi="active-sub"]').textContent = 'Check in from Bookings';
    }
    $('[data-kpi="points"]').textContent = balance().toLocaleString('en-US');
    $('[data-kpi="points-sub"]').textContent = currentTier().name + ' tier';
    var year = new Date().getFullYear();
    var thisYear = state.history.filter(function (r) { return toDate(r.date).getFullYear() === year; });
    $('[data-kpi="spent"]').textContent = money(thisYear.reduce(function (s, r) { return s + r.total; }, 0));
    $('[data-kpi="spent-sub"]').textContent = thisYear.length + ' visit' + (thisYear.length === 1 ? '' : 's') + ' in ' + year;

    // Up next
    $('[data-upnext]').innerHTML = ups.length ? ups.slice(0, 3).map(function (b) {
      var d = toDate(b.date);
      return '<li><span class="date-chip"><b>' + d.getDate() + '</b><small>' + d.toLocaleDateString('en-US', { month: 'short' }) + '</small></span>' +
        '<span class="mini-main"><strong>' + esc(SERVICES[b.serviceId].name) + '</strong><span>' + fmtTime(b.time) + ' · ' + esc(shortName(vehicle(b.vehicleId))) + '</span></span>' +
        '<span class="pill pill--' + b.status.replace(' ', '-') + '">' + b.status + '</span></li>';
    }).join('') : '<li class="mini-empty">No upcoming bookings. <button class="link-btn" type="button" data-go="bookings">Book one</button></li>';

    // Recent visits
    var recent = state.history.slice().sort(function (a, b) { return byWhen(b, a); }).slice(0, 4);
    $('[data-recent]').innerHTML = recent.length ? recent.map(function (r) {
      return '<li><strong>' + esc(SERVICES[r.serviceId].name) + '</strong><span>' + fmtDate(r.date) + ' · ' + esc(shortName(vehicle(r.vehicleId))) + '</span><br><span>' + money(r.total) + ' · +' + r.points + ' pts</span></li>';
    }).join('') : '<li class="mini-empty">Your visits will appear here.</li>';

    drawChart();
  }

  /* ---------- Canvas chart: last 6 months ---------- */
  function monthBuckets() {
    var now = new Date(), out = [];
    for (var i = 5; i >= 0; i--) {
      var m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push({ y: m.getFullYear(), m: m.getMonth(), label: m.toLocaleDateString('en-US', { month: 'short' }), spend: 0, visits: 0, current: i === 0 });
    }
    state.history.forEach(function (r) {
      var d = toDate(r.date);
      out.forEach(function (b) { if (b.y === d.getFullYear() && b.m === d.getMonth()) { b.spend += r.total; b.visits++; } });
    });
    return out;
  }
  function niceStep(raw) {
    var p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    var n = raw / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }
  function drawChart() {
    var canvas = $('#spend-chart');
    if (!canvas || canvas.offsetParent === null) return;
    var box = canvas.parentNode, w = box.clientWidth, h = box.clientHeight;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var css = getComputedStyle(document.documentElement);
    var cBar = css.getPropertyValue('--chart-bar').trim();
    var cNow = css.getPropertyValue('--cta').trim();
    var cText = css.getPropertyValue('--text-muted').trim();
    var cLine = css.getPropertyValue('--line').trim();
    var cHead = css.getPropertyValue('--heading').trim();
    var rtl = BW.isRTL();
    var mode = ui.chartMode;
    var chrono = monthBuckets();
    var data = rtl ? chrono.slice().reverse() : chrono;   // time runs right-to-left in RTL
    var vals = data.map(function (d) { return d[mode]; });
    var max = Math.max.apply(null, vals);
    var step = mode === 'spend' ? niceStep(Math.max(max, 40) / 4) : Math.max(1, Math.ceil(max / 4));
    var top = step * 4;

    var padStart = 46, padEnd = 10, padTop = 26, padBottom = 30;
    var left = rtl ? padEnd : padStart, right = rtl ? padStart : padEnd;
    var plotW = w - left - right, plotH = h - padTop - padBottom;
    ctx.font = '600 12px "Instrument Sans", system-ui, sans-serif';
    ctx.textBaseline = 'middle';

    // Grid lines + axis labels
    for (var i = 0; i <= 4; i++) {
      var y = padTop + plotH - plotH * i / 4;
      ctx.strokeStyle = cLine;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(left, Math.round(y) + 0.5); ctx.lineTo(w - right, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillStyle = cText;
      ctx.textAlign = rtl ? 'left' : 'right';
      var label = mode === 'spend' ? '$' + step * i : String(step * i);
      ctx.fillText(label, rtl ? w - right + 8 : left - 8, y);
    }

    // Bars with rounded tops
    var slot = plotW / data.length;
    var bw = Math.min(48, slot * 0.56);
    data.forEach(function (d, idx) {
      var v = d[mode];
      var bh = top ? plotH * v / top : 0;
      var x = left + slot * idx + (slot - bw) / 2;
      var yTop = padTop + plotH - bh;
      var r = Math.min(8, bw / 2, bh);
      ctx.fillStyle = d.current ? cNow : cBar;
      ctx.beginPath();
      ctx.moveTo(x, padTop + plotH);
      ctx.lineTo(x, yTop + r);
      ctx.quadraticCurveTo(x, yTop, x + r, yTop);
      ctx.lineTo(x + bw - r, yTop);
      ctx.quadraticCurveTo(x + bw, yTop, x + bw, yTop + r);
      ctx.lineTo(x + bw, padTop + plotH);
      ctx.closePath();
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.fillStyle = cHead;
      if (v) ctx.fillText(mode === 'spend' ? '$' + v : String(v), x + bw / 2, yTop - 11);
      ctx.fillStyle = cText;
      ctx.fillText(d.label, x + bw / 2, padTop + plotH + 16);
    });

    var total = chrono.reduce(function (s, d) { return s + d[mode]; }, 0);
    var busiest = chrono.slice().sort(function (a, b) { return b[mode] - a[mode]; })[0];
    $('[data-chart-summary]').textContent = mode === 'spend'
      ? money(total) + ' spent · about ' + money(total / 6) + ' a month'
      : total + ' visits · busiest month: ' + busiest.label;
    canvas.setAttribute('aria-label', 'Bar chart of monthly ' + (mode === 'spend' ? 'spend' : 'visits') + ': ' +
      chrono.map(function (d) { return d.label + ' ' + (mode === 'spend' ? money(d.spend) : d.visits); }).join(', '));
  }

  /* ---------- Bookings ---------- */
  var bkForm = $('#booking-form');
  var bkVehicle = $('#bk-vehicle'), bkService = $('#bk-service'), bkDate = $('#bk-date'), bkTime = $('#bk-time');

  function refreshBookingForm() {
    var vSel = bkVehicle.value || (state.vehicles[0] && state.vehicles[0].id);
    fillVehicleSelect(bkVehicle, vSel);
    var sSel = bkService.value || 'foam';
    fillServiceSelect(bkService, bkVehicle.value, sSel);
    bkDate.min = isoDate(new Date());
    if (!bkDate.value || bkDate.value < bkDate.min) bkDate.value = firstOpenDate(bkService.value);
    fillTimeSelect(bkTime, bkDate.value, bkService.value, null, bkTime.value);
    var svc = SERVICES[bkService.value];
    var quote = $('[data-quote]');
    if (!state.vehicles.length) { quote.textContent = 'Add a vehicle in Profile to start booking.'; return; }
    var price = priceFor(svc.id, bkVehicle.value);
    var pts = earnFor(price, yearPoints());
    quote.innerHTML = (svc.type === 'studio' ? 'Starting price ' : 'Total ') + '<strong>' + money(price) + '</strong>' +
      (price ? ' · earns about <strong>' + pts + ' points</strong>' : '') +
      ' · ' + (svc.mins >= 60 ? Math.round(svc.mins / 60 * 10) / 10 + ' h' : svc.mins + ' min') + (svc.type === 'studio' ? ' in the studio' : ' in the bay');
  }

  function bookingActions(b) {
    var label = esc(SERVICES[b.serviceId].name + ' on ' + fmtDate(b.date));
    var a = [];
    if (b.status === 'Confirmed') a.push('<button class="act" type="button" data-action="checkin" data-id="' + b.id + '" aria-label="Check in for ' + label + '">Check in</button>');
    if (b.status === 'Confirmed' || b.status === 'Pending') {
      a.push('<button class="act" type="button" data-action="booking-edit" data-id="' + b.id + '" aria-label="Edit ' + label + '">Edit</button>');
      a.push('<button class="act act--danger" type="button" data-action="booking-cancel" data-id="' + b.id + '" aria-label="Cancel ' + label + '">Cancel</button>');
    }
    if (b.status === 'In service') a.push('<button class="act" type="button" data-go="status">Track</button>');
    if (b.status === 'Cancelled') a.push('<button class="act" type="button" data-action="rebook" data-service="' + b.serviceId + '" data-vehicle="' + b.vehicleId + '" aria-label="Rebook ' + label + '">Rebook</button>');
    if (b.status === 'Cancelled' || b.status === 'Completed') a.push('<button class="act act--danger" type="button" data-action="booking-delete" data-id="' + b.id + '" aria-label="Delete ' + label + '">Delete</button>');
    return a.join('');
  }

  function renderBookings() {
    refreshBookingForm();
    var q = $('#bk-search').value.trim().toLowerCase();
    var f = $('#bk-filter').value;
    var live = { 'In service': 0, Confirmed: 1, Pending: 1 };
    var rows = state.bookings.filter(function (b) {
      if (f !== 'all' && b.status !== f) return false;
      if (!q) return true;
      var hay = [SERVICES[b.serviceId].name, vehicle(b.vehicleId).name, vehicle(b.vehicleId).plate, b.notes, b.status].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    }).sort(function (a, b) {
      var la = a.status in live, lb = b.status in live;
      if (la !== lb) return la ? -1 : 1;
      return la ? byWhen(a, b) : byWhen(b, a);
    });
    $('[data-bookings-body]').innerHTML = rows.map(function (b) {
      var v = vehicle(b.vehicleId);
      return '<tr>' +
        '<td data-label="When"><span><strong>' + fmtDate(b.date) + '</strong><small>' + fmtTime(b.time) + '</small></span></td>' +
        '<td data-label="Vehicle"><span>' + esc(v.name) + '<small>' + esc(v.plate) + '</small></span></td>' +
        '<td data-label="Service"><span>' + esc(SERVICES[b.serviceId].name) + (b.notes ? '<small>' + esc(b.notes) + '</small>' : '') + '</span></td>' +
        '<td data-label="Status"><span class="pill pill--' + b.status.replace(' ', '-') + '">' + b.status + '</span></td>' +
        '<td data-label="Total" class="num">' + money(priceFor(b.serviceId, b.vehicleId)) + '</td>' +
        '<td class="actions-cell"><div class="row-actions">' + bookingActions(b) + '</div></td></tr>';
    }).join('');
    $('[data-bookings-empty]').hidden = rows.length > 0;
  }

  bkVehicle.addEventListener('change', refreshBookingForm);
  bkService.addEventListener('change', refreshBookingForm);
  bkDate.addEventListener('change', refreshBookingForm);
  $('#bk-search').addEventListener('input', renderBookings);
  $('#bk-filter').addEventListener('change', renderBookings);

  bkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!state.vehicles.length) { toast('Add a vehicle in Profile first.'); showView('profile'); return; }
    if (!validate(bkForm)) return;
    if (takenTimes(bkDate.value, null).indexOf(bkTime.value) !== -1) { fieldError(bkTime, 'That time was just taken. Pick another.'); return; }
    var svc = SERVICES[bkService.value];
    var b = {
      id: uid('b'), date: bkDate.value, time: bkTime.value, vehicleId: bkVehicle.value, serviceId: svc.id,
      status: svc.type === 'studio' ? 'Pending' : 'Confirmed', notes: $('#bk-notes').value.trim()
    };
    state.bookings.push(b);
    notify((b.status === 'Pending' ? 'Studio request received: ' : 'Booking confirmed: ') + svc.name + ' on ' + fmtDate(b.date) + ' at ' + fmtTime(b.time) + '.');
    $('#bk-notes').value = '';
    bkTime.value = '';
    commit();
    toast(b.status === 'Pending' ? 'Request sent. We’ll confirm within 4 business hours.' : 'Booked: ' + svc.name + ', ' + fmtDate(b.date) + ' at ' + fmtTime(b.time));
  });

  function editBooking(id) {
    var b = state.bookings.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    openModal('Edit booking',
      '<form class="dash-form" id="edit-form" novalidate>' +
        '<div class="field"><label for="ed-vehicle">Vehicle</label><select id="ed-vehicle" required data-label="A vehicle"></select><p class="error-msg" aria-live="polite"></p></div>' +
        '<div class="field"><label for="ed-service">Service</label><select id="ed-service" required data-label="A service"></select><p class="error-msg" aria-live="polite"></p></div>' +
        '<div class="field-row"><div class="field"><label for="ed-date">Date</label><input id="ed-date" type="date" required data-label="A date"><p class="error-msg" aria-live="polite"></p></div>' +
        '<div class="field"><label for="ed-time">Time</label><select id="ed-time" required data-label="A time"></select><p class="error-msg" aria-live="polite"></p></div></div>' +
        '<div class="field"><label for="ed-notes">Notes <span class="optional">(optional)</span></label><textarea id="ed-notes" rows="3"></textarea></div>' +
        '<div class="modal-actions"><button class="link-btn" type="button" data-modal-close>Discard changes</button><button class="btn" type="submit">Save Changes</button></div>' +
      '</form>',
      function (body) {
        var ev = $('#ed-vehicle', body), es = $('#ed-service', body), ed = $('#ed-date', body), et = $('#ed-time', body);
        fillVehicleSelect(ev, b.vehicleId);
        fillServiceSelect(es, b.vehicleId, b.serviceId);
        ed.min = isoDate(new Date());
        ed.value = b.date;
        fillTimeSelect(et, b.date, b.serviceId, b.id, b.time);
        $('#ed-notes', body).value = b.notes || '';
        function sync() {
          fillServiceSelect(es, ev.value, es.value);
          fillTimeSelect(et, ed.value, es.value, b.id, et.value);
        }
        ev.addEventListener('change', sync);
        es.addEventListener('change', sync);
        ed.addEventListener('change', sync);
        $('#edit-form', body).addEventListener('submit', function (e) {
          e.preventDefault();
          if (!validate(e.target)) return;
          var wasStudio = SERVICES[b.serviceId].type === 'studio';
          b.vehicleId = ev.value; b.serviceId = es.value; b.date = ed.value; b.time = et.value;
          b.notes = $('#ed-notes', body).value.trim();
          var isStudio = SERVICES[b.serviceId].type === 'studio';
          if (isStudio && !wasStudio) b.status = 'Pending';
          if (!isStudio && b.status === 'Pending') b.status = 'Confirmed';
          notify('Booking updated: ' + SERVICES[b.serviceId].name + ' on ' + fmtDate(b.date) + ' at ' + fmtTime(b.time) + '.');
          closeModal();
          commit();
          toast('Booking updated');
        });
      });
  }

  function checkIn(id) {
    var b = state.bookings.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    if (state.active) {
      toast('The bay is still working on your ' + shortName(vehicle(state.active.vehicleId)) + '. Pick it up first.');
      showView('status');
      return;
    }
    var now = new Date();
    var studio = SERVICES[b.serviceId].type === 'studio';
    state.active = {
      bookingId: b.id, vehicleId: b.vehicleId, serviceId: b.serviceId,
      bay: studio ? 'Studio 1' : 'Bay ' + (1 + Math.floor(Math.random() * 3)),
      stage: 0, addons: [], checkedIn: now.toISOString(), stageTimes: [now.toISOString()],
      messages: [{ from: 'bay', text: 'Checked in. Keys are with the front desk.', at: now.toISOString() }]
    };
    if (b.notes) state.active.messages.push({ from: 'you', text: b.notes, at: now.toISOString() });
    b.status = 'In service';
    notify('Checked in: ' + vehicle(b.vehicleId).name + ' is in ' + state.active.bay + '.');
    commit();
    showView('status');
    toast('Checked in to ' + state.active.bay);
  }

  /* ---------- Service status ---------- */
  function renderStatus() {
    var root = $('[data-status-root]');
    var a = state.active;
    if (!a) {
      var next = upcoming()[0];
      root.innerHTML = '<article class="panel status-empty"><span class="bead" aria-hidden="true">&#9673;</span>' +
        '<h2>No car in the bay right now</h2><p>' +
        (next ? 'Your next visit is ' + esc(SERVICES[next.serviceId].name) + ' on ' + fmtDate(next.date) + ' at ' + fmtTime(next.time) + '. When you arrive, check in and this page follows your car stage by stage.'
              : 'Book a slot and check in when you arrive. This page then follows your car stage by stage.') +
        '</p><div class="btn-row">' +
        (next && next.status === 'Confirmed' ? '<button class="btn" type="button" data-action="checkin" data-id="' + next.id + '">Check In for ' + fmtTime(next.time) + '</button>' : '<button class="btn" type="button" data-go="bookings">Book a Slot</button>') +
        '<button class="link-btn" type="button" data-go="history">View past visits</button></div></article>';
      return;
    }
    var svc = SERVICES[a.serviceId], v = vehicle(a.vehicleId), stages = stagesFor(a.serviceId);
    var last = stages.length - 1, ready = a.stage >= last;
    var pct = Math.round(a.stage / last * 100);
    var total = priceFor(a.serviceId, a.vehicleId) + addonTotal(a.addons);
    var lockAddons = a.stage >= last - 1;

    root.innerHTML = '<div class="status-grid">' +
      '<article class="panel">' +
        '<div class="status-head"><div>' +
          '<p class="eyebrow">' + esc(a.bay) + ' · ' + esc(svc.name) + '</p>' +
          '<h2>' + esc(v.name) + '</h2>' +
          '<p class="muted">Checked in ' + fmtClock(a.checkedIn) + ' · ' + (ready ? 'Ready now' : 'Estimated ready ' + fmtClock(etaFor(a))) + '</p>' +
          '<div class="status-meta"><span class="chip">Plate ' + esc(v.plate) + '</span><span class="chip">Stage ' + (a.stage + 1) + ' of ' + stages.length + '</span></div>' +
        '</div><div class="ring" style="--p:' + pct + '" role="img" aria-label="' + pct + ' percent complete"><span>' + pct + '%<small>done</small></span></div></div>' +
        '<ol class="stage-track" aria-label="Service stages">' + stages.map(function (s, i) {
          var cls = i < a.stage ? 'done' : i === a.stage ? 'current' : '';
          var sr = i < a.stage ? 'Completed: ' : i === a.stage ? 'Current stage: ' : 'Coming up: ';
          var time = a.stageTimes[i] ? '<time>' + fmtClock(a.stageTimes[i]) + '</time>' : '<span></span>';
          return '<li class="' + cls + '"' + (i === a.stage ? ' aria-current="step"' : '') + '><span class="visually-hidden">' + sr + '</span><span>' + esc(s) + '</span>' + time + '</li>';
        }).join('') + '</ol>' +
        '<div class="btn-row">' +
          (ready ? '<button class="btn" type="button" data-action="pickup">Confirm Pickup &amp; Pay</button>' : '<button class="btn" type="button" data-action="status-refresh">Refresh Status</button>') +
          '<span class="muted small">' + (ready ? 'Points are added the moment you confirm pickup.' : 'The bay team updates each stage as it finishes.') + '</span>' +
        '</div>' +
      '</article>' +
      '<div class="status-side">' +
        '<article class="panel"><h2>Add-ons for this visit</h2><p class="muted small">' + (lockAddons ? 'Extras are locked once the car reaches final inspection.' : 'Add or remove extras until final inspection.') + '</p>' +
          '<ul class="addon-checks">' + ADDONS.map(function (ad) {
            return '<li><label><span><input type="checkbox" data-addon="' + ad.id + '"' + (a.addons.indexOf(ad.id) !== -1 ? ' checked' : '') + (lockAddons ? ' disabled' : '') + '> ' + esc(ad.name) + '</span><span class="num">+' + money(ad.price) + '</span></label></li>';
          }).join('') + '</ul>' +
          '<p class="total-line"><span>Visit total</span><span class="num">' + money(total) + '</span></p></article>' +
        '<article class="panel"><h2>Message the bay</h2>' +
          '<ul class="msg-log" data-msg-log aria-live="polite"></ul>' +
          '<form class="msg-form" id="msg-form" novalidate><div class="field"><label class="visually-hidden" for="msg-text">Message to the bay team</label>' +
          '<textarea id="msg-text" class="input" rows="2" required data-label="A message" placeholder="e.g. Please skip the tire shine"></textarea><p class="error-msg" aria-live="polite"></p></div>' +
          '<button class="btn btn--sm" type="submit">Send Message</button></form>' +
        '</article>' +
      '</div></div>';
    renderMessages();
  }

  function renderMessages() {
    var log = $('[data-msg-log]');
    if (!log || !state.active) return;
    log.innerHTML = state.active.messages.map(function (m) {
      return '<li class="msg msg--' + m.from + '"><span class="visually-hidden">' + (m.from === 'you' ? 'You: ' : 'Bay team: ') + '</span>' + esc(m.text) + '<time>' + fmtClock(m.at) + '</time></li>';
    }).join('');
    log.scrollTop = log.scrollHeight;
  }

  function refreshStatus() {
    var a = state.active;
    if (!a) return;
    var stages = stagesFor(a.serviceId), last = stages.length - 1;
    if (a.stage >= last) return;
    a.stage++;
    a.stageTimes[a.stage] = new Date().toISOString();
    var v = shortName(vehicle(a.vehicleId));
    if (a.stage === last) {
      a.messages.push({ from: 'bay', text: 'All done! Your ' + v + ' is in the exit lane.', at: new Date().toISOString() });
      notify('Ready for pickup: your ' + v + ' is waiting in the exit lane.');
      toast('Your car is ready for pickup');
    } else {
      a.messages.push({ from: 'bay', text: 'Moving on to ' + stages[a.stage].toLowerCase() + '.', at: new Date().toISOString() });
      notify(a.bay + ': your ' + v + ' moved to ' + stages[a.stage] + '.');
      toast('Updated: ' + stages[a.stage]);
    }
    commit();
  }

  function confirmPickup() {
    var a = state.active;
    if (!a) return;
    var base = priceFor(a.serviceId, a.vehicleId), extras = addonTotal(a.addons), total = base + extras;
    var pts = earnFor(total, yearPoints());
    confirmBox({
      title: 'Confirm pickup',
      text: 'Pay <strong>' + money(total) + '</strong> for ' + esc(SERVICES[a.serviceId].name) + (extras ? ' with add-ons' : '') + ' and add <strong>' + pts + ' points</strong> to your balance.',
      ok: 'Confirm & Pay',
      cancel: 'Not yet',
      onOk: function () {
        var b = state.bookings.filter(function (x) { return x.id === a.bookingId; })[0];
        var now = new Date();
        var rec = {
          id: uid('h'), date: isoDate(now), time: b ? b.time : pad(now.getHours()) + ':' + pad(now.getMinutes()),
          bay: a.bay, vehicleId: a.vehicleId, serviceId: a.serviceId, addons: a.addons.slice(),
          base: base, total: total, points: pts, rating: 0, review: ''
        };
        state.history.push(rec);
        state.activity.push({ id: uid('a'), date: rec.date, text: 'Earned: ' + SERVICES[a.serviceId].name, pts: pts });
        if (b) b.status = 'Completed';
        state.active = null;
        notify('Thanks for visiting! ' + pts + ' points were added to your balance.');
        commit();
        toast('Paid ' + money(total) + ' · +' + pts + ' points');
        rateVisit(rec.id, true);
      }
    });
  }

  /* ---------- History ---------- */
  function renderHistory() {
    var vSel = $('#hi-vehicle'), ySel = $('#hi-year');
    var vKeep = vSel.value || 'all', yKeep = ySel.value || 'all';
    var vIds = [];
    state.history.forEach(function (r) { if (vIds.indexOf(r.vehicleId) === -1) vIds.push(r.vehicleId); });
    vSel.innerHTML = '<option value="all">All vehicles</option>' + vIds.map(function (id) {
      return '<option value="' + id + '">' + esc(vehicle(id).name) + '</option>';
    }).join('');
    vSel.value = vIds.indexOf(vKeep) !== -1 ? vKeep : 'all';
    var years = [];
    state.history.forEach(function (r) { var y = String(toDate(r.date).getFullYear()); if (years.indexOf(y) === -1) years.push(y); });
    years.sort().reverse();
    ySel.innerHTML = '<option value="all">All years</option>' + years.map(function (y) { return '<option value="' + y + '">' + y + '</option>'; }).join('');
    ySel.value = years.indexOf(yKeep) !== -1 ? yKeep : 'all';

    var q = $('#hi-search').value.trim().toLowerCase();
    var rows = state.history.filter(function (r) {
      if (vSel.value !== 'all' && r.vehicleId !== vSel.value) return false;
      if (ySel.value !== 'all' && String(toDate(r.date).getFullYear()) !== ySel.value) return false;
      if (!q) return true;
      return (SERVICES[r.serviceId].name + ' ' + vehicle(r.vehicleId).name + ' ' + r.bay).toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return byWhen(b, a); });

    var spent = rows.reduce(function (s, r) { return s + r.total; }, 0);
    var pts = rows.reduce(function (s, r) { return s + r.points; }, 0);
    $('[data-history-summary]').textContent = rows.length + ' visit' + (rows.length === 1 ? '' : 's') + ' · ' + money(spent) + ' spent · ' + pts.toLocaleString('en-US') + ' points earned';

    $('[data-history-body]').innerHTML = rows.map(function (r) {
      var v = vehicle(r.vehicleId);
      var extras = ADDONS.filter(function (a) { return r.addons.indexOf(a.id) !== -1; }).map(function (a) { return a.name; }).join(', ');
      var label = esc(SERVICES[r.serviceId].name + ' on ' + fmtDate(r.date, true));
      return '<tr>' +
        '<td data-label="Date"><span><strong>' + fmtDate(r.date, true) + '</strong><small>' + esc(r.bay) + '</small></span></td>' +
        '<td data-label="Vehicle">' + esc(v.name) + '</td>' +
        '<td data-label="Service"><span>' + esc(SERVICES[r.serviceId].name) + (extras ? '<small>+ ' + esc(extras) + '</small>' : '') + '</span></td>' +
        '<td data-label="Total" class="num">' + money(r.total) + '</td>' +
        '<td data-label="Points" class="num">+' + r.points + '</td>' +
        '<td data-label="Your rating">' + starsHTML(r.rating) + '</td>' +
        '<td class="actions-cell"><div class="row-actions">' +
          '<button class="act" type="button" data-action="receipt" data-id="' + r.id + '" aria-label="Receipt for ' + label + '">Receipt</button>' +
          '<button class="act" type="button" data-action="rate" data-id="' + r.id + '" aria-label="Rate ' + label + '">' + (r.rating ? 'Edit rating' : 'Rate') + '</button>' +
          '<button class="act" type="button" data-action="rebook" data-service="' + r.serviceId + '" data-vehicle="' + r.vehicleId + '" aria-label="Book ' + label + ' again">Rebook</button>' +
          '<button class="act act--danger" type="button" data-action="history-delete" data-id="' + r.id + '" aria-label="Delete ' + label + '">Delete</button>' +
        '</div></td></tr>';
    }).join('');
    $('[data-history-empty]').hidden = rows.length > 0;
  }
  $('#hi-search').addEventListener('input', renderHistory);
  $('#hi-vehicle').addEventListener('change', renderHistory);
  $('#hi-year').addEventListener('change', renderHistory);

  function findRecord(id) { return state.history.filter(function (r) { return r.id === id; })[0]; }

  function showReceipt(id) {
    var r = findRecord(id);
    if (!r) return;
    var v = vehicle(r.vehicleId);
    var lines = '<tr><td>' + esc(SERVICES[r.serviceId].name) + ' (' + esc(SIZES[v.size]) + ')</td><td>' + money(r.base) + '</td></tr>' +
      ADDONS.filter(function (a) { return r.addons.indexOf(a.id) !== -1; }).map(function (a) {
        return '<tr><td>' + esc(a.name) + '</td><td>' + money(a.price) + '</td></tr>';
      }).join('');
    openModal('Receipt',
      '<div class="receipt">' +
        '<div class="receipt-brand"><img src="../assets/images/logo-mark.png" alt=""><div><strong>Beadwell Wash &amp; Detail</strong><br><span class="muted small">2140 Foundry St, Denver, CO 80216</span></div></div>' +
        '<dl><dt>Receipt no.</dt><dd class="code">' + esc(r.id.toUpperCase()) + '</dd><dt>Date</dt><dd>' + fmtDate(r.date, true) + ', ' + fmtTime(r.time) + '</dd>' +
        '<dt>Location</dt><dd>' + esc(r.bay) + '</dd><dt>Vehicle</dt><dd>' + esc(v.name) + ' · ' + esc(v.plate) + '</dd></dl>' +
        '<table><tbody>' + lines + '<tr class="grand"><td>Total paid (tax included)</td><td>' + money(r.total) + '</td></tr></tbody></table>' +
        '<p class="muted small">Beadwell Points earned: +' + r.points + '</p>' +
        '<div class="modal-actions"><button class="link-btn" type="button" data-modal-close>Close</button><button class="btn" type="button" data-print>Print Receipt</button></div>' +
      '</div>',
      function (body) { body.querySelector('[data-print]').addEventListener('click', function () { window.print(); }); });
  }

  function rateVisit(id, afterPickup) {
    var r = findRecord(id);
    if (!r) return;
    var options = [5, 4, 3, 2, 1].map(function (n) {
      return '<label><input type="radio" name="rate" value="' + n + '"' + (r.rating === n ? ' checked' : '') + '> ' + n + ' &#9733;</label>';
    }).join('');
    openModal(afterPickup ? 'How did we do?' : 'Rate this visit',
      '<form class="dash-form" id="rate-form" novalidate>' +
        '<p class="muted">' + esc(SERVICES[r.serviceId].name) + ' · ' + fmtDate(r.date, true) + ' · ' + esc(vehicle(r.vehicleId).name) + '</p>' +
        '<fieldset class="choice-group"><legend>Your rating</legend>' + options + '</fieldset>' +
        '<div class="field"><label for="rate-note">Anything we should know? <span class="optional">(optional)</span></label><textarea id="rate-note" rows="3">' + esc(r.review || '') + '</textarea></div>' +
        '<p class="error-msg" data-rate-error aria-live="polite"></p>' +
        '<div class="modal-actions"><button class="link-btn" type="button" data-modal-close>' + (afterPickup ? 'Skip for now' : 'Cancel') + '</button><button class="btn" type="submit">Save Rating</button></div>' +
      '</form>',
      function (body) {
        $('#rate-form', body).addEventListener('submit', function (e) {
          e.preventDefault();
          var pick = body.querySelector('input[name="rate"]:checked');
          if (!pick) { body.querySelector('[data-rate-error]').textContent = 'Choose a rating from 1 to 5 stars.'; return; }
          r.rating = +pick.value;
          r.review = $('#rate-note', body).value.trim();
          closeModal();
          commit();
          toast('Thanks for rating your visit');
        });
      });
  }

  function rebook(serviceId, vehicleId) {
    showView('bookings', { focus: false });
    if (state.vehicles.some(function (v) { return v.id === vehicleId; })) bkVehicle.value = vehicleId;
    fillServiceSelect(bkService, bkVehicle.value, serviceId);
    bkDate.value = firstOpenDate(serviceId);
    refreshBookingForm();
    bkDate.focus();
    toast('Pick a date and time for ' + SERVICES[serviceId].name);
  }

  /* ---------- Loyalty ---------- */
  function renderLoyalty() {
    var bal = balance(), yp = yearPoints(), tier = currentTier(), next = nextTier();
    var pct = next ? Math.min(100, yp / next.min * 100) : 100;
    $('[data-points-card]').innerHTML =
      '<p class="eyebrow">Beadwell Points</p><h2>Points balance</h2>' +
      '<p class="points-big">' + bal.toLocaleString('en-US') + ' <span>pts</span></p>' +
      '<p><span class="tier-tag">' + tier.name + ' tier</span> ' + esc(tier.perk) + '</p>' +
      '<div class="progress" role="progressbar" aria-label="Progress to the next tier" aria-valuemin="0" aria-valuemax="' + (next ? next.min : yp) + '" aria-valuenow="' + yp + '"><span style="--w:' + pct + '%"></span></div>' +
      '<p class="small">' + yp.toLocaleString('en-US') + ' points earned this year · ' + (next ? (next.min - yp).toLocaleString('en-US') + ' more to reach ' + next.name : 'Top tier reached. Thank you!') + '</p>';

    var canRedeem = REWARDS.filter(function (r) { return r.pts <= bal; }).length;
    $('[data-reward-note]').textContent = 'You can redeem ' + canRedeem + ' of ' + REWARDS.length + ' rewards';
    $('[data-rewards]').innerHTML = REWARDS.map(function (r) {
      var ok = bal >= r.pts;
      return '<div class="reward"><strong>' + r.pts + '</strong><p>' + esc(r.name) + '</p>' +
        (ok ? '<button class="btn btn--sm" type="button" data-action="redeem" data-id="' + r.id + '">Redeem</button>'
            : '<button class="btn btn--sm" type="button" disabled aria-disabled="true">Redeem</button><span class="need">Need ' + (r.pts - bal) + ' more points</span>') +
        '</div>';
    }).join('');

    $('[data-vouchers-body]').innerHTML = state.vouchers.map(function (vc) {
      return '<tr><td data-label="Code" class="code">' + esc(vc.code) + '</td>' +
        '<td data-label="Reward"><span>' + esc(vc.name) + '<small>Issued ' + fmtDate(vc.date, true) + '</small></span></td>' +
        '<td data-label="Status"><span class="pill pill--' + vc.status + '">' + vc.status + '</span></td>' +
        '<td class="actions-cell"><div class="row-actions">' +
          (vc.status === 'Active' ? '<button class="act" type="button" data-action="voucher-use" data-code="' + vc.code + '">Mark used</button>' : '') +
          '<button class="act act--danger" type="button" data-action="voucher-remove" data-code="' + vc.code + '" aria-label="Remove voucher ' + esc(vc.code) + '">Remove</button>' +
        '</div></td></tr>';
    }).join('');
    $('[data-vouchers-empty]').hidden = state.vouchers.length > 0;

    var acts = state.activity.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    var shown = ui.showAllActivity ? acts : acts.slice(0, 8);
    $('[data-activity]').innerHTML = shown.map(function (a) {
      return '<li><span>' + esc(a.text) + '<time>' + fmtDate(a.date, true) + '</time></span><span class="' + (a.pts >= 0 ? 'pts-plus' : 'pts-minus') + '">' + (a.pts >= 0 ? '+' : '−') + Math.abs(a.pts) + '</span></li>';
    }).join('');
    $('[data-action="toggle-activity"]').textContent = ui.showAllActivity ? 'Show recent' : 'Show all (' + acts.length + ')';
  }

  function redeem(id) {
    var r = REWARDS.filter(function (x) { return x.id === id; })[0];
    if (!r || balance() < r.pts) return;
    confirmBox({
      title: 'Redeem ' + r.name + '?',
      text: 'This uses <strong>' + r.pts + ' points</strong>. You’ll get a voucher code to show at the desk or mention when you book.',
      ok: 'Redeem ' + r.pts + ' Points',
      cancel: 'Not now',
      onOk: function () {
        var code = voucherCode();
        var today = isoDate(new Date());
        state.vouchers.unshift({ code: code, rewardId: r.id, name: r.name, date: today, status: 'Active' });
        state.activity.push({ id: uid('a'), date: today, text: 'Redeemed: ' + r.name, pts: -r.pts });
        notify('Voucher ' + code + ' is ready: ' + r.name + '.');
        commit();
        toast('Voucher ' + code + ' created');
      }
    });
  }

  $('#share-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#share-url');
    if (!validate(e.target)) return;
    var url = input.value.trim();
    if (!/instagram\.com|google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url)) {
      fieldError(input, 'Use a public Instagram post or Google Maps review link.');
      input.focus();
      return;
    }
    if (state.shares.indexOf(url) !== -1) { fieldError(input, 'That post has already been claimed.'); input.focus(); return; }
    state.shares.push(url);
    state.activity.push({ id: uid('a'), date: isoDate(new Date()), text: '#BeadwellShine photo bonus', pts: 50 });
    notify('Thanks for sharing! 50 points were added for your #BeadwellShine post.');
    input.value = '';
    commit();
    toast('+50 points for your post');
  });

  /* ---------- Profile & vehicles ---------- */
  function renderProfile() {
    var form = $('#profile-form');
    if (!form.contains(document.activeElement)) {
      $('#pf-name').value = state.profile.name;
      $('#pf-email').value = state.profile.email;
      $('#pf-phone').value = state.profile.phone;
    }
    $('[data-vehicles]').innerHTML = state.vehicles.length ? state.vehicles.map(function (v) {
      return '<li><span class="bead" aria-hidden="true">' + SIZE_SHORT[v.size].charAt(0) + '</span>' +
        '<span class="v-main"><strong>' + esc(v.name) + '</strong><span>' + esc(v.plate) + ' · ' + SIZES[v.size] + (v.color ? ' · ' + esc(v.color) : '') + '</span></span>' +
        '<span class="row-actions"><button class="act" type="button" data-action="vehicle-edit" data-id="' + v.id + '" aria-label="Edit ' + esc(v.name) + '">Edit</button>' +
        '<button class="act act--danger" type="button" data-action="vehicle-delete" data-id="' + v.id + '" aria-label="Delete ' + esc(v.name) + '">Delete</button></span></li>';
    }).join('') : '<li class="mini-empty">No vehicles yet. Add one to start booking.</li>';
  }

  $('#profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(e.target)) return;
    state.profile.name = $('#pf-name').value.trim();
    state.profile.email = $('#pf-email').value.trim();
    state.profile.phone = $('#pf-phone').value.trim();
    // keep the sign-in session name in step (the sign-in email itself does not change)
    session.name = state.profile.name;
    BW.setItem(BW.KEYS.session, JSON.stringify(session));
    document.activeElement.blur();
    commit();
    toast('Details saved');
  });

  function vehicleForm(v) {
    var isNew = !v;
    v = v || { name: '', plate: '', size: 0, color: '' };
    openModal(isNew ? 'Add a vehicle' : 'Edit vehicle',
      '<form class="dash-form" id="vehicle-form" novalidate>' +
        '<div class="field"><label for="vf-name">Year, make and model</label><input id="vf-name" type="text" required data-label="Year, make and model" data-min="3" placeholder="e.g. 2022 Toyota RAV4" value="' + esc(v.name) + '"><p class="error-msg" aria-live="polite"></p></div>' +
        '<div class="field-row"><div class="field"><label for="vf-plate">License plate</label><input id="vf-plate" type="text" required data-label="License plate" value="' + esc(v.plate) + '"><p class="error-msg" aria-live="polite"></p></div>' +
        '<div class="field"><label for="vf-color">Color <span class="optional">(optional)</span></label><input id="vf-color" type="text" value="' + esc(v.color) + '"></div></div>' +
        '<div class="field"><label for="vf-size">Size class (sets your price)</label><select id="vf-size">' +
          SIZES.map(function (s, i) { return '<option value="' + i + '"' + (v.size === i ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="modal-actions"><button class="link-btn" type="button" data-modal-close>Cancel</button><button class="btn" type="submit">' + (isNew ? 'Add Vehicle' : 'Save Vehicle') + '</button></div>' +
      '</form>',
      function (body) {
        $('#vehicle-form', body).addEventListener('submit', function (e) {
          e.preventDefault();
          if (!validate(e.target)) return;
          var data = {
            name: $('#vf-name', body).value.trim(),
            plate: $('#vf-plate', body).value.trim().toUpperCase(),
            color: $('#vf-color', body).value.trim(),
            size: +$('#vf-size', body).value
          };
          if (isNew) state.vehicles.push(Object.assign({ id: uid('v') }, data));
          else Object.assign(v, data);
          closeModal();
          commit();
          toast(isNew ? 'Vehicle added' : 'Vehicle updated');
        });
      });
  }

  function deleteVehicle(id) {
    var v = vehicle(id);
    var busy = (state.active && state.active.vehicleId === id) || upcoming().some(function (b) { return b.vehicleId === id; });
    if (busy) {
      openModal('Vehicle has bookings', '<p>' + esc(v.name) + ' has an upcoming booking or is in the bay right now. Cancel or finish those first, then delete it.</p><div class="modal-actions"><button class="link-btn" type="button" data-modal-close>Close</button><button class="btn" type="button" data-go="bookings">Go to Bookings</button></div>');
      return;
    }
    confirmBox({
      title: 'Delete ' + v.name + '?',
      text: 'Past visits stay in your history. You can add the vehicle again any time.',
      ok: 'Delete Vehicle',
      onOk: function () {
        state.vehicles = state.vehicles.filter(function (x) { return x.id !== id; });
        commit();
        toast('Vehicle deleted');
      }
    });
  }

  /* ---------- Settings ---------- */
  function renderSettings() {
    $all('[data-pref]').forEach(function (input) { input.checked = !!state.prefs[input.getAttribute('data-pref')]; });
    $all('input[name="st-theme"]').forEach(function (r) { r.checked = r.value === (BW.isDark() ? 'dark' : 'light'); });
    $all('input[name="st-dir"]').forEach(function (r) { r.checked = r.value === (BW.isRTL() ? 'rtl' : 'ltr'); });
  }
  $all('[data-pref]').forEach(function (input) {
    input.addEventListener('change', function () {
      state.prefs[input.getAttribute('data-pref')] = input.checked;
      save();
      toast('Preference saved');
    });
  });
  $all('input[name="st-theme"]').forEach(function (r) { r.addEventListener('change', function () { BW.applyTheme(r.value); }); });
  $all('input[name="st-dir"]').forEach(function (r) { r.addEventListener('change', function () { BW.applyDir(r.value); }); });

  /* ---------- Render everything ---------- */
  function renderAll() {
    renderShell();
    renderOverview();
    renderBookings();
    renderStatus();
    renderHistory();
    renderLoyalty();
    renderProfile();
    renderSettings();
  }

  /* ==========================================================================
     Navigation: views, sidebar, popovers
     ========================================================================== */
  var sidebar = $('#dash-sidebar');
  var sideOverlay = $('.side-overlay');
  var burger = $('.dash-burger');
  var mqMobile = window.matchMedia('(max-width: 1024px)');

  function openSidebar() {
    sidebar.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    sideOverlay.hidden = false;
    document.body.classList.add('nav-open');
    var current = sidebar.querySelector('[aria-current="page"]') || sidebar.querySelector('.side-link');
    setTimeout(function () { current.focus(); }, 50);
  }
  function closeSidebar(returnFocus) {
    if (!sidebar.classList.contains('open')) return;
    sidebar.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    sideOverlay.hidden = true;
    document.body.classList.remove('nav-open');
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', function () { sidebar.classList.contains('open') ? closeSidebar(true) : openSidebar(); });
  sideOverlay.addEventListener('click', function () { closeSidebar(true); });
  $('[data-side-close]').addEventListener('click', function () { closeSidebar(true); });
  sidebar.addEventListener('keydown', function (e) { if (sidebar.classList.contains('open')) BW.trapTab(e, sidebar); });
  var onBp = function (e) { if (!e.matches) closeSidebar(false); };
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBp); else if (mqMobile.addListener) mqMobile.addListener(onBp);

  function setPopover(btn, open) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) {
      var first = panel.querySelector('button, a');
      if (first) first.focus();
    }
  }
  function closePopovers(except) {
    $all('#notif-btn, #profile-btn').forEach(function (btn) {
      if (btn !== except && btn.getAttribute('aria-expanded') === 'true') setPopover(btn, false);
    });
  }
  $all('#notif-btn, #profile-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      closePopovers(btn);
      setPopover(btn, open);
    });
  });

  function showView(name, opts) {
    if (!VIEWS[name]) name = 'overview';
    ui.view = name;
    $all('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
    $all('.side-link[data-view]').forEach(function (b) {
      if (b.getAttribute('data-view') === name) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    $('#view-title').textContent = VIEWS[name][0];
    $('#view-sub').textContent = VIEWS[name][1];
    try { window.history.replaceState(null, '', '#' + name); } catch (e) { /* ignore */ }
    closeSidebar(false);
    closePopovers();
    if (name === 'overview') drawChart();
    window.scrollTo(0, 0);
    if (!opts || opts.focus !== false) $('#view-title').focus({ preventScroll: true });
  }

  function logout() {
    try { localStorage.removeItem(BW.KEYS.session); } catch (e) { /* ignore */ }
    window.location.href = 'signin.html';
  }

  /* ---------- One delegated click handler for the whole dashboard ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;

    var viewBtn = t.closest('[data-view]');
    if (viewBtn) { showView(viewBtn.getAttribute('data-view')); return; }
    var go = t.closest('[data-go]');
    if (go) { closeModal(); showView(go.getAttribute('data-go')); return; }
    if (t.closest('[data-logout]')) { logout(); return; }

    var notif = t.closest('[data-notif]');
    if (notif) {
      var n = state.notifications.filter(function (x) { return x.id === notif.getAttribute('data-notif'); })[0];
      if (n) { n.read = true; save(); renderShell(); $('#notif-btn').focus(); setPopover($('#notif-btn'), true); }
      return;
    }

    var modeBtn = t.closest('[data-chart-mode]');
    if (modeBtn) {
      ui.chartMode = modeBtn.getAttribute('data-chart-mode');
      $all('[data-chart-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === modeBtn)); });
      drawChart();
      return;
    }

    var act = t.closest('[data-action]');
    if (act) {
      var id = act.getAttribute('data-id');
      switch (act.getAttribute('data-action')) {
        case 'notif-read-all':
          state.notifications.forEach(function (x) { x.read = true; });
          save(); renderShell(); setPopover($('#notif-btn'), true); break;
        case 'notif-clear':
          state.notifications = [];
          save(); renderShell(); setPopover($('#notif-btn'), true); break;
        case 'checkin': checkIn(id); break;
        case 'booking-edit': editBooking(id); break;
        case 'booking-cancel':
          confirmBox({
            title: 'Cancel this booking?',
            text: 'Cancelling is free up to 2 hours before your slot. You can rebook it from the list any time.',
            ok: 'Cancel Booking',
            onOk: function () {
              var b = state.bookings.filter(function (x) { return x.id === id; })[0];
              if (!b) return;
              b.status = 'Cancelled';
              notify('Booking cancelled: ' + SERVICES[b.serviceId].name + ' on ' + fmtDate(b.date) + '.');
              commit();
              toast('Booking cancelled');
            }
          });
          break;
        case 'booking-delete':
          confirmBox({
            title: 'Delete this booking?',
            text: 'It will be removed from your list. This can’t be undone.',
            ok: 'Delete Booking',
            onOk: function () {
              state.bookings = state.bookings.filter(function (x) { return x.id !== id; });
              commit();
              toast('Booking deleted');
            }
          });
          break;
        case 'rebook': rebook(act.getAttribute('data-service'), act.getAttribute('data-vehicle')); break;
        case 'status-refresh': refreshStatus(); break;
        case 'pickup': confirmPickup(); break;
        case 'receipt': showReceipt(id); break;
        case 'rate': rateVisit(id, false); break;
        case 'history-delete':
          confirmBox({
            title: 'Delete this visit?',
            text: 'It disappears from your history and receipts. Points you already earned stay in your balance.',
            ok: 'Delete Visit',
            onOk: function () {
              state.history = state.history.filter(function (r) { return r.id !== id; });
              commit();
              toast('Visit removed from history');
            }
          });
          break;
        case 'redeem': redeem(id); break;
        case 'voucher-use':
          state.vouchers.forEach(function (v) { if (v.code === act.getAttribute('data-code')) v.status = 'Used'; });
          commit(); toast('Voucher marked as used'); break;
        case 'voucher-remove':
          state.vouchers = state.vouchers.filter(function (v) { return v.code !== act.getAttribute('data-code'); });
          commit(); toast('Voucher removed'); break;
        case 'toggle-activity':
          ui.showAllActivity = !ui.showAllActivity; renderLoyalty(); break;
        case 'vehicle-add': vehicleForm(null); break;
        case 'vehicle-edit': vehicleForm(vehicle(id)); break;
        case 'vehicle-delete': deleteVehicle(id); break;
        case 'reset-data':
          confirmBox({
            title: 'Reset demo data?',
            text: 'Bookings, history, points and vehicles go back to the sample set. Your sign-in stays the same.',
            ok: 'Reset Data',
            onOk: function () {
              state = seed();
              ui.showAllActivity = false;
              commit();
              showView('overview');
              toast('Demo data restored');
            }
          });
          break;
      }
      return;
    }

    // Outside click closes popovers
    if (!t.closest('.pop-wrap')) closePopovers();
  });

  // Add-on checkboxes and the message form live inside the re-rendered status view
  document.addEventListener('change', function (e) {
    var box = e.target.closest('[data-addon]');
    if (!box || !state.active) return;
    var id = box.getAttribute('data-addon');
    var list = state.active.addons;
    if (box.checked && list.indexOf(id) === -1) list.push(id);
    if (!box.checked) state.active.addons = list.filter(function (x) { return x !== id; });
    commit();
    var again = document.querySelector('[data-addon="' + id + '"]');
    if (again) again.focus();
    toast(box.checked ? 'Add-on added to this visit' : 'Add-on removed');
  });
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'msg-form') return;
    e.preventDefault();
    if (!state.active || !validate(e.target)) return;
    var textarea = $('#msg-text');
    state.active.messages.push({ from: 'you', text: textarea.value.trim(), at: new Date().toISOString() });
    textarea.value = '';
    save();
    renderMessages();
    // Simulated reply from the bay team
    setTimeout(function () {
      if (!state.active) return;
      state.active.messages.push({ from: 'bay', text: 'Got it, thanks! We’ve passed that to your technician.', at: new Date().toISOString() });
      notify(state.active.bay + ' replied to your message.');
      save();
      renderMessages();
      renderShell();
    }, 1400);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !modal.hidden) return;
    var openPop = $all('#notif-btn, #profile-btn').filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0];
    if (openPop) { setPopover(openPop, false); openPop.focus(); return; }
    closeSidebar(true);
  });

  // Redraw the chart when theme, direction or size changes
  document.addEventListener('bw:themechange', function () { drawChart(); renderSettings(); });
  document.addEventListener('bw:dirchange', function () { drawChart(); renderSettings(); });
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawChart, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawChart);

  // Links such as dashboard.html#loyalty, and the browser back button, switch views
  window.addEventListener('hashchange', function () {
    var name = (window.location.hash || '').replace('#', '');
    if (VIEWS[name] && name !== ui.view) showView(name);
  });

  /* ---------- Start ---------- */
  save();
  renderAll();
  showView((window.location.hash || '').replace('#', '') || 'overview', { focus: false });
})();
