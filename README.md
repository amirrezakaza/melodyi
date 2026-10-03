# Melody — Music Platform

یک پلتفرم موزیک مدرن، RTL و PWA با Next.js/React. نسخه فعلی برای **GitHub Pages** و اجرای بدون Backend طراحی شده است.

## اجرا

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

خروجی استاتیک داخل پوشه `out/` ساخته می‌شود.

## انتشار روی GitHub Pages

1. کل پروژه را داخل یک Repository با Branch اصلی `main` قرار بده.
2. از بخش **Settings → Pages**، گزینه Source را روی **GitHub Actions** بگذار.
3. یک Push روی `main` انجام بده.
4. Workflow با نام **Deploy Melody to GitHub Pages** خودش Build و Deploy را انجام می‌دهد.

Workflow به‌صورت خودکار نام Repository را برای `basePath` تنظیم می‌کند؛ بنابراین لینک‌ها و assetها در Project Pages خراب نمی‌شوند.

## داده و صدا

برای اینکه پروژه بدون سرویس خارجی هم قابل نمایش باشد، تصاویر آرت‌ورک و سه پیش‌نمایش صوتی کوتاه به‌صورت محلی داخل `public/` قرار گرفته‌اند. این فایل‌ها دمو هستند و برای انتشار آثار تجاری باید از فایل‌های دارای مجوز استفاده شود.

## PWA

- manifest محلی
- service worker
- نصب روی موبایل/دسکتاپ
- fallback آفلاین
- کش assetهای مهم

## نکته

نسخه فعلی عمداً وابستگی به PostgreSQL و API سمت سرور را حذف کرده تا روی GitHub Pages اجرا شود. بخش AI Discovery در این نسخه با منطق محلی/Curated کار می‌کند و بعداً می‌توان یک API واقعی را جایگزین آن کرد.
