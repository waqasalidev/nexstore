import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useWishlist } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export const Route = createFileRoute("/wishlist")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.role === "admin") {
      throw redirect({ to: "/admin" });
    }
  },
  component: WishlistPage
});


function WishlistPage() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useWishlist(user?.id);

  if (!user) {
    return (/*#__PURE__*/
      _jsxs("main", { className: "pt-32 pb-16 text-center max-w-md mx-auto px-4", children: [/*#__PURE__*/
        _jsx(Heart, { className: "w-12 h-12 mx-auto text-gold" }), /*#__PURE__*/
        _jsx("h1", { className: "mt-4 text-3xl font-bold", children: "Save your favorites" }), /*#__PURE__*/
        _jsx("p", { className: "mt-2 text-muted-foreground", children: "Sign in to curate a personal wishlist." }), /*#__PURE__*/
        _jsx(Link, { to: "/auth", className: "mt-6 inline-flex bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-medium shadow-glow", children: "Sign in" })] }
      ));

  }

  return (/*#__PURE__*/
    _jsxs("main", { className: "pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6", children: [/*#__PURE__*/
      _jsx("h1", { className: "text-5xl font-bold mb-10", children: "Wishlist" }),
      isLoading ? /*#__PURE__*/
      _jsx("div", { className: "text-muted-foreground", children: "Loading\u2026" }) :
      items.length === 0 ? /*#__PURE__*/
      _jsx("div", { className: "glass rounded-3xl p-12 text-center text-muted-foreground", children: "No saved products yet. Tap the heart on anything you love." }

      ) : /*#__PURE__*/

      _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children:
        items.map((it, i) => /*#__PURE__*/_jsx(ProductCard, { product: { ...it.products, brands: it.products.brands }, index: i }, it.id)) }
      )] }

    ));

}