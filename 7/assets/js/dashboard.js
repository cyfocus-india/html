/**
 * PLAY ZONE - Parent Dashboard Logic
 * assets/js/dashboard.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initSlotBookingEngine();
  initBirthdayPlanner();
  initInvoiceActions();
  initMembershipActions();
  initChildrenAndWaiverActions();
  handleUrlDeepLinking();
});

/* --------------------------------------------------------------------------
   1. Dashboard Tab Navigation
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const tabButtons = document.querySelectorAll('.dash-tab-btn');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // Update URL hash if appropriate
      window.location.hash = targetId;
    });
  });

  // Handle direct hash navigation
  if (window.location.hash) {
    const rawHash = window.location.hash.substring(1);
    const tabName = rawHash.split('?')[0];
    const targetBtn = document.querySelector(`.dash-tab-btn[data-tab="${tabName}"]`);
    if (targetBtn) targetBtn.click();
  }
}

/* --------------------------------------------------------------------------
   2. Real-Time Slot Availability & Booking Engine
   -------------------------------------------------------------------------- */
function initSlotBookingEngine() {
  let selectedZone = 'Explorer Zone (3 - 5 Years)';
  let selectedZonePrice = 18;
  let selectedDate = new Date().toISOString().split('T')[0];
  let selectedTimeSlot = '10:00 AM - 12:00 PM';
  let childCount = 1;
  let antiSkidSocks = false;
  let socksPricePerPair = 3.50;

  // Set minimum date for date picker
  const datePicker = document.getElementById('booking-date-picker');
  if (datePicker) {
    datePicker.min = selectedDate;
    datePicker.value = selectedDate;
    datePicker.addEventListener('change', (e) => {
      selectedDate = e.target.value;
      updateSlotAvailability();
      updateBookingSummary();
    });
  }

  // Zone Card Selection (strictly scoped to zone selector grid)
  const zoneCards = document.querySelectorAll('.zone-selector-grid .zone-select-card');
  zoneCards.forEach(card => {
    card.addEventListener('click', () => {
      zoneCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedZone = card.getAttribute('data-zone-name');
      selectedZonePrice = parseFloat(card.getAttribute('data-zone-price')) || 18;
      updateSlotAvailability();
      updateBookingSummary();
    });
  });

  // Time Slot Selection
  const slotButtons = document.querySelectorAll('.time-slot-btn');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTimeSlot = btn.getAttribute('data-slot');
      updateBookingSummary();
    });
  });

  // Child Counter Controls
  const minusBtn = document.getElementById('child-count-minus');
  const plusBtn = document.getElementById('child-count-plus');
  const countDisplay = document.getElementById('child-count-value');

  if (minusBtn && plusBtn && countDisplay) {
    minusBtn.addEventListener('click', () => {
      if (childCount > 1) {
        childCount--;
        countDisplay.textContent = childCount;
        updateBookingSummary();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (childCount < 5) {
        childCount++;
        countDisplay.textContent = childCount;
        updateBookingSummary();
      } else {
        window.showToast('For groups larger than 5 children, please book a Birthday / Group package.', 'warning');
      }
    });
  }

  // Anti-skid socks checkbox
  const socksCheckbox = document.getElementById('include-socks-checkbox');
  if (socksCheckbox) {
    socksCheckbox.addEventListener('change', (e) => {
      antiSkidSocks = e.target.checked;
      updateBookingSummary();
    });
  }

  function updateSlotAvailability() {
    // Dynamic simulation of remaining slot capacities based on selected date & zone
    const slots = document.querySelectorAll('.time-slot-btn');
    slots.forEach(slot => {
      const leftEl = slot.querySelector('.slot-left');
      if (leftEl) {
        // Random deterministic seed based on date length
        const randomLeft = Math.floor(Math.random() * 12) + 3;
        leftEl.textContent = `${randomLeft} slots left`;
        if (randomLeft <= 4) {
          leftEl.textContent = `${randomLeft} slots left! (Fast Filling)`;
          leftEl.style.color = 'var(--accent-red)';
        } else {
          leftEl.style.color = 'var(--accent-green)';
        }
      }
    });
  }

  function updateBookingSummary() {
    const summaryZone = document.getElementById('summary-zone-name');
    const summaryDate = document.getElementById('summary-slot-date');
    const summaryTime = document.getElementById('summary-slot-time');
    const summaryChildren = document.getElementById('summary-children-count');
    const summarySubtotal = document.getElementById('summary-subtotal-price');
    const summarySocks = document.getElementById('summary-socks-price');
    const summaryTotal = document.getElementById('summary-total-price');

    if (!summaryZone) return;

    const baseCost = selectedZonePrice * childCount;
    const socksCost = antiSkidSocks ? (socksPricePerPair * childCount) : 0;
    const totalCost = baseCost + socksCost;

    summaryZone.textContent = selectedZone;
    summaryDate.textContent = selectedDate;
    summaryTime.textContent = selectedTimeSlot;
    summaryChildren.textContent = `${childCount} ${childCount === 1 ? 'Child' : 'Children'}`;
    summarySubtotal.textContent = `$${baseCost.toFixed(2)}`;
    summarySocks.textContent = antiSkidSocks ? `$${socksCost.toFixed(2)} (${childCount} pairs)` : '$0.00';
    summaryTotal.textContent = `$${totalCost.toFixed(2)}`;
  }

  // Trigger initial calculation
  updateBookingSummary();

  // Instant Booking Confirmation Trigger
  const confirmBookingBtn = document.getElementById('confirm-session-booking-btn');
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      const originalText = confirmBookingBtn.innerHTML;
      confirmBookingBtn.disabled = true;
      confirmBookingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reserving Slots...';

      setTimeout(() => {
        confirmBookingBtn.disabled = false;
        confirmBookingBtn.innerHTML = originalText;

        const bookingId = 'PZ-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('ticket-booking-id').textContent = bookingId;
        document.getElementById('ticket-zone-name').textContent = selectedZone;
        document.getElementById('ticket-date-time').textContent = `${selectedDate} at ${selectedTimeSlot}`;
        document.getElementById('ticket-kids-count').textContent = `${childCount} Child(ren)`;
        document.getElementById('ticket-total-paid').textContent = document.getElementById('summary-total-price').textContent;

        window.openModal('booking-success-modal');
        window.showToast('Session booked successfully! Pass issued.', 'success');
      }, 1000);
    });
  }
}

