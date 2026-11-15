/* ==========================================================================
   Manar Al-Khaleej Advertising Agency (وكالة منار الخليج للدعاية والإعلان)
   Site interactions: navigation, reveal animations, gallery, lightbox,
   quote form (WhatsApp), scroll UI.
   ========================================================================== */
(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  const $ = (selector, scope = doc) => scope.querySelector(selector);
  const $$ = (selector, scope = doc) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* Header state + scroll progress                                      */
  /* ------------------------------------------------------------------ */
  const header = $("#site-header");
  const progress = $(".scroll-progress span");
  const toTop = $(".to-top");

  let ticking = false;

  function onScrollFrame() {
    const y = window.scrollY || window.pageYOffset;
    const height = doc.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 620);
    if (progress) {
      const ratio = height > 0 ? Math.min(1, Math.max(0, y / height)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
    ticking = false;
  }

  function requestScrollUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  onScrollFrame();

  if (progress) progress.style.transformOrigin = "right center";

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Mobile navigation                                                   */
  /* ------------------------------------------------------------------ */
  const navToggle = $(".nav-toggle");
  const mobileNav = $("#mobile-nav");
  const navBackdrop = $(".nav-backdrop");
  const navClose = $(".mobile-nav__close");
  let lastFocused = null;

  const isMenuOpen = () => body.classList.contains("menu-open");

  function openMenu() {
    if (!mobileNav || !navToggle) return;
    lastFocused = doc.activeElement;
    body.classList.add("menu-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "إغلاق القائمة");
    mobileNav.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      if (navClose) navClose.focus();
    }, 120);
  }

  function closeMenu(restoreFocus = true) {
    if (!mobileNav || !navToggle) return;
    body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "فتح القائمة");
    mobileNav.setAttribute("aria-hidden", "true");
    if (restoreFocus && lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (isMenuOpen()) closeMenu();
      else openMenu();
    });
  }

  $$("[data-nav-close]").forEach((el) => {
    el.addEventListener("click", () => closeMenu());
  });

  if (mobileNav) {
    mobileNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu(false);
    });
  }

  if (navBackdrop) navBackdrop.addEventListener("click", () => closeMenu());

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      event.preventDefault();
      closeMenu();
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 901px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && isMenuOpen()) closeMenu(false);
  });

  /* Close submenu dropdown with Escape for keyboard users */
  doc.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const focused = doc.activeElement;
    if (focused && focused.closest(".has-dropdown")) focused.blur();
  });

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                    */
  /* ------------------------------------------------------------------ */
  const revealItems = $$(".reveal");

  if (!revealItems.length) {
    /* nothing to animate */
  } else if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    revealItems.forEach((el) => {
      /* Content already inside the first viewport appears without delay. */
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Gallery filters                                                     */
  /* ------------------------------------------------------------------ */
  $$(".filters").forEach((group) => {
    const wrap = group.closest(".gallery-wrap") || group.parentElement;
    const gallery = wrap ? $("[data-gallery]", wrap) : null;
    if (!gallery) return;

    const cards = $$(".project-card", gallery);
    const empty = $("[data-gallery-empty]", wrap);
    const buttons = $$(".filter", group);

    function applyFilter(value) {
      let shown = 0;

      cards.forEach((card) => {
        const match = value === "all" || card.dataset.category === value;
        card.classList.toggle("is-hidden", !match);
        if (match) shown += 1;
      });

      buttons.forEach((button) => {
        const active = button.dataset.filter === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      if (empty) empty.hidden = shown !== 0;
      gallery.setAttribute("data-active-filter", value);
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
    });
  });

  /* ------------------------------------------------------------------ */
  /* Lightbox                                                            */
  /* ------------------------------------------------------------------ */
  const lightbox = $("#lightbox");

  if (lightbox) {
    const image = $(".lightbox__figure img", lightbox);
    const titleEl = $("[data-lightbox-title]", lightbox);
    const captionEl = $("[data-lightbox-caption]", lightbox);
    const closeBtn = $("[data-lightbox-close]", lightbox);
    const prevBtn = $("[data-lightbox-prev]", lightbox);
    const nextBtn = $("[data-lightbox-next]", lightbox);

    let triggers = [];
    let index = 0;
    let opener = null;

    function collectTriggers() {
      triggers = $$("[data-lightbox]").filter((el) => !el.closest(".is-hidden"));
    }

    function render() {
      const trigger = triggers[index];
      if (!trigger || !image) return;

      const thumb = $("img", trigger);
      image.src = trigger.dataset.src || (thumb ? thumb.currentSrc || thumb.src : "");
      image.alt = thumb ? thumb.alt : "";
      if (titleEl) titleEl.textContent = trigger.dataset.title || "";
      if (captionEl) {
        const caption = trigger.dataset.caption || "";
        captionEl.textContent = triggers.length > 1
          ? `${caption}${caption ? " — " : ""}${index + 1} من ${triggers.length}`
          : caption;
      }

      const multiple = triggers.length > 1;
      if (prevBtn) prevBtn.hidden = !multiple;
      if (nextBtn) nextBtn.hidden = !multiple;
    }

    function openLightbox(trigger) {
      collectTriggers();
      index = Math.max(0, triggers.indexOf(trigger));
      opener = trigger;
      render();
      body.classList.add("lightbox-open");
      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
      }
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      body.classList.remove("lightbox-open");
      if (typeof lightbox.close === "function" && lightbox.open) {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
      }
      if (opener && typeof opener.focus === "function") opener.focus();
      opener = null;
    }

    function step(direction) {
      if (triggers.length < 2) return;
      index = (index + direction + triggers.length) % triggers.length;
      render();
    }

    doc.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox]");
      if (!trigger) return;
      event.preventDefault();
      openLightbox(trigger);
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", () => step(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => step(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("close", () => {
      body.classList.remove("lightbox-open");
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        /* RTL: left arrow moves forward in the gallery. */
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(-1);
      }
    });

    /* Basic swipe support on touch devices */
    let touchStartX = null;
    lightbox.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length === 1) touchStartX = event.touches[0].clientX;
      },
      { passive: true }
    );
    lightbox.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(delta) > 45) step(delta > 0 ? 1 : -1);
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------ */
  /* Quote form → WhatsApp                                               */
  /* ------------------------------------------------------------------ */
  const whatsappNumber = (body.dataset.whatsapp || "").replace(/\D/g, "");

  function fieldWrap(field) {
    return field.closest(".field") || field.parentElement;
  }

  function setInvalid(field, invalid) {
    const wrap = fieldWrap(field);
    if (wrap) wrap.classList.toggle("is-invalid", invalid);
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  $$("[data-quote-form]").forEach((form) => {
    const status = $("[data-form-status]", form);
    const fields = {
      name: form.elements.namedItem("name"),
      phone: form.elements.namedItem("phone"),
      service: form.elements.namedItem("service"),
      city: form.elements.namedItem("city"),
      details: form.elements.namedItem("details"),
      consent: form.elements.namedItem("consent"),
    };

    function showStatus(message, isError) {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    }

    function validate() {
      const invalid = [];

      Object.entries(fields).forEach(([key, field]) => {
        if (!field) return;
        let bad = false;

        if (key === "consent") {
          bad = !field.checked;
        } else if (key === "details") {
          bad = false;
        } else if (key === "phone") {
          const digits = field.value.replace(/\D/g, "");
          bad = !/^(?:966)?0?5\d{8}$/.test(digits);
        } else if (key === "service") {
          bad = !field.value;
        } else {
          bad = field.value.trim().length < 2;
        }

        setInvalid(field, bad);
        if (bad) invalid.push(field);
      });

      if (invalid.length) {
        showStatus("يرجى تعبئة الحقول المطلوبة بشكل صحيح قبل الإرسال.", true);
        invalid[0].focus({ preventScroll: false });
        return false;
      }

      showStatus("", false);
      return true;
    }

    Object.values(fields).forEach((field) => {
      if (!field) return;
      const eventName = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";
      field.addEventListener(eventName, () => {
        if (fieldWrap(field)?.classList.contains("is-invalid")) setInvalid(field, false);
        if (status && status.textContent) showStatus("", false);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate()) return;

      if (!whatsappNumber) {
        showStatus("رقم واتساب غير مهيأ على الموقع. يرجى استخدام الهاتف أو البريد للتواصل.", true);
        return;
      }

      const lines = [
        "السلام عليكم، أرغب بطلب عرض سعر.",
        "",
        `الاسم: ${fields.name.value.trim()}`,
        `رقم الجوال: ${fields.phone.value.trim()}`,
        `الخدمة: ${fields.service.value}`,
        `المدينة: ${fields.city.value.trim()}`,
      ];

      const details = fields.details ? fields.details.value.trim() : "";
      if (details) lines.push(`تفاصيل المشروع: ${details}`);

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
      const opened = window.open(url, "_blank", "noopener");

      if (opened) {
        showStatus("تم فتح واتساب برسالة جاهزة. أرسل الرسالة وسنرد عليك في أقرب وقت.", false);
      } else {
        showStatus("تعذر فتح واتساب تلقائيًا. اسمح بالنوافذ المنبثقة أو تواصل معنا عبر الهاتف.", true);
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* Misc                                                               */
  /* ------------------------------------------------------------------ */
  $$("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
