import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";import { jsx as _jsx } from "react/jsx-runtime";
export const Route = createFileRoute("/shoes")({ component: () => /*#__PURE__*/_jsx(CategoryPage, { slug: "shoes", title: "Shoes", subtitle: "Iconic silhouettes, performance runners, and limited drops with full 3D inspection." }) });