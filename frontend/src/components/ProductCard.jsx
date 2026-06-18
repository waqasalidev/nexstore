import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { fmt, finalPrice } from "@/lib/format";

import { useAuth } from "@/lib/useAuth";
import { useToggleWishlist } from "@/lib/queries";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function ProductCard({ product, index = 0 }) {
  const { user } = useAuth();
  const toggle = useToggleWishlist(user?.id);
  const price = finalPrice(product.price, product.discount_percent);

  return (/*#__PURE__*/
    _jsx(motion.div, {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: index * 0.05, duration: 0.5 },
      whileHover: { y: -6 },
      className: "group relative", children: /*#__PURE__*/

      _jsxs(Link, { to: "/product/$slug", params: { slug: product.slug }, children: [/*#__PURE__*/
        _jsxs("div", { className: "relative aspect-[4/5] overflow-hidden rounded-2xl glass shadow-card", children: [
          product.images?.[0] ? /*#__PURE__*/
          _jsx("img", {
            src: product.images[0],
            alt: product.name,
            loading: "lazy",
            className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }
          ) : /*#__PURE__*/

          _jsx("div", { className: "w-full h-full bg-gradient-to-br from-muted to-secondary" }), /*#__PURE__*/

          _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
          product.discount_percent > 0 && /*#__PURE__*/
          _jsxs("span", { className: "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-gold text-primary-foreground", children: ["-",
            product.discount_percent, "%"] }
          ), /*#__PURE__*/

          user?.role !== "admin" && _jsx("button", {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              toggle.mutate(product.id);
            },
            className: "absolute top-3 right-3 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity hover:text-gold",
            "aria-label": "Save", children: /*#__PURE__*/

            _jsx(Heart, { className: "w-4 h-4" }) }
          )
        ] }
      ), /*#__PURE__*/
        _jsxs("div", { className: "mt-4 flex justify-between gap-3", children: [/*#__PURE__*/
          _jsxs("div", { className: "min-w-0", children: [/*#__PURE__*/
            _jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: product.brands?.name }), /*#__PURE__*/
            _jsx("h3", { className: "mt-0.5 font-medium truncate", children: product.name }), /*#__PURE__*/
            _jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground", children: [/*#__PURE__*/
              _jsx(Star, { className: "w-3 h-3 fill-gold text-gold" }),
              product.rating.toFixed(1), " ", /*#__PURE__*/_jsx("span", { children: "\xB7" }), " ", product.review_count] }
            )] }
          ), /*#__PURE__*/
          _jsxs("div", { className: "text-right shrink-0", children: [/*#__PURE__*/
            _jsx("div", { className: "font-display font-semibold", children: fmt(price) }),
            product.discount_percent > 0 && /*#__PURE__*/
            _jsx("div", { className: "text-xs text-muted-foreground line-through", children: fmt(product.price) })] }

          )] }
        )] }
      ) }
    ));

}