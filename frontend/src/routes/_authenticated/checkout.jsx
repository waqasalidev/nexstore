import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useCart } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { fmt, finalPrice } from "@/lib/format";
import { toast } from "sonner";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export const Route = createFileRoute("/_authenticated/checkout")({ component: Checkout });

function Checkout() {
  const { user } = useAuth();
  const { data: items = [] } = useCart(user?.id);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ name: "", line1: "", city: "", country: "", zip: "" });

  const subtotal = items.reduce((s, it) => s + finalPrice(it.products.price, it.products.discount_percent) * it.quantity, 0);

  async function place(e) {
    e.preventDefault();
    if (!user || items.length === 0) return;
    setPlacing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          total: subtotal,
          shipping_address: form,
          items: items.map((it) => ({
            product_id: it.product_id,
            name: it.products.name,
            quantity: it.quantity,
            price: finalPrice(it.products.price, it.products.discount_percent),
            size: it.selected_size,
            color: it.selected_color
          }))
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to place order");
      }
      toast.success("Order placed!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (/*#__PURE__*/
    _jsxs("main", { className: "pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6", children: [/*#__PURE__*/
      _jsx("h1", { className: "text-5xl font-bold mb-10", children: "Checkout" }), /*#__PURE__*/
      _jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-8", children: [/*#__PURE__*/
        _jsxs(motion.form, { onSubmit: place, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("section", { className: "glass rounded-3xl p-6", children: [/*#__PURE__*/
            _jsx("h2", { className: "text-xl font-semibold mb-4", children: "Shipping address" }), /*#__PURE__*/
            _jsx("div", { className: "grid sm:grid-cols-2 gap-3", children:
              ["name", "line1", "city", "country", "zip"].map((k) => /*#__PURE__*/
              _jsx("input", {

                required: true,
                placeholder: k === "line1" ? "Address" : k[0].toUpperCase() + k.slice(1),
                value: form[k],
                onChange: (e) => setForm({ ...form, [k]: e.target.value }),
                className: `glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold ${k === "line1" ? "sm:col-span-2" : ""}` }, k
              )
              ) }
            )] }
          ), /*#__PURE__*/
          _jsxs("section", { className: "glass rounded-3xl p-6", children: [/*#__PURE__*/
            _jsxs("h2", { className: "text-xl font-semibold mb-4 flex items-center gap-2", children: [/*#__PURE__*/_jsx(CreditCard, { className: "w-5 h-5 text-gold" }), " Payment"] }), /*#__PURE__*/
            _jsx("p", { className: "text-sm text-muted-foreground", children: "Payments will be powered by Stripe once enabled. For now, this is a demo checkout that records your order." })] }
          ), /*#__PURE__*/
          _jsxs("button", { disabled: placing || items.length === 0, className: "w-full bg-gradient-gold text-primary-foreground py-4 rounded-full font-semibold shadow-glow disabled:opacity-50 inline-flex items-center justify-center gap-2", children: [/*#__PURE__*/
            _jsx(CheckCircle2, { className: "w-5 h-5" }), " ", placing ? "Placing order…" : `Place order · ${fmt(subtotal)}`] }
          )] }
        ), /*#__PURE__*/
        _jsxs("aside", { className: "glass rounded-3xl p-6 h-fit", children: [/*#__PURE__*/
          _jsx("h2", { className: "text-xl font-semibold", children: "Summary" }), /*#__PURE__*/
          _jsx("ul", { className: "mt-4 space-y-3 text-sm", children:
            items.map((it) => /*#__PURE__*/
            _jsxs("li", { className: "flex justify-between", children: [/*#__PURE__*/
              _jsxs("span", { className: "text-muted-foreground truncate pr-2", children: [it.products.name, " \xD7 ", it.quantity] }), /*#__PURE__*/
              _jsx("span", { children: fmt(finalPrice(it.products.price, it.products.discount_percent) * it.quantity) })] }, it.id
            )
            ) }
          ), /*#__PURE__*/
          _jsxs("div", { className: "mt-4 pt-4 border-t border-[var(--glass-border)] flex justify-between font-display font-bold text-lg", children: [/*#__PURE__*/
            _jsx("span", { children: "Total" }), /*#__PURE__*/_jsx("span", { children: fmt(subtotal) })] }
          ), /*#__PURE__*/
          _jsx(Link, { to: "/cart", className: "block mt-4 text-center text-sm text-muted-foreground hover:text-foreground", children: "Edit cart" })] }
        )] }
      )] }
    ));

}