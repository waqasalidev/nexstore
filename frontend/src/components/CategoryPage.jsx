import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useProducts, useBrands } from "@/lib/queries";
import { ProductCard } from "./ProductCard";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const SORTS = [
{ id: "featured", label: "Featured" },
{ id: "price-asc", label: "Price: Low to High" },
{ id: "price-desc", label: "Price: High to Low" },
{ id: "rating", label: "Top Rated" }];


export function CategoryPage({ slug, title, subtitle }) {
  const { data: products = [], isLoading } = useProducts({ categorySlug: slug });
  const { data: brands = [] } = useBrands(slug);
  const [brandFilter, setBrandFilter] = useState(null);
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(50000);

  const filtered = useMemo(() => {
    let arr = [...products];
    if (brandFilter) {
      arr = arr.filter((p) => {
        const productBrandId = typeof p.brand_id === "object" ? (p.brand_id?._id || p.brand_id?.id) : p.brand_id;
        return productBrandId === brandFilter;
      });
    }
    arr = arr.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "price-asc":arr.sort((a, b) => a.price - b.price);break;
      case "price-desc":arr.sort((a, b) => b.price - a.price);break;
      case "rating":arr.sort((a, b) => b.rating - a.rating);break;
      default:arr.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return arr;
  }, [products, brandFilter, sort, maxPrice]);

  return (/*#__PURE__*/
    _jsxs("main", { className: "pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6", children: [/*#__PURE__*/
      _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mb-10", children: [/*#__PURE__*/
        _jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold", children: "Collection" }), /*#__PURE__*/
        _jsx("h1", { className: "mt-2 text-5xl md:text-6xl font-bold", children: title }), /*#__PURE__*/
        _jsx("p", { className: "mt-3 text-muted-foreground max-w-xl", children: subtitle })] }
      ), /*#__PURE__*/

      _jsxs("div", { className: "grid lg:grid-cols-[240px_1fr] gap-8", children: [/*#__PURE__*/
        _jsxs("aside", { className: "space-y-6 lg:sticky lg:top-24 self-start", children: [/*#__PURE__*/
          _jsxs("div", { className: "glass rounded-2xl p-5", children: [/*#__PURE__*/
            _jsx("h3", { className: "text-sm font-semibold mb-3", children: "Brand" }), /*#__PURE__*/
            _jsxs("div", { className: "space-y-1", children: [/*#__PURE__*/
              _jsx("button", { onClick: () => setBrandFilter(null), className: `block w-full text-left px-2 py-1 rounded text-sm ${!brandFilter ? "text-gold" : "text-muted-foreground hover:text-foreground"}`, children: "All brands" }),
              brands.map((b) => /*#__PURE__*/
              _jsx("button", { onClick: () => setBrandFilter(b.id), className: `block w-full text-left px-2 py-1 rounded text-sm ${brandFilter === b.id ? "text-gold" : "text-muted-foreground hover:text-foreground"}`, children:
                b.name }, b.id
              )
              )] }
            )] }
          ), /*#__PURE__*/
          _jsxs("div", { className: "glass rounded-2xl p-5", children: [/*#__PURE__*/
            _jsx("h3", { className: "text-sm font-semibold mb-3", children: "Max price" }), /*#__PURE__*/
            _jsx("input", { type: "range", min: 50, max: 50000, step: 50, value: maxPrice, onChange: (e) => setMaxPrice(Number(e.target.value)), className: "w-full accent-[var(--gold)]" }), /*#__PURE__*/
            _jsxs("div", { className: "mt-2 text-sm text-muted-foreground", children: ["Up to $", maxPrice.toLocaleString()] })] }
          )] }
        ), /*#__PURE__*/

        _jsxs("div", { children: [/*#__PURE__*/
          _jsxs("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
            _jsxs("p", { className: "text-sm text-muted-foreground", children: [filtered.length, " products"] }), /*#__PURE__*/
            _jsx("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "glass rounded-full px-4 py-2 text-sm border-none outline-none", children:
              SORTS.map((s) => /*#__PURE__*/_jsx("option", { value: s.id, className: "bg-card", children: s.label }, s.id)) }
            )] }
          ),

          isLoading ? /*#__PURE__*/
          _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children:
            Array.from({ length: 6 }).map((_, i) => /*#__PURE__*/
            _jsx("div", { className: "aspect-[4/5] glass rounded-2xl animate-pulse" }, i)
            ) }
          ) :
          filtered.length === 0 ? /*#__PURE__*/
          _jsx("div", { className: "text-center py-20 text-muted-foreground", children: "No products match these filters." }) : /*#__PURE__*/

          _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children:
            filtered.map((p, i) => /*#__PURE__*/_jsx(ProductCard, { product: p, index: i }, p.id)) }
          )] }

        )] }
      )] }
    ));

}