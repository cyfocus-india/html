/**
 * Lumina Dental & Oral Care Center - Patient Dashboard
 * Views: Overview, Appointments, Treatment History, Prescriptions, Payment Receipts,
 *        Profile & Settings (from the profile button).
 * Data is seeded with realistic sample records and saved to localStorage,
 * so every change survives a page refresh.
 * Tech: vanilla JavaScript + HTML5 canvas (no libraries, no SVG).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'lumina_dashboard_v2';
  var USER_KEY = 'lumina_current_user';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var store = window.LuminaStore || {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    remove: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  var state = null;

  // -------------------------------------------------------------------------
  // Date helpers (dates are stored as local YYYY-MM-DD strings)
  // -------------------------------------------------------------------------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toIso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function todayIso() { return toIso(today()); }

  function shiftDays(days) {
    var d = today();
    d.setDate(d.getDate() + days);
    return d;
  }

  // Move a date forward off Sunday (the clinic is closed on Sundays)
  function clinicDay(days) {
    var d = shiftDays(days);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return toIso(d);
  }

  function formatDate(iso, withWeekday) {
    if (!iso) return '';
    var d = fromIso(iso);
    return (withWeekday ? DAYS[d.getDay()] + ', ' : '') + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function timeAgo(isoStamp) {
    var diff = Date.now() - new Date(isoStamp).getTime();
    var mins = Math.round(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? ' hour ago' : ' hours ago');
    var days = Math.round(hrs / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    return formatDate(toIso(new Date(isoStamp)));
  }

  function money(n) {
    return '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function uid(prefix) { return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  // Escape any text before it is placed into table HTML
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // -------------------------------------------------------------------------
  // Sample data (dates are relative to today so the demo always looks current)
  // -------------------------------------------------------------------------
  function buildSampleData() {
    var nextAligner = clinicDay(9);
    var hoursAgo = function (h) { return new Date(Date.now() - h * 3600000).toISOString(); };
    var year = today().getFullYear();

    return {
      appointments: [
        { id: 'apt-1', doctor: 'Dr. Sarah Lin', specialty: 'Orthodontics', treatment: 'Aligner Progress Check', date: nextAligner, time: '10:00 AM', status: 'upcoming', notes: 'Bring aligner trays 11 and 12' },
        { id: 'apt-2', doctor: 'Dr. Elena Rostova', specialty: 'Cosmetic & Restorative', treatment: 'Cleaning & Check-Up', date: clinicDay(36), time: '08:30 AM', status: 'upcoming', notes: 'Six-month recall visit' },
        { id: 'apt-3', doctor: 'Dr. Elena Rostova', specialty: 'Cosmetic & Restorative', treatment: 'Cleaning & Check-Up', date: clinicDay(-30), time: '02:00 PM', status: 'completed', notes: 'No new cavities, gums healthy' },
        { id: 'apt-4', doctor: 'Dr. Marcus Vance', specialty: 'Oral Surgery', treatment: 'Implant Consultation', date: clinicDay(-52), time: '03:30 PM', status: 'cancelled', notes: 'Cancelled by patient (work travel)' },
        { id: 'apt-5', doctor: 'Dr. Elena Rostova', specialty: 'Cosmetic & Restorative', treatment: 'Tooth-Colored Filling', date: clinicDay(-70), time: '11:30 AM', status: 'completed', notes: 'Tooth #14, three surfaces' },
        { id: 'apt-6', doctor: 'Dr. Elena Rostova', specialty: 'Cosmetic & Restorative', treatment: 'Root Canal Consultation', date: clinicDay(-104), time: '10:00 AM', status: 'completed', notes: 'Treated the same day, tooth #19' }
      ],
      treatments: [
        { id: 'trt-1', date: clinicDay(-30), name: 'Cleaning & Fluoride Varnish', tooth: 'Full mouth', doctor: 'Dr. Elena Rostova', status: 'Completed', category: 'Cleaning', notes: 'Light tartar removed from lower front teeth. Gum pockets 1-3 mm throughout, no bleeding. Fluoride varnish applied. Next cleaning recommended in six months.' },
        { id: 'trt-2', date: clinicDay(-70), name: 'Composite Filling (3 surfaces)', tooth: 'Tooth #14', doctor: 'Dr. Elena Rostova', status: 'Completed', category: 'Restorative', notes: 'Decay removed under local anesthetic and rubber dam. Shade A2 composite placed and LED cured. Bite checked and polished. Two-year warranty applies.' },
        { id: 'trt-3', date: clinicDay(-104), name: 'Root Canal Therapy', tooth: 'Tooth #19', doctor: 'Dr. Elena Rostova', status: 'Completed', category: 'Endodontics', notes: 'Three canals cleaned and sealed in one visit with a bioceramic sealer. Core build-up placed. A crown is recommended within three months.' },
        { id: 'trt-4', date: clinicDay(-200), name: 'Clear Aligner Treatment', tooth: 'Upper & lower arches', doctor: 'Dr. Sarah Lin', status: 'In Progress', category: 'Orthodontics', notes: 'Attachments bonded and trays 1-4 delivered. Crossbite correction on track; currently wearing tray 10 of 18.' }
      ],
      prescriptions: [
        { id: 'rx-1', name: 'Chlorhexidine 0.12% Oral Rinse', doctor: 'Dr. Elena Rostova', date: clinicDay(-30), instructions: 'Swish 15 ml for 30 seconds twice daily after brushing, for 14 days.', refills: 1, status: 'Active' },
        { id: 'rx-2', name: 'Fluoride Toothpaste 5000 ppm', doctor: 'Dr. Sarah Lin', date: clinicDay(-60), instructions: 'Brush for two minutes at bedtime. Spit, do not rinse.', refills: 2, status: 'Active' },
        { id: 'rx-3', name: 'Ibuprofen 600 mg Tablets', doctor: 'Dr. Elena Rostova', date: clinicDay(-104), instructions: 'One tablet every 6 hours with food as needed for pain. Maximum 4 a day.', refills: 0, status: 'Completed' },
        { id: 'rx-4', name: 'Amoxicillin 500 mg Capsules', doctor: 'Dr. Elena Rostova', date: clinicDay(-105), instructions: 'One capsule three times a day for 7 days. Finish the full course.', refills: 0, status: 'Completed' }
      ],
      receipts: [
        { id: 'rec-1', number: 'REC-' + year + '-118', date: clinicDay(-30), desc: 'Cleaning & fluoride varnish (D1110, D1206)', total: 95, insurancePaid: 76, patientShare: 19, status: 'Paid', method: 'Visa ending 4102' },
        { id: 'rec-2', number: 'REC-' + year + '-097', date: clinicDay(-70), desc: 'Composite filling, 3 surfaces, tooth #14 (D2393)', total: 420, insurancePaid: 336, patientShare: 84, status: 'Paid', method: 'Visa ending 4102' },
        { id: 'rec-3', number: 'REC-' + year + '-071', date: clinicDay(-104), desc: 'Root canal, molar #19 (D3330)', total: 790, insurancePaid: 474, patientShare: 316, status: 'Paid', method: 'HSA card ending 7731' },
        { id: 'rec-4', number: 'INV-' + year + '-124', date: clinicDay(-6), desc: 'Clear aligners, installment 5 of 6 (D8090)', total: 367, insurancePaid: 150, patientShare: 217, status: 'Pending', method: '' }
      ],
      notifications: [
        { id: 'n-1', title: 'Appointment reminder', message: 'Aligner check with Dr. Sarah Lin on ' + formatDate(nextAligner) + ' at 10:00 AM.', time: hoursAgo(2), unread: true },
        { id: 'n-2', title: 'Payment due', message: 'Aligner installment 5 of 6: $217.00 is ready to pay.', time: hoursAgo(26), unread: true },
        { id: 'n-3', title: 'Refill approved', message: 'Your chlorhexidine rinse is ready for pickup at your pharmacy.', time: hoursAgo(76), unread: false }
      ]
    };
  }

  // -------------------------------------------------------------------------
  // Persistence
  // -------------------------------------------------------------------------
  function loadData() {
    try { state = JSON.parse(store.get(STORAGE_KEY)); } catch (e) { state = null; }
    if (!state || !Array.isArray(state.appointments)) {
      state = buildSampleData();
    }
    // Upcoming visits whose date has passed are moved to "completed"
    var now = todayIso();
    state.appointments.forEach(function (a) {
      if (a.status === 'upcoming' && a.date < now) a.status = 'completed';
    });
    saveData();
  }

  function saveData() { store.set(STORAGE_KEY, JSON.stringify(state)); }

  function getUser() {
    var user = null;
    try { user = JSON.parse(store.get(USER_KEY)); } catch (e) { user = null; }
    return user || {
      name: 'Eleanor Vance',
      email: 'eleanor.vance@example.com',
      phone: '(415) 555-0192',
      insurance: 'Delta Dental PPO #DLT-89420',
      bloodGroup: 'O+',
      allergies: 'None recorded',
      smsReminders: true,
      emailReceipts: true
    };
  }

  function saveUser(user) { store.set(USER_KEY, JSON.stringify(user)); }

  function addNotification(title, message) {
    state.notifications.unshift({ id: uid('n'), title: title, message: message, time: new Date().toISOString(), unread: true });
    if (state.notifications.length > 12) state.notifications.length = 12;
  }

  // -------------------------------------------------------------------------
  // Toasts (text only, never HTML)
  // -------------------------------------------------------------------------
  function toast(message, type) {
    var box = document.getElementById('toastContainer');
    if (!box) return;
    var el = document.createElement('div');
    el.className = 'toast-msg' + (type === 'error' ? ' toast-error' : '');
    var icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = type === 'error' ? '!' : '✓';
    var text = document.createElement('span');
    text.textContent = message;
    el.appendChild(icon);
    el.appendChild(text);
    box.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    }, 4000);
  }

  // -------------------------------------------------------------------------
  // Modals: open/close, Esc, backdrop click, focus trap, confirm dialog
  // -------------------------------------------------------------------------
  var lastFocus = null;
  var confirmAction = null;

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('is-active');
    document.body.classList.add('modal-open');
    var first = modal.querySelector('input, select, textarea, button:not([data-close-modal])') || modal.querySelector('button');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-active');
    if (!document.querySelector('.modal-backdrop.is-active')) document.body.classList.remove('modal-open');
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  function askConfirm(title, message, okLabel, onOk) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmOkBtn').textContent = okLabel;
    confirmAction = onOk;
    openModal('confirmModal');
  }

  function initModals() {
    document.querySelectorAll('.modal-backdrop').forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(modal);
        if (e.target.closest('[data-print]')) printModal();
      });
    });

    document.getElementById('confirmOkBtn').addEventListener('click', function () {
      var action = confirmAction;
      confirmAction = null;
      closeModal(document.getElementById('confirmModal'));
      if (action) action();
    });

    document.addEventListener('keydown', function (e) {
      var open = document.querySelectorAll('.modal-backdrop.is-active');
      if (!open.length) return;
      var modal = open[open.length - 1];
      if (e.key === 'Escape') {
        closeModal(modal);
      } else if (e.key === 'Tab') {
        var items = Array.prototype.filter.call(
          modal.querySelectorAll('button, input, select, textarea, a[href]'),
          function (el) { return !el.disabled && el.offsetParent !== null; }
        );
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function printModal() {
    document.body.classList.add('is-printing');
    window.print();
    setTimeout(function () { document.body.classList.remove('is-printing'); }, 500);
  }

  // Validate a date input: required, from tomorrow, not a Sunday
  function validClinicDate(input) {
    var group = input.closest('.form-group');
    var v = input.value;
    var ok = !!v && v >= input.min && fromIso(v).getDay() !== 0;
    group.classList.toggle('has-error', !ok);
    if (ok) input.removeAttribute('aria-invalid'); else input.setAttribute('aria-invalid', 'true');
    return ok;
  }

  // -------------------------------------------------------------------------
  // Navigation: sidebar views + mobile slide-in sidebar
  // -------------------------------------------------------------------------
  var sidebar, sidebarToggle, sidebarBackdrop;

  function showView(viewId) {
    document.querySelectorAll('.dash-view').forEach(function (v) { v.classList.toggle('active', v.id === viewId); });
    document.querySelectorAll('.sidebar-nav-btn').forEach(function (b) {
      var on = b.getAttribute('data-view') === viewId;
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    document.getElementById('profileBtn').classList.toggle('active', viewId === 'viewSettings');
    if (viewId === 'viewOverview') renderChart();
    closeSidebar(false);
    var main = document.getElementById('main');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function openSidebar() {
    sidebar.classList.add('is-mobile-open');
    sidebarToggle.classList.add('is-active');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    sidebarBackdrop.classList.add('is-visible');
    document.body.classList.add('menu-open');
    var first = sidebar.querySelector('button');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closeSidebar(returnFocus) {
    if (!sidebar.classList.contains('is-mobile-open')) return;
    sidebar.classList.remove('is-mobile-open');
    sidebarToggle.classList.remove('is-active');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    sidebarBackdrop.classList.remove('is-visible');
    document.body.classList.remove('menu-open');
    if (returnFocus) sidebarToggle.focus();
  }

  function initNavigation() {
    sidebar = document.getElementById('dashSidebar');
    sidebarToggle = document.getElementById('sidebarToggleBtn');
    sidebarBackdrop = document.getElementById('dashSidebarBackdrop');

    document.querySelectorAll('.sidebar-nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { showView(btn.getAttribute('data-view')); });
    });
    document.querySelectorAll('[data-go]').forEach(function (btn) {
      btn.addEventListener('click', function () { showView(btn.getAttribute('data-go')); });
    });
    document.getElementById('profileBtn').addEventListener('click', function () { showView('viewSettings'); });

    sidebarToggle.addEventListener('click', function () {
      if (sidebar.classList.contains('is-mobile-open')) closeSidebar(true); else openSidebar();
    });
    document.getElementById('dashSidebarCloseBtn').addEventListener('click', function () { closeSidebar(true); });
    sidebarBackdrop.addEventListener('click', function () { closeSidebar(true); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-mobile-open')) closeSidebar(true);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeSidebar(false);
    });

    document.querySelectorAll('[data-action="logout"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        askConfirm('Sign out?', 'You will return to the Sign In page. Your records stay saved on this device.', 'Sign Out', function () {
          store.remove(USER_KEY);
          window.location.href = 'signin.html';
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // Notifications
  // -------------------------------------------------------------------------
  function renderNotifications() {
    var list = document.getElementById('notifList');
    var badge = document.getElementById('notifBadge');
    var bell = document.getElementById('notifBellBtn');
    var unread = state.notifications.filter(function (n) { return n.unread; }).length;

    badge.textContent = unread;
    badge.style.display = unread ? 'flex' : 'none';
    bell.setAttribute('aria-label', unread ? 'Notifications, ' + unread + ' unread' : 'Notifications');

    if (!state.notifications.length) {
      list.innerHTML = '<li class="notif-empty">You’re all caught up.</li>';
      return;
    }
    list.innerHTML = state.notifications.map(function (n) {
      return '<li><button type="button" class="notif-item' + (n.unread ? ' unread' : '') + '" data-id="' + esc(n.id) + '">' +
        '<strong>' + esc(n.title) + '</strong>' +
        '<span>' + esc(n.message) + '</span>' +
        '<span class="notif-time">' + esc(timeAgo(n.time)) + '</span></button></li>';
    }).join('');
  }

  function initNotifications() {
    var bell = document.getElementById('notifBellBtn');
    var dropdown = document.getElementById('notifDropdown');
    var wrapper = bell.parentElement;

    function setOpen(open) {
      dropdown.classList.toggle('is-open', open);
      bell.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    bell.addEventListener('click', function () { setOpen(!dropdown.classList.contains('is-open')); });
    document.addEventListener('click', function (e) { if (!wrapper.contains(e.target)) setOpen(false); });
    wrapper.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dropdown.classList.contains('is-open')) { setOpen(false); bell.focus(); }
    });

    document.getElementById('notifClearBtn').addEventListener('click', function () {
      state.notifications.forEach(function (n) { n.unread = false; });
      saveData();
      renderNotifications();
      toast('All notifications marked as read.');
    });

    document.getElementById('notifList').addEventListener('click', function (e) {
      var item = e.target.closest('.notif-item');
      if (!item) return;
      var n = state.notifications.find(function (x) { return x.id === item.getAttribute('data-id'); });
      if (n && n.unread) { n.unread = false; saveData(); renderNotifications(); }
    });
  }

  // -------------------------------------------------------------------------
  // Overview: summary cards, care reminder and canvas chart
  // -------------------------------------------------------------------------
  function upcomingSorted() {
    var now = todayIso();
    return state.appointments
      .filter(function (a) { return a.status === 'upcoming' && a.date >= now; })
      .sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
  }

  function renderMetrics() {
    var user = getUser();
    var first = (user.name || 'there').split(' ')[0];
    document.getElementById('overviewTitle').textContent = 'Welcome back, ' + first;
    document.getElementById('topbarUserName').textContent = user.name || 'Patient';

    var next = upcomingSorted()[0];
    document.getElementById('metricNextApt').textContent = next ? formatDate(next.date) : 'None booked';
    document.getElementById('metricNextAptSub').textContent = next ? next.doctor + ' · ' + next.time.replace(/^0/, '') : 'Book your next check-up';

    var done = state.treatments.filter(function (t) { return t.status === 'Completed'; }).length;
    var inProgress = state.treatments.filter(function (t) { return t.status === 'In Progress'; }).length;
    document.getElementById('metricTrtCount').textContent = done + (done === 1 ? ' treatment' : ' treatments');
    document.getElementById('metricTrtSub').textContent = inProgress ? inProgress + ' in progress' : 'Nothing in progress';

    var active = state.prescriptions.filter(function (r) { return r.status === 'Active'; });
    var refills = active.reduce(function (s, r) { return s + r.refills; }, 0);
    document.getElementById('metricRxCount').textContent = active.length + ' active';
    document.getElementById('metricRxSub').textContent = refills + (refills === 1 ? ' refill available' : ' refills available');

    var due = state.receipts.filter(function (r) { return r.status === 'Pending'; });
    var balance = due.reduce(function (s, r) { return s + r.patientShare; }, 0);
    document.getElementById('metricBalance').textContent = money(balance);
    document.getElementById('metricBalanceSub').textContent = due.length ? due.length + (due.length === 1 ? ' invoice due' : ' invoices due') : 'All invoices paid';

    // Six-month cleaning reminder
    var reminder = document.getElementById('careReminder');
    var bookedClean = upcomingSorted().filter(function (a) { return /clean/i.test(a.treatment); })[0];
    var lastClean = state.treatments
      .filter(function (t) { return t.category === 'Cleaning' && t.status === 'Completed'; })
      .sort(function (a, b) { return b.date.localeCompare(a.date); })[0];
    if (bookedClean) {
      reminder.textContent = 'Your next cleaning is booked for ' + formatDate(bookedClean.date, true) + '.';
    } else if (lastClean) {
      var dueDate = fromIso(lastClean.date);
      dueDate.setMonth(dueDate.getMonth() + 6);
      reminder.textContent = 'Your next cleaning is due around ' + formatDate(toIso(dueDate)) + '. Book it now to keep your preferred time.';
    } else {
      reminder.textContent = 'Book a cleaning and check-up every six months to keep teeth and gums healthy.';
    }
  }

  // Appointments per month (last 4 months + next 2), stacked by status
  function chartData() {
    var base = today();
    base.setDate(1);
    var months = [];
    for (var i = -3; i <= 2; i++) {
      var d = new Date(base.getFullYear(), base.getMonth() + i, 1);
      months.push({ key: d.getFullYear() + '-' + pad(d.getMonth() + 1), label: MONTHS[d.getMonth()], completed: 0, upcoming: 0, cancelled: 0 });
    }
    state.appointments.forEach(function (a) {
      var m = months.find(function (x) { return x.key === a.date.slice(0, 7); });
      if (m && m[a.status] !== undefined) m[a.status]++;
    });
    return months;
  }

  function renderChart() {
    var canvas = document.getElementById('activityChart');
    var data = chartData();

    // The badge and screen-reader summary update even while the Overview is hidden
    var total = data.reduce(function (s, m) { return s + m.completed + m.upcoming + m.cancelled; }, 0);
    document.getElementById('chartBadge').textContent = total + (total === 1 ? ' visit' : ' visits');
    document.getElementById('chartSummary').textContent = 'Appointments per month: ' + data.map(function (m) {
      return m.label + ' ' + m.completed + ' completed, ' + m.upcoming + ' upcoming, ' + m.cancelled + ' cancelled';
    }).join('; ') + '.';

    // The canvas itself is only drawn when it is on screen
    if (!canvas || !canvas.offsetParent) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var css = getComputedStyle(document.documentElement);
    var color = {
      completed: css.getPropertyValue('--primary').trim(),
      upcoming: css.getPropertyValue('--accent').trim(),
      cancelled: css.getPropertyValue('--text-light').trim(),
      grid: css.getPropertyValue('--border').trim(),
      text: css.getPropertyValue('--text-muted').trim()
    };
    var rtl = document.documentElement.getAttribute('dir') === 'rtl';
    var font = getComputedStyle(document.body).fontFamily;

    var W = rect.width;
    var H = rect.height;
    var pad = { top: 16, bottom: 30, side: 34, end: 10 };
    var plotW = W - pad.side - pad.end;
    var plotH = H - pad.top - pad.bottom;
    var maxTotal = Math.max.apply(null, data.map(function (m) { return m.completed + m.upcoming + m.cancelled; }));
    var maxY = Math.max(2, maxTotal + 1);
    var plotX0 = rtl ? pad.end : pad.side;

    ctx.clearRect(0, 0, W, H);
    ctx.font = '12px ' + font;
    ctx.lineWidth = 1;

    // Horizontal grid lines and y-axis labels (labels sit on the start side)
    for (var v = 0; v <= maxY; v++) {
      var y = pad.top + plotH - (v / maxY) * plotH;
      ctx.strokeStyle = color.grid;
      ctx.beginPath();
      ctx.moveTo(plotX0, Math.round(y) + 0.5);
      ctx.lineTo(plotX0 + plotW, Math.round(y) + 0.5);
      ctx.stroke();
      ctx.fillStyle = color.text;
      ctx.textAlign = rtl ? 'left' : 'right';
      ctx.fillText(String(v), rtl ? W - pad.side + 8 : pad.side - 8, y + 4);
    }

    // Stacked bars; month order mirrors in RTL
    var slot = plotW / data.length;
    var barW = Math.min(36, slot * 0.5);
    data.forEach(function (m, i) {
      var idx = rtl ? data.length - 1 - i : i;
      var x = plotX0 + slot * idx + (slot - barW) / 2;
      var yCursor = pad.top + plotH;
      ['completed', 'upcoming', 'cancelled'].forEach(function (k) {
        if (!m[k]) return;
        var h = (m[k] / maxY) * plotH;
        ctx.fillStyle = color[k];
        ctx.fillRect(x, yCursor - h, barW, h - 1);
        yCursor -= h;
      });
      ctx.fillStyle = color.text;
      ctx.textAlign = 'center';
      ctx.fillText(m.label, x + barW / 2, H - 10);
    });
  }

  // -------------------------------------------------------------------------
  // Appointments: list, search, filter, book, reschedule, cancel, delete
  // -------------------------------------------------------------------------
  function renderAppointments() {
    var q = document.getElementById('aptSearchInput').value.trim().toLowerCase();
    var f = document.getElementById('aptFilterSelect').value;
    var tbody = document.getElementById('appointmentsTableBody');

    var list = state.appointments.filter(function (a) {
      var text = (a.doctor + ' ' + a.treatment + ' ' + a.notes + ' ' + a.specialty).toLowerCase();
      return (f === 'all' || a.status === f) && (!q || text.indexOf(q) !== -1);
    }).sort(function (a, b) {
      // Upcoming first (soonest first), then past visits (most recent first)
      if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
      if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
      return a.status === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No appointments match your search.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function (a) {
      var actions = '';
      if (a.status === 'upcoming') {
        actions += '<button type="button" class="action-icon-btn" data-act="reschedule" data-id="' + esc(a.id) + '">Reschedule</button>' +
                   '<button type="button" class="action-icon-btn danger" data-act="cancel" data-id="' + esc(a.id) + '">Cancel</button>';
      }
      actions += '<button type="button" class="action-icon-btn danger" data-act="delete" data-id="' + esc(a.id) + '" aria-label="Delete appointment record">Delete</button>';
      return '<tr>' +
        '<td><strong>' + esc(formatDate(a.date, true)) + '</strong><br><small class="text-muted">' + esc(a.time.replace(/^0/, '')) + '</small></td>' +
        '<td><strong>' + esc(a.doctor) + '</strong><br><small class="text-primary">' + esc(a.specialty) + '</small></td>' +
        '<td>' + esc(a.treatment) + '</td>' +
        '<td><small class="text-muted">' + esc(a.notes || '—') + '</small></td>' +
        '<td><span class="badge-status ' + esc(a.status) + '">' + esc(a.status) + '</span></td>' +
        '<td><div class="table-actions">' + actions + '</div></td>' +
        '</tr>';
    }).join('');
  }

  var rescheduleId = null;

  function setDateLimits(input, value) {
    var min = toIso(shiftDays(1));
    input.min = min;
    var start = value && value >= min ? value : min;
    if (fromIso(start).getDay() === 0) start = toIso(new Date(fromIso(start).getTime() + 86400000));
    input.value = start;
  }

  function initAppointments() {
    document.getElementById('aptSearchInput').addEventListener('input', renderAppointments);
    document.getElementById('aptFilterSelect').addEventListener('change', renderAppointments);

    document.querySelectorAll('[data-open-booking]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var form = document.getElementById('bookAppointmentForm');
        form.reset();
        form.querySelectorAll('.has-error').forEach(function (g) { g.classList.remove('has-error'); });
        setDateLimits(document.getElementById('bookDate'));
        openModal('bookModal');
      });
    });

    document.getElementById('bookAppointmentForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var dateInput = document.getElementById('bookDate');
      if (!validClinicDate(dateInput)) { dateInput.focus(); return; }
      var doctor = document.getElementById('bookDoctor');
      var apt = {
        id: uid('apt'),
        doctor: doctor.value,
        specialty: doctor.options[doctor.selectedIndex].getAttribute('data-specialty'),
        treatment: document.getElementById('bookTreatment').value,
        date: dateInput.value,
        time: document.getElementById('bookTime').value,
        status: 'upcoming',
        notes: document.getElementById('bookNotes').value.trim() || 'Booked online'
      };
      state.appointments.push(apt);
      addNotification('Appointment booked', apt.treatment + ' with ' + apt.doctor + ' on ' + formatDate(apt.date) + ' at ' + apt.time.replace(/^0/, '') + '.');
      saveData();
      closeModal(document.getElementById('bookModal'));
      renderAll();
      toast('Booked: ' + apt.treatment + ' on ' + formatDate(apt.date) + '.');
    });

    document.getElementById('rescheduleForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var apt = state.appointments.find(function (a) { return a.id === rescheduleId; });
      var dateInput = document.getElementById('rescheduleDate');
      if (!apt) return;
      if (!validClinicDate(dateInput)) { dateInput.focus(); return; }
      apt.date = dateInput.value;
      apt.time = document.getElementById('rescheduleTime').value;
      addNotification('Appointment moved', apt.treatment + ' is now on ' + formatDate(apt.date) + ' at ' + apt.time.replace(/^0/, '') + '.');
      saveData();
      closeModal(document.getElementById('rescheduleModal'));
      renderAll();
      toast('Rescheduled to ' + formatDate(apt.date) + ' at ' + apt.time.replace(/^0/, '') + '.');
    });

    // One delegated listener for every row action
    document.getElementById('appointmentsTableBody').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var id = btn.getAttribute('data-id');
      var apt = state.appointments.find(function (a) { return a.id === id; });
      if (!apt) return;
      var act = btn.getAttribute('data-act');

      if (act === 'reschedule') {
        rescheduleId = id;
        document.getElementById('rescheduleDoctorText').textContent = apt.treatment + ' with ' + apt.doctor + ', currently ' + formatDate(apt.date, true) + ' at ' + apt.time.replace(/^0/, '');
        document.getElementById('rescheduleForm').querySelectorAll('.has-error').forEach(function (g) { g.classList.remove('has-error'); });
        setDateLimits(document.getElementById('rescheduleDate'), apt.date);
        document.getElementById('rescheduleTime').value = apt.time;
        openModal('rescheduleModal');
      } else if (act === 'cancel') {
        askConfirm('Cancel this appointment?', apt.treatment + ' with ' + apt.doctor + ' on ' + formatDate(apt.date) + ' will be cancelled.', 'Cancel Appointment', function () {
          apt.status = 'cancelled';
          addNotification('Appointment cancelled', apt.treatment + ' on ' + formatDate(apt.date) + ' was cancelled.');
          saveData();
          renderAll();
          toast('Appointment cancelled.');
        });
      } else if (act === 'delete') {
        askConfirm('Delete this record?', 'The ' + apt.status + ' ' + apt.treatment.toLowerCase() + ' on ' + formatDate(apt.date) + ' will be removed from your list.', 'Delete', function () {
          state.appointments = state.appointments.filter(function (a) { return a.id !== id; });
          saveData();
          renderAll();
          toast('Appointment record deleted.');
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // Treatment history
  // -------------------------------------------------------------------------
  function renderTreatments() {
    var q = document.getElementById('trtSearchInput').value.trim().toLowerCase();
    var f = document.getElementById('trtFilterSelect').value;
    var tbody = document.getElementById('treatmentsTableBody');
    var list = state.treatments.filter(function (t) {
      var text = (t.name + ' ' + t.tooth + ' ' + t.doctor + ' ' + t.notes).toLowerCase();
      return (f === 'all' || t.category === f) && (!q || text.indexOf(q) !== -1);
    }).sort(function (a, b) { return b.date.localeCompare(a.date); });

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No treatments match your search.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (t) {
      var cls = t.status === 'Completed' ? 'completed' : 'upcoming';
      return '<tr>' +
        '<td><strong>' + esc(formatDate(t.date)) + '</strong></td>' +
        '<td><strong>' + esc(t.name) + '</strong><br><small class="text-primary">' + esc(t.category) + '</small></td>' +
        '<td>' + esc(t.tooth) + '</td>' +
        '<td>' + esc(t.doctor) + '</td>' +
        '<td><span class="badge-status ' + cls + '">' + esc(t.status) + '</span></td>' +
        '<td><button type="button" class="action-icon-btn" data-id="' + esc(t.id) + '">View Report</button></td>' +
        '</tr>';
    }).join('');
  }

  function initTreatments() {
    document.getElementById('trtSearchInput').addEventListener('input', renderTreatments);
    document.getElementById('trtFilterSelect').addEventListener('change', renderTreatments);
    document.getElementById('treatmentsTableBody').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-id]');
      if (!btn) return;
      var t = state.treatments.find(function (x) { return x.id === btn.getAttribute('data-id'); });
      if (!t) return;
      document.getElementById('reportTrtName').textContent = t.name;
      document.getElementById('reportTrtDate').textContent = formatDate(t.date);
      document.getElementById('reportPatient').textContent = getUser().name;
      document.getElementById('reportTrtTooth').textContent = t.tooth;
      document.getElementById('reportTrtDoctor').textContent = t.doctor;
      document.getElementById('reportTrtStatus').textContent = t.status;
      document.getElementById('reportTrtNotes').textContent = t.notes;
      openModal('treatmentReportModal');
    });
  }

  // -------------------------------------------------------------------------
  // Prescriptions: search, filter, refill, print
  // -------------------------------------------------------------------------
  function renderPrescriptions() {
    var q = document.getElementById('rxSearchInput').value.trim().toLowerCase();
    var f = document.getElementById('rxFilterSelect').value;
    var tbody = document.getElementById('prescriptionsTableBody');
    var list = state.prescriptions.filter(function (r) {
      var text = (r.name + ' ' + r.doctor + ' ' + r.instructions).toLowerCase();
      return (f === 'all' || r.status === f) && (!q || text.indexOf(q) !== -1);
    }).sort(function (a, b) {
      if (a.status !== b.status) return a.status === 'Active' ? -1 : 1;
      return b.date.localeCompare(a.date);
    });

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No prescriptions match your search.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (r) {
      var refillBtn = r.status === 'Active'
        ? '<button type="button" class="action-icon-btn" data-act="refill" data-id="' + esc(r.id) + '"' + (r.refills ? '' : ' disabled') + '>Refill</button>'
        : '';
      return '<tr>' +
        '<td><strong>' + esc(r.name) + '</strong><br><small class="text-muted">' + esc(r.instructions) + '</small></td>' +
        '<td>' + esc(r.doctor) + '</td>' +
        '<td>' + esc(formatDate(r.date)) + '</td>' +
        '<td>' + esc(r.refills) + ' left</td>' +
        '<td><span class="badge-status ' + esc(r.status.toLowerCase()) + '">' + esc(r.status) + '</span></td>' +
        '<td><div class="table-actions">' + refillBtn +
        '<button type="button" class="action-icon-btn" data-act="print" data-id="' + esc(r.id) + '">View &amp; Print</button></div></td>' +
        '</tr>';
    }).join('');
  }

  function initPrescriptions() {
    document.getElementById('rxSearchInput').addEventListener('input', renderPrescriptions);
    document.getElementById('rxFilterSelect').addEventListener('change', renderPrescriptions);
    document.getElementById('prescriptionsTableBody').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var r = state.prescriptions.find(function (x) { return x.id === btn.getAttribute('data-id'); });
      if (!r) return;

      if (btn.getAttribute('data-act') === 'refill') {
        if (r.refills < 1) {
          toast('No refills left. Book a visit so your dentist can renew it.', 'error');
          return;
        }
        r.refills -= 1;
        addNotification('Refill requested', r.name + ' was sent to your pharmacy. ' + r.refills + ' refill(s) left.');
        saveData();
        renderAll();
        toast('Refill sent to your pharmacy: ' + r.name + '.');
      } else {
        document.getElementById('slipRxDoctor').textContent = r.doctor;
        document.getElementById('slipRxDate').textContent = formatDate(r.date);
        document.getElementById('slipRxRef').textContent = 'Rx ref ' + r.id.toUpperCase();
        document.getElementById('slipRxPatient').textContent = getUser().name;
        document.getElementById('slipRxStatus').textContent = r.status;
        document.getElementById('slipRxDrug').textContent = r.name;
        document.getElementById('slipRxInstructions').textContent = r.instructions;
        document.getElementById('slipRxRefills').textContent = r.refills;
        openModal('rxSlipModal');
      }
    });
  }

  // -------------------------------------------------------------------------
  // Payment receipts: search, filter, pay, view/print
  // -------------------------------------------------------------------------
  function renderReceipts() {
    var q = document.getElementById('recSearchInput').value.trim().toLowerCase();
    var f = document.getElementById('recFilterSelect').value;
    var tbody = document.getElementById('receiptsTableBody');
    var list = state.receipts.filter(function (r) {
      var text = (r.number + ' ' + r.desc).toLowerCase();
      return (f === 'all' || r.status === f) && (!q || text.indexOf(q) !== -1);
    }).sort(function (a, b) {
      if (a.status !== b.status) return a.status === 'Pending' ? -1 : 1;
      return b.date.localeCompare(a.date);
    });

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No statements match your search.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (r) {
      var label = r.status === 'Pending' ? 'Due' : 'Paid';
      return '<tr>' +
        '<td><strong>' + esc(r.number) + '</strong><br><small class="text-muted">' + esc(formatDate(r.date)) + '</small></td>' +
        '<td>' + esc(r.desc) + '</td>' +
        '<td>' + money(r.total) + '</td>' +
        '<td class="text-success">' + money(r.insurancePaid) + '</td>' +
        '<td><strong>' + money(r.patientShare) + '</strong></td>' +
        '<td><span class="badge-status ' + esc(r.status.toLowerCase()) + '">' + label + '</span></td>' +
        '<td><div class="table-actions">' +
        (r.status === 'Pending' ? '<button type="button" class="action-icon-btn primary" data-act="pay" data-id="' + esc(r.id) + '">Pay Now</button>' : '') +
        '<button type="button" class="action-icon-btn" data-act="view" data-id="' + esc(r.id) + '">' + (r.status === 'Pending' ? 'Invoice' : 'Receipt') + '</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
  }

  function openReceipt(r) {
    var user = getUser();
    var paid = r.status === 'Paid';
    document.getElementById('receiptModalTitle').textContent = paid ? 'Payment Receipt' : 'Invoice';
    document.getElementById('slipRecNumber').textContent = r.number;
    document.getElementById('slipRecDate').textContent = formatDate(r.date);
    document.getElementById('slipRecPatient').textContent = user.name;
    document.getElementById('slipRecInsurance').textContent = user.insurance || 'Self-pay';
    var status = document.getElementById('slipRecStatus');
    status.textContent = paid ? 'Paid' : 'Due';
    status.className = 'badge-status ' + (paid ? 'paid' : 'pending');
    document.getElementById('slipRecMethod').textContent = r.method || 'Not paid yet';
    document.getElementById('slipRecDesc').textContent = r.desc;
    document.getElementById('slipRecTotal').textContent = money(r.total);
    document.getElementById('slipRecInsCovered').textContent = '−' + money(r.insurancePaid);
    document.getElementById('slipRecTotalLabel').textContent = paid ? 'You paid:' : 'Amount due:';
    document.getElementById('slipRecPaid').textContent = money(r.patientShare);
    openModal('receiptSlipModal');
  }

  function initReceipts() {
    document.getElementById('recSearchInput').addEventListener('input', renderReceipts);
    document.getElementById('recFilterSelect').addEventListener('change', renderReceipts);
    document.getElementById('receiptsTableBody').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var r = state.receipts.find(function (x) { return x.id === btn.getAttribute('data-id'); });
      if (!r) return;
      if (btn.getAttribute('data-act') === 'view') { openReceipt(r); return; }

      askConfirm('Pay ' + money(r.patientShare) + '?', 'Your Visa ending 4102 will be charged for ' + r.desc + '.', 'Pay ' + money(r.patientShare), function () {
        r.status = 'Paid';
        r.method = 'Visa ending 4102';
        r.number = r.number.replace(/^INV-/, 'REC-');
        addNotification('Payment received', money(r.patientShare) + ' paid for ' + r.desc + '. Receipt ' + r.number + ' is ready.');
        saveData();
        renderAll();
        toast('Payment of ' + money(r.patientShare) + ' received. Thank you!');
      });
    });
  }

  // -------------------------------------------------------------------------
  // Profile & settings
  // -------------------------------------------------------------------------
  function fillSettings() {
    var u = getUser();
    document.getElementById('settName').value = u.name || '';
    document.getElementById('settEmail').value = u.email || '';
    document.getElementById('settPhone').value = u.phone || '';
    document.getElementById('settInsurance').value = u.insurance || '';
    document.getElementById('settBloodGroup').value = u.bloodGroup || 'O+';
    document.getElementById('settAllergies').value = u.allergies || '';
    document.getElementById('prefSms').checked = u.smsReminders !== false;
    document.getElementById('prefEmail').checked = u.emailReceipts !== false;
  }

  function fieldError(input, bad) {
    input.closest('.form-group').classList.toggle('has-error', bad);
    if (bad) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return bad;
  }

  function initSettings() {
    fillSettings();

    document.getElementById('profileSettingsForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('settName');
      var email = document.getElementById('settEmail');
      var phone = document.getElementById('settPhone');
      var bad = false;
      bad = fieldError(name, name.value.trim().length < 2) || bad;
      bad = fieldError(email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) || bad;
      bad = fieldError(phone, phone.value.trim() !== '' && phone.value.replace(/\D/g, '').length < 10) || bad;
      if (bad) { this.querySelector('[aria-invalid="true"]').focus(); return; }

      var u = getUser();
      u.name = name.value.trim();
      u.email = email.value.trim();
      u.phone = phone.value.trim();
      u.insurance = document.getElementById('settInsurance').value.trim();
      u.bloodGroup = document.getElementById('settBloodGroup').value;
      u.allergies = document.getElementById('settAllergies').value.trim();
      saveUser(u);
      renderMetrics();
      toast('Profile saved.');
    });

    document.getElementById('securityPasswordForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var cur = document.getElementById('currentPw');
      var nw = document.getElementById('newPw');
      var cf = document.getElementById('confirmNewPw');
      var bad = false;
      bad = fieldError(cur, !cur.value) || bad;
      bad = fieldError(nw, nw.value.length < 8) || bad;
      bad = fieldError(cf, !cf.value || cf.value !== nw.value) || bad;
      if (bad) { this.querySelector('[aria-invalid="true"]').focus(); return; }
      this.reset();
      toast('Password updated.');
    });

    ['prefSms', 'prefEmail'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', function () {
        var u = getUser();
        u.smsReminders = document.getElementById('prefSms').checked;
        u.emailReceipts = document.getElementById('prefEmail').checked;
        saveUser(u);
        toast('Reminder preferences saved.');
      });
    });
  }

  // -------------------------------------------------------------------------
  // Render everything that depends on the data
  // -------------------------------------------------------------------------
  function renderAll() {
    renderMetrics();
    renderChart();
    renderAppointments();
    renderTreatments();
    renderPrescriptions();
    renderReceipts();
    renderNotifications();
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadData();
    initModals();
    initNavigation();
    initNotifications();
    initAppointments();
    initTreatments();
    initPrescriptions();
    initReceipts();
    initSettings();
    renderAll();

    // Redraw the chart on resize and when theme or direction changes
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderChart, 120);
    });
    document.addEventListener('lumina:themechange', renderChart);
    document.addEventListener('lumina:dirchange', renderChart);
  });
})();
