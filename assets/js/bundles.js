/* KBWG Bundles — v6 (Curated themed bundles + Hebrew titles + Add-to-cart button)
   Rules:
   - Bundles follow requested themes only
   - Each product appears in max 2 bundles
   - Baby bundles: only products with 'baby' in name
   - Men bundles: only men products
   - Target total ₪170–₪250 (prefers ~₪170)
   - Prices displayed in ILS
   UX:
   - Hebrew bundle titles (brand names stay in original language)
   - "Add all to Amazon cart" button per bundle:
        * Tries to build an Amazon cart add URL using ASINs
        * Falls back to opening product links if ASIN is missing
*/

(function(){
  'use strict';

  var USD_TO_ILS = 3.3;
  var ILS_MIN = 170;
  var ILS_MAX = 250;
  var FREE_SHIP_OVER_USD = 49;

  // Affiliate tag (used in fallback URLs if we build cart URL)
  var AMAZON_ASSOCIATE_TAG = 'nocrueltyil-20';

  function $(s,r){return (r||document).querySelector(s);}
  function lc(s){return String(s||'').toLowerCase();}

  function getOffer(p){
    if(!p||!Array.isArray(p.offers)) return null;
    return p.offers.find(function(o){ return o && o.store==='amazon-us'; }) || p.offers[0] || null;
  }
  function usd(p){var o=getOffer(p);return o?Number(o.priceUSD)||0:0;}
  function ils(p){return usd(p)*USD_TO_ILS;}
  function eligible(p){
    var o=getOffer(p);
    return o && o.freeShipOver===FREE_SHIP_OVER_USD && usd(p)>0;
  }
  function containsBaby(p){return lc(p.name).indexOf('baby')>=0;}
  function isMen(p){return !!p.isMen || lc(p.name).indexOf('men')>=0 || lc(p.name).indexOf('גבר')>=0 || lc(p.name).indexOf('לגבר')>=0 || lc(p.name).indexOf('גברים')>=0;}
  function hasCat(p,c){return (p.categories||[]).indexOf(c)>=0;}
  function fmtILS(v){return '₪'+Math.round(v);}

  function pickBundle(products, filterFn, usage){
    var items=[];
    var total=0;
    var sorted=products.filter(filterFn).filter(eligible)
      .sort(function(a,b){ return ils(a)-ils(b); }); // cheapest first to hit ~₪170

    for(var i=0;i<sorted.length;i++){
      var p=sorted[i];
      if((usage[p.id]||0)>=2) continue;
      var next=total+ils(p);
      if(next>ILS_MAX) continue;
      items.push(p);
      total=next;
      usage[p.id]=(usage[p.id]||0)+1;
      if(total>=ILS_MIN) break;
    }
    if(total<ILS_MIN) return null;
    return items;
  }

  function buildAmazonCartUrl(items){
    // Amazon "add to cart" endpoint (best-effort)
    // https://www.amazon.com/gp/aws/cart/add.html?ASIN.1=...&Quantity.1=1&ASIN.2=...&Quantity.2=1&tag=...
    var params=[];
    var n=0;
    for(var i=0;i<items.length;i++){
      var o=getOffer(items[i]);
      if(!o || !o.asin) return null;
      n++;
      params.push('ASIN.'+n+'='+encodeURIComponent(o.asin));
      params.push('Quantity.'+n+'=1');
    }
    if(!n) return null;
    // tag parameter is not guaranteed to work on this endpoint, but doesn't harm
    if(AMAZON_ASSOCIATE_TAG) params.push('tag='+encodeURIComponent(AMAZON_ASSOCIATE_TAG));
    return 'https://www.amazon.com/gp/aws/cart/add.html?'+params.join('&');
  }

  function openAllLinks(items){
    for(var i=0;i<items.length;i++){
      var o=getOffer(items[i]);
      if(o && o.url) window.open(o.url, '_blank', 'noopener');
    }
  }

  function render(bundle){
    var card=document.createElement('article');
    card.className='bundleCard card';

    var header=document.createElement('div');
    header.className='bundleTop';

    var left=document.createElement('div');
    var h=document.createElement('h3');
    h.className='bundleTitle';
    h.textContent=bundle.title;
    var sub=document.createElement('p');
    sub.className='bundleSubtitle';
    sub.textContent=bundle.subtitle;
    left.appendChild(h);
    left.appendChild(sub);

    var meta=document.createElement('div');
    meta.className='bundleMeta';
    var total=0;
    for(var i=0;i<bundle.items.length;i++) total+=ils(bundle.items[i]);
    var totalLine=document.createElement('div');
    totalLine.className='bundleTotal';
    totalLine.textContent='סה״כ משוער: '+fmtILS(total);
    var shipLine=document.createElement('div');
    shipLine.className='bundleShip';
    shipLine.textContent='כולל: משלוח חינם מעל $49 (160 ש״ח לערך)';
    meta.appendChild(totalLine);
    meta.appendChild(shipLine);

    header.appendChild(left);
    header.appendChild(meta);

    var list=document.createElement('div');
    list.className='bundleProducts';

    bundle.items.forEach(function(p){
      var row=document.createElement('a');
      row.className='bundleProduct';
      var o=getOffer(p);
      row.href=(o && o.url) || '#';
      row.target='_blank';
      row.rel='noopener';
      row.innerHTML='<div class="bundleProductInfo"><div class="bundleProductTitle"><span class="wg-notranslate">'+p.brand+'</span> — '+p.name+'</div><div class="bundleProductDetails">'+(p.size? (p.size+' • '):'')+fmtILS(ils(p))+'</div></div>';
      list.appendChild(row);
    });

    var cta=document.createElement('div');
    cta.className='bundleCTA';

    var btn=document.createElement('button');
    btn.type='button';
    btn.className='btn btnPrimary';
    btn.textContent='להוסיף הכל לעגלה באמזון - בקרוב';
    btn.addEventListener('click', function(){
      var cartUrl=buildAmazonCartUrl(bundle.items);
      if(cartUrl){
        window.open(cartUrl, '_blank', 'noopener');
      } else {
        openAllLinks(bundle.items);
      }
    });

    cta.appendChild(btn);

    card.appendChild(header);
    card.appendChild(list);
    card.appendChild(cta);
    return card;
  }

  async function fetchProducts(){
    var res=await fetch('data/products.json',{cache:'no-cache'});
    return await res.json();
  }

  async function init(){
    var grid=$('#bundleGrid');
    if(!grid) return;
    grid.innerHTML='';

    var products=await fetchProducts();
    var usage={};
    var bundles=[];

    // Hebrew titles (as requested). Subtitles kept short and Hebrew.
    var THEMES=[
      {
        title:'שגרת שיער נקייה ומלאה',
        subtitle:'דיטוקס/לחות לשיער — שמפו + מרכך + חיזוק/טיפול.',
        filter:function(p){ return hasCat(p,'hair') && !isMen(p) && !containsBaby(p); }
      },
      {
        title:'ערכת איפור יומי מלאה',
        subtitle:'בסיס + גימור + שפתיים — הכל טבעוני וללא ניסויים.',
        filter:function(p){ return hasCat(p,'makeup') && !isMen(p); }
      },
      {
        title:'סט חובה לאמא ותינוק',
        subtitle:'עדין ומתאים לעור רגיש — רק מוצרים שמופיע בהם “baby”.',
        filter:function(p){ return containsBaby(p); }
      },
      {
        title:'שגרת טיפוח יומית לגבר',
        subtitle:'פשוט, יעיל ומדויק לגברים — בלי פריטים לא רלוונטיים.',
        filter:function(p){ return isMen(p); }
      },
      {
        title:'שגרת ויטמין C Glow Baby',
        subtitle:'הארה וטיפול יומיומי ',
        filter:function(p){ return containsBaby(p); }
      },
      {
        title:'הגנה לקיץ ולים',
        subtitle:'SPF + שיקום/אפרטר-סאן + הכנת העור.',
        filter:function(p){ return hasCat(p,'suncare') || lc(p.name).indexOf('spf')>=0; }
      }
    ];

    for(var i=0;i<THEMES.length;i++){
      var t=THEMES[i];
      var items=pickBundle(products, t.filter, usage);
      if(items) bundles.push({title:t.title, subtitle:t.subtitle, items:items});
    }

    bundles.forEach(function(b){ grid.appendChild(render(b)); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
