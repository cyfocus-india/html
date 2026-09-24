/*!
 * Wag & Whisker — dashboard.js
 * Customer account dashboard portal: fully self-contained, zero external redirects.
 * Features:
 *   - Tab section switching & deep linking
 *   - Dynamic interactive pet pack management (add, delete, sync)
 *   - Complete appointment booking, rescheduling, re-booking & cancellation
 *   - Printable order invoices & live order tracking timeline
 *   - Auto-ship subscription management (pause, resume, skip, add)
 *   - In-dashboard wishlist catalog browser & 1-click heart saving
 *   - Real-time profile settings & live appearance theme switching
 *   - In-dashboard session management (sign out modal & demo re-sign in)
 */
(function () {
  'use strict';
  var d = document;
  var root = d.querySelector('[data-dashboard]');
  if (!root) return;

  var WW = window.WW || {};
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function inr(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  function toast(msg, icon) {
    if (WW.toast) {
      WW.toast(msg, icon || 'check-circle');
    } else {
      var r = $('[data-toasts]');
      if (!r) return;
      var t = d.createElement('div');
      t.className = 'toast';
      t.setAttribute('role', 'alert');
      t.textContent = msg;
      r.appendChild(t);
      setTimeout(function () { t.remove(); }, 3200);
    }
  }

  function openModal(id) {
    var modal = d.getElementById(id);
    if (!modal) return;
    if (WW.openOverlay) {
      WW.openOverlay(modal);
    } else {
      modal.hidden = false;
      modal.classList.add('is-open');
      var b = $('[data-backdrop]');
      if (b) b.hidden = false;
    }
  }

  function closeModal(el) {
    var modal = el ? (el.classList.contains('modal') ? el : el.closest('.modal')) : null;
    if (!modal) return;
    if (WW.closeOverlay) {
      WW.closeOverlay(modal);
    } else {
      modal.classList.remove('is-open');
      modal.hidden = true;
      var b = $('[data-backdrop]');
      if (b) b.hidden = true;
    }
  }

  /* --------------------------------------------------
   * 1. Section Switching & Deep Linking
   * -------------------------------------------------- */
  var sections = $$('[data-dash-section]');
  var navLinks = $$('.dash-nav a');
  var animated = {};

  function showSection(id, focus) {
    if (!sections.some(function (s) { return s.getAttribute('data-dash-section') === id; })) {
      id = 'overview';
    }
    sections.forEach(function (s) {
      s.hidden = s.getAttribute('data-dash-section') !== id;
    });
    navLinks.forEach(function (a) {
      if (a.getAttribute('data-dash-link') === id) {
        a.setAttribute('aria-current', 'true');
      } else {
        a.removeAttribute('aria-current');
      }
    });

    if (id === 'overview' && !animated.overview) {
      animated.overview = true;
      animateOverview();
    }
    if (id === 'wishlist') {
      renderWishlist();
    }
    if (focus) {
      var hd = $('[data-dash-section="' + id + '"] h1, [data-dash-section="' + id + '"] h2');
      if (hd) {
        hd.tabIndex = -1;
        hd.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  // Handle all dash link clicks across sidebar, cards, and buttons
  d.addEventListener('click', function (e) {
    var link = e.target.closest('[data-dash-link]');
    if (link) {
      e.preventDefault();
      var targetId = link.getAttribute('data-dash-link');
      history.replaceState(null, '', '#' + targetId);
      showSection(targetId, true);
      return;
    }

    var jump = e.target.closest('[data-dash-jump]');
    if (jump) {
      e.preventDefault();
      var target = jump.getAttribute('data-dash-jump');
      if (target === 'points') {
        showSection('overview', false);
        var pPanel = $('#points-panel');
        if (pPanel) {
          pPanel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        }
      }
      return;
    }
  });

  window.addEventListener('hashchange', function () {
    showSection(location.hash.slice(1), true);
  });

  /* --------------------------------------------------
   * 2. Greeting & Paw Points Ring & Spend Chart
   * -------------------------------------------------- */
  function updateGreeting() {
    var g = $('[data-greeting]');
    if (g) {
      var h = new Date().getHours();
      g.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    }
  }
  updateGreeting();

  function animateOverview() {
    var ring = $('[data-ring]');
    if (ring) {
      var fg = $('.ring__fg', ring);
      var r = 52, c = 2 * Math.PI * r;
      var pct = Math.min(1, parseFloat(ring.getAttribute('data-ring')) / parseFloat(ring.getAttribute('data-ring-max')));
      fg.style.strokeDasharray = c.toFixed(1);
      fg.style.strokeDashoffset = c.toFixed(1);
      requestAnimationFrame(function () {
        setTimeout(function () {
          fg.style.strokeDashoffset = (c * (1 - pct)).toFixed(1);
        }, 200);
      });
    }
    $$('[data-bar-chart] .bar-chart__bar').forEach(function (b, i) {
      setTimeout(function () {
        b.style.height = b.getAttribute('data-h') + '%';
      }, reduce ? 0 : 150 + i * 90);
    });
  }

  /* --------------------------------------------------
   * 3. Profile & Settings Management
   * -------------------------------------------------- */
  var DEFAULT_PROFILE = {
    name: 'Ananya Rao',
    email: 'ananya@example.com',
    phone: '98765 43210',
    pin: '411001',
    whatsapp: true,
    grooming: true,
    newsletter: false
  };

  function getProfile() {
    try {
      var saved = localStorage.getItem('ww-dash-profile');
      return saved ? Object.assign({}, DEFAULT_PROFILE, JSON.parse(saved)) : DEFAULT_PROFILE;
    } catch (err) {
      return DEFAULT_PROFILE;
    }
  }

  function saveProfile(data) {
    try {
      localStorage.setItem('ww-dash-profile', JSON.stringify(data));
    } catch (err) {}
  }

  function applyProfile() {
    var p = getProfile();
    var firstName = p.name.trim().split(' ')[0] || 'Ananya';
    var initials = p.name.trim().split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase() || 'AR';

    var userNameEl = $('[data-dash-user-name]');
    if (userNameEl) userNameEl.textContent = p.name;

    var greetingNameEl = $('[data-dash-greeting-name]');
    if (greetingNameEl) greetingNameEl.textContent = firstName;

    var avatarEl = $('[data-dash-avatar]');
    if (avatarEl) avatarEl.textContent = initials;

    var nameInput = $('#st-name');
    if (nameInput) nameInput.value = p.name;
    var emailInput = $('#st-email');
    if (emailInput) emailInput.value = p.email;
    var phoneInput = $('#st-phone');
    if (phoneInput) phoneInput.value = p.phone;
    var pinInput = $('#st-pin');
    if (pinInput) pinInput.value = p.pin;

    // Appearance radio
    var currentTheme = localStorage.getItem('ww-theme') || 'system';
    var themeRadio = $('input[name="theme-pref"][value="' + currentTheme + '"]');
    if (themeRadio) themeRadio.checked = true;
  }
  applyProfile();

  // Settings form submission
  var settingsForm = $('#dash-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameVal = $('#st-name').value.trim();
      var emailVal = $('#st-email').value.trim();
      var phoneVal = $('#st-phone').value.trim();
      var pinVal = $('#st-pin').value.trim();

      if (!nameVal || nameVal.length < 2) {
        toast('Please enter your full name.', 'alert-circle');
        $('#st-name').focus();
        return;
      }
      if (!emailVal || !emailVal.includes('@')) {
        toast('Please enter a valid email address.', 'alert-circle');
        $('#st-email').focus();
        return;
      }

      var p = getProfile();
      p.name = nameVal;
      p.email = emailVal;
      p.phone = phoneVal;
      p.pin = pinVal;
      saveProfile(p);
      applyProfile();
      toast('Profile settings saved successfully!', 'check-circle');
    });
  }

  // Appearance live switcher in Settings
  $$('[data-theme-choice]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;
      var choice = radio.value;
      if (choice === 'system') {
        try { localStorage.removeItem('ww-theme'); } catch (e) {}
        var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        d.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
      } else {
        try { localStorage.setItem('ww-theme', choice); } catch (e) {}
        d.documentElement.setAttribute('data-theme', choice);
      }
      toast('Appearance updated to ' + choice + ' mode.', 'sun');
    });
  });

  /* --------------------------------------------------
   * 4. My Pets Pack Management
   * -------------------------------------------------- */
  var DEFAULT_PETS = [
    {
      id: 'mango',
      name: 'Mango',
      species: 'Dog',
      breed: 'Corgi',
      age: '3 yrs',
      weight: '11 kg',
      notes: 'Allergic to chicken · Last groom 17 Aug',
      avatar: '../assets/images/pet-mango.webp',
      tint: 'tint-dogs'
    },
    {
      id: 'luna',
      name: 'Luna',
      species: 'Cat',
      breed: 'British Shorthair',
      age: '5 yrs',
      weight: '4.2 kg',
      notes: 'Indoor cat · Vaccines due Nov',
      avatar: '../assets/images/pet-luna.webp',
      tint: 'tint-cats'
    }
  ];

  function getPets() {
    try {
      var saved = localStorage.getItem('ww-dash-pets');
      return saved ? JSON.parse(saved) : DEFAULT_PETS;
    } catch (err) {
      return DEFAULT_PETS;
    }
  }

  function savePets(pets) {
    try {
      localStorage.setItem('ww-dash-pets', JSON.stringify(pets));
    } catch (err) {}
  }

  function renderPets() {
    var grid = $('[data-pets-grid]');
    if (!grid) return;
    var pets = getPets();

    // Update badges
    var badge = $('[data-badge-pets]');
    if (badge) badge.textContent = pets.length;

    // Update booking modal pet picker
    var petSelect = $('#bk-pet');
    if (petSelect) {
      petSelect.innerHTML = pets.map(function (p) {
        return '<option value="' + escapeHTML(p.name + ' (' + p.breed + ')') + '">' + escapeHTML(p.name + ' (' + p.breed + ')') + '</option>';
      }).join('');
    }

    var html = pets.map(function (p) {
      var avatarContent = p.avatar ?
        '<img src="' + escapeHTML(p.avatar) + '" alt="' + escapeHTML(p.name) + '" width="400" height="400" loading="lazy">' :
        '<span style="font-weight:900;font-size:var(--fs-lg)">' + escapeHTML(p.name.charAt(0).toUpperCase()) + '</span>';

      return '<div class="pet-profile ' + escapeHTML(p.tint || 'tint-dogs') + '" data-pet-id="' + escapeHTML(p.id) + '">' +
        '<span class="avatar">' + avatarContent + '</span>' +
        '<div style="flex:1">' +
          '<div class="cluster" style="justify-content:space-between">' +
            '<h3>' + escapeHTML(p.name) + '</h3>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-pet-delete="' + escapeHTML(p.id) + '" aria-label="Remove ' + escapeHTML(p.name) + '" style="padding:2px 8px;font-size:var(--fs-xs);color:var(--text-muted)">Remove</button>' +
          '</div>' +
          '<p>' + escapeHTML(p.breed) + (p.age ? ' · ' + escapeHTML(p.age) : '') + (p.weight ? ' · ' + escapeHTML(p.weight) : '') + '<br>' +
          escapeHTML(p.notes || 'Happy pack member') + '</p>' +
        '</div>' +
      '</div>';
    }).join('');

    html += '<button class="pet-profile pet-profile--add" type="button" data-modal-open="dash-pet-modal">' +
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>Add a pet' +
    '</button>';

    grid.innerHTML = html;
  }

  // Delete pet handler
  d.addEventListener('click', function (e) {
    var delBtn = e.target.closest('[data-pet-delete]');
    if (delBtn) {
      var petId = delBtn.getAttribute('data-pet-delete');
      var pets = getPets().filter(function (p) { return p.id !== petId; });
      savePets(pets);
      renderPets();
      toast('Pet removed from your pack.', 'check');
    }
  });

  // Add pet form submission
  var addPetForm = $('#dash-pet-form');
  if (addPetForm) {
    addPetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#new-pet-name').value.trim();
      var species = $('#new-pet-species').value;
      var breed = $('#new-pet-breed').value.trim();
      var age = $('#new-pet-age').value.trim();
      var weight = $('#new-pet-weight').value.trim();
      var notes = $('#new-pet-notes').value.trim();

      if (!name) {
        toast('Please enter your pet\'s name.', 'alert-circle');
        $('#new-pet-name').focus();
        return;
      }
      if (!breed) {
        toast('Please enter your pet\'s breed.', 'alert-circle');
        $('#new-pet-breed').focus();
        return;
      }

      var tint = species === 'Cat' ? 'tint-cats' :
                 species === 'Bird' ? 'tint-birds' :
                 species === 'Fish' ? 'tint-fish' :
                 species === 'Small Pet' ? 'tint-small' : 'tint-dogs';

      var newPet = {
        id: 'pet-' + Date.now(),
        name: name,
        species: species,
        breed: breed,
        age: age || '1 yr',
        weight: weight || '',
        notes: notes || 'Enjoys playtime and treats',
        avatar: '',
        tint: tint
      };

      var pets = getPets();
      pets.push(newPet);
      savePets(pets);
      renderPets();
      addPetForm.reset();
      closeModal(addPetForm);
      toast(name + ' added to your pack! 🐾', 'heart');
    });
  }
  renderPets();

  /* --------------------------------------------------
   * 5. Grooming Appointments Management
   * -------------------------------------------------- */
  var DEFAULT_APPOINTMENTS = [
    {
      id: 'apt-101',
      pet: 'Mango',
      service: 'Full Groom + teeth brushing',
      date: '14 Sep 2026',
      rawDate: '2026-09-14',
      day: '14',
      month: 'Sep',
      timeSlot: 'Saturday 10:30 AM',
      groomer: 'Neha Joshi',
      price: '₹1,698',
      status: 'upcoming'
    },
    {
      id: 'apt-past-1',
      pet: 'Mango',
      service: 'Bath & Brush',
      date: '17 Aug 2026',
      rawDate: '2026-08-17',
      day: '17',
      month: 'Aug',
      timeSlot: 'Sunday 11:00 AM',
      groomer: 'Neha Joshi',
      price: '₹799',
      status: 'completed'
    },
    {
      id: 'apt-past-2',
      pet: 'Luna',
      service: 'Cat Spa',
      date: '02 Jul 2026',
      rawDate: '2026-07-02',
      day: '02',
      month: 'Jul',
      timeSlot: 'Wednesday 02:30 PM',
      groomer: 'Imran Sayed',
      price: '₹1,699',
      status: 'completed'
    }
  ];

  function getAppointments() {
    try {
      var saved = localStorage.getItem('ww-dash-appointments');
      return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
    } catch (err) {
      return DEFAULT_APPOINTMENTS;
    }
  }

  function saveAppointments(appts) {
    try {
      localStorage.setItem('ww-dash-appointments', JSON.stringify(appts));
    } catch (err) {}
  }

  function renderAppointments() {
    var container = $('[data-appts-container]');
    var appts = getAppointments();

    var upcoming = appts.filter(function (a) { return a.status === 'upcoming'; });
    var badge = $('[data-badge-appointments]');
    if (badge) badge.textContent = upcoming.length;

    // Update Overview upcoming card
    var ovDate = $('[data-ov-next-date]');
    var ovDesc = $('[data-ov-next-desc]');
    var ovApptTitle = $('[data-ov-appt-title]');
    var ovApptMeta = $('[data-ov-appt-meta]');
    var ovApptBadge = $('[data-ov-appt-badge]');

    if (upcoming.length > 0) {
      var next = upcoming[0];
      if (ovDate) ovDate.textContent = next.day + ' ' + next.month;
      if (ovDesc) ovDesc.textContent = next.pet + ' · ' + next.service.split('+')[0].trim();
      if (ovApptTitle) ovApptTitle.textContent = next.pet + ' · ' + next.service;
      if (ovApptMeta) ovApptMeta.textContent = next.timeSlot + ' with ' + next.groomer;
      if (ovApptBadge) ovApptBadge.innerHTML = '<strong>' + escapeHTML(next.day) + '</strong><small>' + escapeHTML(next.month) + '</small>';
    } else {
      if (ovDate) ovDate.textContent = 'None';
      if (ovDesc) ovDesc.textContent = 'Book your next groom';
      if (ovApptTitle) ovApptTitle.textContent = 'No upcoming appointments';
      if (ovApptMeta) ovApptMeta.textContent = 'Click to book a session for your pack';
    }

    if (!container) return;

    var html = appts.map(function (a) {
      if (a.status === 'upcoming') {
        return '<div class="appt" data-appt-id="' + escapeHTML(a.id) + '">' +
          '<div class="appt__date"><strong>' + escapeHTML(a.day) + '</strong><small>' + escapeHTML(a.month) + '</small></div>' +
          '<div style="flex:1">' +
            '<h3>' + escapeHTML(a.pet + ' · ' + a.service) + '</h3>' +
            '<p>' + escapeHTML(a.timeSlot + ' · ' + a.groomer + ' · Est. ' + a.price) + '</p>' +
          '</div>' +
          '<div class="cluster">' +
            '<button class="btn btn-ghost btn-sm" type="button" data-dash-reschedule="' + escapeHTML(a.id) + '">Reschedule</button>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-dash-cancel="' + escapeHTML(a.id) + '" style="color:var(--danger)">Cancel</button>' +
          '</div>' +
        '</div>';
      } else {
        return '<div class="appt" data-appt-id="' + escapeHTML(a.id) + '">' +
          '<div class="appt__date" style="background:var(--surface-sunk);color:var(--text-muted)"><strong>' + escapeHTML(a.day) + '</strong><small>' + escapeHTML(a.month) + '</small></div>' +
          '<div style="flex:1">' +
            '<h3>' + escapeHTML(a.pet + ' · ' + a.service) + '</h3>' +
            '<p>Completed · ' + escapeHTML(a.groomer + ' · ' + a.price) + '</p>' +
          '</div>' +
          '<button class="btn btn-ghost btn-sm" type="button" data-dash-rebook="' + escapeHTML(a.pet) + '" data-service="' + escapeHTML(a.service) + '" data-groomer="' + escapeHTML(a.groomer) + '">Book again</button>' +
        '</div>';
      }
    }).join('');

    container.innerHTML = html;
  }

  // Booking form submission
  var bookingForm = $('#dash-booking-form');
  if (bookingForm) {
    // Default date input to tomorrow
    var dateInput = $('#bk-date');
    if (dateInput) {
      var dTom = new Date();
      dTom.setDate(dTom.getDate() + 2);
      dateInput.min = new Date().toISOString().split('T')[0];
      dateInput.value = dTom.toISOString().split('T')[0];
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var petVal = $('#bk-pet').value.split('(')[0].trim() || 'Mango';
      var serviceVal = $('#bk-service').value.split('(')[0].trim() || 'Full Groom';
      var dateVal = $('#bk-date').value;
      var groomerVal = $('#bk-groomer').value || 'Neha Joshi';
      var slotEl = $('input[name="slot"]:checked', bookingForm);
      var slotVal = slotEl ? slotEl.value : 'Morning 10:30 AM';

      if (!dateVal) {
        toast('Please pick a preferred date.', 'alert-circle');
        return;
      }

      var dObj = new Date(dateVal);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var dayNum = String(dObj.getDate()).padStart(2, '0');
      var monthStr = months[dObj.getMonth()];
      var dayName = days[dObj.getDay()];

      var estPrice = 1499;
      if (serviceVal.includes('Bath')) estPrice = 799;
      else if (serviceVal.includes('Cat Spa')) estPrice = 1699;
      else if (serviceVal.includes('Puppy')) estPrice = 999;
      else if (serviceVal.includes('De-Shedding')) estPrice = 1299;

      if ($('input[name="addon_teeth"]', bookingForm).checked) estPrice += 199;
      if ($('input[name="addon_nails"]', bookingForm).checked) estPrice += 149;
      if ($('input[name="addon_flea"]', bookingForm).checked) estPrice += 249;

      var newAppt = {
        id: 'apt-' + Date.now(),
        pet: petVal,
        service: serviceVal,
        date: dayNum + ' ' + monthStr + ' ' + dObj.getFullYear(),
        rawDate: dateVal,
        day: dayNum,
        month: monthStr,
        timeSlot: dayName + ' ' + slotVal.split(' ')[1] + ' ' + slotVal.split(' ')[2],
        groomer: groomerVal,
        price: inr(estPrice),
        status: 'upcoming'
      };

      var appts = getAppointments();
      appts.unshift(newAppt);
      saveAppointments(appts);
      renderAppointments();
      closeModal(bookingForm);
      toast('Grooming appointment booked for ' + petVal + '! ✂️', 'calendar');
      showSection('appointments', true);
    });
  }

  // Reschedule trigger & form
  var activeReschedAppt = null;
  d.addEventListener('click', function (e) {
    var reschedBtn = e.target.closest('[data-dash-reschedule]');
    if (reschedBtn) {
      var apptId = reschedBtn.getAttribute('data-dash-reschedule');
      var appts = getAppointments();
      activeReschedAppt = appts.find(function (a) { return a.id === apptId; });
      if (activeReschedAppt) {
        var sum = $('[data-resched-summary]');
        if (sum) sum.textContent = 'Reschedule ' + activeReschedAppt.pet + ' · ' + activeReschedAppt.service;
        $('#resched-appt-id').value = activeReschedAppt.id;
        var rDate = $('#resched-date');
        if (rDate) {
          rDate.min = new Date().toISOString().split('T')[0];
          rDate.value = activeReschedAppt.rawDate || new Date().toISOString().split('T')[0];
        }
        openModal('dash-reschedule-modal');
      }
      return;
    }

    // Cancel trigger
    var cancelBtn = e.target.closest('[data-dash-cancel]');
    if (cancelBtn) {
      var cancelId = cancelBtn.getAttribute('data-dash-cancel');
      var currentAppts = getAppointments().filter(function (a) { return a.id !== cancelId; });
      saveAppointments(currentAppts);
      renderAppointments();
      toast('Appointment cancelled.', 'check');
      return;
    }

    // Rebook trigger
    var rebookBtn = e.target.closest('[data-dash-rebook]');
    if (rebookBtn) {
      var rPet = rebookBtn.getAttribute('data-dash-rebook');
      var rService = rebookBtn.getAttribute('data-service');
      var rGroomer = rebookBtn.getAttribute('data-groomer');

      var petSel = $('#bk-pet');
      if (petSel) {
        Array.prototype.slice.call(petSel.options).forEach(function (opt) {
          if (opt.value.includes(rPet)) opt.selected = true;
        });
      }
      var srvSel = $('#bk-service');
      if (srvSel) {
        Array.prototype.slice.call(srvSel.options).forEach(function (opt) {
          if (opt.value.includes(rService)) opt.selected = true;
        });
      }
      var grmSel = $('#bk-groomer');
      if (grmSel && rGroomer) {
        Array.prototype.slice.call(grmSel.options).forEach(function (opt) {
          if (opt.value.includes(rGroomer)) opt.selected = true;
        });
      }
      openModal('dash-booking-modal');
      return;
    }
  });

  // Reschedule form submit
  var reschedForm = $('#dash-reschedule-form');
  if (reschedForm) {
    reschedForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var newDate = $('#resched-date').value;
      var slotEl = $('input[name="resched_slot"]:checked', reschedForm);
      var newSlot = slotEl ? slotEl.value : 'Morning 10:30 AM';

      if (!newDate || !activeReschedAppt) {
        toast('Please pick a date.', 'alert-circle');
        return;
      }

      var dObj = new Date(newDate);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var dayNum = String(dObj.getDate()).padStart(2, '0');
      var monthStr = months[dObj.getMonth()];
      var dayName = days[dObj.getDay()];

      var appts = getAppointments();
      var target = appts.find(function (a) { return a.id === activeReschedAppt.id; });
      if (target) {
        target.date = dayNum + ' ' + monthStr + ' ' + dObj.getFullYear();
        target.rawDate = newDate;
        target.day = dayNum;
        target.month = monthStr;
        target.timeSlot = dayName + ' ' + newSlot.split(' ')[1] + ' ' + newSlot.split(' ')[2];
      }
      saveAppointments(appts);
      renderAppointments();
      closeModal(reschedForm);
      toast('Rescheduled to ' + target.date + ' (' + newSlot + ')!', 'check-circle');
    });
  }
  renderAppointments();

  /* --------------------------------------------------
   * 6. Orders & Invoice Details Modal
   * -------------------------------------------------- */
  var ORDERS = {
    'WW-10507': {
      id: 'WW-10507',
      date: '11 Sep 2026',
      status: 'Processing',
      step: 1,
      items: [{ title: 'Peanut Butter Bone Biscuits · 1 kg', qty: 1, price: 449 }],
      subtotal: 449,
      delivery: 0,
      total: 449,
      points: 45
    },
    'WW-10502': {
      id: 'WW-10502',
      date: '10 Sep 2026',
      status: 'Out for delivery',
      step: 3,
      items: [{ title: 'No-Pull Trail Harness · Forest Green (M)', qty: 1, price: 1799 }],
      subtotal: 1799,
      delivery: 0,
      total: 1799,
      points: 180
    },
    'WW-10482': {
      id: 'WW-10482',
      date: '08 Sep 2026',
      status: 'Delivered',
      step: 4,
      items: [
        { title: 'Grain-Free Chicken Kibble · 3 kg', qty: 1, price: 1499 },
        { title: 'Dental Chews Fresh Mint · 30 Pack', qty: 1, price: 799 },
        { title: 'Catnip Infused Mouse Toy', qty: 1, price: 201 }
      ],
      subtotal: 2499,
      delivery: 0,
      total: 2499,
      points: 250
    },
    'WW-10455': {
      id: 'WW-10455',
      date: '29 Aug 2026',
      status: 'Delivered',
      step: 4,
      items: [{ title: 'Cloud Sherpa Cat Bed · Cream White', qty: 1, price: 1899 }],
      subtotal: 1899,
      delivery: 0,
      total: 1899,
      points: 190
    },
    'WW-10431': {
      id: 'WW-10431',
      date: '21 Aug 2026',
      status: 'Delivered',
      step: 4,
      items: [
        { title: 'Feather Teaser Wand · Natural Feathers', qty: 1, price: 299 },
        { title: 'Jingle Ball Trio · Soft Bell Toys', qty: 1, price: 299 }
      ],
      subtotal: 598,
      delivery: 0,
      total: 598,
      points: 60
    }
  };

  d.addEventListener('click', function (e) {
    var invBtn = e.target.closest('[data-dash-invoice]');
    if (!invBtn) return;
    var orderId = invBtn.getAttribute('data-dash-invoice');
    var order = ORDERS[orderId] || ORDERS['WW-10502'];

    var profile = getProfile();
    var modalContent = $('#dash-invoice-content');
    if (!modalContent) return;

    var statusClass = order.status === 'Delivered' ? 'status--delivered' :
                      order.status === 'Out for delivery' ? 'status--transit' : 'status--processing';

    var steps = ['Order Placed', 'Packed & Prepped', 'Out for Delivery', 'Delivered'];
    var timelineHtml = '<div class="invoice-timeline">' +
      steps.map(function (label, idx) {
        var isDone = (idx + 1) <= order.step;
        return '<div class="invoice-step ' + (isDone ? 'is-done' : '') + '">' +
          '<div class="invoice-step__dot">' + (isDone ? '✓' : (idx + 1)) + '</div>' +
          '<span>' + escapeHTML(label) + '</span>' +
        '</div>';
      }).join('') +
    '</div>';

    var itemsRows = order.items.map(function (it) {
      return '<tr>' +
        '<td><strong>' + escapeHTML(it.title) + '</strong></td>' +
        '<td style="text-align:center">' + it.qty + '</td>' +
        '<td style="text-align:end">' + inr(it.price) + '</td>' +
        '<td style="text-align:end"><strong>' + inr(it.price * it.qty) + '</strong></td>' +
      '</tr>';
    }).join('');

    modalContent.innerHTML =
      '<div class="invoice-card">' +
        '<div class="invoice-card__head">' +
          '<div>' +
            '<h2 id="inv-modal-title" class="h4" style="margin:0">Tax Invoice &amp; Order Details</h2>' +
            '<p class="muted mt-1" style="font-size:var(--fs-sm)">Order <strong>#' + escapeHTML(order.id) + '</strong> · Placed on ' + escapeHTML(order.date) + '</p>' +
          '</div>' +
          '<div><span class="status ' + statusClass + '">' + escapeHTML(order.status) + '</span></div>' +
        '</div>' +

        '<div class="invoice-meta-grid">' +
          '<div><span class="muted">Customer:</span><strong>' + escapeHTML(profile.name) + '</strong></div>' +
          '<div><span class="muted">Delivery address:</span><strong>Koregaon Park, Pune ' + escapeHTML(profile.pin) + '</strong></div>' +
          '<div><span class="muted">Contact mobile:</span><strong class="ltr">' + escapeHTML(profile.phone) + '</strong></div>' +
          '<div><span class="muted">Payment method:</span><strong>UPI / Verified prepaid</strong></div>' +
        '</div>' +

        timelineHtml +

        '<table class="invoice-table">' +
          '<thead>' +
            '<tr><th scope="col">Item description</th><th scope="col" style="text-align:center">Qty</th><th scope="col" style="text-align:end">Price</th><th scope="col" style="text-align:end">Amount</th></tr>' +
          '</thead>' +
          '<tbody>' + itemsRows + '</tbody>' +
        '</table>' +

        '<div class="invoice-totals">' +
          '<div><span>Subtotal</span><span>' + inr(order.subtotal) + '</span></div>' +
          '<div><span>Delivery fee</span><span style="color:var(--success)">FREE</span></div>' +
          '<div><span>Taxes (GST 18% incl.)</span><span>' + inr(Math.round(order.subtotal * 0.18)) + '</span></div>' +
          '<div><span>Paw Points earned</span><span style="color:var(--accent-text)">+' + order.points + ' pts</span></div>' +
          '<div class="total"><span>Total Paid</span><span>' + inr(order.total) + '</span></div>' +
        '</div>' +

        '<div class="invoice-actions">' +
          '<button class="btn btn-ghost" type="button" data-modal-close>Close</button>' +
          '<button class="btn btn-primary" type="button" onclick="window.print()"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>Print receipt</button>' +
        '</div>' +
      '</div>';

    openModal('dash-invoice-modal');
  });

  /* --------------------------------------------------
   * 7. Auto-ship Subscriptions Management
   * -------------------------------------------------- */
  // Active/paused toggle
  d.addEventListener('change', function (e) {
    var toggle = e.target.closest('[data-autoship-toggle]');
    if (toggle) {
      var name = toggle.getAttribute('data-autoship-toggle');
      toggle.nextElementSibling.textContent = toggle.checked ? 'Active' : 'Paused';
      toast(name + (toggle.checked ? ' auto-ship resumed' : ' auto-ship paused'), 'repeat');
    }
  });

  // Skip next delivery
  d.addEventListener('click', function (e) {
    var skipBtn = e.target.closest('[data-autoship-skip]');
    if (skipBtn) {
      var row = skipBtn.closest('[data-autoship-row]');
      var dateEl = $('[data-autoship-date]', row);
      if (dateEl) {
        var current = dateEl.textContent.trim();
        var nextDate = current.includes('18 Sep') ? '16 Oct' : '13 Nov';
        dateEl.textContent = nextDate;
        toast('Next delivery skipped to ' + nextDate + '! 📦', 'check');
      }
    }
  });

  // Add auto-ship subscription form
  var autoAddForm = $('#dash-autoship-add-form');
  if (autoAddForm) {
    autoAddForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var prodVal = $('#auto-product').value;
      var freqVal = $('#auto-freq').value;

      var list = $('[data-autoship-list]');
      if (list) {
        var newCard = d.createElement('div');
        newCard.className = 'appt';
        var autoImg = (prodVal && prodVal.toLowerCase().includes('biscuit')) ? 'p-bone-biscuits.webp' : 'p-kibble.webp';
        newCard.innerHTML =
          '<img src="../assets/images/' + autoImg + '" alt="' + escapeHTML(prodVal) + '" width="64" height="64" loading="lazy" style="width:64px;height:64px;border-radius:14px;object-fit:cover">' +
          '<div>' +
            '<h3>' + escapeHTML(prodVal) + '</h3>' +
            '<p>Every ' + escapeHTML(freqVal) + ' · next delivery 25 Sep · 5% saved</p>' +
          '</div>' +
          '<div class="cluster" style="margin-inline-start:auto">' +
            '<label class="check"><input type="checkbox" checked data-autoship-toggle="' + escapeHTML(prodVal) + '"><span>Active</span></label>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-autoship-skip="custom">Skip next</button>' +
          '</div>';
        list.appendChild(newCard);
      }

      closeModal(autoAddForm);
      toast(prodVal + ' added to auto-ship with 5% savings!', 'check-circle');
    });
  }

  /* --------------------------------------------------
   * 8. Wishlist & In-Dashboard Catalog Browser
   * -------------------------------------------------- */
  function renderWishlist() {
    var grid = $('[data-wishlist-grid]');
    if (!grid || !WW.wishlist || !WW.renderGrid) return;
    var items = WW.wishlist.items().map(WW.product).filter(Boolean);
    WW.renderGrid(grid, items);
    var emptyEl = $('[data-wishlist-empty]');
    if (emptyEl) emptyEl.hidden = items.length > 0;
    var sum = $('[data-wishlist-summary]');
    if (sum) sum.textContent = items.length ? items.length + (items.length === 1 ? ' saved item' : ' saved items') : '';
  }

  d.addEventListener('ww:wishlist', function () {
    if (!$('[data-dash-section="wishlist"]').hidden) renderWishlist();
    renderBrowseGrid();
  });

  // Render browse catalog modal with live heart toggles
  function renderBrowseGrid() {
    var bGrid = $('#dash-browse-grid');
    if (!bGrid) return;
    var allProducts = (WW.data && WW.data.products) ? WW.data.products : [];
    var savedIds = (WW.wishlist && WW.wishlist.items) ? WW.wishlist.items() : [];

    // Feature first 6 products
    var featured = allProducts.slice(0, 6);
    if (!featured.length) return;

    bGrid.innerHTML = featured.map(function (p) {
      var isFav = savedIds.indexOf(p.id) !== -1;
      var imgName = p.img || p.image || 'p-kibble';
      if (!/\.(webp|jpg|jpeg|png|svg)$/i.test(imgName)) {
        imgName += '.webp';
      }
      var imgSrc = '../assets/images/' + imgName;
      return '<div class="product-card" data-browse-product="' + escapeHTML(p.id) + '">' +
        '<div class="product-card__media">' +
          '<img src="' + escapeHTML(imgSrc) + '" alt="' + escapeHTML(p.alt || p.name) + '" width="400" height="400" loading="lazy">' +
          '<button class="wishlist-btn ' + (isFav ? 'is-active' : '') + '" type="button" data-wishlist-toggle="' + escapeHTML(p.id) + '" aria-label="Save ' + escapeHTML(p.name) + ' to wishlist" aria-pressed="' + (isFav ? 'true' : 'false') + '">' +
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h3 class="product-card__title" style="font-size:var(--fs-sm)">' + escapeHTML(p.name) + '</h3>' +
          '<div class="product-card__foot mt-2">' +
            '<span class="product-card__price"><strong>' + inr(p.price) + '</strong></span>' +
            '<button class="btn btn-outline btn-xs" type="button" data-wishlist-toggle="' + escapeHTML(p.id) + '">' + (isFav ? 'Saved' : 'Save') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Wishlist toggle event in browse modal
  d.addEventListener('click', function (e) {
    var wBtn = e.target.closest('[data-wishlist-toggle]');
    if (!wBtn) return;
    e.preventDefault();
    var pId = wBtn.getAttribute('data-wishlist-toggle');
    if (!pId) return;

    var currentWish = [];
    try {
      var raw = localStorage.getItem('ww-wishlist');
      currentWish = raw ? JSON.parse(raw) : [];
    } catch (err) {}

    var idx = currentWish.indexOf(pId);
    if (idx === -1) {
      currentWish.push(pId);
      toast('Item saved to your pack wishlist! ❤️', 'heart');
    } else {
      currentWish.splice(idx, 1);
      toast('Item removed from wishlist.', 'check');
    }

    try {
      localStorage.setItem('ww-wishlist', JSON.stringify(currentWish));
    } catch (err) {}

    d.dispatchEvent(new CustomEvent('ww:wishlist', { detail: { items: currentWish } }));
  });

  /* --------------------------------------------------
   * 9. Sign Out Session Management
   * -------------------------------------------------- */
  // Guarantee sign-out modal triggers reliably across desktop, tablet & mobile touch
  d.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-open="dash-signout-modal"], .dash-nav__btn');
    if (trigger) {
      e.preventDefault();
      openModal('dash-signout-modal');
    }
  });

  var confirmSignoutBtn = $('#dash-confirm-signout');
  if (confirmSignoutBtn) {
    confirmSignoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal(confirmSignoutBtn);
      try {
        sessionStorage.setItem('ww-signed-out', 'true');
      } catch (err) {}
      toast('Signed out successfully. Redirecting to sign in…', 'check-circle');
      setTimeout(function () {
        window.location.href = 'signin.html';
      }, 500);
    });
  }

  /* --------------------------------------------------
   * 10. Zero External Redirection Guard
   * -------------------------------------------------- */
  root.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;

    // Allow brand logo navigation to home
    if (a.classList.contains('brand') || a.closest('.brand')) return;

    // If it's an anchor to a hash inside the dashboard, allow standard behavior
    if (href.startsWith('#')) return;

    // Any other link clicked inside the dashboard is prevented and handled within dashboard
    e.preventDefault();
    if (href.includes('contact') || href.includes('service')) {
      openModal('dash-booking-modal');
    } else if (href.includes('shop') || href.includes('product')) {
      openModal('dash-browse-modal');
    } else if (href.includes('signin') || href.includes('signup')) {
      openModal('dash-signout-modal');
    }
  });

  // Initial show based on hash
  renderBrowseGrid();
  showSection(location.hash.slice(1) || 'overview', false);
})();

