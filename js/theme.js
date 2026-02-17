// js/theme.js
// Handles: theme toggle, palette buttons, theme panel toggle, nav active, transitions, hero collapse, magnetic, progress bar, typing
console.log("Theme script loaded");

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- THEME TOGGLE ---------- */
  const toggleButton = document.getElementById("theme-toggle");
  if (toggleButton) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      toggleButton.textContent = savedTheme === "dark" ? "☀️" : "🌙";
    }

    toggleButton.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      toggleButton.textContent = next === "dark" ? "☀️" : "🌙";
    });
  }

  /* ---------- PALETTES ---------- */
  const paletteButtons = document.querySelectorAll(".palette-btn");
  const savedPalette = localStorage.getItem("palette");
  if (savedPalette) document.documentElement.setAttribute("data-palette", savedPalette);

  paletteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const p = button.dataset.palette;
      if (!p) return;
      document.documentElement.setAttribute("data-palette", p);
      localStorage.setItem("palette", p);
    });
  });

  /* ---------- THEME PANEL TOGGLE ---------- */
  const panelToggle = document.getElementById("theme-panel-toggle");
  const sidebar = document.querySelector(".theme-sidebar");
  if (panelToggle && sidebar) {
    panelToggle.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
    });
  }

  /* ---------- NAV ACTIVE ---------- */
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href === currentPage) link.classList.add("active");
  });

  /* ---------- PAGE TRANSITIONS ---------- */
  document.body.classList.add("loaded");
  document.querySelectorAll("a").forEach(link => {
    try {
      if (link.hostname === window.location.hostname) {
        link.addEventListener("click", function(e) {
          const href = this.getAttribute("href");
          // allow anchors & javascript:void
          if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
          e.preventDefault();
          document.body.classList.remove("loaded");
          setTimeout(() => window.location.href = href, 280);
        });
      }
    } catch (e) { /* cross-origin links throw */ }
  });

  /* ---------- HERO AUTO COLLAPSE (safe) ---------- */
  const hero = document.getElementById("hero");
  if (hero) {
    let isCollapsed = false;
    let threshold = Math.max(200, hero.offsetHeight * 0.6);

    window.addEventListener("scroll", () => {
      const s = window.scrollY;
      if (!isCollapsed && s > threshold) {
        hero.classList.add("collapsed"); isCollapsed = true;
      } else if (isCollapsed && s <= 20) {
        hero.classList.remove("collapsed"); isCollapsed = false;
      }
    });
  }

  /* ---------- MAGNETIC (buttons / small UI) ---------- */
  const magneticElements = document.querySelectorAll(".magnetic");
  magneticElements.forEach(el => {
    el.style.transition = el.style.transition || "transform 0.18s ease";
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      // small multiplier
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener("mouseleave", () => el.style.transform = "translate(0,0)");
  });

  /* ---------- PROGRESS BAR (safe) ---------- */
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const top = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.round((top / docHeight) * 100) : 0;
      progressBar.style.width = pct + "%";
    });
  }

  /* ---------- TYPING HERO TITLE (safe) ---------- */
  const heroText = document.querySelector(".site-title");
  if (heroText && !heroText.dataset.typed) {
    const text = heroText.textContent.trim();
    heroText.textContent = "";
    heroText.classList.add("typing");
    heroText.dataset.typed = "true";
    let i = 0;
    (function type() {
      if (i < text.length) {
        heroText.textContent += text.charAt(i);
        i++;
        setTimeout(type, 40);
      } else {
        heroText.classList.remove("typing");
      }
    })();
  }

});

// sonoma style stuff
// Sonoma panels: pointer parallax + scroll micro-depth
// Drop into theme.js or a new sonoma.js and import it.
// Respects prefers-reduced-motion, uses requestAnimationFrame for smoothness.

(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panels = Array.from(document.querySelectorAll('.sonoma-panel'));
  if (!panels.length) return;

  // helper: clamp
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // pointer parallax
  panels.forEach(panel => {
    let rect = null;
    let tick = false;

    const state = { mx: 0, my: 0, tx: 0, ty: 0 };

    function updateRect() { rect = panel.getBoundingClientRect(); }

    // pointer handler (mouse)
    function onPointer(e) {
      if (reducedMotion) return;
      if (!rect) updateRect();
      const px = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)); // -1 .. 1
      const py = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)); // -1 .. 1

      state.mx = clamp(px, -1, 1);
      state.my = clamp(py, -1, 1);
      if (!tick) requestAnimationFrame(applyPointer);
      tick = true;
    }

    function applyPointer() {
      // pointer intensity and smoothing
      const intensity =  varOrDefault('--sonoma-pointer-intensity', 18);
      const ease = 0.12;

      // target transforms
      const tx = (state.mx * intensity * 0.35).toFixed(2) + 'px';
      const ty = (state.my * intensity * 0.18).toFixed(2) + 'px';

      // small tilt (degrees) -> applied in CSS using variables
      const pxVar = (state.mx * intensity * 0.25).toFixed(2) + 'px';
      const pyVar = (state.my * intensity * 0.25).toFixed(2) + 'px';

      panel.style.setProperty('--p-x', state.mx.toFixed(3));
      panel.style.setProperty('--p-y', state.my.toFixed(3));
      panel.style.setProperty('--t-x', tx);
      panel.style.setProperty('--t-y', ty);
      tick = false;
    }

    // scroll micro-depth
    function onScroll() {
      if (reducedMotion) return;
      if (!rect) updateRect();
      const viewportCenter = window.innerHeight / 2;
      const panelCenter = rect.top + rect.height / 2;
      const distance = panelCenter - viewportCenter;
      const normalized = clamp(distance / window.innerHeight, -1, 1); // -1..1
      // use CSS variable --scroll-offset to nudge panel
      const depthScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sonoma-depth-scale')) || 0.012;
      const offset = Math.round(normalized * 100 * depthScale * 100) / 100;
      panel.style.setProperty('--scroll-offset', offset);
    }

    // helper to read numeric CSS var or fallback
    function varOrDefault(name, fallback) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v ? parseFloat(v) : fallback;
    }

    // events
    panel.addEventListener('pointermove', onPointer, { passive: true });
    panel.addEventListener('pointerleave', () => {
      // reset
      panel.style.setProperty('--p-x', '0');
      panel.style.setProperty('--p-y', '0');
      panel.style.setProperty('--t-x', '0px');
      panel.style.setProperty('--t-y', '0px');
    }, { passive: true });

    // observe resize for accurate rects
    const ro = new ResizeObserver(() => updateRect());
    ro.observe(panel);

    // initial rect
    updateRect();
  });

  // throttle scroll updates with rAF
  let scrollTick = false;
  function scrollLoop() {
    panels.forEach(p => {
      const rect = p.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const panelCenter = rect.top + rect.height / 2;
      const distance = panelCenter - viewportCenter;
      const normalized = Math.max(-1, Math.min(1, distance / window.innerHeight));
      const depthScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sonoma-depth-scale')) || 0.012;
      const offset = Math.round(normalized * 100 * depthScale * 100) / 100;
      p.style.setProperty('--scroll-offset', offset);
    });
    scrollTick = false;
  }

  window.addEventListener('scroll', () => {
    if (reducedMotion) return;
    if (!scrollTick) {
      requestAnimationFrame(scrollLoop);
      scrollTick = true;
    }
  }, { passive: true });

  // run one initial update
  requestAnimationFrame(scrollLoop);
})();

const toggle = document.querySelector(".palette-toggle");
const panel = document.querySelector(".palette-panel");

toggle.addEventListener("click", () => {
  panel.classList.toggle("active");
});
