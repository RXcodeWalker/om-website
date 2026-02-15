// js/blog.js
// Robust loader + filtering for blog listing

console.log("Blog script loaded");

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]));
}

async function loadBlog() {
  try {
    const res = await fetch("data/blog.json");
    if (!res.ok) throw new Error("Network response was not ok");
    const posts = await res.json();

    const postList = document.getElementById("post-list");
    if (!postList) {
      console.warn("No #post-list element on this page — blog.js will stop.");
      return;
    }

    postList.innerHTML = ""; // clear

    // Render cards
    posts.forEach((post, index) => {
      const article = document.createElement("article");
      article.className = "post-card glass"; // uses CSS glass style
      // set data-category for filtering (normalized)
      const categoryNormalized = (post.category || "Uncategorized").trim();
      article.dataset.category = categoryNormalized;

      // build inner HTML
      article.innerHTML = `
        <h2>${escapeHtml(post.title)}</h2>

        <div class="post-meta">
          <span>${escapeHtml(categoryNormalized)}</span> · <span>${escapeHtml(post.date || "")}</span>
        </div>

        <p>${escapeHtml(post.excerpt || "").slice(0, 400)}</p>

        <a href="post.html?id=${index}" class="read-more magnetic">
          Read more →
        </a>
      `;

      postList.appendChild(article);
    });

    // Initialize filtering (after render)
    initFilters();

  } catch (err) {
    console.error("Error loading blog posts:", err);
  }
}

function initFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!filterButtons || filterButtons.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // safely remove active from any
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.filter; // e.g. "all" or "Football"
      const cards = document.querySelectorAll(".post-card");

      cards.forEach(card => {
        const cardCategory = card.dataset.category || "";
        if (category === "all" || cardCategory === category) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Ensure "all" is applied initially: show all cards
  const active = document.querySelector(".filter-btn.active");
  if (!active) {
    const first = document.querySelector(".filter-btn");
    if (first) first.classList.add("active");
  } else {
    // simulate click to apply filter
    active.click();
  }
}

// start
document.addEventListener("DOMContentLoaded", () => {
  loadBlog();
});
