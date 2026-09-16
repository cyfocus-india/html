(() => {
  'use strict';

  const formatINR = amount => `₹${Math.round(amount).toLocaleString('en-IN')}`;

  function setupCalculator() {
    const form = document.getElementById('calculatorForm');
    if (!form) return;

    const totalEls = document.querySelectorAll('[data-estimate-total]');
    const rows = {
      packing: document.querySelector('[data-price-packing]'),
      loading: document.querySelector('[data-price-loading]'),
      transport: document.querySelector('[data-price-transport]'),
      unloading: document.querySelector('[data-price-unloading]'),
      other: document.querySelector('[data-price-other]'),
      gst: document.querySelector('[data-price-gst]')
    };

    const moveBase = { local: 2800, intercity: 6500, office: 7800, auto: 3200 };
    const sizeBase = { studio: 1800, '2bhk': 3400, '3bhk': 5400, '4bhk': 7800, bike: 2000, superbike: 3200, car: 2800, suv: 4800 };
    const extras = {
      packing: 1800,
      loading: 1200,
      unloading: 1200,
      unpacking: 950,
      car: 4500,
      storage: 2000
    };

    const step2Title = document.getElementById('calcStep2Title');
    const step2Sub = document.getElementById('calcStep2Sub');
    const householdSizes = document.getElementById('calcHouseholdSizes');
    const vehicleSizes = document.getElementById('calcVehicleSizes');

    function updateStep2Visibility() {
      const data = new FormData(form);
      const move = data.get('moveType') || 'local';
      if (move === 'auto') {
        if (step2Title) step2Title.textContent = 'Vehicle Category & Capacity';
        if (step2Sub) step2Sub.textContent = 'Select your vehicle type';
        if (householdSizes) householdSizes.style.display = 'none';
        if (vehicleSizes) vehicleSizes.style.display = 'grid';
      } else {
        if (step2Title) step2Title.textContent = 'Home / Space Size';
        if (step2Sub) step2Sub.textContent = 'Select the closest match';
        if (householdSizes) householdSizes.style.display = 'grid';
        if (vehicleSizes) vehicleSizes.style.display = 'none';
      }
    }

    function calculate() {
      const data = new FormData(form);
      const move = data.get('moveType') || 'local';
      const isAuto = move === 'auto';
      const size = isAuto ? (data.get('vehicleSize') || 'car') : (data.get('homeSize') || 'studio');
      const selectedExtras = data.getAll('extras');

      const packing = selectedExtras.includes('packing') ? extras.packing : 0;
      const loading = selectedExtras.includes('loading') ? (isAuto ? 600 : extras.loading) : (isAuto ? 400 : 1100);
      const unloading = selectedExtras.includes('unloading') ? (isAuto ? 600 : extras.unloading) : (isAuto ? 400 : 1100);
      const transport = (moveBase[move] || 2800) + (sizeBase[size] || (isAuto ? 2800 : 1800));
      
      const otherExtras = selectedExtras.filter(item => !['packing', 'loading', 'unloading'].includes(item));
      const other = otherExtras.reduce((sum, item) => sum + (extras[item] || 0), 650);

      const subtotal = packing + loading + transport + unloading + other;
      const gst = Math.round(subtotal * 0.18);
      const total = subtotal + gst;

      if (rows.packing) rows.packing.textContent = formatINR(packing);
      if (rows.loading) rows.loading.textContent = formatINR(loading);
      if (rows.transport) rows.transport.textContent = formatINR(transport);
      if (rows.unloading) rows.unloading.textContent = formatINR(unloading);
      if (rows.other) rows.other.textContent = formatINR(other);
      if (rows.gst) rows.gst.textContent = formatINR(gst);

      document.querySelectorAll('[data-price-subtotal]').forEach(el => {
        el.textContent = formatINR(subtotal);
      });
      totalEls.forEach(el => {
        el.textContent = formatINR(total);
      });

      return { subtotal, gst, total, move, size };
    }

    form.addEventListener('input', () => {
      updateStep2Visibility();
      calculate();
    });
    form.addEventListener('change', () => {
      updateStep2Visibility();
      calculate();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const required = form.querySelectorAll('[data-required-calc]');
      let valid = true;

      required.forEach(field => {
        const error = field.closest('.field')?.querySelector('.error');
        if (!field.value.trim()) {
          field.setAttribute('aria-invalid', 'true');
          if (error) error.textContent = 'Please fill out this field.';
          valid = false;
        } else {
          field.removeAttribute('aria-invalid');
          if (error) error.textContent = '';
        }
      });

      if (!valid) {
        required[0]?.focus();
        window.showToast?.('Please provide pickup location, delivery location and move date.');
        return;
      }

      const res = calculate();
      document.querySelector('.price-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.showToast?.(`Instant estimate calculated: ${formatINR(res.total)} (Inclusive of GST)`);
    });

    // Book With This Estimate CTA trigger
    document.querySelectorAll('[data-book-calc-estimate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = calculate();
        const modal = document.getElementById('quoteModal');
        if (modal) {
          const serviceSelect = modal.querySelector('#quoteType');
          const sizeSelect = modal.querySelector('#quoteSize');
          const fromInput = modal.querySelector('#quoteFrom');
          const toInput = modal.querySelector('#quoteTo');
          const dateInput = modal.querySelector('#quoteDate');

          const calcPickup = form.querySelector('#pickup')?.value;
          const calcDelivery = form.querySelector('#delivery')?.value;
          const calcDate = form.querySelector('#moveDate')?.value;

          if (serviceSelect) {
            const opt = serviceSelect.querySelector(`option[value="${res.move}"]`);
            if (opt) serviceSelect.value = res.move;
          }
          if (sizeSelect) {
            const opt = sizeSelect.querySelector(`option[value="${res.size}"]`);
            if (opt) sizeSelect.value = res.size;
          }
          if (fromInput && calcPickup) fromInput.value = calcPickup;
          if (toInput && calcDelivery) toInput.value = calcDelivery;
          if (dateInput && calcDate) dateInput.value = calcDate;

          modal.classList.add('open');
          document.body.classList.add('no-scroll');
        }
      });
    });

    function applyUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const rawMove = params.get('moveType') || params.get('move') || params.get('service') || '';
      const rawSize = params.get('homeSize') || params.get('size') || params.get('vehicleSize') || '';
      const pickup = params.get('pickup') || params.get('from') || params.get('origin') || params.get('city');
      const delivery = params.get('delivery') || params.get('to') || params.get('dest');
      const extrasParam = params.get('extras') || params.get('addon');

      if (pickup) {
        const pickupInput = form.querySelector('#pickup');
        if (pickupInput) {
          pickupInput.value = decodeURIComponent(pickup);
        }
      }

      if (delivery) {
        const deliveryInput = form.querySelector('#delivery');
        if (deliveryInput) {
          deliveryInput.value = decodeURIComponent(delivery);
        }
      }

      let move = rawMove.toLowerCase();
      if (move === 'vehicle' || move === 'car' || move === 'bike' || move === 'twowheeler') move = 'auto';
      if (move === 'packing') {
        move = 'local';
        const pBox = form.querySelector('input[name="extras"][value="packing"]');
        if (pBox) pBox.checked = true;
      }
      if (move === 'storage') {
        const sBox = form.querySelector('input[name="extras"][value="storage"]');
        if (sBox) sBox.checked = true;
      }

      if (move) {
        const moveRadio = form.querySelector(`input[name="moveType"][value="${move}"]`);
        if (moveRadio) {
          moveRadio.checked = true;
          updateStep2Visibility();
        }
      }

      let size = rawSize.toLowerCase();
      if (size === '1bhk' || size === '1') size = 'studio';
      if (size === 'villa' || size === 'estate' || size === 'custom') size = '4bhk';

      if (size) {
        const isAuto = move === 'auto' || rawMove === 'auto';
        if (isAuto) {
          const vRadio = form.querySelector(`input[name="vehicleSize"][value="${size}"]`);
          if (vRadio) vRadio.checked = true;
        } else {
          const hRadio = form.querySelector(`input[name="homeSize"][value="${size}"]`);
          if (hRadio) hRadio.checked = true;
        }
      }

      if (extrasParam) {
        const list = extrasParam.split(',');
        list.forEach(ex => {
          const box = form.querySelector(`input[name="extras"][value="${ex.trim()}"]`);
          if (box) box.checked = true;
        });
      }

      updateStep2Visibility();
      calculate();

      // Smooth scroll to calculator if parameter or #calculator anchor present
      if (rawMove || rawSize || pickup || delivery || extrasParam || window.location.hash === '#calculator') {
        setTimeout(() => {
          const calcSection = document.getElementById('calculator');
          if (calcSection) {
            calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const pricePanel = document.querySelector('.price-panel');
            if (pricePanel) {
              pricePanel.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
              pricePanel.style.boxShadow = '0 0 0 4px rgba(7, 95, 215, 0.35)';
              setTimeout(() => { pricePanel.style.boxShadow = ''; }, 2000);
            }
          }
        }, 150);
      }
    }

    updateStep2Visibility();
    calculate();
    applyUrlParams();
  }

  function setupDashboardEstimate() {
    const form = document.getElementById('dashboardEstimate');
    if (!form) return;

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (window.validateMoveMateForm && !window.validateMoveMateForm(form)) return;

      const pickup = form.querySelector('#dashPickup')?.value || 'Green Park, New Delhi';
      const delivery = form.querySelector('#dashDelivery')?.value || 'Vaishali, Jaipur';
      const size = form.querySelector('#dashSize')?.value || '2 BHK';

      const pickupRow = document.querySelector('[data-dash-pickup]');
      const deliveryRow = document.querySelector('[data-dash-delivery]');
      const sizeRow = document.querySelector('[data-dash-size]');

      if (pickupRow) pickupRow.textContent = pickup;
      if (deliveryRow) deliveryRow.textContent = delivery;
      if (sizeRow) sizeRow.textContent = size;

      window.showToast?.('Estimate created successfully! Booking details updated.');
    });
  }

  function setupInvoiceDownload() {
    document.querySelectorAll('[data-download-invoice]').forEach(button => {
      button.addEventListener('click', () => {
        const invoiceContent = `=====================================================
               MOVEMATE LOGISTICS & RELOCATIONS
            Tax Invoice / Official Moving Receipt
=====================================================
Invoice ID     : INV-MM124567
Date           : 22 May 2026
Customer Name  : Rahul Sharma
Pickup Address : Green Park, New Delhi, 110016
Delivery Addr  : Vaishali Nagar, Jaipur, Rajasthan 302021
Move Type      : Intercity Relocation (2 BHK)
Vehicle Type   : 17 Ft Dedicated Container Truck
-----------------------------------------------------
ITEMIZED CHARGES:
-----------------------------------------------------
1. Professional Packing Charges          : ₹ 2,500.00
2. Careful Loading Charges               : ₹ 1,500.00
3. Dedicated Freight / Transport         : ₹ 6,000.00
4. Destination Unloading Charges         : ₹ 1,500.00
5. Transit Insurance & Toll Charges      : ₹   500.00
-----------------------------------------------------
Subtotal                                 : ₹12,000.00
GST (Inclusive 18%)                      : ₹ 1,830.50
-----------------------------------------------------
TOTAL AMOUNT PAID                        : ₹12,000.00
Payment Status                           : PAID (Online)
Transaction ID                           : TXN-984218764MM
-----------------------------------------------------
Thank you for trusting MoveMate!
We Pack. We Move. We Care.
For support: +91 98765 43210 | care@movemate.example
=====================================================`;

        const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'MoveMate-Invoice-INV-MM124567.txt';
        link.click();
        URL.revokeObjectURL(link.href);
        window.showToast?.('Invoice downloaded successfully.');
      });
    });
  }

  function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        btn.innerHTML = isPassword
          ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
          : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      });
    });
  }

  function setupAuth() {
    document.querySelectorAll('[data-auth-form]').forEach(form => {
      form.addEventListener('input', event => {
        const field = event.target;
        if (field.matches('[aria-invalid="true"]') && field.checkValidity()) {
          field.removeAttribute('aria-invalid');
          const error = field.closest('.field')?.querySelector('.error');
          if (error) error.textContent = '';
        }
      });

      form.addEventListener('submit', event => {
        event.preventDefault();
        if (window.validateMoveMateForm && !window.validateMoveMateForm(form)) return;

        if (form.dataset.authForm === 'forgot-password') {
          const email = form.querySelector('[name="email"]')?.value || 'rahul@example.com';
          const successBox = document.getElementById('resetSuccessMessage');
          const emailDisplay = document.getElementById('sentEmailAddress');
          if (emailDisplay) emailDisplay.textContent = email;

          window.showToast?.('Password reset instructions sent to your email!');

          if (successBox) {
            form.style.display = 'none';
            successBox.style.display = 'grid';
          }
          return;
        }

        const email = form.querySelector('[name="email"]')?.value.trim() || 'user@example.com';
        let name = 'User';
        if (form.querySelector('[name="firstName"]')?.value) {
          name = `${form.querySelector('[name="firstName"]').value} ${form.querySelector('[name="lastName"]')?.value || ''}`.trim();
        } else if (email && email.includes('@')) {
          const rawName = email.split('@')[0].replace(/[._-]/g, ' ');
          name = rawName.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }

        try {
          localStorage.setItem('movemate-user-email', email);
          localStorage.setItem('movemate-user-name', name);
        } catch (_) {}

        window.showToast?.(form.dataset.authForm === 'signup'
          ? 'Account created successfully! Opening your dashboard…'
          : 'Welcome back! Opening your dashboard…');

        setTimeout(() => {
          location.href = 'dashboard.html';
        }, 750);
      });
    });

    const retryBtn = document.getElementById('resetRetryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        const form = document.getElementById('forgotPasswordForm');
        const successBox = document.getElementById('resetSuccessMessage');
        if (form) {
          form.style.display = 'grid';
          form.querySelector('[name="email"]')?.focus();
        }
        if (successBox) successBox.style.display = 'none';
      });
    }

    setupPasswordToggles();
  }

  function setupDashboardNav() {
    const userGreeting = document.querySelector('[data-user-greeting]');
    const userNameEl = document.querySelector('[data-user-name]');
    const savedName = localStorage.getItem('movemate-user-name') || 'Rahul Sharma';

    if (userNameEl) userNameEl.textContent = savedName;
    if (userGreeting) userGreeting.textContent = `Welcome back, ${savedName.split(' ')[0]}!`;

    const switchTab = tabId => {
      // Update sidebar active link
      document.querySelectorAll('.side-link[data-dash-tab]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.dashTab === tabId);
      });

      // Update active view
      document.querySelectorAll('.dash-view').forEach(view => {
        view.classList.toggle('active', view.id === `view-${tabId}`);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Sidebar navigation buttons
    document.querySelectorAll('.side-link[data-dash-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.dashTab;
        switchTab(tab);
        const title = btn.querySelector('span')?.textContent || tab;
        window.showToast?.(`${title} view opened.`);
      });
    });

    // In-page tab triggers
    document.querySelectorAll('[data-dash-tab-trigger]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.dashTabTrigger;
        switchTab(tab);
      });
    });

    // Add new address handler
    const addAddrBtn = document.getElementById('addNewAddressBtn');
    if (addAddrBtn) {
      addAddrBtn.addEventListener('click', () => {
        const grid = document.querySelector('.address-grid');
        if (grid) {
          const newCard = document.createElement('article');
          newCard.className = 'address-card';
          newCard.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span class="eyebrow" style="margin-bottom:0">Additional Address</span>
              <span class="paid-pill" style="font-size:0.72rem">Saved</span>
            </div>
            <h3 style="font-size:1.15rem;margin:6px 0">Second Home Residence</h3>
            <p style="font-size:0.9rem;color:var(--text);margin-bottom:14px">Villa 12, Palm Meadows, Airport Road, Bengaluru 560066</p>
            <div style="margin-top:auto;display:flex;gap:10px">
              <button class="btn btn-outline btn-sm" type="button" onclick="showToast('Address details copied.')">Copy Address</button>
            </div>
          `;
          grid.appendChild(newCard);
          window.showToast?.('New address successfully added to your profile.');
        }
      });
    }
  }

  function setupLogout() {
    document.querySelectorAll('[data-logout-btn]').forEach(button => {
      button.addEventListener('click', () => {
        try {
          localStorage.removeItem('movemate-user-email');
          localStorage.removeItem('movemate-user-name');
        } catch (_) {}

        window.showToast?.('You have been logged out. Returning to home page…');
        setTimeout(() => {
          location.href = '../index.html';
        }, 750);
      });
    });
  }

  setupCalculator();
  setupDashboardEstimate();
  setupInvoiceDownload();
  setupAuth();
  setupDashboardNav();
  setupLogout();
})();
