import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useCart, useRemoveFromCart, useUpdateCartQty } from "@/lib/queries";
import { fmt, finalPrice } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export const Route = createFileRoute("/cart")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.role === "admin") {
      throw redirect({ to: "/admin" });
    }
  },
  component: CartPage
});


function CartPage() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useCart(user?.id);
  const remove = useRemoveFromCart();
  const update = useUpdateCartQty();

  const subtotal = items.reduce((sum, it) => {
    const p = it.products;
    return sum + finalPrice(p.price, p.discount_percent) * it.quantity;
  }, 0);

  if (!user) {
    return (/*#__PURE__*/
      _jsxs("main", { className: "pt-32 pb-16 text-center max-w-md mx-auto px-4", children: [/*#__PURE__*/
        _jsx(ShoppingBag, { className: "w-12 h-12 mx-auto text-gold" }), /*#__PURE__*/
        _jsx("h1", { className: "mt-4 text-3xl font-bold", children: "Sign in to view your cart" }), /*#__PURE__*/
        _jsx("p", { className: "mt-2 text-muted-foreground", children: "Save items, sync across devices, and check out faster." }), /*#__PURE__*/
        _jsx(Link, { to: "/auth", className: "mt-6 inline-flex bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-medium shadow-glow", children: "Sign in" })] }
      ));

  }

  return (/*#__PURE__*/
    _jsxs("main", { className: "pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6", children: [/*#__PURE__*/
      _jsx("h1", { className: "text-5xl font-bold mb-10", children: "Your cart" }),
      isLoading ? /*#__PURE__*/
      _jsx("div", { className: "text-muted-foreground", children: "Loading\u2026" }) :
      items.length === 0 ? /*#__PURE__*/
      _jsxs("div", { className: "glass rounded-3xl p-12 text-center", children: [/*#__PURE__*/
        _jsx("p", { className: "text-muted-foreground", children: "Your cart is empty." }), /*#__PURE__*/
        _jsx(Link, { to: "/", className: "mt-4 inline-flex bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-medium", children: "Continue shopping" })] }
      ) : /*#__PURE__*/

      _jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-8", children: [/*#__PURE__*/
        _jsx("div", { className: "space-y-4", children:
          items.map((it, i) => {
            const p = it.products;
            const price = finalPrice(p.price, p.discount_percent);
            return (/*#__PURE__*/
              _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 }, className: "glass rounded-2xl p-4 flex gap-4", children: [/*#__PURE__*/
                _jsx("img", { src: p.images?.[0], alt: p.name, className: "w-24 h-24 object-cover rounded-xl shrink-0" }), /*#__PURE__*/
                _jsxs("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                  _jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: p.brands?.name }), /*#__PURE__*/
                  _jsx(Link, { to: "/product/$slug", params: { slug: p.slug }, className: "font-medium hover:text-gold", children: p.name }),
                  (it.selected_size || it.selected_color) && /*#__PURE__*/
                  _jsx("p", { className: "text-xs text-muted-foreground mt-1", children:
                    [it.selected_color, it.selected_size].filter(Boolean).join(" · ") }
                  ), /*#__PURE__*/

                  _jsxs("div", { className: "mt-2 flex items-center gap-3", children: [/*#__PURE__*/
                    _jsxs("div", { className: "flex items-center glass rounded-full", children: [/*#__PURE__*/
                      _jsx("button", { onClick: () => update.mutate({ id: it.id, quantity: Math.max(1, it.quantity - 1) }), className: "p-1.5", children: /*#__PURE__*/_jsx(Minus, { className: "w-3 h-3" }) }), /*#__PURE__*/
                      _jsx("span", { className: "px-2 text-sm", children: it.quantity }), /*#__PURE__*/
                      _jsx("button", { onClick: () => update.mutate({ id: it.id, quantity: it.quantity + 1 }), className: "p-1.5", children: /*#__PURE__*/_jsx(Plus, { className: "w-3 h-3" }) })] }
                    ), /*#__PURE__*/
                    _jsxs("button", { onClick: () => remove.mutate(it.id), className: "text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1", children: [/*#__PURE__*/
                      _jsx(Trash2, { className: "w-3 h-3" }), " Remove"] }
                    )] }
                  )] }
                ), /*#__PURE__*/
                _jsx("div", { className: "text-right font-display font-semibold", children: fmt(price * it.quantity) })] }, it.id
              ));

          }) }
        ), /*#__PURE__*/
        _jsxs("aside", { className: "glass rounded-3xl p-6 h-fit lg:sticky lg:top-24", children: [/*#__PURE__*/
          _jsx("h2", { className: "text-xl font-semibold", children: "Order summary" }), /*#__PURE__*/
          _jsxs("dl", { className: "mt-6 space-y-3 text-sm", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex justify-between", children: [/*#__PURE__*/_jsx("dt", { className: "text-muted-foreground", children: "Subtotal" }), /*#__PURE__*/_jsx("dd", { children: fmt(subtotal) })] }), /*#__PURE__*/
            _jsxs("div", { className: "flex justify-between", children: [/*#__PURE__*/_jsx("dt", { className: "text-muted-foreground", children: "Shipping" }), /*#__PURE__*/_jsx("dd", { children: "Free" })] }), /*#__PURE__*/
            _jsxs("div", { className: "flex justify-between text-lg pt-3 border-t border-[var(--glass-border)]", children: [/*#__PURE__*/_jsx("dt", { className: "font-semibold", children: "Total" }), /*#__PURE__*/_jsx("dd", { className: "font-display font-bold", children: fmt(subtotal) })] })] }
          ), /*#__PURE__*/
          _jsx(Link, { to: "/checkout", className: "mt-6 w-full inline-flex items-center justify-center bg-gradient-gold text-primary-foreground py-3 rounded-full font-medium shadow-glow", children: "Checkout" }

          )] }
        )] }
      )] }

    ));

}