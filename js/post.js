// js/post.js
console.log("post.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const rawId = params.get("id");
  const id = rawId === null ? null : Number(rawId);

  const container = document.getElementById("post-content");
  if (!container) {
    console.warn("No #post-content element on this page — post.js stopped.");
    return;
  }

  try {
    const res = await fetch("data/blog.json");
    if (!res.ok) throw new Error("Failed to fetch blog.json");
    const posts = await res.json();

    if (id === null || Number.isNaN(id) || id < 0 || id >= posts.length) {
      container.innerHTML = "<h2>Post not found.</h2>";
      return;
    }

    const post = posts[id];

    // Break content into paragraphs on double newlines and render cleanly
    const paragraphs = (post.content || "").split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    const formattedContent = paragraphs.map(paragraph => {
      // treat a few exact strings as headings
      if (["PROS:", "NEGATIVES:", "SECOND HALF"].includes(paragraph)) {
        return `<h2>${paragraph}</h2>`;
      }
      // naive paragraph -> escape minimal HTML
      const safe = paragraph.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<p>${safe}</p>`;
    }).join("");

    container.innerHTML = `
      <h1>${post.title || ""}</h1>
      <div class="post-meta"><span>${post.category || ""}</span> · <span>${post.date || ""}</span></div>
      ${formattedContent}
    `;

  } catch (err) {
    console.error("Error loading post:", err);
    container.innerHTML = "<h2>Unable to load post.</h2>";
  }
});
