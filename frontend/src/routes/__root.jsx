import { QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts } from
"@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function NotFoundComponent() {
  return (/*#__PURE__*/
    _jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /*#__PURE__*/
      _jsxs("div", { className: "max-w-md text-center", children: [/*#__PURE__*/
        _jsx("h1", { className: "text-7xl font-bold text-gradient-gold", children: "404" }), /*#__PURE__*/
        _jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }), /*#__PURE__*/
        _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }), /*#__PURE__*/
        _jsx(Link, { to: "/", className: "mt-6 inline-flex items-center justify-center rounded-full bg-gradient-gold px-5 py-2 text-sm font-medium text-primary-foreground", children: "Back home" }

        )] }
      ) }
    ));

}

function ErrorComponent({ error, reset }) {
  const router = useRouter();
  useEffect(() => {console.error("Root boundary error caught:", error);}, [error]);
  return (/*#__PURE__*/
    _jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /*#__PURE__*/
      _jsxs("div", { className: "max-w-md text-center", children: [/*#__PURE__*/
        _jsx("h1", { className: "text-xl font-semibold", children: "Something went wrong" }), /*#__PURE__*/
        _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }), /*#__PURE__*/
        _jsx("button", { onClick: () => {router.invalidate();reset();}, className: "mt-6 rounded-full bg-gradient-gold px-5 py-2 text-sm font-medium text-primary-foreground", children: "Try again" }

        )] }
      ) }
    ));

}

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: "NexStore — Shop The Future" },
    { name: "description", content: "Experience premium products in immersive 3D before you buy. Clothing, shoes, watches, electronics and luxury." },
    { property: "og:title", content: "NexStore — Shop The Future" },
    { property: "og:description", content: "Premium 3D e-commerce. Inspect products in immersive 3D before you buy." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" }],

    links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});

function RootShell({ children }) {
  return (/*#__PURE__*/
    _jsxs("html", { lang: "en", className: "dark", children: [/*#__PURE__*/
      _jsx("head", { children: /*#__PURE__*/_jsx(HeadContent, {}) }), /*#__PURE__*/
      _jsxs("body", { children: [children, /*#__PURE__*/_jsx(Scripts, {})] })] }
    ));

}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);

  return (/*#__PURE__*/
    _jsx(QueryClientProvider, { client: queryClient, children: /*#__PURE__*/
      _jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [/*#__PURE__*/
        _jsx(Nav, {}), /*#__PURE__*/
        _jsx("div", { className: "flex-1", children: /*#__PURE__*/
          _jsx(Outlet, {}) }
        ), /*#__PURE__*/
        _jsx(Footer, {}), /*#__PURE__*/
        _jsx(Toaster, { theme: "dark", position: "bottom-right", richColors: true })] }
      ) }
    ));

}