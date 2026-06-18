import { motion } from "framer-motion";
import { useBrands } from "@/lib/queries";
import { useNavigate } from "@tanstack/react-router";

// SVG configurations for brands using their original brand colors
const BRAND_LOGOS = {
  nike: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <path d="M10 28.5c18.5-3.5 39.5-13.5 56.5-24.5 4.5-2.9 8.5-3.5 8.5.5 0 2.5-4 7-9 11-13 10.5-29.5 20.5-45.5 20.5-4.5 0-10.5-4-10.5-7.5z" />
    </svg>
  ),
  adidas: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <g transform="skewX(-25) translate(40, 0)">
        <rect x="0" y="22" width="6" height="13" />
        <rect x="10" y="12" width="6" height="23" />
        <rect x="20" y="2" width="6" height="33" />
      </g>
    </svg>
  ),
  puma: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <path d="M72 12c-2.3 0-4.6.6-6.6 1.7-1 .6-2.1.8-3.2.4-1.2-.4-2.2-1.3-2.6-2.5-.5-1.4.1-3 1.3-3.8 2-1.3 4.4-2 6.8-2 3.6 0 7 1.5 9.4 4.2.8.9 2.2.9 3 0 1.2-1.2 1.2-3.2 0-4.4C76 1.4 70.3.2 64.3.4c-7.3.3-13.8 4.7-16.8 11.4-1.8 4-4.7 7.3-8.5 9.5-3.4 2-5 5.8-4.2 9.7.8 3.9 4.2 6.7 8.2 6.7 3.3 0 6.4-1.8 8-4.7.7-1.3 1.8-2.3 3.2-2.8 1.4-.5 3-.4 4.3.4 1.8 1.1 4 1.7 6.2 1.7 5.7 0 10.3-4.6 10.3-10.3 0-5.7-4.6-10.3-10.3-10.3z" />
    </svg>
  ),
  zara: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="20" fontWeight="900" fontFamily="serif" letterSpacing="-2">ZARA</text>
    </svg>
  ),
  hm: (
    <svg viewBox="0 0 100 40" fill="#E3000F" className="w-full h-full">
      <text x="50%" y="68%" textAnchor="middle" fontSize="24" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">H&M</text>
    </svg>
  ),
  gucci: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="serif" letterSpacing="5">GUCCI</text>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <g transform="translate(38, 5) scale(1.3)">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.13 1.83-.99 2.94.1.08.19.12.29.12.87 0 1.96-.58 2.53-1.45z" />
      </g>
    </svg>
  ),
  samsung: (
    <svg viewBox="0 0 100 40" fill="#034EA2" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5">SAMSUNG</text>
    </svg>
  ),
  sony: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="18" fontWeight="bold" fontFamily="serif" letterSpacing="3.5">SONY</text>
    </svg>
  ),
  rolex: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <g transform="translate(38, 2) scale(1.1)">
        <path d="M2 17.5h20v1H2z M12 6.5l3 4.5l5.5-5.5l-2.5 8.5H6L3.5 5.5L9 11z" fill="#A37E2C" />
        <circle cx="12" cy="5" r="1" fill="#A37E2C" />
        <circle cx="3.5" cy="4.5" r="1" fill="#A37E2C" />
        <circle cx="20.5" cy="4.5" r="1" fill="#A37E2C" />
        <circle cx="8.5" cy="5.5" r="1" fill="#A37E2C" />
        <circle cx="15.5" cy="5.5" r="1" fill="#A37E2C" />
        <text x="12" y="24" textAnchor="middle" fontSize="5.5" fontWeight="bold" letterSpacing="2.5" fontFamily="serif" fill="#006039">ROLEX</text>
      </g>
    </svg>
  ),
  casio: (
    <svg viewBox="0 0 100 40" fill="#0054A6" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="18" fontWeight="900" fontStyle="italic" fontFamily="sans-serif" letterSpacing="1.5">CASIO</text>
    </svg>
  ),
  levis: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <g transform="translate(25, 4)">
        <path d="M0 5h50v22c-10 0-15 4-25 4s-15-4-25-4z" fill="#c41230" />
        <text x="25" y="21" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="sans-serif" fill="#ffffff">Levi's</text>
      </g>
    </svg>
  ),
  prada: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="17" fontWeight="bold" fontFamily="serif" letterSpacing="5">PRADA</text>
    </svg>
  ),
  rayban: (
    <svg viewBox="0 0 100 40" fill="#E31B23" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="18" fontWeight="900" fontStyle="italic" fontFamily="serif">Ray-Ban</text>
    </svg>
  ),
  seiko: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="17" fontWeight="900" fontFamily="serif" letterSpacing="4.5">SEIKO</text>
    </svg>
  ),
  bose: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="20" fontWeight="900" fontStyle="italic" fontFamily="sans-serif" letterSpacing="-0.5">BOSE</text>
    </svg>
  ),
  vans: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <g transform="translate(20, 2)">
        <path d="M5 10h12v3H8v4h8v3H8v6H5z" fill="#E60012" />
        <text x="40" y="22" fontSize="16" fontWeight="900" fontFamily="sans-serif" fill="#E60012" letterSpacing="1">VANS</text>
        <path d="M5 8h45v2H5z" fill="#E60012" />
      </g>
    </svg>
  ),
  uniqlo: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <rect x="30" y="0" width="40" height="40" fill="#ff0000" />
      <text x="50%" y="58%" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#ffffff">UNI</text>
      <text x="50%" y="85%" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#ffffff">QLO</text>
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <g transform="translate(20, 10)">
        <rect x="0" y="0" width="9" height="9" fill="#F25022" />
        <rect x="11" y="0" width="9" height="9" fill="#7FBA00" />
        <rect x="0" y="11" width="9" height="9" fill="#00A4EF" />
        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
        <text x="42" y="16" fontSize="13" fontWeight="600" fontFamily="sans-serif" fill="#ffffff">Microsoft</text>
      </g>
    </svg>
  ),
  dell: (
    <svg viewBox="0 0 100 40" className="w-full h-full" fill="#0076C0">
      <circle cx="50" cy="20" r="18" fill="none" stroke="#0076C0" strokeWidth="2" />
      <text x="50%" y="62%" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="sans-serif">DELL</text>
    </svg>
  ),
  hp: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <circle cx="50" cy="20" r="18" fill="#0096D6" />
      <text x="50%" y="66%" textAnchor="middle" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily="serif" fill="#ffffff">hp</text>
    </svg>
  ),
  omega: (
    <svg viewBox="0 0 100 40" className="w-full h-full" fill="#C31432">
      <path d="M50 8c-6.6 0-12 5.4-12 12 0 4.2 2.2 7.8 5.5 10H36v3h9v-3h-1.5c-3 0-5.5-2.5-5.5-5.5 0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5c0 3-2.5 5.5-5.5 5.5H49v3h9v-3H50.5c3.3-2.2 5.5-5.8 5.5-10 0-6.6-5.4-12-12-12z" />
    </svg>
  ),
  tissot: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <rect x="18" y="10" width="20" height="20" fill="#FF0000" />
      <path d="M28 14v12M22 20h12" stroke="#ffffff" strokeWidth="3" />
      <text x="65" y="25" fontSize="12" fontWeight="bold" fontFamily="sans-serif" fill="#ffffff">TISSOT</text>
    </svg>
  ),
  "new-balance": (
    <svg viewBox="0 0 100 40" className="w-full h-full" fill="#D31245">
      <text x="50%" y="65%" textAnchor="middle" fontSize="24" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">NB</text>
    </svg>
  ),
  "under-armour": (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <path d="M50 5c-4.5 0-8.2 3.2-9 7.5h18c-.8-4.3-4.5-7.5-9-7.5zm-9 12.5c.8 4.3 4.5 7.5 9 7.5s8.2-3.2 9-7.5H41z" />
    </svg>
  ),
  decathlon: (
    <svg viewBox="0 0 100 40" fill="#0082C3" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="14" fontWeight="900" fontFamily="sans-serif">DECATHLON</text>
    </svg>
  ),
  "tommy-hilfiger": (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <rect x="30" y="10" width="40" height="20" fill="#002A54" />
      <rect x="35" y="12" width="15" height="16" fill="#ffffff" />
      <rect x="50" y="12" width="15" height="16" fill="#cc1431" />
    </svg>
  ),
  "calvin-klein": (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="16" fontWeight="300" fontFamily="sans-serif" letterSpacing="4">CK</text>
    </svg>
  ),
  lacoste: (
    <svg viewBox="0 0 100 40" fill="#17513B" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="sans-serif" letterSpacing="2">LACOSTE</text>
    </svg>
  ),
  "ralph-lauren": (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="serif" letterSpacing="1.5">Ralph Lauren</text>
    </svg>
  ),
  reebok: (
    <svg viewBox="0 0 100 40" fill="#E11B22" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5">Reebok</text>
    </svg>
  ),
  converse: (
    <svg viewBox="0 0 100 40" className="w-full h-full" fill="#ffffff">
      <circle cx="35" cy="20" r="12" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M35 12l2.5 5.5h5.5l-4.5 3.5 1.5 5.5-5-3.5-5 3.5 1.5-5.5-4.5-3.5h5.5z" />
      <text x="70" y="24" fontSize="10" fontWeight="bold" fontFamily="sans-serif">CONVERSE</text>
    </svg>
  ),
  skechers: (
    <svg viewBox="0 0 100 40" fill="#002d62" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="16" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">SKECHERS</text>
    </svg>
  ),
  asics: (
    <svg viewBox="0 0 100 40" fill="#002B49" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="18" fontWeight="bold" fontStyle="italic" fontFamily="sans-serif">asics</text>
    </svg>
  ),
  citizen: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="16" fontWeight="normal" fontFamily="sans-serif" letterSpacing="3">CITIZEN</text>
    </svg>
  ),
  lg: (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <circle cx="35" cy="20" r="14" fill="#C41724" />
      <path d="M30 14v10h10M35 24a4 4 0 0 0 4-4" fill="none" stroke="#ffffff" strokeWidth="2" />
      <text x="70" y="25" fontSize="15" fontWeight="bold" fontFamily="sans-serif" fill="#ffffff">LG</text>
    </svg>
  ),
  fossil: (
    <svg viewBox="0 0 100 40" fill="#ffffff" className="w-full h-full">
      <text x="50%" y="65%" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="serif" letterSpacing="4">FOSSIL</text>
    </svg>
  )
};

