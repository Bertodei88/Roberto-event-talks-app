/**
 * BigQuery Release Notes Viewer – Client-side logic
 */

(() => {
  "use strict";

  // ── DOM References ──
  const releasesContainer = document.getElementById("releases-list");
  const btnRefresh        = document.getElementById("btn-refresh");
  const statusCount       = document.getElementById("status-count");
  const statusTime        = document.getElementById("status-time");
  const tweetBar          = document.getElementById("tweet-bar");
  const tweetBarText      = document.getElementById("tweet-bar-text");
  const btnTweet          = document.getElementById("btn-tweet");
  const btnDeselect       = document.getElementById("btn-deselect");

  let selectedEntry = null;

  // ── Fetch release notes from API ──
  async function fetchReleases() {
    btnRefresh.classList.add("loading");
    btnRefresh.disabled = true;

    // Show skeleton loading
    releasesContainer.innerHTML = buildSkeletons(6);

    try {
      const res  = await fetch("/api/releases");
      const data = await res.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "Unknown error");
      }

      renderReleases(data.entries);
      statusCount.textContent = `${data.entries.length} releases`;
      statusTime.textContent  = `Updated ${new Date().toLocaleTimeString()}`;
    } catch (err) {
      releasesContainer.innerHTML = `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <p>Failed to load release notes</p>
          <p class="error-detail">${escapeHTML(err.message)}</p>
        </div>`;
      statusCount.textContent = "Error";
    } finally {
      btnRefresh.classList.remove("loading");
      btnRefresh.disabled = false;
    }
  }

  // ── Render release cards ──
  function renderReleases(entries) {
    if (!entries.length) {
      releasesContainer.innerHTML = '<div class="empty-state">No release notes found.</div>';
      return;
    }

    releasesContainer.innerHTML = entries.map((entry, i) => `
      <article class="release-card" data-index="${i}" style="animation-delay: ${Math.min(i * 0.04, 0.4).toFixed(2)}s">
        <div class="card-header">
          <h2 class="card-title">
            <a href="${escapeAttr(entry.link)}" target="_blank" rel="noopener">${escapeHTML(entry.title)}</a>
          </h2>
          <span class="card-date">${escapeHTML(entry.display_date)}</span>
        </div>
        <div class="card-content">${entry.content}</div>
      </article>
    `).join("");

    // Attach click handlers
    document.querySelectorAll(".release-card").forEach(card => {
      card.addEventListener("click", (e) => {
        // Don't select when clicking a link inside the card
        if (e.target.closest("a")) return;
        handleCardSelect(card, entries[parseInt(card.dataset.index)]);
      });
    });
  }

  // ── Card selection ──
  function handleCardSelect(cardEl, entry) {
    // Deselect if clicking the same card
    if (selectedEntry === entry) {
      deselectCard();
      return;
    }

    // Remove previous selection
    document.querySelectorAll(".release-card.selected").forEach(el => el.classList.remove("selected"));

    cardEl.classList.add("selected");
    selectedEntry = entry;

    // Show tweet bar
    tweetBarText.textContent = entry.title;
    tweetBar.classList.add("visible");
  }

  function deselectCard() {
    document.querySelectorAll(".release-card.selected").forEach(el => el.classList.remove("selected"));
    selectedEntry = null;
    tweetBar.classList.remove("visible");
  }

  // ── Tweet ──
  function tweetSelected() {
    if (!selectedEntry) return;

    const text = `${selectedEntry.title}\n\n${selectedEntry.link}\n\n#BigQuery #GoogleCloud`;
    const url  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,width=600,height=400");
  }

  // ── Skeleton loading ──
  function buildSkeletons(count) {
    return Array.from({ length: count }, () => `
      <div class="skeleton-card">
        <div class="skeleton-line title w70"></div>
        <div class="skeleton-line w90"></div>
        <div class="skeleton-line w60"></div>
        <div class="skeleton-line w40"></div>
      </div>
    `).join("");
  }

  // ── Utilities ──
  function escapeHTML(str) {
    const el = document.createElement("span");
    el.textContent = str;
    return el.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ── Event Listeners ──
  btnRefresh.addEventListener("click", fetchReleases);
  btnTweet.addEventListener("click", tweetSelected);
  btnDeselect.addEventListener("click", deselectCard);

  // Keyboard: Escape to deselect
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") deselectCard();
  });

  // ── Initial load ──
  fetchReleases();
})();
