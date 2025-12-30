
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
  const count = qs('#count');
  const liveCount = qs('#liveCount');
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

  function unique(arr){ return Array.from(new Set(arr)).filter(Boolean).sort((a,b)=>a.localeCompare(b,'he')); }

  function buildSelects(){
    unique(data.map(p=>p.brand)).forEach(b=>{
      const o=document.createElement('option'); o.value=b; o.textContent=b; brandSelect.appendChild(o);
    });
    unique(data.flatMap(p=>p.offers.map(o=>o.store))).forEach(s=>{
      const o=document.createElement('option'); o.value=s; o.textContent=s; storeSelect.appendChild(o);
    });
  }

  function matches(p){
    const text=(q?.value||'').trim().toLowerCase();
    const brand=brandSelect?.value||'';
    const store=storeSelect?.value||'';
    if(currentCat!=='all' && p.cat!==currentCat) return false;
    if(brand && p.brand!==brand) return false;
    if(store && !p.offers.some(o=>o.store===store)) return false;
    if(onlyLB?.checked && !p.lb) return false;
    if(onlyPeta?.checked && !p.peta) return false;
    if(onlyVegan?.checked && !p.vegan) return false;
    if(onlyIsrael?.checked && !p.israel) return false;
    if(text){
      const hay=(p.brand+' '+p.name+' '+p.cat).toLowerCase();
      if(!hay.includes(text)) return false;
    }
    return true;
  }

  function sortList(list){
    const v=sortSel?.value||'updated';
    if(v==='brand-az') list.sort((a,b)=>a.brand.localeCompare(b.brand,'he'));
    else if(v==='name-az') list.sort((a,b)=>a.name.localeCompare(b.name,'he'));
    else list.sort((a,b)=>String(b.updated||'').localeCompare(String(a.updated||'')));
  }

  function tag(label){
    const s=document.createElement('span'); s.className='tag'; s.textContent=label; return s;
  }

  function render(){
    if(!grid) return;
    const list=data.filter(matches);
    sortList(list);
    grid.innerHTML='';
    list.forEach(p=>{
      const card=document.createElement('article');
      card.className='productCard';
      const top=document.createElement('div'); top.className='pTop';
      const left=document.createElement('div');
      const brand=document.createElement('div'); brand.className='pBrand'; brand.textContent=p.brand;
      const name=document.createElement('div'); name.className='pName'; name.textContent=p.name;
      left.appendChild(brand); left.appendChild(name);

      const tags=document.createElement('div'); tags.className='tags';
      if(p.lb) tags.appendChild(tag('Leaping Bunny'));
      if(p.peta) tags.appendChild(tag('PETA'));
      if(p.vegan) tags.appendChild(tag('Vegan'));
      if(p.israel) tags.appendChild(tag('אתר ישראלי'));
      left.appendChild(tags);

      const offerList=document.createElement('div'); offerList.className='offerList';
      p.offers.forEach(o=>{
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

    if(count) count.textContent = `${list.length} מוצרים`;
    if(liveCount) liveCount.textContent = String(list.length);
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
