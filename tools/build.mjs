import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE,
  NAV,
  PROCESS,
  VALUES,
  SERVICES,
  SERVICES_26,
  PROJECTS,
  PROJECT_CATEGORIES,
  FAQS,
  HOME_FAQ,
  SERVICE_OPTIONS,
} from "./site-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(ROOT, "assets", "images", "manifest.json"), "utf8")
);

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const abs = (p = "/") => new URL(p, `${SITE.domain}/`).href;
const year = new Date().getFullYear();
const waText = `السلام عليكم، أرغب بالاستفسار عن خدمات ${SITE.name}.`;
const waHref = (text = waText) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
const telHref = `tel:${SITE.phoneHref}`;
const landlineHref = `tel:${SITE.landlineHref}`;

const ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>`,
  arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.56l-5.9 3.11 1.13-6.57-4.78-4.66 6.6-.96L12 2.5Z"/></svg>`,
  printer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/><circle cx="18" cy="13" r="1"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  shirt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 9 9-9 9H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  billboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="12" rx="1"/><path d="M7 21v-6M17 21v-6M3 9h18"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
  cup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
};

function image(name, options = {}) {
  const m = MANIFEST[name];
  if (!m) throw new Error(`Missing image in manifest: ${name}`);
  const alt = esc(options.alt ?? m.alt);
  const sizes = options.sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  const eager = options.eager === true;
  const className = options.className ? ` class="${options.className}"` : "";
  const imgClass = options.imgClass ? ` class="${options.imgClass}"` : "";
  const loading = eager
    ? `loading="eager" fetchpriority="high"`
    : `loading="lazy" decoding="async"`;
  return `<picture${className}>
  <source type="image/webp" srcset="/assets/images/${name}-sm.webp 900w, /assets/images/${name}.webp 1600w" sizes="${sizes}">
  <img${imgClass} src="/assets/images/${name}.jpg" srcset="/assets/images/${name}-sm.jpg 900w, /assets/images/${name}.jpg 1600w" sizes="${sizes}" alt="${alt}" width="${m.width}" height="${m.height}" ${loading}>
</picture>`;
}

function head({ title, description, canonicalPath, imageName = "og-cover", schemas = [], bodyClass = "", noindex = false }) {
  const fullTitle = title.includes(SITE.shortName)
    ? title
    : `${title} | ${SITE.name}`;
  const canonical = abs(canonicalPath);
  const ogImage = imageName === "og-cover"
    ? abs("/assets/images/og-cover.jpg")
    : abs(`/assets/images/${imageName}.jpg`);
  const schemaTags = schemas
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n");
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
  <meta name="author" content="${esc(SITE.name)}">
  <meta name="theme-color" content="#061536">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ar" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">

  <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32.png">
  <link rel="icon" type="image/png" sizes="64x64" href="/assets/brand/favicon-64.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/brand/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">

  <link rel="preload" href="/assets/fonts/tajawal-700-arabic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/tajawal-800-arabic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/plex-arabic-400.woff2" as="font" type="font/woff2" crossorigin>

  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_SA">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(SITE.name)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${ogImage}">

  <script>document.documentElement.classList.add("js");</script>
  <link rel="stylesheet" href="/assets/css/styles.css">
  ${schemaTags}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""} data-whatsapp="${SITE.whatsapp}">
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  <div class="scroll-progress" aria-hidden="true"><span></span></div>`;
}

function brandMark(extraClass = "") {
  return `<a class="brand ${extraClass}" href="/" aria-label="${esc(SITE.name)} — الصفحة الرئيسية">
  <span class="brand__badge"><img src="/assets/brand/logo-square.webp" width="700" height="700" alt="${esc(SITE.shortName)}" loading="eager"></span>
  <span class="brand__text"><strong>منار الخليج</strong><small>للدعاية والإعلان • MANAR ADV</small></span>
</a>`;
}

function header(active = "/") {
  const isActive = (href) =>
    href === "/" ? active === "/" : active === href || active.startsWith(href.replace(".html", "/"));
  const serviceActive = active === "/services.html" || active.startsWith("/services/");
  const desktopLinks = NAV.map((item) => {
    if (item.children) {
      const items = SERVICES.map(
        (s) => `<a href="/services/${s.slug}.html">
          <span class="dropdown__icon">${ICONS[s.icon] || ICONS.printer}</span>
          <span><strong>${s.title}</strong><small>${s.navTitle}</small></span>
        </a>`
      ).join("");
      return `<li class="has-dropdown${serviceActive ? " is-active" : ""}">
        <a href="${item.href}" ${serviceActive ? 'aria-current="page"' : ""}>${item.label} <span class="nav-chevron">${ICONS.chevron}</span></a>
        <div class="dropdown" role="group" aria-label="خدمات وكالة منار الخليج">
          <div class="dropdown__head"><span>باقات وخدمات الطباعة</span><a href="/services.html">دليل الـ 26 خدمة كاملة ${ICONS.arrow}</a></div>
          <div class="dropdown__grid">${items}</div>
        </div>
      </li>`;
    }
    return `<li><a href="${item.href}" ${isActive(item.href) ? 'aria-current="page"' : ""}>${item.label}</a></li>`;
  }).join("");

  const mobileLinks = NAV.map((item) => {
    if (item.children) {
      const sub = SERVICES.map(
        (s) => `<a class="mobile-nav__sub" href="/services/${s.slug}.html">${s.title}</a>`
      ).join("");
      return `<div class="mobile-nav__group">
        <a class="mobile-nav__link" href="${item.href}">${item.label} ${ICONS.arrow}</a>
        <div class="mobile-nav__subs">${sub}</div>
      </div>`;
    }
    return `<a class="mobile-nav__link" href="${item.href}">${item.label} ${ICONS.arrow}</a>`;
  }).join("");

  return `<div class="topbar">
    <div class="container topbar__inner">
      <p class="topbar__tag">وكالة منار الخليج للدعاية والإعلان — ${SITE.shippingScope}</p>
      <div class="topbar__links">
        <a href="${telHref}">${ICONS.phone}<span dir="ltr">${SITE.phoneDisplay}</span></a>
        <span class="topbar__sep" aria-hidden="true"></span>
        <a href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>واتساب مباشر</span></a>
        <span class="topbar__sep" aria-hidden="true"></span>
        <span class="topbar__hours">${ICONS.clock}<span>${SITE.hours}</span></span>
      </div>
    </div>
  </div>
  <header class="site-header" id="site-header">
    <div class="container header__inner">
      ${brandMark()}
      <nav class="main-nav" aria-label="التنقل الرئيسي">
        <ul>${desktopLinks}</ul>
      </nav>
      <div class="header__actions">
        <a class="btn btn--gold btn--sm header__cta" href="/contact.html#quote">اطلب عرض سعر ${ICONS.arrow}</a>
        <button class="nav-toggle" type="button" aria-label="فتح القائمة" aria-expanded="false" aria-controls="mobile-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <div class="nav-backdrop" data-nav-close aria-hidden="true"></div>
  <aside class="mobile-nav" id="mobile-nav" aria-label="قائمة الجوال" aria-hidden="true">
    <div class="mobile-nav__head">
      ${brandMark("brand--mobile")}
      <button class="mobile-nav__close" type="button" aria-label="إغلاق القائمة" data-nav-close>${ICONS.close}</button>
    </div>
    <nav class="mobile-nav__body">${mobileLinks}</nav>
    <div class="mobile-nav__foot">
      <a class="btn btn--gold" href="/contact.html#quote">اطلب عرض سعر ${ICONS.arrow}</a>
      <div class="mobile-nav__contact">
        <a href="${telHref}">${ICONS.phone}<span dir="ltr">${SITE.phoneDisplay}</span></a>
        <a href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>واتساب</span></a>
      </div>
    </div>
  </aside>`;
}

function footer() {
  const quick = [
    ["/", "الرئيسية"],
    ["/about.html", "من نحن"],
    ["/services.html", "دليل الخدمات (26 خدمة)"],
    ["/projects.html", "أعمالنا"],
    ["/faq.html", "الأسئلة الشائعة"],
    ["/contact.html", "تواصل معنا"],
  ]
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join("");

  const serviceLinks = SERVICES.map(
    (s) => `<li><a href="/services/${s.slug}.html">${s.title}</a></li>`
  ).join("");

  return `<footer class="site-footer">
    <div class="footer__glow" aria-hidden="true"></div>
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="/" aria-label="${esc(SITE.name)}">
            <img src="/assets/brand/logo-wide-light.webp" width="1200" height="230" alt="${esc(SITE.name)}" loading="lazy">
          </a>
          <p>وكالة متخصصة في الدعاية والإعلان والطباعة الرقمية والأوفست، صناعة اللوحات التجارية المضيئة، البنرات والرول أب، البوكسات والأكياس، اليونيفورم وتطريز الملابس، وتجليد أسطول السيارات.</p>
          <div class="footer__chips">
            <span>طباعة رقمية وأوفست</span>
            <span>لوحات تجارية</span>
            <span>بوكسات وتغليف</span>
            <span>يونيفورم وتطريز</span>
            <span>تجليد سيارات</span>
            <span>شحن لكافة مدن المملكة</span>
          </div>
        </div>
        <div class="footer__col">
          <h3>روابط سريعة</h3>
          <ul>${quick}</ul>
        </div>
        <div class="footer__col">
          <h3>خدماتنا الرئيسية</h3>
          <ul>${serviceLinks}</ul>
        </div>
        <div class="footer__col footer__contact">
          <h3>تواصل معنا</h3>
          <ul>
            <li><a href="${telHref}">${ICONS.phone}<span dir="ltr">${SITE.phoneDisplay}</span></a></li>
            <li><a href="${landlineHref}">${ICONS.phone}<span>هاتف: </span><span dir="ltr">${SITE.landlineDisplay}</span></a></li>
            <li><a href="${waHref()}">${ICONS.whatsapp}<span>واتساب مباشر</span></a></li>
            <li><a href="${SITE.mapUrl}" target="_blank" rel="noopener">${ICONS.pin}<span>${SITE.address}</span></a></li>
            <li>${ICONS.clock}<span>${SITE.hours}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© <span data-year>${year}</span> ${SITE.name}. جميع الحقوق محفوظة. Print Your Vision.</p>
        <div class="footer__legal">
          <a href="/privacy.html">سياسة الخصوصية</a>
          <span aria-hidden="true">•</span>
          <a href="/sitemap.xml">خريطة الموقع</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function floating() {
  return `<a class="wa-float" href="${waHref()}" target="_blank" rel="noopener" aria-label="تواصل معنا عبر واتساب">
    ${ICONS.whatsapp}<span class="wa-float__label">واتساب</span>
  </a>
  <button class="to-top" type="button" aria-label="العودة إلى أعلى الصفحة">${ICONS.arrowUp}</button>
  <div class="mobile-bar" aria-label="تواصل سريع">
    <a href="${telHref}">${ICONS.phone}<span>اتصل بنا</span></a>
    <a class="mobile-bar__wa" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>واتساب</span></a>
  </div>
  <dialog class="lightbox" id="lightbox" aria-label="عرض صورة من الأعمال">
    <button class="lightbox__close" type="button" aria-label="إغلاق الصورة" data-lightbox-close>${ICONS.close}</button>
    <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="الصورة السابقة" data-lightbox-prev>${ICONS.arrow}</button>
    <figure class="lightbox__figure">
      <img src="/assets/images/luxury-black-paper-bags.jpg" alt="" width="1600" height="1200">
      <figcaption><strong data-lightbox-title></strong><span data-lightbox-caption></span></figcaption>
    </figure>
    <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="الصورة التالية" data-lightbox-next>${ICONS.arrow}</button>
  </dialog>`;
}

