// HTML for every page, built from the deal data. Every value is escaped before
// it goes into the page. A deal card always shows the product, the store, the
// sale price, the usual price, the discount, the honest verdict signal, when
// the price was checked, where it was read, and the link to the store.

import { checkedAt, escape, percentOff, saving, signalLabel, usd } from "./format.js";
import { CATEGORIES, STORES, deals } from "./data.js";

export function card(d, best = false) {
  return `<article class="card">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="signal ${escape(d.signal)}">${signalLabel(d.signal)}</span></div>
  ${best ? '<p class="ribbon">★ Best discount on the board</p>' : ""}
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="cat">${escape(d.category)}</p>
  <p class="price">${usd(d.price)} <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">You save ${usd(saving(d))}</p>
  <p class="meta">Checked ${checkedAt(d.checked)}</p>
  <p class="meta">Source: ${escape(d.source)}</p>
  <p><a class="buy" href="${escape(d.url)}" rel="noopener" target="_blank">View at ${escape(d.store)} &rarr;</a></p>
</article>`;
}

function controls(state) {
  const cats = ["All", ...CATEGORIES]
    .map(
      (c) =>
        `<button type="button" class="chip${state.category === c ? " on" : ""}" data-cat="${escape(c)}">${escape(c)}</button>`,
    )
    .join("");
  const stores = ["All", ...STORES]
    .map((s) => `<option${state.store === s ? " selected" : ""}>${escape(s)}</option>`)
    .join("");
  const discounts = [0, 20, 40, 50]
    .map((n) => `<option value="${n}"${state.minDiscount === n ? " selected" : ""}>${n === 0 ? "Any discount" : n + "% off or more"}</option>`)
    .join("");
  const sorts = [
    ["discount", "Biggest discount first"],
    ["saving", "Biggest saving ($) first"],
    ["price", "Lowest price first"],
    ["name", "Name A–Z"],
  ]
    .map(([v, label]) => `<option value="${v}"${state.sort === v ? " selected" : ""}>${label}</option>`)
    .join("");
  return `<section class="controls" aria-label="Find deals">
  <label class="search">Search deals <input type="search" value="${escape(state.query)}" placeholder="Try “AirPods”, “TV”, “Dyson”…"></label>
  <div class="chips" role="group" aria-label="Category">${cats}</div>
  <div class="selects">
    <label>Store <select data-field="store">${stores}</select></label>
    <label>Discount <select data-field="minDiscount">${discounts}</select></label>
    <label>Sort by <select data-field="sort">${sorts}</select></label>
  </div>
</section>`;
}

export function listPage(state, shown, total) {
  const top = [...deals].sort((a, b) => percentOff(b) - percentOff(a)).slice(0, 3);
  const topHtml = top
    .map(
      (d, i) =>
        `<li><span class="rank">${i + 1}</span> <a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a> — ${escape(d.store)}, ${usd(d.price)} (${percentOff(d)}% off)</li>`,
    )
    .join("");
  return `<h1>Black Friday 2026, checked deal by deal</h1>
<p class="lede">Real sale prices at real stores, read on 27 November 2026. Every deal says
when its price was checked, where it was read, and whether it is really a deal —
a new low, a strong price, or just a routine sale.</p>
<section class="stats" aria-label="Board totals">
  <div><strong>${total.count}</strong><span>deals listed</span></div>
  <div><strong>${total.avg}%</strong><span>average discount</span></div>
  <div><strong>${usd(total.saved)}</strong><span>total savings</span></div>
  <div><strong>${STORES.length}</strong><span>stores</span></div>
</section>
<section class="top" aria-label="Biggest discounts"><h2>Biggest discounts right now</h2><ol>${topHtml}</ol></section>
${controls(state)}
<p class="count" role="status">Showing ${shown.length} of ${deals.length} deals</p>
${shown.length === 0 ? '<p class="empty">No deal matches. Clear the search or lower the discount filter.</p>' : `<div class="grid">${shown.map((d, i) => card(d, i === 0 && state.sort === "discount")).join("")}</div>`}`;
}

export function dealPage(d) {
  const same = deals.filter((x) => x.category === d.category && x.id !== d.id).slice(0, 4);
  const sameHtml =
    same.length === 0
      ? ""
      : `<section class="similar"><h2>More ${escape(d.category)} deals</h2><ul>${same
          .map(
            (x) =>
              `<li><a href="#/deal/${encodeURIComponent(x.id)}">${escape(x.title)}</a> — ${escape(x.store)}, ${usd(x.price)} (${percentOff(x)}% off)</li>`,
          )
          .join("")}</ul></section>`;
  return `<p><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="signal ${escape(d.signal)}">${signalLabel(d.signal)}</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="price big">${usd(d.price)} <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">You save ${usd(saving(d))} against the usual price of ${usd(d.was)}.</p>
  <h2>Is it really a deal?</h2>
  <p>${escape(d.evidence)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Price checked</dt><dd>${checkedAt(d.checked)}</dd>
    <dt>Where the price was read</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="buy" href="${escape(d.url)}" rel="noopener" target="_blank">View it at ${escape(d.store)} &rarr;</a></p>
  <p class="note">Prices change fast on Black Friday — the store page is the price that counts at checkout.</p>
</article>
${sameHtml}`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
