"""
Process all brand assets and sample works for Manar Al-Khaleej Advertising Agency.
"""
import json
import os
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter
import numpy as np

ROOT = Path(r"E:\projects\reem-alnufooth-glass")
SRC_DIR = ROOT / "WhatsApp Unknown 2026-11-15 at 10.20.12 PM"
BRAND_DIR = ROOT / "assets" / "brand"
IMAGES_DIR = ROOT / "assets" / "images"

BRAND_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def make_transparent(img_rgb, threshold=242):
    arr = np.array(img_rgb).astype(float)
    min_rgb = np.min(arr, axis=2)
    alpha = np.clip((255 - min_rgb) * (255.0 / (255 - threshold)), 0, 255)
    a_norm = np.maximum(alpha / 255.0, 1e-5)[:, :, np.newaxis]
    rgb_clean = np.clip((arr - 255 * (1 - a_norm)) / a_norm, 0, 255)
    rgba = np.dstack([rgb_clean, alpha]).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')

def make_white_version(img_rgba):
    # Where pixels are dark navy (high alpha, low red/green), convert to pure white while preserving alpha and orange colors
    arr = np.array(img_rgba).astype(float)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    # Check if pixel is predominantly orange: high red, medium green, low blue (e.g. #ff6600)
    is_orange = (r > 180) & (g > 60) & (b < 100) & (a > 30)
    # Non-orange visible pixels (the dark navy letters/shapes) should be converted to clean white
    is_dark = (~is_orange) & (a > 20)
    
    new_arr = arr.copy()
    new_arr[is_dark, 0] = 255
    new_arr[is_dark, 1] = 255
    new_arr[is_dark, 2] = 255
    return Image.fromarray(new_arr.astype(np.uint8), 'RGBA')

print("1. Processing Brand Assets...")
im_logo_card = Image.open(ROOT / "Untitled-1.jpg.jpeg").convert('RGB')
diff1 = ImageChops.difference(im_logo_card, Image.new('RGB', im_logo_card.size, (255, 255, 255)))
bbox1 = diff1.getbbox()
logo_cropped = im_logo_card.crop(bbox1)

# Square emblem for badge
logo_trans = make_transparent(logo_cropped)
# Pad into a clean square with generous margins
max_dim = max(logo_trans.width, logo_trans.height)
pad = int(max_dim * 0.15)
sq_size = max_dim + 2 * pad
square_img = Image.new('RGBA', (sq_size, sq_size), (255, 255, 255, 0))
ox = (sq_size - logo_trans.width) // 2
oy = (sq_size - logo_trans.height) // 2
square_img.paste(logo_trans, (ox, oy), logo_trans)

# Save logo-square variants
sq_700 = square_img.resize((700, 700), Image.Resampling.LANCZOS)
sq_700.save(BRAND_DIR / "logo-square.png", optimize=True)
sq_700.save(BRAND_DIR / "logo-square.webp", "WEBP", quality=95, method=6)

# Schema logo (512x512)
sq_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
sq_512.save(BRAND_DIR / "logo-schema.webp", "WEBP", quality=90, method=6)
sq_512.save(BRAND_DIR / "icon-512.png", optimize=True)

# App & browser icons
for size in (192, 180, 64, 32):
    resized = square_img.resize((size, size), Image.Resampling.LANCZOS)
    if size == 180:
        resized.save(BRAND_DIR / "apple-touch-icon.png", optimize=True)
    elif size == 32:
        resized.save(BRAND_DIR / "favicon-32.png", optimize=True)
    elif size == 64:
        resized.save(BRAND_DIR / "favicon-64.png", optimize=True)
    else:
        resized.save(BRAND_DIR / f"icon-{size}.png", optimize=True)

square_img.resize((48, 48), Image.Resampling.LANCZOS).save(
    BRAND_DIR / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
)

# Wide logo lockup
im_banner = Image.open(ROOT / "Untitled-1.jpg12.jpg.jpeg").convert('RGB')
diff2 = ImageChops.difference(im_banner, Image.new('RGB', im_banner.size, (255, 255, 255)))
bbox2 = diff2.getbbox()
banner_cropped = im_banner.crop(bbox2)
banner_trans = make_transparent(banner_cropped)

