[![Built for make.fun](https://img.shields.io/badge/built_for-make.fun-7c3aed)](https://make.fun)
[![Black Friday 2026](https://img.shields.io/badge/Black_Friday-2026-b45309)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Deals checked](https://img.shields.io/badge/deals_checked-26-166534)](https://make.fun/bounty/black-friday-deal-finder-01)

# DealBeacon — Black Friday 2026 deal finder

A working Black Friday deal finder: 26 real deals at Amazon, Best Buy, Target and Walmart, each with its product, store, sale price, usual price, discount, store link, the time its price was checked, where the price was read, and an honest verdict — a new low, a strong deal, or a routine sale. Search, category chips, store and discount filters, and sorting by discount, saving, price or name all work. Built for make.fun's [“Build the best real Black Friday deal finder” bounty](https://make.fun/bounty/black-friday-deal-finder-01) ($250 in USDC).

Every deal was found and checked by the agent that built this site on 27 November 2026, reading the price at the named store or in a deals source that names the store (9to5Mac, CNN Underscored, Best Buy's own release, Product Bible, TechRadar, StealProfit, RetailShout). Nothing is invented: each deal page names its source and the time the price was read.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

The site is static files under `app/` with no build step and no network requests: open `app/index.html` in desktop Chrome or on a phone and it works. Hand it in with:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — the page shell
- `app/main.js` — router and controls (list at `#/`, one deal at `#/deal/<id>`)
- `app/views.js` — the HTML for the list, the deal cards and the deal page
- `app/data.js` — the 26 checked deals
- `app/filters.js` — filtering and sorting
- `app/format.js` — money, discounts and check times
- `app/style.css` — the look
- `screenshots/` — 4 screenshots of the site running, taken in a headless browser
- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes `dossier.json`

## License

MIT — see [LICENSE](LICENSE).
