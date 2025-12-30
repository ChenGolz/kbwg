
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/`/g, "&#096;");
}

function renderProductCard(p) {
  const badges = [];
  if (p.isVegan) badges.push('<span class="mini-badge">Vegan</span>');
  if (p.isPeta) badges.push('<span class="mini-badge">PETA</span>');
  if (p.isLB) badges.push('<span class="mini-badge">Leaping Bunny</span>');

  // Size
  if (p.size) badges.push(`<span class="mini-badge">${escapeHtml(p.size)}</span>`);

  // Store region (IL / Intl)
  const regionLabel = (p.israel === true) ? 'אתר ישראלי' : 'אתר בינלאומי';
  badges.push(`<span class="mini-badge">${regionLabel}</span>`);

  const imgHtml = p.image
    ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy">`
    : `<div class="product-placeholder" aria-hidden="true">🧴</div>`;

  return `
    <article class="product-card">
      <div class="product-img-wrap">
        ${imgHtml}
      </div>
      <div class="product-info">
        <div class="brand-name">${escapeHtml(p.brand || '')}</div>
        <h3 class="product-title">${escapeHtml(p.name || '')}</h3>

        <div class="card-badges">
          ${badges.join('')}
        </div>

        <a href="${escapeAttr(p.affiliateLink)}" target="_blank" rel="noopener" class="buy-btn">
          לקנייה באתר ${escapeHtml(p.store || p.storeName || '')}
        </a>
      </div>
    </article>
  `;
}
(function(){
  const qs = (s)=>document.querySelector(s);
  const q = qs('#q');
  const grid = qs('#grid');
  const liveCount = qs('#liveCount');
  const emptyState = qs('#emptyState');
  const brandSelect = qs('#brandSelect');
  const storeSelect = qs('#storeSelect');
  const sortSel = qs('#sort');
  const clearBtn = qs('#clearFilters');
  const onlyLB = qs('#onlyLB');
  const onlyPeta = qs('#onlyPeta');
  const onlyVegan = qs('#onlyVegan');
  const onlyIsrael = qs('#onlyIsrael');
  const chips = Array.from(document.querySelectorAll('.chip'));
  let currentCat = 'all';

  const data = (window.PRODUCTS || []).slice();

  function unique(arr){
    return Array.from(new Set(arr))
      .filter(v=>String(v||'').trim())
      .sort((a,b)=>String(a).localeCompare(String(b),'he'));
  }

  // Normalization for categories coming from different data shapes
  const CAT_ALIASES = {
    fragrances: 'fragrance',
    perfume: 'fragrance',
    perfumes: 'fragrance',
    bodywash: 'body',
    skincare: 'face'
  };
  function norm(str){
    return String(str ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g,'-');
  }
  function normCat(str){
    const key = norm(str);
    return CAT_ALIASES[key] || key;
  }
  function getCats(p){
    const raw = [];
    if (p.cat) raw.push(p.cat);
    if (p.category) raw.push(p.category);
    if (Array.isArray(p.categories)) raw.push(...p.categories);
    if (typeof p.categories === 'string') raw.push(p.categories);
    const cats = raw.map(normCat).filter(Boolean);
    return cats.length ? Array.from(new Set(cats)) : [''];
  }
  function pickBool(p, keys){
    for (const k of keys){
      if (p && typeof p[k] !== 'undefined') return !!p[k];
    }
    return false;
  }
  function getBrand(p){ return p.brand || p.brandName || p.manufacturer || ''; }
  function getNameParts(p){
    const raw = String(p.name || p.title || '').trim();
    const parts = raw.split(/\n+/).map(s=>s.trim()).filter(Boolean);
    if (!parts.length) return { title: '', desc: '' };
    const title = parts.shift();
    const desc = parts.join(' • ');
    return { title, desc };
  }
  function getOffers(p){
    if (Array.isArray(p.offers) && p.offers.length) return p.offers;
    // Support single-link products
    if (p.affiliateLink || p.url){
      return [{ store: p.store || p.storeName || 'לצפייה', url: p.affiliateLink || p.url, meta: p.meta || '' }];
    }
    return [];
  }

  function buildSelects(){
    unique(data.map(getBrand)).forEach(b=>{
      const o=document.createElement('option'); o.value=b; o.textContent=b; brandSelect.appendChild(o);
    });
    unique(data.flatMap(p=>getOffers(p).map(o=>o.store))).forEach(s=>{
      const o=document.createElement('option'); o.value=s; o.textContent=s; storeSelect.appendChild(o);
    });
  }

  function matches(p){
    const text=(q?.value||'').trim().toLowerCase();
    const brand=brandSelect?.value||'';
    const store=storeSelect?.value||'';
    const cats = getCats(p);
    if(currentCat!=='all' && !cats.includes(normCat(currentCat))) return false;
    const pBrand = getBrand(p);
    if(brand && pBrand!==brand) return false;
    const offers = getOffers(p);
    if(store && !offers.some(o=>o.store===store)) return false;
    const isLB = pickBool(p, ['lb','isLB','isLb','leapingBunny']);
    const isPeta = pickBool(p, ['peta','isPeta']);
    const isVegan = pickBool(p, ['vegan','isVegan']);
    const isIsrael = pickBool(p, ['israel','isIsrael']);
    if(onlyLB?.checked && !isLB) return false;
    if(onlyPeta?.checked && !isPeta) return false;
    if(onlyVegan?.checked && !isVegan) return false;
    if(onlyIsrael?.checked && !isIsrael) return false;
    if(text){
      const { title, desc } = getNameParts(p);
      const hay=(pBrand+' '+title+' '+desc+' '+cats.join(' ')+' '+offers.map(o=>o.store+' '+(o.meta||'')).join(' ')).toLowerCase();
      if(!hay.includes(text)) return false;
    }
    return true;
  }

  function sortList(list){
    const v=sortSel?.value||'updated';
    if(v==='brand-az') list.sort((a,b)=>String(getBrand(a)).localeCompare(String(getBrand(b)),'he'));
    else if(v==='name-az') list.sort((a,b)=>String(getNameParts(a).title).localeCompare(String(getNameParts(b).title),'he'));
    else list.sort((a,b)=>String(b.updated||b.updatedAt||'').localeCompare(String(a.updated||a.updatedAt||'')));
  }

  function tag(label){
    const s=document.createElement('span'); s.className='tag'; s.textContent=label; return s;
  }

  function render(){
    if(!grid) return;
    const list=data.filter(matches);
    sortList(list);
    grid.innerHTML='';

    if (emptyState) emptyState.hidden = list.length !== 0;

    list.forEach(p=>{
      const card=document.createElement('article');
      card.className='productCard';
      const left=document.createElement('div');
      const pBrand = getBrand(p);
      const { title, desc } = getNameParts(p);
      const brand=document.createElement('div'); brand.className='pBrand'; brand.textContent=pBrand;
      const name=document.createElement('div'); name.className='pName'; name.textContent=title;
      left.appendChild(brand); left.appendChild(name);

      if (desc){
        const d=document.createElement('div'); d.className='pDesc'; d.textContent=desc;
        left.appendChild(d);
      }

      const tags=document.createElement('div'); tags.className='tags';
      const isLB = pickBool(p, ['lb','isLB','isLb','leapingBunny']);
      const isPeta = pickBool(p, ['peta','isPeta']);
      const isVegan = pickBool(p, ['vegan','isVegan']);
      const isIsrael = pickBool(p, ['israel','isIsrael']);
      if(isLB) tags.appendChild(tag('Leaping Bunny'));
      if(isPeta) tags.appendChild(tag('PETA'));
      if(isVegan) tags.appendChild(tag('Vegan'));
      if(isIsrael) tags.appendChild(tag('אתר ישראלי'));
      left.appendChild(tags);

      const offerList=document.createElement('div'); offerList.className='offerList';
      const offers = getOffers(p);
      offers.forEach(o=>{
        const row=document.createElement('div'); row.className='offer';
        const meta=document.createElement('div');
        meta.innerHTML = `<div style="font-weight:900">${o.store}</div><div class="offerMeta">${o.meta||''}</div>`;
        const a=document.createElement('a'); a.className='btn primary'; a.href=o.url||'#'; a.textContent='לצפייה';
        row.appendChild(meta); row.appendChild(a);
        offerList.appendChild(row);
      });
      card.appendChild(left);
      card.appendChild(offerList);
      grid.appendChild(card);
    });

    if(liveCount) liveCount.textContent = `${list.length} מוצרים`;
  }

  function bind(){
    [q, brandSelect, storeSelect, sortSel, onlyLB, onlyPeta, onlyVegan, onlyIsrael].forEach(el=>{
      el && el.addEventListener('input', render);
      el && el.addEventListener('change', render);
    });
    chips.forEach(ch=>{
      ch.addEventListener('click', ()=>{
        chips.forEach(c=>c.classList.remove('active'));
        ch.classList.add('active');
        currentCat=ch.dataset.cat||'all';
        render();
      });
    });
    clearBtn && clearBtn.addEventListener('click', ()=>{
      if(q) q.value='';
      if(brandSelect) brandSelect.value='';
      if(storeSelect) storeSelect.value='';
      if(sortSel) sortSel.value='updated';
      [onlyLB, onlyPeta, onlyVegan, onlyIsrael].forEach(c=>{ if(c) c.checked=false; });
      chips.forEach(c=>c.classList.remove('active'));
      const all=chips.find(c=>c.dataset.cat==='all'); all && all.classList.add('active');
      currentCat='all';
      render();
    });
  }

  buildSelects();
  bind();
  render();
})();
