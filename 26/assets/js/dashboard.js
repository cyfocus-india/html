/* ==========================================================================
   Marigold Grand — client dashboard (vanilla JavaScript)
   Depends on window.MG from main.js (venue data, pricing, storage helpers).
   1.  Session guard + state (seeded sample data, saved in localStorage)
   2.  Pricing, installments and status helpers
   3.  View switching, sidebar, popovers
   4.  Overview: stat cards, canvas chart, next payment, upcoming list
   5.  Availability calendar
   6.  Bookings: search, filter, add, edit, delete
   7.  Add-ons: catering + décor per booking
   8.  Payments: installments, record / edit / delete payments
   9.  Profile & settings
   10. Notifications, modals, toasts
   ========================================================================== */
(function () {
  'use strict';

  var MG = window.MG;
  if (!MG) return;
  var store = MG.store;
  var HALLS = MG.HALLS, MENUS = MG.MENUS, ADDONS = MG.ADDONS, EVENT_TYPES = MG.EVENT_TYPES;
  var fmt = MG.formatINR;

  /* ------------------------------------------------------------------
     1. Session guard + state
     ------------------------------------------------------------------ */
  var session = store.getJSON(MG.SESSION_KEY, null);
  if (!session || !session.email) {
    session = { name: 'Ananya Rao', email: 'ananya.rao@example.com', since: Date.now() };
    store.setJSON(MG.SESSION_KEY, session);
  }
  var DATA_KEY = 'mg-dash-' + session.email;

  var TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  var todayISO = MG.isoDate(TODAY);
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function shift(n) { return MG.isoDate(MG.addDays(TODAY, n)); }
  function plusDays(s, n) { return MG.isoDate(MG.addDays(parse(s), n)); }
  function fmtDate(s, opts) { return parse(s).toLocaleDateString('en-IN', opts || { day: 'numeric', month: 'short', year: 'numeric' }); }
  function daysUntil(s) { return Math.round((parse(s) - TODAY) / 86400000); }
  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function initials(name) {
    return (name || 'G').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  var SLOT_LABEL = { lunch: 'Lunch', dinner: 'Dinner' };
  var TYPE_SHORT = { wedding: 'Wedding', engagement: 'Engagement', birthday: 'Birthday', corporate: 'Corporate', babyshower: 'Shower', anniversary: 'Anniversary' };
  var STATUS_LABEL = { onhold: 'On hold', confirmed: 'Confirmed', completed: 'Completed' };

  var state;

  /* Seed realistic sample data relative to today, so it always looks current */
  function seed() {
    var s = {
      v: 1,
      seq: 100,
      profile: { name: session.name || 'Ananya Rao', email: session.email, phone: '+91 99001 23456', city: 'Bengaluru', contact: 'whatsapp' },
      settings: { email: true, whatsapp: true, digest: false },
      bookings: [
        { id: 'b1', title: "Ananya & Rohit's Wedding Reception", type: 'wedding', hallId: 'ballroom', date: shift(72), slot: 'dinner', guests: 650, menuId: 'veg-royal', addons: ['dosa', 'stage-grand', 'pyro', 'booth'], notes: 'Couple entry at 8 pm with cold pyros. Elders seated near the stage.', createdAt: shift(-40) },
        { id: 'b2', title: "Aarav's First Birthday", type: 'birthday', hallId: 'lotus', date: shift(24), slot: 'lunch', guests: 85, menuId: 'veg-classic', addons: ['kids-theme', 'dessert'], notes: 'Jungle theme. About 25 children under 10.', createdAt: shift(-30) },
        { id: 'b3', title: 'Rao Family Anniversary Dinner', type: 'anniversary', hallId: 'ember', date: shift(118), slot: 'dinner', guests: 28, menuId: 'nonveg-royal', addons: [], notes: "Parents' 35th anniversary. Violinist requested.", createdAt: shift(-2) },
        { id: 'b4', title: "Ananya & Rohit's Engagement", type: 'engagement', hallId: 'saffron', date: shift(-46), slot: 'dinner', guests: 220, menuId: 'veg-royal', addons: ['chaat', 'dj', 'stage-classic'], notes: '', createdAt: shift(-160) }
      ],
      payments: [],
      notifications: []
    };
    var byId = function (id) { return s.bookings.filter(function (b) { return b.id === id; })[0]; };
    var pay = function (bid, idx, date, method, ref) {
      var sch = schedule(byId(bid));
      s.payments.push({ id: 'p' + (++s.seq), bookingId: bid, amount: sch[idx].amount, date: date, method: method, ref: ref });
    };
    pay('b4', 0, shift(-158), 'UPI', 'UPI48213977');
    pay('b4', 1, shift(-78), 'Net banking', 'NBHDFC55120');
    pay('b4', 2, shift(-55), 'Bank transfer', 'NEFT90321');
    pay('b1', 0, shift(-38), 'Bank transfer', 'NEFT77410');
    pay('b2', 0, shift(-29), 'UPI', 'UPI30988121');
    pay('b2', 1, shift(-8), 'Credit card', 'CC4417X');
    s.notifications = [
      { id: 'n1', text: 'Your free hold on the Ember Room for the anniversary dinner ends tomorrow. Pay the advance to confirm it.', time: Date.now() - 2 * 3600e3, read: false },
      { id: 'n2', text: "The final installment for Aarav's First Birthday is due on " + fmtDate(plusDays(byId('b2').date, -7)) + '.', time: Date.now() - 26 * 3600e3, read: false },
      { id: 'n3', text: 'Menu tasting for the wedding reception is booked for Saturday at 12 pm. Up to six people can join.', time: Date.now() - 3 * 86400e3, read: true },
      { id: 'n4', text: 'Payment received for the wedding reception advance. Thank you!', time: Date.now() - 38 * 86400e3, read: true }
    ];
    return s;
  }

  function save() { store.setJSON(DATA_KEY, state); }
  function load() {
    var saved = store.getJSON(DATA_KEY, null);
    state = saved && saved.v === 1 ? saved : seed();
    if (session.name && session.isNew) {
      state.profile.name = session.name;
      session.isNew = false; store.setJSON(MG.SESSION_KEY, session);
    }
    save();
  }

  /* ------------------------------------------------------------------
     2. Pricing, installments and status helpers
     ------------------------------------------------------------------ */
  function totals(b) { return MG.costBreakdown({ hallId: b.hallId, slot: b.slot, guests: b.guests, menuId: b.menuId, addons: b.addons }); }

  /* 25% within the 72-hour hold, 50% thirty days before, 25% seven days before */
  function schedule(b) {
    var total = totals(b).total;
    var a1 = Math.round(total * 0.25), a2 = Math.round(total * 0.5), a3 = total - a1 - a2;
    var d1 = plusDays(b.createdAt, 3); if (d1 > b.date) d1 = b.date;
    var d2 = plusDays(b.date, -30); if (d2 < d1) d2 = d1;
    var d3 = plusDays(b.date, -7); if (d3 < d2) d3 = d2;
    return [
      { key: 'advance', label: 'Advance', pct: 25, amount: a1, due: d1 },
      { key: 'second', label: 'Second installment', pct: 50, amount: a2, due: d2 },
      { key: 'final', label: 'Final installment', pct: 25, amount: a3, due: d3 }
    ];
  }
  function paidFor(id) { return state.payments.filter(function (p) { return p.bookingId === id; }).reduce(function (s, p) { return s + p.amount; }, 0); }
  function installments(b) {
    var paid = paidFor(b.id), cum = 0, foundNext = false;
    return schedule(b).map(function (i) {
      cum += i.amount;
      var covered = paid >= cum;
      var remaining = covered ? 0 : Math.min(i.amount, cum - paid);
      var status = covered ? 'paid' : (i.due < todayISO ? 'overdue' : (!foundNext ? 'due' : 'upcoming'));
      if (!covered && !foundNext) { i.isNext = true; foundNext = true; }
      i.status = status; i.remaining = remaining;
      return i;
    });
  }
  function bookingStatus(b) {
    if (b.date < todayISO) return 'completed';
    return paidFor(b.id) >= schedule(b)[0].amount ? 'confirmed' : 'onhold';
  }
  function balance(b) { return Math.max(0, totals(b).total - paidFor(b.id)); }
  function getBooking(id) { return state.bookings.filter(function (b) { return b.id === id; })[0]; }
  function upcoming() { return state.bookings.filter(function (b) { return b.date >= todayISO; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }); }
  function nextInstallment() {
    var list = [];
    upcoming().forEach(function (b) { installments(b).forEach(function (i) { if (i.isNext) list.push({ b: b, i: i }); }); });
    list.sort(function (x, y) { return x.i.due < y.i.due ? -1 : 1; });
    return list[0] || null;
  }

  /* Other clients' bookings: deterministic per hall/date/slot so the calendar is stable */
  function hashStr(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
  function takenByOthers(hallId, date, slot) {
    var d = parse(date).getDay();
    var weekend = d === 0 || d === 5 || d === 6;
    var base = { ballroom: 34, saffron: 26, jasmine: 22, lotus: 20, ember: 16 }[hallId] || 20;
    var p = base + (weekend ? 32 : 0) + (slot === 'dinner' ? 10 : 0);
    return hashStr(hallId + date + slot) % 100 < p;
  }
  function yourBookingAt(hallId, date, slot, exceptId) {
    return state.bookings.filter(function (b) { return b.hallId === hallId && b.date === date && b.slot === slot && b.id !== exceptId; })[0];
  }
  function slotState(hallId, date, slot) {
    var mine = yourBookingAt(hallId, date, slot);
    if (mine) return { kind: 'yours', booking: mine };
    if (date <= todayISO) return { kind: 'past' };
    return takenByOthers(hallId, date, slot) ? { kind: 'booked' } : { kind: 'free' };
  }

  /* ------------------------------------------------------------------
     3. View switching, sidebar and popovers
     ------------------------------------------------------------------ */
  var VIEWS = {
    overview: ['Overview', 'Your events at a glance'],
    availability: ['Availability', 'Check open lunch and dinner slots for each hall'],
    bookings: ['Bookings', 'Add, edit and track every event you have with us'],
    addons: ['Add-ons', 'Choose catering counters and décor for each booking'],
    payments: ['Payments', 'Installments, balances and your payment history'],
    profile: ['Profile & settings', 'Your details, display options and reminders']
  };
  var currentView = 'overview';
  var $ = function (id) { return document.getElementById(id); };
  var sidebar = $('dashSidebar'), overlay = $('dashOverlay'), burger = document.querySelector('.dash-burger');

  function setView(name, focusTitle) {
    if (!VIEWS[name]) name = 'overview';
    currentView = name;
    Object.keys(VIEWS).forEach(function (v) { $('view-' + v).hidden = v !== name; });
    document.querySelectorAll('.side-link').forEach(function (l) {
      var on = l.dataset.view === name;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
    $('viewTitle').textContent = VIEWS[name][0];
    $('viewSub').textContent = VIEWS[name][1];
    document.title = VIEWS[name][0] + ' | Dashboard | Marigold Grand Banquets';
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    render(name);
    closeSidebar(false);
    closePops();
    if (focusTitle) $('viewTitle').focus();
    window.scrollTo(0, 0);
  }

  function openSidebar() {
    sidebar.classList.add('is-open'); overlay.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close dashboard menu');
    document.body.classList.add('dash-locked');
    var first = sidebar.querySelector('.side-link'); if (first) first.focus();
  }
  function closeSidebar(returnFocus) {
    if (!sidebar.classList.contains('is-open')) return;
    sidebar.classList.remove('is-open'); overlay.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open dashboard menu');
    document.body.classList.remove('dash-locked');
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', function () { if (sidebar.classList.contains('is-open')) closeSidebar(true); else openSidebar(); });
  overlay.addEventListener('click', function () { closeSidebar(true); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) closeSidebar(false); drawChart(); });

  /* Any element with data-view switches view; data-action triggers shortcuts */
  document.addEventListener('click', function (e) {
    var v = e.target.closest('[data-view]');
    if (v) { e.preventDefault(); setView(v.dataset.view, true); return; }
    var a = e.target.closest('[data-action]');
    if (a && a.dataset.action === 'new-booking') openBookingModal();
    if (e.target.closest('[data-logout]')) logout();
  });

  /* Popovers (notifications + profile menu) */
  var pops = [['notifBtn', 'notifPanel'], ['profileBtn', 'profileMenu']];
  function closePops(except) {
    pops.forEach(function (p) {
      if (p[0] === except) return;
      $(p[1]).hidden = true; $(p[0]).setAttribute('aria-expanded', 'false');
    });
  }
  pops.forEach(function (p) {
    $(p[0]).addEventListener('click', function () {
      var open = $(p[1]).hidden;
      closePops(p[0]);
      $(p[1]).hidden = !open; $(p[0]).setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.pop-wrap')) closePops(); });

  /* Escape closes the top-most layer */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (openModal) { closeModal(); return; }
    var openPop = pops.filter(function (p) { return !$(p[1]).hidden; })[0];
    if (openPop) { closePops(); $(openPop[0]).focus(); return; }
    closeSidebar(true);
  });
  /* Keep focus inside the mobile sidebar while it is open */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !sidebar.classList.contains('is-open') || openModal) return;
    var f = [burger].concat(Array.prototype.slice.call(sidebar.querySelectorAll('a[href], button')).filter(function (el) { return el.offsetParent !== null; }));
    var i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  });

  function logout() {
    store.remove(MG.SESSION_KEY);
    window.location.href = 'signin.html';
  }

  /* ------------------------------------------------------------------
     Render dispatcher
     ------------------------------------------------------------------ */
  function render(view) {
    renderChrome();
    var v = view || currentView;
    if (v === 'overview') renderOverview();
    if (v === 'availability') renderAvailability();
    if (v === 'bookings') renderBookings();
    if (v === 'addons') renderAddons();
    if (v === 'payments') renderPayments();
    if (v === 'profile') renderProfile();
  }

  function renderChrome() {
    var p = state.profile;
    $('topAvatar').textContent = initials(p.name);
    $('topName').textContent = p.name;
    $('menuName').textContent = p.name;
    $('menuEmail').textContent = p.email;
    document.querySelector('[data-count="bookings"]').textContent = state.bookings.length;
    var overdue = upcoming().filter(function (b) { return installments(b).some(function (i) { return i.status === 'overdue'; }); }).length;
    var dueEl = document.querySelector('[data-count="due"]');
    dueEl.hidden = overdue === 0; dueEl.textContent = overdue;
    dueEl.setAttribute('aria-label', overdue + ' overdue');
    renderNotifications();
  }

  /* ------------------------------------------------------------------
     4. Overview
     ------------------------------------------------------------------ */
  function renderOverview() {
    var up = upcoming();
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    $('welcomeTitle').textContent = greet + ', ' + state.profile.name.split(' ')[0];
    if (up.length) {
      var n = up[0], d = daysUntil(n.date);
      $('welcomeText').textContent = n.title + ' is ' + (d === 0 ? 'today' : d === 1 ? 'tomorrow' : 'in ' + d + ' days') + ' at ' + MG.findHall(n.hallId).name + '.';
    } else {
      $('welcomeText').textContent = 'No upcoming events yet. Check availability to hold your first date.';
    }

    var billed = state.bookings.reduce(function (s, b) { return s + totals(b).total; }, 0);
    var paid = state.payments.reduce(function (s, p) { return s + p.amount; }, 0);
    var bal = state.bookings.reduce(function (s, b) { return s + balance(b); }, 0);
    var guests = up.reduce(function (s, b) { return s + Number(b.guests); }, 0);
    var nx = nextInstallment();
    var set = function (k, v) { document.querySelector('[data-stat="' + k + '"]').textContent = v; };
    set('upcoming', up.length);
    set('upcomingSub', up.length ? 'Next on ' + fmtDate(up[0].date, { day: 'numeric', month: 'short' }) : 'Nothing scheduled');
    set('guests', guests.toLocaleString('en-IN'));
    set('guestsSub', 'Across ' + up.length + ' upcoming event' + (up.length === 1 ? '' : 's'));
    set('paid', fmt(paid));
    set('paidSub', billed ? Math.round(paid / billed * 100) + '% of ' + fmt(billed) + ' billed' : 'No bills yet');
    set('balance', fmt(bal));
    set('balanceSub', nx ? 'Next: ' + fmt(nx.i.remaining) + ' by ' + fmtDate(nx.i.due, { day: 'numeric', month: 'short' }) : 'All paid up');

    /* Next installment card */
    var np = $('nextPay');
    if (nx) {
      var t = totals(nx.b).total, pd = paidFor(nx.b.id), dd = daysUntil(nx.i.due);
      np.innerHTML = '<h2>Next installment</h2>' +
        '<p class="next-meta">' + esc(nx.b.title) + ' · ' + esc(nx.i.label) + ' (' + nx.i.pct + '%)</p>' +
        '<p class="next-amount">' + fmt(nx.i.remaining) + '</p>' +
        '<p class="next-meta">' + (dd < 0 ? '<span class="badge badge--overdue">Overdue by ' + Math.abs(dd) + ' day' + (Math.abs(dd) === 1 ? '' : 's') + '</span>' : 'Due ' + fmtDate(nx.i.due) + ' · ' + (dd === 0 ? 'today' : 'in ' + dd + ' day' + (dd === 1 ? '' : 's'))) + '</p>' +
        '<div class="progress" role="progressbar" aria-label="Paid for this booking" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pd / t * 100) + '"><span style="width:' + Math.min(100, pd / t * 100) + '%"></span></div>' +
        '<p class="next-meta">' + fmt(pd) + ' of ' + fmt(t) + ' paid for this booking</p>' +
        '<button class="btn" type="button" data-pay="' + nx.b.id + '">Pay ' + fmt(nx.i.remaining) + '</button>';
    } else {
      np.innerHTML = '<h2>Next installment</h2><p class="next-amount">₹0</p><p class="next-meta">You\'re all paid up. New installments appear here as soon as you book.</p><button class="btn" type="button" data-view="payments">View Payments</button>';
    }

    /* Upcoming list */
    var ul = $('upcomingList');
    ul.innerHTML = up.length ? up.slice(0, 3).map(function (b) {
      var st = bookingStatus(b), hall = MG.findHall(b.hallId), dt = parse(b.date);
      return '<li class="event-item">' +
        '<span class="date-block" aria-hidden="true"><b>' + dt.getDate() + '</b><span>' + dt.toLocaleDateString('en-IN', { month: 'short' }) + '</span></span>' +
        '<div><h3>' + esc(b.title) + '</h3><p>' + fmtDate(b.date, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + hall.name + ' · ' + SLOT_LABEL[b.slot] + ' · ' + b.guests + ' guests</p></div>' +
        '<div class="event-side"><span class="badge badge--' + st + '">' + STATUS_LABEL[st] + '</span><button class="text-btn" type="button" data-edit="' + b.id + '">Edit</button></div>' +
        '</li>';
    }).join('') : '<li class="empty"><p>No upcoming events.</p><button class="btn" type="button" data-action="new-booking">New Booking</button></li>';

    drawChart();
  }

  /* Canvas bar chart: paid vs balance per booking (theme-aware) */
  function drawChart() {
    var canvas = $('payChart');
    if (!canvas || currentView !== 'overview') return;
    var box = canvas.parentElement;
    var w = box.clientWidth, h = box.clientHeight;
    if (!w) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var cs = getComputedStyle(document.documentElement);
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var cPaid = cs.getPropertyValue('--gold').trim() || '#f2a51a';
    var cDue = dark ? '#b46aa3' : '#8e3d7c';
    var cText = cs.getPropertyValue('--muted').trim();
    var cGrid = cs.getPropertyValue('--border').trim();
    var rtl = document.documentElement.getAttribute('dir') === 'rtl';

    var data = state.bookings.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).map(function (b) {
      var t = totals(b).total, p = Math.min(paidFor(b.id), t);
      return { label: b.title, short: TYPE_SHORT[b.type], month: parse(b.date).toLocaleDateString('en-IN', { month: 'short' }), paid: p, due: t - p };
    });
    $('chartSummary').textContent = data.map(function (d) { return d.label + ': ' + fmt(d.paid) + ' paid, ' + fmt(d.due) + ' balance'; }).join('. ');
    if (!data.length) {
      ctx.fillStyle = cText; ctx.font = '15px Jost, system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Add a booking to see your payments here', w / 2, h / 2);
      return;
    }
    /* Nice axis: tick of 1/2/2.5/5 × 10^n, about four gridlines */
    var max = Math.max.apply(null, data.map(function (d) { return d.paid + d.due; })) || 1;
    var raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var tick = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).filter(function (v) { return v >= raw; })[0];
    var lines = Math.ceil(max / tick), top = tick * lines;
    var padL = 56, padR = 12, padT = 12, padB = 46;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var axisX = rtl ? w - padL : padL;

    ctx.font = '12px Jost, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    var short = function (v) { return v === 0 ? '₹0' : v >= 1e5 ? '₹' + (v / 1e5).toFixed(v % 1e5 ? 1 : 0) + 'L' : '₹' + Math.round(v / 1e3) + 'k'; };
    for (var g = 0; g <= lines; g++) {
      var val = tick * g, y = padT + plotH - plotH * g / lines;
      ctx.strokeStyle = cGrid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rtl ? padR : padL, y); ctx.lineTo(rtl ? w - padL : w - padR, y); ctx.stroke();
      ctx.fillStyle = cText; ctx.textAlign = rtl ? 'left' : 'right';
      ctx.fillText(short(val), rtl ? axisX + 8 : axisX - 8, y);
    }
    var slotW = plotW / data.length;
    var barW = Math.min(56, slotW * 0.5);
    data.forEach(function (d, i) {
      var idx = rtl ? data.length - 1 - i : i;
      var cx = (rtl ? padR : padL) + slotW * idx + slotW / 2;
      var hPaid = plotH * d.paid / top, hDue = plotH * d.due / top;
      var base = padT + plotH;
      ctx.fillStyle = cPaid;
      roundRect(ctx, cx - barW / 2, base - hPaid, barW, hPaid, hDue > 0 ? 0 : 6);
      if (hDue > 0) { ctx.fillStyle = cDue; roundRect(ctx, cx - barW / 2, base - hPaid - hDue, barW, hDue, 6); }
      ctx.fillStyle = cText; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      var lbl = d.short + ' · ' + d.month;
      if (ctx.measureText(lbl).width > slotW - 6) lbl = d.short;
      ctx.fillText(lbl, cx, base + 10);
      ctx.textBaseline = 'middle';
    });
  }
  /* Bar with rounded top corners only */
  function roundRect(ctx, x, y, w, h, r) {
    if (h <= 0) return;
    r = Math.min(r, h, w / 2);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath(); ctx.fill();
  }
  document.addEventListener('mg:themechange', function () { if (state) drawChart(); });
  document.addEventListener('mg:dirchange', function () { if (state) drawChart(); });

  /* ------------------------------------------------------------------
     5. Availability calendar
     ------------------------------------------------------------------ */
  var calHall = 'ballroom';
  var calMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  var maxMonth = new Date(TODAY.getFullYear(), TODAY.getMonth() + 18, 1);

  $('calHall').innerHTML = HALLS.map(function (h) { return '<option value="' + h.id + '">' + h.name + ' (' + h.min + '–' + h.max + ')</option>'; }).join('');
  $('calHall').addEventListener('change', function () { calHall = this.value; renderAvailability(); });
  $('calPrev').addEventListener('click', function () { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1); renderAvailability(); });
  $('calNext').addEventListener('click', function () { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1); renderAvailability(); });

  function renderAvailability() {
    $('calHall').value = calHall;
    var y = calMonth.getFullYear(), m = calMonth.getMonth();
    $('calMonth').textContent = calMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    $('calPrev').disabled = y === TODAY.getFullYear() && m === TODAY.getMonth();
    $('calNext').disabled = calMonth >= maxMonth;

    var html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (d) { return '<div class="cal-dow" role="columnheader">' + d + '</div>'; }).join('');
    var first = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < first; i++) html += '<div class="cal-day is-empty" aria-hidden="true"></div>';
    var free = 0, total = 0;
    for (var d = 1; d <= days; d++) {
      var iso = MG.isoDate(new Date(y, m, d));
      var past = iso <= todayISO;
      var cls = 'cal-day' + (past ? ' is-past' : '') + (iso === todayISO ? ' is-today' : '');
      html += '<div class="' + cls + '" role="gridcell"><span class="cal-num">' + d + '</span>';
      ['lunch', 'dinner'].forEach(function (slot) {
        var st = slotState(calHall, iso, slot);
        if (!past) { total++; if (st.kind === 'free') free++; }
        var letter = slot === 'lunch' ? 'L' : 'D';
        var word = { free: 'open', booked: 'taken', yours: 'yours', past: '' }[st.kind];
        var label = SLOT_LABEL[slot] + ' on ' + fmtDate(iso, { weekday: 'long', day: 'numeric', month: 'long' }) + ': ' +
          (st.kind === 'free' ? 'available, select to book' : st.kind === 'booked' ? 'booked by another client' : st.kind === 'yours' ? 'your booking, ' + st.booking.title : 'past date');
        var attrs = st.kind === 'free' ? ' data-book="' + iso + '|' + slot + '"' : st.kind === 'yours' ? ' data-edit="' + st.booking.id + '"' : ' disabled';
        html += '<button class="slot-btn ' + st.kind + '" type="button"' + attrs + ' aria-label="' + esc(label) + '">' + letter + (word ? ' <small>' + word + '</small>' : '') + '</button>';
      });
      html += '</div>';
    }
    $('calendar').innerHTML = html;

    var h = MG.findHall(calHall);
    $('hallSide').innerHTML =
      '<img src="../assets/images/' + h.img + '" alt="' + esc(h.alt) + '" width="1000" height="700">' +
      '<div><h2>' + h.name + '</h2><p>' + esc(h.why) + '</p>' +
      '<ul class="kv"><li><span>Guests</span><span>' + h.min + '–' + h.max + '</span></li>' +
      '<li><span>Banquet seating</span><span>' + h.seated + '</span></li>' +
      '<li><span>Lunch slot</span><span>' + fmt(h.slot.lunch) + '</span></li>' +
      '<li><span>Dinner slot</span><span>' + fmt(h.slot.dinner) + '</span></li>' +
      '<li><span>Minimum plates</span><span>' + h.min + '</span></li></ul>' +
      '<p class="month-stat"><strong>' + free + ' of ' + total + '</strong> slots still open in ' + calMonth.toLocaleDateString('en-IN', { month: 'long' }) + '. Weekend dinners go first.</p></div>';
  }

  /* ------------------------------------------------------------------
     6. Bookings
     ------------------------------------------------------------------ */
  $('bkHall').innerHTML += HALLS.map(function (h) { return '<option value="' + h.id + '">' + h.name + '</option>'; }).join('');
  ['bkSearch', 'bkStatus', 'bkHall'].forEach(function (id) { $(id).addEventListener('input', renderBookings); });
  $('bkClear').addEventListener('click', function () { $('bkSearch').value = ''; $('bkStatus').value = 'all'; $('bkHall').value = 'all'; renderBookings(); });

  function renderBookings() {
    var q = $('bkSearch').value.trim().toLowerCase();
    var st = $('bkStatus').value, hall = $('bkHall').value;
    var list = state.bookings.slice().sort(function (a, b) {
      var ca = a.date < todayISO, cb = b.date < todayISO;
      if (ca !== cb) return ca ? 1 : -1;
      return ca ? (a.date < b.date ? 1 : -1) : (a.date < b.date ? -1 : 1);
    }).filter(function (b) {
      var h = MG.findHall(b.hallId);
      var text = (b.title + ' ' + h.name + ' ' + EVENT_TYPES[b.type]).toLowerCase();
      return (!q || text.indexOf(q) > -1) && (st === 'all' || bookingStatus(b) === st) && (hall === 'all' || b.hallId === hall);
    });
    $('bkCount').textContent = 'Showing ' + list.length + ' of ' + state.bookings.length + ' bookings';
    $('bkEmpty').hidden = list.length > 0;
    $('bkTable').hidden = list.length === 0;
    $('bkBody').innerHTML = list.map(function (b) {
      var s = bookingStatus(b), h = MG.findHall(b.hallId), t = totals(b);
      return '<tr>' +
        '<td class="td-main"><span class="cell-title">' + esc(b.title) + '</span><span class="cell-sub">' + EVENT_TYPES[b.type] + ' · ' + MG.findMenu(b.menuId).name + '</span></td>' +
        '<td data-label="Date"><span>' + fmtDate(b.date) + '<span class="cell-sub">' + SLOT_LABEL[b.slot] + '</span></span></td>' +
        '<td data-label="Hall">' + h.name + '</td>' +
        '<td data-label="Guests">' + b.guests + '</td>' +
        '<td data-label="Total"><span>' + fmt(t.total) + '<span class="cell-sub">' + fmt(balance(b)) + ' due</span></span></td>' +
        '<td data-label="Status"><span class="badge badge--' + s + '">' + STATUS_LABEL[s] + '</span></td>' +
        '<td data-label="Actions"><div class="row-actions">' +
          '<button class="text-btn" type="button" data-edit="' + b.id + '" aria-label="Edit ' + esc(b.title) + '">Edit</button>' +
          '<button class="text-btn" type="button" data-delete="' + b.id + '" aria-label="Delete ' + esc(b.title) + '">Delete</button>' +
        '</div></td></tr>';
    }).join('');
  }

  /* Booking modal: add + edit */
  var editingId = null;
  $('bmType').innerHTML = Object.keys(EVENT_TYPES).map(function (k) { return '<option value="' + k + '">' + EVENT_TYPES[k] + '</option>'; }).join('');
  $('bmHall').innerHTML = HALLS.map(function (h) { return '<option value="' + h.id + '">' + h.name + ' (' + h.min + '–' + h.max + ')</option>'; }).join('');
  $('bmMenu').innerHTML = MENUS.map(function (m) { return '<option value="' + m.id + '">' + m.name + ' · ' + fmt(m.price) + '/plate</option>'; }).join('');

  function openBookingModal(id, preset) {
    editingId = id || null;
    var f = $('bookingForm'); f.reset();
    f.querySelectorAll('.field').forEach(function (fl) { fl.classList.remove('has-error'); var m = fl.querySelector('.error-msg'); if (m) m.textContent = ''; });
    var b = id ? getBooking(id) : null;
    $('bmTitle').textContent = b ? 'Edit booking' : 'New booking';
    $('bmSubmit').textContent = b ? 'Save Changes' : 'Hold This Date';
    $('bmDate').min = b && b.date < todayISO ? '' : shift(1);
    $('bmName').value = b ? b.title : '';
    $('bmHall').value = b ? b.hallId : (preset && preset.hall) || 'lotus';
    /* New bookings default to the occasion the chosen hall is best known for */
    $('bmType').value = b ? b.type : { ballroom: 'wedding', saffron: 'engagement', jasmine: 'engagement', lotus: 'birthday', ember: 'anniversary' }[$('bmHall').value];
    $('bmDate').value = b ? b.date : (preset && preset.date) || '';
    $('bmSlot').value = b ? b.slot : (preset && preset.slot) || 'dinner';
    var hall = MG.findHall($('bmHall').value);
    $('bmGuests').value = b ? b.guests : Math.round((hall.min + hall.max) / 2 / 5) * 5;
    $('bmMenu').value = b ? b.menuId : 'veg-classic';
    $('bmNotes').value = b ? b.notes || '' : '';
    updateEstimate();
    showModal('bookingModal', $('bmName'));
  }
  function updateEstimate() {
    var t = MG.costBreakdown({ hallId: $('bmHall').value, slot: $('bmSlot').value, guests: $('bmGuests').value, menuId: $('bmMenu').value, addons: editingId ? getBooking(editingId).addons : [] });
    $('bmEstimate').innerHTML = t ? 'Estimated total <strong>' + fmt(t.total) + '</strong> incl. GST · advance of ' + fmt(Math.round(t.total * 0.25)) + ' confirms the date.' : '';
  }
  ['bmHall', 'bmSlot', 'bmGuests', 'bmMenu'].forEach(function (id) { $(id).addEventListener('input', updateEstimate); });

  $('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var err = MG.setError, ok = true;
    var name = $('bmName').value.trim(), hallId = $('bmHall').value, date = $('bmDate').value, slot = $('bmSlot').value;
    var guests = Number($('bmGuests').value), hall = MG.findHall(hallId);
    var existing = editingId ? getBooking(editingId) : null;
    var check = function (el, msg) { err(el, msg); if (msg) ok = false; };
    check($('bmName'), name.length < 3 ? 'Give the event a name (3+ characters).' : '');
    var dateMsg = !date ? 'Pick a date.' : '';
    if (!dateMsg && (!existing || date !== existing.date) && date <= todayISO) dateMsg = 'Choose a date from tomorrow onwards.';
    check($('bmDate'), dateMsg);
    check($('bmGuests'), !guests || guests < 15 ? 'Enter at least 15 guests.' : guests > hall.max ? hall.name + ' holds up to ' + hall.max + ' guests.' : '');
    var slotMsg = '';
    if (date && !dateMsg) {
      var changed = !existing || existing.date !== date || existing.slot !== slot || existing.hallId !== hallId;
      if (yourBookingAt(hallId, date, slot, editingId)) slotMsg = 'You already have this hall booked for that slot.';
      else if (changed && takenByOthers(hallId, date, slot)) slotMsg = 'That slot is already booked. Try the other slot or another date.';
    }
    check($('bmSlot'), slotMsg);
    if (!ok) { var bad = $('bookingForm').querySelector('.has-error .input'); if (bad) bad.focus(); return; }

    var data = { title: name, type: $('bmType').value, hallId: hallId, date: date, slot: slot, guests: guests, menuId: $('bmMenu').value, notes: $('bmNotes').value.trim() };
    if (existing) {
      Object.keys(data).forEach(function (k) { existing[k] = data[k]; });
      if (existing.hallId !== 'jasmine') existing.addons = existing.addons.filter(function (a) { return a !== 'hanger'; });
      notify('Booking updated: ' + name + ' on ' + fmtDate(date) + '.');
      toast('<b>Saved.</b> ' + esc(name) + ' has been updated.');
    } else {
      data.id = 'b' + (++state.seq); data.addons = []; data.createdAt = todayISO;
      state.bookings.push(data);
      notify('Date held: ' + hall.name + ', ' + SLOT_LABEL[slot].toLowerCase() + ' on ' + fmtDate(date) + '. Pay the advance within 72 hours to confirm.');
      toast('<b>Date held for 72 hours.</b> ' + esc(name) + ' is in your bookings.');
    }
    save(); closeModal(); render();
  });

  /* Edit / delete / quick-book delegation */
  document.addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit]');
    if (ed) { openBookingModal(ed.dataset.edit); return; }
    var bk = e.target.closest('[data-book]');
    if (bk) { var p = bk.dataset.book.split('|'); openBookingModal(null, { hall: calHall, date: p[0], slot: p[1] }); return; }
    var del = e.target.closest('[data-delete]');
    if (del) {
      var b = getBooking(del.dataset.delete);
      var n = state.payments.filter(function (p) { return p.bookingId === b.id; }).length;
      confirmBox('Delete this booking?', '“' + b.title + '” on ' + fmtDate(b.date) + ' will be removed' + (n ? ', along with ' + n + ' payment record' + (n === 1 ? '' : 's') : '') + '. This can’t be undone.', 'Delete Booking', function () {
        state.bookings = state.bookings.filter(function (x) { return x.id !== b.id; });
        state.payments = state.payments.filter(function (x) { return x.bookingId !== b.id; });
        notify('Booking deleted: ' + b.title + '.');
        save(); render(); toast('<b>Deleted.</b> ' + esc(b.title) + ' was removed.');
      });
      return;
    }
    var pay = e.target.closest('[data-pay]');
    if (pay) openPaymentModal(pay.dataset.pay);
    var pe = e.target.closest('[data-pay-edit]');
    if (pe) openPaymentModal(null, pe.dataset.payEdit);
    var pd = e.target.closest('[data-pay-delete]');
    if (pd) {
      var pm = state.payments.filter(function (x) { return x.id === pd.dataset.payDelete; })[0];
      var bb = getBooking(pm.bookingId);
      confirmBox('Delete this payment record?', fmt(pm.amount) + ' paid on ' + fmtDate(pm.date) + ' for “' + bb.title + '” will be removed and the balance will go back up.', 'Delete Payment', function () {
        state.payments = state.payments.filter(function (x) { return x.id !== pm.id; });
        notify('Payment record of ' + fmt(pm.amount) + ' deleted for ' + bb.title + '.');
        save(); render(); toast('<b>Payment removed.</b> Balance updated.');
      });
    }
  });

  /* ------------------------------------------------------------------
     7. Add-ons
     ------------------------------------------------------------------ */
  var adBooking = null;
  $('adMenu').innerHTML = MENUS.map(function (m) { return '<option value="' + m.id + '">' + m.name + ' · ' + fmt(m.price) + '/plate</option>'; }).join('');
  $('adBooking').addEventListener('change', function () { adBooking = this.value; renderAddons(); });
  $('adMenu').addEventListener('change', function () {
    var b = getBooking(adBooking); if (!b) return;
    b.menuId = this.value; save();
    notify('Menu changed to ' + MG.findMenu(b.menuId).name + ' for ' + b.title + '.');
    toast('<b>Menu updated.</b> ' + MG.findMenu(b.menuId).name + ' for ' + esc(b.title) + '.');
    render();
  });

  function renderAddons() {
    var list = upcoming();
    var empty = list.length === 0;
    $('adEmpty').hidden = !empty;
    ['adCatering', 'adDecor'].forEach(function (id) { $(id).closest('.panel').hidden = empty; });
    $('adBooking').closest('.panel').hidden = empty;
    $('adSummary').hidden = empty;
    if (empty) return;
    if (!adBooking || !list.some(function (b) { return b.id === adBooking; })) adBooking = list[0].id;
    $('adBooking').innerHTML = list.map(function (b) { return '<option value="' + b.id + '"' + (b.id === adBooking ? ' selected' : '') + '>' + esc(b.title) + ' · ' + fmtDate(b.date, { day: 'numeric', month: 'short' }) + '</option>'; }).join('');
    var b = getBooking(adBooking), t = totals(b);
    $('adMenu').value = b.menuId;
    $('adInfo').textContent = MG.findHall(b.hallId).name + ' · ' + SLOT_LABEL[b.slot] + ' · ' + b.guests + ' guests (billed for ' + t.plates + ' plates)';

    var card = function (a) {
      var on = b.addons.indexOf(a.id) > -1;
      var blocked = a.id === 'hanger' && b.hallId !== 'jasmine';
      var cost = a.unit === 'guest' ? a.price * t.plates : a.price;
      return '<label class="addon-card' + (on ? ' is-on' : '') + (blocked ? ' is-disabled' : '') + '">' +
        '<input type="checkbox" data-addon="' + a.id + '"' + (on ? ' checked' : '') + (blocked ? ' disabled' : '') + '>' +
        '<strong>' + esc(a.name) + '</strong>' +
        '<span>' + fmt(a.price) + (a.unit === 'guest' ? ' per guest' : ' per event') + '</span>' +
        '<span class="addon-cost">' + (blocked ? 'Jasmine Lawn only' : fmt(cost) + ' for this event') + '</span></label>';
    };
    $('adCatering').innerHTML = ADDONS.filter(function (a) { return a.group === 'catering'; }).map(card).join('');
    $('adDecor').innerHTML = ADDONS.filter(function (a) { return a.group === 'decor'; }).map(card).join('');

    var paid = paidFor(b.id);
    $('adSummary').innerHTML = '<h2>Booking total</h2>' +
      '<ul class="sum-lines">' +
      '<li><span>Hall slot</span><span>' + fmt(t.hallCost) + '</span></li>' +
      '<li><span>Catering (' + t.plates + ' × ' + fmt(t.menu.price) + ')</span><span>' + fmt(t.catering) + '</span></li>' +
      '<li><span>Add-ons (' + b.addons.length + ')</span><span>' + fmt(t.addonCost) + '</span></li>' +
      '<li><span>GST at 18%</span><span>' + fmt(t.gst) + '</span></li></ul>' +
      '<div class="sum-total"><span>Total</span><strong>' + fmt(t.total) + '</strong></div>' +
      '<ul class="sum-lines"><li><span>Paid so far</span><span>' + fmt(paid) + '</span></li><li><span>Balance</span><span>' + fmt(Math.max(0, t.total - paid)) + '</span></li></ul>' +
      (b.addons.length ? '<div class="sum-chosen">' + b.addons.map(function (id) { return '<span class="tag">' + esc(MG.findAddon(id).name) + '</span>'; }).join('') + '</div>' : '<p class="muted">No add-ons chosen yet.</p>') +
      '<button class="btn btn--block sum-cta" type="button" data-view="payments">View Installments</button>';
  }
  document.addEventListener('change', function (e) {
    var cb = e.target.closest('[data-addon]');
    if (!cb) return;
    var b = getBooking(adBooking), a = MG.findAddon(cb.dataset.addon);
    if (cb.checked) { if (b.addons.indexOf(a.id) < 0) b.addons.push(a.id); }
    else b.addons = b.addons.filter(function (x) { return x !== a.id; });
    save();
    notify((cb.checked ? 'Added ' : 'Removed ') + a.name + (cb.checked ? ' to ' : ' from ') + b.title + '.');
    toast('<b>' + (cb.checked ? 'Added' : 'Removed') + ':</b> ' + esc(a.name) + '. New total ' + fmt(totals(b).total) + '.');
    render();
  });

  /* ------------------------------------------------------------------
     8. Payments
     ------------------------------------------------------------------ */
  function renderPayments() {
    var billed = state.bookings.reduce(function (s, b) { return s + totals(b).total; }, 0);
    var paid = state.payments.reduce(function (s, p) { return s + p.amount; }, 0);
    var bal = state.bookings.reduce(function (s, b) { return s + balance(b); }, 0);
    var nx = nextInstallment();
    $('payStats').innerHTML =
      '<div class="mini-stat"><p>Total billed</p><strong>' + fmt(billed) + '</strong></div>' +
      '<div class="mini-stat"><p>Paid</p><strong>' + fmt(paid) + '</strong></div>' +
      '<div class="mini-stat"><p>Balance</p><strong>' + fmt(bal) + '</strong></div>' +
      '<div class="mini-stat"><p>Next due</p><strong>' + (nx ? fmtDate(nx.i.due, { day: 'numeric', month: 'short' }) : 'None') + '</strong></div>';

    var ordered = upcoming().concat(state.bookings.filter(function (b) { return b.date < todayISO; }));
    $('payCards').innerHTML = ordered.map(function (b) {
      var t = totals(b).total, pd = Math.min(paidFor(b.id), t), pct = t ? Math.round(pd / t * 100) : 0;
      return '<article class="panel pay-card">' +
        '<h3>' + esc(b.title) + '</h3>' +
        '<p class="meta">' + fmtDate(b.date) + ' · ' + MG.findHall(b.hallId).name + ' · <span class="badge badge--' + bookingStatus(b) + '">' + STATUS_LABEL[bookingStatus(b)] + '</span></p>' +
        '<div class="pay-figures"><span>Paid <b>' + fmt(pd) + '</b></span><span>of <b>' + fmt(t) + '</b></span></div>' +
        '<div class="progress" role="progressbar" aria-label="Paid for ' + esc(b.title) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
        '<div class="inst-list">' + installments(b).map(function (i) {
          var label = { paid: 'Paid', overdue: 'Overdue', due: 'Due next', upcoming: 'Upcoming' }[i.status];
          return '<div class="inst">' +
            '<span class="inst-name">' + i.label + ' <small>(' + i.pct + '%)</small></span>' +
            '<div class="inst-right"><b>' + fmt(i.amount) + '</b>' +
              (i.isNext ? '<button class="btn btn--sm" type="button" data-pay="' + b.id + '">Pay ' + fmt(i.remaining) + '</button>' : '<span class="badge badge--' + i.status + '">' + label + '</span>') +
            '</div>' +
            '<span class="inst-meta">' + (i.status === 'paid' ? 'Settled' : 'Due ' + fmtDate(i.due)) + (i.isNext ? ' · <span class="badge badge--' + i.status + '">' + label + '</span>' : '') + '</span>' +
          '</div>';
        }).join('') + '</div></article>';
    }).join('') || '<div class="panel empty"><p>No bookings yet, so nothing to pay.</p></div>';

    var phSel = $('phFilter'), keep = phSel.value;
    phSel.innerHTML = '<option value="all">All bookings</option>' + state.bookings.map(function (b) { return '<option value="' + b.id + '">' + esc(b.title) + '</option>'; }).join('');
    phSel.value = state.bookings.some(function (b) { return b.id === keep; }) ? keep : 'all';
    var rows = state.payments.filter(function (p) { return phSel.value === 'all' || p.bookingId === phSel.value; })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    $('phEmpty').hidden = rows.length > 0;
    $('phTable').hidden = rows.length === 0;
    $('phBody').innerHTML = rows.map(function (p) {
      var b = getBooking(p.bookingId);
      return '<tr><td data-label="Date">' + fmtDate(p.date) + '</td>' +
        '<td class="td-main"><span class="cell-title">' + esc(b ? b.title : 'Deleted booking') + '</span></td>' +
        '<td data-label="Amount">' + fmt(p.amount) + '</td>' +
        '<td data-label="Method">' + esc(p.method) + '</td>' +
        '<td data-label="Reference">' + esc(p.ref) + '</td>' +
        '<td data-label="Actions"><div class="row-actions"><button class="text-btn" type="button" data-pay-edit="' + p.id + '">Edit</button><button class="text-btn" type="button" data-pay-delete="' + p.id + '">Delete</button></div></td></tr>';
    }).join('');
  }
  $('phFilter').addEventListener('change', renderPayments);

  /* Payment modal: record a new payment or edit an existing record */
  var payCtx = null;
  function openPaymentModal(bookingId, paymentId) {
    var f = $('paymentForm'); f.reset();
    f.querySelectorAll('.field').forEach(function (fl) { fl.classList.remove('has-error'); var m = fl.querySelector('.error-msg'); if (m) m.textContent = ''; });
    $('pmDate').max = todayISO;
    if (paymentId) {
      var p = state.payments.filter(function (x) { return x.id === paymentId; })[0];
      var b = getBooking(p.bookingId);
      payCtx = { bookingId: b.id, paymentId: p.id, max: balance(b) + p.amount };
      $('pmTitle').textContent = 'Edit payment';
      $('pmFor').innerHTML = 'For <strong>' + esc(b.title) + '</strong>';
      $('pmAmount').value = p.amount; $('pmDate').value = p.date; $('pmMethod').value = p.method; $('pmRef').value = p.ref;
      $('pmSubmit').textContent = 'Save Changes';
    } else {
      var bk = getBooking(bookingId);
      var next = installments(bk).filter(function (i) { return i.isNext; })[0];
      payCtx = { bookingId: bk.id, paymentId: null, max: balance(bk) };
      $('pmTitle').textContent = 'Pay installment';
      $('pmFor').innerHTML = 'For <strong>' + esc(bk.title) + '</strong>' + (next ? ' · ' + next.label + ' (' + next.pct + '%), due ' + fmtDate(next.due) : '');
      $('pmAmount').value = next ? next.remaining : balance(bk);
      $('pmDate').value = todayISO;
      $('pmMethod').value = 'UPI';
      $('pmRef').value = 'MG' + Date.now().toString().slice(-8);
      $('pmSubmit').textContent = 'Record Payment';
    }
    showModal('paymentModal', $('pmAmount'));
  }
  $('paymentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var amt = Math.round(Number($('pmAmount').value)), date = $('pmDate').value, ref = $('pmRef').value.trim(), ok = true;
    var chk = function (el, msg) { MG.setError(el, msg); if (msg) ok = false; };
    chk($('pmAmount'), !amt || amt < 1 ? 'Enter an amount above ₹0.' : amt > payCtx.max ? 'That is more than the balance of ' + fmt(payCtx.max) + '.' : '');
    chk($('pmDate'), !date ? 'Pick the payment date.' : date > todayISO ? 'Payment date can’t be in the future.' : '');
    chk($('pmRef'), ref.length < 4 ? 'Enter the transaction reference (4+ characters).' : '');
    if (!ok) return;
    var b = getBooking(payCtx.bookingId);
    if (payCtx.paymentId) {
      var p = state.payments.filter(function (x) { return x.id === payCtx.paymentId; })[0];
      p.amount = amt; p.date = date; p.method = $('pmMethod').value; p.ref = ref;
      notify('Payment record updated for ' + b.title + ': ' + fmt(amt) + '.');
      toast('<b>Payment updated.</b> ' + fmt(amt) + ' for ' + esc(b.title) + '.');
    } else {
      state.payments.push({ id: 'p' + (++state.seq), bookingId: b.id, amount: amt, date: date, method: $('pmMethod').value, ref: ref });
      notify('Payment of ' + fmt(amt) + ' received for ' + b.title + '. Thank you!');
      toast('<b>Payment recorded.</b> ' + fmt(amt) + ' via ' + esc($('pmMethod').value) + '.');
    }
    save(); closeModal(); render();
  });

  /* ------------------------------------------------------------------
     9. Profile & settings
     ------------------------------------------------------------------ */
  function renderProfile() {
    var p = state.profile;
    $('pfName').value = p.name; $('pfEmail').value = p.email; $('pfPhone').value = p.phone; $('pfCity').value = p.city; $('pfContact').value = p.contact;
    var theme = document.documentElement.getAttribute('data-theme'), dir = document.documentElement.getAttribute('dir');
    document.querySelectorAll('[name="setTheme"]').forEach(function (r) { r.checked = r.value === theme; });
    document.querySelectorAll('[name="setDir"]').forEach(function (r) { r.checked = r.value === dir; });
    $('setEmail').checked = state.settings.email; $('setWhatsapp').checked = state.settings.whatsapp; $('setDigest').checked = state.settings.digest;
  }
  $('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, chk = function (el, msg) { MG.setError(el, msg); if (msg) ok = false; };
    chk($('pfName'), $('pfName').value.trim().length < 2 ? 'Enter your full name.' : '');
    chk($('pfEmail'), !MG.EMAIL_RE.test($('pfEmail').value.trim()) ? 'Enter a valid email address.' : '');
    chk($('pfPhone'), !MG.PHONE_RE.test($('pfPhone').value.trim()) ? 'Enter a 10-digit Indian mobile number.' : '');
    if (!ok) return;
    state.profile = { name: $('pfName').value.trim(), email: $('pfEmail').value.trim(), phone: $('pfPhone').value.trim(), city: $('pfCity').value.trim(), contact: $('pfContact').value };
    session.name = state.profile.name; store.setJSON(MG.SESSION_KEY, session);
    save(); renderChrome();
    toast('<b>Profile saved.</b> Your event manager will see the update.');
  });
  document.querySelectorAll('[name="setTheme"]').forEach(function (r) { r.addEventListener('change', function () { MG.setTheme(r.value); }); });
  document.querySelectorAll('[name="setDir"]').forEach(function (r) { r.addEventListener('change', function () { MG.setDir(r.value); }); });
  [['setEmail', 'email'], ['setWhatsapp', 'whatsapp'], ['setDigest', 'digest']].forEach(function (pair) {
    $(pair[0]).addEventListener('change', function () {
      state.settings[pair[1]] = this.checked; save();
      toast('<b>Reminder preference saved.</b>');
    });
  });
  /* Keep settings radios in sync when the header toggles are used */
  document.addEventListener('mg:themechange', function () { if (state && currentView === 'profile') renderProfile(); });
  document.addEventListener('mg:dirchange', function () { if (state && currentView === 'profile') renderProfile(); });
  $('resetData').addEventListener('click', function () {
    confirmBox('Reset sample data?', 'Your bookings, payments and notifications will be replaced with the original demo data.', 'Reset Data', function () {
      state = seed(); state.profile.name = session.name || state.profile.name; save(); render();
      toast('<b>Sample data restored.</b>');
    });
  });

  /* ------------------------------------------------------------------
     10. Notifications, modals, toasts
     ------------------------------------------------------------------ */
  function notify(text) {
    state.notifications.unshift({ id: 'n' + (++state.seq), text: text, time: Date.now(), read: false });
    state.notifications = state.notifications.slice(0, 30);
  }
  function timeAgo(t) {
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + ' min ago';
    var h = Math.round(m / 60); if (h < 24) return h + ' hr ago';
    var d = Math.round(h / 24); return d + ' day' + (d === 1 ? '' : 's') + ' ago';
  }
  function renderNotifications() {
    var unread = state.notifications.filter(function (n) { return !n.read; }).length;
    var c = $('notifCount'); c.hidden = unread === 0; c.textContent = unread;
    $('notifBtn').setAttribute('aria-label', 'Notifications, ' + unread + ' unread');
    var chip = $('notifNew'); chip.hidden = unread === 0; chip.textContent = unread + ' new';
    $('markAllRead').disabled = unread === 0;
    $('notifList').innerHTML = state.notifications.length ? state.notifications.map(function (n) {
      /* Icon by topic: attention (holds, due dates), money (payments), or general */
      var kind = /due|ends|hold|overdue/i.test(n.text) ? ['alert', '!'] : /payment|paid|₹/i.test(n.text) ? ['money', '₹'] : ['info', '✦'];
      return '<li><button class="notif-item' + (n.read ? '' : ' is-unread') + '" type="button" data-notif="' + n.id + '">' +
        '<span class="notif-ic notif-ic--' + kind[0] + '" aria-hidden="true">' + kind[1] + '</span>' +
        '<span class="notif-text">' + esc(n.text) + '<time>' + timeAgo(n.time) + '</time></span>' +
        '<span class="notif-dot" aria-label="' + (n.read ? 'Read' : 'Unread') + '"></span></button></li>';
    }).join('') : '<li class="notif-empty">You\'re all caught up.</li>';
  }
  $('notifList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-notif]'); if (!b) return;
    var n = state.notifications.filter(function (x) { return x.id === b.dataset.notif; })[0];
    if (n) { n.read = true; save(); renderNotifications(); }
  });
  document.querySelectorAll('[data-close-pop]').forEach(function (b) {
    b.addEventListener('click', function () { closePops(); $('notifBtn').focus(); });
  });
  $('markAllRead').addEventListener('click', function () {
    state.notifications.forEach(function (n) { n.read = true; }); save(); renderNotifications();
  });

  var openModal = null, modalReturn = null;
  function showModal(id, focusEl) {
    modalReturn = document.activeElement;
    openModal = $(id); openModal.hidden = false;
    document.body.classList.add('dash-locked');
    window.setTimeout(function () { (focusEl || openModal.querySelector('button')).focus(); }, 30);
  }
  function closeModal() {
    if (!openModal) return;
    openModal.hidden = true; openModal = null;
    if (!sidebar.classList.contains('is-open')) document.body.classList.remove('dash-locked');
    if (modalReturn && document.contains(modalReturn)) modalReturn.focus();
  }
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) closeModal(); });
    m.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = Array.prototype.slice.call(m.querySelectorAll('button, input, select, textarea')).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
  });

  var confirmCb = null;
  function confirmBox(title, text, okLabel, cb) {
    $('cfTitle').textContent = title; $('cfText').textContent = text; $('cfOk').textContent = okLabel;
    confirmCb = cb; showModal('confirmModal', $('cfOk'));
  }
  $('cfOk').addEventListener('click', function () { var cb = confirmCb; confirmCb = null; closeModal(); if (cb) cb(); });

  function toast(html) {
    var t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<span>' + html + '</span>';
    $('toasts').appendChild(t);
    window.setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 3200);
    window.setTimeout(function () { t.remove(); }, 3600);
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  load();
  setView((location.hash || '#overview').slice(1), false);
  window.addEventListener('hashchange', function () { var v = location.hash.slice(1); if (v && v !== currentView && VIEWS[v]) setView(v, true); });
})();
