(() => {
  const setError = (field, message = "") => {
    const container = field.closest(".field");
    const error = container?.querySelector(".error");
    if (error) {
      error.textContent = message;
    }
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validate = (field) => {
    let message = "";
    const value = field.value.trim();

    if (field.required && field.type === "checkbox" && !field.checked) {
      message = "Please confirm before continuing.";
    } else if (field.required && !value) {
      message = "This field is required.";
    } else if (
      field.type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      message = "Enter a valid work email address.";
    } else if (
      field.dataset.minlength &&
      value.length < Number(field.dataset.minlength)
    ) {
      message = `Use at least ${field.dataset.minlength} characters.`;
    } else if (field.dataset.match) {
      const match = document.querySelector(field.dataset.match);
      if (match && field.value !== match.value) {
        message = "Passwords do not match.";
      }
    }

    setError(field, message);
    return !message;
  };

  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => validate(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
          validate(field);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = [...form.querySelectorAll("input, select, textarea")];
      const valid = fields.every(validate);
      if (!valid) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      const target = form.dataset.successTarget;
      if (target) {
        location.href = target;
        return;
      }

      const successBox = form.querySelector(".form-success");
      if (successBox) {
        successBox.classList.add("show");
        form.reset();
        setTimeout(() => {
          successBox.classList.remove("show");
        }, 6000);
      }
    });
  });

  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(button.dataset.passwordToggle);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      button.innerHTML = `<i data-lucide="${input.type === "password" ? "eye" : "eye-off"}"></i>`;
      button.setAttribute(
        "aria-label",
        input.type === "password" ? "Show password" : "Hide password",
      );
      if (window.lucide?.createIcons) {
        window.lucide.createIcons({
          attrs: { "aria-hidden": "true", "stroke-width": 1.8 },
        });
      }
    });
  });

  const passwordInput = document.querySelector("[data-password-strength]");
  passwordInput?.addEventListener("input", () => {
    const value = passwordInput.value;
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d|[^A-Za-z0-9]/.test(value)) score++;
    const meter = document.querySelector(".password-meter span");
    if (meter) {
      if (!value) {
        meter.className = "";
        meter.style.width = "0%";
      } else if (score >= 3) {
        meter.className = "strong";
        meter.style.width = "100%";
      } else if (score === 2) {
        meter.className = "medium";
        meter.style.width = "65%";
      } else {
        meter.className = "";
        meter.style.width = "32%";
      }
    }
  });
})();

