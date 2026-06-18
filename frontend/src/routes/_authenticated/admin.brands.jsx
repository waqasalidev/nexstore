import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/brands")({
  beforeLoad: () => {
    throw redirect({ to: "/admin", search: { tab: "brands" } });
  }
});
