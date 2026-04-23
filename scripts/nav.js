export function initNav() {
  const nav = document.getElementById("mainNav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", scrollY > 50);
    });
  }

  const overlays = Array.from(document.querySelectorAll("[data-nav-overlay]"));
  if (overlays.length === 0) return;

  let activeMenu = null;
  let lockedScrollY = 0;

  const focusSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const unlockScroll = ({ restoreScroll = true } = {}) => {
    document.documentElement.classList.remove("nav-overlay-open");
    document.body.classList.remove("nav-overlay-open");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("width");
    if (restoreScroll) {
      window.scrollTo(0, lockedScrollY);
    }
  };

  const lockScroll = () => {
    lockedScrollY = window.scrollY;
    document.documentElement.classList.add("nav-overlay-open");
    document.body.classList.add("nav-overlay-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = "100%";
  };

  const getFocusable = overlay =>
    Array.from(overlay.querySelectorAll(focusSelector)).filter(el => !el.hasAttribute("hidden"));

  const closeMenu = (menu = activeMenu, { restoreFocus = true, restoreScroll = true } = {}) => {
    if (!menu) return;

    menu.toggle.classList.remove("is-open");
    menu.toggle.setAttribute("aria-expanded", "false");
    menu.toggle.setAttribute("aria-label", "Open menu");
    menu.overlay.classList.remove("is-open");
    menu.overlay.setAttribute("aria-hidden", "true");
    unlockScroll({ restoreScroll });

    if (restoreFocus) {
      menu.toggle.focus();
    }

    activeMenu = null;
  };

  const openMenu = menu => {
    if (window.innerWidth > 1024) return;
    if (activeMenu && activeMenu !== menu) {
      closeMenu(activeMenu, { restoreFocus: false });
    }

    menu.toggle.classList.add("is-open");
    menu.toggle.setAttribute("aria-expanded", "true");
    menu.toggle.setAttribute("aria-label", "Close menu");
    menu.overlay.classList.add("is-open");
    menu.overlay.setAttribute("aria-hidden", "false");
    lockScroll();
    activeMenu = menu;

    const focusables = getFocusable(menu.overlay);
    const initial = menu.overlay.querySelector("[data-nav-initial-focus]") || focusables[0];
    window.setTimeout(() => {
      const panel = menu.overlay.querySelector(".nav-overlay-panel");
      if (panel) panel.scrollTop = 0;
      initial?.focus({ preventScroll: true });
    }, 120);
  };

  const toggleMenu = menu => {
    if (activeMenu === menu) {
      closeMenu(menu);
      return;
    }

    openMenu(menu);
  };

  overlays.forEach(overlay => {
    const toggle = document.querySelector(`[aria-controls="${overlay.id}"][data-nav-toggle]`);
    if (!(toggle instanceof HTMLButtonElement)) return;

    const menu = { overlay, toggle };

    toggle.addEventListener("click", () => toggleMenu(menu));

    overlay.addEventListener("click", event => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.closest("[data-nav-close]") || target === overlay) {
        closeMenu(menu);
      }
    });

    overlay.querySelectorAll("[data-nav-autoclose]").forEach(el => {
      el.addEventListener("click", event => {
        const href = el.getAttribute("href");

        if (href?.startsWith("#")) {
          event.preventDefault();
        }

        window.setTimeout(() => {
          closeMenu(menu, { restoreFocus: false, restoreScroll: false });

          if (href?.startsWith("#")) {
            const targetSection = document.querySelector(href);
            if (targetSection instanceof HTMLElement) {
              history.replaceState(null, "", href);
              window.requestAnimationFrame(() => {
                targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
              });
            }
          }
        }, 0);
      });
    });
  });

  document.addEventListener("keydown", event => {
    if (!activeMenu) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(activeMenu);
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = getFocusable(activeMenu.overlay);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const current = document.activeElement;

    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && activeMenu) {
      closeMenu(activeMenu, { restoreFocus: false });
    }
  });
}
