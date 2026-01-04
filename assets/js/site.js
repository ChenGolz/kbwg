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

  // Mobile nav: inject a hamburger button and collapse nav on small screens
  const header = document.getElementById('siteHeader');
  const headerRow = header ? header.querySelector('.headerRow') : null;
  const nav = header ? header.querySelector('.nav') : null;

  if (header && headerRow && nav) {
    // Ensure nav has an id for aria-controls
    if (!nav.id) nav.id = 'primaryNav';

    // Inject only once
    if (!header.querySelector('.navToggle')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'navToggle';
      btn.setAttribute('aria-label', 'פתיחת תפריט');
      btn.setAttribute('aria-controls', nav.id);
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span class="navToggleIcon" aria-hidden="true">☰</span><span class="navToggleText">תפריט</span>';

      // Place next to logo (before nav)
      headerRow.insertBefore(btn, nav);

      const close = () => {
        header.classList.remove('navOpen');
        btn.setAttribute('aria-expanded', 'false');
      };
      const open = () => {
        header.classList.add('navOpen');
        btn.setAttribute('aria-expanded', 'true');
      };

      btn.addEventListener('click', () => {
        const isOpen = header.classList.contains('navOpen');
        isOpen ? close() : open();
      });

      // Close when a link is clicked
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });

      // Close when switching to desktop width
      const mq = window.matchMedia('(min-width: 901px)');
      const onMq = () => { if (mq.matches) close(); };
      mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);
      onMq();
    }
  }

    // Products page: collapsible Amazon US/UK info box
    // Makes the heading "איך זה עובד עם אמזון ארה"ב ואנגליה?" clickable and toggles the extra details.
    document.addEventListener('DOMContentLoaded', function () {
      var btn = document.querySelector('.amazon-toggle');
      var details = document.getElementById('amazonInfoDetails');
      if (!btn || !details) return;

      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        // If it was expanded -> collapse (hidden = true). If collapsed -> show (hidden = false).
        details.hidden = expanded;
      });
    });

})();
