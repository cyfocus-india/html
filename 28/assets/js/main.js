/* ==========================================================================
   Aisle & Aperture — main.js
   Plain JavaScript, no libraries. Each feature checks that its markup
   exists, so one file serves every page.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var THEME_KEY = "aa-theme";
  var DIR_KEY = "aa-dir";

  /* ---------- Safe localStorage helpers ---------- */
  var store = {
    get: function (key) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        /* storage blocked — preference simply won't persist */
      }
    }
  };

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  var isRTL = function () {
    return root.getAttribute("dir") === "rtl";
  };

  /* ---------- Theme toggle (light / dark) ---------- */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    $all(".theme-toggle").forEach(function (btn) {
      var dark = theme === "dark";
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      btn.setAttribute("aria-pressed", String(dark));
      var icon = $(".icon", btn);
      if (icon) icon.textContent = dark ? "☀︎" : "☾";
    });
  }

  /* ---------- Direction toggle (LTR / RTL) ---------- */
  function applyDir(dir) {
    root.setAttribute("dir", dir);
    $all(".dir-toggle").forEach(function (btn) {
      var rtl = dir === "rtl";
      btn.setAttribute("aria-label", rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
      btn.setAttribute("aria-pressed", String(rtl));
      var label = $(".dir-label", btn);
      if (label) label.textContent = rtl ? "LTR" : "RTL";
    });
  }

  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  applyDir(isRTL() ? "rtl" : "ltr");

  $all(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      store.set(THEME_KEY, next);
    });
  });

  $all(".dir-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = isRTL() ? "ltr" : "rtl";
      applyDir(next);
      store.set(DIR_KEY, next);
    });
  });

  /* ---------- Sticky header shadow ---------- */
  var header = $(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Home dropdown (desktop menu + mobile accordion) ---------- */
  var dropdowns = $all(".has-dropdown");

  function setDropdown(item, open) {
    item.classList.toggle("open", open);
    var toggle = $(".dropdown-toggle", item);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  }

  dropdowns.forEach(function (item) {
    var toggle = $(".dropdown-toggle", item);
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setDropdown(item, !item.classList.contains("open"));
    });

    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && item.classList.contains("open")) {
        e.stopPropagation();
        setDropdown(item, false);
        toggle.focus();
      }
    });

    // Desktop: close when focus leaves the dropdown
    item.addEventListener("focusout", function (e) {
      if (mobileQuery.matches) return;
      if (!item.contains(e.relatedTarget)) setDropdown(item, false);
    });
  });

  document.addEventListener("click", function (e) {
    if (mobileQuery.matches) return;
    dropdowns.forEach(function (item) {
      if (!item.contains(e.target)) setDropdown(item, false);
    });
  });

  /* ---------- Mobile navigation panel ---------- */
  var mobileQuery = window.matchMedia("(max-width: 1024px)");
  var navToggle = $(".nav-toggle");
  var navPanel = $("#site-nav");
  var backdrop = $(".nav-backdrop");

  function focusables(scope) {
    return $all('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', scope).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function openNav() {
    body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    window.setTimeout(function () {
      var first = focusables(navPanel)[0];
      if (first) first.focus();
    }, 80);
  }

  function closeNav(returnFocus) {
    if (!body.classList.contains("nav-open")) return;
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (returnFocus) navToggle.focus();
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) closeNav(false);
      else openNav();
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeNav(true);
      });
    }

    // Close after choosing a link
    $all("a", navPanel).forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (!body.classList.contains("nav-open")) return;
      if (e.key === "Escape") {
        closeNav(true);
        return;
      }
      // Keep keyboard focus inside the open panel (+ the close button)
      if (e.key === "Tab") {
        var items = [navToggle].concat(focusables(navPanel));
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    var onBreakpoint = function (e) {
      if (!e.matches) closeNav(false);
    };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", onBreakpoint);
    else if (mobileQuery.addListener) mobileQuery.addListener(onBreakpoint);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = $all(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Dialog helpers (native <dialog> with fallback) ---------- */
  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    body.style.overflow = "hidden";
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    }
  }

  $all("dialog").forEach(function (dialog) {
    dialog.addEventListener("close", function () {
      body.style.overflow = "";
    });
    // Click on the dimmed backdrop closes the dialog
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeDialog(dialog);
    });
    $all("[data-close-dialog]", dialog).forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeDialog(dialog);
      });
    });
  });

  /* ---------- Home 1: hero film play / pause ---------- */
  var heroVideo = $(".hero-film__video");
  var heroToggle = $(".hero-film__toggle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setHeroPlaying(playing) {
    if (!heroVideo || !heroToggle) return;
    if (playing) {
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      heroVideo.pause();
    }
    heroToggle.setAttribute("aria-pressed", String(!playing));
    heroToggle.setAttribute("aria-label", playing ? "Pause background film" : "Play background film");
    $(".icon", heroToggle).textContent = playing ? "❚❚" : "▶︎";
    $(".label", heroToggle).textContent = playing ? "Pause" : "Play";
  }

  if (heroVideo && heroToggle) {
    if (reduceMotion.matches) setHeroPlaying(false);
    heroToggle.addEventListener("click", function () {
      setHeroPlaying(heroVideo.paused);
    });
  }

  /* ---------- Home 1: highlight reel player ---------- */
  var reelDialog = $("#reel-dialog");
  if (reelDialog) {
    var reelVideo = $("video", reelDialog);
    var reelTitle = $("#reel-dialog-title", reelDialog);

    $all("[data-reel-src]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        reelTitle.textContent = btn.getAttribute("data-reel-title");
        reelVideo.setAttribute("src", btn.getAttribute("data-reel-src"));
        reelVideo.setAttribute("poster", btn.getAttribute("data-reel-poster") || "");
        openDialog(reelDialog);
        var p = reelVideo.play();
        if (p && p.catch) p.catch(function () {});
      });
    });

    reelDialog.addEventListener("close", function () {
      reelVideo.pause();
      reelVideo.removeAttribute("src");
      reelVideo.load();
    });
  }

  /* ---------- Date fields: no past dates ---------- */
  var today = new Date();
  var isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $all('input[type="date"][data-future]').forEach(function (input) {
    input.setAttribute("min", isoToday);
  });

  /* ---------- Portfolio: filters ---------- */
  var filterBar = $(".filters");
  var tiles = $all(".tile");
  var filterStatus = $(".filters__status");

  if (filterBar && tiles.length) {
    var filterButtons = $all(".filter", filterBar);
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filterButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        var shown = 0;
        tiles.forEach(function (tile) {
          var match = cat === "all" || tile.getAttribute("data-cat") === cat;
          tile.hidden = !match;
          if (match) shown++;
        });
        if (filterStatus) {
          filterStatus.textContent =
            cat === "all" ? "Showing all " + shown + " photographs" : "Showing " + shown + " " + btn.getAttribute("data-label") + " photographs";
        }
      });
    });
  }

  /* ---------- Portfolio: lightbox ---------- */
  var lightbox = $("#lightbox");
  if (lightbox && tiles.length) {
    var lbImg = $(".lightbox__stage img", lightbox);
    var lbCaption = $(".lightbox__text", lightbox);
    var lbCount = $(".lightbox__count", lightbox);
    var lbTitle = $("#lightbox-title", lightbox);
    var current = 0;
    var visible = [];

    function showSlide(index) {
      if (!visible.length) return;
      current = (index + visible.length) % visible.length;
      var tile = visible[current];
      var img = $("img", tile);
      var cap = $("figcaption", tile);
      lbImg.src = $("a", tile).getAttribute("href");
      lbImg.alt = img.alt;
      lbCaption.textContent = cap ? cap.textContent : "";
      lbTitle.textContent = cap ? cap.textContent : "Photograph";
      lbCount.textContent = current + 1 + " / " + visible.length;
    }

    tiles.forEach(function (tile) {
      $("a", tile).addEventListener("click", function (e) {
        e.preventDefault();
        visible = tiles.filter(function (t) {
          return !t.hidden;
        });
        showSlide(visible.indexOf(tile));
        openDialog(lightbox);
      });
    });

    $(".lightbox__prev", lightbox).addEventListener("click", function () {
      showSlide(current - 1);
    });
    $(".lightbox__next", lightbox).addEventListener("click", function () {
      showSlide(current + 1);
    });

    lightbox.addEventListener("keydown", function (e) {
      // Arrow keys follow reading direction
      var forward = isRTL() ? "ArrowLeft" : "ArrowRight";
      var back = isRTL() ? "ArrowRight" : "ArrowLeft";
      if (e.key === forward) showSlide(current + 1);
      if (e.key === back) showSlide(current - 1);
    });
  }

  /* ---------- Portfolio: colour-grade tabs ---------- */
  var tablist = $(".tabs[role='tablist']");
  if (tablist) {
    var tabs = $all("[role='tab']", tablist);
    var gradeImg = $(".grade__figure img");
    var gradeLabel = $(".grade__label");

    function selectTab(tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.setAttribute("tabindex", selected ? "0" : "-1");
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
      if (gradeImg) gradeImg.className = tab.getAttribute("data-grade");
      if (gradeLabel) gradeLabel.textContent = tab.textContent;
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        selectTab(tab, false);
      });
      tab.addEventListener("keydown", function (e) {
        var next = isRTL() ? "ArrowLeft" : "ArrowRight";
        var prev = isRTL() ? "ArrowRight" : "ArrowLeft";
        if (e.key === next) selectTab(tabs[(i + 1) % tabs.length], true);
        if (e.key === prev) selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true);
        if (e.key === "Home") selectTab(tabs[0], true);
        if (e.key === "End") selectTab(tabs[tabs.length - 1], true);
      });
    });
  }

  /* ---------- Packages: GST switch ---------- */
  var gstSwitch = $("#gst-switch");
  if (gstSwitch) {
    var formatINR = function (n) {
      return "₹" + Math.round(n).toLocaleString("en-IN");
    };
    var renderPrices = function (withGst) {
      $all("[data-price]").forEach(function (el) {
        var base = Number(el.getAttribute("data-price"));
        el.textContent = formatINR(withGst ? base * 1.18 : base);
      });
      $all(".package__tax").forEach(function (el) {
        el.textContent = withGst ? "Including 18% GST" : "Plus 18% GST";
      });
    };
    gstSwitch.addEventListener("click", function () {
      var on = gstSwitch.getAttribute("aria-checked") !== "true";
      gstSwitch.setAttribute("aria-checked", String(on));
      renderPrices(on);
    });
  }

  /* ---------- Contact: prefill from links (date, city, package, type) ---------- */
  var form = $("#enquiry-form");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var prefill = function (name, value) {
      var field = form.elements[name];
      if (field && value) field.value = value;
    };
    if (/^\d{4}-\d{2}-\d{2}$/.test(params.get("date") || "")) prefill("date", params.get("date"));
    if (params.get("city")) prefill("venue", params.get("city").slice(0, 80));
    var pkg = params.get("package");
    if (pkg && form.elements.package && $('option[value="' + pkg.replace(/[^a-z-]/g, "") + '"]', form.elements.package)) {
      form.elements.package.value = pkg;
    }
    if (params.get("type") === "call" && form.elements.reply) form.elements.reply.value = "video-call";

    /* ---------- Contact: validation ---------- */
    var rules = {
      name: function (v) {
        return v.trim().length >= 2 ? "" : "Please tell us your name.";
      },
      email: function (v) {
        if (!v.trim()) return "We need an email address to send your quote.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "That email address doesn't look complete.";
      },
      phone: function (v) {
        var digits = v.replace(/[\s()-]/g, "").replace(/^\+?91/, "");
        if (!digits) return "Please add a phone number for a quick call back.";
        return /^[6-9]\d{9}$/.test(digits) ? "" : "Enter a 10-digit Indian mobile number (with or without +91).";
      },
      date: function (v) {
        if (!v) return "Choose your wedding date (an approximate date is fine).";
        return v >= isoToday ? "" : "That date has already passed — please choose an upcoming date.";
      },
      venue: function (v) {
        return v.trim().length >= 2 ? "" : "Let us know the city or venue.";
      },
      message: function (v) {
        return v.trim().length >= 20 ? "" : "A couple of lines about your plans helps us quote accurately (20+ characters).";
      }
    };

    var showError = function (name, msg) {
      var field = form.elements[name];
      var error = document.getElementById(name + "-error");
      if (error) error.textContent = msg;
      if (field && field.setAttribute) field.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    var validateField = function (name) {
      var field = form.elements[name];
      var msg = rules[name](field.value);
      showError(name, msg);
      return !msg;
    };

    var validateEvents = function () {
      var checked = $all('input[name="events"]:checked', form).length > 0;
      var error = document.getElementById("events-error");
      if (error) error.textContent = checked ? "" : "Select at least one event you'd like covered.";
      return checked;
    };

    var validateConsent = function () {
      var ok = form.elements.consent.checked;
      var error = document.getElementById("consent-error");
      if (error) error.textContent = ok ? "" : "Please confirm we may contact you about this enquiry.";
      form.elements.consent.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    };

    // Validate a field once the visitor leaves it, then live while they fix it
    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      field.addEventListener("blur", function () {
        if (field.value) validateField(name);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(name);
      });
    });
    $all('input[name="events"]', form).forEach(function (box) {
      box.addEventListener("change", validateEvents);
    });

    var success = $("#form-success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
      });
      if (!validateEvents() && !firstInvalid) firstInvalid = $('input[name="events"]', form);
      if (!validateConsent() && !firstInvalid) firstInvalid = form.elements.consent;

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // No server in this build: show a confirmation with a summary
      var events = $all('input[name="events"]:checked', form).map(function (b) {
        return b.value;
      });
      var dateText = new Date(form.elements.date.value + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      $("#success-name").textContent = form.elements.name.value.trim().split(" ")[0];
      $("#success-date").textContent = dateText;
      $("#success-venue").textContent = form.elements.venue.value.trim();
      $("#success-events").textContent = events.join(", ");
      $("#success-ref").textContent = "AA-" + form.elements.date.value.replace(/-/g, "").slice(2) + "-" + String(Math.floor(Math.random() * 900) + 100);

      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    var again = $("#enquiry-again");
    if (again) {
      again.addEventListener("click", function () {
        form.reset();
        $all("[aria-invalid]", form).forEach(function (el) {
          el.setAttribute("aria-invalid", "false");
        });
        success.hidden = true;
        form.hidden = false;
        form.elements.name.focus();
      });
    }
  }
})();