function eyebrow(text, light = false) {
  return `<span class="eyebrow${light ? " eyebrow--light" : ""}"><span class="eyebrow__line" aria-hidden="true"></span>${text}</span>`;
}

function sectionHead({ tag, title, lead, light = false, center = false, action = "" }) {
  return `<div class="section-head${light ? " section-head--light" : ""}${center ? " section-head--center" : ""}">
    <div class="section-head__main">
      ${eyebrow(tag, light)}
      <h2>${title}</h2>
    </div>
    <div class="section-head__side">
      ${lead ? `<p>${lead}</p>` : ""}
      ${action}
    </div>
  </div>`;
}

function serviceCard(service, index) {
  return `<a class="service-card reveal" href="/services/${service.slug}.html" style="--delay:${(index % 4) * 70}ms">
    <div class="service-card__media">
      ${image(service.image, { sizes: "(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 24vw" })}
      <span class="service-card__num">${String(index + 1).padStart(2, "0")}</span>
      <span class="service-card__icon">${ICONS[service.icon] || ICONS.printer}</span>
    </div>
    <div class="service-card__body">
      <h3>${service.title}</h3>
      <p>${service.short}</p>
      <span class="service-card__link">تفاصيل الخدمة ${ICONS.arrow}</span>
    </div>
  </a>`;
}

function projectCard(project, options = {}) {
  const widthClass = options.wide ? " project-card--wide" : "";
  return `<figure class="project-card${widthClass} reveal" data-category="${project.category}">
    <button class="project-card__btn" type="button" data-lightbox
      data-src="/assets/images/${project.image}.webp"
      data-title="${esc(project.title)}"
      data-caption="${esc(project.text)}"
      aria-label="عرض صورة: ${esc(project.title)}">
      ${image(project.image, { sizes: options.wide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw" })}
      <span class="project-card__shade"></span>
      <span class="project-card__content">
        <span class="project-card__cat">${project.categoryLabel}</span>
        <span class="project-card__title">${project.title}</span>
        <span class="project-card__icon">${ICONS.plus}</span>
      </span>
    </button>
  </figure>`;
}

function galleryGrid(items, { filterable = false, home = false } = {}) {
  const filters = filterable
    ? `<div class="filters" role="group" aria-label="تصفية الأعمال">
        ${PROJECT_CATEGORIES.map(
          (c, i) => `<button class="filter${i === 0 ? " is-active" : ""}" type="button" data-filter="${c.id}" aria-pressed="${i === 0}">${c.label}</button>`
        ).join("")}
      </div>`
    : "";
  const cards = items
    .map((p, i) => {
      const wide = home ? i === 0 || i === 3 : i % 5 === 0;
      return projectCard(p, { wide });
    })
    .join("");
  return `<div class="gallery-wrap">
    ${filters}
    <div class="gallery${home ? " gallery--home" : ""}" data-gallery>${cards}</div>
    <p class="gallery__empty" data-gallery-empty hidden>لا توجد أعمال في هذا التصنيف حالياً.</p>
  </div>`;
}

function faqList(items) {
  return `<div class="faq-list">${items
    .map(
      (item, i) => `<details class="faq-item"${i === 0 ? " open" : ""}>
      <summary><span>${item.q}</span><span class="faq-item__icon" aria-hidden="true">${ICONS.plus}</span></summary>
      <div class="faq-item__answer"><p>${item.a}</p></div>
    </details>`
    )
    .join("")}</div>`;
}

function processGrid(compact = false) {
  return `<div class="process__grid${compact ? " process__grid--compact" : ""}">${PROCESS.map(
    (step, i) => `<article class="process-card reveal" style="--delay:${i * 80}ms">
      <span class="process-card__num">${step.n}</span>
      <span class="process-card__icon">${ICONS[step.icon] || ICONS.check}</span>
      <h3>${step.title}</h3>
      <p>${step.text}</p>
    </article>`
  ).join("")}</div>`;
}

function allServices26Grid() {
  return `<div class="feature-grid services-26-grid">${SERVICES_26.map(
    (item) => `<article class="feature-card service-26-card reveal">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <span class="feature-card__num" style="font-size:18px;">#${String(item.id).padStart(2, "0")}</span>
        <span style="color:var(--gold-500);">${ICONS[item.icon] || ICONS.printer}</span>
      </div>
      <h3 style="font-size:17px;margin-bottom:8px;">${item.title}</h3>
      <p style="font-size:13.5px;color:var(--muted);">${item.text}</p>
      <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--line);">
        <a class="link-arrow" style="margin-top:0;font-size:12.5px;" href="${waHref(`السلام عليكم، أود طلب خدمة: ${item.title}.`)}" target="_blank" rel="noopener">اطلب الخدمة الآن ${ICONS.arrow}</a>
      </div>
    </article>`
  ).join("")}</div>`;
}

function ctaBand({ title, text, imageName = "manar-storefront-signage" } = {}) {
  return `<section class="cta-band">
    <div class="cta-band__bg" aria-hidden="true">${image(imageName, { sizes: "100vw" })}</div>
    <div class="cta-band__overlay" aria-hidden="true"></div>
    <div class="container cta-band__inner reveal">
      ${eyebrow("ابدأ طلبك الآن", true)}
      <h2>${title ?? "جاهز لطباعة مشروعك القادم <em>بأعلى درجات الفخامة؟</em>"}</h2>
      <p>${text ?? "أرسل لنا نوع المطبوعات أو المقاسات أو الكميات التقريبية، وسيقوم فريقنا بمراجعة طلبك وإرسال عرض سعر واضح ومفصل."}</p>
      <div class="cta-band__actions">
        <a class="btn btn--gold btn--lg" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp} اطلب عرض سعر فوري</a>
        <a class="btn btn--ghost btn--lg" href="/contact.html#quote">نموذج الطلب ${ICONS.arrow}</a>
      </div>
      <div class="cta-band__points">
        <span>${ICONS.check} مراجعة وتدقيق التصاميم</span>
        <span>${ICONS.check} عينات قبل الإنتاج</span>
        <span>${ICONS.check} شحن وتوصيل لجميع مناطق المملكة</span>
      </div>
    </div>
  </section>`;
}

