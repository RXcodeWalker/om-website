// js/scroll.js
const faders = document.querySelectorAll(".fade-in");
if (faders && faders.length) {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(el => obs.observe(el));
}
