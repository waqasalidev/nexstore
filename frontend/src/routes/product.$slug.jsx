import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCw } from "lucide-react";
import { useProduct, useAddToCart, useToggleWishlist } from "@/lib/queries";
import { useAuth } from "@/lib/useAuth";
import { Product3DViewer } from "@/components/Product3DViewer";
import { fmt, finalPrice } from "@/lib/format";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/product/$slug")({ component: Detail });

function Detail() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { user } = useAuth();
  const addToCart = useAddToCart(user?.id);
  const toggleWishlist = useToggleWishlist(user?.id);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [view, setView] = useState("3d");

  if (isLoading) return /*#__PURE__*/_jsx("div", { className: "pt-32 text-center text-muted-foreground", children: "Loading\u2026" });
  if (!product) throw notFound();

  const price = finalPrice(product.price, product.discount_percent);

  return (/*#__PURE__*/
    _jsx("main", { className: "pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6", children: /*#__PURE__*/
      _jsxs("div", { className: "grid lg:grid-cols-2 gap-10", children: [/*#__PURE__*/
        _jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "lg:sticky lg:top-24 self-start", children: [/*#__PURE__*/
          _jsx("div", { className: "aspect-square relative", children:
            view === "3d" ? /*#__PURE__*/
            _jsx(Product3DViewer, { product: product, category: product.categories?.slug, color: product.colors?.[0]?.toLowerCase().includes("gold") ? "#d4af37" : undefined }) :

            product.images?.[0] && /*#__PURE__*/_jsx("img", { src: product.images[0], alt: product.name, className: "w-full h-full object-cover rounded-3xl" }) }

          ), /*#__PURE__*/
          _jsxs("div", { className: "mt-4 flex gap-2", children: [/*#__PURE__*/
            _jsx("button", { onClick: () => setView("3d"), className: `flex-1 px-4 py-2 rounded-full text-sm ${view === "3d" ? "bg-gradient-gold text-primary-foreground" : "glass"}`, children: "3D View" }

            ), /*#__PURE__*/
            _jsx("button", { onClick: () => setView("image"), className: `flex-1 px-4 py-2 rounded-full text-sm ${view === "image" ? "bg-gradient-gold text-primary-foreground" : "glass"}`, children: "Photo" }

            )] }
          ), /*#__PURE__*/
          _jsx("p", { className: "mt-3 text-xs text-center text-muted-foreground", children: "Click & drag to rotate \xB7 scroll to zoom" })] }
        ), /*#__PURE__*/

        _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { children: [/*#__PURE__*/
            _jsxs(Link, { to: `/${product.categories?.slug ?? ""}`, className: "text-xs uppercase tracking-[0.25em] text-gold", children: [product.brands?.name, " \xB7 ", product.categories?.name] }), /*#__PURE__*/
            _jsx("h1", { className: "mt-2 text-4xl md:text-5xl font-bold", children: product.name }), /*#__PURE__*/
            _jsxs("div", { className: "mt-3 flex items-center gap-3", children: [/*#__PURE__*/
              _jsxs("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                _jsx(Star, { className: "w-4 h-4 fill-gold text-gold" }), /*#__PURE__*/
                _jsx("span", { className: "text-sm", children: product.rating.toFixed(1) }), /*#__PURE__*/
                _jsxs("span", { className: "text-sm text-muted-foreground", children: ["(", product.review_count, " reviews)"] })] }
              ), /*#__PURE__*/
              _jsx("span", { className: `text-sm ${product.stock > 0 ? "text-emerald-400" : "text-destructive"}`, children:
                product.stock > 0 ? `${product.stock} in stock` : "Out of stock" }
              )] }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "flex items-baseline gap-3", children: [/*#__PURE__*/
            _jsx("span", { className: "text-4xl font-display font-bold", children: fmt(price) }),
            product.discount_percent > 0 && /*#__PURE__*/
            _jsxs(_Fragment, { children: [/*#__PURE__*/
              _jsx("span", { className: "text-lg text-muted-foreground line-through", children: fmt(product.price) }), /*#__PURE__*/
              _jsxs("span", { className: "px-2 py-0.5 text-xs rounded-full bg-gradient-gold text-primary-foreground font-semibold", children: ["-", product.discount_percent, "%"] })] }
            )] }

          ), /*#__PURE__*/

          _jsx("p", { className: "text-muted-foreground leading-relaxed", children: product.description }),

          product.colors && product.colors.length > 0 && /*#__PURE__*/
          _jsxs("div", { children: [/*#__PURE__*/
            _jsx("p", { className: "text-sm font-semibold mb-2", children: "Color" }), /*#__PURE__*/
            _jsx("div", { className: "flex flex-wrap gap-2", children:
              product.colors.map((c) => /*#__PURE__*/
              _jsx("button", { onClick: () => setColor(c), className: `px-4 py-2 rounded-full text-sm transition ${color === c ? "bg-gradient-gold text-primary-foreground" : "glass hover:bg-white/10"}`, children:
                c }, c
              )
              ) }
            )] }
          ),


          product.sizes && product.sizes.length > 0 && /*#__PURE__*/
          _jsxs("div", { children: [/*#__PURE__*/
            _jsx("p", { className: "text-sm font-semibold mb-2", children: "Size" }), /*#__PURE__*/
            _jsx("div", { className: "flex flex-wrap gap-2", children:
              product.sizes.map((s) => /*#__PURE__*/
              _jsx("button", { onClick: () => setSize(s), className: `min-w-12 px-4 py-2 rounded-full text-sm transition ${size === s ? "bg-gradient-gold text-primary-foreground" : "glass hover:bg-white/10"}`, children:
                s }, s
              )
              ) }
            )] }
          ), /*#__PURE__*/


          user?.role !== "admin" && (
            _jsxs("div", { className: "flex gap-3 pt-2", children: [/*#__PURE__*/
              _jsxs("button", {
                disabled: addToCart.isPending || product.stock === 0,
                onClick: () => addToCart.mutate({ product_id: product.id, size: size ?? undefined, color: color ?? undefined }),
                className: "flex-1 inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-medium shadow-glow disabled:opacity-50", children: [/*#__PURE__*/

                _jsx(ShoppingBag, { className: "w-4 h-4" }), " Add to cart"] }
              ), /*#__PURE__*/
              _jsx("button", { onClick: () => toggleWishlist.mutate(product.id), className: "glass p-3 rounded-full hover:text-gold", children: /*#__PURE__*/
                _jsx(Heart, { className: "w-4 h-4" }) }
              )] }
            )
          ),
 /*#__PURE__*/

          _jsx("div", { className: "grid grid-cols-3 gap-3 pt-6 border-t border-[var(--glass-border)]", children:
            [
            { i: Truck, l: "Free shipping" },
            { i: RotateCw, l: "30-day returns" },
            { i: Shield, l: "Authenticity guaranteed" }].
            map(({ i: I, l }) => /*#__PURE__*/
            _jsxs("div", { className: "text-center", children: [/*#__PURE__*/
              _jsx(I, { className: "w-5 h-5 text-gold mx-auto mb-1" }), /*#__PURE__*/
              _jsx("p", { className: "text-xs text-muted-foreground", children: l })] }, l
            )
            ) }
          )] }
        )] }
      ) }
    ));

}