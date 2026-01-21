/* KBWG Bundles — v11 (Max Products Value Bundle)
   - Added "Value Bundle": Picks the cheapest eligible products to maximize quantity.
   - Target: ~$55 USD (~187 ILS) for free shipping.
   - Keeps ATTITUDE lines strictly separated.
*/
(function () {
  'use strict';

  var USD_TO_ILS = 3.4;  
  var ILS_MIN = 175;     // Threshold for ~$51-52 USD
  var ILS_MAX = 205;     // Cap for ~$60 USD
  var FREE_SHIP_THRESHOLD_USD = 49;
  var MAX_USES_PER_PRODUCT = 2;

  // ... (Helpers remain the same as previous version)

  function init() {
    // ... (Initialization logic)

    var TEMPLATES = [
      {
        key: 'value-max',
        titleHe: '💰 הבאנדל הכי משתלם (Value Bundle)',
        subtitleHe: 'מקסימום מוצרים במינימום מחיר – סביב 55$',
        rules: { noKids: true },
        slots: [
          { keywords: ['cleaner', 'wash', 'ניקוי'], maxPriceUSD: 10 },
          { keywords: ['cream', 'spf', 'lotion'], maxPriceUSD: 10 },
          { keywords: ['soap', 'hand', 'body'], maxPriceUSD: 10 },
          { keywords: ['lip', 'balm', 'mask'], maxPriceUSD: 10 }
        ],
        filler: { keywords: ['cleaner', 'soap', 'cream'], maxPriceUSD: 12 }
      },
      {
        key: 'attitude-adult',
        titleHe: '🌿 ATTITUDE Sensitive Skin (Adults)',
        subtitleHe: 'טיפוח נקי ללא בישום לעור רגיש',
        rules: { noKids: true, noMen: true },
        slots: [
          { brand: 'ATTITUDE', keywords: ['shampoo'] },
          { brand: 'ATTITUDE', keywords: ['conditioner'] },
          { brand: 'ATTITUDE', keywords: ['body wash'] }
        ],
        filler: { brand: 'ATTITUDE', keywords: ['hand', 'soap'] }
      },
      // ... (Other templates: Men, Kids, Pacifica, etc.)
    ];

    // ... (Execution and rendering)
  }
  
  document.addEventListener('DOMContentLoaded', init);
})();/* Auto Bundles (KBWG) — v2 logic
  Goals:
    - Each product can appear at most once on the Bundles page (global uniqueness).
    - Bundles are logical & varied: Men / Baby / Family / Hair / Face / Makeup.
    - Bundle constraints:
        * Eligible for Amazon free shipping threshold (freeShipOver === 49) AND total USD >= 49
        * Estimated total ILS between 170–250 (using USD→ILS constant)
    - Prices displayed in ILS only (USD used internally for totals & threshold).
*/
(function () {
  'use strict';

  // Rough constant used elsewhere on site ("$49 ≈ ₪160")
  var USD_TO_ILS = 3.3;

  var ILS_MIN = 170;
  var ILS_MAX = 250;
  var FREE_SHIP_OVER_USD = 49;
  var MIN_BUNDLE_USD = 49;

  function $(sel, root) { return (root || document).querySelector(sel); }

  function normalizeCategory(cat) {
    if (!cat) return '';
    var c = String(cat).trim().toLowerCase();
    var aliases = {
      skincare: 'face',
      'skin-care': 'face',
      skin: 'face',
      fragrances: 'fragrance',
      perfume: 'fragrance',
      perfumes: 'fragrance',
      frag: 'fragrance'
    };
    return aliases[c] || c;
  }

  function catsOf(p) {
    var cats = (p.categories || []).map(normalizeCategory).filter(Boolean);
    return cats;
  }

  function hasCat(p, cat) {
    var cats = catsOf(p);
    for (var i = 0; i < cats.length; i++) if (cats[i] === cat) return true;
    return false;
  }

  function hasAnyCat(p, setObj) {
    var cats = catsOf(p);
    for (var i = 0; i < cats.length; i++) if (setObj[cats[i]]) return true;
    return false;
  }

  function getBestOffer(p) {
    if (!p || !Array.isArray(p.offers)) return null;
    var amazon = p.offers.find(function (o) { return o && o.store === 'amazon-us'; });
    return amazon || p.offers[0] || null;
  }

  function usdPrice(p) {
    var o = getBestOffer(p);
    var v = o && Number(o.priceUSD);
    return Number.isFinite(v) ? v : null;
  }

  function isEligibleForThreshold(p) {
    var o = getBestOffer(p);
    if (!o) return false;
    if (o.store !== 'amazon-us') return false;
    if (usdPrice(p) == null) return false;
    // require explicit freeShipOver = 49 (your rule)
    return typeof o.freeShipOver === 'number' && Math.abs(o.freeShipOver - FREE_SHIP_OVER_USD) < 0.01;
  }

  function ilsFromUsd(usd) {
    return (Number(usd) || 0) * USD_TO_ILS;
  }

  function fmtILS(n) {
    return '₪' + Math.round(n).toString();
  }

  function tryResolveImage(p) {
    if (p && p.image) return p.image;
    if (!p || !p.id) return 'assets/img/placeholder-product.png';
    return 'assets/img/products/' + p.id + '.jpg';
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[c];
    });
  }

  // --- heuristics for logic/variety ---
  function lc(s) { return String(s || '').toLowerCase(); }

  function isMenProduct(p) {
    if (!p) return false;
    if (p.isMen) return true;
    if (hasCat(p, 'mens-care')) return true;
    var n = lc(p.name);
    return n.indexOf('men') >= 0 || n.indexOf('גבר') >= 0 || n.indexOf('לגבר') >= 0 || n.indexOf('גברים') >= 0;
  }

  function isBabyProduct(p) {
    if (!p) return false;
    if (p.isKids) return true;
    if (hasCat(p, 'baby')) return true;
    var n = lc(p.name);
    return n.indexOf('kid') >= 0 || n.indexOf('toddler') >= 0 || n.indexOf('תינוק') >= 0 || n.indexOf('ילד') >= 0 || n.indexOf('ילדים') >= 0;
  }

  function typeKey(p) {
    var n = lc(p.name);
    if (n.indexOf('shampoo') >= 0 || n.indexOf('שמפו') >= 0) return 'shampoo';
    if (n.indexOf('conditioner') >= 0 || n.indexOf('מרכך') >= 0) return 'conditioner';
    if (n.indexOf('toothbrush') >= 0 || n.indexOf('מברשת שיניים') >= 0) return 'toothbrush';
    if (n.indexOf('replacement') >= 0 || n.indexOf('heads') >= 0 || n.indexOf('ראשים') >= 0) return 'heads';
    if (n.indexOf('serum') >= 0 || n.indexOf('סרום') >= 0) return 'serum';
    if (n.indexOf('cream') >= 0 || n.indexOf('קרם') >= 0) return 'cream';
    if (n.indexOf('scrub') >= 0 || n.indexOf('פילינג') >= 0) return 'scrub';
    if (n.indexOf('foundation') >= 0 || n.indexOf('פאונדיישן') >= 0 || n.indexOf('מייקאפ') >= 0) return 'foundation';
    if (n.indexOf('liner') >= 0 || n.indexOf('תוחם') >= 0) return 'liner';
    return 'other';
  }

  function bundleTotals(items) {
    var usd = 0;
    for (var i = 0; i < items.length; i++) usd += (usdPrice(items[i]) || 0);
    var ils = ilsFromUsd(usd);
    return { usd: usd, ils: ils };
  }

  function inRange(items) {
    var t = bundleTotals(items);
    if (t.usd < MIN_BUNDLE_USD) return false;
    return t.ils >= ILS_MIN && t.ils <= ILS_MAX;
  }

  function noDupTypes(items, allowTwoHair) {
    var seen = {};
    for (var i = 0; i < items.length; i++) {
      var tk = typeKey(items[i]);
      if ((tk === 'shampoo' || tk === 'conditioner') && allowTwoHair) continue;
      if (seen[tk]) return false;
      seen[tk] = 1;
    }
    return true;
  }

  function pickBundle(pool, used, rules) {
    // rules: { mustAny, allowBaby, allowMen, allowTwoHair, minCount, maxCount, requireMen, requireBaby, avoidWomenMakeup }
    var candidates = pool.filter(function (p) {
      if (!p || !p.id) return false;
      if (used[p.id]) return false;
      if (!isEligibleForThreshold(p)) return false;

      if (!rules.allowMen && isMenProduct(p)) return false;
      if (!rules.allowBaby && isBabyProduct(p)) return false;

      if (rules.mustAny && !rules.mustAny(p)) return false;

      return true;
    });

    // sort by price descending (helps reach threshold)
    candidates.sort(function (a, b) { return (usdPrice(b) || 0) - (usdPrice(a) || 0); });

    var best = null;
    var bestScore = 1e9;
    var target = (ILS_MIN + ILS_MAX) / 2;

    var minK = rules.minCount || 2;
    var maxK = rules.maxCount || 5;

    // group by type for variety
    var byType = {};
    candidates.forEach(function (p) {
      var tk = typeKey(p);
      (byType[tk] = byType[tk] || []).push(p);
    });
    var typeKeys = Object.keys(byType);

    function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    for (var attempt = 0; attempt < 900; attempt++) {
      var k = minK + Math.floor(Math.random() * (maxK - minK + 1));
      var items = [];
      var pickedTypes = {};
      var tries = 0;

      while (items.length < k && tries < 80) {
        tries++;
        var tk = typeKeys.length ? typeKeys[Math.floor(Math.random() * typeKeys.length)] : null;
        var arr = tk ? byType[tk] : candidates;
        if (!arr || !arr.length) continue;
        var p = randFrom(arr);
        if (!p || used[p.id]) continue;
        if (items.indexOf(p) >= 0) continue;

        var tkey = typeKey(p);
        if (!rules.allowTwoHair) {
          if (pickedTypes[tkey]) continue;
        } else {
          if (pickedTypes[tkey] && tkey !== 'shampoo' && tkey !== 'conditioner') continue;
        }
        pickedTypes[tkey] = (pickedTypes[tkey] || 0) + 1;

        items.push(p);

        if (bundleTotals(items).ils > ILS_MAX) {
          items.pop();
          pickedTypes[tkey] = pickedTypes[tkey] - 1;
          if (pickedTypes[tkey] <= 0) delete pickedTypes[tkey];
        }
      }

      if (items.length < minK) continue;
      if (!inRange(items)) continue;
      if (!noDupTypes(items, !!rules.allowTwoHair)) continue;

      if (rules.requireMen && !items.some(isMenProduct)) continue;
      if (rules.requireBaby && !items.some(isBabyProduct)) continue;

      if (rules.avoidWomenMakeup) {
        var hasMakeup = items.some(function (p) { return hasAnyCat(p, { makeup:1 }) || typeKey(p) === 'liner' || typeKey(p) === 'foundation'; });
        if (hasMakeup) continue;
      }

      var score = Math.abs(bundleTotals(items).ils - target);
      if (score < bestScore) { bestScore = score; best = items.slice(); }
    }

    if (!best) return null;
    best.forEach(function (p) { used[p.id] = 1; });
    return best;
  }

  var THEMES = [
    {
      key: 'men',
      title: 'שגרת גבר נקייה',
      subtitle: 'מוצרים ייעודיים לגברים + פריטים אוניברסליים.',
      rules: {
        allowMen: true,
        allowBaby: false,
        requireMen: true,
        avoidWomenMakeup: true,
        allowTwoHair: false,
        minCount: 2,
        maxCount: 5,
        mustAny: function (p) { return isMenProduct(p) || hasAnyCat(p, { body:1, hair:1, teeth:1, face:1 }); }
      }
    },
    {
      key: 'baby',
      title: 'בייבי באלנס',
      subtitle: 'שגרה עדינה לילדים ותינוקות — בלי להתפשר על ערכים.',
      rules: {
        allowMen: false,
        allowBaby: true,
        requireBaby: true,
        allowTwoHair: false,
        minCount: 2,
        maxCount: 5,
        mustAny: function (p) { return isBabyProduct(p); }
      }
    },
    {
      key: 'family',
      title: 'באנדל משפחתי',
      subtitle: 'מיקס חכם לבית: לילדים + למבוגרים, כדי להגיע לסף משלוח.',
      rules: {
        allowMen: true,
        allowBaby: true,
        requireBaby: true,
        allowTwoHair: true,
        minCount: 3,
        maxCount: 5,
        mustAny: function (p) { return hasAnyCat(p, { baby:1, body:1, hair:1, teeth:1, face:1 }); }
      }
    },
    {
      key: 'hair',
      title: 'שיער וואו בבית',
      subtitle: 'שגרת שיער שמרגישה כמו סלון — מגוונת ולא חוזרת על עצמה.',
      rules: {
        allowMen: false,
        allowBaby: false,
        allowTwoHair: false,
        minCount: 2,
        maxCount: 5,
        mustAny: function (p) { return hasAnyCat(p, { hair:1 }); }
      }
    },
    {
      key: 'face',
      title: 'פנים זוהרות',
      subtitle: 'שגרת פנים פשוטה ואפקטיבית: ניקוי/טיפול/לחות.',
      rules: {
        allowMen: false,
        allowBaby: false,
        allowTwoHair: false,
        minCount: 2,
        maxCount: 5,
        mustAny: function (p) { return hasAnyCat(p, { face:1 }); }
      }
    },
    {
      key: 'makeup',
      title: 'איפור יומי בקלות',
      subtitle: 'כמה פריטים שמרימים לוק שלם — בלי כפילויות מיותרות.',
      rules: {
        allowMen: false,
        allowBaby: false,
        allowTwoHair: false,
        minCount: 2,
        maxCount: 5,
        mustAny: function (p) { return hasAnyCat(p, { makeup:1 }); }
      }
    }
  ];

  function renderBundleCard(bundle) {
    var card = document.createElement('article');
    card.className = 'bundleCard card';

    var top = document.createElement('div');
    top.className = 'bundleTop';

    var left = document.createElement('div');
    var h = document.createElement('h3');
    h.className = 'bundleTitle';
    h.textContent = bundle.title;

    var sub = document.createElement('p');
    sub.className = 'bundleSubtitle';
    sub.textContent = bundle.subtitle;

    var meta = document.createElement('div');
    meta.className = 'bundleMeta';

    var totals = bundleTotals(bundle.items);
    var totalLine = document.createElement('div');
    totalLine.className = 'bundleTotal';
    totalLine.textContent = 'סה״כ משוער: ' + fmtILS(totals.ils);

    var shipLine = document.createElement('div');
    shipLine.className = 'bundleShip';
    shipLine.textContent = 'כולל: משלוח חינם מעל $49 (160 ש״ח לערך)';

    meta.appendChild(totalLine);
    meta.appendChild(shipLine);

    left.appendChild(h);
    left.appendChild(sub);

    top.appendChild(left);
    top.appendChild(meta);

    var list = document.createElement('div');
    list.className = 'bundleProducts';

    bundle.items.forEach(function (p) {
      var row = document.createElement('a');
      row.className = 'bundleProduct';
      var offer = getBestOffer(p);
      row.href = (offer && offer.url) || '#';
      row.target = '_blank';
      row.rel = 'noopener';

      var img = document.createElement('img');
      img.className = 'bundleProductImg';
      img.alt = (p.brand || '') + ' ' + (p.name || '');
      img.src = tryResolveImage(p);

      var info = document.createElement('div');
      info.className = 'bundleProductInfo';

      var title = document.createElement('div');
      title.className = 'bundleProductTitle';
      title.innerHTML = '<span class="wg-notranslate">' + escapeHtml(p.brand || '') + '</span>' + ' — ' + escapeHtml(p.name || '');

      var details = document.createElement('div');
      details.className = 'bundleProductDetails';
      var u = usdPrice(p);
      var ils = (u != null) ? ilsFromUsd(u) : null;
      details.textContent = (p.size ? (p.size + ' • ') : '') + (ils != null ? fmtILS(ils) : '');

      info.appendChild(title);
      info.appendChild(details);

      row.appendChild(img);
      row.appendChild(info);

      list.appendChild(row);
    });

    var cta = document.createElement('div');
    cta.className = 'bundleCTA';

    var btn = document.createElement('button');
    btn.className = 'btn btnPrimary';
    btn.type = 'button';
    btn.textContent = 'קישור לחבילה - בקרוב';
    btn.addEventListener('click', function () {
      bundle.items.forEach(function (p) {
        var o = getBestOffer(p);
        if (o && o.url) window.open(o.url, '_blank', 'noopener');
      });
    });

    cta.appendChild(btn);

    card.appendChild(top);
    card.appendChild(list);
    card.appendChild(cta);

    return card;
  }

  function showEmpty(grid) {
    grid.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'לא נמצאו באנדלים מתאימים כרגע (תלוי במלאי/מחירים/שילוח). נסי להוסיף עוד מוצרים עם freeShipOver=49.';
    grid.appendChild(p);
  }

  function weglotRefresh() {
    try {
      if (window.Weglot && typeof window.Weglot.refresh === 'function') window.Weglot.refresh();
      if (typeof window.weglotRefresh === 'function') window.weglotRefresh();
    } catch (e) {}
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to fetch ' + url);
    return await res.json();
  }

  async function init() {
    var grid = $('#bundleGrid');
    if (!grid) return;

    grid.innerHTML = '<div class="muted">טוען באנדלים...</div>';

    var products = await fetchJson('data/products.json');
    if (!Array.isArray(products)) products = [];

    products.forEach(function (p) {
      if (!p || !Array.isArray(p.categories)) return;
      p.categories = p.categories.map(normalizeCategory);
    });

    var used = {};
    var bundles = [];

    for (var i = 0; i < THEMES.length; i++) {
      var theme = THEMES[i];
      var items = pickBundle(products, used, theme.rules);
      if (items && items.length) {
        bundles.push({
          key: theme.key,
          title: theme.title,
          subtitle: theme.subtitle,
          items: items
        });
      }
    }

    grid.innerHTML = '';
    if (!bundles.length) return showEmpty(grid);

    bundles.forEach(function (b) {
      grid.appendChild(renderBundleCard(b));
    });

    weglotRefresh();
  }

  document.addEventListener('DOMContentLoaded', function () {
    init().catch(function (e) {
      console.error(e);
      var grid = document.getElementById('bundleGrid');
      if (grid) grid.innerHTML = '<div class="muted">שגיאה בטעינת באנדלים. נסי לרענן את העמוד.</div>';
    });
  });
})();
