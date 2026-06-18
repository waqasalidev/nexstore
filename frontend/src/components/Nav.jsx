import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Heart, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const links = [
{ to: "/clothing", label: "Clothing" },
{ to: "/shoes", label: "Shoes" },
{ to: "/watches", label: "Watches" },
{ to: "/electronics", label: "Electronics" },
{ to: "/accessories", label: "Accessories" },
{ to: "/sports", label: "Sports" },
{ to: "/luxury", label: "Luxury" }];


export function Nav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (/*#__PURE__*/
    _jsx("header", { className: "fixed top-0 inset-x-0 z-50", children: /*#__PURE__*/
      _jsxs("div", { className: "glass border-b border-[var(--glass-border)]", children: [/*#__PURE__*/
        _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4", children: [/*#__PURE__*/
          _jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [/*#__PURE__*/
            _jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-gold shadow-glow flex items-center justify-center font-bold text-primary-foreground", children: "N" }), /*#__PURE__*/
            _jsxs("span", { className: "font-display font-bold text-lg tracking-tight", children: ["Nex", /*#__PURE__*/
              _jsx("span", { className: "text-gradient-gold", children: "Store" })] }
            )] }
          ), /*#__PURE__*/

          _jsx("nav", { className: "hidden lg:flex items-center gap-1", children:
            links.map((l) => /*#__PURE__*/
            _jsx(Link, {

              to: l.to,
              className: `px-3 py-1.5 text-sm rounded-full transition-colors ${
              path === l.to ? "text-gold bg-white/5" : "text-muted-foreground hover:text-foreground"}`, children:


              l.label }, l.to
            )
            ) }
          ), /*#__PURE__*/

          _jsxs("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
            _jsx(Link, { to: "/search", className: "p-2 rounded-full hover:bg-white/5 hidden sm:block", children: /*#__PURE__*/
              _jsx(Search, { className: "w-4 h-4" }) }
            ), /*#__PURE__*/
            user?.role !== "admin" && _jsx(Link, { to: "/wishlist", className: "p-2 rounded-full hover:bg-white/5", children: /*#__PURE__*/
              _jsx(Heart, { className: "w-4 h-4" }) }
            ), /*#__PURE__*/
            user?.role !== "admin" && _jsx(Link, { to: "/cart", className: "p-2 rounded-full hover:bg-white/5", children: /*#__PURE__*/
              _jsx(ShoppingBag, { className: "w-4 h-4" }) }
            ),
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-white/5 outline-none cursor-pointer">
                  <User className="w-4.5 h-4.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border border-white/10 w-48 mt-2 p-1 rounded-xl shadow-lg">
                  <div className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground truncate border-b border-white/5 mb-1">
                    {user.name || user.email}
                  </div>
                  {user.role !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full text-sm text-foreground hover:text-gold hover:bg-white/5 cursor-pointer px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full text-sm text-foreground hover:text-gold hover:bg-white/5 cursor-pointer px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/5 my-1" />

                  <DropdownMenuItem 
                    onClick={async () => {
                      await supabase.auth.signOut();
                      toast.success("Logged out successfully.");
                      navigate({ to: "/" });
                    }}
                    className="w-full text-sm text-destructive hover:bg-destructive/10 cursor-pointer px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) :

            _jsx(Link, { to: "/auth", className: "ml-1 px-4 py-1.5 text-sm rounded-full bg-gradient-gold text-primary-foreground font-medium hover:opacity-90", children: "Sign in" }

            ),

            _jsx("button", { onClick: () => setOpen((v) => !v), className: "p-2 lg:hidden", children:
              open ? /*#__PURE__*/_jsx(X, { className: "w-4 h-4" }) : /*#__PURE__*/_jsx(Menu, { className: "w-4 h-4" }) }
            )] }
          )] }
        ), /*#__PURE__*/

        _jsx(AnimatePresence, { children:
          open && /*#__PURE__*/
          _jsx(motion.div, {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            className: "lg:hidden overflow-hidden border-t border-[var(--glass-border)]", children: /*#__PURE__*/

            _jsxs("div", { className: "px-4 py-3 flex flex-col gap-1", children: [
              links.map((l) => /*#__PURE__*/
              _jsx(Link, { to: l.to, onClick: () => setOpen(false), className: "px-3 py-2 rounded-lg hover:bg-white/5 text-sm", children:
                l.label }, l.to
              )
              ),
              user && (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    toast.success("Logged out successfully.");
                    setOpen(false);
                    navigate({ to: "/" });
                  }}
                  className="px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-left text-destructive font-medium cursor-pointer"
                >
                  Logout
                </button>
              )
] }

            ) }
          ) }

        )] }
      ) }
    ));

}