/**
 * AURA YOGA & WELLNESS SANCTUARY - MEMBER DASHBOARD APPLICATION
 * Complete state management, localStorage persistence, Canvas-rendered charts,
 * slot booking, cancellation, pack tracking, membership management, and profile editing.
 * Zero external libraries. Zero SVG.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'aura_dashboard_state';

  // -------------------------------------------------------------------------
  // 1. Initial State Definition
  // -------------------------------------------------------------------------
  const defaultState = {
    user: {
      name: 'Dr. Elena Rostova',
      email: 'elena@aurayoga.com',
      phone: '(555) 728-1940',
      emergencyContact: 'Dmitri Rostova &bull; (555) 728-1941',
      injuries: 'Right shoulder impingement (avoid excessive chaturangas; gentle modifications)',
      level: 'Intermediate',
      memberSince: 'October 2024',
      reminders: true,
      waitlistAlerts: true
    },
    membership: {
      tier: 'Aura Studio Unlimited',
      price: '$165 / month',
      status: 'Active',
      autoRenew: true,
      nextBillingDate: 'Nov 1, 2026',
      freezeStatus: 'None',
      freezeUntil: null,
      guestPassesRemaining: 1
    },
    classPack: {
      tierName: '10-Class Pack (Guest / Backup)',
      total: 10,
      used: 7,
      remaining: 3,
      expiryDate: 'Jan 15, 2027'
    },
    practiceStreak: {
      currentStreakDays: 14,
      sessionsThisWeek: 4,
      totalLifetimeSessions: 142
    },
    chartWeeklySessions: [3, 4, 3, 5, 4, 4], // Last 6 weeks session counts
    upcomingBookings: [
      {
        id: 'b-101',
        title: 'Solar Prana Vinyasa',
        instructor: 'Maya Chen',
        date: 'Tomorrow, Oct 14',
        time: '09:00 AM – 10:15 AM',
        room: 'Studio A (Bamboo Radiant)',
        style: 'vinyasa',
        status: 'Confirmed'
      },
      {
        id: 'b-102',
        title: 'Lunar Yin & Quartz Sound Bath',
        instructor: 'Soren Lind',
        date: 'Thursday, Oct 16',
        time: '07:00 PM – 08:15 PM',
        room: 'Sanctuary Loft',
        style: 'yin',
        status: 'Confirmed'
      }
    ],
    availableClasses: [
      {
        id: 'c-201',
        title: 'Solar Prana Vinyasa',
        instructor: 'Maya Chen',
        day: 'Monday',
        dateStr: 'Oct 14',
        time: '09:00 AM – 10:15 AM',
        room: 'Studio A',
        style: 'vinyasa',
        capacityMax: 18,
        capacityBooked: 14
      },
      {
        id: 'c-202',
        title: 'Midday Alignment & Core',
        instructor: 'Amara Okafor',
        day: 'Monday',
        dateStr: 'Oct 14',
        time: '12:15 PM – 01:00 PM',
        room: 'Studio B',
        style: 'hatha',
        capacityMax: 16,
        capacityBooked: 11
      },
      {
        id: 'c-203',
        title: 'Dawn Ashtanga Mysore',
        instructor: 'Julian Vance',
        day: 'Tuesday',
        dateStr: 'Oct 15',
        time: '06:30 AM – 07:30 AM',
        room: 'Studio A',
        style: 'ashtanga',
        capacityMax: 14,
        capacityBooked: 9
      },
      {
        id: 'c-204',
        title: 'Restorative Somatics & Nidra',
        instructor: 'Priya Sharma',
        day: 'Tuesday',
        dateStr: 'Oct 15',
        time: '06:00 PM – 07:00 PM',
        room: 'Sanctuary Loft',
        style: 'restorative',
        capacityMax: 20,
        capacityBooked: 17
      },
      {
        id: 'c-205',
        title: 'Pranayama & Nervous Reset',
        instructor: 'Priya Sharma',
        day: 'Wednesday',
        dateStr: 'Oct 16',
        time: '07:30 AM – 08:15 AM',
        room: 'Sanctuary Loft',
        style: 'pranayama',
        capacityMax: 16,
        capacityBooked: 8
      },
      {
        id: 'c-206',
        title: 'Power Flow & Arm Balance',
        instructor: 'Daniel Cruz',
        day: 'Wednesday',
        dateStr: 'Oct 16',
        time: '05:30 PM – 06:45 PM',
        room: 'Studio A',
        style: 'vinyasa',
        capacityMax: 18,
        capacityBooked: 15
      },
      {
        id: 'c-207',
        title: 'Lunar Yin & Quartz Sound Bath',
        instructor: 'Soren Lind',
        day: 'Thursday',
        dateStr: 'Oct 17',
        time: '07:00 PM – 08:15 PM',
        room: 'Sanctuary Loft',
        style: 'yin',
        capacityMax: 20,
        capacityBooked: 18
      },
      {
        id: 'c-208',
        title: 'Classical Hatha Biomechanics',
        instructor: 'Amara Okafor',
        day: 'Friday',
        dateStr: 'Oct 18',
        time: '10:00 AM – 11:15 AM',
        room: 'Studio B',
        style: 'hatha',
        capacityMax: 16,
        capacityBooked: 10
      },
      {
        id: 'c-209',
        title: 'Weekend Full Spectrum Flow',
        instructor: 'Maya Chen',
        day: 'Saturday',
        dateStr: 'Oct 19',
        time: '09:00 AM – 10:30 AM',
        room: 'Studio A',
        style: 'vinyasa',
        capacityMax: 22,
        capacityBooked: 21
      },
      {
        id: 'c-210',
        title: 'Sunday Sound Sanctuary Immersion',
        instructor: 'Soren Lind',
        day: 'Sunday',
        dateStr: 'Oct 20',
        time: '05:00 PM – 06:30 PM',
        room: 'Sanctuary Loft',
        style: 'yin',
        capacityMax: 22,
        capacityBooked: 16
      }
    ],
    notifications: [
      {
        id: 'n-1',
        text: 'Class Confirmed: Solar Prana Vinyasa with Maya Chen tomorrow at 9:00 AM.',
        time: '2 hours ago',
        read: false
      },
      {
        id: 'n-2',
        text: 'Your 10-Class Backup Pack has 3 sessions remaining.',
        time: 'Yesterday',
        read: false
      },
      {
        id: 'n-3',
        text: 'Full Moon Sound Bath tickets now available with 15% member discount.',
        time: '3 days ago',
        read: true
      }
    ]
  };

  let state = {};

  // -------------------------------------------------------------------------
  // 2. State Storage Helpers
  // -------------------------------------------------------------------------
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = JSON.parse(saved);
      } else {
        state = JSON.parse(JSON.stringify(defaultState));
        // If a newly signed up user exists in session
        const activeUser = localStorage.getItem('aura_active_user');
        if (activeUser) {
          const parsed = JSON.parse(activeUser);
          if (parsed.name) state.user.name = parsed.name;
          if (parsed.email) state.user.email = parsed.email;
          if (parsed.level) state.user.level = parsed.level;
        }
        saveState();
      }
    } catch (e) {
      console.error('Error loading dashboard state', e);
      state = JSON.parse(JSON.stringify(defaultState));
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving dashboard state', e);
    }
  }

  // -------------------------------------------------------------------------
  // 3. UI Toast Messenger
  // -------------------------------------------------------------------------
  function showToast(message) {
    let toast = document.getElementById('dash-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dash-toast';
      toast.className = 'dash-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // 4. Tab / View Switching
  // -------------------------------------------------------------------------
  function initNavigation() {
    const navButtons = document.querySelectorAll('.dash-nav-btn[data-target-view]');
    const views = document.querySelectorAll('.dash-view');

    navButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const targetViewId = btn.getAttribute('data-target-view');
        switchView(targetViewId);

        // Close mobile sidebar if open
        const sidebar = document.querySelector('.dash-sidebar');
        const backdrop = document.querySelector('.dash-sidebar-backdrop');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          if (backdrop) backdrop.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      });
    });

    // Also support quick links with data-target-view (e.g. from Overview cards)
    document.querySelectorAll('[data-target-view]:not(.dash-nav-btn)').forEach((el) => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        const targetViewId = el.getAttribute('data-target-view');
        switchView(targetViewId);
      });
    });
  }

  function switchView(viewId) {
    const views = document.querySelectorAll('.dash-view');
    const navButtons = document.querySelectorAll('.dash-nav-btn[data-target-view]');

    views.forEach((v) => {
      if (v.id === viewId) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });

    navButtons.forEach((b) => {
      if (b.getAttribute('data-target-view') === viewId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // If switching to overview, redraw chart
    if (viewId === 'view-overview') {
      renderCanvasChart();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // -------------------------------------------------------------------------
  // 5. Render Metric Cards & Overview
  // -------------------------------------------------------------------------
  function renderMetrics() {
    // User display name & avatar initial
    const userNameEls = document.querySelectorAll('.user-display-name');
    userNameEls.forEach((el) => (el.textContent = state.user.name));

    const userInitialEls = document.querySelectorAll('.user-initial');
    userInitialEls.forEach((el) => {
      const initial = state.user.name ? state.user.name.charAt(0).toUpperCase() : 'A';
      el.textContent = initial;
    });

    // Active Membership
    const tierNameEl = document.getElementById('kpi-membership-tier');
    const renewDateEl = document.getElementById('kpi-renewal-date');
    if (tierNameEl) tierNameEl.textContent = state.membership.tier;
    if (renewDateEl) {
      if (state.membership.freezeStatus !== 'None') {
        renewDateEl.textContent = `Frozen until ${state.membership.freezeUntil || 'TBD'}`;
        renewDateEl.style.color = 'var(--warning)';
      } else {
        renewDateEl.textContent = `Renews ${state.membership.nextBillingDate}`;
        renewDateEl.style.color = 'var(--text-muted)';
      }
    }

    // Class Pack Tracker
    const packCountEl = document.getElementById('kpi-pack-count');
    const packSubEl = document.getElementById('kpi-pack-subtext');
    const packFillEl = document.getElementById('kpi-pack-fill');
    if (packCountEl) {
      packCountEl.textContent = `${state.classPack.remaining} of ${state.classPack.total}`;
    }
    if (packSubEl) {
      packSubEl.textContent = `${state.classPack.used} used &bull; Exp: ${state.classPack.expiryDate}`;
    }
    if (packFillEl) {
      const pct = Math.min(100, Math.round((state.classPack.used / state.classPack.total) * 100));
      packFillEl.style.width = `${pct}%`;
    }

    // Upcoming Bookings KPI
    const bookingsCountEl = document.getElementById('kpi-bookings-count');
    if (bookingsCountEl) {
      bookingsCountEl.textContent = `${state.upcomingBookings.length} Reserved`;
    }

    // Practice Streak KPI
    const streakEl = document.getElementById('kpi-streak-count');
    if (streakEl) {
      streakEl.textContent = `${state.practiceStreak.currentStreakDays} Days`;
    }
  }

  // -------------------------------------------------------------------------
  // 6. HTML5 Canvas Chart: Weekly Practice Volume (ZERO SVG)
  // -------------------------------------------------------------------------
  function renderCanvasChart() {
    const canvas = document.getElementById('practice-canvas-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match display container pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Detect theme colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#A6B4AC' : '#526058';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const barColorPrimary = isDark ? '#5A8371' : '#4A6B5D';
    const barColorAccent = isDark ? '#D4AC7F' : '#C49A6C';

    ctx.clearRect(0, 0, w, h);

    const data = state.chartWeeklySessions || [3, 4, 3, 5, 4, 4];
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'This Week'];
    const maxVal = 6;

    const padLeft = 40;
    const padRight = 20;
    const padTop = 25;
    const padBottom = 35;

    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Draw horizontal grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = gridColor;
    ctx.font = '11px -apple-system, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';

    for (let i = 0; i <= maxVal; i += 2) {
      const y = padTop + chartH - (i / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      ctx.fillText(i + ' sess', padLeft - 8, y + 4);
    }

    // Draw Bars
    const barCount = data.length;
    const step = chartW / barCount;
    const barWidth = Math.min(36, step * 0.55);

    ctx.textAlign = 'center';

    data.forEach((val, idx) => {
      const xCenter = padLeft + idx * step + step / 2;
      const barH = (val / maxVal) * chartH;
      const y = padTop + chartH - barH;

      // Create subtle gradient for bars
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      if (idx === barCount - 1) {
        grad.addColorStop(0, barColorAccent);
        grad.addColorStop(1, '#AF8558');
      } else {
        grad.addColorStop(0, barColorPrimary);
        grad.addColorStop(1, '#375347');
      }

      ctx.fillStyle = grad;
      // Draw rounded top bar
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(xCenter - barWidth / 2, y + barH);
      ctx.lineTo(xCenter - barWidth / 2, y + radius);
      ctx.quadraticCurveTo(xCenter - barWidth / 2, y, xCenter - barWidth / 2 + radius, y);
      ctx.lineTo(xCenter + barWidth / 2 - radius, y);
      ctx.quadraticCurveTo(xCenter + barWidth / 2, y, xCenter + barWidth / 2, y + radius);
      ctx.lineTo(xCenter + barWidth / 2, y + barH);
      ctx.closePath();
      ctx.fill();

      // Draw value on top of bar
      ctx.fillStyle = isDark ? '#ECE9E2' : '#1C2420';
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.fillText(val.toString(), xCenter, y - 6);

      // Draw X Axis Label
      ctx.fillStyle = textColor;
      ctx.font = '11px -apple-system, sans-serif';
      ctx.fillText(labels[idx], xCenter, h - 12);
    });
  }

  // -------------------------------------------------------------------------
  // 7. Render Upcoming Bookings
  // -------------------------------------------------------------------------
  function renderUpcomingBookings() {
    const container = document.getElementById('upcoming-bookings-list');
    const scheduleContainer = document.getElementById('my-schedule-bookings-list');

    const html = state.upcomingBookings.length === 0
      ? `<div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">&#9788;</div>
          <h4>No Upcoming Classes Reserved</h4>
          <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">Explore our weekly schedule and reserve a spot on your mat.</p>
          <button type="button" class="btn btn-primary btn-sm" data-target-view="view-book">Book a Class Slot</button>
        </div>`
      : state.upcomingBookings
          .map((b) => {
            return `
              <div class="slot-card" data-booking-id="${b.id}">
                <div class="slot-time-col">
                  <div class="slot-time">${b.time}</div>
                  <div class="slot-room">${b.date}</div>
                </div>
                <div class="slot-info-col">
                  <div class="slot-header-row">
                    <h4 class="slot-title">${b.title}</h4>
                    <span class="slot-capacity-pill available">&#10003; ${b.status}</span>
                  </div>
                  <div class="slot-instructor">Instructor: <strong>${b.instructor}</strong> &bull; Location: ${b.room.replace(/Studio\s+([A-Z])/g, 'Studio&nbsp;$1')}</div>
                </div>
                <div class="slot-actions">
                  <button type="button" class="btn btn-secondary btn-sm cal-add-btn" data-title="${b.title}" data-time="${b.time}" data-date="${b.date}">+ Calendar</button>
                  <button type="button" class="btn btn-secondary btn-sm cancel-booking-btn" data-booking-id="${b.id}" style="color: var(--danger); border-color: rgba(179,57,57,0.3);">Cancel</button>
                </div>
              </div>
            `;
          })
          .join('');

    if (container) container.innerHTML = html;
    if (scheduleContainer) scheduleContainer.innerHTML = html;

    // Attach cancel booking handlers
    document.querySelectorAll('.cancel-booking-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-booking-id');
        cancelBooking(id);
      });
    });

    // Calendar sync simulation
    document.querySelectorAll('.cal-add-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const title = btn.getAttribute('data-title');
        showToast(`Event added to your calendar: ${title}`);
      });
    });

    // Re-bind view switches inside empty state
    document.querySelectorAll('[data-target-view]:not(.dash-nav-btn)').forEach((el) => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        const targetViewId = el.getAttribute('data-target-view');
        switchView(targetViewId);
      });
    });
  }

  function cancelBooking(bookingId) {
    const booking = state.upcomingBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    if (!confirm(`Cancel your reservation for ${booking.title} on ${booking.date}?`)) {
      return;
    }

    // Remove from bookings
    state.upcomingBookings = state.upcomingBookings.filter((b) => b.id !== bookingId);

    // Restore class slot capacity if applicable
    const slot = state.availableClasses.find((c) => c.title === booking.title);
    if (slot && slot.capacityBooked > 0) {
      slot.capacityBooked -= 1;
    }

    // Refund class pack credit if on pack
    if (state.classPack.remaining < state.classPack.total) {
      state.classPack.remaining += 1;
      state.classPack.used = Math.max(0, state.classPack.used - 1);
    }

    saveState();
    renderMetrics();
    renderUpcomingBookings();
    renderAvailableSlots();
    showToast(`Reservation for ${booking.title} cancelled. Credit restored.`);
  }

  // -------------------------------------------------------------------------
  // 8. Render Bookable Class Schedule with Live Search & Filter
  // -------------------------------------------------------------------------
  function renderAvailableSlots() {
    const container = document.getElementById('available-slots-list');
    if (!container) return;

    const searchTerm = (document.getElementById('slot-search-input')?.value || '').toLowerCase().trim();
    const styleFilter = document.getElementById('slot-style-filter')?.value || 'all';
    const dayFilter = document.getElementById('slot-day-filter')?.value || 'all';

    const alreadyBookedTitles = state.upcomingBookings.map((b) => b.title);

    const filtered = state.availableClasses.filter((slot) => {
      const matchesSearch =
        slot.title.toLowerCase().includes(searchTerm) || slot.instructor.toLowerCase().includes(searchTerm);
      const matchesStyle = styleFilter === 'all' || slot.style === styleFilter;
      const matchesDay = dayFilter === 'all' || slot.day.toLowerCase() === dayFilter.toLowerCase();
      return matchesSearch && matchesStyle && matchesDay;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
          <h4>No matching classes found</h4>
          <p style="font-size: 0.9rem;">Try broadening your style or day filter selections.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered
      .map((slot) => {
        const isBooked = alreadyBookedTitles.includes(slot.title);
        const spotsLeft = slot.capacityMax - slot.capacityBooked;
        const isFull = spotsLeft <= 0;

        let statusBadge = '';
        if (isBooked) {
          statusBadge = `<span class="slot-capacity-pill available">&#10003; Reserved</span>`;
        } else if (isFull) {
          statusBadge = `<span class="slot-capacity-pill" style="color: var(--danger); background: rgba(179,57,57,0.1);">Class Full</span>`;
        } else if (spotsLeft <= 3) {
          statusBadge = `<span class="slot-capacity-pill almost-full">&#9888; Only ${spotsLeft} spots left</span>`;
        } else {
          statusBadge = `<span class="slot-capacity-pill available">&#10003; ${spotsLeft} spots available</span>`;
        }

        return `
          <div class="slot-card" data-slot-id="${slot.id}">
            <div class="slot-time-col">
              <div class="slot-time">${slot.time}</div>
              <div class="slot-room">${slot.day} &bull; ${slot.dateStr}</div>
            </div>
            <div class="slot-info-col">
              <div class="slot-header-row">
                <h4 class="slot-title">${slot.title}</h4>
                ${statusBadge}
              </div>
              <div class="slot-instructor">Instructor: <strong>${slot.instructor}</strong> &bull; Room: ${slot.room.replace(/Studio\s+([A-Z])/g, 'Studio&nbsp;$1')}</div>
            </div>
            <div class="slot-actions">
              ${
                isBooked
                  ? `<button type="button" class="btn btn-secondary btn-sm" disabled style="opacity: 0.65; cursor: default;">Booked</button>`
                  : isFull
                  ? `<button type="button" class="btn btn-secondary btn-sm waitlist-slot-btn" data-slot-id="${slot.id}">Join Waitlist</button>`
                  : `<button type="button" class="btn btn-primary btn-sm book-slot-btn" data-slot-id="${slot.id}">Book Class</button>`
              }
            </div>
          </div>
        `;
      })
      .join('');

    // Attach Booking button handlers
    container.querySelectorAll('.book-slot-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const slotId = btn.getAttribute('data-slot-id');
        bookSlot(slotId);
      });
    });

    // Attach Waitlist button handlers
    container.querySelectorAll('.waitlist-slot-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        showToast('You have been added to the priority waitlist. We will notify you if a mat opens!');
      });
    });
  }

  function bookSlot(slotId) {
    const slot = state.availableClasses.find((s) => s.id === slotId);
    if (!slot) return;

    // Check if membership is frozen
    if (state.membership.freezeStatus !== 'None') {
      alert(`Your membership is currently frozen until ${state.membership.freezeUntil}. Please unfreeze your account first in the Membership & Billing tab.`);
      return;
    }

    // Add to upcoming bookings
    const newBooking = {
      id: 'b-' + Date.now(),
      title: slot.title,
      instructor: slot.instructor,
      date: `${slot.day}, ${slot.dateStr}`,
      time: slot.time,
      room: slot.room,
      style: slot.style,
      status: 'Confirmed'
    };

    state.upcomingBookings.push(newBooking);

    // Update capacity
    slot.capacityBooked += 1;

    // If using class pack backup, decrement
    if (state.classPack.remaining > 0) {
      state.classPack.remaining -= 1;
      state.classPack.used += 1;
    }

    // Increment week session count
    const lastIdx = state.chartWeeklySessions.length - 1;
    state.chartWeeklySessions[lastIdx] = (state.chartWeeklySessions[lastIdx] || 0) + 1;
    state.practiceStreak.sessionsThisWeek += 1;

    saveState();
    renderMetrics();
    renderUpcomingBookings();
    renderAvailableSlots();
    renderCanvasChart();

    showToast(`Mat Reserved! You are booked for ${slot.title} with ${slot.instructor}.`);
  }

  // -------------------------------------------------------------------------
  // 9. Membership & Billing Operations
  // -------------------------------------------------------------------------
  function initMembershipControls() {
    // Auto-Renew Toggle
    const autoRenewCheckbox = document.getElementById('membership-autorenew-toggle');
    if (autoRenewCheckbox) {
      autoRenewCheckbox.checked = state.membership.autoRenew;
      autoRenewCheckbox.addEventListener('change', function () {
        state.membership.autoRenew = autoRenewCheckbox.checked;
        saveState();
        showToast(
          state.membership.autoRenew
            ? 'Auto-renewal is enabled. Next cycle will process on Nov 1, 2026.'
            : 'Auto-renewal paused. Your pass will expire at the end of the current cycle.'
        );
      });
    }

    // Freeze Membership Modal
    const freezeBtn = document.getElementById('open-freeze-modal-btn');
    const freezeModal = document.getElementById('freeze-modal');
    const closeFreezeBtn = document.getElementById('close-freeze-modal-btn');
    const confirmFreezeBtn = document.getElementById('confirm-freeze-btn');
    const unfreezeBtn = document.getElementById('unfreeze-membership-btn');

    if (freezeBtn && freezeModal) {
      freezeBtn.addEventListener('click', function () {
        freezeModal.classList.add('open');
      });
    }

    if (closeFreezeBtn && freezeModal) {
      closeFreezeBtn.addEventListener('click', function () {
        freezeModal.classList.remove('open');
      });
    }

    if (confirmFreezeBtn && freezeModal) {
      confirmFreezeBtn.addEventListener('click', function () {
        const weeks = document.getElementById('freeze-duration-select')?.value || '2';
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + parseInt(weeks, 10) * 7);
        const dateStr = returnDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        state.membership.freezeStatus = `${weeks} Weeks`;
        state.membership.freezeUntil = dateStr;
        saveState();
        renderMetrics();
        freezeModal.classList.remove('open');
        showToast(`Membership frozen for ${weeks} weeks until ${dateStr}. Billing paused.`);
      });
    }

    if (unfreezeBtn) {
      unfreezeBtn.addEventListener('click', function () {
        state.membership.freezeStatus = 'None';
        state.membership.freezeUntil = null;
        saveState();
        renderMetrics();
        showToast('Membership reactivated! You can now book class slots immediately.');
      });
    }

    // Reload Class Pack Buttons
    document.querySelectorAll('.buy-pack-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const addAmount = parseInt(btn.getAttribute('data-pack-credits'), 10) || 5;
        state.classPack.total += addAmount;
        state.classPack.remaining += addAmount;
        saveState();
        renderMetrics();
        showToast(`Successfully added ${addAmount} class credits to your account!`);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 10. Profile & Health Notes Management
  // -------------------------------------------------------------------------
  function initProfileForm() {
    const profileForm = document.getElementById('profile-settings-form');
    if (!profileForm) return;

    // Pre-populate fields
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const emergencyInput = document.getElementById('profile-emergency');
    const injuriesInput = document.getElementById('profile-injuries');
    const remindersCheck = document.getElementById('profile-reminders');
    const waitlistCheck = document.getElementById('profile-waitlist');

    if (nameInput) nameInput.value = state.user.name;
    if (emailInput) emailInput.value = state.user.email;
    if (phoneInput) phoneInput.value = state.user.phone || '';
    if (emergencyInput) emergencyInput.value = state.user.emergencyContact || '';
    if (injuriesInput) injuriesInput.value = state.user.injuries || '';
    if (remindersCheck) remindersCheck.checked = !!state.user.reminders;
    if (waitlistCheck) waitlistCheck.checked = !!state.user.waitlistAlerts;

    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (nameInput) state.user.name = nameInput.value.trim();
      if (emailInput) state.user.email = emailInput.value.trim();
      if (phoneInput) state.user.phone = phoneInput.value.trim();
      if (emergencyInput) state.user.emergencyContact = emergencyInput.value.trim();
      if (injuriesInput) state.user.injuries = injuriesInput.value.trim();
      if (remindersCheck) state.user.reminders = remindersCheck.checked;
      if (waitlistCheck) state.user.waitlistAlerts = waitlistCheck.checked;

      saveState();
      renderMetrics();
      showToast('Profile and studio preferences saved successfully!');
    });
  }

  // -------------------------------------------------------------------------
  // 11. Notifications System
  // -------------------------------------------------------------------------
  function initNotifications() {
    const notifBtn = document.getElementById('notif-bell-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBadge = document.getElementById('notif-badge');
    const notifList = document.getElementById('notif-items-list');
    const markReadBtn = document.getElementById('mark-notifs-read-btn');

    function updateBadge() {
      const unreadCount = state.notifications.filter((n) => !n.read).length;
      if (notifBadge) {
        if (unreadCount > 0) {
          notifBadge.textContent = unreadCount;
          notifBadge.style.display = 'flex';
        } else {
          notifBadge.style.display = 'none';
        }
      }
    }

    function renderList() {
      if (!notifList) return;
      if (state.notifications.length === 0) {
        notifList.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem 0;">No new notifications</p>`;
        return;
      }

      notifList.innerHTML = state.notifications
        .map(
          (n) => `
          <div class="notif-item ${n.read ? '' : 'unread'}">
            <p style="margin: 0; font-size: 0.85rem; color: var(--text-primary);">${n.text}</p>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${n.time}</span>
          </div>
        `
        )
        .join('');
    }

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        notifDropdown.classList.toggle('open');
      });

      document.addEventListener('click', function (e) {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
          notifDropdown.classList.remove('open');
        }
      });
    }

    if (markReadBtn) {
      markReadBtn.addEventListener('click', function () {
        state.notifications.forEach((n) => (n.read = true));
        saveState();
        updateBadge();
        renderList();
        showToast('All notifications marked as read.');
      });
    }

    updateBadge();
    renderList();
  }

  // -------------------------------------------------------------------------
  // 12. Mobile Sidebar & Logout Handling
  // -------------------------------------------------------------------------
  function initMobileSidebar() {
    const hamburger = document.querySelector('.dash-hamburger');
    const sidebar = document.querySelector('.dash-sidebar');
    const backdrop = document.querySelector('.dash-sidebar-backdrop');

    if (hamburger && sidebar) {
      function openSidebar() {
        sidebar.classList.add('mobile-open');
        if (backdrop) backdrop.classList.add('active');
        document.body.classList.add('menu-open');
      }

      function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
      }

      hamburger.addEventListener('click', function () {
        if (sidebar.classList.contains('mobile-open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });

      const closeBtn = sidebar.querySelector('.dash-sidebar-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
      }

      if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
      }

      // Close when clicking outside
      document.addEventListener('click', function (e) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains('mobile-open')) {
          closeSidebar();
        }
      });

      // Close on any link click inside sidebar
      sidebar.querySelectorAll('.dash-nav-btn, .dash-nav-link-btn').forEach((btn) => {
        btn.addEventListener('click', closeSidebar);
      });
    }

    // Logout
    const logoutBtn = document.getElementById('dash-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to log out of your Aura account?')) {
          localStorage.removeItem('aura_active_user');
          window.location.href = 'signin.html';
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 13. Filter Listeners for Schedule
  // -------------------------------------------------------------------------
  function initFilterListeners() {
    const searchInput = document.getElementById('slot-search-input');
    const styleFilter = document.getElementById('slot-style-filter');
    const dayFilter = document.getElementById('slot-day-filter');

    if (searchInput) searchInput.addEventListener('input', renderAvailableSlots);
    if (styleFilter) styleFilter.addEventListener('change', renderAvailableSlots);
    if (dayFilter) dayFilter.addEventListener('change', renderAvailableSlots);
  }

  // -------------------------------------------------------------------------
  // Initialize Dashboard Application
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    loadState();
    renderMetrics();
    renderUpcomingBookings();
    renderAvailableSlots();
    renderCanvasChart();
    initNavigation();
    initMembershipControls();
    initProfileForm();
    initNotifications();
    initMobileSidebar();
    initFilterListeners();

    // Re-render chart on theme change
    window.addEventListener('themeChanged', function () {
      setTimeout(renderCanvasChart, 50);
    });

    window.addEventListener('resize', function () {
      setTimeout(renderCanvasChart, 100);
    });
  });
})();
