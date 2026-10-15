/* ==========================================================================
   Wanderkite Holidays — dashboard.js
   Traveller dashboard: bookings, itineraries, saved packages, documents,
   notifications, profile & settings. All data lives in localStorage:
     wk-session  signed-in traveller (set by Sign In / Sign Up)
     wk-dash     bookings, itineraries, notifications, profile, settings
     wk-saved    saved packages (shared with the ♡ buttons on the website)
   --------------------------------------------------------------------------
   1. Catalogue & itinerary templates   2. State & seed data
   3. Helpers                           4. Navigation & sidebar
   5. Overview (stats, chart, dues)     6. Bookings (CRUD)
   7. Itineraries                       8. Saved packages
   9. Documents & downloads             10. Notifications & user menu
   11. Profile & settings               12. Boot
   ========================================================================== */
(function () {
  'use strict';

  var WK = window.WK;
  var store = WK.store;
  var rupees = WK.rupees;
  var toast = WK.toast;
  var IMG = '../assets/images/';

  var session = store.get('wk-session', null);
  if (!session) {
    session = { name: 'Traveller', email: 'traveller@wanderkite.in', since: new Date().toISOString() };
    store.set('wk-session', session);
  }

  /* 1. CATALOGUE ---------------------------------------------------------- */
  // Mirrors the packages on the public pages. unit: price basis.
  var CATALOG = [
    { id: 'dom-kerala', title: 'Kerala Backwaters & Munnar', price: 18900, unit: 'person', image: 'dom-kerala.jpg', nights: 4, type: 'Domestic', place: 'Kochi · Munnar · Alleppey', page: 'domestic.html' },
    { id: 'dom-golden-triangle', title: 'Golden Triangle: Delhi, Agra & Jaipur', price: 22500, unit: 'person', image: 'dom-golden-triangle.jpg', nights: 5, type: 'Domestic', place: 'Delhi · Agra · Jaipur', page: 'domestic.html' },
    { id: 'dom-himachal', title: 'Manali, Solang & Kasol', price: 15900, unit: 'person', image: 'dom-himachal.jpg', nights: 5, type: 'Domestic', place: 'Manali · Kasol', page: 'domestic.html' },
    { id: 'dom-rajasthan', title: 'Royal Rajasthan', price: 31900, unit: 'person', image: 'dom-rajasthan.jpg', nights: 7, type: 'Domestic', place: 'Jaipur · Jodhpur · Jaisalmer · Udaipur', page: 'domestic.html' },
    { id: 'dom-ladakh', title: 'Ladakh: Leh, Nubra & Pangong', price: 38500, unit: 'person', image: 'dom-ladakh.jpg', nights: 6, type: 'Domestic', place: 'Leh · Nubra · Pangong', page: 'domestic.html' },
    { id: 'dom-andaman', title: 'Andaman Islands Explorer', price: 34500, unit: 'person', image: 'dom-andaman.jpg', nights: 6, type: 'Domestic', place: 'Port Blair · Havelock · Neil', page: 'domestic.html' },
    { id: 'dom-goa', title: 'Goa Beach & Heritage', price: 14900, unit: 'person', image: 'dom-goa.jpg', nights: 4, type: 'Domestic', place: 'North & South Goa', page: 'domestic.html' },
    { id: 'dom-amritsar', title: 'Amritsar & Dharamshala', price: 19800, unit: 'person', image: 'dom-amritsar.jpg', nights: 5, type: 'Domestic', place: 'Amritsar · McLeod Ganj', page: 'domestic.html' },
    { id: 'dom-ranthambore', title: 'Ranthambore Tiger Safari', price: 24600, unit: 'person', image: 'dom-ranthambore.jpg', nights: 3, type: 'Domestic', place: 'Sawai Madhopur', page: 'domestic.html' },
    { id: 'int-bali', title: 'Bali: Ubud & Seminyak', price: 54900, unit: 'person', image: 'int-bali.jpg', nights: 6, type: 'International', place: 'Ubud · Seminyak', page: 'international.html' },
    { id: 'int-thailand', title: 'Phuket, Krabi & Phi Phi', price: 48900, unit: 'person', image: 'int-thailand.jpg', nights: 6, type: 'International', place: 'Phuket · Krabi', page: 'international.html' },
    { id: 'int-dubai', title: 'Dubai City & Desert', price: 46500, unit: 'person', image: 'int-dubai.jpg', nights: 4, type: 'International', place: 'Dubai', page: 'international.html' },
    { id: 'int-maldives', title: 'Maldives Water Villa Escape', price: 89000, unit: 'person', image: 'int-maldives.jpg', nights: 4, type: 'International', place: 'South Malé Atoll', page: 'international.html' },
    { id: 'int-vietnam', title: 'Vietnam: Hanoi, Ha Long & Saigon', price: 74500, unit: 'person', image: 'int-vietnam.jpg', nights: 7, type: 'International', place: 'Hanoi · Ha Long · Ho Chi Minh City', page: 'international.html' },
    { id: 'int-turkey', title: 'Istanbul & Cappadocia', price: 112000, unit: 'person', image: 'int-turkey.jpg', nights: 7, type: 'International', place: 'Istanbul · Cappadocia', page: 'international.html' },
    { id: 'int-kenya', title: 'Kenya: Masai Mara Safari', price: 164000, unit: 'person', image: 'int-kenya.jpg', nights: 6, type: 'International', place: 'Nairobi · Masai Mara · Nakuru', page: 'international.html' },
    { id: 'int-japan', title: 'Japan: Tokyo, Hakone & Kyoto', price: 218000, unit: 'person', image: 'int-japan.jpg', nights: 8, type: 'International', place: 'Tokyo · Hakone · Kyoto', page: 'international.html' },
    { id: 'int-europe', title: 'Paris, Swiss Alps & Venice', price: 245000, unit: 'person', image: 'int-paris.jpg', nights: 9, type: 'International', place: 'Paris · Interlaken · Venice', page: 'international.html' },
    { id: 'hm-maldives', title: 'Maldives Overwater Honeymoon', price: 196000, unit: 'couple', image: 'hm-maldives.jpg', nights: 4, type: 'Honeymoon', place: 'Maldives', page: 'honeymoon-family.html' },
    { id: 'hm-bali', title: 'Bali Private Pool Villa', price: 118000, unit: 'couple', image: 'hm-bali-pool.jpg', nights: 5, type: 'Honeymoon', place: 'Ubud · Jimbaran', page: 'honeymoon-family.html' },
    { id: 'hm-cappadocia', title: 'Cappadocia Balloons & Istanbul', price: 236000, unit: 'couple', image: 'hm-cappadocia.jpg', nights: 6, type: 'Honeymoon', place: 'Istanbul · Cappadocia', page: 'honeymoon-family.html' },
    { id: 'hm-santorini', title: 'Santorini & Athens Romance', price: 340000, unit: 'couple', image: 'hm-santorini.jpg', nights: 6, type: 'Honeymoon', place: 'Athens · Santorini', page: 'honeymoon-family.html' },
    { id: 'fam-goa', title: 'Goa Family Beach Break', price: 19400, unit: 'adult', image: 'fam-goa-beach.jpg', nights: 4, type: 'Family', place: 'Candolim, Goa', page: 'honeymoon-family.html' },
    { id: 'fam-corbett', title: 'Jim Corbett Jungle Holiday', price: 15000, unit: 'adult', image: 'fam-corbett.jpg', nights: 3, type: 'Family', place: 'Ramnagar, Uttarakhand', page: 'honeymoon-family.html' },
    { id: 'fam-phuket', title: 'Phuket Family Islands', price: 60000, unit: 'adult', image: 'fam-phuket.jpg', nights: 5, type: 'Family', place: 'Phuket', page: 'honeymoon-family.html' },
    { id: 'fam-dubai', title: 'Dubai Family Fun', price: 67200, unit: 'adult', image: 'fam-dubai.jpg', nights: 5, type: 'Family', place: 'Dubai', page: 'honeymoon-family.html' }
  ];
  var byId = {};
  CATALOG.forEach(function (p) { byId[p.id] = p; });

  // Detailed day plans for the seeded trips; other trips get a simple outline.
  var TEMPLATES = {
    'dom-kerala': [
      ['Arrive in Kochi', 'Airport pick-up, Fort Kochi walk past the Chinese fishing nets and a Kathakali show at 6 PM.', 'Kochi — Fort House Hotel'],
      ['Drive to Munnar', 'Four-hour climb into the tea hills with stops at Cheeyappara falls and a spice garden.', 'Munnar — Tea Valley Resort'],
      ['Munnar tea country', 'Eravikulam National Park for Nilgiri tahr, the Tata Tea Museum and Mattupetty dam.', 'Munnar — Tea Valley Resort'],
      ['Houseboat in Alleppey', 'Board a private deluxe houseboat at noon; lunch, tea and dinner cooked on board.', 'Alleppey — Lakes Heritage houseboat'],
      ['Return to Kochi', 'Breakfast on the water, then transfer to Kochi airport for your flight home.', '']
    ],
    'int-bali': [
      ['Arrive in Bali', 'Private transfer to Ubud and a welcome Balinese dinner.', 'Ubud — Kamandalu pool villa'],
      ['Ubud culture', 'Tegallalang rice terraces, Tirta Empul water temple and the Monkey Forest.', 'Ubud — Kamandalu pool villa'],
      ['Kintamani volcano', 'Breakfast with Mount Batur views, coffee plantation and a jungle swing.', 'Ubud — Kamandalu pool villa'],
      ['Move to Seminyak', 'Afternoon at leisure, sunset drinks on Seminyak beach.', 'Seminyak — The Haven Suites'],
      ['Nusa Penida day trip', 'Fast boat to Kelingking, Broken Beach and Crystal Bay snorkelling.', 'Seminyak — The Haven Suites'],
      ['Tanah Lot sunset', 'Free morning; evening at the sea temple of Tanah Lot.', 'Seminyak — The Haven Suites'],
      ['Fly home', 'Check-out and transfer to Ngurah Rai airport.', '']
    ],
    'fam-goa': [
      ['Arrive in Goa', 'Pick-up from Mopa or Dabolim airport; pool afternoon at the resort.', 'Candolim — Taj Holiday Village'],
      ['Dolphins & forts', 'Morning dolphin-spotting boat, then Aguada fort and lighthouse.', 'Candolim — Taj Holiday Village'],
      ['Old Goa & spices', 'Basilica of Bom Jesus, then lunch and an elephant-free tour at a spice plantation.', 'Candolim — Taj Holiday Village'],
      ['Beach day', 'Kids\' club morning; evening at Calangute with dinner at a beach shack.', 'Candolim — Taj Holiday Village'],
      ['Fly home', 'Breakfast and airport drop.', '']
    ],
    'dom-ladakh': [
      ['Land in Leh', 'Rest to acclimatise; sunset at Shanti Stupa.', 'Leh — heritage guesthouse'],
      ['Monasteries', 'Thiksey, Hemis and Shey Palace.', 'Leh'],
      ['Khardung La to Nubra', 'Cross the pass; Hunder dunes and camel ride.', 'Hunder — desert camp'],
      ['To Pangong', 'Shyok river road to the lake; bonfire dinner.', 'Pangong — lakeside tents'],
      ['Back via Chang La', 'Sunrise at the lake, return to Leh.', 'Leh'],
      ['Sham valley', 'Magnetic Hill and the Indus–Zanskar confluence.', 'Leh'],
      ['Fly home', 'Transfer to Leh airport.', '']
    ],
    'int-dubai': [
      ['Arrive in Dubai', 'Transfer to Downtown; evening Dubai Fountain show.', 'Downtown — Rove Downtown'],
      ['City & Burj Khalifa', 'Old Dubai souks by abra, then level 124 at sunset.', 'Downtown — Rove Downtown'],
      ['Desert safari', 'Free morning; afternoon dune drive, camp dinner and shows.', 'Downtown — Rove Downtown'],
      ['Marina cruise', 'Palm Jumeirah, then dhow dinner cruise on the Marina.', 'Downtown — Rove Downtown'],
      ['Fly home', 'Airport drop after breakfast.', '']
    ],
    'dom-andaman': [
      ['Arrive Port Blair', 'Cellular Jail and the light-and-sound show.', 'Port Blair — Sea Shell'],
      ['Ferry to Havelock', 'Afternoon at Radhanagar beach for sunset.', 'Havelock — Barefoot resort'],
      ['Elephant Beach', 'Glass-bottom boat and snorkelling.', 'Havelock — Barefoot resort'],
      ['Neil Island', 'Natural bridge and Laxmanpur beach.', 'Neil — Pearl Park'],
      ['Back to Port Blair', 'Ferry back; Chidiya Tapu sunset.', 'Port Blair — Sea Shell'],
      ['Ross Island', 'Morning boat to Ross Island ruins.', 'Port Blair — Sea Shell'],
      ['Fly home', 'Airport drop.', '']
    ]
  };

  function makeItinerary(pkgId) {
    var t = TEMPLATES[pkgId];
    var p = byId[pkgId];
    if (t) return t.map(function (d) { return { id: uid(), title: d[0], details: d[1], stay: d[2] }; });
    var nights = p ? p.nights : 3;
    var place = p ? p.place.split(' · ')[0] : 'your destination';
    var days = [{ id: uid(), title: 'Arrive in ' + place, details: 'Private transfer to your hotel and an easy first evening.', stay: '' }];
    for (var i = 1; i < nights; i++) {
      days.push({ id: uid(), title: 'Day of sightseeing', details: 'Guided tour as per your confirmed plan. Your planner will add details here.', stay: '' });
    }
    days.push({ id: uid(), title: 'Fly home', details: 'Breakfast and transfer to the airport.', stay: '' });
    return days;
  }

  /* 2. STATE -------------------------------------------------------------- */
  var KEY = 'wk-dash';
  var DEFAULT_SAVED = ['dom-ladakh', 'int-japan', 'hm-santorini'];

  function seed() {
    var today = startOfDay(new Date());
    var bookings = [
      { id: 'WK-26418', pkgId: 'dom-kerala', start: iso(addDays(today, 37)), pax: 2, amount: 37800, paid: 37800, status: 'Confirmed', created: iso(addDays(today, -21)) },
      { id: 'WK-26502', pkgId: 'int-bali', start: iso(addDays(today, 65)), pax: 2, amount: 109800, paid: 27450, status: 'Confirmed', created: iso(addDays(today, -12)) },
      { id: 'WK-26655', pkgId: 'fam-goa', start: iso(addDays(today, 101)), pax: 4, amount: 62080, paid: 0, status: 'Pending Payment', created: iso(addDays(today, -3)) },
      { id: 'WK-25977', pkgId: 'dom-ladakh', start: iso(addDays(today, -124)), pax: 3, amount: 115500, paid: 115500, status: 'Completed', created: iso(addDays(today, -190)) },
      { id: 'WK-25640', pkgId: 'int-dubai', start: iso(addDays(today, -223)), pax: 2, amount: 93000, paid: 93000, status: 'Completed', created: iso(addDays(today, -270)) },
      { id: 'WK-25311', pkgId: 'dom-andaman', start: iso(addDays(today, -40)), pax: 2, amount: 69000, paid: 17250, status: 'Cancelled', created: iso(addDays(today, -95)) }
    ];
    var itineraries = {};
    bookings.forEach(function (b) { itineraries[b.id] = makeItinerary(b.pkgId); });
    var now = Date.now();
    return {
      owner: session.email,
      bookings: bookings,
      itineraries: itineraries,
      notifications: [
        { id: uid(), text: 'Balance of ₹82,350 for Bali: Ubud & Seminyak is due by ' + fmtDate(iso(addDays(today, 35))) + '.', time: now - 2 * 36e5, read: false, view: 'overview' },
        { id: uid(), text: 'Your Alleppey houseboat for Kerala Backwaters & Munnar is confirmed. Voucher ready to download.', time: now - 26 * 36e5, read: false, view: 'documents' },
        { id: uid(), text: 'Pay ₹15,520 (25%) to lock your Goa Family Beach Break resort.', time: now - 3 * 864e5, read: true, view: 'bookings' },
        { id: uid(), text: 'Rate your Ladakh trip and earn 500 Kite Points.', time: now - 9 * 864e5, read: true, view: 'bookings' }
      ],
      profile: { name: session.name, email: session.email, phone: '98450 12345', airport: 'Bengaluru (BLR)' },
      settings: { emailAlerts: true, whatsapp: true, deals: false },
      points: 2450
    };
  }

  var state = store.get(KEY, null);
  if (!state || state.owner !== session.email || !Array.isArray(state.bookings)) {
    state = seed();
  }
  if (store.get('wk-saved', null) === null) seedSaved();

  function seedSaved() {
    store.set('wk-saved', DEFAULT_SAVED.map(function (id) {
      var p = byId[id];
      return { id: p.id, title: p.title, price: p.price, image: p.image, duration: p.nights + 'N/' + (p.nights + 1) + 'D', type: p.type, page: p.page, savedAt: new Date().toISOString() };
    }));
  }
  function save() { store.set(KEY, state); }
  function getSaved() { return store.get('wk-saved', []) || []; }
  function setSaved(list) { store.set('wk-saved', list); }
  save();

  /* 3. HELPERS ------------------------------------------------------------ */
  function uid() { return Math.random().toString(36).slice(2, 10); }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parse(s) { return new Date(s + 'T00:00:00'); }
  function fmtDate(s) { return parse(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function fmtShort(s) { return parse(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); }
  function daysUntil(s) { return Math.round((parse(s) - startOfDay(new Date())) / 864e5); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pkgOf(b) { return byId[b.pkgId] || { title: 'Custom trip', image: 'logo.png', nights: 3, type: 'Domestic', place: '', unit: 'person', price: 0 }; }
  function endOf(b) { return iso(addDays(parse(b.start), pkgOf(b).nights)); }
  function balance(b) { return b.status === 'Cancelled' ? 0 : Math.max(0, b.amount - b.paid); }
  function dueDate(b) { return iso(addDays(parse(b.start), pkgOf(b).type === 'Domestic' ? -21 : -30)); }
  function statusClass(s) {
    return { 'Confirmed': 'status--confirmed', 'Pending Payment': 'status--pending', 'Completed': 'status--completed', 'Cancelled': 'status--cancelled' }[s] || '';
  }
  function compact(n) {
    if (n >= 100000) return '₹' + parseFloat((n / 100000).toFixed(2)) + 'L';
    if (n >= 1000) return '₹' + parseFloat((n / 1000).toFixed(1)) + 'k';
    return '₹' + n;
  }
  function unitLabel(p) { return p.unit === 'couple' ? '/ couple' : p.unit === 'adult' ? '/ adult' : '/ person'; }
  function priceFor(p, pax) {
    if (!p.price) return 0;
    if (p.unit === 'couple') return p.price * Math.max(1, Math.ceil(pax / 2));
    return p.price * pax;
  }
  function newBookingId() {
    var id;
    do { id = 'WK-' + (26700 + Math.floor(Math.random() * 3000)); }
    while (state.bookings.some(function (b) { return b.id === id; }));
    return id;
  }
  function notify(text, view) {
    state.notifications.unshift({ id: uid(), text: text, time: Date.now(), read: false, view: view || 'overview' });
  }
  function timeAgo(t) {
    var m = Math.round((Date.now() - t) / 6e4);
    if (m < 1) return 'Just now';
    if (m < 60) return m + ' min ago';
    var h = Math.round(m / 60);
    if (h < 24) return h + ' h ago';
    var d = Math.round(h / 24);
    return d === 1 ? 'Yesterday' : d + ' days ago';
  }
  function sortedBookings() {
    return state.bookings.slice().sort(function (a, b) { return parse(a.start) - parse(b.start); });
  }
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  // Simple promise-free confirm dialog
  var confirmModal = document.getElementById('confirm-modal');
  var confirmAction = null;
  function askConfirm(text, yesLabel, action) {
    confirmModal.querySelector('[data-confirm-text]').textContent = text;
    confirmModal.querySelector('[data-confirm-yes]').textContent = yesLabel || 'Delete';
    confirmAction = action;
    confirmModal.showModal();
  }
  confirmModal.querySelector('[data-confirm-yes]').addEventListener('click', function () {
    confirmModal.close();
    if (confirmAction) confirmAction();
    confirmAction = null;
  });
  confirmModal.querySelector('[data-confirm-no]').addEventListener('click', function () { confirmModal.close(); });

  // Every [data-close] button closes its dialog
  document.querySelectorAll('dialog [data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () { btn.closest('dialog').close(); });
  });
  // Clicking the backdrop closes a dialog
  document.querySelectorAll('dialog').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });

  /* 4. NAVIGATION & SIDEBAR ---------------------------------------------- */
  var VIEWS = {
    overview: ['Overview', 'Your trips at a glance'],
    bookings: ['My Bookings', 'Track status, payments and changes'],
    itineraries: ['Itineraries', 'Day-by-day plans for every trip'],
    saved: ['Saved Packages', 'Trips you have saved from our website'],
    documents: ['Tickets & Invoices', 'Download e-tickets, vouchers and invoices'],
    profile: ['Profile & Settings', 'Your details and preferences']
  };
  var currentView = 'overview';

  function showView(name, focus) {
    if (!VIEWS[name]) name = 'overview';
    currentView = name;
    document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
    document.querySelectorAll('.dash-nav .dash-link').forEach(function (l) {
      if (l.getAttribute('data-view') === name) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });
    document.getElementById('view-title').textContent = VIEWS[name][0];
    document.getElementById('view-sub').textContent = VIEWS[name][1];
    document.title = VIEWS[name][0] + ' | Dashboard | Wanderkite Holidays';
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    closeSidebar(false);
    closePops();
    if (name === 'overview') drawChart();
    if (focus) document.getElementById('dash-main').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-view]');
    if (link && !link.hasAttribute('data-panel')) {
      e.preventDefault();
      showView(link.getAttribute('data-view'), true);
    }
    if (e.target.closest('[data-logout]')) {
      try { localStorage.removeItem('wk-session'); } catch (err) { /* ignore */ }
      window.location.href = 'signin.html';
    }
  });
  window.addEventListener('hashchange', function () { showView(location.hash.slice(1)); });

  // Mobile sidebar
  var burger = document.querySelector('.dash-burger');
  var sidebar = document.getElementById('dash-sidebar');
  function openSidebar() {
    document.body.classList.add('dash-nav-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close dashboard menu');
    var first = sidebar.querySelector('a, button');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeSidebar(returnFocus) {
    if (!document.body.classList.contains('dash-nav-open')) return;
    document.body.classList.remove('dash-nav-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open dashboard menu');
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', function () {
    if (document.body.classList.contains('dash-nav-open')) closeSidebar(true); else openSidebar();
  });
  document.querySelector('.dash-overlay').addEventListener('click', function () { closeSidebar(true); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (document.querySelector('dialog[open]')) return; // dialogs handle their own Esc
      closePops(true);
      closeSidebar(true);
    }
    // Keep focus inside the open mobile sidebar
    if (e.key === 'Tab' && document.body.classList.contains('dash-nav-open')) {
      var items = Array.prototype.slice.call(sidebar.querySelectorAll('a[href], button')).concat([burger]);
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* 5. OVERVIEW ----------------------------------------------------------- */
  function renderOverview() {
    var today = startOfDay(new Date());
    var upcoming = sortedBookings().filter(function (b) {
      return b.status !== 'Cancelled' && b.status !== 'Completed' && parse(b.start) >= today;
    });

    // Next trip hero
    var next = upcoming[0];
    var box = document.querySelector('[data-next-trip]');
    if (next) {
      var p = pkgOf(next);
      var d = daysUntil(next.start);
      box.className = 'next-trip';
      box.innerHTML =
        '<img src="' + IMG + p.image + '" alt="' + esc(p.title) + ' destination photo">' +
        '<div class="inner">' +
          '<span class="status ' + statusClass(next.status) + '">' + esc(next.status) + '</span>' +
          '<p>Your next trip</p>' +
          '<h2>' + esc(p.title) + '</h2>' +
          '<p>' + fmtDate(next.start) + ' – ' + fmtDate(endOf(next)) + ' · ' + next.pax + ' travellers · ' + esc(next.id) + '</p>' +
          '<div><span class="countdown-big">' + d + '</span> <span>day' + (d === 1 ? '' : 's') + ' to go</span></div>' +
          '<div class="next-actions">' +
            '<button class="btn btn--sm" type="button" data-open-itin="' + next.id + '">View Itinerary</button>' +
            (balance(next) > 0
              ? '<button class="text-btn" type="button" data-pay="' + next.id + '">Pay balance ' + rupees(balance(next)) + '</button>'
              : '<button class="text-btn" type="button" data-view="documents">Get tickets</button>') +
          '</div>' +
        '</div>';
    } else {
      box.className = 'next-trip next-trip--empty';
      box.innerHTML = '<div class="inner"><p>No upcoming trips</p><h2>Where to next?</h2><div class="next-actions"><a class="btn btn--sm" href="international.html">Browse Packages</a><button class="text-btn" type="button" data-view="saved">See saved packages</button></div></div>';
    }

    // Stat cards
    var active = state.bookings.filter(function (b) { return b.status !== 'Cancelled'; });
    var paid = active.reduce(function (s, b) { return s + b.paid; }, 0);
    var due = active.reduce(function (s, b) { return s + balance(b); }, 0);
    var dueCount = active.filter(function (b) { return balance(b) > 0; }).length;
    var savedCount = getSaved().length;
    setText('[data-stat="upcoming"]', upcoming.length);
    setText('[data-stat-note="upcoming"]', next ? 'Next: ' + fmtShort(next.start) : 'Nothing booked yet');
    setText('[data-stat="paid"]', rupees(paid));
    setText('[data-stat-note="paid"]', 'Across ' + active.length + ' booking' + (active.length === 1 ? '' : 's'));
    setText('[data-stat="due"]', rupees(due));
    setText('[data-stat-note="due"]', dueCount ? dueCount + ' booking' + (dueCount === 1 ? '' : 's') + ' pending' : 'All paid up');
    setText('[data-stat="saved"]', savedCount);
    setText('[data-stat-note="saved"]', savedCount ? 'Ready to book' : 'Tap ♡ on any package');

    // Payments due list
    var dueList = document.querySelector('[data-due-list]');
    var dues = sortedBookings().filter(function (b) { return balance(b) > 0 && b.status !== 'Completed'; });
    dueList.innerHTML = dues.length ? dues.map(function (b) {
      var pct = Math.round(b.paid / b.amount * 100);
      return '<li class="due-item">' +
        '<div class="top"><b>' + esc(pkgOf(b).title) + '</b><span class="amt">' + rupees(balance(b)) + '</span></div>' +
        '<p>' + (b.paid ? 'Balance due by ' + fmtDate(dueDate(b)) : '25% advance (' + rupees(Math.round(b.amount * 0.25)) + ') confirms this trip') + ' · ' + pct + '% paid</p>' +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<button class="btn btn--sm" type="button" data-pay="' + b.id + '">' + (b.paid ? 'Pay Balance' : 'Pay Full Amount') + '</button>' +
      '</li>';
    }).join('') : '<li class="due-empty">No payments due. You\'re all set!</li>';

    // Status bars
    var statuses = [
      ['Confirmed', '#2A9D9A'], ['Pending Payment', '#F4A12B'], ['Completed', '#0F5F66'], ['Cancelled', '#B3261E']
    ];
    var total = state.bookings.length || 1;
    document.querySelector('[data-status-bars]').innerHTML = statuses.map(function (s) {
      var n = state.bookings.filter(function (b) { return b.status === s[0]; }).length;
      return '<div class="status-row"><span>' + s[0] + '</span><span class="track"><span class="fill" style="width:' + (n / total * 100) + '%;background:' + s[1] + '"></span></span><b>' + n + '</b></div>';
    }).join('');

    drawChart();
  }

  function setText(sel, val) { var el = document.querySelector(sel); if (el) el.textContent = val; }

  // Canvas bar chart: paid vs balance for each non-cancelled booking
  var chartCanvas = document.getElementById('pay-chart');
  function drawChart() {
    if (!chartCanvas || chartCanvas.offsetParent === null) return;
    var data = sortedBookings().filter(function (b) { return b.status !== 'Cancelled'; }).slice(-6);
    var dpr = window.devicePixelRatio || 1;
    var w = chartCanvas.clientWidth;
    var h = chartCanvas.clientHeight;
    chartCanvas.width = w * dpr;
    chartCanvas.height = h * dpr;
    var ctx = chartCanvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var text = cssVar('--muted') || '#4F5E66';
    var grid = cssVar('--border') || '#DCE3E6';
    var rtl = document.documentElement.getAttribute('dir') === 'rtl';
    ctx.font = '12px ' + (cssVar('--font-body') || 'sans-serif');
    if ('direction' in ctx) ctx.direction = 'ltr'; // labels are English: keep "…" and "₹" in place

    if (!data.length) {
      ctx.fillStyle = text;
      ctx.textAlign = 'center';
      ctx.fillText('No bookings yet — your payments will appear here.', w / 2, h / 2);
      return;
    }

    var padAxis = 52, padEnd = 12, padTop = 12, padBottom = 34;
    var plotW = w - padAxis - padEnd;
    var plotH = h - padTop - padBottom;
    // Round the axis so each of the 4 gridlines lands on a tidy value
    var max = Math.max.apply(null, data.map(function (b) { return b.amount; }));
    var raw = max / 4;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var nice = [1, 2, 2.5, 3, 4, 5, 10].map(function (f) { return f * mag; }).find(function (v) { return v >= raw; });
    var niceMax = nice * 4;

    // Grid + y labels
    ctx.textBaseline = 'middle';
    for (var g = 0; g <= 4; g++) {
      var y = padTop + plotH - plotH * g / 4;
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rtl ? padEnd : padAxis, y);
      ctx.lineTo(rtl ? w - padAxis : w - padEnd, y);
      ctx.stroke();
      ctx.fillStyle = text;
      ctx.textAlign = rtl ? 'left' : 'right';
      ctx.fillText(compact(niceMax * g / 4), rtl ? w - padAxis + 8 : padAxis - 8, y);
    }

    // Bars
    var slot = plotW / data.length;
    var barW = Math.min(46, slot * 0.5);
    data.forEach(function (b, i) {
      var cx = rtl ? (w - padAxis) - slot * (i + 0.5) : padAxis + slot * (i + 0.5);
      var paidH = plotH * (b.paid / niceMax);
      var dueH = plotH * (balance(b) / niceMax);
      var base = padTop + plotH;
      ctx.fillStyle = '#2A9D9A';
      roundRect(ctx, cx - barW / 2, base - paidH, barW, paidH, dueH > 0 ? 0 : 6);
      if (dueH > 0) {
        ctx.fillStyle = '#F4A12B';
        roundRect(ctx, cx - barW / 2, base - paidH - dueH, barW, dueH, 6, true);
      }
      ctx.fillStyle = text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      // Shorten the label until it fits its slot
      var label = pkgOf(b).title.split(/[:,&]/)[0].trim();
      var maxW = slot - 8;
      if (ctx.measureText(label).width > maxW) {
        while (label.length > 2 && ctx.measureText(label + '…').width > maxW) label = label.slice(0, -1);
        label = label.trim() + '…';
      }
      ctx.fillText(label, cx, base + 10);
      ctx.textBaseline = 'middle';
    });
  }
  function roundRect(ctx, x, y, w, h, r, topOnly) {
    if (h <= 0) return;
    r = Math.min(r, h, w / 2);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
  }
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawChart, 120); });
  document.addEventListener('wk:themechange', function () { setTimeout(drawChart, 30); });
  document.addEventListener('wk:dirchange', function () { setTimeout(drawChart, 30); });

  // Pay a balance (simulated payment)
  function payBooking(id) {
    var b = state.bookings.find(function (x) { return x.id === id; });
    if (!b) return;
    var amount = balance(b);
    askConfirm('Pay ' + rupees(amount) + ' for ' + pkgOf(b).title + ' (' + b.id + ')? This demo marks the booking as fully paid.', 'Pay ' + rupees(amount), function () {
      b.paid = b.amount;
      if (b.status === 'Pending Payment') b.status = 'Confirmed';
      state.points += Math.round(amount / 100);
      notify('Payment of ' + rupees(amount) + ' received for ' + pkgOf(b).title + '. Tickets and vouchers are ready.', 'documents');
      save();
      renderAll();
      toast('Payment received — tickets are now in Tickets & Invoices');
    });
  }

  /* 6. BOOKINGS ----------------------------------------------------------- */
  var bkSearch = document.querySelector('[data-bk-search]');
  var bkStatus = document.querySelector('[data-bk-status]');
  var bkType = document.querySelector('[data-bk-type]');

  function renderBookings() {
    var q = bkSearch.value.trim().toLowerCase();
    var st = bkStatus.value;
    var ty = bkType.value;
    var rows = sortedBookings().reverse().filter(function (b) {
      var p = pkgOf(b);
      return (!st || b.status === st) && (!ty || p.type === ty) &&
        (!q || (p.title + ' ' + b.id + ' ' + p.place).toLowerCase().indexOf(q) > -1);
    });
    document.querySelector('[data-bk-rows]').innerHTML = rows.map(function (b) {
      var p = pkgOf(b);
      return '<tr>' +
        '<td data-label="Booking"><div class="trip-cell"><img src="' + IMG + p.image + '" alt="" loading="lazy"><div><b>' + esc(p.title) + '</b><small>' + esc(b.id) + ' · ' + p.type + '</small></div></div></td>' +
        '<td data-label="Dates" class="nowrap">' + fmtDate(b.start) + '<br><small class="muted">to ' + fmtDate(endOf(b)) + '</small></td>' +
        '<td data-label="Travellers">' + b.pax + '</td>' +
        '<td data-label="Amount" class="amt-cell"><b>' + rupees(b.amount) + '</b><small>' + (b.status === 'Cancelled' ? 'Refund ' + rupees(b.paid) : balance(b) ? rupees(balance(b)) + ' due' : 'Paid in full') + '</small></td>' +
        '<td data-label="Status"><span class="status ' + statusClass(b.status) + '">' + esc(b.status) + '</span></td>' +
        '<td><div class="row-actions">' +
          (balance(b) > 0 ? '<button class="act-btn" type="button" data-pay="' + b.id + '" aria-label="Pay balance for ' + esc(b.id) + '" title="Pay balance">₹</button>' : '') +
          '<button class="act-btn" type="button" data-open-itin="' + b.id + '" aria-label="View itinerary for ' + esc(b.id) + '" title="Itinerary">⌖</button>' +
          '<button class="act-btn" type="button" data-edit="' + b.id + '" aria-label="Edit booking ' + esc(b.id) + '" title="Edit">✎</button>' +
          '<button class="act-btn act-btn--danger" type="button" data-delete="' + b.id + '" aria-label="Delete booking ' + esc(b.id) + '" title="Delete">🗑</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
    document.querySelector('[data-bk-empty]').hidden = rows.length > 0;
  }
  [bkSearch, bkStatus, bkType].forEach(function (el) { el.addEventListener('input', renderBookings); el.addEventListener('change', renderBookings); });

  // Booking modal (add + edit)
  var bModal = document.getElementById('booking-modal');
  var bForm = document.getElementById('booking-form');
  var editingId = null;
  bForm.package.innerHTML = ['Domestic', 'International', 'Honeymoon', 'Family'].map(function (type) {
    return '<optgroup label="' + type + '">' + CATALOG.filter(function (p) { return p.type === type; }).map(function (p) {
      return '<option value="' + p.id + '">' + esc(p.title) + ' — ' + rupees(p.price) + ' ' + unitLabel(p) + '</option>';
    }).join('') + '</optgroup>';
  }).join('');
  bForm.start.setAttribute('data-allow-past', '');

  function autoAmount() {
    var p = byId[bForm.package.value];
    var pax = parseInt(bForm.pax.value, 10) || 1;
    if (p) bForm.amount.value = priceFor(p, pax);
  }
  bForm.package.addEventListener('change', autoAmount);
  bForm.pax.addEventListener('input', autoAmount);

  function clearErrors(form) {
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error'); });
    form.querySelectorAll('.error-msg').forEach(function (m) { m.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(function (i) { i.setAttribute('aria-invalid', 'false'); });
  }

  function openBookingModal(id, preset) {
    editingId = id || null;
    clearErrors(bForm);
    var b = id ? state.bookings.find(function (x) { return x.id === id; }) : null;
    document.getElementById('bm-title').textContent = b ? 'Edit booking ' + b.id : 'New booking';
    bForm.package.value = b ? b.pkgId : (preset || 'dom-kerala');
    bForm.start.value = b ? b.start : iso(addDays(new Date(), 30));
    bForm.pax.value = b ? b.pax : 2;
    if (b) bForm.amount.value = b.amount; else autoAmount();
    bForm.paid.value = b ? b.paid : 0;
    bForm.status.value = b ? b.status : 'Pending Payment';
    bModal.showModal();
  }
  document.querySelector('[data-add-booking]').addEventListener('click', function () { openBookingModal(); });

  bForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!WK.validateForm(bForm)) return;
    var amount = parseInt(bForm.amount.value, 10);
    var paid = parseInt(bForm.paid.value, 10);
    if (paid > amount) { WK.setError(bForm.paid, 'Paid amount cannot be more than the total.'); bForm.paid.focus(); return; }
    var data = {
      pkgId: bForm.package.value,
      start: bForm.start.value,
      pax: parseInt(bForm.pax.value, 10),
      amount: amount,
      paid: paid,
      status: bForm.status.value
    };
    if (editingId) {
      var b = state.bookings.find(function (x) { return x.id === editingId; });
      var pkgChanged = b.pkgId !== data.pkgId;
      Object.assign(b, data);
      if (pkgChanged) state.itineraries[b.id] = makeItinerary(b.pkgId);
      toast('Booking ' + b.id + ' updated');
    } else {
      var nb = Object.assign({ id: newBookingId(), created: iso(new Date()) }, data);
      state.bookings.push(nb);
      state.itineraries[nb.id] = makeItinerary(nb.pkgId);
      notify('New booking ' + nb.id + ' created for ' + pkgOf(nb).title + '.', 'bookings');
      toast('Booking ' + nb.id + ' added');
    }
    save();
    bModal.close();
    renderAll();
  });

  // Row / card actions (event delegation)
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-edit]'))) openBookingModal(t.getAttribute('data-edit'));
    if ((t = e.target.closest('[data-delete]'))) {
      var id = t.getAttribute('data-delete');
      var b = state.bookings.find(function (x) { return x.id === id; });
      askConfirm('Delete booking ' + id + ' (' + pkgOf(b).title + ')? Its itinerary and documents will be removed from this dashboard.', 'Delete', function () {
        state.bookings = state.bookings.filter(function (x) { return x.id !== id; });
        delete state.itineraries[id];
        save();
        renderAll();
        toast('Booking ' + id + ' deleted');
      });
    }
    if ((t = e.target.closest('[data-pay]'))) payBooking(t.getAttribute('data-pay'));
    if ((t = e.target.closest('[data-open-itin]'))) {
      itinSelect.value = t.getAttribute('data-open-itin');
      renderItinerary();
      showView('itineraries', true);
    }
  });

  /* 7. ITINERARIES -------------------------------------------------------- */
  var itinSelect = document.querySelector('[data-it-select]');
  var dModal = document.getElementById('day-modal');
  var dForm = document.getElementById('day-form');
  var editingDay = null;

  function renderItinSelect() {
    var current = itinSelect.value;
    var list = sortedBookings().reverse();
    itinSelect.innerHTML = list.map(function (b) {
      return '<option value="' + b.id + '">' + esc(pkgOf(b).title) + ' · ' + fmtShort(b.start) + ' (' + b.id + ')</option>';
    }).join('');
    if (current && list.some(function (b) { return b.id === current; })) itinSelect.value = current;
    else {
      var next = sortedBookings().find(function (b) { return b.status !== 'Cancelled' && daysUntil(b.start) >= 0; });
      if (next) itinSelect.value = next.id;
    }
  }

  function renderItinerary() {
    var id = itinSelect.value;
    var b = state.bookings.find(function (x) { return x.id === id; });
    var head = document.querySelector('[data-it-head]');
    var list = document.querySelector('[data-it-list]');
    var addBtn = document.querySelector('[data-it-add]');
    var dlBtn = document.querySelector('[data-it-download]');
    if (!b) {
      head.innerHTML = '<p>No bookings yet. Add one under My Bookings to start an itinerary.</p>';
      list.innerHTML = '';
      document.querySelector('[data-it-empty]').hidden = true;
      addBtn.disabled = dlBtn.disabled = true;
      return;
    }
    addBtn.disabled = dlBtn.disabled = false;
    var p = pkgOf(b);
    var days = state.itineraries[id] || (state.itineraries[id] = []);
    head.innerHTML = '<img src="' + IMG + p.image + '" alt="">' +
      '<div><h2>' + esc(p.title) + '</h2><p>' + fmtDate(b.start) + ' – ' + fmtDate(endOf(b)) + ' · ' + days.length + ' day' + (days.length === 1 ? '' : 's') + ' planned</p></div>' +
      '<span class="status ' + statusClass(b.status) + '">' + esc(b.status) + '</span>';
    list.innerHTML = days.map(function (d, i) {
      return '<li class="tl-item">' +
        '<span class="tl-no" aria-hidden="true">D' + (i + 1) + '</span>' +
        '<div class="tl-body"><h3><span class="visually-hidden">Day ' + (i + 1) + ': </span>' + esc(d.title) + '</h3>' +
          '<p>' + fmtDate(iso(addDays(parse(b.start), i))) + ' — ' + esc(d.details) + '</p>' +
          (d.stay ? '<p class="stay">🛏 ' + esc(d.stay) + '</p>' : '') +
        '</div>' +
        '<div class="tl-actions">' +
          '<button class="act-btn" type="button" data-day-edit="' + d.id + '" aria-label="Edit day ' + (i + 1) + '" title="Edit">✎</button>' +
          '<button class="act-btn act-btn--danger" type="button" data-day-delete="' + d.id + '" aria-label="Delete day ' + (i + 1) + '" title="Delete">🗑</button>' +
        '</div>' +
      '</li>';
    }).join('');
    document.querySelector('[data-it-empty]').hidden = days.length > 0;
  }
  itinSelect.addEventListener('change', renderItinerary);

  function openDayModal(dayId) {
    clearErrors(dForm);
    var days = state.itineraries[itinSelect.value] || [];
    var d = dayId ? days.find(function (x) { return x.id === dayId; }) : null;
    editingDay = d ? d.id : null;
    document.getElementById('dm-title').textContent = d ? 'Edit day ' + (days.indexOf(d) + 1) : 'Add day ' + (days.length + 1);
    dForm.querySelector('#df-title').value = d ? d.title : '';
    dForm.details.value = d ? d.details : '';
    dForm.stay.value = d ? d.stay : '';
    dModal.showModal();
  }
  document.querySelector('[data-it-add]').addEventListener('click', function () { openDayModal(); });

  dForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!WK.validateForm(dForm)) return;
    var days = state.itineraries[itinSelect.value];
    var data = { title: dForm.querySelector('#df-title').value.trim(), details: dForm.details.value.trim(), stay: dForm.stay.value.trim() };
    if (editingDay) {
      Object.assign(days.find(function (x) { return x.id === editingDay; }), data);
      toast('Day updated');
    } else {
      days.push(Object.assign({ id: uid() }, data));
      toast('Day ' + days.length + ' added');
    }
    save();
    dModal.close();
    renderItinerary();
  });

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-day-edit]'))) openDayModal(t.getAttribute('data-day-edit'));
    if ((t = e.target.closest('[data-day-delete]'))) {
      var dayId = t.getAttribute('data-day-delete');
      askConfirm('Remove this day from the itinerary?', 'Remove', function () {
        state.itineraries[itinSelect.value] = state.itineraries[itinSelect.value].filter(function (d) { return d.id !== dayId; });
        save();
        renderItinerary();
        toast('Day removed');
      });
    }
  });

  document.querySelector('[data-it-download]').addEventListener('click', function () {
    var b = state.bookings.find(function (x) { return x.id === itinSelect.value; });
    if (!b) return;
    var days = state.itineraries[b.id] || [];
    var rows = days.map(function (d, i) {
      return '<tr><td><b>Day ' + (i + 1) + '</b><br>' + fmtDate(iso(addDays(parse(b.start), i))) + '</td><td><b>' + esc(d.title) + '</b><br>' + esc(d.details) + (d.stay ? '<br><i>Stay: ' + esc(d.stay) + '</i>' : '') + '</td></tr>';
    }).join('');
    downloadDoc('Itinerary-' + b.id, 'Itinerary', b, '<table>' + rows + '</table>');
  });

  /* 8. SAVED PACKAGES ----------------------------------------------------- */
  var svSearch = document.querySelector('[data-sv-search]');
  var svType = document.querySelector('[data-sv-type]');

  function renderSaved() {
    var saved = getSaved();
    var q = svSearch.value.trim().toLowerCase();
    var ty = svType.value;
    var list = saved.filter(function (s) {
      return (!ty || s.type === ty) && (!q || s.title.toLowerCase().indexOf(q) > -1);
    });
    document.querySelector('[data-sv-grid]').innerHTML = list.map(function (s) {
      var p = byId[s.id] || s;
      return '<article class="saved-card">' +
        '<img src="' + IMG + esc(s.image) + '" alt="' + esc(s.title) + '" loading="lazy">' +
        '<div class="body">' +
          '<span class="tag">' + esc(s.type) + '</span>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<span class="meta">' + esc(s.duration) + ' · saved ' + timeAgo(new Date(s.savedAt).getTime()).toLowerCase() + '</span>' +
          '<p class="price"><small>from</small><strong>' + rupees(s.price) + '</strong> <span class="per">' + unitLabel(p) + '</span></p>' +
          '<div class="actions">' +
            '<button class="btn btn--sm" type="button" data-book="' + esc(s.id) + '">Book Now</button>' +
            '<a class="act-btn" href="' + esc(s.page || 'domestic.html') + '" aria-label="View ' + esc(s.title) + ' on the website" title="View">↗</a>' +
            '<button class="act-btn act-btn--danger" type="button" data-unsave="' + esc(s.id) + '" aria-label="Remove ' + esc(s.title) + ' from saved" title="Remove">✕</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
    var empty = document.querySelector('[data-sv-empty]');
    empty.hidden = list.length > 0;
    empty.textContent = saved.length ? 'No saved packages match your search.' : 'Nothing saved yet. Tap ♡ on any package on our website, or pick one below.';

    // Suggestions: catalogue items not yet saved
    var ids = saved.map(function (s) { return s.id; });
    var picks = CATALOG.filter(function (p) { return ids.indexOf(p.id) === -1; });
    var offset = new Date().getDate() % Math.max(1, picks.length);
    picks = picks.slice(offset).concat(picks.slice(0, offset)).slice(0, 4);
    document.querySelector('[data-sv-suggest]').innerHTML = picks.map(function (p) {
      return '<article class="saved-card">' +
        '<img src="' + IMG + p.image + '" alt="' + esc(p.title) + '" loading="lazy">' +
        '<div class="body">' +
          '<span class="tag">' + p.type + '</span>' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<span class="meta">' + p.nights + 'N/' + (p.nights + 1) + 'D · ' + esc(p.place) + '</span>' +
          '<p class="price"><small>from</small><strong>' + rupees(p.price) + '</strong> <span class="per">' + unitLabel(p) + '</span></p>' +
          '<div class="actions"><button class="btn btn--sm" type="button" data-save-pkg="' + p.id + '">♡ Save</button></div>' +
        '</div>' +
      '</article>';
    }).join('');
  }
  [svSearch, svType].forEach(function (el) { el.addEventListener('input', renderSaved); el.addEventListener('change', renderSaved); });

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-unsave]'))) {
      var id = t.getAttribute('data-unsave');
      setSaved(getSaved().filter(function (s) { return s.id !== id; }));
      renderAll();
      toast('Removed from saved packages');
    }
    if ((t = e.target.closest('[data-save-pkg]'))) {
      var p = byId[t.getAttribute('data-save-pkg')];
      var list = getSaved();
      list.unshift({ id: p.id, title: p.title, price: p.price, image: p.image, duration: p.nights + 'N/' + (p.nights + 1) + 'D', type: p.type, page: p.page, savedAt: new Date().toISOString() });
      setSaved(list);
      renderAll();
      toast(p.title + ' saved');
    }
    if ((t = e.target.closest('[data-book]'))) {
      var pkgId = t.getAttribute('data-book');
      if (!byId[pkgId]) { toast('This package is no longer available'); return; }
      showView('bookings');
      openBookingModal(null, pkgId);
      var pax = byId[pkgId].type === 'Family' ? 4 : 2;
      bForm.pax.value = pax;
      autoAmount();
    }
  });

  /* 9. DOCUMENTS ---------------------------------------------------------- */
  var docFilter = '';
  function buildDocs() {
    var docs = [];
    sortedBookings().reverse().forEach(function (b) {
      var p = pkgOf(b);
      var num = b.id.replace('WK-', '');
      if (b.paid > 0) docs.push({ type: 'Invoice', name: 'Invoice INV-' + num, booking: b, issued: b.created || b.start, amount: b.paid, ico: '₹' });
      if (b.status === 'Confirmed' || b.status === 'Completed') {
        docs.push({ type: 'E-ticket', name: (p.type === 'Domestic' ? 'Transfers & entry e-ticket ' : 'Flight e-ticket ') + 'ET-' + num, booking: b, issued: b.created || b.start, amount: null, ico: '✈' });
        if (balance(b) === 0) docs.push({ type: 'Hotel voucher', name: 'Hotel voucher HV-' + num, booking: b, issued: b.created || b.start, amount: null, ico: '🛏' });
      }
      if (b.status === 'Cancelled') docs.push({ type: 'Cancellation note', name: 'Cancellation & refund CN-' + num, booking: b, issued: b.start, amount: b.paid, ico: '↺' });
    });
    return docs;
  }
  function renderDocuments() {
    var docs = buildDocs().filter(function (d) { return !docFilter || d.type === docFilter; });
    document.querySelector('[data-doc-rows]').innerHTML = docs.map(function (d, i) {
      return '<tr>' +
        '<td data-label="Document"><div class="doc-type"><span class="doc-ico" aria-hidden="true">' + d.ico + '</span><div><b>' + esc(d.name) + '</b><br><small class="muted">' + d.type + ' · HTML</small></div></div></td>' +
        '<td data-label="Trip">' + esc(pkgOf(d.booking).title) + '<br><small class="muted">' + esc(d.booking.id) + '</small></td>' +
        '<td data-label="Issued" class="nowrap">' + fmtDate(d.issued) + '</td>' +
        '<td data-label="Amount" class="nowrap">' + (d.amount != null ? rupees(d.amount) : '—') + '</td>' +
        '<td><div class="row-actions"><button class="act-btn act-btn--wide" type="button" data-doc="' + i + '" aria-label="Download ' + esc(d.name) + '"><span aria-hidden="true">⤓</span><span>Download</span></button></div></td>' +
      '</tr>';
    }).join('');
    document.querySelector('[data-doc-empty]').hidden = docs.length > 0;
    renderDocuments.current = docs;
  }
  document.querySelectorAll('[data-doc-filter]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      docFilter = chip.getAttribute('data-doc-filter');
      document.querySelectorAll('[data-doc-filter]').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      renderDocuments();
    });
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-doc]');
    if (!t) return;
    var d = renderDocuments.current[parseInt(t.getAttribute('data-doc'), 10)];
    var b = d.booking;
    var p = pkgOf(b);
    var body;
    if (d.type === 'Invoice') {
      var taxable = Math.round(d.amount / 1.05);
      body = '<table><tr><th>Description</th><th>Amount</th></tr>' +
        '<tr><td>' + esc(p.title) + ' — ' + b.pax + ' traveller(s), ' + fmtDate(b.start) + '</td><td>' + rupees(taxable) + '</td></tr>' +
        '<tr><td>GST @ 5% on tour package</td><td>' + rupees(d.amount - taxable) + '</td></tr>' +
        '<tr><th>Amount received</th><th>' + rupees(d.amount) + '</th></tr></table>' +
        '<p>Package value ' + rupees(b.amount) + ' · Balance ' + rupees(balance(b)) + '</p>';
    } else if (d.type === 'E-ticket') {
      body = '<table><tr><th>Passenger(s)</th><td>' + esc(state.profile.name) + (b.pax > 1 ? ' + ' + (b.pax - 1) + ' more' : '') + '</td></tr>' +
        '<tr><th>Outbound</th><td>' + fmtDate(b.start) + ' · from ' + esc(state.profile.airport) + '</td></tr>' +
        '<tr><th>Return</th><td>' + fmtDate(endOf(b)) + '</td></tr>' +
        '<tr><th>PNR</th><td>' + b.id.replace('WK-', 'K') + 'Q</td></tr></table>' +
        '<p>Carry a government photo ID. Airport pick-up is included; your driver will hold a Wanderkite sign.</p>';
    } else if (d.type === 'Hotel voucher') {
      var stays = (state.itineraries[b.id] || []).map(function (x) { return x.stay; }).filter(Boolean);
      stays = stays.filter(function (s, i) { return stays.indexOf(s) === i; });
      body = '<table><tr><th>Guests</th><td>' + b.pax + '</td></tr><tr><th>Check-in</th><td>' + fmtDate(b.start) + '</td></tr><tr><th>Check-out</th><td>' + fmtDate(endOf(b)) + '</td></tr>' +
        '<tr><th>Properties</th><td>' + (stays.length ? stays.map(esc).join('<br>') : 'As per itinerary') + '</td></tr><tr><th>Meal plan</th><td>Daily breakfast</td></tr></table>' +
        '<p>Present this voucher at check-in. Fully prepaid — no payment due at the hotel except personal expenses.</p>';
    } else {
      body = '<p>Booking ' + esc(b.id) + ' for ' + esc(p.title) + ' was cancelled. A refund of <b>' + rupees(d.amount) + '</b> has been processed to the original payment method and should reflect within 7 working days.</p>';
    }
    downloadDoc(d.name.replace(/\s+/g, '-'), d.type, b, body);
  });

  /** Builds a branded, printable HTML document and downloads it. */
  function downloadDoc(filename, title, b, bodyHtml) {
    var p = pkgOf(b);
    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' + esc(title) + ' — ' + esc(b.id) + '</title>' +
      '<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;color:#1B2528;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.55}' +
      'header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:4px solid #F4A12B;padding-bottom:14px;margin-bottom:24px}' +
      'h1{font-family:Georgia,serif;color:#0F5F66;margin:0;font-size:28px}h2{font-family:Georgia,serif;margin:0 0 12px}' +
      'table{width:100%;border-collapse:collapse;margin:16px 0}th,td{text-align:left;padding:10px;border-bottom:1px solid #DCE3E6;vertical-align:top}' +
      'th{background:#F3F5F6}footer{margin-top:40px;font-size:13px;color:#4F5E66;border-top:1px solid #DCE3E6;padding-top:12px}</style></head><body>' +
      '<header><div><h1>Wanderkite Holidays</h1><div>42, 100 Feet Road, Indiranagar, Bengaluru 560038 · +91 80 4718 2290</div></div><div><b>' + esc(title) + '</b><br>' + esc(b.id) + '</div></header>' +
      '<h2>' + esc(p.title) + '</h2>' +
      '<p><b>Traveller:</b> ' + esc(state.profile.name) + ' · ' + esc(state.profile.email) + '<br><b>Dates:</b> ' + fmtDate(b.start) + ' – ' + fmtDate(endOf(b)) + ' · <b>Status:</b> ' + esc(b.status) + '</p>' +
      bodyHtml +
      '<footer>Generated from your Wanderkite traveller dashboard on ' + new Date().toLocaleString('en-IN') + '. 24×7 on-trip help: +91 80 4718 2299.</footer>' +
      '</body></html>';
    var blob = new Blob([html], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Wanderkite-' + filename + '.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Downloaded ' + a.download);
  }

  /* 10. NOTIFICATIONS & USER MENU ---------------------------------------- */
  var notifBtn = document.getElementById('notif-btn');
  var notifPanel = document.getElementById('notif-panel');
  var userBtn = document.getElementById('user-btn');
  var userPanel = document.getElementById('user-panel');

  function togglePop(btn, panel) {
    var open = panel.hidden;
    closePops();
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      var first = panel.querySelector('button, a');
      if (first) first.focus();
    }
  }
  function closePops(returnFocus) {
    [[notifBtn, notifPanel], [userBtn, userPanel]].forEach(function (pair) {
      if (!pair[1].hidden) {
        pair[1].hidden = true;
        pair[0].setAttribute('aria-expanded', 'false');
        if (returnFocus) pair[0].focus();
      }
    });
  }
  notifBtn.addEventListener('click', function (e) { e.stopPropagation(); togglePop(notifBtn, notifPanel); });
  userBtn.addEventListener('click', function (e) { e.stopPropagation(); togglePop(userBtn, userPanel); });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.pop-wrap')) closePops();
  });

  function renderNotifications() {
    var unread = state.notifications.filter(function (n) { return !n.read; }).length;
    var badge = document.querySelector('[data-notif-badge]');
    badge.textContent = unread;
    badge.hidden = unread === 0;
    notifBtn.setAttribute('aria-label', 'Notifications, ' + unread + ' unread');
    var list = document.querySelector('[data-notif-list]');
    list.innerHTML = state.notifications.length ? state.notifications.map(function (n) {
      return '<li><button class="notif-item' + (n.read ? '' : ' is-unread') + '" type="button" data-notif="' + n.id + '">' +
        '<span class="dot-unread" aria-hidden="true"></span><span>' + esc(n.text) + '<time>' + timeAgo(n.time) + (n.read ? '' : ' · unread') + '</time></span></button></li>';
    }).join('') : '<li class="notif-empty">You\'re all caught up.</li>';
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-notif]');
    if (!t) return;
    var n = state.notifications.find(function (x) { return x.id === t.getAttribute('data-notif'); });
    if (n) { n.read = true; save(); renderNotifications(); showView(n.view || 'overview', true); }
  });
  document.querySelector('[data-notif-readall]').addEventListener('click', function () {
    state.notifications.forEach(function (n) { n.read = true; });
    save();
    renderNotifications();
    toast('All notifications marked as read');
  });
  document.querySelector('[data-notif-clear]').addEventListener('click', function () {
    state.notifications = [];
    save();
    renderNotifications();
    toast('Notifications cleared');
  });

  function renderUser() {
    var name = state.profile.name || 'Traveller';
    var parts = name.trim().split(/\s+/);
    var initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    setText('[data-user-initials]', initials);
    setText('[data-user-first]', parts[0]);
    setText('[data-user-name]', name);
    setText('[data-user-email]', state.profile.email);

    // Kite Points tier
    var pts = state.points;
    var tiers = [[0, 'Explorer', 1000], [1000, 'Voyager', 5000], [5000, 'Globetrotter', 10000]];
    var tier = tiers.filter(function (t) { return pts >= t[0]; }).pop();
    setText('[data-points]', pts.toLocaleString('en-IN'));
    setText('[data-tier]', tier[1] + ' tier · ' + Math.max(0, tier[2] - pts).toLocaleString('en-IN') + ' pts to next');
    document.querySelector('[data-points-bar]').style.width = Math.min(100, (pts - tier[0]) / (tier[2] - tier[0]) * 100) + '%';

    // Sidebar counts
    setText('[data-nav-count="bookings"]', state.bookings.length || '');
    setText('[data-nav-count="saved"]', getSaved().length || '');
  }

  /* 11. PROFILE & SETTINGS ----------------------------------------------- */
  var pForm = document.getElementById('profile-form');
  var sForm = document.getElementById('settings-form');

  function renderProfile() {
    pForm.querySelector('#pf-name').value = state.profile.name;
    pForm.email.value = state.profile.email;
    pForm.phone.value = state.profile.phone;
    pForm.airport.value = state.profile.airport;
    var theme = document.documentElement.getAttribute('data-theme');
    var dir = document.documentElement.getAttribute('dir');
    sForm.querySelector('input[name="theme"][value="' + theme + '"]').checked = true;
    sForm.querySelector('input[name="dir"][value="' + dir + '"]').checked = true;
    sForm.emailAlerts.checked = !!state.settings.emailAlerts;
    sForm.whatsapp.checked = !!state.settings.whatsapp;
    sForm.deals.checked = !!state.settings.deals;
  }

  pForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!WK.validateForm(pForm)) return;
    state.profile.name = pForm.querySelector('#pf-name').value.trim();
    state.profile.email = pForm.querySelector('#pf-email').value.trim().toLowerCase();
    state.profile.phone = pForm.phone.value.trim();
    state.profile.airport = pForm.airport.value;
    state.owner = state.profile.email;
    session.name = state.profile.name;
    session.email = state.profile.email;
    store.set('wk-session', session);
    save();
    renderUser();
    toast('Profile saved');
  });

  sForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Read both choices first: applying one re-renders this form
    var theme = sForm.querySelector('input[name="theme"]:checked').value;
    var dir = sForm.querySelector('input[name="dir"]:checked').value;
    WK.applyTheme(theme);
    WK.applyDir(dir);
    state.settings.emailAlerts = sForm.emailAlerts.checked;
    state.settings.whatsapp = sForm.whatsapp.checked;
    state.settings.deals = sForm.deals.checked;
    save();
    toast('Settings saved');
  });
  // Keep the radios in sync when the header toggles are used
  document.addEventListener('wk:themechange', function () { if (currentView === 'profile') renderProfile(); });
  document.addEventListener('wk:dirchange', function () { if (currentView === 'profile') renderProfile(); });

  document.querySelector('[data-reset-demo]').addEventListener('click', function () {
    askConfirm('Reset all bookings, itineraries, notifications and saved packages to the original sample data?', 'Reset', function () {
      state = seed();
      seedSaved();
      save();
      renderAll();
      toast('Demo data restored');
    });
  });

  /* 12. BOOT -------------------------------------------------------------- */
  function renderAll() {
    renderUser();
    renderOverview();
    renderBookings();
    renderItinSelect();
    renderItinerary();
    renderSaved();
    renderDocuments();
    renderNotifications();
    renderProfile();
  }

  // Saved packages may change in another tab (♡ on the website)
  window.addEventListener('storage', function (e) { if (e.key === 'wk-saved') renderAll(); });

  renderAll();
  showView(location.hash.slice(1) || 'overview');
})();