# Composite wide lockup: Emblem + Text
# Let's scale emblem to match banner height nicely
target_h = banner_trans.height
logo_scaled_w = int(logo_trans.width * (target_h / logo_trans.height))
logo_scaled = logo_trans.resize((logo_scaled_w, target_h), Image.Resampling.LANCZOS)

spacing = int(target_h * 0.25)
total_w = banner_trans.width + spacing + logo_scaled_w
wide_canvas = Image.new('RGBA', (total_w, target_h), (255, 255, 255, 0))
# Right side: emblem, Left side: typography (since RTL)
wide_canvas.paste(logo_scaled, (total_w - logo_scaled_w, 0), logo_scaled)
wide_canvas.paste(banner_trans, (0, 0), banner_trans)

# Pad wide canvas slightly for elegant breathing room
w_pad = int(target_h * 0.1)
wide_padded = Image.new('RGBA', (total_w + 2 * w_pad, target_h + 2 * w_pad), (255, 255, 255, 0))
wide_padded.paste(wide_canvas, (w_pad, w_pad), wide_canvas)

# Resize to standard width 1200
final_w = 1200
final_h = int(wide_padded.height * (final_w / wide_padded.width))
wide_final = wide_padded.resize((final_w, final_h), Image.Resampling.LANCZOS)

wide_final.save(BRAND_DIR / "logo-wide.png", optimize=True)
wide_final.save(BRAND_DIR / "logo-wide.webp", "WEBP", quality=94, method=6)

# Create dark-background version (white text for footer/dark mode)
wide_light = make_white_version(wide_final)
wide_light.save(BRAND_DIR / "logo-wide-light.png", optimize=True)
wide_light.save(BRAND_DIR / "logo-wide-light.webp", "WEBP", quality=94, method=6)

print("Brand assets created successfully.")

print("2. Processing Sample Works Photos...")
PHOTOS = {
    "WhatsApp Image 2026-11-15 at 8.19.30 PM (1).jpeg": (
        "manar-storefront-signage",
        "signage",
        "لوحة تجارية ثلاثية الأبعاد مضيئة وواجهة مقر وكالة منار الخليج للدعاية والإعلان",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.30 PM.jpeg": (
        "custom-paper-cups",
        "packaging",
        "طباعة أكواب ورقية وكارتونية مخصصة للمقاهي والشركات من وكالة منار الخليج",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.31 PM (1).jpeg": (
        "custom-carton-box",
        "packaging",
        "تصنيع وطباعة بوكسات وكراتين منتجات وهدايا مخصصة",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.31 PM (2).jpeg": (
        "national-day-mugs",
        "gifts",
        "طباعة حرارية لمجات وأكواب سيراميك لليوم الوطني والمناسبات المؤسسية",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.31 PM (3).jpeg": (
        "vehicle-branding-truck",
        "stickers",
        "تجليد وتركيب استيكر فينيل للسيارات والشاحنات وحافلات الشركات",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.31 PM.jpeg": (
        "ecommerce-shipping-boxes",
        "packaging",
        "علب وبوكسات كرتونية متينة للمتاجر الإلكترونية وشركات التوصيل",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.32 PM (1).jpeg": (
        "restaurant-food-boxes",
        "packaging",
        "طباعة وتفصيل علب وجبات ومطاعم وبيتزا آمنة غذائياً",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.32 PM (2).jpeg": (
        "exhibition-popup-stand",
        "banners",
        "استاند بوب اب كيرف وخلفيات معارض ومؤتمرات بجودة طباعة فوتوغرافية",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.32 PM (3).jpeg": (
        "embroidered-caps-green",
        "apparel",
        "تطريز كمبيوتري فخم لشعارات الشركات على الكابات والقبعات",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.32 PM.jpeg": (
        "printed-promotional-cap",
        "apparel",
        "طباعة كابات دعائية ملونة للفعاليات والأنشطة الترويجية",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.36 PM.jpeg": (
        "luxury-black-paper-bags",
        "packaging",
        "أكياس ورقية سوداء فاخرة بطباعة هوية بالبصمة الذهبية والمعدنية",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.38 PM.jpeg": (
        "thermal-travel-tumblers",
        "gifts",
        "أكواب وحوافظ حرارية ومجات ستانلس ستيل للطباعة وحفر الليزر",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.44 PM.jpeg": (
        "die-cut-greeting-cards",
        "print",
        "كروت شخصية وبطاقات إهداء مقصوصة ليزرياً للمناسبات والأعياد",
        None,
    ),
    "WhatsApp Image 2026-11-15 at 8.19.52 PM.jpeg": (
        "boutique-shopping-bag",
        "packaging",
        "أكياس تسوق ورقية راقية للمتاجر وبوتيكات الأزياء",
        None,
    ),
}

