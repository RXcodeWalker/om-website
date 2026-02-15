# Om's Personal Website — README

## Quick start (local)
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (Ritwick Dey) or use `python -m http.server`.
3. Run Live Server from the project root (Open `1-home.html` with Live Server).
4. Visit `http://127.0.0.1:5500/1-home.html` (or the URL Live Server shows).

> You *must* run a local server. `fetch()` requests (used for `data/blog.json`) are blocked when opening files via `file:///`.

## Recommended folder structure
/project-root
/css
style.css
/js
theme.js
blog.js
post.js
scroll.js
transition.js
nav.js (optional)
magnetic.js (optional)
tilt.js (optional)
/data
blog.json
1-home.html
2-blog.html
3-projects.html
4-achievements.html
5-about.html
6-contact.html
README.md


## Script order & why it matters
Load scripts in this order at the bottom of pages:

1. `theme.js` — site-wide behavior (theme, palettes, hero collapse, wrapping utilities). Must come first because other scripts may rely on theme variables and event hooks it sets.
2. `scroll.js` — intersection observer for fade-in effects.
3. `blog.js` or `post.js` — page-specific content rendering. Load only on pages that need them.
4. `transition.js` — optional, handles page fade transitions (can come after content scripts).

**Note:** If you split `magnetic.js` or `tilt.js` out of `theme.js`, load them after `theme.js` but before page-specific scripts that depend on them.

## How to add a new blog post
1. Open `/data/blog.json`.
2. Add a new object:
```json
{
  "title": "My new post",
  "category": "Coding",
  "date": "Feb 2026",
  "excerpt": "Short summary...",
  "content": "Full post content with paragraphs separated by blank lines..."
}

## Script order & why it matters
Load scripts in this order at the bottom of pages:

1. `theme.js` — site-wide behavior (theme, palettes, hero collapse, wrapping utilities). Must come first because other scripts may rely on theme variables and event hooks it sets.
2. `scroll.js` — intersection observer for fade-in effects.
3. `blog.js` or `post.js` — page-specific content rendering. Load only on pages that need them.
4. `transition.js` — optional, handles page fade transitions (can come after content scripts).

**Note:** If you split `magnetic.js` or `tilt.js` out of `theme.js`, load them after `theme.js` but before page-specific scripts that depend on them.

## How to add a new blog post
1. Open `/data/blog.json`.
2. Add a new object:
```json
{
  "title": "My new post",
  "category": "Coding",
  "date": "Feb 2026",
  "excerpt": "Short summary...",
  "content": "Full post content with paragraphs separated by blank lines..."
}
3. Save. Open 2-blog.html — the new post will appear automatically.

Troubleshooting:
    fetch errors → ensure you're using Live Server / a local server.
    scroll.js 404 → confirm js/scroll.js exists and is referenced.
    If a script throws Cannot read properties of null → the HTML element expected by the script is missing on the page. Scripts guard the DOM where appropriate, but check console for which file/line.

Development tips:
    Keep page-specific JS small — rendering and UI logic should live in blog.js / post.js.
    Put global UI (theme, palette, hero) in theme.js.
    Split heavy interactive code (tilt, magnetic) into their own files if they grow large.