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