manifest = {}

for filename, (slug, category, alt, crop) in PHOTOS.items():
    p = SRC_DIR / filename
    if not p.exists():
        print(f"Warning: {filename} not found!")
        continue
    with Image.open(p) as img:
        img = img.convert('RGB')
        if crop:
            img = img.crop(crop)
        
        for max_w, suffix in ((1600, ""), (900, "-sm")):
            copy = img.copy()
            if copy.width > max_w:
                new_h = round(copy.height * max_w / copy.width)
                copy = copy.resize((max_w, new_h), Image.Resampling.LANCZOS)
            out_base = IMAGES_DIR / f"{slug}{suffix}"
            copy.save(out_base.with_suffix(".webp"), "WEBP", quality=85, method=6)
            copy.save(out_base.with_suffix(".jpg"), "JPEG", quality=84, optimize=True, progressive=True)
            
            if not suffix:
                manifest[slug] = {
                    "width": copy.width,
                    "height": copy.height,
                    "category": category,
                    "alt": alt,
                }
                print(f"  Processed {slug}: {copy.width}x{copy.height}")

print("3. Generating Luxury OG Cover Image (1200x630)...")
# Premium deep royal navy canvas (#061638)
og = Image.new('RGB', (1200, 630), (6, 22, 56))
# Create rich gradient background
draw = ImageDraw.Draw(og)
for y in range(630):
    factor = y / 630.0
    # Gradient from #061638 to #0A245C
    r = int(6 + 8 * factor)
    g = int(22 + 18 * factor)
    b = int(56 + 40 * factor)
    draw.line([(0, y), (1200, y)], fill=(r, g, b))

# Add elegant orange/gold glow in top right and center bottom
glow_orange = Image.new('RGBA', (1200, 630), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow_orange)
# Radial gradient simulation
gdraw.ellipse([800, -200, 1400, 400], fill=(255, 102, 0, 38))
gdraw.ellipse([-100, 300, 500, 900], fill=(0, 40, 120, 50))
glow_orange = glow_orange.filter(ImageFilter.GaussianBlur(60))
og.paste(Image.alpha_composite(og.convert('RGBA'), glow_orange).convert('RGB'), (0, 0))

# Paste wide light logo centered
logo_og = wide_light.copy()
og_logo_w = 750
og_logo_h = int(logo_og.height * (og_logo_w / logo_og.width))
logo_og = logo_og.resize((og_logo_w, og_logo_h), Image.Resampling.LANCZOS)
og_x = (1200 - og_logo_w) // 2
og_y = (630 - og_logo_h) // 2 - 40

og_rgba = og.convert('RGBA')
og_rgba.paste(logo_og, (og_x, og_y), logo_og)

# Draw decorative golden line and tagline
draw_final = ImageDraw.Draw(og_rgba)
line_y = og_y + og_logo_h + 30
line_w = 400
line_x = (1200 - line_w) // 2
draw_final.rectangle([(line_x, line_y), (line_x + line_w, line_y + 3)], fill=(255, 102, 0, 255))

og_final = og_rgba.convert('RGB')
og_final.save(IMAGES_DIR / "og-cover.jpg", quality=90, optimize=True)
manifest["og-cover"] = {
    "width": 1200,
    "height": 630,
    "category": "branding",
    "alt": "وكالة منار الخليج للدعاية والإعلان — حلول الطباعة واللوحات والهدايا الإعلانية",
}

# Write manifest.json
with open(IMAGES_DIR / "manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"Manifest written with {len(manifest)} images.")

