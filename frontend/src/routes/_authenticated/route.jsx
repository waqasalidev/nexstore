import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";import { jsx as _jsx } from "react/jsx-runtime";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    const role = data.user.role;
    const path = location.pathname;

    if (role === "admin") {
      const isUserRoute = ["/checkout", "/dashboard", "/orders"].some(p => path === p || path.startsWith(p + "/"));
      if (isUserRoute) {
        throw redirect({ to: "/admin" });
      }
    } else {
      const isAdminRoute = path === "/admin" || path.startsWith("/admin/");
      if (isAdminRoute) {
        throw redirect({ to: "/dashboard" });
      }
    }

    return { user: data.user };
  },
  component: () => /*#__PURE__*/_jsx(Outlet, {})
});