/* --------------------------------------------------------------------------
   3. Birthday Party Package Planner
   -------------------------------------------------------------------------- */
function initBirthdayPlanner() {
  let packageBasePrice = 399; // Super Play Party default
  let packageName = 'Super Play Party (Up to 15 Kids)';
  let baseGuestAllowance = 15;
  let guestCount = 15;
  let extraGuestRate = 22;
  let selectedTheme = 'Cosmic Space Odyssey';

  // Package Card Selection
  const packageCards = document.querySelectorAll('.bday-package-card');
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      packageBasePrice = parseFloat(card.getAttribute('data-base-price')) || 399;
      packageName = card.getAttribute('data-package-name');
      baseGuestAllowance = parseInt(card.getAttribute('data-base-guests')) || 15;
      calculatePartyTotal();
    });
  });

  // Theme Selector Cards
  const themeItems = document.querySelectorAll('.party-theme-card');
  themeItems.forEach(card => {
    card.addEventListener('click', () => {
      themeItems.forEach(t => t.classList.remove('selected'));
      card.classList.add('selected');
      selectedTheme = card.getAttribute('data-theme-name');
      calculatePartyTotal();
    });
  });

  // Guest Count Slider
  const guestSlider = document.getElementById('party-guest-slider');
  const guestCountDisplay = document.getElementById('party-guest-count-val');

  if (guestSlider && guestCountDisplay) {
    guestSlider.addEventListener('input', (e) => {
      guestCount = parseInt(e.target.value);
      guestCountDisplay.textContent = `${guestCount} Kids`;
      calculatePartyTotal();
    });
  }

  // Add-on checkboxes
  const addonCheckboxes = document.querySelectorAll('.party-addon-check');
  addonCheckboxes.forEach(box => {
    box.addEventListener('change', calculatePartyTotal);
  });

  function calculatePartyTotal() {
    let extraGuests = Math.max(0, guestCount - baseGuestAllowance);
    let extraGuestsTotal = extraGuests * extraGuestRate;

    let addonsTotal = 0;
    addonCheckboxes.forEach(box => {
      if (box.checked) {
        addonsTotal += parseFloat(box.getAttribute('data-price')) || 0;
      }
    });

    let grandTotal = packageBasePrice + extraGuestsTotal + addonsTotal;

    const packNameEl = document.getElementById('party-summary-pack-name');
    const themeNameEl = document.getElementById('party-summary-theme-name');
    const guestTotalEl = document.getElementById('party-summary-guests');
    const extraGuestFeeEl = document.getElementById('party-summary-extra-fee');
    const addonsTotalEl = document.getElementById('party-summary-addons');
    const grandTotalEl = document.getElementById('party-summary-grand-total');

    if (packNameEl) packNameEl.textContent = packageName;
    if (themeNameEl) themeNameEl.textContent = selectedTheme;
    if (guestTotalEl) guestTotalEl.textContent = `${guestCount} Kids (${baseGuestAllowance} included)`;
    if (extraGuestFeeEl) extraGuestFeeEl.textContent = `$${extraGuestsTotal.toFixed(2)}`;
    if (addonsTotalEl) addonsTotalEl.textContent = `$${addonsTotal.toFixed(2)}`;
    if (grandTotalEl) grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
  }

  calculatePartyTotal();

  // Party Booking Submission
  const bookPartyBtn = document.getElementById('book-party-package-btn');
  if (bookPartyBtn) {
    bookPartyBtn.addEventListener('click', () => {
      const childName = document.getElementById('party-child-name').value.trim() || 'Birthday Star';
      const partyDate = document.getElementById('party-preferred-date').value || 'Selected Date';

      window.showToast(`Party Reservation Request Received for ${childName}! Our coordinator will reach out.`, 'success');
      window.openModal('party-success-modal');
    });
  }
}