function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="مسار التنقل">${items
    .map((item, i) => {
      const sep = i > 0 ? `<span class="breadcrumb__sep" aria-hidden="true">/</span>` : "";
      return item.href
        ? `${sep}<a href="${item.href}">${item.label}</a>`
        : `${sep}<span aria-current="page">${item.label}</span>`;
    })
    .join("")}</nav>`;
}

function pageHero({ tag, title, lead, imageName, crumbs, actions = "", compact = false }) {
  return `<section class="page-hero${compact ? " page-hero--compact" : ""}">
    <div class="page-hero__glow" aria-hidden="true"></div>
    <div class="page-hero__grid-bg" aria-hidden="true"></div>
    <div class="container">
      ${breadcrumb(crumbs)}
      <div class="page-hero__inner">
        <div class="page-hero__content reveal">
          ${eyebrow(tag, true)}
          <h1>${title}</h1>
          <p>${lead}</p>
          <div class="page-hero__actions">${actions || `<a class="btn btn--gold" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp} اطلب عرض سعر فوري</a>
          <a class="btn btn--ghost" href="/projects.html">معرض الأعمال ${ICONS.arrow}</a>`}</div>
        </div>
        ${imageName ? `<div class="page-hero__visual reveal" data-delay="1">
          <div class="page-hero__frame">${image(imageName, { sizes: "(max-width: 900px) 90vw, 44vw", eager: true })}</div>
          <span class="page-hero__badge">${ICONS.shield} جودة معتمدة</span>
        </div>` : ""}
      </div>
    </div>
  </section>`;
}

function serviceOption(value) {
  return `<option value="${esc(value)}">${esc(value)}</option>`;
}

function quoteForm(id = "quote") {
  return `<form class="quote-form" id="${id}" data-quote-form novalidate>
    <div class="form-grid">
      <div class="field">
        <label for="q-name">الاسم الكريم / اسم المنشأة</label>
        <input id="q-name" name="name" type="text" autocomplete="name" placeholder="اكتب اسمك أو اسم شركتك" required>
      </div>
      <div class="field">
        <label for="q-phone">رقم الجوال (واتساب)</label>
        <input id="q-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="05xxxxxxxx" dir="ltr" required>
      </div>
      <div class="field">
        <label for="q-service">الخدمة المطلوبة</label>
        <select id="q-service" name="service" required>
          <option value="">اختر إحدى الخدمات الـ 26</option>
          ${SERVICE_OPTIONS.map(serviceOption).join("")}
        </select>
      </div>
      <div class="field">
        <label for="q-city">المدينة</label>
        <input id="q-city" name="city" type="text" autocomplete="address-level2" placeholder="الخبر، الدمام، الرياض، جدة..." required>
      </div>
      <div class="field field--full">
        <label for="q-details">تفاصيل الطلب والمواصفات</label>
        <textarea id="q-details" name="details" rows="4" placeholder="اذكر المقاسات، الكميات، نوع الخامة، وهل التصميم جاهز للطباعة"></textarea>
      </div>
      <div class="field field--full field--consent">
        <label class="checkbox">
          <input type="checkbox" name="consent" required>
          <span>أوافق على التواصل معي عبر واتساب بخصوص هذا الطلب وعرض السعر.</span>
        </label>
      </div>
      <div class="field field--full form-submit">
        <button class="btn btn--gold btn--lg" type="submit">${ICONS.whatsapp} إرسال الطلب عبر واتساب</button>
        <p class="form-note">سيُفتح تطبيق واتساب برسالة منظمة تحتوي على تفاصيل طلبك لسرعة الرد والمتابعة.</p>
      </div>
    </div>
    <p class="form-status" data-form-status role="status" aria-live="polite"></p>
  </form>`;
}

function contactCards() {
  return `<div class="contact-cards">
    <a class="contact-card" href="${telHref}">
      <span class="contact-card__icon">${ICONS.phone}</span>
      <span><small>اتصال مباشر</small><strong dir="ltr">${SITE.phoneDisplay}</strong></span>
    </a>
    <a class="contact-card contact-card--wa" href="${waHref()}" target="_blank" rel="noopener">
      <span class="contact-card__icon">${ICONS.whatsapp}</span>
      <span><small>واتساب فوري</small><strong>محادثة مع مسؤول التسعير</strong></span>
    </a>
  </div>`;
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AdvertisingAgency",
    "@id": `${SITE.domain}/#organization`,
    name: SITE.name,
    alternateName: [SITE.shortName, SITE.brandEn, SITE.brandAdv],
    url: SITE.domain,
    logo: abs("/assets/brand/logo-schema.webp"),
    image: abs("/assets/images/og-cover.jpg"),
    description: "وكالة سعودية متخصصة في الدعاية والإعلان والطباعة الرقمية والأوفست وصناعة اللوحات التجارية واليونيفورم وتغليف المنتجات.",
    telephone: SITE.phoneHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode,
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "26.4258",
      longitude: "50.1042",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:30",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "16:00",
        closes: "22:00",
      },
    ],
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.domain}/#website`,
    url: SITE.domain,
    name: SITE.name,
    inLanguage: "ar",
    publisher: { "@id": `${SITE.domain}/#organization` },
  };
}

function breadcrumbSchema(items, canonical) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? abs(item.href) : abs(canonical),
    })),
  };
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(`/services/${service.slug}.html`)}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.metaDescription,
    url: abs(`/services/${service.slug}.html`),
    image: abs(`/assets/images/${service.image}.jpg`),
    provider: { "@id": `${SITE.domain}/#organization` },
    areaServed: [
      { "@type": "City", name: SITE.city },
      { "@type": "Country", name: "المملكة العربية السعودية" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: abs("/contact.html#quote"),
      servicePhone: SITE.phoneHref,
    },
  };
}

