import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const useProducts = (opts) =>
  useQuery({
    queryKey: ["products", opts],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (opts?.featured) params.append("featured", "true");
      if (opts?.search) params.append("search", opts.search);
      if (opts?.categorySlug) params.append("category", opts.categorySlug);
      if (opts?.brand) params.append("brand", opts.brand);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    },
  });

export const useProduct = (slug) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/slug/${slug}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return await res.json();
    },
  });

export const useBrands = (categorySlug) =>
  useQuery({
    queryKey: ["brands", categorySlug],
    queryFn: async () => {
      const url = categorySlug ? `/api/brands?category=${categorySlug}` : "/api/brands";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch brands");
      return await res.json();
    },
  });

export const useCart = (userId) =>
  useQuery({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch("/api/cart", {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return await res.json();
    },
  });

export const useWishlist = (userId) =>
  useQuery({
    queryKey: ["wishlist", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch("/api/wishlist", {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return await res.json();
    },
  });

export const useAddToCart = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v) => {
      if (!userId) throw new Error("Sign in to add to cart");
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        body: JSON.stringify({
          product_id: v.product_id,
          quantity: v.quantity ?? 1,
          size: v.size ?? null,
          color: v.color ?? null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add to cart");
      }
      return await res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (e) => toast.error(e.message),
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
      return await res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useUpdateCartQty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v) => {
      const res = await fetch(`/api/cart/${v.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        body: JSON.stringify({ quantity: v.quantity }),
      });
      if (!res.ok) throw new Error("Failed to update cart quantity");
      return await res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useToggleWishlist = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product_id) => {
      if (!userId) throw new Error("Sign in to save favorites");
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        body: JSON.stringify({ product_id }),
      });
      if (!res.ok) throw new Error("Failed to toggle wishlist");
      const data = await res.json();
      return { added: data.added };
    },
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(r.added ? "Saved to wishlist" : "Removed from wishlist");
    },
    onError: (e) => toast.error(e.message),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${v.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(v.data)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update product");
      }
      return await res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
      toast.success("Product updated successfully.");
    },
    onError: (e) => toast.error(e.message),
  });
};

export const useOrder = (id) =>
  useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch order details");
      return await res.json();
    },
  });