// Products page logic (RTL-friendly, data-normalized, performant)
(function () {
  const qs = (s) => document.querySelector(s);

  const q = qs("#q");
  const grid = qs("#grid");
  const liveCount = qs("#liveCount");

  const brandSelect = qs("#brandSelect");
  const storeSelect = qs("#storeSelect");
  const typeSelect = qs("#typeSelect"); // ✅ סוג מוצר (קבוצות + תתי-קטגוריות)
  const sortSel = qs("#sort");
  const clearBtn = qs("#clearFilters");

  const onlyLB = qs("#onlyLB");
  const onlyPeta = qs("#onlyPeta");
  const onlyVegan = qs("#onlyVegan");
  const onlyIsrael = qs("#onlyIsrael");
  const onlyFreeShip = qs("#onlyFreeShip");
  const priceRangeSelect = qs("#priceRange");

  const chips = Array.from(document.querySelectorAll(".chip"));
  let currentCat = "all";

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeProduct(p) {
    const offers = Array.isArray(p?.offers) ? p.offers : [];
    const storeRegion = String(p?.storeRegion ?? "").toLowerCase();

    return {
      ...p,
      // דגלים לוגיים אחידים
      isLB: Boolean(p?.isLB ?? p?.lb ?? p?.isLeapingBunny),
      isPeta: Boolean(p?.isPeta ?? p?.peta),
      isVegan: Boolean(p?.isVegan ?? p?.vegan),
      isIsrael: Boolean(p?.isIsrael ?? p?.israel ?? (storeRegion === "il")),
      // offers אחיד (meta, region, freeShipOver)
      offers: offers.map((o) => {
        const rawUrl = String(o?.url || "");
        const domain = rawUrl.split("/")[2] || "";
        let region = String(o?.region || "").toLowerCase();

        if (!region) {
          if (domain.includes("amazon.co.uk")) region = "uk";
          else if (domain.includes("amazon.com")) region = "us";
          else if (domain.includes("amazon.de")) region = "de";
          else if (domain.includes("amazon.fr")) region = "fr";
          else if (storeRegion && storeRegion !== "intl") region = storeRegion;
        }

        const rawFree = o?.freeShipOver ?? p?.freeShipOver;
        const freeNum =
          rawFree != null && rawFree !== "" ? Number(rawFree) : NaN;

        return {
          ...o,
          meta: o?.meta ?? o?.note ?? "",
          region,
          freeShipOver: Number.isFinite(freeNum) ? freeNum : null
        };
      })
    };
  }

  const data = (window.PRODUCTS || []).map(normalizeProduct);

  function unique(arr) {
    return Array.from(new Set(arr))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "he"));
  }

  // --- קטגוריות לוגיות בסיסיות (JS) ---
  const CAT_ALIASES = {
    fragrances: "fragrance",
    perfume: "fragrance",
    perfumes: "fragrance",
    frag: "fragrance"
  };
  function normCat(v) {
    const s = String(v ?? "").trim().toLowerCase();
    return CAT_ALIASES[s] || s;
  }
  function getCatsRaw(p) {
    if (Array.isArray(p?.categories)) return p.categories.map(normCat).filter(Boolean);
    if (p?.category != null) return [normCat(p.category)].filter(Boolean);
    if (p?.cat != null) return [normCat(p.cat)].filter(Boolean);
    return [];
  }

  const CATEGORY_LABELS = {
    face: "פנים",
    hair: "שיער",
    body: "גוף",
    makeup: "איפור",
    fragrance: "בישום"
  };

  function getPrimaryCategoryKey(p) {
    const cats = getCatsRaw(p);
    return cats[0] || "";
  }

  function getCategoryLabelFromProduct(p) {
    if (p.categoryLabel) return p.categoryLabel;
    const key = getPrimaryCategoryKey(p);
    return CATEGORY_LABELS[key] || "אחר";
  }

  // Helper לבדיקת מילים בשם/תיאור
  function containsAny(haystackLower, words) {
    return words.some((w) => haystackLower.includes(w.toLowerCase()));
  }

  // ✅ קביעת "קבוצת סוג" לפי קטגוריה + מילים בשם
  // קבוצות: מוצרי איפור, טיפוח לפנים, טיפוח לגוף, עיצוב שיער, הגנה מהשמש,
  // בשמים, הלבנה וטיפוח השיניים, טיפוח לגבר, אחר.
  function getTypeGroupLabel(p) {
    const catKey = getPrimaryCategoryKey(p); // face / hair / body / makeup / fragrance / ...
    const nameLower = (p.productTypeLabel || p.name || "").toLowerCase();

    const isTeeth = containsAny(nameLower, [
      "tooth",
      "teeth",
      "שן",
      "שיניים",
      "toothpaste",
      "whitening"
    ]);

    if (isTeeth) {
      return "הלבנה וטיפוח השיניים";
    }

    const isMen =
      /גבר|גברים|men's|for men|for him|pour homme/i.test(nameLower);

    if (catKey === "makeup") return "מוצרי איפור";

    if (catKey === "face") {
      if (isMen) return "טיפוח לגבר";
      return "טיפוח לפנים";
    }

    if (catKey === "body") {
      if (isMen) return "טיפוח לגבר";
      return "טיפוח לגוף";
    }

    if (catKey === "hair") {
      if (isMen) return "טיפוח לגבר";
      return "עיצוב שיער";
    }

    if (catKey === "fragrance") {
      return "בשמים";
    }

    if (catKey === "sun" || catKey === "suncare" || catKey === "spf") {
      return "הגנה מהשמש";
    }

    if (isMen) return "טיפוח לגבר";

    return "אחר";
  }

  // ✅ קביעת "תת-סוג" לפי הקבוצה + מילים בשם
  // (למשל "קרם פנים", "סרום", "מסכה לשיער", "שפתיים", "עיניים" וכו׳)
  function getTypeDisplayLabel(p) {
    const group = getTypeGroupLabel(p);
    const name = (p.productTypeLabel || p.name || "").trim();
    if (!name) return "";
    const lower = name.toLowerCase();

    // מוצרי איפור
    if (group === "מוצרי איפור") {
      if (containsAny(lower, ["lip", "שפתיים", "שפתון", "gloss"])) {
        return "שפתיים";
      }
      if (
        containsAny(lower, [
          "eye",
          "eyes",
          "עיניים",
          "ריסים",
          "מסקרה",
          "eyeliner",
          "brow"
        ])
      ) {
        return "עיניים";
      }
      if (containsAny(lower, ["nail", "ציפורניים", "לק"])) {
        return "ציפורניים";
      }
      if (
        containsAny(lower, [
          "brush",
          "מברשת",
          "sponge",
          "applicator",
          "tools",
          "אביזר"
        ])
      ) {
        return "אביזרי איפור";
      }
      if (
        containsAny(lower, [
          "palette",
          "kit",
          "set",
          "סט ",
          "סט ",
          "מארז",
          "ערכת"
        ])
      ) {
        return "סטים ומארזים";
      }
      // כל השאר – סומק/פודרה/מייקאפ וכו׳
      return "פנים";
    }

    // טיפוח לפנים
    if (group === "טיפוח לפנים") {
      if (
        containsAny(lower, [
          "eye",
          "eyes",
          "עיניים",
          "אזור העיניים",
          "שפתיים",
          "lip"
        ])
      ) {
        return "עיניים ושפתיים";
      }
      if (
        containsAny(lower, [
          "mask",
          "מסכה",
          "peel",
          "פילינג",
          "exfoli",
          "scrub"
        ])
      ) {
        return "פילינג ומסכות";
      }
      if (containsAny(lower, ["serum", "סרום", "אמפול"])) {
        return "סרום";
      }
      if (
        containsAny(lower, [
          "cream",
          "קרם",
          "moisturizer",
          "לחות",
          "ג'ל לחות",
          "gel-cream"
        ])
      ) {
        return "קרם פנים";
      }
      if (
        containsAny(lower, [
          "cleanser",
          "ניקוי",
          "wash",
          "face wash",
          "מי פנים",
          "טונר",
          "toner",
          "micellar",
          "מים מיסלריים",
          "balance",
          "איזון"
        ])
      ) {
        return "ניקוי ואיזון";
      }
      if (
        containsAny(lower, [
          "palette",
          "kit",
          "set",
          "סט ",
          "מארז",
          "ערכת",
          "collection"
        ])
      ) {
        return "סטים ומארזים";
      }
      return "ניקוי ואיזון";
    }

    // טיפוח לגוף
    if (group === "טיפוח לגוף") {
      if (containsAny(lower, ["יד", "ידיים", "hands", "hand"])) {
        return "קרמי ידיים";
      }
      if (
        containsAny(lower, ["רגל", "רגליים", "feet", "foot", "heels", "heel"])
      ) {
        return "קרמי רגליים";
      }
      if (containsAny(lower, ["פילינג", "scrub", "exfoli"])) {
        return "פילינגים";
      }
      if (
        containsAny(lower, [
          "deo",
          "deodorant",
          "דאודורנט",
          "soap",
          "סבון",
          "wash",
          "shower",
          "gel douche",
          "body wash"
        ])
      ) {
        return "סבונים ודאודורנטים";
      }
      if (
        containsAny(lower, [
          "palette",
          "kit",
          "set",
          "סט ",
          "מארז",
          "ערכת",
          "collection"
        ])
      ) {
        return "סטים ומארזים";
      }
      // כל השאר: קרמי גוף למיניהם
      return "קרמי גוף";
    }

    // עיצוב שיער
    if (group === "עיצוב שיער") {
      if (containsAny(lower, ["shampoo", "שמפו"])) {
        return "שמפו";
      }
      if (containsAny(lower, ["conditioner", "מרכך"])) {
        return "מרכך";
      }
      if (containsAny(lower, ["mask", "מסכה"])) {
        return "מסכה לשיער";
      }
      // מוס, ספריי, קרם תלתלים וכו׳
      return "טיפוח ועיצוב שיער";
    }

    // הגנה מהשמש
    if (group === "הגנה מהשמש") {
      if (
        containsAny(lower, ["self tan", "self-tan", "שיזוף עצמי", "bronzing"])
      ) {
        return "שיזוף עצמי";
      }
      if (containsAny(lower, ["face", "פנים"])) {
        return "הגנה לפנים";
      }
      if (containsAny(lower, ["body", "גוף", "ידיים", "רגליים"])) {
        return "הגנה לגוף";
      }
      return "הגנה לפנים";
    }

    // בשמים
    if (group === "בשמים") {
      const isMen =
        /גבר|גברים|men's|for men|for him|pour homme/i.test(lower);
      if (isMen) return "בושם לגבר";
      return "בשמים לנשים";
    }

    // הלבנה וטיפוח השיניים
    if (group === "הלבנה וטיפוח השיניים") {
      return "הלבנה וטיפוח השיניים";
    }

    // טיפוח לגבר
    if (group === "טיפוח לגבר") {
      return "טיפוח לגבר";
    }

    return "אחר";
  }

  function getCats(p) {
    return getCatsRaw(p);
  }

  // Free shipping helpers
  function getOfferWithMinFreeShip(p) {
    if (!Array.isArray(p?.offers)) return null;
    let bestOffer = null;
    p.offers.forEach((o) => {
      const v = typeof o.freeShipOver === "number" ? o.freeShipOver : null;
      if (v != null && !Number.isNaN(v)) {
        if (!bestOffer || v < bestOffer.freeShipOver) {
          bestOffer = o;
        }
      }
    });
    return bestOffer;
  }

  function getProductMinFreeShip(p) {
    const bestOffer = getOfferWithMinFreeShip(p);
    return bestOffer ? bestOffer.freeShipOver : null;
  }

  function formatFreeShipText(o) {
    if (!o || o.freeShipOver == null || Number.isNaN(o.freeShipOver)) return "";
    const amount = o.freeShipOver;
    const currency = "₪";
    return `משלוח חינם מעל ${currency}${amount}`;
  }

  function formatSizeForIsrael(rawSize) {
    const original = String(rawSize || "").trim();
    if (!original) return "";

    const lower = original.toLowerCase();

    if (
      lower.includes("ml") ||
      lower.includes('מ"ל') ||
      lower.includes("מ״ל") ||
      lower.includes("גרם") ||
      lower.includes("g")
    ) {
      return original;
    }

    const ozMatch = lower.match(/(\d+(?:\.\d+)?)\s*(fl\.?\s*)?oz/);
    if (ozMatch) {
      const qty = parseFloat(ozMatch[1]);
      if (!Number.isNaN(qty)) {
        const ml = qty * 29.5735;
        const rounded = Math.round(ml / 5) * 5;
        return `${rounded} מ״ל`;
      }
    }

    return original;
  }

  function getProductPriceRange(p) {
    let min = typeof p?.priceMin === "number" ? p.priceMin : null;
    let max = typeof p?.priceMax === "number" ? p.priceMax : null;

    if (Array.isArray(p?.offers)) {
      p.offers.forEach((o) => {
        const v = typeof o.price === "number" ? o.price : null;
        if (v != null && !Number.isNaN(v)) {
          min = min == null ? v : Math.min(min, v);
          max = max == null ? v : Math.max(max, v);
        }
      });
    }

    if (min == null || max == null) return null;
    return [min, max];
  }

  function getStoreDisplayName(p, o) {
    const rawStore = String(o?.store || p?.storeName || "").trim();
    const region = String(o?.region || "").toLowerCase();
    const isAmazon = rawStore.toLowerCase().includes("amazon");

    if (!isAmazon) {
      return rawStore || "חנות";
    }

    switch (region) {
      case "uk":
        return "אמזון אנגליה (Amazon UK)";
      case "us":
        return "אמזון ארה״ב (Amazon US)";
      case "de":
        return "אמזון גרמניה (Amazon DE)";
      case "fr":
        return "אמזון צרפת (Amazon FR)";
      case "il":
        return "אמזון ישראל";
      default:
        return "אמזון בינלאומי (Amazon)";
    }
  }

  function buildSelects() {
    // Brand dropdown
    if (brandSelect) {
      unique(data.map((p) => p.brand)).forEach((b) => {
        const o = document.createElement("option");
        o.value = b;
        o.textContent = b;
        brandSelect.appendChild(o);
      });
    }

    // Store dropdown
    if (storeSelect) {
      unique(
        data.flatMap((p) => (p.offers || []).map((o) => o.store))
      ).forEach((s) => {
        const o = document.createElement("option");
        o.value = s;
        o.textContent = s;
        storeSelect.appendChild(o);
      });
    }

    // ✅ Type dropdown – optgroups לפי הקבוצות, ו-options לפי תתי-הקטגוריה
    if (typeSelect) {
      typeSelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "כל סוגי המוצרים";
      typeSelect.appendChild(placeholder);

      const groupsByType = new Map(); // groupLabel -> Set(subTypeLabel)

      data.forEach((p) => {
        const groupLabel = getTypeGroupLabel(p);
        const typeLabel = getTypeDisplayLabel(p);
        if (!groupLabel || !typeLabel) return;
        if (!groupsByType.has(groupLabel)) {
          groupsByType.set(groupLabel, new Set());
        }
        groupsByType.get(groupLabel).add(typeLabel);
      });

      const groupOrder = [
        "מוצרי איפור",
        "טיפוח לפנים",
        "הלבנה וטיפוח השיניים",
        "טיפוח לגוף",
        "עיצוב שיער",
        "הגנה מהשמש",
        "בשמים",
        "טיפוח לגבר",
        "אחר"
      ];

      groupOrder.forEach((groupLabel) => {
        const set = groupsByType.get(groupLabel);
        if (!set || set.size === 0) return;

        const optGroup = document.createElement("optgroup");
        optGroup.label = groupLabel;

        Array.from(set)
          .sort((a, b) => a.localeCompare(b, "he"))
          .forEach((typeLabel) => {
            const o = document.createElement("option");
            o.value = `${groupLabel}::${typeLabel}`;
            o.textContent = typeLabel;
            optGroup.appendChild(o);
          });

        typeSelect.appendChild(optGroup);
      });
    }
  }

  function matches(p) {
    const text = (q?.value || "").trim().toLowerCase();
    const brand = brandSelect?.value || "";
    const store = storeSelect?.value || "";
    const typeVal = typeSelect?.value || ""; // "קבוצה::תת-קטגוריה"

    const predicates = [
      // פילטר קטגוריות עליונות (chips)
      () => currentCat === "all" || getCats(p).includes(normCat(currentCat)),

      // Brand
      () => !brand || p.brand === brand,

      // Store
      () => !store || (p.offers || []).some((o) => o.store === store),

      // ✅ Type לפי קבוצה + תת-קטגוריה
      () => {
        if (!typeVal) return true;
        const [groupSel, typeSel] = typeVal.split("::");
        const group = getTypeGroupLabel(p);
        if (group !== groupSel) return false;
        const typeLabel = getTypeDisplayLabel(p);
        return typeLabel === typeSel;
      },

      // Approvals
      () => !onlyLB?.checked || p.isLB,
      () => !onlyPeta?.checked || p.isPeta,
      () => !onlyVegan?.checked || p.isVegan,
      () => !onlyIsrael?.checked || p.isIsrael,

      // Only products with "free shipping over"
      () => {
        if (!onlyFreeShip?.checked) return true;
        const best = getProductMinFreeShip(p);
        return best != null;
      },

      // Price range
      () => {
        const val = priceRangeSelect?.value || "";
        if (!val) return true;

        const range = getProductPriceRange(p);
        if (!range) return false;

        const [pMin, pMax] = range;
        const parts = val.split("-").map(Number);
        if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1]))
          return true;

        const [minVal, maxVal] = parts;
        if (pMax < minVal) return false;
        if (pMin > maxVal) return false;
        return true;
      },

      // חיפוש טקסט חופשי
      () => {
        if (!text) return true;
        const hay = `${p.brand || ""} ${p.name || ""} ${getCats(p).join(" ")}`.toLowerCase();
        return hay.includes(text);
      }
    ];

    return predicates.every((fn) => fn());
  }

  function updatedTs(v) {
    if (typeof v === "number") return v;
    const t = Date.parse(String(v || ""));
    return Number.isFinite(t) ? t : 0;
  }

  function sortList(list) {
    const v = sortSel?.value || "updated";

    if (v === "brand-az") {
      list.sort((a, b) =>
        String(a.brand || "").localeCompare(String(b.brand || ""), "he") ||
        String(a.name || "").localeCompare(String(b.name || ""), "he")
      );
      return;
    }

    if (v === "name-az") {
      list.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "he") ||
        String(a.brand || "").localeCompare(String(b.brand || ""), "he")
      );
      return;
    }

    list.sort((a, b) => {
      const diff = updatedTs(b.updated) - updatedTs(a.updated);
      if (diff) return diff;
      return (
        String(a.brand || "").localeCompare(String(b.brand || ""), "he") ||
        String(a.name || "").localeCompare(String(b.name || ""), "he")
      );
    });
  }

  function tag(label) {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = label;
    return s;
  }

  let renderRaf = 0;
  function scheduleRender() {
    cancelAnimationFrame(renderRaf);
    renderRaf = requestAnimationFrame(render);
  }

  function render() {
    if (!grid) return;

    const list = data.filter(matches);
    sortList(list);

    const frag = document.createDocumentFragment();

    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "productCard";

      const media = document.createElement("div");
      media.className = "pMedia";
      if (p.image) {
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name || "";
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 640;
        img.height = 640;
        media.appendChild(img);
      } else {
        const ph = document.createElement("div");
        ph.className = "pPlaceholder";
        ph.textContent = "🧴";
        ph.setAttribute("aria-hidden", "true");
        media.appendChild(ph);
      }

      const content = document.createElement("div");
      content.className = "pContent";

      const header = document.createElement("div");
      header.className = "pHeader";

      const titleWrap = document.createElement("div");
      titleWrap.className = "pTitleWrap";

      const brand = document.createElement("div");
      brand.className = "pBrand";
      brand.textContent = p.brand || "";

      const name = document.createElement("div");
      name.className = "pName";
      name.textContent = p.name || "";

      titleWrap.appendChild(brand);
      titleWrap.appendChild(name);

      const meta = document.createElement("div");
      meta.className = "pMeta";

      const categoryLabel = getCategoryLabelFromProduct(p);
      if (categoryLabel) {
        const c = document.createElement("span");
        c.className = "pMetaPill";
        c.textContent = categoryLabel;
        meta.appendChild(c);
      }

      if (p.size) {
        const s = document.createElement("span");
        s.className = "pMetaPill";
        s.textContent = formatSizeForIsrael(p.size);
        meta.appendChild(s);
      }

      const approvals = [];
      if (p.isPeta) approvals.push("PETA");
      if (p.isVegan) approvals.push("Vegan");
      if (p.isLB) approvals.push("Leaping Bunny");

      if (approvals.length) {
        const ap = document.createElement("span");
        ap.className = "pMetaPill";
        ap.textContent = `מאושר: ${approvals.join(", ")}`;
        meta.appendChild(ap);
      }

      const bestOffer = getOfferWithMinFreeShip(p);
      if (bestOffer) {
        const fs = document.createElement("span");
        fs.className = "pMetaPill pMetaPill--freeShip";
        fs.textContent = formatFreeShipText(bestOffer);
        meta.appendChild(fs);
      }

      header.appendChild(titleWrap);
      header.appendChild(meta);

      const tags = document.createElement("div");
      tags.className = "tags";
      if (p.isLB) tags.appendChild(tag("Leaping Bunny"));
      if (p.isPeta) tags.appendChild(tag("PETA"));
      if (p.isVegan) tags.appendChild(tag("Vegan"));
      if (p.isIsrael) tags.appendChild(tag("אתר ישראלי"));

      const offerList = document.createElement("div");
      offerList.className = "offerList";

      const offers = Array.isArray(p.offers) ? p.offers : [];
      offers.forEach((o) => {
        const row = document.createElement("div");
        row.className = "offer";

        const metaBox = document.createElement("div");
        const storeLabel = getStoreDisplayName(p, o);
        const lines = [];

        if (o.meta) {
          lines.push(escapeHtml(o.meta || ""));
        }

        let inner = `<div class="offerStore">${escapeHtml(storeLabel)}</div>`;
        if (lines.length) {
          inner += `<div class="offerMeta">${lines.join(" · ")}</div>`;
        }
        metaBox.innerHTML = inner;

        const a = document.createElement("a");
        a.className = "btn primary";
        a.href = o.url || "#";
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "לצפייה";

        row.appendChild(metaBox);
        row.appendChild(a);
        offerList.appendChild(row);
      });

      content.appendChild(header);
      content.appendChild(tags);

      const priceRange = getProductPriceRange(p);
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange;
        const pr = document.createElement("div");
        pr.className = "pPriceRange";
        if (minPrice === maxPrice) {
          pr.textContent = `מחיר: ₪${minPrice}`;
        } else {
          pr.textContent = `טווח מחירים: ₪${minPrice} - ₪${maxPrice}`;
        }
        content.appendChild(pr);
      }

      content.appendChild(offerList);

      card.appendChild(media);
      card.appendChild(content);

      frag.appendChild(card);
    });

    grid.replaceChildren(frag);

    if (liveCount) liveCount.textContent = `${list.length} מוצרים`;

    const empty = qs("#emptyState");
    if (empty) empty.hidden = list.length !== 0;
  }

  function bind() {
    const toolbar = document.querySelector(".toolbar-container");

    toolbar?.addEventListener("input", (e) => {
      if (
        e.target &&
        e.target.matches(
          "#q, #brandSelect, #storeSelect, #typeSelect, #sort, #onlyLB, #onlyPeta, #onlyVegan, #onlyIsrael, #onlyFreeShip, #priceRange"
        )
      ) {
        scheduleRender();
      }
    });

    toolbar?.addEventListener("change", (e) => {
      if (
        e.target &&
        e.target.matches("#brandSelect, #storeSelect, #typeSelect, #sort")
      ) {
        scheduleRender();
      }
    });

    document.addEventListener("click", (e) => {
      const chip = e.target?.closest?.(".chip");
      if (chip) {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        currentCat = chip.dataset.cat || "all";
        scheduleRender();
        return;
      }

      if (e.target?.closest?.("#clearFilters")) {
        if (q) q.value = "";
        if (brandSelect) brandSelect.value = "";
        if (storeSelect) storeSelect.value = "";
        if (typeSelect) typeSelect.value = "";
        if (sortSel) sortSel.value = "updated";
        [onlyLB, onlyPeta, onlyVegan, onlyIsrael, onlyFreeShip].forEach((c) => {
          if (c) c.checked = false;
        });
        if (priceRangeSelect) priceRangeSelect.value = "";
        chips.forEach((c) => c.classList.remove("active"));
        const all = chips.find((c) => c.dataset.cat === "all");
        all && all.classList.add("active");
        currentCat = "all";
        scheduleRender();
      }
    });
  }

  buildSelects();
  bind();
  render();
})();
