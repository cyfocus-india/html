(() => {
  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>'"]/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[character],
    );

  const icons = () => {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons({
        attrs: { "aria-hidden": "true", "stroke-width": 1.8 },
      });
    }
  };

  const toast = (message) => {
    const el = document.querySelector("[data-toast]");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el.timer);
    el.timer = setTimeout(() => el.classList.remove("show"), 2800);
  };

  // View Metadata for Header Sync
  const viewMeta = {
    overview: {
      title: "Welcome back, Ananya 👋",
      subtitle: "Here’s what’s happening across your training programs.",
    },
    enroll: {
      title: "Enroll Employees",
      subtitle: "Register single team members, assign learning tracks, or bulk upload CSV rosters.",
    },
    "my-enrollments": {
      title: "My Enrollments Roster",
      subtitle: "View and manage all 248 active learners, batch cohorts, and learning statuses.",
    },
    attendance: {
      title: "Attendance Tracking & Session Logs",
      subtitle: "Live check-in rates, attendance compliance, and active participation logs.",
    },
    "module-progress": {
      title: "Module & Competency Progression",
      subtitle: "Track syllabus milestone completion, quiz scores, and practical assessments.",
    },
    certificates: {
      title: "Certificates & Credentials Hub",
      subtitle: "Generate, verify, preview, and download official verifiable completion certificates.",
    },
    reports: {
      title: "Executive Analytics & ROI Reports",
      subtitle: "Departmental learning hours, assessment benchmarks, and audit export tools.",
    },
    calendar: {
      title: "Enterprise Training Calendar",
      subtitle: "Complete schedule of upcoming cohort bootcamps, workshops, and faculty sessions.",
    },
    programs: {
      title: "Corporate Training Programs Catalog",
      subtitle: "Enterprise curriculums, assigned faculty, duration, and active batch capacity.",
    },
    settings: {
      title: "HR Workspace & System Settings",
      subtitle: "Manage organizational preferences, notification triggers, and team role permissions.",
    },
  };

  // View Switcher / Routing System
  const titleEl = document.querySelector("[data-view-title]");
  const subtitleEl = document.querySelector("[data-view-subtitle]");
  const navLinks = document.querySelectorAll("[data-dash-nav]");
  const views = document.querySelectorAll("[data-dash-view]");

  const switchView = (viewKey) => {
    const targetView = document.querySelector(`[data-dash-view="${viewKey}"]`);
    if (!targetView) return;

    // Switch active view container
    views.forEach((v) => v.classList.remove("active"));
    targetView.classList.add("active");

    // Switch active sidebar nav link
    navLinks.forEach((link) => {
      const isMatch = link.dataset.dashNav === viewKey;
      link.classList.toggle("active", isMatch);
    });

    // Update Header Title & Subtitle
    if (viewMeta[viewKey]) {
      if (titleEl) titleEl.textContent = viewMeta[viewKey].title;
      if (subtitleEl) subtitleEl.textContent = viewMeta[viewKey].subtitle;
    }

    // Update URL hash without jumping page
    if (history.pushState) {
      history.pushState(null, null, `#${viewKey}`);
    } else {
      location.hash = `#${viewKey}`;
    }

    // Redraw charts or re-render icons if needed
    if (viewKey === "overview") {
      setTimeout(drawChart, 50);
    }
    icons();
  };

  // Event handlers for sidebar navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const viewKey = link.dataset.dashNav;
      switchView(viewKey);
      if (window.innerWidth <= 820) {
        closeSidebar();
      }
    });
  });

  // Buttons with data-switch-to-view
  document.querySelectorAll("[data-switch-to-view]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      switchView(btn.dataset.switchToView);
    });
  });

  // Topbar quick training calendar button
  document.querySelector("[data-quick-calendar]")?.addEventListener("click", () => {
    switchView("calendar");
  });

  // Check initial hash on load
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash && viewMeta[initialHash]) {
    switchView(initialHash);
  }

  window.addEventListener("hashchange", () => {
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash && viewMeta[currentHash]) {
      switchView(currentHash);
    }
  });

  // Mobile Sidebar Drawer & Backdrop
  const sidebar = document.querySelector("[data-sidebar]");
  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop && sidebar) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  const toggleSidebar = () => {
    const isOpen = sidebar?.classList.toggle("open");
    backdrop?.classList.toggle("show", isOpen);
  };

  const closeSidebar = () => {
    sidebar?.classList.remove("open");
    backdrop?.classList.remove("show");
  };

  document
    .querySelector("[data-sidebar-toggle]")
    ?.addEventListener("click", toggleSidebar);

  backdrop?.addEventListener("click", closeSidebar);

  // Modal Management
  const modal = document.querySelector("[data-enroll-modal]");
  const openModal = () => {
    modal?.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => document.querySelector("#employee-name")?.focus(), 100);
  };

  const closeModal = () => {
    modal?.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-open-enroll]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  document
    .querySelector("[data-close-enroll]")
    ?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("open")) {
      closeModal();
    }
  });

  // Form Validation & Enrollment
  const validate = (field) => {
    let message = "";
    const value = field.value.trim();
    if (field.required && !value) {
      message = "This field is required.";
    } else if (
      field.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      message = "Enter a valid work email address.";
    }
    const errContainer = field.closest(".field")?.querySelector(".error");
    if (errContainer) {
      errContainer.textContent = message;
    }
    field.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  };

  const setupFormValidation = (formElement) => {
    formElement
      ?.querySelectorAll("input, select")
      .forEach((field) => field.addEventListener("blur", () => validate(field)));
  };

  const modalForm = document.querySelector("[data-enroll-form]");
  const directForm = document.querySelector("[data-enroll-direct-form]");
  setupFormValidation(modalForm);
  setupFormValidation(directForm);

  const handleEnrollment = (rawName, rawEmail, rawProgram, rawDept, rawBatch) => {
    const name = escapeHtml(rawName);
    const email = escapeHtml(rawEmail || `${rawName.toLowerCase().replace(/[^a-z]/g, '')}@company.com`);
    const program = escapeHtml(rawProgram);
    const department = escapeHtml(rawDept);
    const batch = escapeHtml(rawBatch || "Sep 02 – Sep 13");
    const initials = escapeHtml(
      rawName
        .split(" ")
        .map((x) => x[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "EM",
    );

    // Overview Table Row
    const overviewRow = `<tr data-department="${department}" data-status="not-started">
      <td><div class="employee-cell"><span class="employee-avatar">${initials}</span><div><b>${name}</b><small>${email}</small></div></div></td>
      <td>${program}</td>
      <td>${department}</td>
      <td>0%</td>
      <td><div class="progress-line"><span class="progress-track"><span style="width:0%"></span></span><b>0%</b></div></td>
      <td><span class="status-pill not-started">Not started</span></td>
      <td><button type="button" class="button button-xs button-ghost" data-certificate data-name="${name}" data-program="${program}"><i data-lucide="award"></i> Certificate</button></td>
    </tr>`;

    // My Enrollments Roster Row
    const rosterRow = `<tr data-department="${department}" data-status="not-started">
      <td><div class="employee-cell"><span class="employee-avatar">${initials}</span><div><b>${name}</b><small>${email}</small></div></div></td>
      <td>${program}</td>
      <td>${department}</td>
      <td>${batch}</td>
      <td>0%</td>
      <td><div class="progress-line"><span class="progress-track"><span style="width:0%"></span></span><b>0%</b></div></td>
      <td><span class="status-pill not-started">Not started</span></td>
      <td><button type="button" class="button button-xs button-ghost" data-certificate data-name="${name}" data-program="${program}"><i data-lucide="award"></i> Certificate</button></td>
    </tr>`;

    document.querySelector("[data-employee-rows]")?.insertAdjacentHTML("afterbegin", overviewRow);
    document.querySelector("[data-roster-rows]")?.insertAdjacentHTML("afterbegin", rosterRow);

    // Increment counters
    const count = document.querySelector("[data-enrollment-count]");
    if (count) count.textContent = String(Number(count.textContent) + 1);

    const notStartedCount = document.querySelector("[data-notstarted-count]");
    if (notStartedCount) notStartedCount.textContent = String(Number(notStartedCount.textContent) + 1);

    bindCertificates();
    icons();
    toast(`${name} enrolled successfully in ${program}.`);
  };

  // Submit Handler for Modal
  modalForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...modalForm.querySelectorAll("input, select")];
    if (!fields.every(validate)) {
      modalForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const name = document.querySelector("#employee-name").value.trim();
    const email = document.querySelector("#employee-email").value.trim();
    const program = document.querySelector("#employee-program").value;
    const department = document.querySelector("#employee-department").value;
    const batch = document.querySelector("#employee-batch").value;

    handleEnrollment(name, email, program, department, batch);
    modalForm.reset();
    closeModal();
  });

  // Submit Handler for Direct Form on Enroll Page
  directForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...directForm.querySelectorAll("input, select")];
    if (!fields.every(validate)) {
      directForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const name = document.querySelector("#direct-name").value.trim();
    const email = document.querySelector("#direct-email").value.trim();
    const program = document.querySelector("#direct-program").value;
    const department = document.querySelector("#direct-dept").value;
    const batch = document.querySelector("#direct-batch").value;

    handleEnrollment(name, email, program, department, batch);
    directForm.reset();
  });

  // Table Search & Filters for Overview Table
  const deptFilter = document.querySelector("#dept-filter");
  const searchInput = document.querySelector("#employee-search");

  const applyOverviewFilters = () => {
    const selectedDept = deptFilter ? deptFilter.value : "all";
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    document.querySelectorAll("[data-employee-rows] tr").forEach((row) => {
      const rowDept = row.dataset.department;
      const rowText = row.innerText.toLowerCase();
      const matchDept = selectedDept === "all" || rowDept === selectedDept;
      const matchSearch = !query || rowText.includes(query);
      row.hidden = !(matchDept && matchSearch);
    });
  };

  deptFilter?.addEventListener("change", (e) => {
    applyOverviewFilters();
    toast(
      e.target.value === "all"
        ? "Showing all departments."
        : `Filtered to ${e.target.value}.`,
    );
  });

  searchInput?.addEventListener("input", applyOverviewFilters);

  document.querySelectorAll("[data-dashboard-filter]").forEach((select) => {
    if (select !== deptFilter) {
      select.addEventListener("change", () => {
        toast(`View updated: ${select.value}`);
      });
    }
  });

  // My Enrollments Roster Filters
  const rosterPills = document.querySelectorAll("[data-roster-filter-pills] .pill");
  const rosterSearch = document.querySelector("#roster-search");
  let activeRosterStatus = "all";

  const applyRosterFilters = () => {
    const query = rosterSearch ? rosterSearch.value.trim().toLowerCase() : "";
    document.querySelectorAll("[data-roster-rows] tr").forEach((row) => {
      const rowStatus = row.dataset.status;
      const rowText = row.innerText.toLowerCase();
      const matchStatus = activeRosterStatus === "all" || rowStatus === activeRosterStatus;
      const matchSearch = !query || rowText.includes(query);
      row.hidden = !(matchStatus && matchSearch);
    });
  };

  rosterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      rosterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeRosterStatus = pill.dataset.filterStatus;
      applyRosterFilters();
      toast(`Showing ${pill.textContent.trim()} learners.`);
    });
  });

  rosterSearch?.addEventListener("input", applyRosterFilters);

  // Attendance Sheet Batch Filter & Interactive Check-In Toggler
  const attendanceBatchFilter = document.querySelector("#attendance-batch-filter");
  attendanceBatchFilter?.addEventListener("change", (e) => {
    const selected = e.target.value;
    document.querySelectorAll(".attendance-table tbody tr").forEach((row) => {
      const prog = row.cells[1]?.textContent || "";
      if (selected === "all") {
        row.hidden = false;
      } else if (selected.includes("Sep 02")) {
        row.hidden = !prog.includes("Communication") && !prog.includes("Sales");
      } else if (selected.includes("Sep 16")) {
        row.hidden = !prog.includes("Leadership") && !prog.includes("Excel");
      }
    });
    toast(`Filtered attendance to: ${selected === "all" ? "All Cohort Batches" : selected}`);
  });

  document.querySelectorAll("[data-toggle-checkin]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const badge = row?.querySelector(".checkin-badge");
      if (!badge) return;

      const totalSessions = parseInt(row.cells[2]?.textContent || "10", 10);
      let attendedCell = row.cells[3];
      let rateCell = row.cells[4];
      let currentAttended = parseInt(attendedCell?.textContent || "9", 10);

      if (badge.classList.contains("present")) {
        badge.className = "checkin-badge late";
        badge.innerHTML = '<i data-lucide="clock"></i> Late (15m)';
        toast("Status updated to Late (Session recorded).");
      } else if (badge.classList.contains("late")) {
        badge.className = "checkin-badge absent";
        badge.innerHTML = '<i data-lucide="x"></i> Absent';
        currentAttended = Math.max(0, currentAttended - 1);
        if (attendedCell) attendedCell.textContent = String(currentAttended);
        const rate = Math.round((currentAttended / totalSessions) * 100);
        if (rateCell) {
          rateCell.innerHTML = `<b style="color:${rate < 75 ? '#e83d51' : '#17a269'}">${rate}%</b>`;
        }
        toast("Status updated to Absent.");
      } else {
        badge.className = "checkin-badge present";
        badge.innerHTML = '<i data-lucide="check"></i> Present';
        currentAttended = Math.min(totalSessions, currentAttended + 1);
        if (attendedCell) attendedCell.textContent = String(currentAttended);
        const rate = Math.round((currentAttended / totalSessions) * 100);
        if (rateCell) {
          rateCell.innerHTML = `<b style="color:${rate < 75 ? '#e83d51' : '#17a269'}">${rate}%</b>`;
        }
        toast("Status updated to Present (100% credit).");
      }
      icons();
    });
  });

  // Module Progress Program Track Switcher
  const moduleSelect = document.querySelector("#module-program-select");
  const moduleCardsGrid = document.querySelector(".module-cards-grid");

  const programModulesData = {
    "Leadership Essentials Track": [
      { num: "01", status: "completed", statusText: "Completed", title: "Foundations & Strategic Mindset", desc: "Core leadership paradigms, active listening, and team alignment models.", completion: "100%", quiz: "94.2%", time: "12 hrs" },
      { num: "02", status: "in-progress", statusText: "In Progress", title: "Conflict Resolution & Decision Frameworks", desc: "Navigating cross-functional tensions and executing high-stakes trade-offs.", completion: "84.0%", quiz: "88.5%", time: "16 hrs" },
      { num: "03", status: "in-progress", statusText: "In Progress", title: "Executive Presence & Stakeholder Influence", desc: "Boardroom presentation drills, narrative structuring, and persuasion.", completion: "65.0%", quiz: "79.0%", time: "10 hrs" },
      { num: "04", status: "not-started", statusText: "Upcoming", title: "Capstone Project & Practical Review", desc: "Real-world organizational case study defended before faculty panel.", completion: "35.0%", quiz: "—", time: "8 hrs Target" }
    ],
    "Effective Communication Track": [
      { num: "01", status: "completed", statusText: "Completed", title: "High-Impact Verbal & Written Clarity", desc: "Constructing executive summaries, email discipline, and concise memos.", completion: "100%", quiz: "96.0%", time: "8 hrs" },
      { num: "02", status: "completed", statusText: "Completed", title: "Active Listening & Empathetic Dialogue", desc: "Techniques for managing emotional undertones and aligning team perspectives.", completion: "100%", quiz: "91.8%", time: "10 hrs" },
      { num: "03", status: "in-progress", statusText: "In Progress", title: "Persuasive Storytelling for Leaders", desc: "Transforming raw corporate data into compelling strategic narratives.", completion: "72.0%", quiz: "85.4%", time: "14 hrs" },
      { num: "04", status: "in-progress", statusText: "In Progress", title: "Live Boardroom Simulation & Feedback", desc: "Live recorded delivery exercises with faculty evaluation.", completion: "45.0%", quiz: "80.0%", time: "6 hrs" }
    ],
    "Sales Excellence Track": [
      { num: "01", status: "completed", statusText: "Completed", title: "Enterprise Account Mapping & Discovery", desc: "Identifying key decision-makers and probing enterprise pain points.", completion: "100%", quiz: "92.0%", time: "14 hrs" },
      { num: "02", status: "in-progress", statusText: "In Progress", title: "Consultative Value-Based Selling", desc: "Framing solutions around ROI, operational efficiency, and risk mitigation.", completion: "88.0%", quiz: "89.2%", time: "16 hrs" },
      { num: "03", status: "in-progress", statusText: "In Progress", title: "High-Stakes Contract Negotiation", desc: "Price defense strategies, concession planning, and contract closure.", completion: "58.0%", quiz: "76.5%", time: "12 hrs" },
      { num: "04", status: "not-started", statusText: "Upcoming", title: "Pipeline Optimization & Forecasting", desc: "CRM hygiene, deal velocity metrics, and revenue predictability models.", completion: "20.0%", quiz: "—", time: "10 hrs Target" }
    ],
    "Advanced Excel & PowerBI Track": [
      { num: "01", status: "completed", statusText: "Completed", title: "Advanced Functions & Dynamic Arrays", desc: "XLOOKUP, LAMBDA, LET, and nested logic for large corporate datasets.", completion: "100%", quiz: "98.5%", time: "10 hrs" },
      { num: "02", status: "completed", statusText: "Completed", title: "Power Query ETL & Data Modeling", desc: "Automating data cleanup, merging multiple sources, and relationship architecture.", completion: "100%", quiz: "95.0%", time: "18 hrs" },
      { num: "03", status: "in-progress", statusText: "In Progress", title: "Interactive PowerBI Executive Dashboards", desc: "DAX formulas, KPI cards, visual hierarchy, and automated cloud refreshes.", completion: "70.0%", quiz: "88.0%", time: "14 hrs" },
      { num: "04", status: "not-started", statusText: "Upcoming", title: "Financial Forecasting & Sensitivity Analysis", desc: "Monte Carlo simulation, Goal Seek, and three-statement financial modeling.", completion: "15.0%", quiz: "—", time: "8 hrs Target" }
    ]
  };

  moduleSelect?.addEventListener("change", (e) => {
    const modules = programModulesData[e.target.value] || programModulesData["Leadership Essentials Track"];
    if (moduleCardsGrid) {
      moduleCardsGrid.innerHTML = modules.map(m => `
        <div class="dashboard-panel glass module-card">
          <div class="module-num">${m.num}</div>
          <div class="module-content">
            <span class="status-pill ${m.status}">${m.statusText}</span>
            <h3>${m.title}</h3>
            <p>${m.desc}</p>
            <div class="module-stats">
              <div><b>${m.completion}</b><small>Completion</small></div>
              <div><b>${m.quiz}</b><small>Quiz Avg</small></div>
              <div><b>${m.time}</b><small>Time Spent</small></div>
            </div>
          </div>
        </div>
      `).join("");
    }
    toast(`Loaded syllabus for ${e.target.value}.`);
  });

  // Batch Issue Certificates
  document.querySelector("[data-batch-certificates]")?.addEventListener("click", () => {
    toast("Issued 112 verified digital certificates. Archive package queued for download.");
  });

  // Program Catalog Card Enroll Buttons
  document.querySelectorAll(".program-catalog-card button[data-open-enroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".program-catalog-card");
      const progTitle = card?.querySelector("h3")?.textContent || "";
      switchView("enroll");
      const progSelect = document.getElementById("direct-program");
      if (progSelect && progTitle) {
        for (let i = 0; i < progSelect.options.length; i++) {
          if (progSelect.options[i].text.includes(progTitle) || progTitle.includes(progSelect.options[i].text)) {
            progSelect.selectedIndex = i;
            break;
          }
        }
      }
      toast(`Selected ${progTitle} in enrollment form.`);
    });
  });

  // CSV Report Generator
  const download = (name, type, content) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: name,
    });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  document.querySelectorAll("[data-download-report]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rows = [
        ...document.querySelectorAll("[data-employee-rows] tr:not([hidden])"),
      ].map((row) =>
        [...row.cells]
          .slice(0, 6)
          .map((cell) => `"${cell.innerText.trim().replaceAll('"', '""')}"`)
          .join(","),
      );

      download(
        "elevate-training-report.csv",
        "text/csv",
        "Employee,Program,Department,Attendance,Progress,Status\n" +
          rows.join("\n"),
      );
      toast("Training report CSV exported successfully.");
    });
  });

  document.querySelector("[data-export-attendance]")?.addEventListener("click", () => {
    download(
      "elevate-attendance-sheet.csv",
      "text/csv",
      "Learner,Program,Total Sessions,Attended,Rate,Latest Status\n" +
        "Aarav Sharma,Effective Communication,10,9,90%,Present\n" +
        "Neha Verma,Leadership Essentials,12,12,100%,Present\n" +
        "Rohan Mehta,Sales Excellence,10,8,80%,Late (15m)\n" +
        "Priya Nair,Advanced Excel,8,4,50%,Absent\n" +
        "Karan Singh,Communication Mastery,10,10,100%,Present\n",
    );
    toast("Attendance sheet exported to CSV.");
  });

  document.querySelector("[data-download-template]")?.addEventListener("click", () => {
    download(
      "employee-roster-template.csv",
      "text/csv",
      "Full Name,Work Email,Department,Program Track,Batch Date,Modality\n" +
        "Sample Employee,sample@company.com,Technology,Leadership Essentials,Sep 02 - Sep 13,Live Virtual\n",
    );
    toast("CSV Template downloaded.");
  });

  // Dynamic Certificate Generation
  const bindCertificates = () => {
    document
      .querySelectorAll("[data-certificate]:not([data-bound])")
      .forEach((button) => {
        button.dataset.bound = "true";
        button.addEventListener("click", () => {
          const { name, program } = button.dataset;
          const certId = "ELV-" + Math.floor(100000 + Math.random() * 900000);
          const certificate = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Certificate of Completion - ${name}</title>
  <style>
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: grid;
      place-items: center;
      min-height: 100vh;
      margin: 0;
      background: #eef4fc;
    }
    .cert-frame {
      width: 840px;
      max-width: 90%;
      padding: 70px 60px;
      text-align: center;
      background: #fff;
      border: 14px solid #075bea;
      outline: 2px solid #53c9ff;
      outline-offset: -26px;
      color: #06193d;
      border-radius: 8px;
      box-shadow: 0 30px 80px rgba(7, 91, 234, 0.2);
    }
    .cert-icon { font-size: 46px; color: #075bea; margin-bottom: 8px; }
    .cert-title { font-size: 38px; font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #06193d; }
    .cert-subtitle { letter-spacing: 4px; text-transform: uppercase; color: #64748b; font-size: 13px; font-weight: 700; margin: 20px 0; }
    .cert-name { font-size: 42px; font-weight: 800; margin: 18px 0; color: #075bea; }
    .cert-desc { font-size: 16px; color: #475569; margin: 14px 0; }
    .cert-program { font-size: 24px; font-weight: 800; color: #0a2558; }
    .cert-footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 30px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
    .cert-sign { text-align: left; }
    .cert-seal { text-align: right; }
    .cert-id { font-family: monospace; font-size: 12px; color: #94a3b8; margin-top: 16px; }
  </style>
</head>
<body>
  <main class="cert-frame">
    <div class="cert-icon">✦</div>
    <h1 class="cert-title">Certificate of Completion</h1>
    <div class="cert-subtitle">This is proudly presented to</div>
    <div class="cert-name">${name}</div>
    <div class="cert-desc">for successfully completing the executive enterprise training module</div>
    <div class="cert-program">${program}</div>
    <div class="cert-footer">
      <div class="cert-sign">
        <b>Dr. Elena Vance</b><br>Director of Corporate Training
      </div>
      <div class="cert-seal">
        <b>Elevate Learning Institute</b><br>Verified Certification
      </div>
    </div>
    <div class="cert-id">Credential ID: ${certId} · Issued September 2026</div>
  </main>
</body>
</html>`;

          download(
            `${name.toLowerCase().replaceAll(" ", "-")}-certificate.html`,
            "text/html",
            certificate,
          );
          toast(`Certificate downloaded for ${name}.`);
        });
      });
  };

  bindCertificates();

  // Fully Functional Dynamic Calendar Engine
  let calendarYear = 2026;
  let calendarMonth = 8; // September 2026 (0-indexed)
  let selectedDateKey = "2026-8-8";

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthShortNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const cohortSchedules = {
    "2026-8-8": {
      title: "Leadership Essentials — Cohort A",
      faculty: "Dr. Elena Vance",
      time: "9:00 AM – 1:00 PM",
      room: "Hybrid Hall A",
      status: "available",
      statusText: "12 seats available",
      badge: "12 Seats Open"
    },
    "2026-8-16": {
      title: "Sales Negotiation & Pitch Masterclass",
      faculty: "Marcus Brody",
      time: "2:00 PM – 5:00 PM",
      room: "Virtual Live Room 2",
      status: "limited",
      statusText: "3 seats left",
      badge: "3 Seats Left"
    },
    "2026-8-25": {
      title: "Advanced Excel & Financial Modeling",
      faculty: "Sarah Jenkins",
      time: "10:00 AM – 2:00 PM",
      room: "Executive Lab 4B",
      status: "full",
      statusText: "Batch Full",
      badge: "Full Cohort"
    },
    "2026-7-12": {
      title: "AI & Automation in HR Operations",
      faculty: "Arjun Mehta",
      time: "10:00 AM – 1:00 PM",
      room: "Innovation Suite",
      status: "available",
      statusText: "15 seats available",
      badge: "15 Seats Open"
    },
    "2026-7-20": {
      title: "Leadership Presence & Executive Speaking",
      faculty: "Dr. Elena Vance",
      time: "1:00 PM – 4:00 PM",
      room: "Hall B",
      status: "limited",
      statusText: "2 seats left",
      badge: "2 Seats Left"
    },
    "2026-9-10": {
      title: "Design Thinking & Agile Sprint Masterclass",
      faculty: "Pooja Singhania",
      time: "9:30 AM – 1:30 PM",
      room: "Workshop Room 1",
      status: "available",
      statusText: "10 seats available",
      badge: "10 Seats Open"
    },
    "2026-9-22": {
      title: "Corporate Data Analytics with Python & PowerBI",
      faculty: "Vikram Malhotra",
      time: "2:00 PM – 6:00 PM",
      room: "Tech Lab 1",
      status: "limited",
      statusText: "4 seats left",
      badge: "4 Seats Left"
    }
  };

  const updateSessionList = () => {
    const listEl = document.querySelector("[data-session-schedule-list]");
    if (!listEl) return;

    const monthCohorts = [];
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
      const key = `${calendarYear}-${calendarMonth}-${day}`;
      if (cohortSchedules[key]) {
        monthCohorts.push({ day, ...cohortSchedules[key], dateKey: key });
      }
    }

    if (monthCohorts.length === 0) {
      listEl.innerHTML = `
        <div class="notify-empty" style="padding: 28px 16px;">
          <i data-lucide="calendar-off"></i>
          <span>No scheduled cohorts for ${monthNames[calendarMonth]} ${calendarYear}.</span>
        </div>
      `;
      icons();
      return;
    }

    const monthShort = monthShortNames[calendarMonth];
    listEl.innerHTML = monthCohorts.map(c => `
      <div class="session-schedule-item ${selectedDateKey === c.dateKey ? 'highlighted-session' : ''}" data-session-key="${c.dateKey}">
        <div class="session-date-badge">
          <span>${monthShort}</span><b>${String(c.day).padStart(2, '0')}</b>
        </div>
        <div class="session-details">
          <b>${c.title}</b>
          <small><i data-lucide="user"></i> ${c.faculty} • ${c.time} • ${c.room}</small>
          <span class="capacity-badge ${c.status}">${c.badge}</span>
        </div>
      </div>
    `).join("");
    icons();
  };

  // Calendar Modal & Session Details Controller
  const calendarModal = document.querySelector("[data-calendar-modal]");
  const calendarModalDate = document.querySelector("[data-calendar-modal-date]");
  const calendarModalContent = document.querySelector("[data-calendar-modal-content]");

  const exportSingleICS = (key) => {
    const c = cohortSchedules[key];
    if (!c) return;
    const [y, m, d] = key.split("-");
    const monthNum = String(Number(m) + 1).padStart(2, "0");
    const dayNum = String(d).padStart(2, "0");
    const dateStr = `${y}${monthNum}${dayNum}`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Elevate Learning//Corporate Training Schedule//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${c.title}`,
      `DESCRIPTION:Faculty: ${c.faculty} | Location: ${c.room} | Status: ${c.statusText}`,
      `LOCATION:${c.room}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `STATUS:CONFIRMED`,
      `UID:${key}-${Date.now()}@elevatelearning.com`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(`📅 Downloaded calendar invite (.ics) for ${c.title}.`);
  };

  const openCalendarModal = (dateKey) => {
    if (!calendarModal || !calendarModalContent) return;
    const parts = dateKey.split("-");
    const formattedDate = `${monthNames[Number(parts[1])]} ${String(parts[2]).padStart(2, "0")}, ${parts[0]}`;
    if (calendarModalDate) calendarModalDate.textContent = formattedDate;

    const cohort = cohortSchedules[dateKey];
    if (cohort) {
      calendarModalContent.innerHTML = `
        <div class="calendar-session-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
            <h3>${cohort.title}</h3>
            <span class="capacity-badge ${cohort.status}">${cohort.badge}</span>
          </div>
          <div class="session-meta-grid">
            <div class="session-meta-item">
              <i data-lucide="user"></i> <span><b>Faculty:</b> ${cohort.faculty}</span>
            </div>
            <div class="session-meta-item">
              <i data-lucide="clock"></i> <span><b>Time:</b> ${cohort.time}</span>
            </div>
            <div class="session-meta-item">
              <i data-lucide="map-pin"></i> <span><b>Room:</b> ${cohort.room}</span>
            </div>
            <div class="session-meta-item">
              <i data-lucide="users"></i> <span><b>Capacity:</b> ${cohort.statusText}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px;">
          <button type="button" class="button" data-modal-enroll-cohort>
            <i data-lucide="user-plus"></i> Enroll Learners in this Cohort
          </button>
          <button type="button" class="button button-ghost" data-modal-export-single>
            <i data-lucide="calendar"></i> Add to Calendar (.ics)
          </button>
        </div>
      `;
    } else {
      calendarModalContent.innerHTML = `
        <div class="calendar-empty-state">
          <i data-lucide="calendar-plus"></i>
          <p>No active cohort currently scheduled for <b>${formattedDate}</b>.</p>
        </div>
        <form class="calendar-schedule-form" data-new-session-form>
          <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800;">Schedule a New Cohort Session on this Date:</h4>
          <div class="field">
            <label for="new-session-program">Select Training Program</label>
            <select id="new-session-program" required>
              <option value="Leadership Essentials">Leadership Essentials</option>
              <option value="Effective Communication">Effective Communication</option>
              <option value="Sales Excellence">Sales Excellence</option>
              <option value="Advanced Excel & Analytics">Advanced Excel & Analytics</option>
              <option value="AI & Automation Bootcamp">AI & Automation Bootcamp</option>
            </select>
          </div>
          <div class="field">
            <label for="new-session-faculty">Assigned Faculty / Trainer</label>
            <select id="new-session-faculty" required>
              <option value="Dr. Elena Vance">Dr. Elena Vance</option>
              <option value="Marcus Brody">Marcus Brody</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="Vikram Malhotra">Vikram Malhotra</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="field">
              <label for="new-session-time">Time Slot</label>
              <select id="new-session-time" required>
                <option value="9:00 AM – 1:00 PM">9:00 AM – 1:00 PM</option>
                <option value="2:00 PM – 5:00 PM">2:00 PM – 5:00 PM</option>
                <option value="6:00 PM – 9:00 PM">6:00 PM – 9:00 PM</option>
              </select>
            </div>
            <div class="field">
              <label for="new-session-room">Modality & Venue</label>
              <select id="new-session-room" required>
                <option value="Hybrid Hall A">Hybrid Hall A</option>
                <option value="Virtual Live Zoom">Virtual Live Zoom</option>
                <option value="Executive Lab 4B">Executive Lab 4B</option>
              </select>
            </div>
          </div>
          <button type="submit" class="button" style="margin-top: 6px;">
            <i data-lucide="check"></i> Confirm & Schedule Cohort
          </button>
        </form>
      `;
    }

    icons();
    calendarModal.classList.add("open");

    calendarModalContent.querySelector("[data-modal-enroll-cohort]")?.addEventListener("click", () => {
      calendarModal.classList.remove("open");
      switchView("enroll");
    });

    calendarModalContent.querySelector("[data-modal-export-single]")?.addEventListener("click", () => {
      exportSingleICS(dateKey);
    });

    calendarModalContent.querySelector("[data-new-session-form]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const prog = document.getElementById("new-session-program").value;
      const faculty = document.getElementById("new-session-faculty").value;
      const time = document.getElementById("new-session-time").value;
      const room = document.getElementById("new-session-room").value;

      cohortSchedules[dateKey] = {
        title: `${prog} — Cohort Scheduled`,
        faculty: faculty,
        time: time,
        room: room,
        status: "available",
        statusText: "25 seats available",
        badge: "25 Seats Open"
      };

      calendarModal.classList.remove("open");
      renderCalendar();
      toast(`✅ New cohort scheduled on ${formattedDate} for ${prog}.`);
    });
  };

  document.querySelector("[data-close-calendar-modal]")?.addEventListener("click", () => {
    calendarModal?.classList.remove("open");
  });

  calendarModal?.addEventListener("click", (e) => {
    if (e.target === calendarModal) {
      calendarModal.classList.remove("open");
    }
  });

  const bindCalendarDays = () => {
    document.querySelectorAll("[data-date-key]").forEach((dayEl) => {
      dayEl.addEventListener("click", () => {
        const dateKey = dayEl.dataset.dateKey;
        selectedDateKey = dateKey;

        document.querySelectorAll("[data-date-key]").forEach(el => {
          el.classList.toggle("selected-day", el.dataset.dateKey === dateKey);
        });

        openCalendarModal(dateKey);
        updateSessionList();
      });

      dayEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dayEl.click();
        }
      });
    });

    // Session list click triggers modal
    document.querySelectorAll("[data-session-key]").forEach((item) => {
      item.addEventListener("click", () => {
        const key = item.dataset.sessionKey;
        selectedDateKey = key;
        openCalendarModal(key);
      });
    });
  };

  const renderCalendar = () => {
    const labelStr = `${monthNames[calendarMonth]} ${calendarYear}`;
    const labelOverview = document.querySelector("[data-calendar-label]");
    const labelFull = document.querySelector("[data-calendar-label-full]");
    if (labelOverview) labelOverview.textContent = labelStr;
    if (labelFull) labelFull.textContent = labelStr;

    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    let daysHtml = `
      <span class="day-name">Sun</span>
      <span class="day-name">Mon</span>
      <span class="day-name">Tue</span>
      <span class="day-name">Wed</span>
      <span class="day-name">Thu</span>
      <span class="day-name">Fri</span>
      <span class="day-name">Sat</span>
    `;

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      daysHtml += `<span class="muted-day">${prevMonthDays - i}</span>`;
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateKey = `${calendarYear}-${calendarMonth}-${day}`;
      const cohort = cohortSchedules[dateKey];
      const isSelected = selectedDateKey === dateKey;

      let classNames = [];
      let dataSeatAttr = "";

      if (cohort) {
        classNames.push(cohort.status);
        dataSeatAttr = `data-seat="${cohort.statusText}"`;
      }
      if (isSelected) {
        classNames.push("selected-day");
      }

      const classAttr = classNames.length ? `class="${classNames.join(" ")}"` : "";
      daysHtml += `<span ${classAttr} data-date-key="${dateKey}" ${dataSeatAttr} tabindex="0">${day}</span>`;
    }

    const totalRendered = firstDayIndex + totalDays;
    const remainingDays = (Math.ceil(totalRendered / 7) * 7) - totalRendered;
    for (let j = 1; j <= remainingDays; j++) {
      daysHtml += `<span class="muted-day">${j}</span>`;
    }

    const gridOverview = document.querySelector("[data-calendar-grid]");
    const gridFull = document.querySelector("[data-calendar-grid-full]");
    if (gridOverview) gridOverview.innerHTML = daysHtml;
    if (gridFull) gridFull.innerHTML = daysHtml;

    updateSessionList();
    bindCalendarDays();
  };

  document.querySelectorAll("[data-calendar-prev]").forEach((btn) => {
    btn.addEventListener("click", () => {
      calendarMonth--;
      if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
      }
      renderCalendar();
    });
  });

  document.querySelectorAll("[data-calendar-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      calendarMonth++;
      if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
      }
      renderCalendar();
    });
  });

  document.querySelectorAll("[data-calendar-today]").forEach((btn) => {
    btn.addEventListener("click", () => {
      calendarYear = 2026;
      calendarMonth = 8; // September 2026
      selectedDateKey = "2026-8-8";
      renderCalendar();
      toast("Jumped to current month (September 2026).");
    });
  });

  const generateFullICS = () => {
    let ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Elevate Learning//Corporate Training Schedule//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Elevate Learning Corporate Training Schedule"
    ];

    Object.entries(cohortSchedules).forEach(([key, c]) => {
      const [y, m, d] = key.split("-");
      const monthNum = String(Number(m) + 1).padStart(2, "0");
      const dayNum = String(d).padStart(2, "0");
      const dateStr = `${y}${monthNum}${dayNum}`;

      ics.push(
        "BEGIN:VEVENT",
        `SUMMARY:${c.title}`,
        `DESCRIPTION:Faculty: ${c.faculty} | Location: ${c.room} | Status: ${c.statusText}`,
        `LOCATION:${c.room}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `STATUS:CONFIRMED`,
        `UID:${key}-${Date.now()}@elevatelearning.com`,
        "END:VEVENT"
      );
    });

    ics.push("END:VCALENDAR");
    return ics.join("\r\n");
  };

  document.querySelectorAll("[data-ical-export]").forEach(btn => {
    btn.addEventListener("click", () => {
      const icsContent = generateFullICS();
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Elevate_Learning_Training_Schedule_2026.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("📅 Exported full schedule (.ics) for Outlook & Google Calendar.");
    });
  });

  renderCalendar();

  // Settings Save Handlers
  document.querySelectorAll("[data-save-settings], [data-settings-form]").forEach((el) => {
    el.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("HR portal settings saved successfully.");
    });
    if (el.tagName === "BUTTON") {
      el.addEventListener("click", () => {
        toast("HR portal settings saved successfully.");
      });
    }
  });

  // Interactive Notification System
  const notifyBtn = document.querySelector("[data-notify-btn]");
  const notifyDropdown = document.querySelector("[data-notify-dropdown]");
  const notifyBadge = document.querySelector("[data-notify-badge]");
  const notifyUnreadText = document.querySelector("[data-notify-unread-text]");
  const notifyList = document.querySelector("[data-notify-items]");

  const updateNotifyCounts = () => {
    const unreadItems = document.querySelectorAll(".notify-item.unread");
    const count = unreadItems.length;
    if (notifyBadge) {
      notifyBadge.textContent = String(count);
      notifyBadge.classList.toggle("hidden", count === 0);
    }
    if (notifyUnreadText) {
      notifyUnreadText.textContent = `${count} Unread`;
    }
    if (notifyBtn) {
      notifyBtn.setAttribute("aria-label", `${count} notifications`);
    }
  };

  const toggleNotifyDropdown = (forceState) => {
    if (!notifyDropdown) return;
    const shouldOpen = typeof forceState === "boolean"
      ? forceState
      : !notifyDropdown.classList.contains("open");
    notifyDropdown.classList.toggle("open", shouldOpen);
    notifyBtn?.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  };

  notifyBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNotifyDropdown();
  });

  // Mark all as read
  document.querySelector("[data-mark-all-read]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".notify-item.unread").forEach((item) => {
      item.classList.remove("unread");
    });
    updateNotifyCounts();
    toast("All notifications marked as read.");
  });

  // Clear all notifications
  document.querySelector("[data-clear-notifications]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (notifyList) {
      notifyList.innerHTML = `<div class="notify-empty">
        <i data-lucide="bell-off"></i>
        <span>No notifications to display</span>
      </div>`;
      icons();
    }
    updateNotifyCounts();
    toast("Notification list cleared.");
  });

  // Handle individual notification clicks and dismissals
  notifyList?.addEventListener("click", (e) => {
    const dismissBtn = e.target.closest("[data-dismiss-notify]");
    if (dismissBtn) {
      e.stopPropagation();
      const item = dismissBtn.closest(".notify-item");
      if (item) {
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        item.style.transition = "all 0.2s ease";
        setTimeout(() => {
          item.remove();
          updateNotifyCounts();
          if (notifyList.children.length === 0) {
            notifyList.innerHTML = `<div class="notify-empty">
              <i data-lucide="bell-off"></i>
              <span>No notifications to display</span>
            </div>`;
            icons();
          }
        }, 200);
      }
      return;
    }

    const item = e.target.closest(".notify-item");
    if (item) {
      item.classList.remove("unread");
      updateNotifyCounts();
      const targetView = item.dataset.targetView;
      if (targetView && viewMeta[targetView]) {
        toggleNotifyDropdown(false);
        switchView(targetView);
      }
    }
  });

  // Close notification dropdown when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    if (notifyDropdown?.classList.contains("open") && !e.target.closest("[data-notify-wrap]")) {
      toggleNotifyDropdown(false);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && notifyDropdown?.classList.contains("open")) {
      toggleNotifyDropdown(false);
    }
  });

  // Bulk Upload File Handler
  const bulkInput = document.getElementById("bulk-file");
  bulkInput?.addEventListener("change", () => {
    if (bulkInput.files?.[0]) {
      toast(`Imported ${bulkInput.files[0].name} (18 learners added).`);
    }
  });

  // HiDPI Canvas Attendance Chart with Dynamic Period Switching
  const canvas = document.querySelector("[data-attendance-chart]");
  const attendanceSelect = document.querySelector("[data-attendance-period]");
  const attendanceAvgEl = document.querySelector("[data-attendance-avg]");

  const attendanceData = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      vals: [74, 82, 77, 89, 81, 95, 88.4],
      avg: "88.4%"
    },
    month: {
      labels: ["W1", "W2", "W3", "W4", "W5"],
      vals: [80, 85, 88, 91, 86.2],
      avg: "86.2%"
    }
  };

  let currentPeriod = "week";

  const drawChart = () => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pTop = 14;
    const pBottom = 26;
    const pLeft = 20;
    const pRight = 20;
    const chartHeight = h - pTop - pBottom;
    const chartWidth = w - pLeft - pRight;

    const periodData = attendanceData[currentPeriod] || attendanceData.week;
    const vals = periodData.vals;
    const labels = periodData.labels;
    const isDark = document.documentElement.dataset.theme === "dark";

    ctx.clearRect(0, 0, w, h);

    // Subtle Grid lines
    ctx.strokeStyle = isDark ? "rgba(180, 205, 238, 0.08)" : "rgba(54, 89, 140, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = pTop + (i * chartHeight) / 3;
      ctx.beginPath();
      ctx.moveTo(pLeft, y);
      ctx.lineTo(w - pRight, y);
      ctx.stroke();
    }

    const minVal = 50;
    const maxVal = 100;
    const points = vals.map((v, i) => [
      pLeft + (i * chartWidth) / (vals.length - 1),
      pTop + chartHeight - ((v - minVal) / (maxVal - minVal)) * chartHeight,
    ]);

    // Area gradient
    const gradient = ctx.createLinearGradient(0, pTop, 0, pTop + chartHeight);
    gradient.addColorStop(0, "rgba(7, 91, 234, 0.28)");
    gradient.addColorStop(1, "rgba(7, 91, 234, 0.0)");

    ctx.beginPath();
    points.forEach((pt, i) => (i ? ctx.lineTo(...pt) : ctx.moveTo(...pt)));
    ctx.lineTo(points[points.length - 1][0], pTop + chartHeight);
    ctx.lineTo(points[0][0], pTop + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke line
    ctx.beginPath();
    points.forEach((pt, i) => (i ? ctx.lineTo(...pt) : ctx.moveTo(...pt)));
    ctx.strokeStyle = "#075bea";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Data points & X-Axis Labels
    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = "center";
    ctx.fillStyle = isDark ? "#8fa5c4" : "#7187a5";

    points.forEach((pt, i) => {
      // Data circle
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 4, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#092040" : "#fff";
      ctx.fill();
      ctx.strokeStyle = "#075bea";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label below point
      if (labels[i]) {
        ctx.fillStyle = isDark ? "#8fa5c4" : "#7187a5";
        ctx.fillText(labels[i], pt[0], h - 8);
      }
    });
  };

  attendanceSelect?.addEventListener("change", (e) => {
    currentPeriod = e.target.value;
    if (attendanceAvgEl && attendanceData[currentPeriod]) {
      attendanceAvgEl.textContent = attendanceData[currentPeriod].avg;
    }
    drawChart();
    toast(`Viewing attendance trends for ${currentPeriod === "week" ? "this week" : "this month"}.`);
  });

  drawChart();
  window.addEventListener("resize", drawChart);
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => setTimeout(drawChart, 40));
  });

  icons();
})();


