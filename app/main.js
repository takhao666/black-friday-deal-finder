// DealBeacon: the router and the controls. The list lives at #/ and each deal
// at #/deal/<id>. Every control re-renders the list from the same state, so a
// search, a category chip, a store or discount filter and the sort all work
// together. window.__shotReady is false while a page renders and true once it
// is on screen, so a screenshot script knows when to capture.

import { deals } from "./data.js";
import { applyFilters, totals } from "./filters.js";
import { card, dealPage, listPage, missingPage } from "./views.js";

const app = document.getElementById("app");

const state = { query: "", category: "All", store: "All", minDiscount: 0, sort: "discount" };

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealBeacon`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    document.title = "DealBeacon — Black Friday 2026 deal finder";
    app.innerHTML = listPage(state, applyFilters(deals, state), totals(deals));
    wireControls();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireControls() {
  const search = app.querySelector('input[type="search"]');
  search.addEventListener("input", () => {
    state.query = search.value;
    refreshGrid(search);
  });
  app.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.cat;
      render();
    });
  });
  app.querySelectorAll("select[data-field]").forEach((sel) => {
    sel.addEventListener("change", () => {
      const field = sel.dataset.field;
      state[field] = field === "minDiscount" ? Number(sel.value) : sel.value;
      render();
    });
  });
}

function refreshGrid(search) {
  // Re-render just the grid and the count, so typing never loses focus.
  const shown = applyFilters(deals, state);
  const count = app.querySelector(".count");
  const grid = app.querySelector(".grid");
  const empty = app.querySelector(".empty");
  if (shown.length === 0) {
    if (grid) grid.remove();
    if (!empty) count.insertAdjacentHTML("afterend", '<p class="empty">No deal matches. Clear the search or lower the discount filter.</p>');
  } else {
    if (empty) empty.remove();
    const html = `<div class="grid">${shown.map(card).join("")}</div>`;
    if (grid) grid.outerHTML = html;
    else count.insertAdjacentHTML("afterend", html);
  }
  count.textContent = `Showing ${shown.length} of ${deals.length} deals`;
  search.focus();
  search.setSelectionRange(search.value.length, search.value.length);
}

window.addEventListener("hashchange", render);
render();
