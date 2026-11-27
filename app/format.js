// Small formatting helpers: money, discounts and check times.
// One job each, no DOM here, so the views can stay about layout.

export const usd = (n) =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

export const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);

export const saving = (d) => d.was - d.price;

export const checkedAt = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

export const signalLabel = (signal) =>
  signal === "new-low" ? "New low" : signal === "strong" ? "Strong deal" : "Routine sale";

export const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
