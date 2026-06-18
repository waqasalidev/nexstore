import { Link } from "@tanstack/react-router";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function Footer() {
  return (/*#__PURE__*/
    _jsxs("footer", { className: "mt-32 border-t border-[var(--glass-border)]", children: [/*#__PURE__*/
      _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4", children: [/*#__PURE__*/
        _jsxs("div", { children: [/*#__PURE__*/
          _jsxs("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center font-bold text-primary-foreground", children: "N" }), /*#__PURE__*/
            _jsxs("span", { className: "font-display font-bold text-lg", children: ["Nex", /*#__PURE__*/_jsx("span", { className: "text-gradient-gold", children: "Store" })] })] }
          ), /*#__PURE__*/
          _jsx("p", { className: "mt-4 text-sm text-muted-foreground max-w-xs", children: "The future of shopping. Inspect products in immersive 3D before you buy." }

          )] }
        ), /*#__PURE__*/
        _jsx(FooterCol, { title: "Shop", links: [["Clothing", "/clothing"], ["Shoes", "/shoes"], ["Watches", "/watches"], ["Electronics", "/electronics"]] }), /*#__PURE__*/
        _jsx(FooterCol, { title: "Explore", links: [["Accessories", "/accessories"], ["Sports", "/sports"], ["Luxury", "/luxury"], ["Beauty", "/beauty"], ["Contact Us", "/contact"]] }), /*#__PURE__*/
        _jsx(FooterCol, { title: "Account", links: [["Sign in", "/auth"], ["Cart", "/cart"], ["Wishlist", "/wishlist"], ["Dashboard", "/dashboard"]] })] }
      ), /*#__PURE__*/
      _jsx("div", { className: "border-t border-[var(--glass-border)]", children: /*#__PURE__*/
        _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-6 text-xs text-muted-foreground flex justify-between", children: [/*#__PURE__*/
          _jsxs("span", { children: ["\xA9 ", new Date().getFullYear(), " NexStore. All rights reserved."] }), /*#__PURE__*/
          _jsx("span", { children: "Shop the future." })] }
        ) }
      )] }
    ));

}

function FooterCol({ title, links }) {
  return (/*#__PURE__*/
    _jsxs("div", { children: [/*#__PURE__*/
      _jsx("h4", { className: "text-sm font-semibold mb-4 text-gold", children: title }), /*#__PURE__*/
      _jsx("ul", { className: "space-y-2", children:
        links.map(([label, to]) => /*#__PURE__*/
        _jsx("li", { children: /*#__PURE__*/
          _jsx(Link, { to: to, className: "text-sm text-muted-foreground hover:text-foreground", children: label }) }, to
        )
        ) }
      )] }
    ));

}