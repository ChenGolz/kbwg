// KBWG site helpers (RTL-first)

(function () {
  // Auto-highlight active nav (fallback if aria-current isn't set)
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (window.location.pathname.endsWith('/' + href) || window.location.pathname.endsWith(href)) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // Hero quote rotator (rotates through the 5 quotes)
  const QUOTES = [
    "Be kind to all kinds.",
    "Compassion is the best fashion.",
    "Eat like you care.",
    "Live and let live.",
    "Kindness is my religion."
  ];

  const el = document.querySelector('[data-quote]');
  if (el) {
    let i = 0;
    const tick = () => {
      el.textContent = QUOTES[i % QUOTES.length];
      i++;
    };
    tick();
    window.setInterval(tick, 4200);
  }

  // Contact: copy email button
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('emailLink');
  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', async () => {
      const email = emailLink.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = "הועתק ✓";
        window.setTimeout(() => (copyBtn.textContent = "העתקת כתובת"), 1800);
      } catch (e) {
        alert("לא הצליח להעתיק. אפשר להעתיק ידנית: " + email);
      }
    });
  }
})();