(() => {
  'use strict';

  /* ----------------------------------------------------
     1. Sidebar & Mobile Drawer Management
  ---------------------------------------------------- */
  const sidebar = document.getElementById('dashboardSidebar');
  const getToggles = () => document.querySelectorAll('#sidebarToggleBtn, .sidebar-toggle-btn, #dashToggle, .dash-toggle-btn, [data-dash-toggle]');
  let backdrop = document.getElementById('dashBackdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'dashBackdrop';
    backdrop.className = 'dash-backdrop';
    document.body.appendChild(backdrop);
  }

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem('dash_sidebar_collapsed', isCollapsed ? '1' : '0');
      getToggles().forEach(t => {
        t.setAttribute('aria-expanded', (!isCollapsed).toString());
        t.classList.toggle('active', isCollapsed);
      });
      window.dispatchEvent(new Event('resize'));
    } else {
      if (sidebar?.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    }
  };

  const closeMobileSidebar = () => {
    sidebar?.classList.remove('open');
    backdrop?.classList.remove('show');
    getToggles().forEach(t => t.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('no-scroll');
  };

  const openMobileSidebar = () => {
    sidebar?.classList.add('open');
    backdrop?.classList.add('show');
    getToggles().forEach(t => t.setAttribute('aria-expanded', 'true'));
    document.body.classList.add('no-scroll');
  };

  // Restore saved desktop sidebar state
  if (window.innerWidth >= 1024 && localStorage.getItem('dash_sidebar_collapsed') === '1') {
    document.body.classList.add('sidebar-collapsed');
    getToggles().forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      t.classList.add('active');
    });
  }

  document.addEventListener('click', e => {
    const toggleBtn = e.target.closest('#sidebarToggleBtn, .sidebar-toggle-btn, #dashToggle, .dash-toggle-btn, [data-dash-toggle]');
    if (toggleBtn) {
      e.preventDefault();
      toggleSidebar();
      return;
    }

    const logoutBtn = e.target.closest('#logoutBtn, .logout-btn');
    if (logoutBtn) {
      e.preventDefault();
      if (confirm('Are you sure you want to log out of your student account?')) {
        window.showToast?.('Signing out...');
        setTimeout(() => {
          window.location.href = logoutBtn.getAttribute('href') || '../pages/signin.html';
        }, 350);
      }
      return;
    }
  });

  backdrop?.addEventListener('click', closeMobileSidebar);
  document.getElementById('dashCloseBtn')?.addEventListener('click', closeMobileSidebar);

  /* ----------------------------------------------------
     2. Primary Main Options View Switching Engine
  ---------------------------------------------------- */
  const views = document.querySelectorAll('.dash-view');
  const dashLinks = document.querySelectorAll('.dash-link[data-view]');

  window.switchDashboardView = (viewName, updateUrl = true) => {
    const targetView = document.getElementById(`view-${viewName}`);
    if (!targetView) return;

    views.forEach(v => {
      v.style.display = 'none';
      v.classList.remove('active');
    });

    targetView.style.display = 'block';
    targetView.classList.add('active');

    dashLinks.forEach(link => {
      const isActive = link.dataset.view === viewName;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-selected', isActive.toString());
    });

    if (updateUrl && window.location.hash !== `#${viewName}`) {
      history.replaceState(null, '', `#${viewName}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth < 1024) closeMobileSidebar();
  };

  dashLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const viewName = link.dataset.view;
      if (viewName) window.switchDashboardView(viewName);
    });
  });

  // Handle hash on initial load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(`view-${initialHash}`)) {
    window.switchDashboardView(initialHash, false);
  } else {
    window.switchDashboardView('overview', false);
  }

  // Listen to popstate / hashchange
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`view-${hash}`)) {
      window.switchDashboardView(hash, false);
    }
  });

  // Click delegator for internal cross-view buttons
  document.addEventListener('click', e => {
    const switchTabBtn = e.target.closest('[data-switch-tab]');
    if (switchTabBtn) {
      e.preventDefault();
      const targetView = switchTabBtn.dataset.switchTab;
      if (targetView) window.switchDashboardView(targetView);
      return;
    }

    const actionBtn = e.target.closest('[data-action-view]');
    if (actionBtn) {
      e.preventDefault();
      const action = actionBtn.dataset.actionView;
      if (action === 'all-tests-modal') window.openModal?.('allTestsModal');
      return;
    }

    if (e.target.closest('#viewDetailedReportsBtn2, #openDiagnosticAuditBtn')) {
      e.preventDefault();
      const reportsTitle = document.getElementById('reports-title');
      if (reportsTitle) reportsTitle.textContent = 'Detailed Diagnostic Performance Audit';
      window.openModal?.('reportsModal');
      return;
    }

    if (e.target.closest('#viewDetailedReportsBtn, #viewDetailedReportsFromTests')) {
      e.preventDefault();
      window.switchDashboardView('analytics');
      const reportsTitle = document.getElementById('reports-title');
      if (reportsTitle) reportsTitle.textContent = 'Detailed Diagnostic Performance Audit';
      setTimeout(() => {
        window.openModal?.('reportsModal');
      }, 100);
      return;
    }

    if (e.target.closest('#viewAllTestsBtn2, [data-open-all-tests]')) {
      e.preventDefault();
      window.openModal?.('allTestsModal');
      return;
    }

    if (e.target.closest('#viewAllTestsBtn')) {
      e.preventDefault();
      window.switchDashboardView('tests');
      setTimeout(() => {
        document.querySelector('.test-catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return;
    }

    if (e.target.closest('#practiceWeakAreasBtn')) {
      e.preventDefault();
      window.switchDashboardView('tests');
      return;
    }

    if (e.target.closest('#viewAllMaterialsBtn')) {
      e.preventDefault();
      window.switchDashboardView('library');
      return;
    }
  });

  /* ----------------------------------------------------
     3. Test Runner & Simulator Integration
  ---------------------------------------------------- */
  document.addEventListener('click', e => {
    const startTestBtn = e.target.closest('[data-start-test]');
    if (startTestBtn) {
      e.preventDefault();
      const subject = startTestBtn.dataset.startTest;
      window.closeModal?.();
      if (typeof window.startMockTest === 'function') {
        window.startMockTest(subject);
      } else {
        const title = document.querySelector('#testModal [data-test-title]');
        if (title) title.textContent = subject;
        window.openModal?.('testModal');
      }
      return;
    }

    const joinLiveBtn = e.target.closest('[data-join-live]');
    if (joinLiveBtn) {
      e.preventDefault();
      const topic = joinLiveBtn.dataset.joinLive || 'Arithmetic Speed Drills';
      const educator = joinLiveBtn.dataset.educator || 'Rahul Sir';
      window.closeModal?.();
      if (typeof window.openLiveClassroom === 'function') {
        window.openLiveClassroom(topic, educator);
      } else {
        window.showToast?.(`Connecting to live stream: ${topic} (${educator})...`);
      }
      return;
    }

    const reviewBtn = e.target.closest('[data-review-test]');
    if (reviewBtn) {
      e.preventDefault();
      const testName = reviewBtn.dataset.reviewTest;
      const reportsTitle = document.getElementById('reports-title');
      if (reportsTitle) reportsTitle.textContent = `Score Audit: ${testName}`;
      window.openModal?.('reportsModal');
      return;
    }
  });

  document.getElementById('confirmTest')?.addEventListener('click', () => {
    window.closeModal?.();
    const title = document.querySelector('#testModal [data-test-title]')?.textContent || 'Full Length All-India Mock';
    if (typeof window.startMockTest === 'function') {
      window.startMockTest(title);
    } else {
      window.showToast?.(`Starting ${title} — timer is now active.`);
    }
  });

  /* ----------------------------------------------------
     4. In-Dashboard Modals Bindings
  ---------------------------------------------------- */
  document.getElementById('viewEnrolledBtn')?.addEventListener('click', () => {
    window.openModal?.('enrolledModal');
  });

  document.querySelectorAll('#viewAllTestsBtn, #viewAllTestsBtn2, [data-open-all-tests]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.openModal?.('allTestsModal');
    });
  });

  document.querySelectorAll('#viewDetailedReportsBtn, #viewDetailedReportsBtn2, #viewDetailedReportsFromTests, #openDiagnosticAuditBtn, [data-open-reports]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reportsTitle = document.getElementById('reports-title');
      if (reportsTitle) reportsTitle.textContent = 'Detailed Diagnostic Performance Audit';
      window.openModal?.('reportsModal');
    });
  });

  document.getElementById('viewCalendarBtn')?.addEventListener('click', () => {
    window.openModal?.('calendarModal');
  });

  document.getElementById('viewAllMaterialsBtn')?.addEventListener('click', () => {
    window.openModal?.('allMaterialsModal');
  });

  document.getElementById('practiceWeakAreasBtn')?.addEventListener('click', () => {
    if (typeof window.startMockTest === 'function') {
      window.startMockTest('Diagnostic Mock: Geometry & Modern Math');
    } else {
      window.showToast?.('Launching targeted weak-area diagnostic quiz...');
    }
  });

  // Toggle all recent tests
  const toggleAllRecentBtn = document.getElementById('toggleAllRecentBtn');
  const extraRecentTests = document.getElementById('extraRecentTests');
  toggleAllRecentBtn?.addEventListener('click', () => {
    if (!extraRecentTests) return;
    const isHidden = extraRecentTests.style.display === 'none';
    extraRecentTests.style.display = isHidden ? 'block' : 'none';
    toggleAllRecentBtn.textContent = isHidden ? 'Show Less (4)' : 'View All (8)';
  });

  // Weak area tips on click
  document.querySelectorAll('.weak-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const tip = item.dataset.tip || 'Practice daily 15-minute formula drills on this topic.';
      window.showToast?.(`Strategy Tip: ${tip}`);
    });
  });

  /* ----------------------------------------------------
     5. Saved Bookmarks & Notes Management
  ---------------------------------------------------- */
  document.addEventListener('click', e => {
    const copyBtn = e.target.closest('[data-copy-note]');
    if (copyBtn) {
      e.preventDefault();
      const text = copyBtn.dataset.copyNote;
      navigator.clipboard?.writeText(text).then(() => {
        window.showToast?.('Formula copied to clipboard!');
      }).catch(() => {
        window.showToast?.(`Copied: ${text}`);
      });
      return;
    }

    const removeBtn = e.target.closest('[data-remove-bookmark]');
    if (removeBtn) {
      e.preventDefault();
      const card = removeBtn.closest('.bookmark-card');
      if (card) {
        card.style.transition = 'opacity .25s, transform .25s';
        card.style.opacity = '0';
        card.style.transform = 'translateX(20px)';
        setTimeout(() => {
          card.remove();
          window.showToast?.('Bookmark removed from your notes.');
        }, 250);
      }
      return;
    }
  });

  /* ----------------------------------------------------
     5. Bookmarks & Personal Notes Vault Engine
  ---------------------------------------------------- */
  const openAddNoteModal = () => {
    window.openModal?.('noteModal');
    setTimeout(() => {
      document.getElementById('noteTextInput')?.focus();
    }, 100);
  };

  document.addEventListener('click', e => {
    const addBtn = e.target.closest('#addNoteBtn, #addNoteBtn2, .add-note-btn, [data-add-note]');
    if (addBtn) {
      e.preventDefault();
      openAddNoteModal();
      return;
    }
  });

  const addNoteForm = document.getElementById('addNoteForm');
  addNoteForm?.addEventListener('submit', e => {
    e.preventDefault();
    const subject = document.getElementById('noteSubject')?.value || 'General';
    const textInput = document.getElementById('noteTextInput');
    const noteText = textInput?.value?.trim();

    if (!noteText) return;

    const list = document.getElementById('bookmarksList');
    if (list) {
      const div = document.createElement('div');
      div.className = 'bookmark-card';
      div.innerHTML = `
        <div>
          <b>${noteText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</b>
          <small>Added just now · ${subject}</small>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost btn-sm" data-copy-note="${noteText.replace(/"/g, '&quot;')}">Copy</button>
          <button class="btn btn-outline btn-sm" data-remove-bookmark>Remove</button>
        </div>
      `;
      list.insertBefore(div, list.firstChild);

      // Persist note to localStorage
      try {
        const savedNotes = JSON.parse(localStorage.getItem('student_notes') || '[]');
        savedNotes.unshift({ text: noteText, subject, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) });
        localStorage.setItem('student_notes', JSON.stringify(savedNotes.slice(0, 30)));
      } catch (err) {}

      window.showToast?.('Quick note saved to your revision vault!');
    }

    if (textInput) textInput.value = '';
    const modal = document.getElementById('noteModal');
    if (modal) window.closeModal?.(modal);
  });

  // Restore persisted notes
  try {
    const savedNotes = JSON.parse(localStorage.getItem('student_notes') || '[]');
    const list = document.getElementById('bookmarksList');
    if (list && savedNotes.length > 0) {
      savedNotes.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bookmark-card';
        div.innerHTML = `
          <div>
            <b>${item.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</b>
            <small>Saved · ${item.subject || 'General'} (${item.date || 'Recent'})</small>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" data-copy-note="${item.text.replace(/"/g, '&quot;')}">Copy</button>
            <button class="btn btn-outline btn-sm" data-remove-bookmark>Remove</button>
          </div>
        `;
        list.appendChild(div);
      });
    }
  } catch (err) {}

  /* ----------------------------------------------------
     6. Study Notes Download Engine
  ---------------------------------------------------- */
  const studyNoteTemplates = {
    'Quantitative Aptitude': `========================================================================
EXAMSUCCESS COMPETITIVE EXAM REVISION CAPSULE
Subject: Quantitative Aptitude (Banking, SSC & Railways)
========================================================================

1. SPEED MATHS & VEDIC SHORTCUTS
------------------------------------------------------------------------
- Base Multiplication (Near 100):
  96 × 94 = (96 - 6) | (4 × 6) = 90 | 24 = 9024
- Squaring numbers ending in 5:
  N5² = [N × (N + 1)] | 25. Example: 75² = (7 × 8) | 25 = 5625.
- Percentage Fractions Conversion Table:
  1/2 = 50%    | 1/3 = 33.33% | 1/4 = 25%    | 1/5 = 20%
  1/6 = 16.67% | 1/7 = 14.28% | 1/8 = 12.5%  | 1/9 = 11.11%
  1/11 = 9.09% | 1/12 = 8.33% | 1/14 = 7.14% | 1/16 = 6.25%

2. TIME, SPEED & DISTANCE ESSENTIALS
------------------------------------------------------------------------
- Speed Conversion: 1 km/h = 5/18 m/s  |  1 m/s = 18/5 km/h
- Average Speed (Equal Distance): (2 × S1 × S2) / (S1 + S2)
- Relative Speed:
  Same Direction: |S1 - S2|
  Opposite Direction: S1 + S2
- Trains crossing a platform of length L: Total Distance = Train Length + L

3. COMPOUND & SIMPLE INTEREST
------------------------------------------------------------------------
- SI = (P × R × T) / 100
- Difference between CI and SI for 2 Years = P × (R / 100)²
- Difference between CI and SI for 3 Years = P × (R / 100)² × [(300 + R) / 100]

Good luck with your preparation! Practice daily mocks on ExamSuccess.
========================================================================`,

    'Reasoning Ability': `========================================================================
EXAMSUCCESS COMPETITIVE EXAM REVISION CAPSULE
Subject: Logical & Analytical Reasoning Ability
========================================================================

1. SYLLOGISM GOLDEN RULES
------------------------------------------------------------------------
- 'Only a few A are B' means:
  1. Some A are B (Definite)
  2. Some A are not B (Definite)
  3. All A can never be B (Definite)
  4. All B can be A (Possibility)
- Complementary Pairs for 'Either-Or':
  1. Some + No
  2. All + Some Not
  (Both elements must be same and both individual conclusions false).

2. CIRCULAR & LINEAR SEATING ARRANGEMENT STRATEGY
------------------------------------------------------------------------
Step 1: Scan all clues and pick the definite anchor (e.g., 'A sits third to the right of B who faces center').
Step 2: Draw 2 parallel possibility cases immediately.
Step 3: Eliminate cases as negative clues arise.
Step 4: Verify remaining conditions before marking answers.

3. CODED INEQUALITIES PRIORITY ORDER
------------------------------------------------------------------------
Priority 1: > or <
Priority 2: ≥ or ≤
Priority 3: =
Rule: Sign change in the path (e.g. A > B < C) results in 'No Relation'.

Good luck with your preparation! Practice daily mocks on ExamSuccess.
========================================================================`,

    'English Language': `========================================================================
EXAMSUCCESS COMPETITIVE EXAM REVISION CAPSULE
Subject: English Language, Grammar & Comprehension
========================================================================

1. HIGH-FREQUENCY SUBJECT-VERB AGREEMENT RULES
------------------------------------------------------------------------
- Along with, as well as, together with, in addition to:
  Verb agrees with the FIRST subject.
  Example: The teacher, along with the students, was present.
- Either...or, Neither...nor, Not only...but also:
  Verb agrees with the NEAREST subject.
  Example: Neither the manager nor the employees were informed.
- 'Each', 'Every', 'Either', 'Neither', 'One of the':
  Followed by plural noun, but takes a SINGULAR verb.
  Example: One of the candidates has submitted the application.

2. FREQUENT PREPOSITIONAL COMBINATIONS
------------------------------------------------------------------------
- Abstain FROM, Refrain FROM, Prohibit FROM
- Abide BY, Adhere TO, Comply WITH
- Senior TO, Junior TO, Superior TO, Preferable TO (Never 'than')

Good luck with your preparation! Practice daily mocks on ExamSuccess.
========================================================================`
  };

  const triggerDownload = subject => {
    const content = studyNoteTemplates[subject] || `========================================================================
EXAMSUCCESS COMPETITIVE EXAM REVISION CAPSULE
Subject: ${subject}
========================================================================

Key Highlights & Study Guidelines:
1. Review previous 5-year question papers (PYQs) for weightage trends.
2. Maintain a handwritten error logbook after every mock test.
3. Dedicate 60% time to weak chapters identified on your student dashboard.
4. Attempt timed sectional tests twice a week.

Access full video explanations and live classes at: ExamSuccess Student Portal.
========================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ExamSuccess-${subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-Notes.txt`;
    link.click();
    URL.revokeObjectURL(url);
    window.showToast?.(`Downloaded ${subject} study notes.`);
  };

  document.querySelectorAll('[data-download]').forEach(button => {
    button.addEventListener('click', () => {
      triggerDownload(button.dataset.download);
    });
  });
})();
