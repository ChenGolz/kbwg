# Run locally (בלי CORS) / Local Dev

אם את פותחת את הקבצים ע"י דאבל־קליק (כלומר `file://...`) הדפדפן **יחסום** `fetch()` של קבצי JSON בגלל מדיניות אבטחה (CORS) – ולכן תקבלי הודעה כמו:
`origin 'null' has been blocked by CORS policy`.

כדי שזה יעבוד מקומית, צריך לפתוח את האתר דרך **שרת HTTP מקומי** (Local Server).

## Windows (מומלץ)
1. פתחי טרמינל בתיקייה של הפרויקט (באותה תיקייה שיש בה את `index.html`).
2. הריצי:

```bat
py -m http.server 8000
```

3. פתחי בדפדפן:
- `http://localhost:8000/`
- `http://localhost:8000/products.html`
- `http://localhost:8000/recommended-brands.html`

אפשר גם ללחוץ דאבל־קליק על `start-local-server.bat`.

## macOS / Linux
```bash
python3 -m http.server 8000
```

## GitHub Pages
ב־GitHub Pages (https) הכל עובד כרגיל — אין את הבעיה של `file://`.
