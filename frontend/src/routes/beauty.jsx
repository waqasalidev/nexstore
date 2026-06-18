import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";import { jsx as _jsx } from "react/jsx-runtime";
export const Route = createFileRoute("/beauty")({ component: () => /*#__PURE__*/_jsx(CategoryPage, { slug: "beauty", title: "Beauty", subtitle: "Skincare, fragrance, and tools curated for ritual." }) });