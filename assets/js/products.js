function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

(function () {
  const qs = (s) => document.querySelector(s);

  const q = qs("#q");
  const grid = qs("#grid");
  const liveCount = qs("#liveCount");
  const brandSelect = qs("#brandSelect");
  const storeSelect = qs("#storeSelect");
  const sortSel = qs("#sort");
  const clearBtn = qs("#clearFilters");
  const onlyLB = qs("#onlyLB");
  const onlyPeta = qs("#onlyPeta");
  const onlyVegan = qs("#onlyVegan");
  const onlyIsrael = qs("#onlyIsrael");
  const chips = Array.from(document.querySelectorAll(".chip"));
  let currentCat = "all";

  const data = (window.PRODUCTS || []).slice();

  // ---- Category normalization (fixes cases like "Fragrance" / "fragrances" / Hebrew labels, etc.)
  const CAT_ALIASES = {
    fragrances: "fragrance",
    perfume: "fragrance",
    perfumes: "fragrance",
    parfum: "fragrance",
    frag: "fragrance",
    make_up: "makeup",
    "make-up": "makeup",
    skincare: "face",
    skin: "face",
    bath: "body",
    shower: "body",
  };

  function normCat(v) {
    const s = String(v ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/_+/g, "-");
    if (!s) return "";

    // Hebrew / mixed label fallbacks
    if (/[\u0590-\u05FF]/.test(s)) {
      if (s.includes("בישום")) return "fragrance";
      if (s.includes("איפור")) return "makeup";
      if (s.includes("פנים")) return "face";
      if (s.includes("שיער")) return "hair";
      if (s.includes("רחצה") || s.includes("גוף")) return "body";
      if (s.includes("תינוק")) return "baby";
      if (s.includes("בריאות")) return "health";
    }

    return CAT_ALIASES[s] || s;
  }

  function getCats(p) {
    const raw = [];
    if (Array.isArray(p.cats)) raw.push(...p.cats);
    if (Array.isArray(p.categories)) raw.push(...p.categories);
    if (p.category) raw.push(p.category);
    if (p.cat) raw.push(p.cat);
    return Array.from(new Set(raw.map(normCat).filter(Boolean)));
  }

  function unique(arr) {
    return Array.from(new Set(arr))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "he"));
  }

  function safeOffers(p) {
    return Array.isArray(p?.offers) ? p.offers : [];
  }

  function buildSelects() {
    unique(data.map((p) => p.brand)).forEach((b) => {
      const o = document.createElement("option");
      o.value = b;
      o.textContent = b;
      brandSelect.appendChild(o);
    });

    unique(data.flatMap((p) => safeOffers(p).map((o) => o.store))).forEach((s) => {
      const o = document.createElement("option");
      o.value = s;
      o.textContent = s;
      storeSelect.appendChild(o);
    });
  }

  function matches(p) {
    const text = (q?.value || "").trim().toLowerCase();
    const brand = brandSelect?.value || "";
    const store = storeSelect?.value || "";

    const cats = getCats(p);
    if (currentCat !== "all" && !cats.includes(currentCat)) return false;

    if (brand && p.brand !== brand) return false;
    if (store && !safeOffers(p).some((o) => o.store === store)) return false;

    if (onlyLB?.checked && !p.lb) return false;
    if (onlyPeta?.checked && !p.peta) return false;
    if (onlyVegan?.checked && !p.vegan) return false;
    if (onlyIsrael?.checked && !p.israel) return false;

    if (text) {
      const hay = `${p.brand || ""} ${p.name || ""} ${cats.join(" ")}`.toLowerCase();
      if (!hay.includes(text)) return false;
    }

    return true;
  }

  function sortList(list) {
    const v = sortSel?.value || "updated";
    if (v === "brand-az") list.sort((a, b) => String(a.brand || "").localeCompare(String(b.brand || ""), "he"));
    else if (v === "name-az") list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "he"));
    else list.sort((a, b) => String(b.updated || "").localeCompare(String(a.updated || "")));
  }

  function tag(label) {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = label;
    return s;
  }

  function renderEmptyState() {
    const empty = document.createElement("div");
    empty.className = "emptyState";
    empty.innerHTML = `
      <div class="emptyTitle">לא נמצאו מוצרים 😕</div>
      <div class="emptyText">נסי לשנות קטגוריה, למחוק מסננים או לחפש מילה אחרת.</div>
      <button type="button" class="btn primary emptyBtn" id="emptyReset">איפוס מסננים</button>
    `;
    grid.appendChild(empty);

    const b = qs("#emptyReset");
    b && b.addEventListener("click", () => clearBtn?.click());
  }

  function render() {
    if (!grid) return;

    const list = data.filter(matches);
    sortList(list);

    grid.innerHTML = "";

    if (list.length === 0) {
      renderEmptyState();
      if (liveCount) liveCount.textContent = "0 מוצרים";
      return;
    }

    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "productCard";

      const left = document.createElement("div");
      left.className = "pLeft";

      const brand = document.createElement("div");
      brand.className = "pBrand";
      brand.textContent = p.brand || "";

      const name = document.createElement("div");
      name.className = "pName";
      name.textContent = p.name || "";

      left.appendChild(brand);
      left.appendChild(name);

      const tags = document.createElement("div");
      tags.className = "tags";
      if (p.lb) tags.appendChild(tag("Leaping Bunny"));
      if (p.peta) tags.appendChild(tag("PETA"));
      if (p.vegan) tags.appendChild(tag("Vegan"));
      if (p.size) tags.appendChild(tag(p.size));
      if (p.israel) tags.appendChild(tag("אתר ישראלי"));
      left.appendChild(tags);

      const offerList = document.createElement("div");
      offerList.className = "offerList";

      const offers = safeOffers(p);
      if (offers.length === 0) {
        const row = document.createElement("div");
        row.className = "offer offerEmpty";
        row.innerHTML = `<div class="offerMeta">אין קישור זמין כרגע</div>`;
        offerList.appendChild(row);
      } else {
        offers.forEach((o) => {
          const row = document.createElement("div");
          row.className = "offer";

          const meta = document.createElement("div");
          meta.className = "offerInfo";
          meta.innerHTML = `
            <div class="offerStore">${escapeHtml(o.store || "")}</div>
            <div class="offerMeta">${escapeHtml(o.meta || "")}</div>
          `;

          const a = document.createElement("a");
          a.className = "btn primary";
          a.href = o.url || "#";
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = "לצפייה";

          row.appendChild(meta);
          row.appendChild(a);
          offerList.appendChild(row);
        });
      }

      card.appendChild(left);
      card.appendChild(offerList);
      grid.appendChild(card);
    });

    if (liveCount) liveCount.textContent = `${list.length} מוצרים`;
  }

  function bind() {
    [q, brandSelect, storeSelect, sortSel, onlyLB, onlyPeta, onlyVegan, onlyIsrael].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    chips.forEach((ch) => {
      ch.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        ch.classList.add("active");
        currentCat = normCat(ch.dataset.cat || "all") || "all";
        render();
      });
    });

    clearBtn &&
      clearBtn.addEventListener("click", () => {
        if (q) q.value = "";
        if (brandSelect) brandSelect.value = "";
        if (storeSelect) storeSelect.value = "";
        if (sortSel) sortSel.value = "updated";
        [onlyLB, onlyPeta, onlyVegan, onlyIsrael].forEach((c) => {
          if (c) c.checked = false;
        });
        chips.forEach((c) => c.classList.remove("active"));
        const all = chips.find((c) => (c.dataset.cat || "") === "all");
        all && all.classList.add("active");
        currentCat = "all";
        render();
      });
  }

  // init
  buildSelects();
  bind();
  render();
})();