export function BrandCarousel() {
  const { data: brands = [] } = useBrands();
  const navigate = useNavigate();

  // Deduplicate brands using a Map to ensure absolute uniqueness by name
  const uniqueBrands = [...new Map(brands.map((item) => [item.name.toLowerCase().trim(), item])).values()];

  if (uniqueBrands.length === 0) return null;

  // Render function for single brand item
  const renderBrandItem = (b, i) => {
    const brandNameKey = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const brandSlug = b.slug.toLowerCase();
    const logoSvg = BRAND_LOGOS[brandSlug] || 
                    BRAND_LOGOS[brandSlug.split("-")[0]] || 
                    BRAND_LOGOS[brandNameKey] || 
                    BRAND_LOGOS[brandNameKey.split("-")[0]];

    return (
      <motion.div
        key={`${b.id}-${i}`}
        initial={{ 
          scale: 1, 
          filter: "grayscale(100%)", 
          opacity: 0.7 
        }}
        whileHover={{ 
          scale: 1.1,
          filter: "grayscale(0%)",
          opacity: 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => navigate({ to: "/search", search: { brand: b.slug } })}
        className="w-28 h-12 flex items-center justify-center cursor-pointer shrink-0 select-none"
        title={`View ${b.name} products`}
      >
        {logoSvg || (
          <span className="font-display text-lg font-bold tracking-tight text-white/90">{b.name}</span>
        )}
      </motion.div>
    );
  };

  return (
    <section className="group py-16 border-y border-[var(--glass-border)] overflow-hidden bg-black/10">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Trusted by the world's leading houses</p>
      </div>
      <div className="relative w-full overflow-hidden">
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Infinite CSS Marquee container with no gap mismatch and luxury slow speed (100s duration) */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]" style={{ animationDuration: "100s" }}>
          {/* First set of brands */}
          <div className="flex gap-16 pr-16 shrink-0">
            {uniqueBrands.map((b, i) => renderBrandItem(b, `first-${i}`))}
          </div>
          {/* Second identical set of brands for seamless looping */}
          <div className="flex gap-16 pr-16 shrink-0" aria-hidden="true">
            {uniqueBrands.map((b, i) => renderBrandItem(b, `second-${i}`))}
          </div>
        </div>
      </div>
    </section>
  );
}