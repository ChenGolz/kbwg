/*
  Loads products from data/products.json, then bootstraps assets/js/products.js.
  Works on GitHub Pages (no build step).
*/
(function () {
  'use strict';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function normalizeProducts(data) {
    return Array.isArray(data) ? data : [];
  }

  var jsonPath = 'data/products.json';

  fetch(jsonPath, { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      window.PRODUCTS = normalizeProducts(data);
    })
    .catch(function (err) {
      console.warn('[products-json-loader] Could not load ' + jsonPath, err);
      window.PRODUCTS = [];
    })
    .finally(function () {
      // The main page logic expects window.PRODUCTS to exist.
      loadScript('assets/js/products.js').catch(function (e) {
        console.error('[products-json-loader] Could not start products.js', e);
      });
    });
})();
