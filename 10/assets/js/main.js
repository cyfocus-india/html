(() => {
  const root = document.documentElement;

  const savePreference = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* Browser storage gracefully handles privacy modes */
    }
  };

  const initIcons = () => {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons({
        attrs: { "aria-hidden": "true", "stroke-width": 1.8 },
      });
    }
  };

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIcons);
  } else {
    initIcons();
  }

  // Synchronize Theme Toggles
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const syncThemeIcons = () => {
    const isDark = root.dataset.theme === "dark";
    themeButtons.forEach((btn) => {
      btn.innerHTML = `<i data-lucide="${isDark ? "sun" : "moon-star"}"></i>`;
      btn.setAttribute(
        "aria-label",
        `Switch to ${isDark ? "light" : "dark"} theme`,
      );
    });
    initIcons();
  };

  syncThemeIcons();

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      savePreference("elevate-theme", root.dataset.theme);
      syncThemeIcons();
    });
  });

  // Synchronize RTL/LTR Toggle Buttons
  const rtlButtons = document.querySelectorAll("[data-rtl-toggle]");
  const syncRtlLabels = () => {
    const isRtl = root.dir === "rtl";
    rtlButtons.forEach((btn) => {
      const textSpan = btn.querySelector("[data-rtl-text]");
      if (textSpan) {
        textSpan.textContent = isRtl ? "LTR" : "RTL";
      } else {
        btn.innerHTML = `<span class="rtl-text" data-rtl-text>${isRtl ? "LTR" : "RTL"}</span>`;
      }
      btn.setAttribute(
        "aria-label",
        isRtl ? "Switch to LTR layout" : "Switch to RTL layout",
      );
    });
  };

  try {
    const savedDir = localStorage.getItem("elevate-dir");
    if (savedDir) {
      root.dir = savedDir;
    }
  } catch (error) {}

  syncRtlLabels();

  rtlButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      root.dir = root.dir === "rtl" ? "ltr" : "rtl";
      savePreference("elevate-dir", root.dir);
      syncRtlLabels();
      window.dispatchEvent(new Event("resize"));
    });
  });

  // Mobile Menu Toggle & Handlers
  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");

  const closeMenu = () => {
    if (!menu || !menu.classList.contains("open")) return;
    menu.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) {
      menuButton.innerHTML = `<i data-lucide="menu"></i>`;
    }
    initIcons();
  };

  if (menuButton && menu) {
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
      initIcons();
    });

    // Close when clicking any normal link inside menu (not dropdown toggle)
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Mobile Submenu Accordion Toggles
    menu.querySelectorAll("[data-mobile-dropdown-toggle]").forEach((toggleBtn) => {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const parentItem = toggleBtn.closest(".mobile-nav-item");
        if (parentItem) {
          const isOpen = parentItem.classList.toggle("open");
          toggleBtn.setAttribute("aria-expanded", String(isOpen));
        }
      });
    });

    // Close mobile menu on click outside
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Desktop Dropdown Navigation Accessibility & Click/Keyboard Toggle
  const desktopDropdowns = document.querySelectorAll(".desktop-nav .has-dropdown");
  const closeAllDesktopDropdowns = () => {
    desktopDropdowns.forEach((item) => {
      item.classList.remove("open");
      const btn = item.querySelector(".dropdown-toggle");
      btn?.setAttribute("aria-expanded", "false");
    });
  };

  desktopDropdowns.forEach((dropdown) => {
    const toggleBtn = dropdown.querySelector(".dropdown-toggle");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = dropdown.classList.contains("open");
      closeAllDesktopDropdowns();
      if (!isCurrentlyOpen) {
        dropdown.classList.add("open");
        toggleBtn.setAttribute("aria-expanded", "true");
      }
    });

    // Close when clicking an item inside
    dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        closeAllDesktopDropdowns();
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".desktop-nav .has-dropdown")) {
      closeAllDesktopDropdowns();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDesktopDropdowns();
      closeMenu();
    }
  });

  // Header Scroll Shadow Indicator
  const header = document.querySelector("[data-header]");
  const updateHeaderScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 15);
  };
  updateHeaderScroll();
  window.addEventListener("scroll", updateHeaderScroll, { passive: true });

  // Interactive Capability Diagnostic Tabs (Methodology Page)
  document.querySelectorAll("[data-diag-tab]").forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      const targetId = tabBtn.dataset.diagTab;
      document
        .querySelectorAll("[data-diag-tab]")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelectorAll("[data-diag-view]")
        .forEach((view) => (view.hidden = true));
      tabBtn.classList.add("active");
      const activeView = document.querySelector(`[data-diag-view="${targetId}"]`);
      if (activeView) activeView.hidden = false;
      initIcons();
    });
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // ==========================================================================
  // Program Details Interactive Modal System
  // ==========================================================================
  const PROGRAM_DATA = {
    communication: {
      category: "01 / Executive Communication",
      badgeColor: "blue",
      icon: "messages-square",
      title: "Communicate with Clarity and Influence",
      subtitle: "Master executive narrative structuring, high-stakes boardroom delivery, and cross-functional alignment techniques that drive business decisions.",
      meta: [
        { label: "Duration", value: "4 Weeks (8 Live Labs)", icon: "clock" },
        { label: "Modality", value: "Hybrid / Live Virtual & Workshops", icon: "video" },
        { label: "Target Audience", value: "Managers, Team Leads & Specialists", icon: "users" },
        { label: "Next Batch", value: "September 02, 2026", icon: "calendar" }
      ],
      curriculum: [
        { title: "Executive Narrative Structuring", desc: "Pyramid Principle, framing high-stakes proposals, and commanding executive boardroom attention." },
        { title: "Multi-Stakeholder Alignment", desc: "De-escalating friction, managing difficult conversations, and building strategic consensus across teams." },
        { title: "Cross-Functional Persuasion", desc: "Communicating with engineering, finance, and C-suite teams in their native business terminology." },
        { title: "High-Impact Asynchronous Delivery", desc: "Writing crisp executive memos, concise Slack updates, and action-oriented briefings." }
      ],
      faculty: {
        name: "Sophia Chen",
        role: "Senior Faculty Lead & Former VP of Corporate Communications",
        avatar: "SC"
      },
      outcomes: "Includes 1-on-1 Recorded Pitch Feedback, Cohort Case Studies, and Verified Digital Credential.",
      syllabusName: "Executive_Communication_Curriculum.pdf"
    },
    leadership: {
      category: "02 / Strategic Leadership",
      badgeColor: "green",
      icon: "users-round",
      title: "Lead Teams That Perform and Adapt",
      subtitle: "Equip modern managers with high-performance coaching frameworks, psychological safety practices, and agile change leadership systems.",
      meta: [
        { label: "Duration", value: "6 Weeks (12 Masterclasses)", icon: "clock" },
        { label: "Modality", value: "Executive Suite & Live Virtual", icon: "video" },
        { label: "Target Audience", value: "Directors, Senior Managers & Leads", icon: "users" },
        { label: "Next Batch", value: "September 16, 2026", icon: "calendar" }
      ],
      curriculum: [
        { title: "High-Performance Team Architecture", desc: "Establishing clear OKR accountability, psychological safety, and autonomous team rituals." },
        { title: "Adaptive & Change Leadership", desc: "Leading teams through restructuring, business pivots, and cross-functional technology adoptions." },
        { title: "Empathetic Coaching & Mentorship", desc: "Conducting transformative 1-on-1s, diagnosing motivation, and unlocking team potential." },
        { title: "Strategic Delegation & Feedback Loops", desc: "Delivering continuous 360-degree feedback without micromanaging execution." }
      ],
      faculty: {
        name: "Dr. Elena Vance",
        role: "Director of Leadership Institute & Executive Leadership Coach",
        avatar: "EV"
      },
      outcomes: "Includes 360-Degree Leadership Assessment, 2 Private Coaching Sessions, and Verified Executive Certification.",
      syllabusName: "Strategic_Leadership_Curriculum.pdf"
    },
    sales: {
      category: "03 / Consultative Sales",
      badgeColor: "orange",
      icon: "chart-spline",
      title: "Turn Insight into Customer Growth",
      subtitle: "Master consultative enterprise sales cycles, multi-stakeholder consensus building, and high-value margin negotiation.",
      meta: [
        { label: "Duration", value: "5 Weeks (10 Deal Sprints)", icon: "clock" },
        { label: "Modality", value: "Live Virtual Sprints & Deal Labs", icon: "video" },
        { label: "Target Audience", value: "Account Executives, Sales Leads & SDRs", icon: "users" },
        { label: "Next Batch", value: "October 05, 2026", icon: "calendar" }
      ],
      curriculum: [
        { title: "Enterprise Discovery & Diagnostic Selling", desc: "Uncovering hidden buyer pain, quantification of ROI, and budget champion mapping." },
        { title: "Multi-Threaded Consensus Selling", desc: "Navigating complex procurement, legal, and executive committee approval hurdles." },
        { title: "Value-Driven Price Defense", desc: "Preventing discounting, executing tough trade-offs, and protecting gross contract margins." },
        { title: "Pipeline Velocity & Deal Closing", desc: "Shortening sales cycles, dynamic forecasting, and closing enterprise multi-year contracts." }
      ],
      faculty: {
        name: "Marcus Brody",
        role: "Former Global VP of Enterprise Sales ($120M+ ARR)",
        avatar: "MB"
      },
      outcomes: "Includes Real Deal-Room Roleplay Drills, Objection Handling Playbook, and Enterprise Deal Master Certificate.",
      syllabusName: "B2B_Sales_Negotiation_Curriculum.pdf"
    },
    technical: {
      category: "04 / AI & Data Fluency",
      badgeColor: "violet",
      icon: "code-xml",
      title: "Build Future-Ready Digital Fluency",
      subtitle: "Empower non-technical and technical business units with Generative AI workflows, modern data automation, and analytical decision-making.",
      meta: [
        { label: "Duration", value: "4 Weeks (8 Lab Sprints)", icon: "clock" },
        { label: "Modality", value: "Hands-on Cloud Labs & Live Sprints", icon: "video" },
        { label: "Target Audience", value: "Ops, Finance, Product, Tech & Analysts", icon: "users" },
        { label: "Next Batch", value: "September 02, 2026", icon: "calendar" }
      ],
      curriculum: [
        { title: "Generative AI Enterprise Workflows", desc: "Practical LLM prompt engineering, agentic automations, and privacy-compliant tooling." },
        { title: "Advanced Data Modeling & Visualization", desc: "Automating spreadsheets, dynamic array modeling, and executive KPI dashboards." },
        { title: "Process Automation & Low-Code Pipelines", desc: "Streamlining repetitive manual handoffs using modern business automation engines." },
        { title: "Data-Driven Decision Making & Auditing", desc: "Statistical hypothesis validation, metric integrity, and avoiding cognitive biases." }
      ],
      faculty: {
        name: "Vikram Malhotra",
        role: "Lead AI Architect & Senior Data Science Fellow",
        avatar: "VM"
      },
      outcomes: "Includes Dedicated Cloud Sandbox Environment, 15+ Automated Templates, and AI & Data Fluency Credential.",
      syllabusName: "Digital_Fluency_AI_Curriculum.pdf"
    },
    behavioral: {
      category: "05 / Workplace Resilience",
      badgeColor: "blue",
      icon: "brain-circuit",
      title: "Behavioral Mastery & Workplace Resilience",
      subtitle: "Develop cognitive agility, emotional regulation, high-leverage time prioritization, and problem-solving habits under corporate pressure.",
      meta: [
        { label: "Duration", value: "3 Weeks (6 Interactive Labs)", icon: "clock" },
        { label: "Modality", value: "Live Virtual & Micro-Workshops", icon: "video" },
        { label: "Target Audience", value: "All High-Impact Corporate Professionals", icon: "users" },
        { label: "Next Batch", value: "September 20, 2026", icon: "calendar" }
      ],
      curriculum: [
        { title: "Cognitive Agility & Stress Management", desc: "Neuroscience-backed resilience frameworks, psychological focus, and burnout prevention." },
        { title: "Eisenhower Matrix & Priority Architectures", desc: "Eliminating low-leverage tasks and orchestrating high-velocity daily sprints." },
        { title: "Root-Cause Problem Solving", desc: "Structured 5-Whys, Pareto analysis, and hypothesis-driven decision frameworks." },
        { title: "Workplace Adaptability & Emotional Intelligence", desc: "Navigating team shifts, executive expectations, and ambiguous operational changes." }
      ],
      faculty: {
        name: "Dr. Aris Thorne",
        role: "Organizational Psychologist & Workplace Behavior Lead",
        avatar: "AT"
      },
      outcomes: "Includes Workplace Stress Diagnostic, Personal Prioritization Playbook, and Resilience Credential.",
      syllabusName: "Behavioral_Mastery_Curriculum.pdf"
    }
  };

  // Helper to ensure modal container exists
  const getOrCreateModal = () => {
    let modal = document.getElementById("program-detail-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "program-detail-modal";
      modal.className = "program-modal-backdrop";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="program-modal-card">
          <div class="program-modal-head">
            <div class="program-modal-title-wrap">
              <span class="program-icon blue" id="modal-program-icon">
                <i data-lucide="messages-square"></i>
              </span>
              <div>
                <p class="program-modal-category" id="modal-program-category">01 / COMMUNICATION</p>
                <h3 class="program-modal-title" id="modal-program-title">Program Title</h3>
              </div>
            </div>
            <button type="button" class="program-modal-close-btn" data-program-modal-close aria-label="Close program details">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="program-modal-body">
            <p class="program-modal-desc" id="modal-program-desc">Description</p>
            <div class="program-modal-meta-grid" id="modal-program-meta"></div>
            <div>
              <p class="program-modal-section-title"><i data-lucide="layers" style="width:16px;height:16px;"></i> Core Learning Modules & Curriculum</p>
              <div class="program-modal-curriculum-list" id="modal-program-curriculum"></div>
            </div>
            <div class="program-modal-faculty-box">
              <div class="faculty-avatar-circle" id="modal-faculty-avatar">SC</div>
              <div>
                <b id="modal-faculty-name">Faculty Lead</b>
                <small id="modal-faculty-role">Title</small>
              </div>
            </div>
            <div class="program-modal-outcomes">
              <i data-lucide="shield-check"></i>
              <span id="modal-program-outcomes">Outcomes</span>
            </div>
          </div>
          <div class="program-modal-footer">
            <button type="button" class="button button-ghost button-sm" id="modal-download-syllabus-btn">
              <i data-lucide="download"></i> Download Full Syllabus (PDF)
            </button>
            <a href="pages/dashboard.html" class="button button-sm" id="modal-enroll-cohort-btn">
              <span>Enroll Cohort</span> <i data-lucide="arrow-up-right"></i>
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    return modal;
  };

  const openProgramModal = (programKey) => {
    const data = PROGRAM_DATA[programKey] || PROGRAM_DATA.communication;
    const modal = getOrCreateModal();

    // Populate Icon & Category
    const iconEl = modal.querySelector("#modal-program-icon");
    if (iconEl) {
      iconEl.className = `program-icon ${data.badgeColor}`;
      iconEl.innerHTML = `<i data-lucide="${data.icon}"></i>`;
    }

    const catEl = modal.querySelector("#modal-program-category");
    if (catEl) catEl.textContent = data.category;

    const titleEl = modal.querySelector("#modal-program-title");
    if (titleEl) titleEl.textContent = data.title;

    const descEl = modal.querySelector("#modal-program-desc");
    if (descEl) descEl.textContent = data.subtitle;

    // Populate Meta Chips
    const metaContainer = modal.querySelector("#modal-program-meta");
    if (metaContainer) {
      metaContainer.innerHTML = data.meta.map(m => `
        <div class="program-modal-meta-chip">
          <i data-lucide="${m.icon}"></i>
          <div>
            <small>${m.label}</small>
            <b>${m.value}</b>
          </div>
        </div>
      `).join("");
    }

    // Populate Curriculum
    const currContainer = modal.querySelector("#modal-program-curriculum");
    if (currContainer) {
      currContainer.innerHTML = data.curriculum.map((c, i) => `
        <div class="program-curriculum-card">
          <span class="curr-num">0${i + 1}</span>
          <div>
            <b>${c.title}</b>
            <p>${c.desc}</p>
          </div>
        </div>
      `).join("");
    }

    // Populate Faculty
    const facAvatar = modal.querySelector("#modal-faculty-avatar");
    if (facAvatar) facAvatar.textContent = data.faculty.avatar;

    const facName = modal.querySelector("#modal-faculty-name");
    if (facName) facName.textContent = data.faculty.name;

    const facRole = modal.querySelector("#modal-faculty-role");
    if (facRole) facRole.textContent = data.faculty.role;

    // Populate Outcomes
    const outEl = modal.querySelector("#modal-program-outcomes");
    if (outEl) outEl.textContent = data.outcomes;

    // Configure Action Links
    const isPagesDir = window.location.pathname.includes("/pages/");
    const enrollBtn = modal.querySelector("#modal-enroll-cohort-btn");
    if (enrollBtn) {
      enrollBtn.href = isPagesDir ? "dashboard.html" : "pages/dashboard.html";
    }

    const downloadBtn = modal.querySelector("#modal-download-syllabus-btn");
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        const syllabusContent = `ELEVATE LEARNING — CORPORATE TRAINING CENTER\nMASTER CURRICULUM & SYLLABUS (2026)\n=======================================================\nProgram: ${data.title}\nCategory: ${data.category}\nFaculty Lead: ${data.faculty.name} (${data.faculty.role})\n\nCORE MODULES:\n${data.curriculum.map((c, i) => `Module 0${i + 1}: ${c.title}\n  - ${c.desc}`).join("\n\n")}\n\nCERTIFICATION & AUDIT GUARANTEE:\n${data.outcomes}\n=======================================================\nOfficial syllabus issued by Elevate Corporate Training Institute.`;
        const blob = new Blob([syllabusContent], { type: "application/pdf;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.syllabusName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<i data-lucide="check"></i> Downloaded Syllabus`;
        initIcons();
        setTimeout(() => {
          downloadBtn.innerHTML = originalText;
          initIcons();
        }, 2200);
      };
    }

    initIcons();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeProgramModal = () => {
    const modal = document.getElementById("program-detail-modal");
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  // Event Delegation for Explore Program Buttons & Close Handlers
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-explore-program]");
    if (trigger) {
      e.preventDefault();
      const progKey = trigger.getAttribute("data-explore-program");
      openProgramModal(progKey);
      return;
    }

    if (e.target.closest("[data-program-modal-close]")) {
      e.preventDefault();
      closeProgramModal();
      return;
    }

    const modal = document.getElementById("program-detail-modal");
    if (modal && modal.classList.contains("open") && e.target === modal) {
      closeProgramModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProgramModal();
    }
  });

  // ==========================================================================
  // Live Interactive Training Centers Map Controller
  // ==========================================================================
  const initContactMap = () => {
    const mapEl = document.getElementById("training-centers-map");
    if (!mapEl || typeof L === "undefined") return;

    const CAMPUSES = {
      blr: {
        id: "blr",
        name: "Bengaluru Executive Campus",
        badge: "Global Headquarters",
        coords: [12.9716, 77.5946],
        address: "100ft Road, Indiranagar Tech Corridor, Bengaluru, Karnataka 560038",
        phone: "+91 80 5555 0142 (Direct Board)",
        hours: "Mon – Fri: 8:30 AM – 7:30 PM IST",
        capacity: "Capacity: 4 Executive Auditoriums · 12 Labs",
        parking: "Indiranagar Metro (250m) · Dedicated Valet Parking",
        mapsUrl: "https://maps.google.com/?q=12.9716,77.5946"
      },
      mum: {
        id: "mum",
        name: "Mumbai BKC Corporate Hub",
        badge: "Financial District Center",
        coords: [19.0657, 72.8687],
        address: "Bandra Kurla Complex (BKC), G-Block, Mumbai, Maharashtra 400051",
        phone: "+91 22 4444 0199 (Direct Line)",
        hours: "Mon – Fri: 8:30 AM – 7:30 PM IST",
        capacity: "Capacity: 3 Strategy Suites · 8 Breakout Labs",
        parking: "BKC Metro Station · On-site Executive Underground Parking",
        mapsUrl: "https://maps.google.com/?q=19.0657,72.8687"
      },
      del: {
        id: "del",
        name: "Delhi NCR Regional Center",
        badge: "Northern Enterprise Campus",
        coords: [28.4986, 77.0878],
        address: "Cyber City, DLF Phase 2, Gurugram, Haryana 122002",
        phone: "+91 124 6666 0188 (Direct Line)",
        hours: "Mon – Fri: 8:30 AM – 7:30 PM IST",
        capacity: "Capacity: 2 Conference Auditoriums · 10 Labs",
        parking: "Cyber City Rapid Metro · Multi-Level Visitor Parking",
        mapsUrl: "https://maps.google.com/?q=28.4986,77.0878"
      },
      hyd: {
        id: "hyd",
        name: "Hyderabad Tech & Innovation Hub",
        badge: "Technology & AI Training Suite",
        coords: [17.4447, 78.3789],
        address: "HITEC City, Madhapur, Hyderabad, Telangana 500081",
        phone: "+91 40 7777 0133 (Direct Line)",
        hours: "Mon – Fri: 8:30 AM – 7:30 PM IST",
        capacity: "Capacity: 3 Cloud Labs · 6 Live Streaming Pods",
        parking: "HITEC City Metro (300m) · Covered Visitor Parking",
        mapsUrl: "https://maps.google.com/?q=17.4447,78.3789"
      }
    };

    const map = L.map("training-centers-map", {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView(CAMPUSES.blr.coords, 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    const markers = {};
    const customIcon = L.divIcon({
      className: "custom-map-pin-wrap",
      html: '<div class="custom-map-pin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32]
    });

    Object.values(CAMPUSES).forEach((c) => {
      const marker = L.marker(c.coords, { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>${c.name}</b><br><small>${c.address}</small>`);
      marker.on("click", () => selectCampus(c.id));
      markers[c.id] = marker;
    });

    const selectCampus = (id) => {
      const c = CAMPUSES[id];
      if (!c) return;

      document.querySelectorAll(".map-campus-pill").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.campus === id);
      });

      map.flyTo(c.coords, 15, { animate: true, duration: 1.1 });
      markers[id]?.openPopup();

      const badge = document.getElementById("venue-badge");
      if (badge) badge.innerHTML = `<i data-lucide="map-pin"></i> ${c.badge}`;

      const name = document.getElementById("venue-name");
      if (name) name.textContent = c.name;

      const address = document.getElementById("venue-address");
      if (address) address.textContent = c.address;

      const phone = document.getElementById("venue-phone");
      if (phone) phone.textContent = c.phone;

      const hours = document.getElementById("venue-hours");
      if (hours) hours.textContent = c.hours;

      const cap = document.getElementById("venue-capacity");
      if (cap) cap.textContent = c.capacity;

      const parking = document.getElementById("venue-parking");
      if (parking) parking.textContent = c.parking;

      const directionsBtn = document.getElementById("venue-directions-btn");
      if (directionsBtn) directionsBtn.href = c.mapsUrl;

      initIcons();
    };

    document.querySelectorAll(".map-campus-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectCampus(btn.dataset.campus);
      });
    });

    document.querySelector("[data-schedule-tour]")?.addEventListener("click", () => {
      const nameInput = document.getElementById("contact-name");
      if (nameInput) {
        nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
        nameInput.focus();
      }
    });

    // Invalidate map size on window resize
    window.addEventListener("resize", () => {
      map.invalidateSize();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactMap);
  } else {
    initContactMap();
  }
})();



