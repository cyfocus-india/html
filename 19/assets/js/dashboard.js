/**
 * AuraWash Laundry & Dry Cleaning - Auth & Customer Dashboard Engine
 * Pure Vanilla JavaScript - No libraries, no frameworks, zero SVG.
 * Full CRUD, HTML5 Canvas Chart, LocalStorage Persistence.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. LocalStorage Seed & Storage Helper Keys
     ========================================================================== */
  const USERS_KEY = 'aurawash_user';
  const ORDERS_KEY = 'aurawash_orders';
  const CARDS_KEY = 'aurawash_cards';
  const PREFS_KEY = 'aurawash_prefs';
  const NOTIFS_KEY = 'aurawash_notifs';

  // Seed default data if not present
  function initializeSampleData() {
    if (!localStorage.getItem(USERS_KEY)) {
      const defaultUser = {
        name: 'Eleanor Vance',
        email: 'eleanor.vance@example.com',
        phone: '(555) 438-2910',
        address: '742 Evergreen Terrace, Apt 4B, Springfield',
        points: 480
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUser));
    }

    if (!localStorage.getItem(ORDERS_KEY)) {
      const defaultOrders = [
        {
          id: 'AW-9421',
          date: '2026-10-12',
          pickupTime: 'Today 10:00 AM - 12:00 PM',
          services: 'Wash & Fold, Dress Shirts (4)',
          weight: '18 lbs',
          status: 'Cleaning',
          price: '$48.50',
          notes: 'Hypoallergenic detergent, medium starch on shirts',
          deliveryDate: '2026-10-14'
        },
        {
          id: 'AW-9388',
          date: '2026-10-10',
          pickupTime: 'Oct 10, 2:00 PM - 4:00 PM',
          services: 'Wool Blazer, Silk Gown, Trousers',
          weight: '3 pieces',
          status: 'Delivery',
          price: '$44.50',
          notes: 'Special care for silk hem, non-crease hangers',
          deliveryDate: '2026-10-13'
        },
        {
          id: 'AW-9310',
          date: '2026-10-06',
          pickupTime: 'Oct 06, 8:00 AM - 10:00 AM',
          services: 'Wash & Fold (28 lbs)',
          weight: '28 lbs',
          status: 'Delivered',
          price: '$54.60',
          notes: 'Fragrance-free wash, rolled towels',
          deliveryDate: '2026-10-07'
        },
        {
          id: 'AW-9250',
          date: '2026-09-28',
          pickupTime: 'Sep 28, 11:00 AM - 1:00 PM',
          services: 'Living Room Curtains (4 panels)',
          weight: '4 panels',
          status: 'Delivered',
          price: '$88.00',
          notes: 'Steam finish and pleated weighted hems',
          deliveryDate: '2026-10-01'
        }
      ];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    }

    if (!localStorage.getItem(CARDS_KEY)) {
      const defaultCards = [
        {
          id: 'card-1',
          last4: '4821',
          brand: 'Visa',
          holder: 'Eleanor Vance',
          exp: '08/28'
        },
        {
          id: 'card-2',
          last4: '9014',
          brand: 'Mastercard',
          holder: 'Eleanor Vance',
          exp: '11/27'
        }
      ];
      localStorage.setItem(CARDS_KEY, JSON.stringify(defaultCards));
    }

    if (!localStorage.getItem(PREFS_KEY)) {
      const defaultPrefs = {
        waterTemp: 'Cold',
        detergent: 'Hypoallergenic Unscented',
        starch: 'Light',
        folding: 'Flat Fold',
        smsAlerts: true
      };
      localStorage.setItem(PREFS_KEY, JSON.stringify(defaultPrefs));
    }

    if (!localStorage.getItem(NOTIFS_KEY)) {
      const defaultNotifs = [
        { id: 1, text: 'Van #3 is 15 minutes away from your pickup address.', time: '10 mins ago', read: false },
        { id: 2, text: 'Your 4 dress shirts have finished hand-pressing.', time: '2 hours ago', read: false },
        { id: 3, text: 'Invoice for Order AW-9388 has been generated ($44.50).', time: '1 day ago', read: true }
      ];
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(defaultNotifs));
    }
  }

  initializeSampleData();

  /* ==========================================================================
     2. Auth Pages Logic (signin.html & signup.html)
     ========================================================================== */
  function initAuthPages() {
    // Show/Hide password toggle
    const togglePassBtns = document.querySelectorAll('.toggle-password-btn');
    togglePassBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const input = this.parentElement.querySelector('.form-input');
        if (input.type === 'password') {
          input.type = 'text';
          this.textContent = '🙈';
        } else {
          input.type = 'password';
          this.textContent = '👁';
        }
      });
    });

    // Forgot password view toggle on Sign In page
    const forgotLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const loginFormCard = document.getElementById('loginFormCard');
    const resetFormCard = document.getElementById('resetPasswordCard');
    const resetForm = document.getElementById('resetPasswordForm');
    const resetSuccessAlert = document.getElementById('resetSuccessAlert');

    if (forgotLink && loginFormCard && resetFormCard) {
      forgotLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginFormCard.style.display = 'none';
        resetFormCard.style.display = 'block';
      });

      if (backToLoginLink) {
        backToLoginLink.addEventListener('click', function (e) {
          e.preventDefault();
          resetFormCard.style.display = 'none';
          loginFormCard.style.display = 'block';
        });
      }

      if (resetForm) {
        resetForm.addEventListener('submit', function (e) {
          e.preventDefault();
          const emailInput = document.getElementById('resetEmail');
          if (emailInput && emailInput.value.includes('@')) {
            resetSuccessAlert.style.display = 'block';
            resetSuccessAlert.textContent = `✓ A password reset link has been dispatched to ${emailInput.value.trim()}!`;
            resetForm.reset();
          }
        });
      }
    }

    // Sign In Form Submission
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
      signinForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('signinEmail').value.trim();
        const pass = document.getElementById('signinPassword').value;
        const errEl = document.getElementById('signinError');

        if (!email || !pass) {
          if (errEl) {
            errEl.textContent = 'Please fill in both your email and password.';
            errEl.style.display = 'block';
          }
          return;
        }

        // Save session
        const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        stored.email = email;
        localStorage.setItem(USERS_KEY, JSON.stringify(stored));

        // Redirect to Dashboard
        window.location.href = 'dashboard.html';
      });
    }

    // Sign Up Form Submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const pass = document.getElementById('signupPassword').value;
        const confirmPass = document.getElementById('signupConfirmPassword').value;
        const terms = document.getElementById('signupTerms').checked;
        const errEl = document.getElementById('signupError');

        if (!name || !email || !pass || !confirmPass) {
          showAuthError(errEl, 'All fields are required.');
          return;
        }

        if (pass.length < 6) {
          showAuthError(errEl, 'Password must be at least 6 characters.');
          return;
        }

        if (pass !== confirmPass) {
          showAuthError(errEl, 'Passwords do not match.');
          return;
        }

        if (!terms) {
          showAuthError(errEl, 'You must agree to the Terms of Service.');
          return;
        }

        // Save new user profile
        const newUser = {
          name: name,
          email: email,
          phone: phone || '(555) 000-0000',
          address: 'Default Pickup Address',
          points: 100 // Welcome bonus
        };
        localStorage.setItem(USERS_KEY, JSON.stringify(newUser));

        // Redirect to Dashboard
        window.location.href = 'dashboard.html';
      });
    }

    function showAuthError(el, msg) {
      if (el) {
        el.textContent = msg;
        el.style.display = 'block';
      }
    }
  }

  /* ==========================================================================
     3. Customer Dashboard Core Logic
     ========================================================================== */
  function initDashboard() {
    const dashContainer = document.querySelector('.dashboard-layout');
    if (!dashContainer) return;

    // Load active customer details
    const user = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const userNameEls = document.querySelectorAll('.dash-user-name');
    const userEmailEls = document.querySelectorAll('.dash-user-email');
    const userPointsEl = document.getElementById('dashRewardPoints');

    userNameEls.forEach((el) => (el.textContent = user.name || 'Valued Customer'));
    userEmailEls.forEach((el) => (el.textContent = user.email || 'customer@example.com'));
    if (userPointsEl) userPointsEl.textContent = (user.points || 480) + ' pts';

    // Sidebar View Navigation
    const navBtns = document.querySelectorAll('.dash-nav-btn');
    const viewPanels = document.querySelectorAll('.dash-view-panel');
    const dashSidebar = document.querySelector('.dash-sidebar');
    const dashHamburger = document.querySelector('.hamburger-btn-dash');

    navBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const targetView = this.getAttribute('data-view');
        if (!targetView) return;

        navBtns.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');

        viewPanels.forEach((p) => p.classList.remove('active'));
        const panel = document.getElementById(`view-${targetView}`);
        if (panel) panel.classList.add('active');

        // Close mobile drawer if open
        if (window.innerWidth <= 1024 && dashSidebar) {
          dashSidebar.classList.remove('is-open');
        }

        // Redraw chart if entering overview
        if (targetView === 'overview') {
          drawMonthlyVolumeChart();
        }
      });
    });

    // Mobile Sidebar Drawer Toggle
    if (dashHamburger && dashSidebar) {
      dashHamburger.addEventListener('click', function () {
        dashSidebar.classList.toggle('is-open');
      });
    }

    // Logout Button
    const logoutBtns = document.querySelectorAll('.dash-logout-btn');
    logoutBtns.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'signin.html';
      });
    });

    // Notifications Panel Toggle & Mark as Read
    const notifBtn = document.getElementById('dashNotifBtn');
    const notifDropdown = document.getElementById('dashNotifDropdown');
    const notifDot = document.getElementById('dashNotifDot');
    const markNotifsBtn = document.getElementById('markAllNotifsRead');

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        notifDropdown.classList.toggle('is-open');
      });

      document.addEventListener('click', function (e) {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
          notifDropdown.classList.remove('is-open');
        }
      });

      if (markNotifsBtn) {
        markNotifsBtn.addEventListener('click', function () {
          if (notifDot) notifDot.style.display = 'none';
          const notifs = JSON.parse(localStorage.getItem(NOTIFS_KEY) || '[]');
          notifs.forEach((n) => (n.read = true));
          localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
          renderNotifications();
        });
      }
    }

    function renderNotifications() {
      const notifsList = document.getElementById('dashNotifList');
      if (!notifsList) return;
      const notifs = JSON.parse(localStorage.getItem(NOTIFS_KEY) || '[]');
      notifsList.innerHTML = '';
      notifs.forEach((n) => {
        const item = document.createElement('div');
        item.className = 'notification-item';
        item.innerHTML = `<strong>${escapeHTML(n.text)}</strong><div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${escapeHTML(n.time)}</div>`;
        notifsList.appendChild(item);
      });
    }
    renderNotifications();

    /* ==========================================================================
       4. Canvas Chart Rendering (Pure HTML5 Canvas, Zero SVG)
       ========================================================================== */
    function drawMonthlyVolumeChart() {
      const canvas = document.getElementById('monthlyChart');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Detect dark theme
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const textColor = isDark ? '#94a3b8' : '#64748b';
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      const primaryBarColor = '#0284c7';
      const secondaryBarColor = '#06b6d4';

      ctx.clearRect(0, 0, width, height);

      const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const weightData = [34, 46, 52, 60, 48, 72]; // in lbs
      const maxVal = 80;

      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 20;
      const paddingRight = 20;

      const plotWidth = width - paddingLeft - paddingRight;
      const plotHeight = height - paddingTop - paddingBottom;

      // Draw horizontal grid lines
      ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = textColor;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      for (let i = 0; i <= 4; i++) {
        const y = paddingTop + (plotHeight / 4) * i;
        const val = Math.round(maxVal - (maxVal / 4) * i);

        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();

        ctx.fillText(val + ' lb', 5, y + 4);
      }

      // Draw bars
      const barWidth = Math.min(36, plotWidth / (months.length * 1.8));
      const colStep = plotWidth / months.length;

      months.forEach((m, idx) => {
        const x = paddingLeft + colStep * idx + (colStep - barWidth) / 2;
        const h = (weightData[idx] / maxVal) * plotHeight;
        const y = paddingTop + plotHeight - h;

        // Gradient for bar
        const grad = ctx.createLinearGradient(0, y, 0, y + h);
        grad.addColorStop(0, primaryBarColor);
        grad.addColorStop(1, secondaryBarColor);

        ctx.fillStyle = grad;
        ctx.beginPath();
        // rounded top
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, h, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, h);
        ctx.fill();

        // Month label
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(m, x + barWidth / 2, height - 10);
      });
      ctx.textAlign = 'left';
    }

    drawMonthlyVolumeChart();
    window.addEventListener('resize', drawMonthlyVolumeChart);
    window.addEventListener('themechange', drawMonthlyVolumeChart);

    /* ==========================================================================
       5. Orders Table & CRUD Actions
       ========================================================================== */
    function renderOrdersTable(filterStatus = 'all', searchQuery = '') {
      const tbody = document.getElementById('dashOrdersTableBody');
      const recentOrdersList = document.getElementById('dashRecentOrdersList');
      if (!tbody) return;

      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      tbody.innerHTML = '';

      let filtered = orders.filter((o) => {
        const matchesStatus = filterStatus === 'all' || o.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.services.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.notes.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });

      // Update stat counters
      const activeCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
      const totalCount = orders.length;
      const activeEl = document.getElementById('statActivePickups');
      const totalEl = document.getElementById('statTotalOrders');
      if (activeEl) activeEl.textContent = activeCount;
      if (totalEl) totalEl.textContent = totalCount;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color:var(--text-muted);">No orders found matching your search.</td></tr>`;
      } else {
        filtered.forEach((ord) => {
          const tr = document.createElement('tr');
          const badgeClass = ord.status.toLowerCase().replace(/\s+/g, '-');
          tr.innerHTML = `
            <td><strong>#${escapeHTML(ord.id)}</strong></td>
            <td>${escapeHTML(ord.date)}</td>
            <td>${escapeHTML(ord.services)}</td>
            <td>${escapeHTML(ord.weight)}</td>
            <td><span class="status-badge ${badgeClass}">${escapeHTML(ord.status)}</span></td>
            <td><strong>${escapeHTML(ord.price)}</strong></td>
            <td>
              <div class="action-btn-group">
                <button class="btn btn-secondary btn-sm" onclick="window.viewOrderModal('${escapeHTML(ord.id)}')">View</button>
                <button class="btn btn-secondary btn-sm" onclick="window.editOrderNotes('${escapeHTML(ord.id)}')">Notes</button>
                ${
                  ord.status === 'Scheduled'
                    ? `<button class="btn btn-sm" style="color:var(--danger-color);" onclick="window.cancelOrder('${escapeHTML(ord.id)}')">Cancel</button>`
                    : ''
                }
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }

      // Populate recent orders on Overview panel
      if (recentOrdersList) {
        recentOrdersList.innerHTML = '';
        orders.slice(0, 3).forEach((ord) => {
          const item = document.createElement('div');
          item.style.padding = '0.75rem 0';
          item.style.borderBottom = '1px solid var(--border-color)';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.innerHTML = `
            <div>
              <div style="font-weight:700; font-size:0.9rem;">#${escapeHTML(ord.id)} - ${escapeHTML(ord.services)}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHTML(ord.pickupTime)}</div>
            </div>
            <span class="status-badge ${ord.status.toLowerCase().replace(/\s+/g, '-')}">${escapeHTML(ord.status)}</span>
          `;
          recentOrdersList.appendChild(item);
        });
      }
    }

    renderOrdersTable();

    // Order status filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab-btn');
    let currentFilter = 'all';
    let currentSearch = '';

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        filterTabs.forEach((t) => t.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-status') || 'all';
        renderOrdersTable(currentFilter, currentSearch);
      });
    });

    // Orders search input
    const orderSearchInput = document.getElementById('orderSearchInput');
    if (orderSearchInput) {
      orderSearchInput.addEventListener('input', function () {
        currentSearch = this.value.trim();
        renderOrdersTable(currentFilter, currentSearch);
      });
    }

    // Topbar global search input
    const topSearch = document.getElementById('topbarSearchInput');
    if (topSearch) {
      topSearch.addEventListener('input', function () {
        currentSearch = this.value.trim();
        // switch to orders view if searching
        const ordersNavBtn = document.querySelector('.dash-nav-btn[data-view="orders-tracking"]');
        if (ordersNavBtn && currentSearch.length > 0) {
          ordersNavBtn.click();
        }
        if (orderSearchInput) orderSearchInput.value = currentSearch;
        renderOrdersTable(currentFilter, currentSearch);
      });
    }

    /* --- Global Order Modal Actions (View, Edit, Cancel) --- */
    window.viewOrderModal = function (orderId) {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const ord = orders.find((o) => o.id === orderId);
      if (!ord) return;

      const modal = document.getElementById('orderDetailModal');
      const content = document.getElementById('orderModalContent');
      if (!modal || !content) return;

      content.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size:1.3rem; margin-bottom: 0.25rem;">Order #${escapeHTML(ord.id)}</h3>
          <span class="status-badge ${ord.status.toLowerCase().replace(/\s+/g, '-')}">${escapeHTML(ord.status)}</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:1.5rem; font-size:0.9rem;">
          <div><strong>Pickup Window:</strong><br>${escapeHTML(ord.pickupTime)}</div>
          <div><strong>Delivery Date:</strong><br>${escapeHTML(ord.deliveryDate || 'Within 24 Hours')}</div>
          <div><strong>Services:</strong><br>${escapeHTML(ord.services)}</div>
          <div><strong>Total Estimate:</strong><br><span style="font-size:1.2rem; font-weight:800; color:var(--brand-primary);">${escapeHTML(ord.price)}</span></div>
        </div>
        <div style="background-color:var(--bg-secondary); padding:1rem; border-radius:var(--radius-sm); font-size:0.85rem; margin-bottom:1rem;">
          <strong>Special Instructions:</strong><br>${escapeHTML(ord.notes || 'None')}
        </div>
      `;
      modal.classList.add('is-active');
    };

    window.editOrderNotes = function (orderId) {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const ord = orders.find((o) => o.id === orderId);
      if (!ord) return;

      const newNotes = prompt('Update special instructions / delivery notes:', ord.notes || '');
      if (newNotes !== null) {
        ord.notes = newNotes.trim();
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        renderOrdersTable(currentFilter, currentSearch);
        alert('Notes updated successfully!');
      }
    };

    window.cancelOrder = function (orderId) {
      if (!confirm(`Are you sure you want to cancel order #${orderId}?`)) return;
      let orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      orders = orders.filter((o) => o.id !== orderId);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      renderOrdersTable(currentFilter, currentSearch);
      alert(`Order #${orderId} has been cancelled.`);
    };

    // Close Modals
    document.querySelectorAll('.modal-close-trigger').forEach((btn) => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('is-active'));
      });
    });

    /* ==========================================================================
       6. Schedule Pickup Form (Add New Order)
       ========================================================================== */
    const bookingForm = document.getElementById('dashBookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect checked services
        const checkedServices = [];
        document.querySelectorAll('input[name="pickupService"]:checked').forEach((c) => {
          checkedServices.push(c.value);
        });

        if (checkedServices.length === 0) {
          alert('Please select at least one garment service.');
          return;
        }

        const date = document.getElementById('bookDate').value;
        const timeSlot = document.getElementById('bookTimeSlot').value;
        const weightEst = document.getElementById('bookWeightEst').value || '15 lbs';
        const notes = document.getElementById('bookNotes').value || 'Standard premium wash';

        if (!date || !timeSlot) {
          alert('Please select both a pickup date and time window.');
          return;
        }

        // Generate Order
        const newId = 'AW-' + Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
          id: newId,
          date: date,
          pickupTime: `${date}, ${timeSlot}`,
          services: checkedServices.join(', '),
          weight: weightEst,
          status: 'Scheduled',
          price: '$' + (parseFloat(weightEst) * 1.95 + 10).toFixed(2),
          notes: notes,
          deliveryDate: '2 business days'
        };

        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        orders.unshift(newOrder);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

        // Add reward points
        const user = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        user.points = (user.points || 0) + 25;
        localStorage.setItem(USERS_KEY, JSON.stringify(user));
        if (userPointsEl) userPointsEl.textContent = user.points + ' pts';

        // Add notification
        const notifs = JSON.parse(localStorage.getItem(NOTIFS_KEY) || '[]');
        notifs.unshift({
          id: Date.now(),
          text: `Pickup #${newId} scheduled for ${date} (${timeSlot}).`,
          time: 'Just now',
          read: false
        });
        localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
        if (notifDot) notifDot.style.display = 'block';
        renderNotifications();

        alert(`✓ Success! Pickup #${newId} is booked. Our driver will arrive between ${timeSlot}.`);
        bookingForm.reset();
        renderOrdersTable();

        // Switch to Orders view
        const ordersTab = document.querySelector('.dash-nav-btn[data-view="orders-tracking"]');
        if (ordersTab) ordersTab.click();
      });
    }

    /* ==========================================================================
       7. Payments & Billing (Add / Delete Cards, View Invoices)
       ========================================================================== */
    function renderSavedCards() {
      const cardsList = document.getElementById('dashSavedCardsList');
      if (!cardsList) return;

      const cards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
      cardsList.innerHTML = '';

      cards.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'payment-card-visual';
        cardEl.innerHTML = `
          <button class="card-delete-btn" title="Delete card" onclick="window.deleteCard('${escapeHTML(card.id)}')">✕</button>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="card-chip"></div>
            <strong style="font-size:1.1rem; letter-spacing:1px;">${escapeHTML(card.brand)}</strong>
          </div>
          <div class="card-num-preview">•••• •••• •••• ${escapeHTML(card.last4)}</div>
          <div class="card-bottom-info">
            <div>
              <div style="font-size:0.7rem; opacity:0.8;">CARDHOLDER</div>
              <div style="font-weight:700; font-size:0.85rem;">${escapeHTML(card.holder)}</div>
            </div>
            <div>
              <div style="font-size:0.7rem; opacity:0.8;">EXPIRES</div>
              <div style="font-weight:700; font-size:0.85rem;">${escapeHTML(card.exp)}</div>
            </div>
          </div>
        `;
        cardsList.appendChild(cardEl);
      });
    }
    renderSavedCards();

    window.deleteCard = function (cardId) {
      if (!confirm('Are you sure you want to remove this payment card?')) return;
      let cards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
      cards = cards.filter((c) => c.id !== cardId);
      localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
      renderSavedCards();
    };

    // Add Card Modal Trigger & Submit
    const openAddCardBtn = document.getElementById('openAddCardBtn');
    const addCardModal = document.getElementById('addCardModal');
    const addCardForm = document.getElementById('addCardForm');

    if (openAddCardBtn && addCardModal) {
      openAddCardBtn.addEventListener('click', function () {
        addCardModal.classList.add('is-active');
      });
    }

    if (addCardForm) {
      addCardForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const holder = document.getElementById('cardHolderName').value.trim();
        const num = document.getElementById('cardNumberInput').value.trim();
        const exp = document.getElementById('cardExpInput').value.trim();

        if (!holder || num.length < 12 || !exp) {
          alert('Please enter valid credit card details.');
          return;
        }

        const last4 = num.slice(-4);
        const newCard = {
          id: 'card-' + Date.now(),
          last4: last4,
          brand: num.startsWith('4') ? 'Visa' : num.startsWith('5') ? 'Mastercard' : 'Amex',
          holder: holder,
          exp: exp
        };

        const cards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
        cards.push(newCard);
        localStorage.setItem(CARDS_KEY, JSON.stringify(cards));

        renderSavedCards();
        addCardModal.classList.remove('is-active');
        addCardForm.reset();
        alert('Payment method added successfully!');
      });
    }

    // Invoice View Modal
    window.viewInvoiceModal = function (invoiceNum, amount, date) {
      const modal = document.getElementById('invoiceModal');
      const body = document.getElementById('invoiceModalBody');
      if (!modal || !body) return;

      body.innerHTML = `
        <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:1.4rem;">INVOICE ${escapeHTML(invoiceNum)}</h3>
            <div style="font-size:0.85rem; color:var(--text-muted);">AuraWash Garment Concierge Ltd.</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.85rem;">Date: <strong>${escapeHTML(date)}</strong></div>
            <span class="status-badge delivered" style="margin-top:4px;">PAID</span>
          </div>
        </div>
        <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:0.9rem;">
          <tr style="border-bottom:1px solid var(--border-color);"><th style="text-align:left; padding:8px 0;">Description</th><th style="text-align:right; padding:8px 0;">Amount</th></tr>
          <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:8px 0;">Doorstep Laundry & Garment Care</td><td style="text-align:right; padding:8px 0;">${escapeHTML(amount)}</td></tr>
          <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:8px 0;">Doorstep Pickup & Delivery Van</td><td style="text-align:right; padding:8px 0;">$0.00 (Complimentary)</td></tr>
          <tr><td style="padding:12px 0; font-weight:700;">Total Paid</td><td style="text-align:right; padding:12px 0; font-size:1.2rem; font-weight:800; color:var(--brand-primary);">${escapeHTML(amount)}</td></tr>
        </table>
        <div style="text-align:center;">
          <button class="btn btn-primary btn-sm" onclick="window.print()">Print Receipt</button>
        </div>
      `;
      modal.classList.add('is-active');
    };

    /* ==========================================================================
       8. Profile & Laundry Care Preferences (Edit & Save)
       ========================================================================== */
    const profileForm = document.getElementById('dashProfileForm');
    const prefsForm = document.getElementById('dashPrefsForm');

    // Populate profile inputs
    if (profileForm) {
      document.getElementById('profName').value = user.name || '';
      document.getElementById('profEmail').value = user.email || '';
      document.getElementById('profPhone').value = user.phone || '';
      document.getElementById('profAddress').value = user.address || '';

      profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        user.name = document.getElementById('profName').value.trim();
        user.email = document.getElementById('profEmail').value.trim();
        user.phone = document.getElementById('profPhone').value.trim();
        user.address = document.getElementById('profAddress').value.trim();

        localStorage.setItem(USERS_KEY, JSON.stringify(user));
        userNameEls.forEach((el) => (el.textContent = user.name));
        userEmailEls.forEach((el) => (el.textContent = user.email));
        alert('✓ Profile information updated successfully!');
      });
    }

    // Populate care preferences
    if (prefsForm) {
      const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      if (prefs.waterTemp) document.getElementById('prefWaterTemp').value = prefs.waterTemp;
      if (prefs.detergent) document.getElementById('prefDetergent').value = prefs.detergent;
      if (prefs.starch) document.getElementById('prefStarch').value = prefs.starch;
      if (prefs.folding) document.getElementById('prefFolding').value = prefs.folding;
      if (typeof prefs.smsAlerts === 'boolean') document.getElementById('prefSms').checked = prefs.smsAlerts;

      prefsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const updatedPrefs = {
          waterTemp: document.getElementById('prefWaterTemp').value,
          detergent: document.getElementById('prefDetergent').value,
          starch: document.getElementById('prefStarch').value,
          folding: document.getElementById('prefFolding').value,
          smsAlerts: document.getElementById('prefSms').checked
        };
        localStorage.setItem(PREFS_KEY, JSON.stringify(updatedPrefs));
        alert('✓ Laundry care preferences updated and saved!');
      });
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, function (tag) {
      const chars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return chars[tag] || tag;
    });
  }

  // Initialize Auth & Dashboard depending on current page
  document.addEventListener('DOMContentLoaded', function () {
    initAuthPages();
    initDashboard();
  });
})();
