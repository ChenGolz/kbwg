/* KBWG Bundles — v15 (custom bundles)
   - Renders bundles from data/bundles.json exactly as provided (no filtering / dedupe across bundles)
   - Displays title, subtitle, description, tags + product preview
   - Button: "לפתיחת כל הלינקים" opens ALL product offer URLs in that bundle
   - If browser blocks popups, shows a modal with all links + copy button
*/

(function(){
  'use strict';

  // Build marker
  try { window.KBWG_BUNDLES_BUILD = '2026-01-23-v19'; console.info('[KBWG] Bundles build', window.KBWG_BUNDLES_BUILD); } catch(e) {}


  var FREE_SHIP_OVER_USD = 49;
  var USD_TO_ILS_DEFAULT = 3.3;

  function $(s,r){ return (r||document).querySelector(s); }
  function $all(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }

  function fmtUSD(n){
    var x = Number(n);
    if(!isFinite(x)) return '$—';
    return '$' + x.toFixed(2);
  }

  function fmtILS(n){
    var x = Number(n);
    if(!isFinite(x)) return '— ₪';
    return Math.round(x) + ' ₪';
  }

  function escapeHtml(s){
    return String(s==null?'':s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }


  function eligibleOffer(p){
    if(!p || !Array.isArray(p.offers)) return null;
    // Prefer Amazon US if present
    for(var i=0;i<p.offers.length;i++){
      if(p.offers[i] && p.offers[i].store === 'amazon-us') return p.offers[i];
    }
    // Otherwise first offer with a url
    for(var j=0;j<p.offers.length;j++){
      if(p.offers[j] && p.offers[j].url) return p.offers[j];
    }
    return null;
  }

  function usd(p){
    var o = eligibleOffer(p);
    return o && typeof o.priceUSD === 'number' ? o.priceUSD : null;
  }

  function ensureModal(){
    var existing = $('#kbwgLinksModal');
    if(existing) return existing;

    var overlay = document.createElement('div');
    overlay.id = 'kbwgLinksModal';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,.55)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none';
    overlay.style.padding = '18px';

    var box = document.createElement('div');
    box.style.maxWidth = '720px';
    box.style.margin = '0 auto';
    box.style.background = '#fff';
    box.style.borderRadius = '16px';
    box.style.padding = '16px';
    box.style.maxHeight = '85vh';
    box.style.overflow = 'auto';
    box.style.direction = 'rtl';

    var h = document.createElement('div');
    h.style.display = 'flex';
    h.style.alignItems = 'center';
    h.style.justifyContent = 'space-between';
    h.style.gap = '12px';

    var title = document.createElement('div');
    title.style.fontWeight = '700';
    title.style.fontSize = '18px';
    title.textContent = 'הדפדפן חסם פתיחת כמה טאבים';

    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'סגירה';
    close.style.border = '1px solid #ddd';
    close.style.borderRadius = '10px';
    close.style.padding = '8px 10px';
    close.style.cursor = 'pointer';
    close.addEventListener('click', function(){
      overlay.style.display = 'none';
    });

    h.appendChild(title);
    h.appendChild(close);

    var p = document.createElement('p');
    p.style.margin = '10px 0 12px';
    p.textContent = 'כדי לפתוח את כולם בלחיצה אחת, צריך לאפשר Pop-ups לאתר. בינתיים, הנה כל הלינקים של החבילה:';

    var actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.flexWrap = 'wrap';
    actions.style.gap = '8px';
    actions.style.marginBottom = '10px';

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = 'העתקת כל הלינקים';
    copyBtn.style.border = '1px solid #ddd';
    copyBtn.style.borderRadius = '10px';
    copyBtn.style.padding = '8px 10px';
    copyBtn.style.cursor = 'pointer';

    var openOneBtn = document.createElement('button');
    openOneBtn.type = 'button';
    openOneBtn.textContent = 'לפתוח לינק ראשון';
    openOneBtn.style.border = '1px solid #ddd';
    openOneBtn.style.borderRadius = '10px';
    openOneBtn.style.padding = '8px 10px';
    openOneBtn.style.cursor = 'pointer';

    actions.appendChild(copyBtn);
    actions.appendChild(openOneBtn);

    var list = document.createElement('div');
    list.id = 'kbwgLinksList';
    list.style.display = 'grid';
    list.style.gap = '6px';

    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(actions);
    box.appendChild(list);
    overlay.appendChild(box);

    overlay.addEventListener('click', function(e){
      if(e.target === overlay) overlay.style.display = 'none';
    });

    document.body.appendChild(overlay);

    overlay._setLinks = function(urls){
      list.innerHTML = '';
      var text = (urls || []).join('\n');

      copyBtn.onclick = async function(){
        try{
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = 'הועתק ✓';
          setTimeout(function(){ copyBtn.textContent = 'העתקת כל הלינקים'; }, 1200);
        }catch(e){
          // fallback: select + copy
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try{ document.execCommand('copy'); copyBtn.textContent = 'הועתק ✓'; }
          catch(_e){}
          document.body.removeChild(ta);
          setTimeout(function(){ copyBtn.textContent = 'העתקת כל הלינקים'; }, 1200);
        }
      };

      openOneBtn.onclick = function(){
        if(urls && urls.length) window.open(urls[0], '_blank', 'noopener');
      };

      (urls || []).forEach(function(u){
        var a = document.createElement('a');
        a.href = u;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = u;
        a.style.wordBreak = 'break-all';
        a.style.color = '#0b57d0';
        a.style.textDecoration = 'underline';
        list.appendChild(a);
      });
    };

    return overlay;
  }

  function openLinkHub(urls, title){
    urls = urls || [];
    if(!urls.length) return;

    // Try opening ONE tab (almost always allowed). This becomes a "link hub" that users can open from manually.
    var win = window.open('', '_blank', 'noopener');
    if(!win){
      // If even one tab is blocked, fallback to in-page modal.
      var modal = ensureModal();
      modal._setLinks(urls);
      modal.style.display = 'block';
      return;
    }

    var safeTitle = escapeHtml(title || 'פתיחת לינקים');
    var list = urls.map(function(u, i){
      var su = escapeHtml(u);
      return '<div class="row"><div class="num">'+(i+1)+'</div>'
        + '<a class="url" href="'+su+'" target="_blank" rel="noopener">'+su+'</a>'
        + '<button class="btn openOne" data-i="'+i+'">פתיחה</button></div>';
    }).join('');

    var html = '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"/>'
      + '<meta name="viewport" content="width=device-width,initial-scale=1"/>'
      + '<title>'+safeTitle+'</title>'
      + '<style>'
      + 'body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; margin:0; background:#f7f7f8; color:#111;}'
      + '.wrap{max-width:860px; margin:0 auto; padding:18px;}'
      + '.card{background:#fff; border:1px solid #e8e8ee; border-radius:18px; padding:16px; box-shadow:0 2px 14px rgba(0,0,0,.05);}'
      + 'h1{font-size:20px; margin:0 0 8px;}'
      + 'p{margin:6px 0 0; line-height:1.45;}'
      + '.actions{display:flex; flex-wrap:wrap; gap:10px; margin-top:12px;}'
      + '.btn{border:1px solid #ddd; background:#fff; border-radius:12px; padding:10px 12px; cursor:pointer; font-size:14px;}'
      + '.btn.primary{background:#111; color:#fff; border-color:#111;}'
      + '.btn:active{transform:translateY(1px);} '
      + '.muted{color:#666; font-size:13px;}'
      + '.list{margin-top:14px; display:grid; gap:10px;}'
      + '.row{display:grid; grid-template-columns:42px 1fr 88px; gap:10px; align-items:center; padding:10px; border:1px solid #eee; border-radius:14px; background:#fff;}'
      + '.num{font-weight:700; color:#444; text-align:center;}'
      + '.url{word-break:break-all; color:#0b57d0; text-decoration:underline;}'
      + '.toast{margin-top:10px; padding:10px 12px; border-radius:14px; background:#f1f5ff; border:1px solid #dfe7ff; display:none;}'
      + '.kbd{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; background:#f3f3f6; padding:2px 6px; border-radius:8px; border:1px solid #e6e6ee;}'
      + '</style></head><body><div class="wrap">'
      + '<div class="card">'
      + '<h1>'+safeTitle+'</h1>'
      + '<p class="muted">ברוב הדפדפנים חוסם הפופ-אפים לא מאפשר לפתוח הרבה טאבים בבת אחת. לכן פתחנו עבורך מסך מסודר עם כל הלינקים — מכאן אפשר לפתוח אחד-אחד (תמיד עובד), או לנסות "פתיחת הכל".</p>'
      + '<div class="actions">'
      + '<button class="btn primary" id="openNext">פתיחת הלינק הבא</button>'
      + '<button class="btn" id="openAll">ניסיון לפתוח את כולם</button>'
      + '<button class="btn" id="copyAll">העתקת כל הלינקים</button>'
      + '</div>'
      + '<div class="toast" id="toast"></div>'
      + '</div>'
      + '<div class="list" id="list">'+list+'</div>'
      + '<p class="muted" style="margin-top:12px">טיפ: אם "ניסיון לפתוח את כולם" לא עובד, אפשר לאפשר Pop-ups לאתר בהגדרות האתר (ליד ה־URL). אחר כך לנסות שוב.</p>'
      + '</div>'
      + '<script>'
      + 'const URLS=' + JSON.stringify(urls) + ';'
      + 'let idx=0;'
      + 'const toast=document.getElementById("toast");'
      + 'function show(msg){toast.textContent=msg; toast.style.display="block"; clearTimeout(window.__t); window.__t=setTimeout(()=>toast.style.display="none",2200);}'
      + 'function openOne(i){const w=window.open(URLS[i],"_blank","noopener"); if(!w) return false; return true;}'
      + 'document.getElementById("openNext").addEventListener("click",()=>{'
      + '  while(idx<URLS.length){'
      + '    const ok=openOne(idx);'
      + '    idx++;'
      + '    if(ok){ show("נפתח לינק "+idx+" מתוך "+URLS.length); return; }'
      + '    else { show("הדפדפן חסם פתיחה. אפשר לאפשר Pop-ups לאתר ואז לנסות שוב."); return; }'
      + '  }'
      + '  show("כל הלינקים כבר נפתחו");'
      + '});'
      + 'document.getElementById("openAll").addEventListener("click",()=>{'
      + '  let blocked=0;'
      + '  for(let i=0;i<URLS.length;i++){ if(!openOne(i)) blocked++; }'
      + '  if(blocked>0) show("חלק נחסמו ("+blocked+"). נסי לפתוח אחד-אחד או לאפשר Pop-ups לאתר.");'
      + '  else show("נפתחו כל הלינקים");'
      + '});'
      + 'document.getElementById("copyAll").addEventListener("click", async ()=>{'
      + '  const txt=URLS.join("\n");'
      + '  try{ await navigator.clipboard.writeText(txt); show("הועתק ✓"); }'
      + '  catch(e){'
      + '    const ta=document.createElement("textarea"); ta.value=txt; ta.style.position="fixed"; ta.style.left="-9999px";'
      + '    document.body.appendChild(ta); ta.select();'
      + '    try{ document.execCommand("copy"); show("הועתק ✓"); }catch(_e){ show("לא הצלחנו להעתיק אוטומטית"); }'
      + '    document.body.removeChild(ta);'
      + '  }'
      + '});'
      + 'document.querySelectorAll(".openOne").forEach(btn=>btn.addEventListener("click",()=>{'
      + '  const i=Number(btn.getAttribute("data-i"));'
      + '  const ok=openOne(i);'
      + '  if(ok) show("נפתח לינק "+(i+1));'
      + '  else show("הדפדפן חסם פתיחה. אפשר לאפשר Pop-ups לאתר.");'
      + '}));'
      + '</'+'script>'
      + '</body></html>';

    try{
      win.document.open();
      win.document.write(html);
      win.document.close();
      win.focus();
    }catch(e){
      // If we fail to write (very rare), fallback to modal.
      try{ win.close(); }catch(_e){}
      var modal2 = ensureModal();
      modal2._setLinks(urls);
      modal2.style.display = 'block';
    }
  }

  function openAllLinks(items, bundleTitle){
    var urls=[];
    for(var i=0;i<items.length;i++){
      var o=eligibleOffer(items[i]);
      if(o && o.url) urls.push(o.url);
    }
    openLinkHub(urls, bundleTitle);
  }

  function renderBundleCard(bundle, productsById, fxRate){
    var card=document.createElement('article');
    card.className='bundleCard card';

    var header=document.createElement('div');
    header.className='bundleTop';

    var left=document.createElement('div');

    var h=document.createElement('h3');
    h.className='bundleTitle';
    h.textContent=bundle.title || '';

    var sub=document.createElement('p');
    sub.className='bundleSubtitle';
    sub.textContent=bundle.subtitle || '';

    left.appendChild(h);
    left.appendChild(sub);

    if(bundle.description){
      var d=document.createElement('p');
      d.className='bundleDesc';
      d.textContent=bundle.description;
      left.appendChild(d);
    }

    var meta=document.createElement('div');
    meta.className='bundleMeta';

    var totalUSD = (typeof bundle.totalUSD === 'number' && isFinite(bundle.totalUSD)) ? bundle.totalUSD : null;
    if(totalUSD === null){
      // compute from products if not provided
      totalUSD = 0;
      var tmp = bundle.items || [];
      for(var i=0;i<tmp.length;i++){ totalUSD += usd(tmp[i]) || 0; }
      totalUSD = Math.round(totalUSD*100)/100;
    }

    var tag1=document.createElement('div');
    tag1.className='tag';
    tag1.textContent='סה״כ: '+fmtUSD(totalUSD)+' (≈ '+fmtILS(totalUSD*(fxRate||USD_TO_ILS_DEFAULT))+')';

    var tag2=document.createElement('div');
    tag2.className='tag';
    tag2.textContent='משלוח חינם מעל $'+FREE_SHIP_OVER_USD;

    meta.appendChild(tag1);
    meta.appendChild(tag2);

    header.appendChild(left);
    header.appendChild(meta);

    var preview=document.createElement('div');
    preview.className='bundlePreview';

    var items = bundle.items || [];
    items.forEach(function(p){
      var o=eligibleOffer(p);
      var url=(o && o.url) || '#';

      // Row wrapper (link + open button)
      var row=document.createElement('div');
      row.className='bundlePreviewRow';
      row.style.display='grid';
      row.style.gridTemplateColumns='1fr auto';
      row.style.gap='10px';
      row.style.alignItems='center';

      // Product link (image + caption)
      var a=document.createElement('a');
      a.className='bundlePreviewItem';
      a.href=url;
      a.target='_blank';
      a.rel='noopener';

      var img=document.createElement('img');
      img.loading='lazy';
      img.alt=(p.brand ? (p.brand+' ') : '') + (p.name || '');
      img.src=p.image || '';

      var cap=document.createElement('div');
      cap.className='bundlePreviewCap';
      cap.textContent=(p.brand ? (p.brand+' · ') : '') + (p.name || '');

      a.appendChild(img);
      a.appendChild(cap);

      // Open button (new tab)
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='openProductBtn';
      btn.textContent='פתיחה';
      btn.style.border='1px solid #ddd';
      btn.style.background='#fff';
      btn.style.borderRadius='12px';
      btn.style.padding='10px 12px';
      btn.style.cursor='pointer';
      btn.style.whiteSpace='nowrap';

      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        if(url && url !== '#') window.open(url, '_blank', 'noopener');
      });

      row.appendChild(a);
      row.appendChild(btn);

      preview.appendChild(row);
    });
    var footer=document.createElement('div');
    footer.className='bundleBottom';

    if(Array.isArray(bundle.tags) && bundle.tags.length){
      var chips=document.createElement('div');
      chips.className='bundleTags';
      bundle.tags.forEach(function(t){
        var chip=document.createElement('span');
        chip.className='chip';
        chip.textContent=t;
        chips.appendChild(chip);
      });
      footer.appendChild(chips);
    }

    var btn=document.createElement('button');
    btn.type='button';
    btn.className='bundleBtn';
    btn.textContent='לפתיחת כל הלינקים';
    btn.addEventListener('click', function(){ openAllLinks(items, bundle.title || 'פתיחת לינקים'); });

    footer.appendChild(btn);

    card.appendChild(header);
    card.appendChild(preview);
    card.appendChild(footer);
    return card;
  }

  async function fetchJson(path){
    var res=await fetch(path, {cache:'no-cache'});
    if(!res.ok) throw new Error('Failed to load '+path+' ('+res.status+')');
    return await res.json();
  }

  async function init(){
    var grid=$('#bundleGrid');
    if(!grid) return;

    grid.innerHTML='';

    var products=await fetchJson('data/products.json');
    var bundlesData=await fetchJson('data/bundles.json');

    var productsById={};
    for(var i=0;i<products.length;i++){
      var p=products[i];
      if(p && p.id) productsById[p.id]=p;
    }

    var fxInput=$('#fxRate');
    var fxRate=USD_TO_ILS_DEFAULT;
    if(fxInput){
      var v=parseFloat(fxInput.value);
      if(isFinite(v) && v>0) fxRate=v;
      fxInput.addEventListener('change', function(){
        var nv=parseFloat(fxInput.value);
        if(isFinite(nv) && nv>0){
          fxRate=nv;
          // re-render
          init().catch(function(){});
        }
      });
    }

    // Build bundles as-is
    var bundles=[];
    for(var b=0;b<bundlesData.length;b++){
      var bd=bundlesData[b];
      if(!bd || !Array.isArray(bd.itemIds)) continue;

      var items=[];
      for(var j=0;j<bd.itemIds.length;j++){
        var id=bd.itemIds[j];
        var p=productsById[id];
        if(p) items.push(p);
      }

      bundles.push({
        id: bd.id || ('bundle-'+b),
        title: bd.title || '',
        subtitle: bd.subtitle || '',
        description: bd.description || '',
        tags: bd.tags || [],
        itemIds: bd.itemIds.slice(),
        items: items,
        totalUSD: (typeof bd.totalUSD === 'number' ? bd.totalUSD : null)
      });
    }

    if(!bundles.length){
      grid.innerHTML='<p class="muted">לא נמצאו חבילות להצגה.</p>';
      return;
    }

    var frag=document.createDocumentFragment();
    for(var k=0;k<bundles.length;k++){
      frag.appendChild(renderBundleCard(bundles[k], productsById, fxRate));
    }
    grid.appendChild(frag);

    try{ window.dispatchEvent(new Event('kbwg:content-rendered')); }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ init().catch(function(e){ console.warn(e); }); });
  }else{
    init().catch(function(e){ console.warn(e); });
  }

})();
