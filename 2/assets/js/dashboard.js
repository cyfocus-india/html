(function () {
  "use strict";

  // Toast Notification Helper
  const toast = document.querySelector("#dash-toast");
  const toastMessage = document.querySelector("#toast-message");
  let toastTimer = null;

  function showToast(message, isSuccess = true) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // Theme Toggle (Dark / Light Theme)
  const savedTheme = localStorage.getItem("driveway-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;

  const updateThemeIcon = () => {
    const button = document.querySelector("#theme-toggle");
    if (!button) return;
    const isDark = document.documentElement.dataset.theme === "dark";
    button.innerHTML = isDark ? `<i data-lucide="sun"></i>` : `<i data-lucide="moon"></i>`;
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
    window.lucide?.createIcons();
  };

  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("driveway-theme", next);
    updateThemeIcon();
    showToast(`Switched to ${next} theme.`);
  });

  updateThemeIcon();

  // Layout Direction Toggle (RTL / LTR)
  const savedDirection = localStorage.getItem("driveway-direction") || "ltr";
  document.documentElement.dir = savedDirection;

  const updateRtlButton = () => {
    const button = document.querySelector("#rtl-toggle");
    if (!button) return;
    const isRtl = document.documentElement.dir === "rtl";
    button.innerHTML = `<span class="rtl-badge" style="font-weight:800;font-size:11px;">${isRtl ? "LTR" : "RTL"}</span>`;
    button.setAttribute("aria-label", isRtl ? "Switch to LTR" : "Switch to RTL");
    button.setAttribute("title", isRtl ? "Switch to LTR" : "Switch to RTL");
  };

  document.querySelector("#rtl-toggle")?.addEventListener("click", () => {
    const isRtl = document.documentElement.dir === "rtl";
    const nextDir = isRtl ? "ltr" : "rtl";
    document.documentElement.dir = nextDir;
    localStorage.setItem("driveway-direction", nextDir);
    updateRtlButton();
    showToast(`Switched layout to ${nextDir.toUpperCase()}.`);
  });

  updateRtlButton();

  // Tab Navigation / SPA Router
  const navLinks = document.querySelectorAll(".dash-nav a[data-tab]");
  const views = document.querySelectorAll(".dash-view");
  const sidebar = document.querySelector("#dash-sidebar");
  const sidebarToggle = document.querySelector("#sidebar-toggle");
  const sidebarBackdrop = document.querySelector("#sidebar-backdrop");

  function switchTab(tabName) {
    if (!tabName) return;

    if (tabName === "logout") {
      openLogoutModal();
      return;
    }

    const targetView = document.querySelector(`#view-${tabName}`);
    if (!targetView) return;

    // Update nav links active state
    navLinks.forEach((link) => {
      if (link.dataset.tab === tabName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update views active state
    views.forEach((view) => {
      if (view.id === `view-${tabName}`) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    // Update URL hash without jumping
    if (window.location.hash !== `#${tabName}`) {
      history.replaceState(null, "", `#${tabName}`);
    }

    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Re-render lucide icons in newly visible view
    window.lucide?.createIcons();
  }

  // Handle all elements that trigger a tab change
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-tab]");
    if (trigger) {
      const tab = trigger.dataset.tab;
      if (tab) {
        e.preventDefault();
        closeProfileDropdown();
        switchTab(tab);
      }
    }
  });

  // Handle initial URL hash on load or hashchange
  function handleHash() {
    const hash = window.location.hash.replace("#", "").trim();
    const validTabs = ["overview", "booking", "lessons", "progress", "feedback", "documents", "profile", "payments", "notifications"];
    if (validTabs.includes(hash)) {
      switchTab(hash);
    } else {
      switchTab("overview");
    }
  }

  window.addEventListener("hashchange", handleHash);

  // 1. Mobile Sidebar Toggle & Backdrop
  function openMobileSidebar() {
    if (window.innerWidth <= 860) {
      sidebar?.classList.add("open");
      sidebarBackdrop?.classList.add("show");
      sidebarToggle?.setAttribute("aria-expanded", "true");
    }
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove("open");
    sidebarBackdrop?.classList.remove("show");
    sidebarToggle?.setAttribute("aria-expanded", "false");
  }

  sidebarToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 860) {
      if (sidebar?.classList.contains("open")) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    }
  });

  sidebarBackdrop?.addEventListener("click", closeMobileSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMobileSidebar();
    }
  });

  // 2. User Profile Dropdown Menu
  const userProfileToggle = document.querySelector("#user-profile-toggle");
  const userProfileDropdown = document.querySelector("#user-profile-dropdown");

  function toggleProfileDropdown() {
    const isOpen = userProfileDropdown?.classList.toggle("show");
    userProfileToggle?.classList.toggle("active", isOpen);
    userProfileToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
  }

  function closeProfileDropdown() {
    userProfileDropdown?.classList.remove("show");
    userProfileToggle?.classList.remove("active");
    userProfileToggle?.setAttribute("aria-expanded", "false");
  }

  userProfileToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleProfileDropdown();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#user-profile-menu")) {
      closeProfileDropdown();
    }
  });

  // 3. Logout Modal
  const logoutModal = document.querySelector("#logout-modal");
  const cancelLogoutBtn = document.querySelector("#cancel-logout-btn");

  function openLogoutModal() {
    if (!logoutModal) return;
    logoutModal.classList.add("open");
    logoutModal.setAttribute("aria-hidden", "false");
    logoutModal.scrollTop = 0;
    const card = logoutModal.querySelector(".modal-card");
    if (card) card.scrollTop = 0;
    document.body.classList.add("modal-open");
  }

  function closeLogoutModal() {
    if (!logoutModal) return;
    logoutModal.classList.remove("open");
    logoutModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  cancelLogoutBtn?.addEventListener("click", closeLogoutModal);
  logoutModal?.addEventListener("click", (e) => {
    if (e.target === logoutModal) closeLogoutModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (logoutModal?.classList.contains("open")) closeLogoutModal();
      if (invoiceModal?.classList.contains("open")) closeInvoiceModal();
      if (logbookModal?.classList.contains("open")) closeLogbookModal();
      if (payModal?.classList.contains("open")) closePayModal();
    }
  });

  // 4. Feedback Coach Filter Tabs (All / Rajesh Kumar / Anita Rao)
  const coachFilterBtns = document.querySelectorAll("#coach-filter-group .filter-btn");
  const feedbackCards = document.querySelectorAll(".feedback-coach-card");

  coachFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      coachFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.coachFilter;

      feedbackCards.forEach((card) => {
        if (filter === "all" || card.dataset.coach === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });

      const label = filter === "all" ? "All Coaches" : (filter === "rajesh" ? "Rajesh Kumar" : "Anita Rao");
      showToast(`Filtered feedback for ${label}.`);
    });
  });

  // 5. Official Tax Invoice Modal & Actions
  const invoiceModal = document.querySelector("#invoice-modal");
  const closeInvoiceModalBtn = document.querySelector("#close-invoice-modal-btn");
  const closeInvoiceBtn = document.querySelector("#close-invoice-btn");
  const printInvoiceBtn = document.querySelector("#print-invoice-btn");

  function openInvoiceModal(customData = null) {
    if (!invoiceModal) return;

    const numEl = document.querySelector("#inv-modal-number");
    const dateEl = document.querySelector("#inv-modal-date");
    const methodEl = document.querySelector("#inv-modal-method");
    const totalEl = document.querySelector("#inv-modal-total");
    const itemsEl = document.querySelector("#inv-modal-items");

    if (customData) {
      if (numEl) numEl.textContent = `Receipt #${customData.txn}`;
      if (dateEl) dateEl.textContent = `Date: ${customData.date}`;
      if (methodEl) methodEl.textContent = customData.method || "Electronic Payment";
      if (totalEl) totalEl.textContent = customData.amount;
      if (itemsEl) {
        itemsEl.innerHTML = `
          <tr>
            <td>${customData.desc}</td>
            <td>1</td>
            <td>${customData.amount}</td>
            <td>${customData.amount}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Total Amount Paid:</td>
            <td style="color: #075cb3;">${customData.amount}</td>
          </tr>
        `;
      }
    } else {
      if (numEl) numEl.textContent = "Invoice #DW-9842";
      if (dateEl) dateEl.textContent = "Date: Aug 15, 2026";
      if (methodEl) methodEl.textContent = "UPI / Net Banking";
      if (totalEl) totalEl.textContent = "₹8,000";
      if (itemsEl) {
        itemsEl.innerHTML = `
          <tr>
            <td>Initial Admission &amp; Learner License Filing</td>
            <td>1</td>
            <td>₹4,000</td>
            <td>₹4,000</td>
          </tr>
          <tr>
            <td>2nd Installment: 10 In-Car Practical Lessons (Swift Dual-Control)</td>
            <td>10 Hrs</td>
            <td>₹400 / hr</td>
            <td>₹4,000</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Total Amount Paid:</td>
            <td style="color: #075cb3;">₹8,000</td>
          </tr>
        `;
      }
    }

    invoiceModal.classList.add("open");
    invoiceModal.setAttribute("aria-hidden", "false");
    invoiceModal.scrollTop = 0;
    const card = invoiceModal.querySelector(".modal-card");
    if (card) card.scrollTop = 0;
    document.body.classList.add("modal-open");
    window.lucide?.createIcons();
  }

  function closeInvoiceModal() {
    if (!invoiceModal) return;
    invoiceModal.classList.remove("open");
    invoiceModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelector("#btn-invoice-pdf-doc")?.addEventListener("click", () => {
    openInvoiceModal();
  });

  document.addEventListener("click", (e) => {
    const txnBtn = e.target.closest(".btn-txn-pdf");
    if (txnBtn) {
      const data = {
        txn: txnBtn.dataset.txn || "TXN-984210",
        amount: txnBtn.dataset.amount || "₹4,000",
        desc: txnBtn.dataset.desc || "Driving Course Installment",
        date: txnBtn.dataset.date || "Aug 15, 2026",
        method: txnBtn.dataset.method || "UPI (Google Pay)"
      };
      openInvoiceModal(data);
    }
  });

  closeInvoiceModalBtn?.addEventListener("click", closeInvoiceModal);
  closeInvoiceBtn?.addEventListener("click", closeInvoiceModal);
  invoiceModal?.addEventListener("click", (e) => {
    if (e.target === invoiceModal) closeInvoiceModal();
  });

  printInvoiceBtn?.addEventListener("click", () => {
    window.print();
  });

  // 6. Practical Driving Logbook Modal & Actions
  const logbookModal = document.querySelector("#logbook-modal");
  const closeLogbookModalBtn = document.querySelector("#close-logbook-modal-btn");
  const closeLogbookBtn = document.querySelector("#close-logbook-btn");
  const printLogbookBtn = document.querySelector("#print-logbook-btn");
  const btnViewLogbook = document.querySelector("#btn-view-logbook");

  function openLogbookModal() {
    if (!logbookModal) return;
    logbookModal.classList.add("open");
    logbookModal.setAttribute("aria-hidden", "false");
    logbookModal.scrollTop = 0;
    const card = logbookModal.querySelector(".modal-card");
    if (card) card.scrollTop = 0;
    document.body.classList.add("modal-open");
    window.lucide?.createIcons();
  }

  function closeLogbookModal() {
    if (!logbookModal) return;
    logbookModal.classList.remove("open");
    logbookModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  btnViewLogbook?.addEventListener("click", openLogbookModal);
  closeLogbookModalBtn?.addEventListener("click", closeLogbookModal);
  closeLogbookBtn?.addEventListener("click", closeLogbookModal);
  logbookModal?.addEventListener("click", (e) => {
    if (e.target === logbookModal) closeLogbookModal();
  });

  printLogbookBtn?.addEventListener("click", () => {
    window.print();
  });

  // 7. Interactive Payment Gateway Modal & Instant Processing
  const payModal = document.querySelector("#payment-gateway-modal");
  const closePayModalBtn = document.querySelector("#close-pay-modal-btn");
  const payMethodCards = document.querySelectorAll(".pay-method-card");
  const upiInputGroup = document.querySelector("#upi-input-group");
  const cardInputGroup = document.querySelector("#card-input-group");
  const netbankInputGroup = document.querySelector("#netbank-input-group");
  const gatewayForm = document.querySelector("#gateway-payment-form");
  const confirmPayBtn = document.querySelector("#confirm-pay-btn");

  let currentPaymentMethod = "upi";

  function openPayModal() {
    if (!payModal) return;
    payModal.classList.add("open");
    payModal.setAttribute("aria-hidden", "false");
    payModal.scrollTop = 0;
    const card = payModal.querySelector(".modal-card");
    if (card) card.scrollTop = 0;
    document.body.classList.add("modal-open");
    window.lucide?.createIcons();
  }

  function closePayModal() {
    if (!payModal) return;
    payModal.classList.remove("open");
    payModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelector("#pay-now-btn")?.addEventListener("click", openPayModal);
  document.querySelector("#table-pay-pending-btn")?.addEventListener("click", openPayModal);
  closePayModalBtn?.addEventListener("click", closePayModal);
  payModal?.addEventListener("click", (e) => {
    if (e.target === payModal) closePayModal();
  });

  // Payment Method Switching
  payMethodCards.forEach((card) => {
    card.addEventListener("click", () => {
      payMethodCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      currentPaymentMethod = card.dataset.method;

      if (upiInputGroup) upiInputGroup.style.display = currentPaymentMethod === "upi" ? "block" : "none";
      if (cardInputGroup) cardInputGroup.style.display = currentPaymentMethod === "card" ? "block" : "none";
      if (netbankInputGroup) netbankInputGroup.style.display = currentPaymentMethod === "netbanking" ? "block" : "none";
    });
  });

  // Submit Payment Gateway
  gatewayForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!confirmPayBtn) return;

    confirmPayBtn.innerHTML = `Processing Secure Payment... <i data-lucide="loader-2" class="spin"></i>`;
    confirmPayBtn.disabled = true;

    window.setTimeout(() => {
      confirmPayBtn.innerHTML = `Paid ₹4,500 Securely <i data-lucide="shield-check"></i>`;
      confirmPayBtn.disabled = false;
      closePayModal();

      // Update Table Row
      const idEl = document.querySelector("#pending-txn-id");
      const dateEl = document.querySelector("#pending-txn-date");
      const methodEl = document.querySelector("#pending-txn-method");
      const statusEl = document.querySelector("#pending-txn-status");
      const actionEl = document.querySelector("#pending-txn-action");

      const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      const methodLabel = currentPaymentMethod === "upi" ? "UPI (Google Pay)" : (currentPaymentMethod === "card" ? "Debit Card (Visa)" : "Net Banking (HDFC)");

      if (idEl) idEl.innerHTML = "<strong>TXN-989201</strong>";
      if (dateEl) dateEl.textContent = todayStr;
      if (methodEl) methodEl.textContent = methodLabel;
      if (statusEl) statusEl.innerHTML = `<span class="status-complete">Paid ✅</span>`;
      if (actionEl) {
        actionEl.innerHTML = `<button class="btn btn-outline btn-txn-pdf" type="button" style="padding:3px 8px;font-size:10px" data-txn="TXN-989201" data-amount="₹4,500" data-desc="Final Installment &amp; RTO Test Booking" data-date="${todayStr}" data-method="${methodLabel}"><i data-lucide="download"></i> PDF</button>`;
      }

      // Update Pay Banner
      const payBanner = document.querySelector(".dash-banner.pay-banner");
      if (payBanner) {
        payBanner.innerHTML = `
          <div>
            <strong style="font-size:15px;display:block">All Course Fees Paid in Full! 🎉</strong>
            <p>Your RTO practical driving test booking and final training hours have been confirmed.</p>
          </div>
          <span class="status-complete" style="background:#fff;color:#16804a;font-weight:700;padding:6px 14px;">Fully Paid</span>
        `;
      }

      showToast("Payment of ₹4,500 successful! Receipt #TXN-989201 generated in Documents.");
      window.lucide?.createIcons();
    }, 850);
  });

  // 8. Time Slot Selection (Quick Booking & Full Booking)
  function initSlotSelection(containerSelector, statusSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const slots = container.querySelectorAll(".time-slot");
    const statusSpan = document.querySelector(statusSelector);

    slots.forEach((slot) => {
      slot.addEventListener("click", () => {
        slots.forEach((s) => s.classList.remove("active"));
        slot.classList.add("active");
        const time = slot.dataset.time;
        if (statusSpan) {
          statusSpan.textContent = `Selected ${time}.`;
        }
      });
    });
  }

  initSlotSelection("#quick-booking .slot-grid", "#booking-status-overview");
  initSlotSelection("#full-booking-slots", "#full-booking-status");

  // Overview Quick Booking Submit
  const quickBookBtn = document.querySelector("#book-slot-overview");
  quickBookBtn?.addEventListener("click", () => {
    const date = document.querySelector("#lesson-date-overview")?.value || "2026-09-02";
    const instructor = document.querySelector("#lesson-instructor-overview")?.value || "Rajesh Kumar";
    const activeSlot = document.querySelector("#quick-booking .time-slot.active")?.dataset.time || "10:00 AM";

    quickBookBtn.textContent = "Booking...";
    quickBookBtn.disabled = true;

    window.setTimeout(() => {
      quickBookBtn.textContent = "Book Selected Slot";
      quickBookBtn.disabled = false;
      showToast(`Lesson booked for ${date} at ${activeSlot} with ${instructor}!`);
      addLessonToSchedule(date, activeSlot, "General Road Practice & Maneuvers", instructor);
    }, 600);
  });

  // Full Booking Form Submit
  const fullBookBtn = document.querySelector("#full-book-btn");
  fullBookBtn?.addEventListener("click", () => {
    const date = document.querySelector("#book-date")?.value || "2026-09-02";
    const instructor = document.querySelector("#book-instructor")?.value || "Rajesh Kumar";
    const course = document.querySelector("#book-course")?.value || "Four Wheeler (Car) - Manual";
    const activeSlot = document.querySelector("#full-booking-slots .time-slot.active")?.dataset.time || "10:00 AM";

    fullBookBtn.textContent = "Confirming Booking...";
    fullBookBtn.disabled = true;

    window.setTimeout(() => {
      fullBookBtn.textContent = "Confirm & Book Lesson";
      fullBookBtn.disabled = false;
      showToast(`Lesson confirmed! Scheduled on ${date} at ${activeSlot} (${course}).`);
      addLessonToSchedule(date, activeSlot, `Lesson: ${course}`, instructor);

      window.setTimeout(() => {
        switchTab("lessons");
      }, 1000);
    }, 700);
  });

  // Add lesson dynamically
  function addLessonToSchedule(dateStr, timeStr, topic, instructor) {
    const container = document.querySelector("#lesson-items-container");
    if (!container) return;

    const article = document.createElement("article");
    article.className = "lesson-card";
    article.dataset.status = "upcoming";
    article.innerHTML = `
      <div class="lesson-time-box">
        <strong>${timeStr}</strong>
        <small>${dateStr}</small>
      </div>
      <div class="lesson-detail">
        <h3>${topic}</h3>
        <p><i data-lucide="map-pin" style="width:12px;height:12px;display:inline"></i> Main Training Track • Swift Dual-Control</p>
      </div>
      <div class="lesson-instructor">
        <div class="avatar rajesh" aria-hidden="true">RK</div>
        <div><strong>${instructor}</strong><small>Certified Coach</small></div>
      </div>
      <div><span class="status-complete" style="color:#063fb0;background:#eef4fd;border-color:#d4e4fa">Confirmed</span></div>
      <div class="lesson-actions">
        <button class="btn btn-outline reschedule-btn" type="button">Reschedule</button>
        <button class="btn cancel-btn" type="button" style="color:#cc2f28;border-color:#ecc9c7">Cancel</button>
      </div>
    `;

    container.insertBefore(article, container.firstChild);
    window.lucide?.createIcons();
    attachLessonActions(article);
  }

  // Lesson Card Actions (Reschedule & Cancel)
  function attachLessonActions(card) {
    const cancelBtn = card.querySelector(".cancel-btn");
    const rescheduleBtn = card.querySelector(".reschedule-btn");

    cancelBtn?.addEventListener("click", () => {
      const confirmed = confirm("Are you sure you want to cancel this scheduled lesson?");
      if (confirmed) {
        card.dataset.status = "cancelled";
        const badge = card.querySelector(".status-complete");
        if (badge) {
          badge.textContent = "Cancelled";
          badge.style.color = "#dc2626";
          badge.style.background = "#fee2e2";
          badge.style.borderColor = "#fca5a5";
        }
        cancelBtn.remove();
        rescheduleBtn?.remove();
        showToast("Lesson cancelled.");
      }
    });

    rescheduleBtn?.addEventListener("click", () => {
      switchTab("booking");
      showToast("Select a new date and time slot to reschedule.");
    });
  }

  document.querySelectorAll(".lesson-card").forEach(attachLessonActions);

  // Lesson Filter Tabs (All / Upcoming / Completed)
  const filterBtns = document.querySelectorAll("#lesson-filter-group .filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      document.querySelectorAll(".lesson-card").forEach((card) => {
        if (filter === "all" || card.dataset.status === filter) {
          card.style.display = "grid";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Profile Edit Form Submit
  const profileForm = document.querySelector("#profile-edit-form");
  profileForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const saveBtn = profileForm.querySelector("button[type='submit']");
    if (saveBtn) {
      saveBtn.textContent = "Saving...";
      window.setTimeout(() => {
        saveBtn.textContent = "Save Profile Changes";
        showToast("Profile details updated successfully! ✅");
      }, 500);
    }
  });

  // Password Change Form Submit
  const passwordForm = document.querySelector("#password-change-form");
  passwordForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    passwordForm.reset();
    showToast("Password updated successfully! ✅");
  });

  // Instructor Note Form Submit
  const noteForm = document.querySelector("#instructor-note-form");
  noteForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    noteForm.reset();
    showToast("Message sent to Instructor Rajesh Kumar! They will review it before your lesson.");
  });

  // Document Upload Button
  const uploadDocBtn = document.querySelector("#upload-doc-btn");
  uploadDocBtn?.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = () => {
      if (input.files && input.files[0]) {
        showToast(`Document "${input.files[0].name}" uploaded and submitted for verification! ✅`);
      }
    };
    input.click();
  });

  // Download PDF Report Buttons
  document.querySelectorAll("#download-report, #download-report-2, #download-report-3").forEach((btn) => {
    btn.addEventListener("click", () => {
      const report = `<!doctype html><html><head><title>DriveWay Lesson Progress Summary</title><style>body{font-family:Arial,sans-serif;color:#0d213d;padding:48px;line-height:1.5}h1{border-bottom:3px solid #f4512a;padding-bottom:14px}.brand{font-weight:800;font-size:26px}.brand span{color:#f4512a}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:32px}.box{border:1px solid #dfe4ea;border-radius:8px;padding:18px}.box strong{display:block;font-size:22px}@media print{button{display:none}}</style></head><body><div class="brand">Drive<span>Way</span></div><h1>Official Student Training Record</h1><p><strong>Student:</strong> Priya Sharma</p><p><strong>Student ID:</strong> DWSTU12345</p><p><strong>License Type:</strong> Four Wheeler License</p><p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p><div class="grid"><div class="box"><strong>18h 00m</strong>Completed Hours</div><div class="box"><strong>22h 00m</strong>Remaining Hours</div><div class="box"><strong>40h 00m</strong>Minimum Required</div><div class="box"><strong>45%</strong>Progress</div></div><h2>Instructor Note</h2><p>Good control on clutch and braking. Improved steering control on turns. Continue practicing lane changes and mirror checks.</p><button onclick="window.print()">Save as PDF / Print</button><script>window.onload=()=>window.print()<\/script></body></html>`;
      const popup = window.open("", "_blank");
      if (popup) {
        popup.document.open();
        popup.document.write(report);
        popup.document.close();
      }
    });
  });

  // Notifications: Click to read & Mark All as Read
  const notifCards = document.querySelectorAll(".notif-card");
  const dashBadge = document.querySelector("#dash-badge");
  const topBadge = document.querySelector("#top-badge");

  function updateUnreadCount() {
    const unreadCount = document.querySelectorAll(".notif-card.unread").length;
    if (dashBadge) {
      dashBadge.textContent = String(unreadCount);
      dashBadge.style.display = unreadCount > 0 ? "grid" : "none";
    }
    if (topBadge) {
      topBadge.textContent = String(unreadCount);
      topBadge.style.display = unreadCount > 0 ? "grid" : "none";
    }
  }

  notifCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.classList.contains("unread")) {
        card.classList.remove("unread");
        card.querySelector(".notif-dot")?.remove();
        updateUnreadCount();
      }
    });
  });

  const markAllReadBtn = document.querySelector("#mark-all-read-btn");
  markAllReadBtn?.addEventListener("click", () => {
    notifCards.forEach((card) => {
      card.classList.remove("unread");
      card.querySelector(".notif-dot")?.remove();
    });
    updateUnreadCount();
    showToast("All notifications marked as read.");
  });

  // Initialize on load
  handleHash();
  window.lucide?.createIcons();
})();