function writePage(pathname, { title, description, imageName = "og-cover", schemas = [], bodyClass = "", content, active = pathname }) {
  const html = `${head({ title, description, canonicalPath: pathname, imageName, schemas, bodyClass })}
${header(active)}
<main id="main">
${content}
</main>
${footer()}
${floating()}
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
  const outPath = pathname === "/" ? path.join(ROOT, "index.html") : path.join(ROOT, pathname.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  console.log("wrote", path.relative(ROOT, outPath));
}

/* ------------------------------------------------------------------ */
/* Home Page                                                          */
/* ------------------------------------------------------------------ */

function homePage() {
  const homeProjects = [
    PROJECTS[0], // luxury-black-paper-bags
    PROJECTS[1], // manar-storefront-signage
    PROJECTS[2], // custom-paper-cups
    PROJECTS[3], // national-day-mugs
    PROJECTS[4], // vehicle-branding-truck
    PROJECTS[6], // exhibition-popup-stand
  ];

  const values = VALUES.map(
    (v) => `<li><span class="feature-list__icon">${ICONS[v.icon] || ICONS.star}</span><span><strong>${v.title}</strong><small>${v.text}</small></span></li>`
  ).join("");

  const content = `<section class="hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="hero__grid-bg" aria-hidden="true"></div>
    <div class="container hero__inner">
      <div class="hero__content reveal">
        ${eyebrow("وكالة منار الخليج للدعاية والإعلان • MANAR ADV", true)}
        <h1>حلول دعاية وطباعة<br><em>تجسّد فخامة علامتك</em></h1>
        <p class="hero__lead">من صناعة اللوحات التجارية والبنرات، إلى البوكسات الفاخرة، المطبوعات الورقية، اليونيفورم المطرز، وتجليد أسطول السيارات… نطبع رؤيتك بأحدث التقنيات وأعلى معايير الإتقان في المملكة.</p>
        <div class="hero__actions">
          <a class="btn btn--gold btn--lg" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp} اطلب عرض سعر فوري</a>
          <a class="btn btn--ghost btn--lg" href="/projects.html">شاهد أعمالنا ${ICONS.arrow}</a>
        </div>
        <ul class="hero__points">
          <li>${ICONS.check} أحدث تقنيات الطباعة</li>
          <li>${ICONS.check} خامات أصلية ومعتمدة</li>
          <li>${ICONS.check} توصيل وشحن لكافة مدن المملكة</li>
        </ul>
      </div>
      <div class="hero__visual reveal" data-delay="120">
        <div class="hero__frame">
          ${image("luxury-black-paper-bags", { sizes: "(max-width: 1024px) 92vw, 42vw", eager: true })}
          <div class="hero__frame-shade" aria-hidden="true"></div>
          <div class="hero__label">${ICONS.layers} طباعة رقمية • أوفست • لوحات</div>
          <div class="hero__glass-card">
            <span class="hero__glass-icon">${ICONS.shield}</span>
            <span><strong>Print Your Vision</strong><small>نطبع رؤيتك بدقة واحترافية</small></span>
          </div>
        </div>
        <div class="hero__mini">
          ${image("exhibition-popup-stand", { sizes: "260px" })}
          <span>استاندات وبوب اب</span>
        </div>
        <div class="hero__seal" aria-hidden="true"><small>دقة ألوان</small><strong>100%</strong></div>
      </div>
    </div>
    <a class="hero__scroll" href="#about"><span aria-hidden="true"></span>اكتشف المزيد</a>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      ${Array.from({ length: 2 })
        .map(
          () => `<span>طباعة استيكرات</span><i>•</i><span>صناعة اللوح التجارية</span><i>•</i><span>طباعة البوكسات والأكياس</span><i>•</i><span>كروت وبروشورات</span><i>•</i><span>بنرات ورول أب</span><i>•</i><span>تطريز يونيفورم</span><i>•</i><span>تجليد سيارات</span><i>•</i><span>طباعة أكواب ومجات</span><i>•</i><span>حفر أكريليك</span><i>•</i><span>تصميم وبرمجة ويب</span><i>•</i>`
        )
        .join("")}
    </div>
  </div>

  <section class="section about" id="about">
    <div class="container split split--about">
      <div class="about__media reveal">
        <div class="media-frame media-frame--main">${image("manar-storefront-signage", { sizes: "(max-width: 900px) 90vw, 44vw" })}</div>
        <div class="about__inset">${image("custom-paper-cups", { sizes: "300px" })}</div>
        <div class="about__badge">
          <span class="about__badge-icon">${ICONS.sparkles}</span>
          <span><strong>جودة فائقة</strong><small>وإتقان بالتنفيذ</small></span>
        </div>
        <span class="about__outline" aria-hidden="true"></span>
      </div>
      <div class="about__content reveal" data-delay="100">
        ${eyebrow("عن وكالة منار الخليج")}
        <h2>خبرة تمتد لسنوات…<br><em>وحلول طباعية متكاملة 360°</em></h2>
        <p>في وكالة منار الخليج للدعاية والإعلان، نؤمن بأن كل مطبوعة، لوحة تجارية، أو هدية ترويجية تحمل اسم شركتك هي فرصة لترسيخ مكانتك وبناء انطباع راقٍ لدى عملائك. لذلك نجمع تحت سقف واحد أحدث خطوط الإنتاج والتقنيات العالمية.</p>
        <p>نقدم لعملائنا في كافة مناطق المملكة منظومة خدمات تشمل تصنيع اللوحات الإعلانية المضيئة، طباعة البوكسات والكرتون، أكياس التسوق الفاخرة، طباعة وتطريز التيشرتات واليونيفورم والمرايل، تجليد أسطول السيارات، واستيكرات الفينيل، والهدايا الدعائية بدقة استثنائية وسرعة فائقة.</p>
        <ul class="feature-list">${values}</ul>
        <a class="link-arrow" href="/about.html">تعرّف أكثر على وكالتنا ${ICONS.arrow}</a>
      </div>
    </div>
  </section>

  <section class="section section--dark services" id="services">
    <div class="container">
      ${sectionHead({
        tag: "خدماتنا الرئيسية",
        title: "كل ما تحتاجه في عالم الدعاية والطباعة<br><em>تحت سقف واحد</em>",
        lead: "ثماني باقات تخصصية تغطي أكثر من 26 خدمة طباعية وإعلانية للشركات، المتاجر، والمؤسسات. اختر الخدمة أو أرسل لنا تفاصيل طلبك مباشرة.",
        light: true,
      })}
      <div class="services__grid">
        ${SERVICES.map(serviceCard).join("")}
        <a class="service-card service-card--cta reveal" href="/contact.html#quote" style="--delay:280ms">
          <span class="service-card__glow" aria-hidden="true"></span>
          <span class="service-card__icon">${ICONS.chat}</span>
          <h3>لديك طلب أو مشروع خاص؟</h3>
          <p>أرسل المواصفات والكميات التقريبية، وسيقوم فريقنا بتقديم دراسة فنية وتسعير فوري.</p>
          <span class="service-card__link">ابدأ طلبك الآن ${ICONS.arrow}</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--sand all-services" id="all-services">
    <div class="container">
      ${sectionHead({
        tag: "دليل الخدمات الشامل",
        title: "قائمة الخدمات الـ 26 <em>المتكاملة</em>",
        lead: "نوفر كافة حلول الطباعة والإنتاج الإعلاني والتجاري المستخدم في المملكة العربية السعودية مع طلب مباشر وسريع.",
        center: true,
      })}
      ${allServices26Grid()}
    </div>
  </section>

  <section class="section projects" id="projects">
    <div class="container">
      ${sectionHead({
        tag: "معرض أعمالنا",
        title: "نماذج حقيقية من <em>إبداعاتنا</em> المنفذة",
        lead: "صور من مشاريع نفّذناها لعملائنا في اللوحات التجارية، البوكسات، الأكياس، اليونيفورم، وتجليد السيارات. اضغط على أي صورة لتكبيرها.",
        action: `<a class="btn btn--outline" href="/projects.html">استعراض كل الأعمال ${ICONS.arrow}</a>`,
      })}
      ${galleryGrid(homeProjects, { home: true })}
    </div>
  </section>

  <section class="section section--sand process" id="process">
    <div class="container">
      ${sectionHead({
        tag: "مسار العمل",
        title: "خطوات واضحة<br><em>من الفكرة حتى استلام الطلب</em>",
        lead: "نظام عمل منظم ودقيق يضمن مطابقة الألوان وجودة الخامات والتسليم في الموعد المحدد.",
        center: true,
      })}
      ${processGrid()}
    </div>
  </section>

  <section class="section faq" id="faq">
    <div class="container faq__layout">
      <div class="faq__intro reveal">
        ${eyebrow("الأسئلة الشائعة")}
        <h2>أسئلة تهمك<br><em>قبل بدء الطلب</em></h2>
        <p>إجابات واضحة عن أكثر الأسئلة شيوعاً حول الطباعة، الملفات، الكميات، الشحن لجميع مدن المملكة، والضمان.</p>
        <a class="btn btn--outline" href="/faq.html">عرض كافة الأسئلة ${ICONS.arrow}</a>
      </div>
      <div class="faq__list reveal" data-delay="100">
        ${faqList(HOME_FAQ)}
      </div>
    </div>
  </section>

  ${ctaBand({ imageName: "manar-storefront-signage" })}`;

  return {
    title: "وكالة منار الخليج للدعاية والإعلان | طباعة ولوحات ويونيفورم وبوكسات في السعودية",
    description:
      "وكالة منار الخليج للدعاية والإعلان: خدمات طباعة متكاملة تشمل صناعة اللوحات التجارية، طباعة الكروت والبروشورات، البوكسات والأكياس، تطريز اليونيفورم، تجليد السيارات، والهدايا الدعائية مع شحن لكافة مدن المملكة.",
    content,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE.domain}/#webpage`,
        url: SITE.domain,
        name: "وكالة منار الخليج للدعاية والإعلان",
        isPartOf: { "@id": `${SITE.domain}/#website` },
        about: { "@id": `${SITE.domain}/#organization` },
        inLanguage: "ar",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* About Page                                                         */
/* ------------------------------------------------------------------ */

