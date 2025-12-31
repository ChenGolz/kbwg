// Products page logic (RTL-friendly, data-normalized, performant)
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
      // Canonical booleans (supports old keys too)
      isLB: Boolean(p?.isLB ?? p?.lb ?? p?.isLeapingBunny),
      isPeta: Boolean(p?.isPeta ?? p?.peta),
      isVegan: Boolean(p?.isVegan ?? p?.vegan),
      isIsrael: Boolean(p?.isIsrael ?? p?.israel ?? (storeRegion === "il")),
      // Canonical offers meta field (supports old "note")
      offers: offers.map((o) => ({
        ...o,
        meta: o?.meta ?? o?.note ?? "",
      })),
    };
  }

  const data = (window.PRODUCTS || []).map(normalizeProduct);

  function unique(arr) {
    return Array.from(new Set(arr))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "he"));
  }

  // --- Category normalization (fixes mismatched values like "Fragrances"/"fragrance ") ---
  const CAT_ALIASES = {
    fragrances: "fragrance",
    perfume: "fragrance",
    perfumes: "fragrance",
    frag: "fragrance",
  };
  function normCat(v) {
    const s = String(v ?? "").trim().toLowerCase();
    return CAT_ALIASES[s] || s;
  }
  function getCats(p) {
    if (Array.isArray(p?.categories)) return p.categories.map(normCat).filter(Boolean);
    if (p?.category != null) return [normCat(p.category)].filter(Boolean);
    if (p?.cat != null) return [normCat(p.cat)].filter(Boolean);
    return [];
  }

  function buildSelects() {
    if (brandSelect) {
      unique(data.map((p) => p.brand)).forEach((b) => {
        const o = document.createElement("option");
        o.value = b;
        o.textContent = b;
        brandSelect.appendChild(o);
      });
    }

    if (storeSelect) {
      unique(data.flatMap((p) => (p.offers || []).map((o) => o.store))).forEach((s) => {
        const o = document.createElement("option");
        o.value = s;
        o.textContent = s;
        storeSelect.appendChild(o);
      });
    }
  }

  function matches(p) {
    const text = (q?.value || "").trim().toLowerCase();
    const brand = brandSelect?.value || "";
    const store = storeSelect?.value || "";

    const predicates = [
      () => currentCat === "all" || getCats(p).includes(normCat(currentCat)),
      () => !brand || p.brand === brand,
      () => !store || (p.offers || []).some((o) => o.store === store),
      () => !onlyLB?.checked || p.isLB,
      () => !onlyPeta?.checked || p.isPeta,
      () => !onlyVegan?.checked || p.isVegan,
      () => !onlyIsrael?.checked || p.isIsrael,
      () => {
        if (!text) return true;
        const hay = `${p.brand || ""} ${p.name || ""} ${getCats(p).join(" ")}`.toLowerCase();
        return hay.includes(text);
      },
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

    // Default: newest first. Stable tiebreakers for consistent results.
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

      // Media (optional)
      const media = document.createElement("div");
      media.className = "pMedia";
      if (p.image) {
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name || "";
        img.loading = "lazy";
        img.decoding = "async";
        // Prevent CLS even if images are missing for many products
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

      const cats = getCats(p);
      if (cats.length) {
        const c = document.createElement("span");
        c.className = "pMetaPill";
        c.textContent = cats[0];
        meta.appendChild(c);
      }
      if (p.size) {
        const s = document.createElement("span");
        s.className = "pMetaPill";
        s.textContent = p.size;
        meta.appendChild(s);
      }

      header.appendChild(titleWrap);
      header.appendChild(meta);

      const tags = document.createElement("div");
      tags.className = "tags";
      if (p.isLB) tags.appendChild(tag("Leaping Bunny"));
      if (p.isPeta) tags.appendChild(tag("PETA"));
      if (p.isVegan) tags.appendChild(tag("Vegan"));
      if (p.isIsrael) tags.appendChild(tag("אתר ישראלי"));

      // Offers
      const offerList = document.createElement("div");
      offerList.className = "offerList";

      const offers = Array.isArray(p.offers) ? p.offers : [];
      offers.forEach((o) => {
        const row = document.createElement("div");
        row.className = "offer";

        const metaBox = document.createElement("div");
        metaBox.innerHTML = `<div style="font-weight:900">${escapeHtml(o.store || "")}</div><div class="offerMeta">${escapeHtml(
          o.meta || ""
        )}</div>`;

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
    // Delegated filter inputs
    const toolbar = document.querySelector(".toolbar-container");
    toolbar?.addEventListener("input", (e) => {
      if (
        e.target &&
        e.target.matches(
          "#q, #brandSelect, #storeSelect, #sort, #onlyLB, #onlyPeta, #onlyVegan, #onlyIsrael"
        )
      ) {
        scheduleRender();
      }
    });
    toolbar?.addEventListener("change", (e) => {
      if (e.target && e.target.matches("#brandSelect, #storeSelect, #sort")) {
        scheduleRender();
      }
    });

    // Chips + clear
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
        if (sortSel) sortSel.value = "updated";
        [onlyLB, onlyPeta, onlyVegan, onlyIsrael].forEach((c) => {
          if (c) c.checked = false;
        });
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
