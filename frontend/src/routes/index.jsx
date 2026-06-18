import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Box, Zap } from "lucide-react";
import { HeroScene } from "@/components/HeroScene";
import { BrandCarousel } from "@/components/BrandCarousel";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/queries";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
    { title: "NexStore — Shop The Future" },
    { name: "description", content: "Experience products in immersive 3D before you buy." }]

  }),
  component: Index
});

const categories = [
{ slug: "/shoes", name: "Shoes", tag: "Iconic silhouettes" },
{ slug: "/watches", name: "Watches", tag: "Time, reimagined" },
{ slug: "/electronics", name: "Electronics", tag: "Next-gen tech" },
{ slug: "/clothing", name: "Clothing", tag: "Premium apparel" },
{ slug: "/accessories", name: "Accessories", tag: "Defining details" },
{ slug: "/luxury", name: "Luxury", tag: "Curated edit" }];


const categoryImages = {
  "/shoes": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
  "/watches": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80",
  "/electronics": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
  "/clothing": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
  "/accessories": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
  "/luxury": "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80"
};

function Index() {
  const { data: featured = [] } = useProducts({ featured: true });

  return (/*#__PURE__*/
    _jsxs("main", { children: [/*#__PURE__*/

      _jsxs("section", { className: "relative min-h-screen bg-hero overflow-hidden", children: [/*#__PURE__*/
        _jsx("div", { className: "absolute inset-0", children: /*#__PURE__*/
          _jsx(HeroScene, {}) }
        ), /*#__PURE__*/
        _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" }), /*#__PURE__*/

        _jsx("div", { className: "relative z-10 pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center pointer-events-none", children: /*#__PURE__*/
          _jsxs(motion.div, {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            className: "max-w-2xl pointer-events-auto", children: [/*#__PURE__*/

            _jsxs("div", { className: "inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.25em] text-gold", children: [/*#__PURE__*/
              _jsx(Sparkles, { className: "w-3 h-3" }), " Next-gen commerce"] }
            ), /*#__PURE__*/
            _jsxs("h1", { className: "mt-6 text-6xl md:text-8xl font-bold leading-[0.95]", children: ["Shop The", /*#__PURE__*/

              _jsx("br", {}), /*#__PURE__*/
              _jsx("span", { className: "text-gradient-gold", children: "Future" })] }
            ), /*#__PURE__*/
            _jsx("p", { className: "mt-6 text-lg md:text-xl text-muted-foreground max-w-xl", children: "Experience products in immersive 3D before you buy. Rotate, zoom, inspect \u2014 then own." }

            ), /*#__PURE__*/
            _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [/*#__PURE__*/
              _jsxs(Link, { to: "/shoes", className: "group inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-medium shadow-glow hover:opacity-90", children: ["Explore collection ", /*#__PURE__*/
                _jsx(ArrowRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1" })] }
              ), /*#__PURE__*/
              _jsx(Link, { to: "/luxury", className: "glass px-6 py-3 rounded-full font-medium hover:bg-white/10", children: "Discover luxury" }

              )] }
            ), /*#__PURE__*/
            _jsx("div", { className: "mt-12 grid grid-cols-3 gap-6 max-w-md", children:
              [
              { i: Box, l: "3D viewer", v: "Every product" },
              { i: Zap, l: "Instant", v: "Checkout" },
              { i: Sparkles, l: "Curated", v: "12 brands" }].
              map(({ i: Icon, l, v }) => /*#__PURE__*/
              _jsxs("div", { children: [/*#__PURE__*/
                _jsx(Icon, { className: "w-5 h-5 text-gold mb-1" }), /*#__PURE__*/
                _jsx("div", { className: "text-sm font-semibold", children: v }), /*#__PURE__*/
                _jsx("div", { className: "text-xs text-muted-foreground", children: l })] }, l
              )
              ) }
            )] }
          ) }
        )] }
      ), /*#__PURE__*/


      _jsx(BrandCarousel, {}), /*#__PURE__*/


      _jsxs("section", { className: "py-24 px-4 sm:px-6 max-w-7xl mx-auto", children: [/*#__PURE__*/
        _jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "mb-12 flex items-end justify-between flex-wrap gap-4", children: /*#__PURE__*/
          _jsxs("div", { children: [/*#__PURE__*/
            _jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold", children: "Shop by category" }), /*#__PURE__*/
            _jsx("h2", { className: "mt-2 text-4xl md:text-5xl font-bold", children: "Worlds to explore" })] }
          ) }
        ), /*#__PURE__*/
        _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children:
          categories.map((c, i) => /*#__PURE__*/
          _jsx(motion.div, {

            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.08 },
            whileHover: { y: -8, transition: { duration: 0.2 } },
            children: /*#__PURE__*/

            _jsxs(Link, { to: c.slug, className: "block group relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden glass shadow-lg", children: [/*#__PURE__*/
              _jsx("img", { src: categoryImages[c.slug], alt: c.name, className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }), /*#__PURE__*/
              _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-95 transition-opacity duration-300" }), /*#__PURE__*/
              _jsxs("div", { className: "absolute inset-0 p-6 flex flex-col justify-between z-10", children: [/*#__PURE__*/
                _jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-gold font-semibold", children: c.tag }), /*#__PURE__*/
                _jsxs("div", { children: [/*#__PURE__*/
                  _jsx("h3", { className: "text-3xl md:text-4xl font-bold text-white tracking-tight group-hover:text-gold transition-colors", children: c.name }), /*#__PURE__*/
                  _jsxs("div", { className: "mt-3 inline-flex items-center gap-1 text-sm text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0", children: ["Shop now ", /*#__PURE__*/
                    _jsx(ArrowRight, { className: "w-4 h-4" })] }
                  )] }
                )] }
              )] }
            ) }, c.slug
          )
          ) }
        )] }
      ), /*#__PURE__*/


      _jsxs("section", { className: "py-24 px-4 sm:px-6 max-w-7xl mx-auto", children: [/*#__PURE__*/
        _jsx("div", { className: "mb-12 flex items-end justify-between", children: /*#__PURE__*/
          _jsxs("div", { children: [/*#__PURE__*/
            _jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold", children: "Editor's pick" }), /*#__PURE__*/
            _jsx("h2", { className: "mt-2 text-4xl md:text-5xl font-bold", children: "Featured drops" })] }
          ) }
        ), /*#__PURE__*/
        _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children:
          featured.slice(0, 8).map((p, i) => /*#__PURE__*/_jsx(ProductCard, { product: p, index: i }, p.id)) }
        )] }
      ), /*#__PURE__*/


      _jsx("section", { className: "py-24 px-4 sm:px-6 max-w-7xl mx-auto", children: /*#__PURE__*/
        _jsxs("div", { className: "relative overflow-hidden rounded-[2rem] glass p-12 md:p-20 text-center", children: [/*#__PURE__*/
          _jsx("div", { className: "absolute inset-0 bg-gradient-accent opacity-20" }), /*#__PURE__*/
          _jsxs("div", { className: "relative", children: [/*#__PURE__*/
            _jsx("h2", { className: "text-4xl md:text-6xl font-bold", children: "Inspect before you invest." }), /*#__PURE__*/
            _jsx("p", { className: "mt-4 text-muted-foreground max-w-xl mx-auto", children: "Every product comes alive in 3D. Rotate it, zoom in, and feel the materials before checkout." }), /*#__PURE__*/
            _jsxs(Link, { to: "/electronics", className: "mt-8 inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-medium shadow-glow", children: ["Try the 3D viewer ", /*#__PURE__*/
              _jsx(ArrowRight, { className: "w-4 h-4" })] }
            )] }
          )] }
        ) }
      )] }
    ));

}