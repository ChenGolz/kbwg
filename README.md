# Static HTML/JS/CSS integration (no React)

This pack adds a grayed-out "$$$$$" price tier indicator + helper sorting functions.

## 1) Copy files into your project

Copy:
- `css/price-tier.css` -> into your CSS folder
- `js/price-tier.js`   -> into your JS folder (kept as an ES module)

## 2) Include them in your HTML

In the <head>:
```html
<link rel="stylesheet" href="./css/price-tier.css">
```

Before </body> (or wherever you load modules):
```html
<script type="module" src="./js/app.js"></script>
```

Then inside your `app.js`, import:
```js
import { renderPriceTier, priceTierFromUsd, sortBrandsCheapestFirst } from './price-tier.js';
```

## 3) Add `priceTier` to each brand

Example brand object:
```js
{
  name: "Good Bubble",
  website: "https://goodbubble.co.uk",
  amazonCom: "https://www.amazon.com/....",
  amazonUk: "https://www.amazon.co.uk/....",
  repPriceUsd: 18.99,
  priceTier: priceTierFromUsd(18.99)
}
```

If you already know the tier, just set `priceTier: 2` etc.

## 4) Render it in your brand card

Example:
```js
const card = document.createElement('div');
card.className = 'brand-card';

const title = document.createElement('h3');
title.textContent = brand.name;

const tierEl = renderPriceTier(brand.priceTier, { size: 'sm' });

card.append(title, tierEl);
```

## 5) Default sorting

International brands page: show cheap brands first:
```js
brands = sortBrandsCheapestFirst(brands);
```

Products page: show cheapest first (by priceMin / priceRangeMin):
```js
products = sortProductsCheapestFirst(products);
```

## 6) Remove the "verified" badge ("מאומת")

If your UI adds a badge like:
```html
<span class="badge verified">מאומת</span>
```
Remove it from the HTML template or stop creating it in JS.

## 7) Standardize label as "Website"

Always display:
```js
label.textContent = 'Website';
```

## 8) Top bar wrapping fix (prevents dropping to 2nd line)

Use CSS on your nav container:
```css
.topbar-nav {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
}
```

## 9) Remove the boxed category chips section

Delete the HTML block / JS render that creates the chip list,
and keep only your dropdown/combobox filter.