function aboutPage() {
  const valueCards = VALUES.map(
    (v, i) => `<article class="value-card reveal" style="--delay:${i * 70}ms">
      <span class="value-card__icon">${ICONS[v.icon] || ICONS.star}</span>
      <h3>${v.title}</h3>
      <p>${v.text}</p>
    </article>`
  ).join("");

  const content = `${pageHero({
    tag: "من نحن",
    title: "نطبع رؤيتك<br><em>بأعلى معايير الإتقان</em>",
    lead: "وكالة منار الخليج للدعاية والإعلان — شريكك الاستراتيجي في بناء وتجسيد هويتك التجارية من خلال حلول طباعية ولوحات إعلانية فاخرة في المملكة العربية السعودية.",
    imageName: "manar-storefront-signage",
    crumbs: [{ label: "الرئيسية", href: "/" }, { label: "من نحن" }],
  })}

  <section class="section about-story">
    <div class="container split">
      <div class="about-story__media reveal">
        <div class="media-frame">${image("luxury-black-paper-bags", { sizes: "(max-width: 900px) 90vw, 46vw" })}</div>
        <div class="about-story__caption"><span>${ICONS.check}</span> أحدث ماكينات الطباعة الرقمية والـ UV والقص الليزري</div>
      </div>
      <div class="about-story__content reveal" data-delay="100">
        ${eyebrow("قصتنا ورؤيتنا")}
        <h2>Print Your Vision:<br><em>فكرتك نترجمها لواقع ملموس</em></h2>
        <p>انطلقت وكالة منار الخليج للدعاية والإعلان لتسد الفجوة بين التصميم الإبداعي وجودة الإنتاج الطباعي. نحن لا نكتفي بضغطة زر الطباعة، بل ندرس طبيعة المنتج، نوع الورق، ملمس الخامات، ودقة زوايا القص لضمان أن كل قطعة تخرج بمستوى يليق باسم منشأتك.</p>
        <p>نمتلك ورشاً ومصانع مجهزة بأحدث خطوط الطباعة الرقمية فائقة السرعة، ماكينات الأوفست للكميات التجارية، ماكينات الحفر والقص بالليزر على الأكريلك والمعادن، ماكينات التطريز الكمبيوتري متعددة الرؤوس، وأجهزة تجليد السيارات الاحترافية.</p>
        <div class="about-story__points">
          <div><strong>+26</strong><span>خدمة طباعية متكاملة</span></div>
          <div><strong>100%</strong><span>مطابقة لألوان الهوية</span></div>
          <div><strong>كافة المدن</strong><span>شحن وتوصيل فوري</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--sand values">
    <div class="container">
      ${sectionHead({
        tag: "ركائز تميزنا",
        title: "قيم مهنية<br><em>تحكم كل مرحلة إنتاج</em>",
        lead: "التزام راسخ بالجودة، الدقة، والسرعة لنكون خيارك الأول والموثوق دائماً.",
        center: true,
      })}
      <div class="values__grid">${valueCards}</div>
    </div>
  </section>

  <section class="section process">
    <div class="container">
      ${sectionHead({
        tag: "طريقة عملنا",
        title: "منظومة إنتاج<br><em>تضمن خلو العمل من الأخطاء</em>",
        lead: "نتبع خطوات تدقيق دقيقة تبدأ من فحص ملفات التصميم وتنتهي بالفحص اليدوي والتغليف الآمن.",
      })}
      ${processGrid()}
    </div>
  </section>

  <section class="section section--dark about-why">
    <div class="container split split--reverse">
      <div class="about-why__content reveal">
        ${eyebrow("لماذا تختار منار الخليج", true)}
        <h2>لأن علامتك التجارية<br><em>تستحق الظهور بأبهى حلة</em></h2>
        <p>في بيئة الأعمال التنافسية في المملكة، تشكل التفاصيل الصغيرة الفرق بين العلامة العادية والعلامة الرائدة. نقدم لك حلولاً تجمع بين السعر العادل والجودة الاستثنائية والالتزام الزمني الصارم.</p>
        <ul class="check-list check-list--light">
          <li>${ICONS.check} تدقيق فني مجاني لملفات التصميم قبل الطباعة</li>
          <li>${ICONS.check} إمكانية معاينة عينات تجريبية للمشاريع الكبيرة</li>
          <li>${ICONS.check} خامات معتمدة ومقاومة للحرارة والشمس</li>
          <li>${ICONS.check} خصومات تصاعدية للمتاجر والشركات والعقود السنوية</li>
          <li>${ICONS.check} شحن سريع ومضمون لكافة مناطق ومحافظات المملكة</li>
        </ul>
        <a class="btn btn--gold" href="/contact.html#quote">ابدأ استشارتك الآن ${ICONS.arrow}</a>
      </div>
      <div class="about-why__media reveal" data-delay="100">
        <div class="media-frame media-frame--offset">${image("exhibition-popup-stand", { sizes: "(max-width: 900px) 90vw, 44vw" })}</div>
        <div class="about-why__tag">${ICONS.shield}<span>ضمان كامل على الجودة<br><strong>والمواصفات المتفق عليها</strong></span></div>
      </div>
    </div>
  </section>

  ${ctaBand({
    title: "انضم إلى نخبة عملائنا <em>في جميع أنحاء المملكة</em>",
    text: "تواصل معنا اليوم وناقش مشروعك مع خبرائنا لتحصل على أفضل الحلول الطباعية بأعلى معايير الإتقان.",
    imageName: "manar-storefront-signage",
  })}`;

  const crumbs = [
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/about.html" },
  ];
  return {
    title: "من نحن | وكالة منار الخليج للدعاية والإعلان",
    description:
      "تعرّف على وكالة منار الخليج للدعاية والإعلان: إمكانياتنا الإنتاجية في الطباعة الرقمية والأوفست، اللوحات التجارية، اليونيفورم وتغليف المنتجات في السعودية.",
    content,
    imageName: "manar-storefront-signage",
    schemas: [
      organizationSchema(),
      breadcrumbSchema(crumbs, "/about.html"),
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        url: abs("/about.html"),
        name: "من نحن | وكالة منار الخليج للدعاية والإعلان",
        isPartOf: { "@id": `${SITE.domain}/#website` },
        about: { "@id": `${SITE.domain}/#organization` },
        inLanguage: "ar",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Services Overview Page                                             */
/* ------------------------------------------------------------------ */

function servicesPage() {
  const content = `${pageHero({
    tag: "خدماتنا",
    title: "حلول إعلانية وطباعية متكاملة<br><em>تغطي كافة احتياجات منشأتك</em>",
    lead: "نقدم منظومة شاملة تضم 26 خدمة متخصصة موزعة على 8 قطاعات رئيسية: اللوحات، المطبوعات الورقية، البنرات والمعارض، البوكسات والأكياس، الاستيكرات والسيارات، اليونيفورم والتطريز، الهدايا الترويجية، والتصميم والويب.",
    imageName: "luxury-black-paper-bags",
    crumbs: [{ label: "الرئيسية", href: "/" }, { label: "خدماتنا" }],
  })}

  <section class="section services-page">
    <div class="container">
      <div class="intro-text reveal">
        <p>نوفر لكل شركة ومتجر ومؤسسة في المملكة العربية السعودية محطة واحدة تغنيها عن التعامل مع جهات متعددة. من تصميم الهوية البصرية والموقع الإلكتروني، إلى تصنيع اللوحات الإعلانية المضيئة وطباعة التغليف واليونيفورم والهدايا الدعائية.</p>
        <p>تصفح الباقات التخصصية أدناه أو اطلع على دليل الـ 26 خدمة الكامل للحصول على تفاصيل دقيقة وعرض سعر فوري.</p>
      </div>
      <div class="services__grid services__grid--light">
        ${SERVICES.map(serviceCard).join("")}
        <a class="service-card service-card--cta service-card--cta-light reveal" href="/contact.html#quote" style="--delay:280ms">
          <span class="service-card__icon">${ICONS.chat}</span>
          <h3>مشروع خاص أو طلب بكميات كبرى؟</h3>
          <p>أرسل المواصفات والكميات عبر واتساب وسنرسل لك عرض سعر مخصص للشركات.</p>
          <span class="service-card__link">اطلب عرض سعر خاص ${ICONS.arrow}</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--sand all-services-directory" id="directory">
    <div class="container">
      ${sectionHead({
        tag: "الفهرس الشامل",
        title: "دليل الخدمات الـ 26 <em>المفصلة</em>",
        lead: "كل خدمة مزودة بوصف فني وإمكانية طلب مباشر ومخصص عبر واتساب.",
        center: true,
      })}
      ${allServices26Grid()}
    </div>
  </section>

  <section class="section section--sand process">
    <div class="container">
      ${sectionHead({
        tag: "طريقة العمل",
        title: "كيف نضمن<br><em>أعلى جودة لطلبك؟</em>",
        lead: "خطوات محددة تمنع أي تفاوت لوني أو أخطاء مقاسات قبل مرحلة الإنتاج النهائي.",
        center: true,
      })}
      ${processGrid()}
    </div>
  </section>

  <section class="section faq">
    <div class="container faq__layout">
      <div class="faq__intro reveal">
        ${eyebrow("قبل أن تبدأ")}
        <h2>أجوبة سريعة<br><em>عن خدماتنا</em></h2>
        <p>أبرز الأسئلة المتكررة عند طلب عروض الأسعار والطباعة. للمزيد تصفح صفحة الأسئلة الشائعة.</p>
        <a class="btn btn--outline" href="/faq.html">كل الأسئلة ${ICONS.arrow}</a>
      </div>
      <div class="faq__list reveal" data-delay="100">${faqList([FAQS[1], FAQS[3], FAQS[4], FAQS[6]])}</div>
    </div>
  </section>

  ${ctaBand({ imageName: "manar-storefront-signage" })}`;

  const crumbs = [
    { label: "الرئيسية", href: "/" },
    { label: "خدماتنا", href: "/services.html" },
  ];
  return {
    title: "خدمات الدعاية والطباعة واللوحات واليونيفورم | وكالة منار الخليج",
    description:
      "استكشف خدمات وكالة منار الخليج للدعاية والإعلان: صناعة اللوحات التجارية، طباعة الكروت والبروشورات، البوكسات والأكياس، تطريز الملابس واليونيفورم، تجليد السيارات، والهدايا الدعائية.",
    content,
    imageName: "luxury-black-paper-bags",
    schemas: [
      organizationSchema(),
      breadcrumbSchema(crumbs, "/services.html"),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        url: abs("/services.html"),
        name: "خدمات وكالة منار الخليج للدعاية والإعلان",
        isPartOf: { "@id": `${SITE.domain}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: SERVICES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.title,
            url: abs(`/services/${s.slug}.html`),
          })),
        },
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Projects Page                                                      */
/* ------------------------------------------------------------------ */

function projectsPage() {
  const content = `${pageHero({
    tag: "معرض الأعمال",
    title: "أعمال وإبداعات<br><em>تتحدث عن فخامتها</em>",
    lead: "نماذج حقيقية من مشاريع نفذناها لعملائنا في اللوحات التجارية، الأكياس الفاخرة، البوكسات، الأكواب، اليونيفورم، وتجليد السيارات. استخدم التصنيفات لتصفح الأعمال.",
    imageName: "exhibition-popup-stand",
    crumbs: [{ label: "الرئيسية", href: "/" }, { label: "أعمالنا" }],
  })}

  <section class="section projects-page">
    <div class="container">
      ${galleryGrid(PROJECTS, { filterable: true })}
    </div>
  </section>

  <section class="section section--sand projects-note">
    <div class="container projects-note__inner">
      <div class="reveal">
        ${eyebrow("عن معرض الأعمال")}
        <h2>كل مشروع يحكي قصة نجاح<br><em>بمواصفات وتفاصيل خاصة</em></h2>
      </div>
      <div class="reveal" data-delay="100">
        <p>الصور المعروضة تمثل جزءاً من أعمال وكالة منار الخليج في صناعة اللوحات، طباعة الأكياس والبوكسات، الملابس واليونيفورم، الهدايا الدعائية، وتجليد السيارات. تختلف الخامات والتشطيبات بناءً على هوية كل علامة تجارية وميزانيتها.</p>
        <p>إذا لفت انتباهك أي نموذج وترغب في تنفيذ مماثل لهويتك، أرسل لنا الصورة والكمية وسنوضح لك الخيارات المتاحة والتكلفة الدقيقة.</p>
        <a class="link-arrow" href="/contact.html#quote">اطلب تنفيذ مشروع مماثل ${ICONS.arrow}</a>
      </div>
    </div>
  </section>

  ${ctaBand({
    title: "مشروعك القادم<br><em>يبدأ بفكرة ومواصفات</em>",
    text: "أرسل لنا تفاصيل طلبك وشعارك وسيقوم فريقنا بتقديم عينات ومقترحات تنفيذية راقية.",
    imageName: "luxury-black-paper-bags",
  })}`;

  const crumbs = [
    { label: "الرئيسية", href: "/" },
    { label: "أعمالنا", href: "/projects.html" },
  ];
  return {
    title: "معرض الأعمال | نماذج مشاريع الطباعة واللوحات – منار الخليج",
    description:
      "استعرض نماذج حقيقية من مشاريع وكالة منار الخليج للدعاية والإعلان في اللوحات التجارية، البوكسات والأكياس، المجات، اليونيفورم، وتجليد السيارات في السعودية.",
    content,
    imageName: "exhibition-popup-stand",
    schemas: [
      organizationSchema(),
      breadcrumbSchema(crumbs, "/projects.html"),
      {
        "@context": "https://schema.org",
        "@type": ["CollectionPage", "ImageGallery"],
        url: abs("/projects.html"),
        name: "معرض أعمال وكالة منار الخليج",
        isPartOf: { "@id": `${SITE.domain}/#website` },
        image: PROJECTS.map((p) => abs(`/assets/images/${p.image}.jpg`)),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: PROJECTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "CreativeWork",
              name: p.title,
              description: p.text,
              image: abs(`/assets/images/${p.image}.jpg`),
            },
          })),
        },
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* FAQ Page                                                           */
/* ------------------------------------------------------------------ */

function faqPage() {
  const cats = [...new Set(FAQS.map((f) => f.cat))];
  const groups = cats
    .map(
      (cat) => `<section class="faq-group reveal">
      <div class="faq-group__head"><span class="faq-group__dot"></span><h2>${cat}</h2></div>
      ${faqList(FAQS.filter((f) => f.cat === cat))}
    </section>`
    )
    .join("");

  const content = `${pageHero({
    tag: "الأسئلة الشائعة",
    title: "كل ما تود معرفته<br><em>عن خدمات الطباعة والتنفيذ</em>",
    lead: "إجابات شاملة عن تجهيز الملفات، أنظمة الألوان، مدد التنفيذ، الشحن لجميع مدن المملكة، الضمان، وعقود الشركات.",
    imageName: "national-day-mugs",
    crumbs: [{ label: "الرئيسية", href: "/" }, { label: "الأسئلة الشائعة" }],
  })}

  <section class="section faq-page">
    <div class="container faq-page__layout">
      <aside class="faq-page__aside reveal">
        <span class="faq-page__icon">${ICONS.chat}</span>
        <h2>لديك سؤال<br><em>إضافي؟</em></h2>
        <p>فريق خدمة العملاء والمسؤولين الفنيين جاهزون للإجابة على كافة استفساراتك فوراً عبر واتساب أو الهاتف.</p>
        <a class="btn btn--gold" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp} اسأل عبر واتساب</a>
        <a class="btn btn--outline" href="tel:${SITE.phoneHref}">${ICONS.phone} اتصل بنا</a>
      </aside>
      <div class="faq-page__content">${groups}</div>
    </div>
  </section>

  ${ctaBand({ imageName: "manar-storefront-signage" })}`;

  const crumbs = [
    { label: "الرئيسية", href: "/" },
    { label: "الأسئلة الشائعة", href: "/faq.html" },
  ];
  return {
    title: "الأسئلة الشائعة عن الطباعة واللوحات والتنفيذ – منار الخليج",
    description:
      "إجابات عن أسئلة الطباعة الرقمية والأوفست، اللوحات الإعلانية، البوكسات، اليونيفورم، مدد التسليم، والشحن لكافة مدن المملكة العربية السعودية.",
    content,
    imageName: "national-day-mugs",
    schemas: [
      organizationSchema(),
      faqSchema(FAQS),
      breadcrumbSchema(crumbs, "/faq.html"),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: abs("/faq.html"),
        name: "الأسئلة الشائعة",
        isPartOf: { "@id": `${SITE.domain}/#website` },
        inLanguage: "ar",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Contact Page                                                       */
/* ------------------------------------------------------------------ */

function contactPage() {
  const content = `${pageHero({
    tag: "تواصل معنا",
    title: "أخبرنا عن مشروعك،<br><em>وسنرد عليك بعرض سعر فوري</em>",
    lead: "حدد الخدمة والمواصفات من خلال النموذج أدناه، أو تواصل مباشرة مع فريقنا عبر واتساب أو الاتصال الهاتفي. نسعد بخدمتك وشحن طلباتك لجميع مناطق المملكة.",
    imageName: "manar-storefront-signage",
    crumbs: [{ label: "الرئيسية", href: "/" }, { label: "تواصل معنا" }],
    actions: `<a class="btn btn--gold" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp} واتساب مباشر</a>
      <a class="btn btn--ghost" href="tel:${SITE.phoneHref}">${ICONS.phone} اتصل الآن</a>`,
  })}

  <section class="section contact-page" id="quote">
    <div class="container contact-page__layout">
      <div class="contact-form-card reveal">
        <div class="contact-form-card__head">
          ${eyebrow("طلب عرض سعر ومواصفات")}
          <h2>أرسل تفاصيل مشروعك الطباعي</h2>
          <p>املأ الحقول الأساسية، وسيتم تحويلك مباشرة إلى محادثة واتساب مع رسالة جاهزة تتضمن كافة بيانات طلبك.</p>
        </div>
        ${quoteForm()}
      </div>
      <aside class="contact-side reveal" data-delay="100">
        ${contactCards()}
        <div class="contact-info">
          <div class="contact-info__item">${ICONS.pin}<div><strong>المقر والمعرض</strong><span>${SITE.address}</span></div></div>
          <div class="contact-info__item">${ICONS.phone}<div><strong>هاتف المعرض الثابت</strong><span dir="ltr"><a href="${landlineHref}">${SITE.landlineDisplay}</a></span></div></div>
          <div class="contact-info__item">${ICONS.truck}<div><strong>نطاق الخدمة والشحن</strong><span>${SITE.shippingScope}</span></div></div>
          <div class="contact-info__item">${ICONS.clock}<div><strong>أوقات العمل والمعرض</strong><span>${SITE.hours}</span><span>${SITE.hoursFriday}</span></div></div>
        </div>
        <div class="contact-side__note">
          <span>${ICONS.shield}</span>
          <p><strong>استشارة فنية متخصصة</strong>يساعدك فريقنا الفني في اختيار أنسب أنواع الورق، تقنيات الطباعة، وسماكات الأكريليك لتحقيق أعلى فخامة بأفضل تكلفة.</p>
        </div>
        <a class="contact-map" href="${SITE.mapUrl}" target="_blank" rel="noopener">
          <span>${ICONS.pin} ${SITE.address}</span>
          <span class="contact-map__arrow">${ICONS.arrow}</span>
        </a>
      </aside>
    </div>
  </section>

  <section class="section section--sand contact-steps">
    <div class="container">
      ${sectionHead({
        tag: "ما بعد إرسال الطلب",
        title: "خطوات سريعة<br><em>تضمن سرعة الإنجاز</em>",
        lead: "متابعة فورية ومباشرة من مسؤول التسعير والإنتاج.",
        center: true,
      })}
      <div class="contact-steps__grid">
        <article class="contact-step reveal"><span>01</span><h3>مراجعة المواصفات</h3><p>نراجع تفاصيل طلبك والكميات ونوع الخامة المطلوبة والتصميم.</p></article>
        <article class="contact-step reveal" style="--delay:80ms"><span>02</span><h3>إرسال عرض السعر</h3><p>نرسل لك عرض سعر رسمي ومفصل يوضح التكلفة ومدة التنفيذ.</p></article>
        <article class="contact-step reveal" style="--delay:160ms"><span>03</span><h3>بدء الإنتاج والشحن</h3><p>نبدأ في الطباعة والتصنيع فور اعتماد العينة، ثم التوصيل لباب مقرك.</p></article>
      </div>
    </div>
  </section>`;

  const crumbs = [
    { label: "الرئيسية", href: "/" },
    { label: "تواصل معنا", href: "/contact.html" },
  ];
  return {
    title: "تواصل معنا واطلب عرض سعر | وكالة منار الخليج للدعاية والإعلان",
    description:
      "تواصل مع وكالة منار الخليج للدعاية والإعلان في السعودية عبر واتساب 0543101777 أو الهاتف لطلب عروض أسعار المطبوعات واللوحات واليونيفورم والتغليف.",
    content,
    imageName: "manar-storefront-signage",
    schemas: [
      organizationSchema(),
      breadcrumbSchema(crumbs, "/contact.html"),
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: abs("/contact.html"),
        name: "تواصل مع وكالة منار الخليج",
        isPartOf: { "@id": `${SITE.domain}/#website` },
        mainEntity: { "@id": `${SITE.domain}/#organization` },
        inLanguage: "ar",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Privacy & 404 Pages                                                */
/* ------------------------------------------------------------------ */

function privacyPage() {
  const content = `${pageHero({
    tag: "سياسة الخصوصية",
    title: "خصوصيتك<br><em>وأمان بياناتك أولويتنا</em>",
    lead: "نوضح هنا التزام وكالة منار الخليج للدعاية والإعلان بحماية بياناتك الشخصية والتجارية وسرية تصاميمك وملفاتك الطباعية.",
    crumbs: [{ label: "الرئيسية", href: "/" }, { label: "سياسة الخصوصية" }],
    compact: true,
    actions: `<a class="btn btn--gold" href="/contact.html#quote">تواصل معنا ${ICONS.arrow}</a>`,
  })}

  <section class="section legal">
    <div class="container legal__inner prose">
      <h2>البيانات التي نجمعها</h2>
      <p>عند استخدامك لنموذج طلب عرض السعر أو التواصل معنا، نطلب معلومات مثل: الاسم، اسم الشركة أو المنشأة، رقم الجوال للتواصل، المدينة، وتفاصيل الخدمة المطلوبة. تُستخدم هذه البيانات حصراً للتواصل معك وتقديم عروض الأسعار ومتابعة تنفيذ طلباتك.</p>
      
      <h2>سرية التصاميم والملفات الطباعية</h2>
      <p>تلتزم وكالة منار الخليج بالحفاظ التام على سرية كافة ملفات التصميم، الشعارات، والمخططات الهندسية التي تشاركها معنا. لا يتم مشاركة أو إعادة استخدام أو بيع أي تصميم خاص بعملائنا لأي طرف ثالث تحت أي ظرف.</p>

      <h2>آلية إرسال البيانات عبر الموقع</h2>
      <p>موقعنا مصمم ليكون آمناً وخفيفاً؛ نموذج طلب عرض السعر يقوم بتهيئة رسالة منظمة عبر تطبيق واتساب المشفر ليتم التواصل المباشر بينك وبين ممثل خدمة العملاء دون تخزين بيانات في قواعد بيانات عامة على الموقع.</p>

      <h2>ملفات تعريف الارتباط (Cookies)</h2>
      <p>موقعنا ثابت وآمن ولا يستخدم ملفات تعريف ارتباط لتتبع المستخدمين أو الإعلانات التجسسية. قد تعتمد خوادم الاستضافة على ملفات تقنية أساسية لضمان سرعة تحميل الصفحات وتأمين الاتصال.</p>

      <h2>التواصل والاستفسار</h2>
      <p>لأي استفسار بخصوص سياسة الخصوصية أو سرية ملفاتك، يمكنك التواصل معنا مباشرة عبر واتساب <a href="${waHref()}" target="_blank" rel="noopener">محادثة مباشرة</a> أو هاتفياً على <a href="${telHref}" dir="ltr">${SITE.phoneDisplay}</a> أو <a href="${landlineHref}" dir="ltr">${SITE.landlineDisplay}</a>.</p>
      <p class="legal__updated">آخر تحديث: 15 نوفمبر 2026</p>
    </div>
  </section>`;

  const crumbs = [
    { label: "الرئيسية", href: "/" },
    { label: "سياسة الخصوصية", href: "/privacy.html" },
  ];
  return {
    title: "سياسة الخصوصية | وكالة منار الخليج للدعاية والإعلان",
    description: "سياسة الخصوصية وسرية البيانات والتصاميم المعتمدة في وكالة منار الخليج للدعاية والإعلان.",
    content,
    schemas: [breadcrumbSchema(crumbs, "/privacy.html")],
  };
}

function notFoundPage() {
  const content = `<section class="not-found">
    <div class="not-found__glow" aria-hidden="true"></div>
    <div class="container not-found__inner">
      <span class="not-found__code">404</span>
      <h1>الصفحة غير موجودة</h1>
      <p>عذراً، يبدو أن الرابط المطلوب قد تم نقله أو تغييره. يمكنك العودة للصفحة الرئيسية أو استعراض خدماتنا الـ 26 وأعمالنا المنفذة.</p>
      <div class="not-found__actions">
        <a class="btn btn--gold" href="/">العودة للرئيسية ${ICONS.arrow}</a>
        <a class="btn btn--ghost" href="/services.html">استعراض الخدمات (26 خدمة)</a>
        <a class="btn btn--ghost" href="/projects.html">معرض الأعمال</a>
      </div>
    </div>
  </section>`;
  return {
    title: "الصفحة غير موجودة | منار الخليج للدعاية والإعلان",
    description: "الصفحة المطلوبة غير موجودة. تصفح خدمات وأعمال وكالة منار الخليج للدعاية والإعلان.",
    content,
  };
}

/* ------------------------------------------------------------------ */
/* Individual Service Detail Pages                                    */
/* ------------------------------------------------------------------ */

function servicePage(service) {
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const related = others.slice(0, 3);
  const crumbs = [
    { label: "الرئيسية", href: "/" },
    { label: "خدماتنا", href: "/services.html" },
    { label: service.title, href: `/services/${service.slug}.html` },
  ];
  const featureCards = service.features
    .map(
      (f, i) => `<article class="feature-card reveal" style="--delay:${i * 70}ms">
      <span class="feature-card__num">0${i + 1}</span>
      <h3>${f.title}</h3>
      <p>${f.text}</p>
    </article>`
    )
    .join("");
  const includes = service.includes.map((x) => `<li>${ICONS.check}<span>${x}</span></li>`).join("");
  const suitable = service.suitable.map((x) => `<li>${x}</li>`).join("");
  const steps = PROCESS.map(
    (step) => `<li><span class="steps-list__num">${step.n}</span><div><strong>${step.title}</strong><p>${step.text}</p></div></li>`
  ).join("");
  const asideRelated = others
    .slice(0, 5)
    .map(
      (s) => `<a href="/services/${s.slug}.html"><span>${ICONS[s.icon] || ICONS.printer}</span><span>${s.title}</span>${ICONS.arrow}</a>`
    )
    .join("");

  const galleryImages = service.gallery && service.gallery.length >= 2
    ? service.gallery
    : [service.image, "luxury-black-paper-bags"];

  const content = `${pageHero({
    tag: "خدمات وكالة منار الخليج",
    title: service.title,
    lead: service.heroLead,
    imageName: service.image,
    crumbs: [{ label: "الرئيسية", href: "/" }, { label: "خدماتنا", href: "/services.html" }, { label: service.title }],
    actions: `<a class="btn btn--gold" href="${waHref(`السلام عليكم، أرغب بطلب عرض سعر لخدمة: ${service.title}.`)}" target="_blank" rel="noopener">${ICONS.whatsapp} اطلب عرض سعر فوري</a>
      <a class="btn btn--ghost" href="#details">تفاصيل الخدمة ${ICONS.arrow}</a>`,
  })}

  <section class="section service-page" id="details">
    <div class="container service-layout">
      <article class="service-prose">
        <span class="eyebrow">نظرة عامة على الخدمة</span>
        <h2>${service.title} بأعلى معايير الإتقان</h2>
        ${service.intro.map((p) => `<p>${p}</p>`).join("")}
        <div class="feature-grid">${featureCards}</div>

        <h2>ماذا تشمل هذه الخدمة؟</h2>
        <p>نوضح لك نطاق العمل والمواصفات الفنية بكل شفافية قبل البدء في الإنتاج:</p>
        <ul class="check-grid">${includes}</ul>

        <div class="media-pair">
          <figure>${image(galleryImages[0], { sizes: "(max-width: 900px) 90vw, 34vw" })}<figcaption>${service.title} — نموذج من تنفيذ وكالة منار الخليج</figcaption></figure>
          <figure>${image(galleryImages[1], { sizes: "(max-width: 900px) 90vw, 34vw" })}<figcaption>دقة التفاصيل والتشطيب النهائي</figcaption></figure>
        </div>

        <h2>القطاعات والأنشطة الأكثر استفادة</h2>
        <ul class="tag-list">${suitable}</ul>

        <h2>مسار العمل والتنفيذ</h2>
        <ol class="steps-list">${steps}</ol>

        <h2>أسئلة شائعة عن ${service.title}</h2>
        ${faqList(service.faqs)}

        <div class="service-callout">
          <span class="service-callout__icon">${ICONS.sparkles}</span>
          <div><strong>تحتاج مواصفات أو مقاسات خاصة؟</strong><p>أرسل تفاصيل فكرتك وشعارك عبر واتساب، وسيقوم فريقنا بدراستها وتقديم مقترحات خامات وعينات سريعة.</p></div>
          <a class="btn btn--gold btn--sm" href="${waHref(`السلام عليكم، لدي استفسار خاص عن خدمة ${service.title}.`)}" target="_blank" rel="noopener">استشرنا الآن ${ICONS.arrow}</a>
        </div>
      </article>

      <aside class="service-aside">
        <div class="quote-card">
          <span class="quote-card__icon">${ICONS.whatsapp}</span>
          <h2>اطلب تسعيراً فورياً<br>لمشروعك</h2>
          <p>أرسل الكميات والمقاسات التقريبية وسنرسل لك عرض سعر تفصيلي ومحدد.</p>
          <a class="btn btn--gold" href="${waHref(`السلام عليكم، أرغب بطلب عرض سعر لخدمة ${service.title}.`)}" target="_blank" rel="noopener">${ICONS.whatsapp} واتساب مباشر</a>
          <a class="btn btn--outline" href="tel:${SITE.phoneHref}">${ICONS.phone} <span dir="ltr">${SITE.phoneDisplay}</span></a>
          <ul class="quote-card__points">
            <li>${ICONS.check} تدقيق ملفات وتعديل التصميم</li>
            <li>${ICONS.check} دقة ألوان مطابقة 100%</li>
            <li>${ICONS.check} شحن وتوصيل لكافة مدن المملكة</li>
          </ul>
        </div>
        <div class="aside-services">
          <h3>خدمات أخرى قد تهمك</h3>
          ${asideRelated}
        </div>
      </aside>
    </div>
  </section>

  <section class="section section--sand process">
    <div class="container">
      ${sectionHead({
        tag: "ضمان الجودة",
        title: "خطوات واضحة<br><em>من الطلب حتى التسليم</em>",
        lead: "متابعة دقيقة لكل تفصيلة لضمان مطابقة المنتج النهائي لتطلعاتك.",
        center: true,
      })}
      ${processGrid()}
    </div>
  </section>

  <section class="section related-services">
    <div class="container">
      ${sectionHead({
        tag: "استكشف أيضاً",
        title: "باقات <em>مكملة</em> لمشروعك",
      })}
      <div class="related-grid">
        ${related
          .map(
            (s) => `<a class="related-card reveal" href="/services/${s.slug}.html">
          <span class="related-card__icon">${ICONS[s.icon] || ICONS.printer}</span>
          <h3>${s.title}</h3>
          <p>${s.short}</p>
          <span class="related-card__link">${ICONS.arrow}</span>
        </a>`
          )
          .join("")}
      </div>
    </div>
  </section>

  ${ctaBand({
    title: `جاهز لبدء تنفيذ<br><em>${service.title}؟</em>`,
    text: "تواصل مع فريقنا الآن للحصول على أفضل الخامات وأنقى درجات الألوان والتسليم في الموعد.",
    imageName: service.image,
  })}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    content,
    imageName: service.image,
    schemas: [
      organizationSchema(),
      serviceSchema(service),
      breadcrumbSchema(crumbs, `/services/${service.slug}.html`),
      faqSchema(service.faqs),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: abs(`/services/${service.slug}.html`),
        name: service.metaTitle,
        description: service.metaDescription,
        isPartOf: { "@id": `${SITE.domain}/#website` },
        primaryImageOfPage: abs(`/assets/images/${service.image}.jpg`),
        inLanguage: "ar",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Sitemap, Robots, Manifest Builders                                 */
/* ------------------------------------------------------------------ */

function buildSitemap() {
  const urls = [
    { loc: "/", priority: "1.0", images: ["luxury-black-paper-bags", "manar-storefront-signage", "custom-paper-cups", "exhibition-popup-stand"] },
    { loc: "/about.html", priority: "0.8", images: ["manar-storefront-signage", "luxury-black-paper-bags"] },
    { loc: "/services.html", priority: "0.9", images: ["luxury-black-paper-bags", "custom-carton-box"] },
    { loc: "/projects.html", priority: "0.9", images: PROJECTS.map((p) => p.image) },
    { loc: "/faq.html", priority: "0.7", images: ["national-day-mugs"] },
    { loc: "/contact.html", priority: "0.8", images: ["manar-storefront-signage"] },
    { loc: "/privacy.html", priority: "0.3", images: [] },
    ...SERVICES.map((s) => ({
      loc: `/services/${s.slug}.html`,
      priority: "0.9",
      images: [s.image, ...s.gallery],
    })),
  ];

  const entries = urls
    .map(
      (u) => `<url>
    <loc>${abs(u.loc)}</loc>
    <lastmod>${SITE.updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
    ${[...new Set(u.images)]
      .map(
        (img) => `<image:image>
      <image:loc>${abs(`/assets/images/${img}.jpg`)}</image:loc>
      <image:title>${esc(MANIFEST[img]?.alt ?? "مشروع من أعمال وكالة منار الخليج")}</image:title>
    </image:image>`
      )
      .join("\n    ")}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /
Disallow: /tools/

Sitemap: ${abs("/sitemap.xml")}
`;
}

function buildManifest() {
  return JSON.stringify(
    {
      name: SITE.name,
      short_name: SITE.shortName,
      description: "وكالة منار الخليج للدعاية والإعلان وحلول الطباعة واللوحات واليونيفورم والتغليف في المملكة العربية السعودية.",
      lang: "ar",
      dir: "rtl",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#fafbfe",
      theme_color: "#061536",
      icons: [
        { src: "/assets/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/assets/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/assets/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    null,
    2
  );
}

/* ------------------------------------------------------------------ */
/* Execution                                                          */
/* ------------------------------------------------------------------ */

console.log("Generating website pages...");

const home = homePage();
writePage("/", home);
writePage("/about.html", aboutPage());
writePage("/services.html", servicesPage());
writePage("/projects.html", projectsPage());
writePage("/faq.html", faqPage());
writePage("/contact.html", contactPage());
writePage("/privacy.html", privacyPage());

for (const service of SERVICES) {
  writePage(`/services/${service.slug}.html`, servicePage(service));
}

const notFound = notFoundPage();
const nfHtml = `${head({
  title: notFound.title,
  description: notFound.description,
  canonicalPath: "/404.html",
  schemas: [],
  noindex: true,
})}
${header("/404.html")}
<main id="main">${notFound.content}</main>
${footer()}
${floating()}
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
fs.writeFileSync(path.join(ROOT, "404.html"), nfHtml, "utf8");
console.log("wrote 404.html");

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), buildSitemap(), "utf8");
fs.writeFileSync(path.join(ROOT, "robots.txt"), buildRobots(), "utf8");
fs.writeFileSync(path.join(ROOT, "manifest.webmanifest"), buildManifest(), "utf8");
console.log("wrote sitemap.xml, robots.txt, manifest.webmanifest");
console.log("Build complete!");
