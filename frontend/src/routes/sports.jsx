import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";import { jsx as _jsx } from "react/jsx-runtime";
export const Route = createFileRoute("/sports")({ component: () => /*#__PURE__*/_jsx(CategoryPage, { slug: "sports", title: "Sports", subtitle: "Performance gear engineered for the next personal best." }) });