/* --------------------------------------------------------------------------
   4. Invoice Preview & Printable Action
   -------------------------------------------------------------------------- */
function initInvoiceActions() {
  const invoiceButtons = document.querySelectorAll('.view-invoice-btn');
  invoiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const invId = btn.getAttribute('data-inv-id');
      const invDate = btn.getAttribute('data-inv-date');
      const invAmount = btn.getAttribute('data-inv-amount');
      const invDesc = btn.getAttribute('data-inv-desc');

      document.getElementById('modal-inv-id').textContent = invId;
      document.getElementById('modal-inv-date').textContent = invDate;
      document.getElementById('modal-inv-desc').textContent = invDesc;
      document.getElementById('modal-inv-amount').textContent = invAmount;
      document.getElementById('modal-inv-total').textContent = invAmount;

      window.openModal('invoice-detail-modal');
    });
  });

  const printBtn = document.getElementById('print-invoice-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   5. Membership Plan Renew & In-Place Dashboard Upgrade
   -------------------------------------------------------------------------- */
function applyMembershipTier(tier) {
  const isPlatinum = (tier === 'platinum');

  // 1. Header Active Pass stat
  const headerActivePass = document.getElementById('header-active-pass-val');
  if (headerActivePass) {
    headerActivePass.textContent = isPlatinum ? 'Platinum VIP' : 'Gold Explorer';
    headerActivePass.style.color = isPlatinum ? 'var(--accent-red-text)' : 'var(--accent-yellow-text)';
  }

  // 2. Remaining sessions count in header stats
  const remainingCount = document.getElementById('membership-remaining-count');
  if (remainingCount) {
    remainingCount.textContent = isPlatinum ? 'Unlimited' : '8 of 12';
  }

  // 3. Active pass card header badge
  const passBadge = document.getElementById('membership-pass-tier-badge');
  if (passBadge) {
    passBadge.textContent = isPlatinum ? 'PLATINUM VIP UNLIMITED' : 'GOLD EXPLORER PASS';
    passBadge.style.background = isPlatinum
      ? 'linear-gradient(45deg, #E52E2E, #FF5757)'
      : 'linear-gradient(45deg, #F5B300, #FFD056)';
    passBadge.style.color = isPlatinum ? '#FFFFFF' : '#111827';
    passBadge.style.border = 'none';
  }

  // 4. Pass ID & Kids descriptor
  const passIdDesc = document.getElementById('membership-pass-id-desc');
  if (passIdDesc) {
    passIdDesc.innerHTML = isPlatinum
      ? 'Pass ID: #PZ-PLT-99418 &bull; Kids: Leo &amp; Maya'
      : 'Pass ID: #PZ-GLD-88419 &bull; Kids: Leo &amp; Maya';
  }

  // 5. Utilization label
  const utilLabel = document.getElementById('membership-utilization-label');
  if (utilLabel) {
    utilLabel.textContent = isPlatinum
      ? 'Unlimited Play Sessions (Zero Limits)'
      : '8 visits remaining (4 used)';
  }

  // 6. Progress Meter Fill
  const meterFill = document.getElementById('membership-meter-fill');
  if (meterFill) {
    meterFill.style.width = isPlatinum ? '100%' : '66%';
    meterFill.style.background = isPlatinum
      ? 'linear-gradient(90deg, #E52E2E, #9333EA, #F5B300)'
      : 'var(--accent-yellow)';
  }

  // 7. Cafe & Free Socks Perk Info
  const cafePerk = document.getElementById('membership-cafe-perk');
  if (cafePerk) {
    cafePerk.textContent = isPlatinum
      ? '20% Cafe Discount Active • Free Grip Socks Each Visit'
      : '10% Cafe Discount Active';
  }

  // 8. Action Buttons
  const renewBtn = document.getElementById('renew-membership-btn');
  if (renewBtn) {
    renewBtn.innerHTML = isPlatinum
      ? '<i class="fas fa-sync-alt"></i> Extend Platinum VIP (+1 Year)'
      : '<i class="fas fa-sync-alt"></i> Renew Pass (+12 Visits)';
  }

  const upgradeBtn = document.getElementById('upgrade-membership-btn');
  if (upgradeBtn) {
    if (isPlatinum) {
      upgradeBtn.className = 'btn btn-outline-green';
      upgradeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Platinum VIP Active (Downgrade to Gold)';
    } else {
      upgradeBtn.className = 'btn btn-outline-red';
      upgradeBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Upgrade to Platinum VIP';
    }
  }

  // 9. Perks Grid
  const perksTitle = document.getElementById('membership-perks-title');
  if (perksTitle) {
    perksTitle.textContent = isPlatinum ? 'Your Platinum VIP Perks' : 'Your Gold Pass Perks';
  }

  const perksContainer = document.getElementById('membership-perks-container');
  if (perksContainer) {
    if (isPlatinum) {
      perksContainer.innerHTML = `
        <div style="display: flex; gap: 0.75rem;">
          <i class="fas fa-infinity" style="color: var(--accent-red); font-size: 1.25rem;"></i>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">Unlimited Session Access</h4>
            <p style="font-size: 0.8rem; color: var(--neutral-600);">Unlimited daily play with zero session caps, blackout dates, or waiting lists.</p>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <i class="fas fa-socks" style="color: var(--primary-blue); font-size: 1.25rem;"></i>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">Complimentary Grip Socks</h4>
            <p style="font-size: 0.8rem; color: var(--neutral-600);">1 Free certified traction pair per registered child on every visit ($7 saved/visit).</p>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <i class="fas fa-birthday-cake" style="color: #9333EA; font-size: 1.25rem;"></i>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">25% Birthday Suite Discount</h4>
            <p style="font-size: 0.8rem; color: var(--neutral-600);">Top-tier VIP discount automatically deducted from any birthday party package.</p>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <i class="fas fa-couch" style="color: var(--accent-yellow-text); font-size: 1.25rem;"></i>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">VIP Parents Lounge Access</h4>
            <p style="font-size: 0.8rem; color: var(--neutral-600);">Complimentary barista beverages, massage chairs, and quiet co-working desks.</p>
          </div>
        </div>
      `;
    } else {
      perksContainer.innerHTML = `
        <div style="display: flex; gap: 0.75rem;">
          <i class="fas fa-bolt" style="color: var(--accent-yellow); font-size: 1.25rem;"></i>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">Priority Gate Access</h4>
            <p style="font-size: 0.8rem; color: var(--neutral-600);">Skip weekend check-in queues directly through the VIP turnstile.</p>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <i class="fas fa-birthday-cake" style="color: var(--accent-red); font-size: 1.25rem;"></i>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">15% Birthday Discount</h4>
            <p style="font-size: 0.8rem; color: var(--neutral-600);">Applies automatically to any birthday party package booked.</p>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <i class="fas fa-coffee" style="color: var(--primary-blue); font-size: 1.25rem;"></i>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">Parents Lounge Cafe</h4>
            <p style="font-size: 0.8rem; color: var(--neutral-600);">Free barista coffee on every visit plus 10% off kid snacks.</p>
          </div>
        </div>
      `;
    }
  }
}

function initMembershipActions() {
  // Load persisted tier or default to 'gold'
  let currentTier = localStorage.getItem('playzone-membership-tier') || 'gold';
  applyMembershipTier(currentTier);

  // Renew Pass Action
  const renewBtn = document.getElementById('renew-membership-btn');
  if (renewBtn) {
    renewBtn.addEventListener('click', () => {
      const isPlat = (localStorage.getItem('playzone-membership-tier') === 'platinum');
      renewBtn.disabled = true;
      renewBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Renewal...';

      setTimeout(() => {
        renewBtn.disabled = false;
        if (isPlat) {
          renewBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Extend Platinum VIP (+1 Year)';
          window.showToast('Platinum VIP Pass successfully extended through December 31, 2027!', 'success');
        } else {
          renewBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Renew Pass (+12 Visits)';
          const remainingCount = document.getElementById('membership-remaining-count');
          const meterFill = document.getElementById('membership-meter-fill');
          if (remainingCount) remainingCount.textContent = '12 of 12';
          if (meterFill) meterFill.style.width = '100%';
          window.showToast('Gold Explorer Pass renewed for an additional 12 visits!', 'success');
        }
      }, 750);
    });
  }

  // Upgrade / Downgrade Button Action
  const upgradeBtn = document.getElementById('upgrade-membership-btn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      const isPlat = (localStorage.getItem('playzone-membership-tier') === 'platinum');
      if (isPlat) {
        // Toggle back to Gold Explorer
        localStorage.setItem('playzone-membership-tier', 'gold');
        applyMembershipTier('gold');
        window.showToast('Switched membership plan back to Gold Explorer Pass.', 'info');
      } else {
        // Open Upgrade Modal
        window.openModal('upgrade-membership-modal');
      }
    });
  }

  // Confirm Upgrade Button inside Modal
  const confirmBtn = document.getElementById('confirm-upgrade-plan-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Upgrading Account...';

      setTimeout(() => {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Confirm &amp; Upgrade Now ($50/mo)';
        localStorage.setItem('playzone-membership-tier', 'platinum');
        applyMembershipTier('platinum');
        window.closeModal('upgrade-membership-modal');
        window.showToast('🎉 Congratulations! Upgraded to Platinum VIP Unlimited Pass!', 'success');
      }, 700);
    });
  }
}

