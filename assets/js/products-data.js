// Sample data. Replace / expand with your real data in production.
window.PRODUCTS = [
  // 1) AXIS-Y – face mask
  {
    id: "axisy-mugwort-pack",
    brand: "AXIS-Y",
    name: `מסכת חימר לפנים לשטיפה, המסייעת לניקוי והבהרת נקבוביות, מטפלת בנקבוביות סתומות, ראשים שחורים ולבנים.
טיפוח עור קוריאני טבעוני למראה עור חלק וזוהר (Glass Skin).`,
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-mask",
    productTypeLabel: "מסכת פנים",
    vegan: true,
    peta: true,
    lb: false,
    isVegan: true,
    isPeta: true,
    isLB: false,
    isIsrael: false,
    size: "100 מ״ל",
    storeRegion: "us",
    image: "",
    affiliateLink: "https://amzn.to/4plbYmu",
    tags: ["Vegan"],
    // טווח מחירים משוער בש״ח
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4plbYmu",
        meta: "אמזון ארה״ב",
        price: 100
      }
    ]
  },

  // ---- Charlotte Tilbury Beauty – Amazon US (Leaping Bunny) ----
  {
    id: "charlottetilbury-lip-lustre-blondie",
    brand: "Charlotte Tilbury Beauty",
    name: "גלוס לחות לשפתיים Lip Lustre – גוון Blondie",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "lip-gloss",
    productTypeLabel: "גלוס לשפתיים",
    isVegan: false,
    isPeta: false,
    isLB: true,   // Leaping Bunny / CFI
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "4 מ״ל", // הערכה – אפשר לעדכן אם יש נתון מדויק
    storeRegion: "us",
    // $26 ≈ 90 ₪ → טווח 50–100
    priceMin: 50,
    priceMax: 100,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3MZwRX3",
        meta: "אמזון ארה״ב",
        price: 90,
        freeShipOver: 170 // משלוח חינם מעל $49 ≈ ₪170
      }
    ]
  },

  // ---- bareMinerals – Amazon US (PETA, Vegan) ----
  {
    id: "bareminerals-gen-nude-powder-blush",
    brand: "bareMinerals",
    name: "Gen Nude סומק אבקתי לפנים",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "blush",
    productTypeLabel: "סומק לפנים",
    isVegan: true,
    isPeta: true,
    isLB: false,
    vegan: true,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "0.21 oz",
    storeRegion: "us",
    // $25.98 ≈ 90 ₪ → טווח 50–100
    priceMin: 50,
    priceMax: 100,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4pgf0IB",
        meta: "אמזון ארה״ב",
        price: 90,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bareminerals-original-matte-loose-foundation",
    brand: "bareMinerals",
    name: "Original Matte מייקאפ אבקתי עם SPF 15",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "loose-foundation",
    productTypeLabel: "מייקאפ מינרלי אבקתי",
    isVegan: true,
    isPeta: true,
    isLB: false,
    vegan: true,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "0.21 oz",
    storeRegion: "us",
    // $39 ≈ 135 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4jnInaF",
        meta: "אמזון ארה״ב",
        price: 135,
        freeShipOver: 170
      }
    ]
  },

  // ---- Bellapierre – Amazon US (Leaping Bunny) ----
  {
    id: "bellapierre-hd-smoothing-primer",
    brand: "Bellapierre",
    name: "HD Smoothing פריימר מחליק למראה חלק",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "primer",
    productTypeLabel: "פריימר לפנים",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "1.01 fl oz",
    storeRegion: "us",
    // $40 ≈ 140 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4suhjLg",
        meta: "אמזון ארה״ב",
        price: 140,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bellapierre-mineral-blush-03oz",
    brand: "Bellapierre",
    name: "סומק מינרלי Bellapierre",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "blush",
    productTypeLabel: "סומק לפנים",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "0.3 oz",
    storeRegion: "us",
    // $29.98 ≈ 105 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4qDMjGN",
        meta: "אמזון ארה״ב",
        price: 105,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bellapierre-mineral-bronzer-03oz",
    brand: "Bellapierre",
    name: "ברונזר מינרלי Bellapierre",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "bronzer",
    productTypeLabel: "ברונזר לפנים",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "0.3 oz",
    storeRegion: "us",
    // $29.98 ≈ 105 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4jowjWw",
        meta: "אמזון ארה״ב",
        price: 105,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bellapierre-banana-setting-powder-014oz",
    brand: "Bellapierre",
    name: "Banana פודרה בננה לקיבוע והבהרה",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "setting-powder",
    productTypeLabel: "פודרה לקיבוע",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "0.14 oz",
    storeRegion: "us",
    // $14.99 ≈ ~50 ₪ → טווח 0–50
    priceMin: 0,
    priceMax: 50,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3Lp2zMR",
        meta: "אמזון ארה״ב",
        price: 50,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bellapierre-get-started-kit-medium",
    brand: "Bellapierre",
    name: "Get Started Kit ערכת בסיס מינרלית (מידות בינוניות)",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "makeup-kit",
    productTypeLabel: "ערכת איפור בסיס",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "",
    storeRegion: "us",
    // $60 ≈ 210 ₪ → טווח 200–300
    priceMin: 200,
    priceMax: 300,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4q751GZ",
        meta: "אמזון ארה״ב",
        price: 210,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bellapierre-bb-cream-spf20-50ml",
    brand: "Bellapierre",
    name: "BB Cream SPF 20 קרם BB מינרלי",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "bb-cream",
    productTypeLabel: "קרם BB לפנים",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "50 מ״ל",
    storeRegion: "us",
    // $44.98 ≈ 155 ₪ → טווח 150–200
    priceMin: 150,
    priceMax: 200,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/49mhCic",
        meta: "אמזון ארה״ב",
        price: 155,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bellapierre-banana-setting-powder-medium-duplicate",
    brand: "Bellapierre",
    name: "Banana Setting Powder – גוון Medium",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "setting-powder",
    productTypeLabel: "פודרה לקיבוע",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "0.14 oz",
    storeRegion: "us",
    // $14.99 ≈ ~50 ₪ → טווח 0–50
    priceMin: 0,
    priceMax: 50,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3YT7FE2",
        meta: "אמזון ארה״ב",
        price: 50,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "bellapierre-mineral-blush-autumn-glow",
    brand: "Bellapierre",
    name: "סומק מינרלי – גוון Autumn Glow",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "blush",
    productTypeLabel: "סומק לפנים",
    isVegan: false,
    isPeta: false,
    isLB: true,
    vegan: false,
    peta: false,
    lb: true,
    isIsrael: false,
    size: "0.3 oz",
    storeRegion: "us",
    // $29.98 ≈ 105 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3N3ZPFd",
        meta: "אמזון ארה״ב",
        price: 105,
        freeShipOver: 170
      }
    ]
  },

  // ---- Paula's Choice – Amazon US (PETA + Leaping Bunny, לא טבעוני) ----
  {
    id: "paulaschoice-skin-recovery-toner-190",
    brand: "Paula's Choice",
    name: "Skin Recovery טונר מרגיע לעור יבש ורגיש",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-toner",
    productTypeLabel: "טונר לפנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "190 מ״ל",
    storeRegion: "us",
    // $29 ≈ 100 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4b1fgrN",
        meta: "אמזון ארה״ב",
        price: 100,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-mandelic-lactic-exfoliant",
    brand: "Paula's Choice",
    name: "פילינג 6% מנדליק + 2% לקטיק לעור רגיש",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-exfoliant",
    productTypeLabel: "פילינג כימי לפנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "88 מ״ל",
    storeRegion: "us",
    // $37 ≈ 130 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3LiHaF5",
        meta: "אמזון ארה״ב",
        price: 130,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-resist-barrier-repair-moisturizer",
    brand: "Paula's Choice",
    name: "RESIST Barrier Repair קרם לחות משקם לפנים",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-cream",
    productTypeLabel: "קרם פנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "50 מ״ל",
    storeRegion: "us",
    // $33.60 ≈ 120 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3LoZP21",
        meta: "אמזון ארה״ב",
        price: 120,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-weightless-body-lotion-bha",
    brand: "Paula's Choice",
    name: "Weightless קרם גוף טיפולי 2% BHA",
    category: "body",
    categoryLabel: "גוף",
    productTypeKey: "body-lotion",
    productTypeLabel: "קרם גוף",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "210 מ״ל",
    storeRegion: "us",
    // $32 ≈ 110 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4sueDgG",
        meta: "אמזון ארה״ב",
        price: 110,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-2bha-liquid-exfoliant-118-30-kit",
    brand: "Paula's Choice",
    name: "סט SKIN PERFECTING 2% BHA ליקוויד (118 מ״ל + 30 מ״ל)",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-exfoliant",
    productTypeLabel: "פילינג כימי לפנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "118 מ״ל + 30 מ״ל",
    storeRegion: "us",
    // $44.50 ≈ 155 ₪ → טווח 150–200
    priceMin: 150,
    priceMax: 200,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4spumxk",
        meta: "אמזון ארה״ב",
        price: 155,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-2bha-liquid-exfoliant-118",
    brand: "Paula's Choice",
    name: "SKIN PERFECTING 2% BHA ליקוויד אקספוליאנט",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-exfoliant",
    productTypeLabel: "פילינג כימי לפנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "118 מ״ל",
    storeRegion: "us",
    // $29.60 ≈ 105 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4slX0PM",
        meta: "אמזון ארה״ב",
        price: 105,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-pro-collagen-peptide-moisturizer",
    brand: "Paula's Choice",
    name: "Pro-Collagen Peptide קרם לחות ממלא לפנים",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-cream",
    productTypeLabel: "קרם פנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "50 מ״ל",
    storeRegion: "us",
    // $39.20 ≈ 135 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3Naceaw",
        meta: "אמזון ארה״ב",
        price: 135,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-clinical-1-retinol-moisturizer",
    brand: "Paula's Choice",
    name: "CLINICAL קרם 1% רטינול לפנים",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-cream",
    productTypeLabel: "קרם פנים טיפולי",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "30 מ״ל",
    storeRegion: "us",
    // $52 ≈ 180 ₪ → טווח 150–200
    priceMin: 150,
    priceMax: 200,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4sfTUge",
        meta: "אמזון ארה״ב",
        price: 180,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-clinical-0-3-retinol-bakuchiol-serum",
    brand: "Paula's Choice",
    name: "CLINICAL סרום 0.3% רטינול + 2% בקוצ׳יול",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-serum",
    productTypeLabel: "סרום פנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "30 מ״ל",
    storeRegion: "us",
    // $65 ≈ 230 ₪ → טווח 200–300
    priceMin: 200,
    priceMax: 300,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/49qciun",
        meta: "אמזון ארה״ב",
        price: 230,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-2bha-exfoliant-10pads",
    brand: "Paula's Choice",
    name: "SKIN PERFECTING 2% BHA פדים לניגוב",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-exfoliant",
    productTypeLabel: "פילינג כימי לפנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "10 פדים",
    storeRegion: "us",
    // $12.80 ≈ 45 ₪ → טווח 0–50
    priceMin: 0,
    priceMax: 50,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4js97XE",
        meta: "אמזון ארה״ב",
        price: 45,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "paulaschoice-resist-balanced-cleanser",
    brand: "Paula's Choice",
    name: "RESIST Perfectly Balanced ג׳ל ניקוי לפנים",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-cleanser",
    productTypeLabel: "ג׳ל ניקוי לפנים",
    isVegan: false,
    isPeta: true,
    isLB: true,
    vegan: false,
    peta: true,
    lb: true,
    isIsrael: false,
    size: "190 מ״ל",
    storeRegion: "us",
    // $20.80 ≈ 75 ₪ → טווח 50–100
    priceMin: 50,
    priceMax: 100,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4slXxBg",
        meta: "אמזון ארה״ב",
        price: 75,
        freeShipOver: 170
      }
    ]
  },

  // 2) AG Care – Amazon US hair products (PETA, price buckets)
  {
    id: "ag-care-fast-leave-conditioner",
    brand: "AG Care",
    name: "מרכך ללא שטיפה AG Care Conditioner",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "leave-in-conditioner",
    productTypeLabel: "מרכך ללא שטיפה",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "237 מ״ל",
    storeRegion: "us",
    // $28 ≈ ~100 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/45pSjKY",
        meta: "אמזון ארה״ב",
        price: 100,
        freeShipOver: 160
      }
    ]
  },
  {
    id: "ag-care-recoil-curl-activator",
    brand: "AG Care",
    name: "קרם תלתלים Re:Coil Curl Activator",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "curl-cream",
    productTypeLabel: "קרם תלתלים",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "355 מ״ל",
    storeRegion: "us",
    // $42 ≈ ~145 ₪ → עדיין בטווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3LcBi06",
        meta: "אמזון ארה״ב",
        price: 145,
        freeShipOver: 160
      }
    ]
  },
  {
    id: "ag-care-curl-thrive-conditioner",
    brand: "AG Care",
    name: "Curl Thrive מרכך לחות לתלתלים",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "hair-conditioner",
    productTypeLabel: "מרכך לשיער מתולתל",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "237 מ״ל",
    storeRegion: "us",
    // $28 ≈ ~100 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4qzCNnZ",
        meta: "אמזון ארה״ב",
        price: 100,
        freeShipOver: 160
      }
    ]
  },
  {
    id: "ag-care-conditioning-mist-detangling-spray",
    brand: "AG Care",
    name: "ספריי מתיר קשרים Conditioning Mist",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "detangling-spray",
    productTypeLabel: "ספריי מתיר קשרים",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "355 מ״ל",
    storeRegion: "us",
    // $30 ≈ ~105 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/3Ynjpia",
        meta: "אמזון ארה״ב",
        price: 105,
        freeShipOver: 165
      }
    ]
  },
  {
    id: "ag-care-boost-acv-conditioner",
    brand: "AG Care",
    name: "Boost מרכך חומץ תפוחים ומנגו",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "hair-conditioner",
    productTypeLabel: "מרכך לשיער",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "355 מ״ל",
    storeRegion: "us",
    // $36 ≈ ~125 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/495E4xp",
        meta: "אמזון ארה״ב",
        price: 125,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "ag-care-curl-details-defining-cream",
    brand: "AG Care",
    name: "Curl Details קרם להגדרת תלתלים",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "curl-cream",
    productTypeLabel: "קרם תלתלים",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "178 מ״ל",
    storeRegion: "us",
    // $26 ≈ ~90 ₪ → טווח 50–100
    priceMin: 50,
    priceMax: 100,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/49mlrnN",
        meta: "אמזון ארה״ב",
        price: 90,
        freeShipOver: 170
      }
    ]
  },
  {
    id: "ag-care-foam-weightless-volumizer",
    brand: "AG Care",
    name: "Foam מוס ווליום Weightless Volumizer",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "hair-mousse",
    productTypeLabel: "מוס לשיער",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "148 מ״ל",
    storeRegion: "us",
    // $26 ≈ ~90 ₪ → טווח 50–100
    priceMin: 50,
    priceMax: 100,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4pmKQDO",
        meta: "אמזון ארה״ב",
        price: 90,
        freeShipOver: 175
      }
    ]
  },
  {
    id: "ag-care-curl-fresh-coconut-avocado-conditioner",
    brand: "AG Care",
    name: "Curl Fresh מרכך קוקוס ואבוקדו",
    category: "hair",
    categoryLabel: "שיער",
    productTypeKey: "hair-conditioner",
    productTypeLabel: "מרכך לחות לשיער מתולתל",
    isVegan: false,
    isPeta: true,
    isLB: false,
    vegan: false,
    peta: true,
    lb: false,
    isIsrael: false,
    size: "355 מ״ל",
    storeRegion: "us",
    // $36 ≈ ~125 ₪ → טווח 100–150
    priceMin: 100,
    priceMax: 150,
    updated: "2026-01-03",
    image: "",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4qCtXGe",
        meta: "אמזון ארה״ב",
        price: 125,
        freeShipOver: 175
      }
    ]
  },

  // 3) Ahura New York – solid perfume
  {
    id: "ahuranewyork-perfume-balm-rose",
    brand: "Ahura New York",
    name: `בושם מוצק למריחה (Rub-On), בניחוח חושני ועדין, עם תווים של פלפל ורוד, ורד טורקי, ענבר ופפירוס.
ללא אלכוהול, עבודת יד. ניחוח ורדים (Rose).`,
    category: "fragrance",
    categoryLabel: "בישום",
    productTypeKey: "solid-perfume",
    productTypeLabel: "בושם מוצק",
    vegan: true,
    peta: true,
    lb: true,
    isVegan: true,
    isPeta: true,
    isLB: true,
    isIsrael: false,
    size: "60 מ״ל",
    storeRegion: "uk",
    image: "",
    storeName: "Amazon",
    affiliateLink: "https://amzn.to/4q3CYrU",
    tags: ["Vegan"],
    priceMin: 150,
    priceMax: 200,
    updated: "2026-01-03",
    offers: [
      {
        store: "Amazon",
        url: "https://amzn.to/4q3CYrU",
        meta: "אמזון אנגליה",
        price: 180,
        freeShipOver: 160 // בש״ח
      }
    ]
  },

  // 4) Sample Israeli products (דוגמה בלבד)
  {
    id: "narkis-cosmetics-vitc-serum-sample",
    brand: "נרקיס קוסמטיקס",
    name: "סרום ויטמין C להבהרה ואחידות גוון — מוצר לדוגמה",
    category: "face",
    categoryLabel: "פנים",
    productTypeKey: "face-serum",
    productTypeLabel: "סרום פנים",
    vegan: true,
    peta: false,
    lb: false,
    isVegan: true,
    isPeta: false,
    isLB: false,
    storeRegion: "il",
    isIsrael: true,
    size: "30 מ״ל",
    image: "assets/img/photos/care-products.png",
    priceMin: 120,
    priceMax: 150,
    updated: "2025-12-31",
    offers: [
      {
        store: "אתר המותג",
        url: "https://example.com",
        meta: "מותג ישראלי (דוגמה)",
        price: 135
      }
    ]
  },
  {
    id: "levana-beauty-mascara-sample",
    brand: "לבנה ביוטי",
    name: "מסקרה שחורה עמידה עם מברשת סיליקון — מוצר לדוגמה",
    category: "makeup",
    categoryLabel: "איפור",
    productTypeKey: "mascara",
    productTypeLabel: "מסקרה",
    vegan: true,
    peta: true,
    lb: false,
    isVegan: true,
    isPeta: true,
    isLB: false,
    storeRegion: "il",
    isIsrael: true,
    size: "10 מ״ל",
    image: "assets/img/photos/index-card.jpg",
    priceMin: 60,
    priceMax: 80,
    updated: "2025-12-31",
    offers: [
      {
        store: "אתר המותג",
        url: "https://example.com",
        meta: "מותג ישראלי (דוגמה)",
        price: 70
      }
    ]
  }
];
