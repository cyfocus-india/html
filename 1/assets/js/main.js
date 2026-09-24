/* ================================================================
   Oven & Bloom — shared interactions
   ================================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function select(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function selectAll(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function getStoredValue(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setStoredValue(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    var isDark = theme === "dark";
    selectAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute(
        "aria-label",
        isDark ? "Use light theme" : "Use dark theme",
      );
      btn.setAttribute("aria-pressed", String(isDark));
      btn.innerHTML =
        '<i class="ph ph-' +
        (isDark ? "sun" : "moon") +
        '" aria-hidden="true"></i>';
    });
  }

  function initializeTheme() {
    var storedTheme = getStoredValue("oven-bloom-theme");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(storedTheme || (systemDark ? "dark" : "light"));
  }

  function setDirection(direction) {
    root.setAttribute("dir", direction);
    var isRtl = direction === "rtl";
    selectAll("[data-direction-toggle]").forEach(function (btn) {
      btn.setAttribute(
        "aria-label",
        isRtl ? "Switch to Left-to-Right layout (LTR)" : "Switch to Right-to-Left layout (RTL)",
      );
      btn.setAttribute("aria-pressed", String(isRtl));
      btn.innerHTML =
        '<span class="dir-badge" aria-hidden="true">' + (isRtl ? "LTR" : "RTL") + '</span>';
    });
  }

  function initializeDirection() {
    setDirection(getStoredValue("oven-bloom-direction") || "ltr");
  }

  function initializeNavigation() {
    var header = select("[data-header]");
    var nav = select("[data-nav]");
    var toggle = select("[data-nav-toggle]");

    // Ensure nav-overlay exists
    var overlay = select(".nav-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "nav-overlay";
      overlay.setAttribute("aria-hidden", "true");
      body.appendChild(overlay);
    }

    function openNav() {
      if (!nav || !toggle) return;
      nav.classList.add("is-open");
      body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      var menuIcon = select("i", toggle);
      if (menuIcon) menuIcon.className = "ph ph-x";
    }

    function closeNav() {
      if (!nav || !toggle) return;
      nav.classList.remove("is-open");
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      var closeIcon = select("i", toggle);
      if (closeIcon) closeIcon.className = "ph ph-list";
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = nav.classList.contains("is-open");
        if (open) {
          closeNav();
        } else {
          openNav();
        }
      });

      selectAll("a", nav).forEach(function (link) {
        link.addEventListener("click", closeNav);
      });

      if (overlay) {
        overlay.addEventListener("click", closeNav);
      }

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeNav();
      });

      document.addEventListener("click", function (event) {
        var eventPath = event.composedPath ? event.composedPath() : [];
        if (!nav.contains(event.target) && eventPath.indexOf(toggle) === -1) {
          closeNav();
        }
      });

      // Nav dropdown toggle (click, touch, keyboard)
      selectAll("[data-nav-dropdown]").forEach(function (dropdown) {
        var trigger = select(".nav-dropdown__trigger", dropdown);
        if (!trigger) return;

        function toggleDropdown(open) {
          var willOpen = open !== undefined ? open : !dropdown.classList.contains("is-open");
          if (willOpen) {
            selectAll("[data-nav-dropdown]").forEach(function (other) {
              if (other !== dropdown) {
                other.classList.remove("is-open");
                var otherTrigger = select(".nav-dropdown__trigger", other);
                if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
              }
            });
          }
          dropdown.classList.toggle("is-open", willOpen);
          trigger.setAttribute("aria-expanded", String(willOpen));
        }

        trigger.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleDropdown();
        });

        selectAll(".nav-dropdown__item", dropdown).forEach(function (item) {
          item.addEventListener("click", function () {
            toggleDropdown(false);
            closeNav();
          });
        });

        document.addEventListener("click", function (e) {
          if (!dropdown.contains(e.target)) {
            toggleDropdown(false);
          }
        });

        dropdown.addEventListener("keydown", function (e) {
          var items = selectAll(".nav-dropdown__item", dropdown);
          var activeIndex = items.indexOf(document.activeElement);

          if (e.key === "Escape") {
            toggleDropdown(false);
            trigger.focus();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!dropdown.classList.contains("is-open")) {
              toggleDropdown(true);
              if (items.length) items[0].focus();
            } else {
              var nextIndex = (activeIndex + 1) % items.length;
              items[nextIndex].focus();
            }
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (dropdown.classList.contains("is-open")) {
              var prevIndex = (activeIndex - 1 + items.length) % items.length;
              items[prevIndex].focus();
            }
          } else if (e.key === "Home" && dropdown.classList.contains("is-open")) {
            e.preventDefault();
            if (items.length) items[0].focus();
          } else if (e.key === "End" && dropdown.classList.contains("is-open")) {
            e.preventDefault();
            if (items.length) items[items.length - 1].focus();
          }
        });
      });
    }

    function updateHeader() {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initializeControls() {
    selectAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var nextTheme =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        setStoredValue("oven-bloom-theme", nextTheme);
      });
    });

    selectAll("[data-direction-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var nextDirection = root.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
        setDirection(nextDirection);
        setStoredValue("oven-bloom-direction", nextDirection);
      });
    });
  }

  function initializeProductFilters() {
    var filterGroup = select("[data-product-filters]");
    if (!filterGroup) return;

    var buttons = selectAll("[data-filter]", filterGroup);
    var products = selectAll("[data-category]");
    var catalogGrid = select(".catalog-grid");

    // Empty state container
    var emptyState = select(".catalog-empty", catalogGrid ? catalogGrid.parentNode : null);
    if (!emptyState && catalogGrid) {
      emptyState = document.createElement("div");
      emptyState.className = "catalog-empty";
      emptyState.hidden = true;
      emptyState.innerHTML =
        '<h3>No cakes found in this category</h3>' +
        '<p>Availability changes daily with fresh ingredients. Try another occasion or view our complete bake menu.</p>' +
        '<button class="btn btn--primary" type="button" data-reset-filter>View all cakes</button>';
      catalogGrid.appendChild(emptyState);

      var resetBtn = select("[data-reset-filter]", emptyState);
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          var allBtn = select('[data-filter="all"]', filterGroup);
          if (allBtn) applyFilter("all", allBtn);
        });
      }
    }

    function applyFilter(filter, activeButton) {
      buttons.forEach(function (item) {
        var active = item === activeButton;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      var visibleCount = 0;
      products.forEach(function (product) {
        var categories = product.getAttribute("data-category").split(" ");
        var visible = filter === "all" || categories.indexOf(filter) !== -1;
        product.hidden = !visible;
        if (visible) visibleCount++;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");
        applyFilter(filter, button);
      });
    });

    var requestedFilter = new URLSearchParams(window.location.search).get(
      "occasion",
    );
    var requestedButton = buttons.find(function (button) {
      return button.getAttribute("data-filter") === requestedFilter;
    });

    if (requestedButton) applyFilter(requestedFilter, requestedButton);
  }

  function showFieldError(field, message) {
    var wrapper = field.closest(".field");
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (wrapper) {
      var error = select(".field-error", wrapper);
      if (error) error.textContent = message;
    } else {
      var form = field.closest("form");
      if (form) {
        var status = select(".form-status", form);
        if (status) {
          if (message) {
            status.textContent = message;
            status.classList.add("is-visible");
            status.classList.add("form-status--error");
            status.classList.remove("form-status--success");
          } else if (status.classList.contains("form-status--error")) {
            status.textContent = "";
            status.classList.remove("is-visible");
            status.classList.remove("form-status--error");
          }
        }
      }
    }
  }

  function validateField(field) {
    var value = field.value.trim();
    var message = "";

    if (field.hasAttribute("required") && !value) {
      message = "Please complete this field.";
    } else if (
      field.type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      message = "Enter a valid email address.";
    } else if (
      field.type === "tel" &&
      value &&
      !/^[+()\d\s-]{7,20}$/.test(value)
    ) {
      message = "Enter a valid phone number.";
    } else if (field.type === "date" && value) {
      var selected = new Date(value + "T00:00:00");
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) message = "Choose today or a future date.";
    } else if (
      field.hasAttribute("minlength") &&
      value.length < Number(field.getAttribute("minlength"))
    ) {
      message = "Please add a little more detail.";
    }

    showFieldError(field, message);
    return !message;
  }

  function initializeForms() {
    selectAll("[data-validate]").forEach(function (form) {
      var fields = selectAll(
        'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]), textarea, select',
        form,
      );

      fields.forEach(function (field) {
        field.addEventListener("blur", function () {
          validateField(field);
        });
        field.addEventListener("input", function () {
          if (field.getAttribute("aria-invalid") === "true")
            validateField(field);
        });
      });

      // Clear choice error on change
      selectAll("[data-required-choice]", form).forEach(function (group) {
        selectAll("input[type=\"radio\"]", group).forEach(function (radio) {
          radio.addEventListener("change", function () {
            var message = select(".field-error", group);
            if (message) message.textContent = "";
          });
        });
      });

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var valid = fields.map(validateField).every(Boolean);
        var requiredChoices = selectAll("[data-required-choice]", form);

        requiredChoices.forEach(function (group) {
          var checked = select("input:checked", group);
          var message = select(".field-error", group);
          if (!checked) {
            valid = false;
            if (message) message.textContent = "Choose one option.";
          } else if (message) {
            message.textContent = "";
          }
        });

        if (!valid) {
          var firstInvalid =
            select('[aria-invalid="true"]', form) ||
            select("[data-required-choice] input", form);
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        var status = select(".form-status", form);
        if (status) {
          status.style.color = "";
          status.style.background = "";
          status.textContent =
            status.getAttribute("data-success-msg") ||
            status.textContent ||
            "Thank you! Your enquiry has been received.";
          status.classList.remove("form-status--error");
          status.classList.add("form-status--success");
          status.classList.add("is-visible");
          status.setAttribute("role", "status");
        }

        form.reset();
      });
    });
  }

  function initializeCarousel() {
    var carousel = select("[data-carousel]");
    if (!carousel) return;
    var slides = selectAll("[data-slide]", carousel);
    var previous = select("[data-carousel-prev]", carousel);
    var next = select("[data-carousel-next]", carousel);
    var index = 0;

    // Create dot indicators if not present
    var controls = select(".carousel-controls", carousel);
    var dotsContainer = select(".carousel-dots", controls);
    if (!dotsContainer && controls && slides.length > 1) {
      dotsContainer = document.createElement("div");
      dotsContainer.className = "carousel-dots";
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("type", "button");
        dot.setAttribute("aria-label", "Go to quote " + (i + 1));
        dot.addEventListener("click", function () {
          showSlide(i);
        });
        dotsContainer.appendChild(dot);
      });
      controls.appendChild(dotsContainer);
    }

    function updateDots() {
      if (!dotsContainer) return;
      var dots = selectAll(".carousel-dot", dotsContainer);
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      updateDots();
    }

    if (previous) {
      previous.addEventListener("click", function () {
        showSlide(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
      });
    }

    // Touch swipe support
    var touchStartX = 0;
    carousel.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    carousel.addEventListener(
      "touchend",
      function (e) {
        var diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 40) {
          showSlide(diff < 0 ? index + 1 : index - 1);
        }
      },
      { passive: true },
    );

    // Keyboard support
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") showSlide(index - 1);
      if (e.key === "ArrowRight") showSlide(index + 1);
    });

    // Auto-advance with pause on hover / focus
    if (!prefersReducedMotion && slides.length > 1) {
      var autoTimer = null;
      function startAutoAdvance() {
        autoTimer = window.setInterval(function () {
          showSlide(index + 1);
        }, 4500);
      }
      function stopAutoAdvance() {
        if (autoTimer) {
          window.clearInterval(autoTimer);
          autoTimer = null;
        }
      }
      carousel.addEventListener("mouseenter", stopAutoAdvance);
      carousel.addEventListener("mouseleave", startAutoAdvance);
      carousel.addEventListener("focusin", stopAutoAdvance);
      carousel.addEventListener("focusout", function (e) {
        if (!carousel.contains(e.relatedTarget)) startAutoAdvance();
      });
      startAutoAdvance();
    }

    showSlide(0);
  }

  function initializePostcodeChecker() {
    var form = select("[data-postcode-form]");
    if (!form) return;
    var input = select("input", form);
    var result = select("[data-postcode-result]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var raw = input.value.trim().toUpperCase();
      if (!raw) {
        result.innerHTML = '<span style="color: #fca5a5; font-weight: 600">Please enter a PIN code or area name to check delivery.</span>';
        return;
      }

      var zone = 2;
      var areaName = "Bengaluru Central";
      var fee = "₹120";
      var windowTime = "10:00–13:00 or 15:00–19:00";

      // Area-based and PIN-based detection
      if (raw.indexOf("560038") !== -1 || raw.indexOf("560071") !== -1 || raw.indexOf("560008") !== -1 || raw.indexOf("INDIRANAGAR") !== -1 || raw.indexOf("DOMLUR") !== -1 || raw.indexOf("ULSOOR") !== -1) {
        zone = 1;
        areaName = "Indiranagar / Neighbourhood";
        fee = "Complimentary (Free)";
        windowTime = "Flexible same-day window";
      } else if (raw.indexOf("560034") !== -1 || raw.indexOf("560001") !== -1 || raw.indexOf("560093") !== -1 || raw.indexOf("KORAMANGALA") !== -1 || raw.indexOf("MG ROAD") !== -1) {
        zone = 2;
        areaName = "Koramangala / Central";
        fee = "₹120";
      } else if (raw.indexOf("560066") !== -1 || raw.indexOf("560041") !== -1 || raw.indexOf("560102") !== -1 || raw.indexOf("WHITEFIELD") !== -1 || raw.indexOf("JAYANAGAR") !== -1 || raw.indexOf("HSR") !== -1) {
        zone = 3;
        areaName = "Whitefield / HSR / Jayanagar";
        fee = "₹220";
      } else {
        var num = raw.match(/\d+/);
        if (num) {
          var mod = (Number(num[0]) % 4) + 1;
          zone = mod;
          var fees = ["Complimentary", "₹120", "₹220", "Custom distance quote"];
          fee = fees[zone - 1];
        } else {
          zone = 4;
          fee = "Custom distance quote";
        }
      }

      result.innerHTML =
        '<div class="postcode-card" role="region" aria-label="Delivery estimate">' +
        '  <div class="postcode-card__info">' +
        '    <span class="postcode-card__zone"><i class="ph ph-check-circle" aria-hidden="true" style="color: var(--gold)"></i> Zone ' + zone + ' · ' + areaName + '</span>' +
        '    <span class="postcode-card__fee">Standard delivery: <strong>' + fee + '</strong></span>' +
        '    <span class="postcode-card__meta">Standard windows: ' + windowTime + '</span>' +
        '  </div>' +
        '  <a class="btn btn--light" href="products.html">Browse cakes for Zone ' + zone + '</a>' +
        '</div>';
    });
  }

  function initializePricingCalculator() {
    var calculator = select("[data-calculator]");
    if (!calculator) return;
    var size = select('[name="calc-size"]', calculator);
    var finish = select('[name="calc-finish"]', calculator);
    var tiers = select('[name="calc-tiers"]', calculator);
    var result = select("[data-calculator-result]", calculator);

    function calculate() {
      var base = Number(size ? size.value : 1350) || 1350;
      var finishCost = Number(finish ? finish.value : 0) || 0;
      var tierCount = Number(tiers ? tiers.value : 1) || 1;
      var total = Math.round(
        (base + finishCost) * (1 + (tierCount - 1) * 0.72),
      );
      if (result) result.textContent = "₹" + total.toLocaleString("en-IN");
    }

    [size, finish, tiers].forEach(function (field) {
      if (field) field.addEventListener("change", calculate);
    });
    calculate();
  }

  function initializeLiveOrderSummary() {
    var form = select("[data-custom-order]");
    if (!form) return;
    var summary = select("[data-order-summary]");

    function updateSummary() {
      var occasion = select('[name="occasion"]', form);
      var flavor = select('[name="flavor"]', form);
      var servings = select('[name="servings"]', form);
      var fulfilment = select('input[name="fulfilment"]:checked', form);
      var date = select('[name="date"]', form);
      var budget = select('[name="budget"]', form);

      var tags = [];
      if (occasion && occasion.value) {
        tags.push('<span class="order-summary-tag"><strong>Occasion:</strong> ' + occasion.options[occasion.selectedIndex].text + '</span>');
      }
      if (flavor && flavor.value) {
        tags.push('<span class="order-summary-tag"><strong>Flavour:</strong> ' + flavor.options[flavor.selectedIndex].text + '</span>');
      }
      if (servings && servings.value) {
        tags.push('<span class="order-summary-tag"><strong>Guests:</strong> ' + servings.options[servings.selectedIndex].text + '</span>');
      }
      if (fulfilment && fulfilment.value) {
        var fulfText = fulfilment.value === "pickup" ? "Collect in store" : (fulfilment.value === "delivery" ? "Local delivery" : "Discuss together");
        tags.push('<span class="order-summary-tag"><strong>Fulfilment:</strong> ' + fulfText + '</span>');
      }
      if (date && date.value) {
        tags.push('<span class="order-summary-tag"><strong>Date:</strong> ' + date.value + '</span>');
      }
      if (budget && budget.value) {
        tags.push('<span class="order-summary-tag"><strong>Budget:</strong> ' + budget.options[budget.selectedIndex].text + '</span>');
      }

      if (summary) {
        if (tags.length) {
          summary.innerHTML = '<div class="order-summary-tags">' + tags.join("") + '</div>';
        } else {
          summary.textContent = "Your selections will appear here as you build your brief.";
        }
      }
    }

    selectAll("select, input", form).forEach(function (field) {
      field.addEventListener("change", updateSummary);
    });

    // Auto-prefill flavor if passed via URL parameter
    var params = new URLSearchParams(window.location.search);
    var flavorParam = params.get("flavour") || params.get("flavor") || params.get("cake");
    if (flavorParam) {
      var flavorSelect = select('[name="flavor"]', form);
      if (flavorSelect) {
        var map = {
          "midnight-truffle": "chocolate",
          "chocolate": "chocolate",
          "berry-garden": "vanilla-berry",
          "vanilla-berry": "vanilla-berry",
          "pistachio-rose": "pistachio-rose",
          "lemon-elderflower": "lemon",
          "lemon": "lemon",
          "salted-caramel-pecan": "caramel",
          "caramel-pecan": "caramel",
          "caramel": "caramel",
          "crimson-velvet": "crimson-velvet",
          "wild-meadow": "wild-meadow",
          "quiet-bloom": "quiet-bloom",
          "dark-orchard": "dark-orchard"
        };
        var targetVal = map[flavorParam] || flavorParam;
        if (flavorSelect.querySelector('option[value="' + targetVal + '"]')) {
          flavorSelect.value = targetVal;
        }
      }
    }

    updateSummary();
  }

  function splitRevealCopy() {
    selectAll(".reveal-copy").forEach(function (element) {
      if (element.getAttribute("data-split") === "true") return;
      var words = element.textContent.trim().split(/\s+/);
      element.innerHTML = words
        .map(function (word) {
          return '<span class="word">' + word + "</span>";
        })
        .join(" ");
      element.setAttribute("data-split", "true");
    });
  }

  function initializeGsap() {
    if (prefersReducedMotion || !window.gsap) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    root.classList.add("has-gsap");

    gsap.from("[data-hero-reveal]", {
      y: 55,
      opacity: 0,
      duration: 1.15,
      stagger: 0.12,
      ease: "power4.out",
      delay: 0.2,
    });

    if (window.ScrollTrigger) {
      selectAll(".reveal-copy").forEach(function (copy) {
        var words = selectAll(".word", copy);
        gsap.to(words, {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: copy,
            start: "top 82%",
            end: "bottom 45%",
            scrub: 1,
          },
        });
      });

      selectAll("[data-scroll-image]").forEach(function (image) {
        gsap.fromTo(
          image,
          {
            scale: 0.82,
            opacity: 0.55,
          },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top 90%",
              end: "center 55%",
              scrub: 1,
            },
          },
        );
      });

      selectAll(".process-card").forEach(function (card, cardIndex) {
        card.style.setProperty("--card-index", String(cardIndex));
        gsap.from(card, {
          y: 35,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
        });
      });

      selectAll("[data-fade-up]").forEach(function (element) {
        gsap.from(element, {
          y: 45,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
          },
        });
      });
    }
  }

  /* ================================================================
     Cake Catalog Data & Popup Modal
     ================================================================ */
  var CAKE_CATALOG = {
    "midnight-truffle": {
      name: "Midnight Truffle",
      subtitle: "Rich & dark · Hand-poured ganache",
      price: "From ₹1,450",
      badge: "Signature Bestseller",
      tags: ["Eggless Available", "Belgian Dark Chocolate", "Birthdays & Milestones"],
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
      alt: "Midnight chocolate truffle cake with ganache drizzle",
      desc: "Our most requested celebration cake. Baked with deep single-origin 70% dark Belgian cocoa sponge, soaked in house-brewed vanilla bean syrup, and layered with whipped chocolate ganache before receiving a glossy dark drip and sea salt flakes.",
      flavorProfile: "Bittersweet cocoa, malty crumb, smooth ganache with a delicate mineral sea salt finish.",
      ingredients: "Belgian 70% dark chocolate, organic unsalted butter, slow-steeped Coorg vanilla bean, Dutch cocoa, Maldon sea salt flakes.",
      servings: "500g (4–6 guests) · 1kg (8–12 guests) · 2-tier 2.5kg (20–28 guests)",
      leadTime: "24 hours advance (limited same-day batches available before 12:00)",
      storage: "Keep chilled in its box. Bring to room temperature 25 minutes prior to slicing for the silkiest ganache texture.",
      orderUrl: "custom-orders.html?flavour=midnight-truffle"
    },
    "berry-garden": {
      name: "Berry Garden",
      subtitle: "Light & fruity · Fresh seasonal fruits",
      price: "From ₹1,650",
      badge: "Seasonal Creation",
      tags: ["Fresh Local Berries", "Mascarpone Cream", "Summer Gatherings"],
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=82",
      alt: "Colourful berry birthday cake with vanilla sponge and star toppings",
      desc: "An airy sponge inspired by summer gardens. Tender vanilla chiffon layered with wild strawberry and raspberry reduction, whipped Italian mascarpone cream, and adorned with handpicked seasonal berries and organic edible blossoms.",
      flavorProfile: "Crisp berry tartness balanced by creamy mascarpone and aromatic vanilla sponge.",
      ingredients: "Nilgiri fresh strawberries and raspberries, farm mascarpone, organic unbleached flour, wildflower honey, edible garden petals.",
      servings: "600g (4–6 guests) · 1.2kg (8–12 guests) · 2kg (16–22 guests)",
      leadTime: "Order by 4:00 PM for next-day afternoon delivery or collection.",
      storage: "Store refrigerated at 4°C–6°C. Enjoy fresh within 48 hours.",
      orderUrl: "custom-orders.html?flavour=berry-garden"
    },
    "lemon-elderflower": {
      name: "Lemon Elderflower",
      subtitle: "Bright & floral · Sicilian citrus",
      price: "From ₹2,100",
      badge: "Wedding & Ceremony",
      tags: ["Tasting Box Available", "Elderflower Cordial", "Anniversaries"],
      image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=80",
      alt: "Elegant white citrus wedding cake with floral adornments",
      desc: "Light, refreshing, and sculpted for celebratory gatherings. Zesty lemon zest cake drenched in homemade elderflower cordial syrup, layered with tart Meyer lemon curd and veiled in silk Swiss meringue buttercream.",
      flavorProfile: "Bright aromatic citrus, fragrant floral elderflower, and velvety, barely-sweet buttercream.",
      ingredients: "Organic Sicilian lemons, handcrafted elderflower extract, farm-fresh eggs, pure butter, Madagascar Bourbon vanilla.",
      servings: "1kg (8–12 guests) · 2kg 2-tier (18–24 guests) · 3.5kg 3-tier (35–45 guests)",
      leadTime: "48 hours advance notice required. Tasting consultations available on weekends.",
      storage: "Serve cool or at room temperature. Keep away from direct sunlight and warmth.",
      orderUrl: "custom-orders.html?flavour=lemon-elderflower"
    },
    "salted-caramel-pecan": {
      name: "Salted Caramel Pecan",
      subtitle: "Toasty & warm · House-crafted caramel",
      price: "From ₹1,550",
      badge: "Autumn & Winter Warmth",
      tags: ["Roasted Pecans", "Contains Tree Nuts", "Brown Butter"],
      image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=80",
      alt: "Caramel pecan layer cake with dripping caramel sauce",
      desc: "A rich, deeply comforting cake layered with toasted Texas pecans, nutty brown butter sponge, slow-cooked amber caramel with Brittany sea salt, and caramelised Swiss meringue frosting.",
      flavorProfile: "Nutty toastiness, rich caramelized brown butter, and buttery sweet-salty harmony.",
      ingredients: "Roasted Texas pecans, slow-churned butter browned in copper pans, raw turbinado sugar, cream, French fleur de sel.",
      servings: "500g (4–6 guests) · 1kg (8–12 guests) · 1.8kg (16–20 guests)",
      leadTime: "24 hours advance order recommended.",
      storage: "Keep in a cool dry cake dome or refrigerated. Bring to room temperature 30 minutes before serving.",
      orderUrl: "custom-orders.html?flavour=caramel-pecan"
    },
    "crimson-velvet": {
      name: "Crimson Velvet",
      subtitle: "Velvety & tangy · Silky cream cheese",
      price: "From ₹1,350",
      badge: "Classic Crowd-Pleaser",
      tags: ["Eggless Option", "Philadelphia Frosting", "Birthdays"],
      image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=80",
      alt: "Red velvet cake with white cream cheese frosting",
      desc: "Our take on the Southern classic is tender, moist, and never heavy. An authentic cocoa buttermilk crumb layered generously with velvety, lemon-scented cream cheese frosting and fine cake crumbs.",
      flavorProfile: "Subtle chocolate undertones, comforting buttermilk tang, and luscious silky frosting.",
      ingredients: "Cultured buttermilk, Dutched cocoa, Madagascar vanilla, Philadelphia cream cheese, pure butter.",
      servings: "500g (4–6 guests) · 1kg (8–12 guests) · 2kg (18–24 guests)",
      leadTime: "24 hours advance. Same-day slices often available at our Indiranagar counter.",
      storage: "Keep refrigerated. Best enjoyed slightly chilled or at cool room temperature.",
      orderUrl: "custom-orders.html?flavour=crimson-velvet"
    },
    "pistachio-rose": {
      name: "Pistachio Rose",
      subtitle: "Nutty & fragrant · Persian inspiration",
      price: "From ₹1,750",
      badge: "Artisanal Specialty",
      tags: ["Kashmir Rose", "Cardamom Notes", "Pure Pistachio"],
      image: "https://images.unsplash.com/photo-1549572189-dddb1adf739b?auto=format&fit=crop&w=900&q=80",
      alt: "Pistachio rose layer cake with crushed green nuts and edible petals",
      desc: "Inspired by Persian tea tables and heritage spice gardens. Finely ground emerald pistachio sponge spiced gently with cardamom, brushed with organic damask rose water syrup, and frosted in whipped white chocolate cream.",
      flavorProfile: "Earthy roasted pistachio, warm aromatic green cardamom, and subtle botanical floral notes.",
      ingredients: "Persian raw pistachios, organic Damascus rose petal distillate, green cardamom pods, Belgian white chocolate, organic flour.",
      servings: "600g (4–6 guests) · 1.2kg (8–12 guests) · 2kg (16–22 guests)",
      leadTime: "36 hours advance notice for single-origin nut grinding and infusion.",
      storage: "Keep refrigerated in airtight bakery box. Enjoy within 3 days.",
      orderUrl: "custom-orders.html?flavour=pistachio-rose"
    },
    "butter-croissant": {
      name: "Butter Croissant",
      subtitle: "Flaky & golden · French laminations",
      price: "₹180 / Box of 4 ₹680",
      badge: "Morning Viennoiserie",
      tags: ["AOP French Butter", "72-Hour Fermentation", "Fresh Daily"],
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
      alt: "Golden flaky freshly baked butter croissants",
      desc: "Rolled and folded patiently across three days. 27 delicate layers of slow-fermented dough and French Normandy dry butter, baked until caramelized, feather-light, and shatteringly crisp on the outside with an open honeycomb core.",
      flavorProfile: "Rich cultured butter, faint caramelized hazelnut crust, and soft airy crumb.",
      ingredients: "Unbleached French flour, 84% fat AOP Normandy butter, whole milk, sea salt, sourdough levain starter.",
      servings: "Individual pastry or breakfast boxes of 4, 6, or 12.",
      leadTime: "Baked fresh every morning at 07:00. Order ahead for boxes of 6 or more.",
      storage: "Warm in a preheated oven at 170°C for 3–4 minutes for bakery-fresh crispness. Do not microwave.",
      orderUrl: "contact.html#same-day"
    },
    "hazelnut-tart": {
      name: "Chocolate Hazelnut Tart",
      subtitle: "Silky & crisp · Gianduja ganache",
      price: "₹320 / 8-inch Tart ₹1,850",
      badge: "Pastry Studio Item",
      tags: ["Piedmont Hazelnuts", "Dark Gianduja", "Crisp Pâte Sablée"],
      image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=900&q=80",
      alt: "Chocolate hazelnut tart with golden cocoa dusting",
      desc: "A buttery, crisp chocolate shortcrust filled with a layer of roasted hazelnut praliné crunch, topped with a mirror-smooth 64% dark chocolate gianduja ganache and roasted whole hazelnuts.",
      flavorProfile: "Crunchy praliné, deeply toasted hazelnuts, and velvety dark cocoa cream.",
      ingredients: "Roasted Piedmont hazelnuts, Valrhona 64% dark chocolate, butter, almond flour, Maldon salt.",
      servings: "Individual 3.5-inch tart or 8-inch celebration tart (serves 8–10).",
      leadTime: "Same-day pickup available for individuals; 24-hour notice for 8-inch tarts.",
      storage: "Keep refrigerated. Serve slightly chilled.",
      orderUrl: "contact.html#same-day"
    },
    "orchard-danish": {
      name: "Orchard Fruit Danish",
      subtitle: "Buttery & bright · Seasonal stone fruit",
      price: "₹220 / Box of 4 ₹820",
      badge: "Morning Viennoiserie",
      tags: ["Local Fruit Compote", "Vanilla Custard", "Morning Pastry"],
      image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80",
      alt: "Fresh fruit danish pastries with glazes and cream",
      desc: "Crisp, flaky laminated brioche pastry centered with rich vanilla bean pastry cream and topped with seasonal orchard fruits poached gently in lemon verbena syrup.",
      flavorProfile: "Sweet-tart fruit glaze, rich silky pastry cream, and caramelized buttery lamination.",
      ingredients: "French flour, churned butter, fresh market stone fruits, organic eggs, whole milk, vanilla pods.",
      servings: "Individual pastry or assorted morning boxes.",
      leadTime: "Available from morning counter. Order box sets by 6:00 PM previous day.",
      storage: "Best enjoyed day of baking. Keep in a cool dry area.",
      orderUrl: "contact.html#same-day"
    },
    "wild-meadow": {
      name: "Wild Meadow Tier",
      subtitle: "Botanical couture · Custom tiered cake",
      price: "From ₹3,400",
      badge: "3 Tiers · 45–65 Guests",
      tags: ["Botanical Couture", "Organic Edible Florals", "Lavender Citrus", "Weddings"],
      image: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?auto=format&fit=crop&w=1400&q=82",
      alt: "Textured celebration cake with pressed wild flowers",
      desc: "Lavender-infused lemon chiffon layered with wild blackberry thyme compote and white chocolate Swiss buttercream, finished with organic pressed florals.",
      flavorProfile: "Subtle botanical lavender, bright tart blackberry, and silky white chocolate finish.",
      ingredients: "Farm lavender extract, organic blueberries & blackberries, fresh thyme, organic butter, pesticide-free edible flowers.",
      servings: "3 Tiers · 45–65 Guests (custom sizing available)",
      leadTime: "Requires minimum 7 days advance booking and design consultation.",
      storage: "Delivered and assembled on-site by our bakery team in temperature-controlled transit.",
      orderUrl: "custom-orders.html?flavour=wild-meadow"
    },
    "quiet-bloom": {
      name: "Quiet Bloom",
      subtitle: "Modern sculptural · Champagne & pear",
      price: "From ₹2,800",
      badge: "2 Tiers · 22–30 Guests",
      tags: ["Modern Sculptural", "Textured Buttercream", "Poached Pear", "Intimate Receptions"],
      image: "https://images.unsplash.com/photo-1524562596000-38f0dbe5b07a?auto=format&fit=crop&w=1000&q=82",
      alt: "Minimal two-tier textured buttercream cake",
      desc: "Architectural palette-knife buttercream with poached pear reduction, cardamom infusion, and subtle champagne-soaked sponge layers.",
      flavorProfile: "Delicate wine-poached pear, gentle cardamom spice, and clean creamy buttercream.",
      ingredients: "Bosc pears, sparkling grape reduction, green cardamom, organic flour, farm butter, vanilla beans.",
      servings: "2 Tiers · 22–30 Guests",
      leadTime: "4 days advance booking.",
      storage: "Store in cool air-conditioned room or refrigerated until display.",
      orderUrl: "custom-orders.html?flavour=quiet-bloom"
    },
    "dark-orchard": {
      name: "Dark Orchard",
      subtitle: "Avant-garde decadence · Cherry cacao",
      price: "From ₹2,600",
      badge: "2 Tiers · 20–28 Guests",
      tags: ["Avant-Garde Decadence", "Dark Kirsch Morello", "72% Ecuadorian Chocolate", "Milestones"],
      image: "https://images.unsplash.com/photo-1702744382319-20efefc9dc19?auto=format&fit=crop&w=1000&q=82",
      alt: "Rich dark chocolate ganache-drip cake with piped rosettes",
      desc: "72% single-origin Ecuadorian cacao sponge layered with tart Morello cherries, dark chocolate ganache, and hand-chiseled cocoa bark.",
      flavorProfile: "Intense bittersweet cacao, sharp tart cherry, and dark silky ganache.",
      ingredients: "72% single-origin dark chocolate, sour Morello cherries, pure cocoa butter, organic eggs, vanilla.",
      servings: "2 Tiers · 20–28 Guests",
      leadTime: "3 days advance booking.",
      storage: "Keep chilled. Serve at cool room temperature.",
      orderUrl: "custom-orders.html?flavour=dark-orchard"
    },
    "blush-peony": {
      name: "Blush Peony",
      subtitle: "Romantic meringue · Peach & rose",
      price: "From ₹2,900",
      badge: "2 Tiers · 25–35 Guests",
      tags: ["Romantic Meringue", "White Peach", "Fresh Peonies", "Receptions"],
      image: "https://images.unsplash.com/photo-1557308536-ee471ef2c390?auto=format&fit=crop&w=1000&q=82",
      alt: "Blush buttercream cake topped with meringue kisses, blueberries, and fresh peonies",
      desc: "Rose-water vanilla sponge with white peach compote and mascarpone cream, swept in blush buttercream and crowned with meringue kisses and garden peonies.",
      flavorProfile: "Delicate rose, ripe stone fruit, and airy vanilla mascarpone.",
      ingredients: "White peaches, food-grade rose water, vanilla beans, mascarpone, free-range egg whites, seasonal peonies.",
      servings: "2 Tiers · 25–35 Guests (custom sizing available)",
      leadTime: "Requires minimum 5 days advance booking.",
      storage: "Keep refrigerated. Bring to cool room temperature 45 minutes before serving.",
      orderUrl: "custom-orders.html?flavour=blush-peony"
    },
    "orchard-berry": {
      name: "Orchard Berry Tier",
      subtitle: "Seasonal ceremonial · Summer berries",
      price: "From ₹3,300",
      badge: "3 Tiers · 40–55 Guests",
      tags: ["Seasonal Ceremonial", "Summer Berries", "Crème Fraîche", "Weddings"],
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1000&q=82",
      alt: "Two-tier textured buttercream cake crowned with strawberries, blueberries, and fresh mint",
      desc: "Vanilla bean sponge folded with crème fraîche and summer berry compote, wrapped in softly combed buttercream and finished with fresh fruit and mint.",
      flavorProfile: "Bright market berries, tangy crème fraîche, and clean vanilla bean.",
      ingredients: "Seasonal strawberries & blueberries, crème fraîche, vanilla beans, organic flour, farm butter, fresh mint.",
      servings: "3 Tiers · 40–55 Guests (custom sizing available)",
      leadTime: "Requires minimum 7 days advance booking and design consultation.",
      storage: "Delivered and assembled on-site by our bakery team in temperature-controlled transit.",
      orderUrl: "custom-orders.html?flavour=orchard-berry"
    }
  };

  function initializeCakeModal() {
    var modal = select("#cake-detail-modal");
    if (!modal) return;

    var closeButtons = selectAll("[data-modal-close]", modal);
    var modalMedia = select("[data-modal-media]", modal);
    var modalTags = select("[data-modal-tags]", modal);
    var modalTitle = select("[data-modal-title]", modal);
    var modalPrice = select("[data-modal-price]", modal);
    var modalDesc = select("[data-modal-desc]", modal);
    var modalFlavor = select("[data-modal-flavor]", modal);
    var modalIngredients = select("[data-modal-ingredients]", modal);
    var modalServings = select("[data-modal-servings]", modal);
    var modalLead = select("[data-modal-lead]", modal);
    var modalStorage = select("[data-modal-storage]", modal);
    var modalOrderBtn = select("[data-modal-order]", modal);

    var lastFocusedElement = null;

    function openCakeModal(cakeId, triggerElement) {
      var data = CAKE_CATALOG[cakeId];
      if (!data) return;

      lastFocusedElement = triggerElement || document.activeElement;

      // Populate content
      var cardImg = triggerElement ? triggerElement.querySelector("img") : null;
      var cakeImgSrc = (cardImg && cardImg.getAttribute("src")) ? cardImg.getAttribute("src") : data.image;
      var cakeImgAlt = (cardImg && cardImg.getAttribute("alt")) ? cardImg.getAttribute("alt") : data.alt;

      if (modalMedia) {
        modalMedia.innerHTML =
          '<img src="' + cakeImgSrc + '" alt="' + cakeImgAlt + '" width="800" height="700" loading="eager" />' +
          '<span class="cake-modal__badge">' + data.badge + '</span>';
      }
      if (modalTitle) modalTitle.textContent = data.name;
      if (modalPrice) modalPrice.textContent = data.price;
      if (modalDesc) modalDesc.textContent = data.desc;
      if (modalFlavor) modalFlavor.textContent = data.flavorProfile;
      if (modalIngredients) modalIngredients.textContent = data.ingredients;
      if (modalServings) modalServings.textContent = data.servings;
      if (modalLead) modalLead.textContent = data.leadTime;
      if (modalStorage) modalStorage.textContent = data.storage;

      if (modalTags) {
        modalTags.innerHTML = data.tags
          .map(function (tag, i) {
            return '<span class="cake-modal__tag' + (i === 0 ? ' cake-modal__tag--accent' : '') + '">' + tag + '</span>';
          })
          .join("");
      }

      if (modalOrderBtn) {
        var isPagesDir = window.location.pathname.indexOf("/pages/") !== -1;
        var targetUrl = data.orderUrl;
        if (!isPagesDir && targetUrl.indexOf("pages/") === -1) {
          targetUrl = "pages/" + targetUrl;
        } else if (isPagesDir && targetUrl.indexOf("pages/") === 0) {
          targetUrl = targetUrl.replace("pages/", "");
        }
        modalOrderBtn.setAttribute("href", targetUrl);
      }

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
      body.classList.add("modal-open");
      if (closeButtons.length > 0) {
        closeButtons[0].focus();
      }
    }

    function closeCakeModal() {
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
      body.classList.remove("modal-open");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }

    closeButtons.forEach(function (btn) {
      btn.addEventListener("click", closeCakeModal);
    });

    // Close on backdrop click or close button delegation
    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-modal-close]")) {
        closeCakeModal();
        return;
      }
      var rect = modal.getBoundingClientRect();
      var isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        closeCakeModal();
      }
    });

    modal.addEventListener("close", function () {
      body.classList.remove("modal-open");
    });

    // Delegate clicks on all cake cards / triggers
    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-cake], .catalog-card, .product-card");
      if (!trigger) return;

      var cakeId = trigger.getAttribute("data-cake");
      if (!cakeId) {
        var id = trigger.id;
        if (id === "celebration") cakeId = "midnight-truffle";
        else if (id === "seasonal") cakeId = "berry-garden";
        else if (id === "pastries") cakeId = "butter-croissant";
        else {
          var h2 = select("h2, h3", trigger);
          if (h2) {
            var txt = h2.textContent.toLowerCase().trim();
            if (txt.indexOf("midnight") !== -1) cakeId = "midnight-truffle";
            else if (txt.indexOf("berry") !== -1) cakeId = "berry-garden";
            else if (txt.indexOf("lemon") !== -1) cakeId = "lemon-elderflower";
            else if (txt.indexOf("caramel") !== -1 || txt.indexOf("pecan") !== -1) cakeId = "salted-caramel-pecan";
            else if (txt.indexOf("velvet") !== -1) cakeId = "crimson-velvet";
            else if (txt.indexOf("pistachio") !== -1) cakeId = "pistachio-rose";
            else if (txt.indexOf("croissant") !== -1 || txt.indexOf("morning") !== -1) cakeId = "butter-croissant";
            else if (txt.indexOf("hazelnut") !== -1) cakeId = "hazelnut-tart";
            else if (txt.indexOf("dark orchard") !== -1) cakeId = "dark-orchard";
            else if (txt.indexOf("danish") !== -1 || txt.indexOf("orchard") !== -1) cakeId = "orchard-danish";
            else if (txt.indexOf("meadow") !== -1) cakeId = "wild-meadow";
            else if (txt.indexOf("quiet") !== -1) cakeId = "quiet-bloom";
          }
        }
      }

      if (cakeId && CAKE_CATALOG[cakeId]) {
        event.preventDefault();
        openCakeModal(cakeId, trigger);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      var trigger = event.target.closest("[data-cake], .catalog-card, .product-card");
      if (!trigger || trigger.tagName === "INPUT" || trigger.tagName === "TEXTAREA" || trigger.tagName === "BUTTON") return;

      var cakeId = trigger.getAttribute("data-cake");
      if (!cakeId) {
        var id = trigger.id;
        if (id === "celebration") cakeId = "midnight-truffle";
        else if (id === "seasonal") cakeId = "berry-garden";
        else if (id === "pastries") cakeId = "butter-croissant";
      }

      if (cakeId && CAKE_CATALOG[cakeId]) {
        event.preventDefault();
        openCakeModal(cakeId, trigger);
      }
    });

    // Check URL parameters and hash on load
    var urlParams = new URLSearchParams(window.location.search);
    var cakeParam = urlParams.get("cake") || urlParams.get("item");
    var hash = window.location.hash ? window.location.hash.replace("#", "") : "";

    if (cakeParam && CAKE_CATALOG[cakeParam]) {
      openCakeModal(cakeParam);
    } else if (hash) {
      if (hash === "celebration" && CAKE_CATALOG["midnight-truffle"]) {
        openCakeModal("midnight-truffle");
      } else if (hash === "seasonal" && CAKE_CATALOG["berry-garden"]) {
        openCakeModal("berry-garden");
      } else if (hash === "pastries" && CAKE_CATALOG["butter-croissant"]) {
        openCakeModal("butter-croissant");
      } else if (CAKE_CATALOG[hash]) {
        openCakeModal(hash);
      }
    }
  }

  /* ==========================================
     Kitchen Journal Data & Popup Modal
     ========================================== */
  var JOURNAL_CATALOG = {
    "strawberries": {
      id: "strawberries",
      name: "The brief season for strawberries",
      category: "Seasonal Baking",
      readTime: "4 min read",
      date: "August 2026",
      author: "Ananya Rao · Head Pastry Chef",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=82",
      imageAlt: "Strawberries and cream layer cake",
      lead: "Why the sweetest local Mahabaleshwar strawberries change the entire architecture of how we bake and assemble a celebration layer cake.",
      content: [
        "<h3>The Fleeting Window of Peak Sweetness</h3>",
        "<p>For six fleeting weeks each year, fresh strawberries arrive at our kitchen door early in the morning, fragrant enough to scent the whole room before the crates are even opened. Unlike cold-stored commercial berries bred to survive long journeys, ripe local fruit is delicate, packed with natural pectin, and bursting with vibrant acidity.</p>",
        "<h3>Rethinking the Sponge Architecture</h3>",
        "<p>A standard dense butter cake absorbs fresh berry juice too aggressively, making the crumb soggy within hours. To let the strawberries shine without compromising structural integrity, we bake an ultra-light vanilla chiffon sponge. It holds its bounce while drinking in just enough macerated strawberry reduction.</p>",
        "<h3>Whipped Mascarpone Over Heavy Buttercream</h3>",
        "<p>Heavy buttercreams can coat the tongue and mute delicate fruit notes. We pair local berries with cold-whipped Italian mascarpone, Madagascar vanilla bean paste, and a whisper of lemon zest. The result is refreshing, airy, and tastes like late-morning sunshine.</p>"
      ],
      tags: ["Seasonal", "Strawberries", "Baking Science", "Summer Menu"],
      ctaText: "Explore our seasonal signature cakes",
      ctaLink: "products.html"
    },
    "cake-tasting": {
      id: "cake-tasting",
      name: "How to plan a cake tasting",
      category: "Celebration Guide",
      readTime: "5 min read",
      date: "July 2026",
      author: "Devika Sen · Studio Director",
      image: "https://images.unsplash.com/photo-1542691457-cbe4df041eb2?auto=format&fit=crop&w=1200&q=82",
      imageAlt: "Wedding cake tasting plates with sample slices",
      lead: "Six useful questions and one important permission: you do not have to choose traditional vanilla for your big day.",
      content: [
        "<h3>1. Arrive with Fresh Palates</h3>",
        "<p>We recommend booking tasting appointments in the late morning when your palate is at its most perceptive. We serve mild mineral water and warm herbal infusions between samples so each distinct flavour profile remains crisp and memorable.</p>",
        "<h3>2. Tier Harmony Over Uniformity</h3>",
        "<p>For multi-tiered occasion cakes, you don't need every tier to taste the same. A popular pairing is a rich, grounding base like our Midnight Truffle or Salted Caramel Pecan, topped with a brighter, floral tier like Pistachio Rose or Lemon Elderflower.</p>",
        "<h3>3. Consider Weather & Event Flow</h3>",
        "<p>An afternoon garden reception under the Bengaluru sun calls for sturdy, stable finishes like Italian meringue buttercream or dark chocolate ganache, while indoor climate-controlled evening banquets welcome airy chantilly and fresh floral crowns.</p>",
        "<h3>4. The Ultimate Rule</h3>",
        "<p>Choose the flavours that bring you genuine joy. When hosts choose cakes they truly love eating, guests invariably notice the personal authenticity in every bite.</p>"
      ],
      tags: ["Weddings", "Tasting Guide", "Custom Cakes", "Planning"],
      ctaText: "Book a custom cake consultation",
      ctaLink: "custom-orders.html"
    },
    "colour-palette": {
      id: "colour-palette",
      name: "A colour palette you can taste",
      category: "Design & Aesthetics",
      readTime: "3 min read",
      date: "July 2026",
      author: "Maya Shenoy · Cake Designer",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=82",
      imageAlt: "Artisanal dessert decorated with seasonal botanicals",
      lead: "Connecting edible flowers, dehydrated fruits, and natural pigment frosting without making everything match rigidly.",
      content: [
        "<h3>Nature Never Clashes</h3>",
        "<p>We deliberately avoid artificial neon food colorings. Our entire studio color spectrum is derived from freeze-dried raspberry powder, wild blueberry reductions, roasted pistachio meal, matcha, and organic golden turmeric.</p>",
        "<h3>Layering Textures for Depth</h3>",
        "<p>A cake feels visually rich when contrasting finishes interact: velvet matte buttercream, glossy fruit gels, delicate spun sugar, and hand-pressed organic edible botanicals (pansies, borage blossoms, and cornflowers).</p>",
        "<h3>Harmonising with Your Table</h3>",
        "<p>Instead of matching your table linens verbatim, aim for complementary undertones. A soft terracotta linen pairs exquisitely with a cake featuring deep berry undertones and warm ivory buttercream.</p>"
      ],
      tags: ["Botanicals", "Natural Dyes", "Cake Design", "Styling"],
      ctaText: "View custom design possibilities",
      ctaLink: "custom-orders.html"
    },
    "slow-dough": {
      id: "slow-dough",
      name: "What slow dough gives back",
      category: "Behind the Scenes",
      readTime: "4 min read",
      date: "June 2026",
      author: "Kabir Verma · Master Baker",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=82",
      imageAlt: "Baker shaping dough on a flour-dusted marble counter",
      lead: "The quiet 36-hour cold fermentation behind the first golden, flaky layers of the morning counter.",
      content: [
        "<h3>The 3:00 AM Bakery Rhythm</h3>",
        "<p>Long before our front doors unlock and Indiranagar wakes up, the bakery ovens are glowing. Our viennoiserie pastry dough undergoes a slow, controlled 36-hour cold ferment in temperature-regulated proofing chambers.</p>",
        "<h3>Why Time Equals Flavor</h3>",
        "<p>Patience allows natural enzymes to break down complex wheat starches into simple, easily digestible sugars. This is what creates that distinct caramelized aroma, subtle lactic tang, and deeply shatter-crisp honeycomb interior.</p>",
        "<h3>Lamination Precision at 16°C</h3>",
        "<p>Folding cultured butter into 27 micro-layers requires relentless temperature discipline. If the kitchen warms by just two degrees, the butter melts into the dough; if it is too cold, the sheets shatter. Precision is our craft.</p>"
      ],
      tags: ["Sourdough", "Croissants", "Fermentation", "Bakery Life"],
      ctaText: "Browse freshly baked counter pastries",
      ctaLink: "products.html"
    },
    "childs-sketch": {
      id: "childs-sketch",
      name: "Turning a child's sketch into cake",
      category: "Custom Celebrations",
      readTime: "4 min read",
      date: "May 2026",
      author: "Devika Sen & Cake Art Team",
      image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=82",
      imageAlt: "Colourful bespoke sculpted birthday cake",
      lead: "Keeping the charming wobble, playful proportions, and vivid imagination while making the sculpture structural and delicious.",
      content: [
        "<h3>The Crayon Drawing Brief</h3>",
        "<p>Six-year-old Kabir brought us a hand-drawn sketch on folded butcher paper: a friendly astronaut dinosaur holding a strawberry on the moon surrounded by smiling stars.</p>",
        "<h3>Preserving Spontaneous Charm</h3>",
        "<p>The easiest mistake in custom cake design is over-smoothing a child's drawing into a rigid, corporate cartoon. We deliberately replicate the hand-drawn proportions, joyful tilted smile, and whimsical color palette in sculpted dark chocolate modelling paste.</p>",
        "<h3>A Core of Delicious Cake</h3>",
        "<p>Underneath the food-grade structural armature, every tier is real cake—our signature Crimson Velvet with organic cream cheese frosting and a dark chocolate ganache collar that withstands the celebration without drooping.</p>",
        "<h3>The Unforgettable Reveal</h3>",
        "<p>Seeing a child's eyes light up when their own two-dimensional drawing comes to life in delicious 3D on the party table is the greatest privilege of our work.</p>"
      ],
      tags: ["Kids Birthdays", "Sculpted Cakes", "Storytelling", "Custom Art"],
      ctaText: "Plan a custom celebration cake",
      ctaLink: "custom-orders.html"
    },
    "office-gift": {
      id: "office-gift",
      name: "The generous office gift",
      category: "Corporate & Gifting",
      readTime: "3 min read",
      date: "April 2026",
      author: "Ananya Rao · Gifting Lead",
      image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&w=1200&q=82",
      imageAlt: "Artisanal bakery gift box tied with natural fabric ribbon",
      lead: "How to send something deeply personal, artisanal, and memorable when your recipient list spans dozens of tables.",
      content: [
        "<h3>Moving Beyond Mass-Produced Hampers</h3>",
        "<p>Standard corporate gift baskets filled with packaged store-bought snacks often end up forgotten in breakrooms. Handcrafted bakes, packed warm into eco-friendly kraft boxes with custom wax seals, communicate genuine appreciation and hospitality.</p>",
        "<h3>Dietary Thoughtfulness by Design</h3>",
        "<p>A great corporate celebration includes everyone. Every Oven & Bloom gift hamper is curated with clearly labeled, exquisitely flavored eggless, nut-conscious, and vegan artisanal pastries that compromise nothing in decadence.</p>",
        "<h3>Seamless Temperature-Controlled Logistics</h3>",
        "<p>We coordinate dedicated, refrigerated couriers to ensure timed deliveries across Bengaluru's tech corridors, delivering crisp viennoiserie, delicate tea cakes, and signature confectionery in pristine condition.</p>"
      ],
      tags: ["Corporate Gifting", "Hampers", "Bengaluru Delivery", "Celebrations"],
      ctaText: "Request a corporate gifting quote",
      ctaLink: "custom-orders.html"
    }
  };

  function initializeJournalModal() {
    var modal = select("#journal-detail-modal");
    if (!modal) return;

    var closeButtons = selectAll("[data-journal-modal-close]", modal);
    var modalMedia = select("[data-journal-modal-media]", modal);
    var modalTags = select("[data-journal-modal-tags]", modal);
    var modalTitle = select("[data-journal-modal-title]", modal);
    var modalAuthor = select("[data-journal-modal-author]", modal);
    var modalDate = select("[data-journal-modal-date]", modal);
    var modalReadTime = select("[data-journal-modal-readtime]", modal);
    var modalLead = select("[data-journal-modal-lead]", modal);
    var modalContent = select("[data-journal-modal-content]", modal);
    var modalBottomTags = select("[data-journal-modal-bottom-tags]", modal);
    var modalCta = select("[data-journal-modal-cta]", modal);

    var lastFocusedElement = null;

    function openJournalModal(journalId, triggerElement) {
      var data = JOURNAL_CATALOG[journalId];
      if (!data) return;

      lastFocusedElement = triggerElement || document.activeElement;

      var currentImg = triggerElement ? select("img", triggerElement) : null;
      var currentSrc = currentImg ? currentImg.getAttribute("src") : data.image;

      if (modalMedia) {
        modalMedia.innerHTML = '<img src="' + currentSrc + '" alt="' + data.imageAlt + '" loading="eager" />';
      }
      if (modalTags) {
        modalTags.innerHTML =
          '<span class="cake-modal__tag cake-modal__tag--accent">' + data.category + '</span>' +
          '<span class="cake-modal__tag">' + data.readTime + '</span>';
      }
      if (modalTitle) modalTitle.textContent = data.name;
      if (modalAuthor) modalAuthor.innerHTML = '<i class="ph ph-user" aria-hidden="true"></i> ' + data.author;
      if (modalDate) modalDate.innerHTML = '<i class="ph ph-calendar-blank" aria-hidden="true"></i> ' + data.date;
      if (modalReadTime) modalReadTime.innerHTML = '<i class="ph ph-clock" aria-hidden="true"></i> ' + data.readTime;
      if (modalLead) modalLead.textContent = data.lead;
      if (modalContent) modalContent.innerHTML = data.content.join("");
      if (modalBottomTags) {
        modalBottomTags.innerHTML = data.tags
          .map(function (tag) {
            return '<span class="journal-modal__bottom-tag">' + tag + '</span>';
          })
          .join("");
      }
      if (modalCta) {
        modalCta.setAttribute("href", data.ctaLink);
        modalCta.innerHTML = data.ctaText + ' <i class="ph ph-arrow-right" aria-hidden="true"></i>';
      }

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
      body.classList.add("modal-open");
      if (closeButtons.length > 0) {
        closeButtons[0].focus();
      }
    }

    function closeJournalModal() {
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
      body.classList.remove("modal-open");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }

    closeButtons.forEach(function (btn) {
      btn.addEventListener("click", closeJournalModal);
    });

    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-journal-modal-close]")) {
        closeJournalModal();
        return;
      }
      var rect = modal.getBoundingClientRect();
      var isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        closeJournalModal();
      }
    });

    modal.addEventListener("close", function () {
      body.classList.remove("modal-open");
    });

    // Delegate clicks on all journal cards / triggers
    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-journal], [data-journal-trigger], .journal-card");
      if (!trigger) return;

      var journalId =
        trigger.getAttribute("data-journal") ||
        trigger.getAttribute("data-journal-trigger");

      if (!journalId) {
        var card = trigger.closest(".journal-card");
        if (card) {
          journalId = card.getAttribute("data-journal");
          if (!journalId) {
            var h2 = select("h2", card);
            if (h2) {
              var txt = h2.textContent.toLowerCase().trim();
              if (txt.indexOf("strawberries") !== -1) journalId = "strawberries";
              else if (txt.indexOf("tasting") !== -1) journalId = "cake-tasting";
              else if (txt.indexOf("colour") !== -1 || txt.indexOf("palette") !== -1) journalId = "colour-palette";
              else if (txt.indexOf("slow dough") !== -1 || txt.indexOf("dough") !== -1) journalId = "slow-dough";
              else if (txt.indexOf("sketch") !== -1 || txt.indexOf("child") !== -1) journalId = "childs-sketch";
              else if (txt.indexOf("office") !== -1 || txt.indexOf("gift") !== -1) journalId = "office-gift";
            }
          }
        }
      }

      if (journalId && JOURNAL_CATALOG[journalId]) {
        event.preventDefault();
        openJournalModal(journalId, trigger);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      var trigger = event.target.closest("[data-journal], [data-journal-trigger], .journal-card");
      if (!trigger || trigger.tagName === "INPUT" || trigger.tagName === "TEXTAREA" || trigger.tagName === "BUTTON") return;

      var journalId =
        trigger.getAttribute("data-journal") ||
        trigger.getAttribute("data-journal-trigger");

      if (journalId && JOURNAL_CATALOG[journalId]) {
        event.preventDefault();
        openJournalModal(journalId, trigger);
      }
    });

    // Check URL parameters on load
    var urlParams = new URLSearchParams(window.location.search);
    var articleParam = urlParams.get("article") || urlParams.get("journal");
    if (articleParam && JOURNAL_CATALOG[articleParam]) {
      openJournalModal(articleParam);
    }
  }

  function initializeYear() {
    selectAll("[data-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  }

  function initialize() {
    initializeTheme();
    initializeDirection();
    initializeNavigation();
    initializeControls();
    initializeProductFilters();
    initializeForms();
    initializeCarousel();
    initializePostcodeChecker();
    initializePricingCalculator();
    initializeLiveOrderSummary();
    initializeCakeModal();
    initializeJournalModal();
    initializeYear();
    splitRevealCopy();
    initializeGsap();

    window.setTimeout(function () {
      body.classList.add("is-loaded");
    }, 60);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