/* --------------------------------------------------------------------------
   6. Child Profiles & Digital Safety Waiver Management
   -------------------------------------------------------------------------- */
function initChildrenAndWaiverActions() {
  const defaultChildren = [
    {
      id: 'child-1',
      name: 'Leo Jenkins',
      initials: 'LJ',
      age: 4,
      dob: '2022-04-12',
      zone: 'Explorer Zone (Ages 2-4)',
      tone: 'tone-blue',
      notes: 'Mild peanut sensitivity. Loves giant ball pool & climbing soft ramp.',
      emergencyContact: '+1 (555) 382-9910',
      waiverSigned: true
    },
    {
      id: 'child-2',
      name: 'Maya Jenkins',
      initials: 'MJ',
      age: 2,
      dob: '2024-02-18',
      zone: 'Baby Zone (Ages 0-2)',
      tone: 'tone-yellow',
      notes: 'Requires toddler anti-skid grip socks (size XS).',
      emergencyContact: '+1 (555) 382-9910',
      waiverSigned: true
    }
  ];

  const colorPalettes = ['tone-blue', 'tone-yellow', 'tone-green', 'tone-red', 'tone-purple'];

  function getStoredChildren() {
    try {
      const data = localStorage.getItem('playzone_dashboard_children');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading children from localStorage', e);
    }
    return [...defaultChildren];
  }

  function saveChildren(children) {
    try {
      localStorage.setItem('playzone_dashboard_children', JSON.stringify(children));
    } catch (e) {
      console.error('Error saving children to localStorage', e);
    }
  }

  function getInitials(name) {
    if (!name) return 'CH';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function renderChildrenList() {
    const container = document.getElementById('children-list-container');
    if (!container) return;

    const children = getStoredChildren();

    // Update banner summary in dashboard header
    const banner = document.getElementById('banner-registered-children');
    if (banner) {
      if (children.length === 0) {
        banner.innerHTML = '<i class="fas fa-child" style="color: var(--primary-blue);"></i> Registered Children: <em>None registered</em>';
      } else {
        const summary = children.map(c => `<strong>${c.name.split(' ')[0]} (Age ${c.age})</strong>`).join(' &amp; ');
        banner.innerHTML = `<i class="fas fa-child" style="color: var(--primary-blue);"></i> Registered Children: ${summary}`;
      }
    }

    if (children.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; background: var(--bg-surface-alt); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <i class="fas fa-child" style="font-size: 2.5rem; color: var(--neutral-400); margin-bottom: 0.5rem;"></i>
          <p style="color: var(--neutral-600); font-size: 0.9rem; margin-bottom: 1rem;">No child profiles registered yet.</p>
          <button type="button" class="btn btn-primary-blue btn-sm" id="btn-empty-add-child">
            + Add First Child
          </button>
        </div>
      `;
      const emptyAddBtn = document.getElementById('btn-empty-add-child');
      if (emptyAddBtn) {
        emptyAddBtn.addEventListener('click', () => {
          document.getElementById('btn-open-add-child')?.click();
        });
      }
      return;
    }

    container.innerHTML = children.map(child => `
      <div class="child-profile-card" data-child-id="${child.id}" style="padding: 1.25rem; background-color: var(--bg-surface-alt); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; transition: all var(--transition-fast);">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="child-avatar-swatch ${child.tone || 'tone-blue'}" style="${child.bg ? `background: ${child.bg}; color: ${child.color};` : ''}">
            ${child.initials || getInitials(child.name)}
          </div>
          <div>
            <h3 style="font-size: 1.05rem; margin-bottom: 0.2rem;" class="child-name">${child.name}</h3>
            <p style="font-size: 0.8rem; color: var(--neutral-600);" class="child-meta">Age: ${child.age} Years • Zone: ${child.zone || 'Play Zone'}</p>
            <span style="font-size: 0.75rem; color: var(--neutral-500);"><i class="fas fa-shield-alt" style="color: var(--accent-green);"></i> Safety Waiver Signed</span>
            ${child.notes ? `<p style="font-size: 0.72rem; color: var(--neutral-500); margin-top: 0.25rem; font-style: italic;"><i class="fas fa-sticky-note" style="color: var(--primary-blue);"></i> ${child.notes}</p>` : ''}
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline-blue btn-edit-child" data-child-id="${child.id}">
          Edit
        </button>
      </div>
    `).join('');

    // Attach click handlers to dynamic Edit buttons
    container.querySelectorAll('.btn-edit-child').forEach(btn => {
      btn.addEventListener('click', () => {
        const childId = btn.getAttribute('data-child-id');
        openEditChildModal(childId);
      });
    });
  }

  // Add Child Modal Trigger & Submission
  const addBtn = document.getElementById('btn-open-add-child');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const form = document.getElementById('add-child-form');
      if (form) form.reset();
      window.openModal('add-child-modal');
    });
  }

  const addForm = document.getElementById('add-child-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('add-child-name').value.trim();
      const age = parseInt(document.getElementById('add-child-age').value, 10);
      const dob = document.getElementById('add-child-dob').value;
      const zone = document.getElementById('add-child-zone').value;
      const notes = document.getElementById('add-child-notes').value.trim();
      const phone = document.getElementById('add-child-phone').value.trim();

      if (!name || isNaN(age)) {
        window.showToast('Please enter a valid child name and age.', 'error');
        return;
      }

      const children = getStoredChildren();
      const colorIndex = children.length % colorPalettes.length;
      const tone = colorPalettes[colorIndex];

      const newChild = {
        id: 'child-' + Date.now(),
        name,
        initials: getInitials(name),
        age,
        dob,
        zone,
        tone: tone,
        notes,
        emergencyContact: phone || '+1 (555) 382-9910',
        waiverSigned: true
      };

      children.push(newChild);
      saveChildren(children);
      renderChildrenList();
      window.closeModal('add-child-modal');
      window.showToast(`${name} has been added to registered children!`, 'success');
    });
  }

  // Edit Child Modal Functions
  function openEditChildModal(childId) {
    const children = getStoredChildren();
    const child = children.find(c => c.id === childId);
    if (!child) return;

    document.getElementById('edit-child-id').value = child.id;
    document.getElementById('edit-child-name').value = child.name;
    document.getElementById('edit-child-age').value = child.age;
    document.getElementById('edit-child-dob').value = child.dob || '';
    document.getElementById('edit-child-zone').value = child.zone || 'Explorer Zone (Ages 2-4)';
    document.getElementById('edit-child-notes').value = child.notes || '';
    document.getElementById('edit-child-phone').value = child.emergencyContact || '+1 (555) 382-9910';

    window.openModal('edit-child-modal');
  }

  const editForm = document.getElementById('edit-child-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-child-id').value;
      const name = document.getElementById('edit-child-name').value.trim();
      const age = parseInt(document.getElementById('edit-child-age').value, 10);
      const dob = document.getElementById('edit-child-dob').value;
      const zone = document.getElementById('edit-child-zone').value;
      const notes = document.getElementById('edit-child-notes').value.trim();
      const phone = document.getElementById('edit-child-phone').value.trim();

      if (!name || isNaN(age)) {
        window.showToast('Please enter valid child details.', 'error');
        return;
      }

      const children = getStoredChildren();
      const index = children.findIndex(c => c.id === id);
      if (index !== -1) {
        children[index].name = name;
        children[index].initials = getInitials(name);
        children[index].age = age;
        children[index].dob = dob;
        children[index].zone = zone;
        children[index].notes = notes;
        children[index].emergencyContact = phone;

        saveChildren(children);
        renderChildrenList();
        window.closeModal('edit-child-modal');
        window.showToast(`Details updated successfully for ${name}!`, 'success');
      }
    });
  }

  // Delete Child Handler
  const deleteChildBtn = document.getElementById('btn-delete-child');
  if (deleteChildBtn) {
    deleteChildBtn.addEventListener('click', () => {
      const id = document.getElementById('edit-child-id').value;
      const name = document.getElementById('edit-child-name').value;
      if (confirm(`Are you sure you want to remove ${name} from your registered children?`)) {
        let children = getStoredChildren();
        children = children.filter(c => c.id !== id);
        saveChildren(children);
        renderChildrenList();
        window.closeModal('edit-child-modal');
        window.showToast(`${name} was removed from registered children.`, 'info');
      }
    });
  }

  // View Full Signed Waiver PDF Modal Handler
  const viewWaiverBtn = document.getElementById('btn-view-waiver-modal');
  if (viewWaiverBtn) {
    viewWaiverBtn.addEventListener('click', () => {
      const waiverChildrenList = document.getElementById('waiver-covered-children-list');
      if (waiverChildrenList) {
        const children = getStoredChildren();
        if (children.length === 0) {
          waiverChildrenList.innerHTML = '<span style="color: var(--neutral-500); font-size: 0.8rem;">No minors currently registered.</span>';
        } else {
          waiverChildrenList.innerHTML = children.map(c => `
            <span style="display: inline-flex; align-items: center; gap: 0.35rem; background: #EBF5FF; color: #1E429F; padding: 4px 10px; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; border: 1px solid #B4C6FC;">
              <i class="fas fa-child" style="color: #0D5BE1;"></i> ${c.name} (Age ${c.age})
            </span>
          `).join('');
        }
      }

      window.openModal('waiver-document-modal');
      window.showToast('Official Digital Safety Waiver Document opened.', 'info');
    });
  }

  // Initial render
  renderChildrenList();
}

/* --------------------------------------------------------------------------
   7. URL Deep Linking & Dynamic Option Filtering
   -------------------------------------------------------------------------- */
function handleUrlDeepLinking() {
  // Extract params from both query string and hash query
  const params = new URLSearchParams(window.location.search);
  if (window.location.hash && window.location.hash.includes('?')) {
    const hashQuery = window.location.hash.split('?')[1];
    const hashParams = new URLSearchParams(hashQuery);
    hashParams.forEach((val, key) => {
      if (!params.has(key)) params.set(key, val);
    });
  }

  // 1. Tab Activation
  let targetTab = params.get('tab');
  if (!targetTab && window.location.hash) {
    targetTab = window.location.hash.substring(1).split('?')[0];
  }

  // Auto-route to party-tab, booking-tab, or membership-tab based on parameters
  if (params.has('package') || params.has('party') || params.has('theme')) {
    targetTab = 'party-tab';
  } else if (params.has('zone') || params.has('kids') || params.has('time')) {
    targetTab = 'booking-tab';
  } else if (params.get('action') === 'upgrade' || params.get('plan') === 'platinum') {
    targetTab = 'membership-tab';
  }

  if (targetTab) {
    const tabBtn = document.querySelector(`.dash-tab-btn[data-tab="${targetTab}"]`);
    if (tabBtn) {
      tabBtn.click();
    }
  }

  // Handle direct Upgrade Modal opening
  if (params.get('action') === 'upgrade' || params.get('upgrade') === 'platinum') {
    setTimeout(() => {
      window.openModal('upgrade-membership-modal');
    }, 200);
  }

  // 2. Play Zone Filter & Selection
  const zoneParam = params.get('zone');
  if (zoneParam) {
    const query = zoneParam.toLowerCase().trim();
    const zoneCards = document.querySelectorAll('.zone-selector-grid .zone-select-card');
    let matchedCard = null;

    if (query.includes('baby') || query.includes('0-2') || query === '15') {
      matchedCard = Array.from(zoneCards).find(c => (c.getAttribute('data-zone-name') || '').toLowerCase().includes('baby'));
    } else if (query.includes('explorer') || query.includes('3-5') || query === '18') {
      matchedCard = Array.from(zoneCards).find(c => (c.getAttribute('data-zone-name') || '').toLowerCase().includes('explorer'));
    } else if (query.includes('adventure') || query.includes('6-8') || query === '20') {
      matchedCard = Array.from(zoneCards).find(c => (c.getAttribute('data-zone-name') || '').toLowerCase().includes('adventure'));
    } else if (query.includes('challenge') || query.includes('9-12') || query === '22') {
      matchedCard = Array.from(zoneCards).find(c => (c.getAttribute('data-zone-name') || '').toLowerCase().includes('challenge'));
    } else {
      matchedCard = Array.from(zoneCards).find(c => (c.getAttribute('data-zone-name') || '').toLowerCase().includes(query));
    }

    if (matchedCard) {
      matchedCard.click();
      const zName = matchedCard.getAttribute('data-zone-name');
      window.showToast(`Selected: ${zName}`, 'success');
      setTimeout(() => {
        matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }

  // 3. Birthday Package Filter & Selection
  const pkgParam = params.get('package') || params.get('party');
  if (pkgParam) {
    const query = pkgParam.toLowerCase().trim();
    const packageCards = document.querySelectorAll('.bday-package-card');
    let matchedPkg = null;

    if (query.includes('mini')) {
      matchedPkg = Array.from(packageCards).find(c => (c.getAttribute('data-package-name') || '').toLowerCase().includes('mini'));
    } else if (query.includes('super')) {
      matchedPkg = Array.from(packageCards).find(c => (c.getAttribute('data-package-name') || '').toLowerCase().includes('super'));
    } else if (query.includes('vip') || query.includes('mega')) {
      matchedPkg = Array.from(packageCards).find(c => (c.getAttribute('data-package-name') || '').toLowerCase().includes('vip'));
    } else {
      matchedPkg = Array.from(packageCards).find(c => (c.getAttribute('data-package-name') || '').toLowerCase().includes(query));
    }

    if (matchedPkg) {
      matchedPkg.click();
      const pName = matchedPkg.getAttribute('data-package-name');
      const baseGuests = matchedPkg.getAttribute('data-base-guests');
      const slider = document.getElementById('party-guest-slider');
      if (slider && baseGuests) {
        slider.value = baseGuests;
        slider.dispatchEvent(new Event('input'));
      }
      window.showToast(`Selected Package: ${pName}`, 'success');
      setTimeout(() => {
        matchedPkg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }

  // 4. Birthday Theme Filter & Selection
  const themeParam = params.get('theme');
  if (themeParam) {
    const query = themeParam.toLowerCase().trim();
    const themeCards = document.querySelectorAll('.party-theme-card');
    const matchedTheme = Array.from(themeCards).find(c => (c.getAttribute('data-theme-name') || '').toLowerCase().includes(query));
    if (matchedTheme) {
      matchedTheme.click();
    }
  }

  // 5. Children Count
  const kidsParam = params.get('kids') || params.get('children');
  if (kidsParam) {
    const targetKids = parseInt(kidsParam, 10);
    if (!isNaN(targetKids) && targetKids >= 1 && targetKids <= 5) {
      const countValEl = document.getElementById('child-count-value');
      const plusBtn = document.getElementById('child-count-plus');
      const minusBtn = document.getElementById('child-count-minus');
      if (countValEl) {
        let current = parseInt(countValEl.textContent, 10) || 1;
        while (current < targetKids && plusBtn) {
          plusBtn.click();
          current++;
        }
        while (current > targetKids && minusBtn) {
          minusBtn.click();
          current--;
        }
      }
    }
  }

  // 6. Visit / Party Date
  const dateParam = params.get('date');
  if (dateParam) {
    const bookingDateInput = document.getElementById('booking-date-picker');
    if (bookingDateInput) {
      bookingDateInput.value = dateParam;
      bookingDateInput.dispatchEvent(new Event('change'));
    }
    const partyDateInput = document.getElementById('party-preferred-date');
    if (partyDateInput) {
      partyDateInput.value = dateParam;
    }
  }

  // 7. Time Slot
  const timeParam = params.get('time');
  if (timeParam) {
    const query = timeParam.toLowerCase().trim();
    const slotBtns = document.querySelectorAll('.time-slot-btn');
    const matchedBtn = Array.from(slotBtns).find(b => {
      const s = (b.getAttribute('data-slot') || '').toLowerCase();
      return s.includes(query) || query.includes(s.split(' ')[0]);
    });
    if (matchedBtn) {
      matchedBtn.click();
    }
  }

  // 8. Anti-Skid Socks Checkbox
  const socksParam = params.get('socks');
  if (socksParam) {
    const socksCheckbox = document.getElementById('include-socks-checkbox');
    if (socksCheckbox) {
      const shouldCheck = socksParam === '1' || socksParam === 'true' || socksParam === 'yes';
      socksCheckbox.checked = shouldCheck;
      socksCheckbox.dispatchEvent(new Event('change'));
    }
  }
}

