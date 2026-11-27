// Filtering and sorting for the deal list. Pure functions over the deal array:
// the page state (query, category, store, minimum discount, sort) goes in,
// the deals to show come out. Nothing here touches the DOM.

import { percentOff, saving } from "./format.js";

export function applyFilters(deals, state) {
  const q = state.query.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (percentOff(d) < state.minDiscount) return false;
    if (q !== "" && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const by = {
    discount: (a, b) => percentOff(b) - percentOff(a) || saving(b) - saving(a),
    saving: (a, b) => saving(b) - saving(a),
    price: (a, b) => a.price - b.price,
    name: (a, b) => a.title.localeCompare(b.title),
  }[state.sort] || ((a, b) => percentOff(b) - percentOff(a));
  return [...out].sort(by);
}

export function totals(deals) {
  const saved = deals.reduce((sum, d) => sum + saving(d), 0);
  const avg = deals.length === 0 ? 0 : Math.round(deals.reduce((s, d) => s + percentOff(d), 0) / deals.length);
  return { count: deals.length, saved, avg };
}
