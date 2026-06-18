import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/useAuth";
import { fmt } from "@/lib/format";
import { 
  Trash2, Lock, Edit, X, ArrowLeft, ArrowRight, Upload,
  ShoppingBag, ClipboardList, TrendingUp, DollarSign, Package,
  Clock, CheckCircle2, Eye, Calendar, User, Mail, MapPin,
  CreditCard, ShieldCheck, Users, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { useUpdateProduct } from "@/lib/queries";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/_authenticated/admin")({
  validateSearch: (search) => {
    return {
      tab: search.tab || "products",
    };
  },
  component: Admin,
});

function Admin() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);

  const isAdmin = user?.role === "admin";
  const roleLoading = false;

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch admin products");
      return await res.json();
    }
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const res = await fetch("/api/brands");
      if (!res.ok) throw new Error("Failed to fetch brands");
      return await res.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return await res.json();
    }
  });

  const addProduct = useMutation({
    mutationFn: async (form) => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          discount_percent: Number(form.discount) || 0,
          stock: Number(form.stock) || 0,
          category_id: form.category_id || null,
          brand_id: form.brand_id || null,
          image: form.image || null,
          featured: false
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add product");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Product added successfully.");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast.error(e.message)
  });

  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Product deleted successfully.");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast.error(e.message)
  });

  const addBrand = useMutation({
    mutationFn: async (form) => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          category_id: form.category_id || null,
          logo_url: ""
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add brand");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Brand added successfully.");
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (e) => toast.error(e.message)
  });

  const deleteBrand = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete brand");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Brand deleted successfully.");
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (e) => toast.error(e.message)
  });

  const updateBrand = useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/brands/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update brand");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Brand updated successfully.");
      qc.invalidateQueries({ queryKey: ["brands"] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast.error(e.message)
  });

  const updateProductMutation = useUpdateProduct();
  const { tab } = Route.useSearch();
  const [activeTab, setActiveTab] = useState(tab || "products");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch admin users");
      return await res.json();
    }
  });

  const { data: adminOrders = [], refetch: refetchAdminOrders } = useQuery({
    queryKey: ["admin-orders"],
    enabled: !!isAdmin,
    refetchInterval: 5000, // Real-time automatic polling
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch admin orders");
      return await res.json();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      return await res.json();
    },
    onSuccess: (data) => {
      toast.success("Order status updated!");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      // Update selectedOrder view if currently open
      if (selectedOrder) {
        setSelectedOrder(prev => {
          if (prev.id === data._id || prev._id === data._id) {
            return { ...prev, status: data.status };
          }
          return prev;
        });
      }
    },
    onError: (e) => toast.error(e.message)
  });

  // Calculate statistics
  const totalOrders = adminOrders.length;
  const pendingOrders = adminOrders.filter(o => o.status === "pending").length;
  const deliveredOrders = adminOrders.filter(o => o.status === "delivered").length;
  const totalRevenue = adminOrders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const lowStockProductsCount = products.filter(p => p.stock < 10).length;

  if (roleLoading) return /*#__PURE__*/_jsx("main", { className: "pt-32 text-center text-muted-foreground", children: "Checking access\u2026" });

  if (!isAdmin) {
    return (/*#__PURE__*/
      _jsxs("main", { className: "pt-32 pb-16 text-center max-w-md mx-auto px-4", children: [/*#__PURE__*/
        _jsx(Lock, { className: "w-12 h-12 mx-auto text-gold" }), /*#__PURE__*/
        _jsx("h1", { className: "mt-4 text-3xl font-bold", children: "Admin access required" }), /*#__PURE__*/
        _jsxs("p", { className: "mt-2 text-muted-foreground", children: ["Your account doesn't have admin privileges. Grant the ", /*#__PURE__*/
          _jsx("code", { className: "text-gold", children: "admin" }), " role in the database to unlock this panel."] }
        ), /*#__PURE__*/
        _jsxs("p", { className: "mt-4 text-xs text-muted-foreground", children: ["Tip: insert your user id into ", /*#__PURE__*/_jsx("code", { children: "user_roles" }), " with role ", /*#__PURE__*/_jsx("code", { children: "admin" }), "."] })] }
      ));
  }

  return (/*#__PURE__*/
    _jsxs("main", { className: "pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6", children: [/*#__PURE__*/
      _jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold", children: "Admin" }), /*#__PURE__*/
      _jsx("h1", { className: "text-5xl font-bold mt-2 mb-10", children: "Manage Store" }), /*#__PURE__*/

      /* Tab Navigation */
      _jsx("div", { className: "flex border-b border-white/5 mb-8 gap-4 overflow-x-auto whitespace-nowrap hide-scrollbar", children:
        [
          { id: "products", label: "Manage Products", icon: ShoppingBag },
          { id: "orders", label: "Manage Orders", icon: ClipboardList },
          { id: "brands", label: "Manage Brands", icon: CheckCircle2 },
          { id: "users", label: "Manage Users", icon: Users },
          { id: "inventory", label: "Product Inventory", icon: Package },
          { id: "stats", label: "Business Stats", icon: TrendingUp }
        ].map(t => (
          _jsxs("button", {
            type: "button",
            onClick: () => setActiveTab(t.id),
            className: `flex items-center gap-2 pb-4 px-2 font-medium text-sm border-b-2 transition relative cursor-pointer ${
              activeTab === t.id 
                ? "border-gold text-gold font-bold" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`,
            children: [
              _jsx(t.icon, { className: "w-4 h-4" }),
              _jsx("span", { children: t.label })
            ]
          }, t.id)
        ))
      }),

      /* Products Tab */
      activeTab === "products" && _jsxs(_Fragment, { children: [
        _jsxs("section", { className: "glass rounded-3xl p-6 mb-10", children: [/*#__PURE__*/
          _jsx("h2", { className: "text-xl font-semibold mb-4", children: "Add product" }), /*#__PURE__*/
          _jsx(ProductForm, { brands: brands, categories: categories, onSubmit: (f) => addProduct.mutate(f), loading: addProduct.isPending })] }
        ), /*#__PURE__*/
        _jsxs("section", { children: [/*#__PURE__*/
          _jsxs("h2", { className: "text-xl font-semibold mb-4", children: ["Products (", products.length, ")"] }), /*#__PURE__*/
          _jsx("div", { className: "space-y-2", children:
            products.map((p) => /*#__PURE__*/
            _jsxs("div", { className: "glass rounded-2xl p-4 flex items-center gap-4", children: [/*#__PURE__*/
              _jsx("img", { src: p.images?.[0] || "", alt: "", className: "w-14 h-14 rounded-lg object-cover bg-muted" }), /*#__PURE__*/
              _jsxs("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                _jsx("div", { className: "font-medium truncate", children: p.name }), /*#__PURE__*/
                _jsxs("div", { className: "text-xs text-muted-foreground", children: [p.brands?.name || "No Brand", " \xB7 ", p.categories?.name || "No Category", " \xB7 stock ", p.stock] })] }
              ), /*#__PURE__*/
              _jsx("div", { className: "text-right", children: /*#__PURE__*/
                _jsx("div", { className: "font-display font-semibold", children: fmt(Number(p.price)) }) }
              ), /*#__PURE__*/
              _jsxs("div", { className: "flex items-center gap-2", children: [
                _jsx("button", { onClick: () => setEditingProduct(p), className: "p-2 rounded-full hover:bg-white/10 text-gold", children: /*#__PURE__*/
                  _jsx(Edit, { className: "w-4 h-4" }) 
                }),
                _jsx("button", { onClick: () => deleteProduct.mutate(p.id), className: "p-2 rounded-full hover:bg-destructive/20 text-destructive", children: /*#__PURE__*/
                  _jsx(Trash2, { className: "w-4 h-4" }) 
                })
              ] })] }, p.id
            )
            ) }
          )] }
        )
      ] }),

      /* Orders Tab */
      activeTab === "orders" && _jsxs("section", { className: "space-y-4", children: [
        _jsx("h2", { className: "text-xl font-semibold", children: "Customer Orders" }),
        _jsx("div", { className: "glass rounded-3xl p-6 overflow-x-auto border border-white/5", children:
          _jsxs("table", { className: "w-full text-left border-collapse min-w-[800px]", children: [
            _jsx("thead", { children:
              _jsxs("tr", { className: "border-b border-white/5 text-xs uppercase text-muted-foreground tracking-wider font-semibold", children: [
                _jsx("th", { className: "pb-4 pr-4 pl-2", children: "Order ID" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Customer" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Date" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Items" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Total" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Payment" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Status" }),
                _jsx("th", { className: "pb-4 pl-2 text-right", children: "Actions" })
              ] })
            }),
            _jsx("tbody", { className: "text-sm divide-y divide-white/5", children:
              adminOrders.length === 0 ? (
                _jsx("tr", { children:
                  _jsx("td", { colSpan: "8", className: "text-center py-10 text-muted-foreground", children: "No customer orders found." })
                })
              ) : (
                adminOrders.map(o => (
                  _jsxs("tr", { className: "hover:bg-white/5 transition", children: [
                    _jsxs("td", { className: "py-4 pr-4 pl-2 font-mono text-xs uppercase text-gold font-semibold", children: [
                      "#", (o.id || o._id).slice(-8)
                    ] }),
                    _jsxs("td", { className: "py-4 pr-4", children: [
                      _jsx("div", { className: "font-semibold text-xs leading-none", children: o.user_id?.display_name || "Unknown" }),
                      _jsx("div", { className: "text-[10px] text-muted-foreground mt-1", children: o.user_id?.email || "N/A" }),
                      o.user_id?.phone && _jsx("div", { className: "text-[9px] text-muted-foreground mt-0.5", children: o.user_id?.phone })
                    ] }),
                    _jsx("td", { className: "py-4 pr-4 text-xs text-muted-foreground", children:
                      new Date(o.created_at || o.createdAt).toLocaleDateString()
                    }),
                    _jsxs("td", { className: "py-4 pr-4 text-xs font-medium", children: [
                      o.items?.reduce((sum, it) => sum + it.quantity, 0), " pc(s)"
                    ] }),
                    _jsx("td", { className: "py-4 pr-4 font-display font-semibold text-xs text-gold", children:
                      fmt(Number(o.total))
                    }),
                    _jsx("td", { className: "py-4 pr-4", children:
                      _jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wide", children: [
                        _jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
                        _jsx("span", { children: "Paid" })
                      ] })
                    }),
                    _jsx("td", { className: "py-4 pr-4", children:
                      _jsxs("select", {
                        value: o.status,
                        onChange: (e) => updateStatusMutation.mutate({ orderId: o.id || o._id, status: e.target.value }),
                        className: `text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 outline-none focus:ring-1 ring-gold bg-black/40 ${
                          o.status === "delivered" ? "text-emerald-400" :
                          o.status === "shipped" ? "text-blue-400" :
                          o.status === "cancelled" ? "text-destructive" :
                          "text-gold"
                        }`,
                        children: [
                          _jsx("option", { value: "pending", className: "bg-card", children: "Pending" }),
                          _jsx("option", { value: "processing", className: "bg-card", children: "Processing" }),
                          _jsx("option", { value: "shipped", className: "bg-card", children: "Shipped" }),
                          _jsx("option", { value: "delivered", className: "bg-card", children: "Delivered" }),
                          _jsx("option", { value: "cancelled", className: "bg-card", children: "Cancelled" })
                        ]
                      })
                    }),
                    _jsx("td", { className: "py-4 pl-2 text-right", children:
                      _jsxs("button", {
                        type: "button",
                        onClick: () => setSelectedOrder(o),
                        className: "inline-flex items-center gap-1 text-xs text-gold hover:underline font-semibold cursor-pointer",
                        children: [
                          _jsx(Eye, { className: "w-3.5 h-3.5" }),
                          _jsx("span", { children: "Details" })
                        ]
                      })
                    })
                  ] }, o.id || o._id)
                ))
              )
            })
          ] })
        })
      ] }),

      /* Brands Tab */
      activeTab === "brands" && _jsxs(_Fragment, { children: [
        _jsxs("section", { className: "glass rounded-3xl p-6 mb-10", children: [
          _jsx("h2", { className: "text-xl font-semibold mb-4", children: "Add Brand" }),
          _jsx(BrandForm, { categories: categories, onSubmit: (f) => addBrand.mutate(f), loading: addBrand.isPending })
        ] }),
        _jsxs("section", { children: [
          _jsxs("h2", { className: "text-xl font-semibold mb-4", children: ["Brands (", brands.length, ")"] }),
          _jsx("div", { className: "glass rounded-3xl p-6 overflow-x-auto border border-white/5", children:
            _jsxs("table", { className: "w-full text-left border-collapse min-w-[600px]", children: [
              _jsx("thead", { children:
                _jsxs("tr", { className: "border-b border-white/5 text-xs uppercase text-muted-foreground tracking-wider font-semibold", children: [
                  _jsx("th", { className: "pb-4 pr-4 pl-2", children: "Brand ID" }),
                  _jsx("th", { className: "pb-4 pr-4", children: "Brand Name" }),
                  _jsx("th", { className: "pb-4 pr-4", children: "Category" }),
                  _jsx("th", { className: "pb-4 pl-2 text-right", children: "Actions" })
                ] })
              }),
              _jsx("tbody", { className: "text-sm divide-y divide-white/5", children:
                brands.length === 0 ? (
                  _jsx("tr", { children:
                    _jsx("td", { colSpan: "4", className: "text-center py-10 text-muted-foreground", children: "No brands found." })
                  })
                ) : (
                  brands.map(b => (
                    _jsxs("tr", { className: "hover:bg-white/5 transition", children: [
                      _jsxs("td", { className: "py-4 pr-4 pl-2 font-mono text-xs uppercase text-gold font-semibold", children: ["#", b.id.slice(-8)] }),
                      _jsx("td", { className: "py-4 pr-4 font-semibold", children: b.name }),
                      _jsx("td", { className: "py-4 pr-4 text-xs text-muted-foreground", children: b.category_id?.name || b.category || "Unassigned" }),
                      _jsxs("td", { className: "py-4 pl-2 text-right flex items-center justify-end gap-2", children: [
                        _jsx("button", { onClick: () => setEditingBrand(b), className: "p-2 rounded-full hover:bg-white/10 text-gold", children: _jsx(Edit, { className: "w-4 h-4" }) }),
                        _jsx("button", { onClick: () => deleteBrand.mutate(b.id), className: "p-2 rounded-full hover:bg-destructive/20 text-destructive", children: _jsx(Trash2, { className: "w-4 h-4" }) })
                      ] })
                    ] }, b.id)
                  ))
                )
              })
            ] })
          })
        ] })
      ] }),

      /* Users Tab */
      activeTab === "users" && _jsxs("section", { className: "space-y-4", children: [
        _jsx("h2", { className: "text-xl font-semibold", children: "Registered Customers" }),
        _jsx("div", { className: "glass rounded-3xl p-6 overflow-x-auto border border-white/5", children:
          _jsxs("table", { className: "w-full text-left border-collapse min-w-[800px]", children: [
            _jsx("thead", { children:
              _jsxs("tr", { className: "border-b border-white/5 text-xs uppercase text-muted-foreground tracking-wider font-semibold", children: [
                _jsx("th", { className: "pb-4 pr-4 pl-2", children: "Customer Name" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Email" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Join Date" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Total Orders" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Total Spending" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Last Activity" }),
                _jsx("th", { className: "pb-4 pl-2 text-right", children: "Actions" })
              ] })
            }),
            _jsx("tbody", { className: "text-sm divide-y divide-white/5", children:
              users.length === 0 ? (
                _jsx("tr", { children:
                  _jsx("td", { colSpan: "7", className: "text-center py-10 text-muted-foreground", children: "No customers found." })
                })
              ) : (
                users.map(u => (
                  _jsxs("tr", { className: "hover:bg-white/5 transition", children: [
                    _jsx("td", { className: "py-4 pr-4 pl-2 font-semibold text-xs", children: u.name }),
                    _jsx("td", { className: "py-4 pr-4 text-xs text-muted-foreground", children: u.email }),
                    _jsx("td", { className: "py-4 pr-4 text-xs text-muted-foreground", children:
                      new Date(u.joinDate).toLocaleDateString()
                    }),
                    _jsx("td", { className: "py-4 pr-4 text-xs font-semibold", children: u.totalOrders }),
                    _jsx("td", { className: "py-4 pr-4 text-xs font-semibold text-gold", children: fmt(u.totalSpending) }),
                    _jsx("td", { className: "py-4 pr-4 text-xs text-muted-foreground", children:
                      new Date(u.lastActivity).toLocaleDateString()
                    }),
                    _jsx("td", { className: "py-4 pl-2 text-right", children:
                      _jsxs("button", {
                        type: "button",
                        onClick: () => setSelectedUser(u),
                        className: "inline-flex items-center gap-1 text-xs text-gold hover:underline font-semibold cursor-pointer",
                        children: [
                          _jsx(Eye, { className: "w-3.5 h-3.5" }),
                          _jsx("span", { children: "View Profile" })
                        ]
                      })
                    })
                  ] }, u.id)
                ))
              )
            })
          ] })
        })
      ] }),

      /* Inventory Tab */
      activeTab === "inventory" && _jsxs("section", { className: "space-y-4", children: [
        _jsx("h2", { className: "text-xl font-semibold", children: "Product Inventory Status" }),
        _jsx("div", { className: "glass rounded-3xl p-6 overflow-x-auto border border-white/5", children:
          _jsxs("table", { className: "w-full text-left border-collapse min-w-[800px]", children: [
            _jsx("thead", { children:
              _jsxs("tr", { className: "border-b border-white/5 text-xs uppercase text-muted-foreground tracking-wider font-semibold", children: [
                _jsx("th", { className: "pb-4 pr-4 pl-2", children: "Product Name" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Original Stock" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Sold Quantity" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Remaining Stock" }),
                _jsx("th", { className: "pb-4 pr-4", children: "Status" })
              ] })
            }),
            _jsx("tbody", { className: "text-sm divide-y divide-white/5", children:
              products.length === 0 ? (
                _jsx("tr", { children:
                  _jsx("td", { colSpan: "5", className: "text-center py-10 text-muted-foreground", children: "No products in inventory." })
                })
              ) : (
                products.map(p => {
                  const originalStock = (p.stock || 0) + (p.sold || 0);
                  const isLowStock = p.stock < 10;
                  return (
                    _jsxs("tr", { className: "hover:bg-white/5 transition", children: [
                      _jsx("td", { className: "py-4 pr-4 pl-2 font-semibold text-xs", children: p.name }),
                      _jsx("td", { className: "py-4 pr-4 text-xs text-muted-foreground", children: originalStock }),
                      _jsx("td", { className: "py-4 pr-4 text-xs font-semibold text-emerald-400", children: p.sold || 0 }),
                      _jsx("td", { className: `py-4 pr-4 text-xs font-semibold ${isLowStock ? "text-rose-400 font-bold" : "text-foreground"}`, children: p.stock }),
                      _jsx("td", { className: "py-4 pr-4", children:
                        isLowStock ? (
                          p.stock === 0 ? (
                            _jsx("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide", children: "Out of Stock" })
                          ) : (
                            _jsx("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide", children: "Low Stock" })
                          )
                        ) : (
                          _jsx("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide", children: "In Stock" })
                        )
                      })
                    ] }, p.id)
                  );
                })
              )
            })
          ] })
        })
      ] }),

      /* Statistics Tab */
      activeTab === "stats" && _jsxs("section", { className: "space-y-6", children: [
        _jsx("h2", { className: "text-xl font-semibold", children: "Dashboard Statistics" }),
        _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children:
          [
            { label: "Total Revenue", val: fmt(totalRevenue), icon: DollarSign, color: "text-emerald-400" },
            { label: "Total Orders", val: totalOrders, icon: Package, color: "text-blue-400" },
            { label: "Pending Orders", val: pendingOrders, icon: Clock, color: "text-gold" },
            { label: "Delivered Orders", val: deliveredOrders, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Total Users", val: users.length, icon: Users, color: "text-indigo-400" },
            { label: "Low Stock Products", val: lowStockProductsCount, icon: AlertTriangle, color: "text-rose-400" }
          ].map(c => (
            _jsxs("div", { className: "glass rounded-3xl p-5 border border-white/5 space-y-2 flex flex-col justify-between", children: [
              _jsxs("div", { className: "flex justify-between items-start", children: [
                _jsx("span", { className: "text-xs uppercase text-muted-foreground font-semibold tracking-wider", children: c.label }),
                _jsx(c.icon, { className: `w-5 h-5 ${c.color}` })
              ] }),
              _jsx("div", { className: "text-2xl font-bold font-display text-gradient-gold", children: c.val })
            ] }, c.label)
          ))
        })
      ] }),

      /* Modals */
      editingProduct && /*#__PURE__*/_jsx(EditProductModal, {
        product: editingProduct,
        brands: brands,
        categories: categories,
        onClose: () => setEditingProduct(null),
        onSave: (id, data) => {
          updateProductMutation.mutate({ id, data }, {
            onSuccess: () => setEditingProduct(null)
          });
        },
        loading: updateProductMutation.isPending
      }),

      editingBrand && /*#__PURE__*/_jsx(EditBrandModal, {
        brand: editingBrand,
        categories: categories,
        onClose: () => setEditingBrand(null),
        onSave: (id, data) => {
          updateBrand.mutate({ id, data }, {
            onSuccess: () => setEditingBrand(null)
          });
        },
        loading: updateBrand.isPending
      }),

      selectedOrder && /*#__PURE__*/_jsx(AdminOrderDetailsModal, {
        order: selectedOrder,
        onClose: () => setSelectedOrder(null),
        onUpdateStatus: (orderId, status) => {
          updateStatusMutation.mutate({ orderId, status });
        },
        loading: updateStatusMutation.isPending
      }),

      selectedUser && /*#__PURE__*/_jsx(AdminUserDetailsModal, {
        user: selectedUser,
        onClose: () => setSelectedUser(null)
      })
    ] }
  ));
}

function ProductForm({ brands, categories, onSubmit, loading }) {
  const [f, setF] = useState({ name: "", description: "", price: "", discount: "", stock: "10", category_id: "", brand_id: "", image: "" });

  return (/*#__PURE__*/
    _jsxs("form", {
      onSubmit: (e) => {e.preventDefault();onSubmit(f);setF({ ...f, name: "", description: "", price: "", image: "" });},
      className: "grid sm:grid-cols-2 gap-3", children: [/*#__PURE__*/

      _jsx("input", { required: true, placeholder: "Name", value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }), className: "glass rounded-full px-4 py-2.5 outline-none focus:ring-2 ring-gold" }), /*#__PURE__*/
      _jsx("input", { required: true, type: "number", step: "0.01", placeholder: "Price", value: f.price, onChange: (e) => setF({ ...f, price: e.target.value }), className: "glass rounded-full px-4 py-2.5" }), /*#__PURE__*/
      _jsx("input", { type: "number", placeholder: "Discount %", value: f.discount, onChange: (e) => setF({ ...f, discount: e.target.value }), className: "glass rounded-full px-4 py-2.5" }), /*#__PURE__*/
      _jsx("input", { type: "number", placeholder: "Stock", value: f.stock, onChange: (e) => setF({ ...f, stock: e.target.value }), className: "glass rounded-full px-4 py-2.5" }), /*#__PURE__*/
      _jsxs("select", { value: f.category_id, onChange: (e) => setF({ ...f, category_id: e.target.value }), className: "glass rounded-full px-4 py-2.5", children: [/*#__PURE__*/
        _jsx("option", { value: "", className: "bg-card", children: "Category\u2026" }),
        categories.map((c) => /*#__PURE__*/_jsx("option", { value: c.id, className: "bg-card", children: c.name }, c.id))] }
      ), /*#__PURE__*/
      _jsxs("select", { value: f.brand_id, onChange: (e) => setF({ ...f, brand_id: e.target.value }), className: "glass rounded-full px-4 py-2.5", children: [/*#__PURE__*/
        _jsx("option", { value: "", className: "bg-card", children: "Brand\u2026" }),
        brands.map((b) => /*#__PURE__*/_jsx("option", { value: b.id, className: "bg-card", children: b.name }, b.id))] }
      ), /*#__PURE__*/
      _jsx("input", { placeholder: "Image URL", value: f.image, onChange: (e) => setF({ ...f, image: e.target.value }), className: "sm:col-span-2 glass rounded-full px-4 py-2.5" }), /*#__PURE__*/
      _jsxs("div", { className: "sm:col-span-2 flex flex-col gap-1.5", children: [
        _jsx("span", { className: "text-xs text-muted-foreground font-semibold px-2", children: "Description" }),
        _jsx("textarea", { placeholder: "Description", value: f.description, onChange: (e) => setF({ ...f, description: e.target.value }), className: "glass rounded-2xl px-4 py-2.5 min-h-20" })
      ] }), /*#__PURE__*/
      _jsx("button", { disabled: loading, className: "sm:col-span-2 bg-gradient-gold text-primary-foreground py-2.5 rounded-full font-medium disabled:opacity-50", children:
        loading ? "Adding…" : "Add product" }
      )] }
    ));
}

function EditProductModal({ product, brands, categories, onClose, onSave, loading }) {
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || 0);
  const [discount, setDiscount] = useState(product.discount_percent || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [categoryId, setCategoryId] = useState(product.category_id || "");
  const [brandId, setBrandId] = useState(product.brand_id || "");
  const [model3d, setModel3d] = useState(product.model_3d || "");
  const [images, setImages] = useState(product.images || []);

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload image.");
      }

      const data = await res.json();
      setImages([...images, data.url]);
      toast.success("Image updated successfully.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (idxToRemove) => {
    setImages(images.filter((_, idx) => idx !== idxToRemove));
  };

  const handleMoveImage = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= images.length) return;

    const newImages = [...images];
    const temp = newImages[idx];
    newImages[idx] = newImages[newIdx];
    newImages[newIdx] = temp;
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (price < 0) return toast.error("Price cannot be negative");

    onSave(product.id, {
      name,
      description,
      price: Number(price),
      discount_percent: Number(discount) || 0,
      stock: Number(stock) || 0,
      category_id: categoryId || null,
      brand_id: brandId || null,
      model_3d: model3d || null,
      images,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass max-w-2xl w-full rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 flex flex-col gap-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gradient-gold">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold px-2">Name *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="glass rounded-full px-4 py-2.5 outline-none focus:ring-2 ring-gold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold px-2">Price *</label>
              <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="glass rounded-full px-4 py-2.5" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold px-2">Discount %</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="glass rounded-full px-4 py-2.5" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold px-2">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="glass rounded-full px-4 py-2.5" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold px-2">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="glass rounded-full px-4 py-2.5">
                <option value="" className="bg-card">Category…</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-card">{c.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground font-semibold px-2">Brand</label>
              <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="glass rounded-full px-4 py-2.5">
                <option value="" className="bg-card">Brand…</option>
                {brands.map((b) => <option key={b.id} value={b.id} className="bg-card">{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-semibold px-2">3D Model Path / Type</label>
            <input value={model3d} onChange={(e) => setModel3d(e.target.value)} placeholder="e.g., shoes, watches, electronics" className="glass rounded-full px-4 py-2.5" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground font-semibold px-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="glass rounded-2xl px-4 py-2.5 min-h-20" />
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4">
            <h3 className="text-sm font-semibold text-gold">Product Images</h3>
            
            {/* Image Manager UI */}
            <div className="flex flex-wrap gap-2 py-2">
              {images.map((img, idx) => (
                <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden relative border border-white/10 bg-muted shrink-0 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    <button type="button" disabled={idx === 0} onClick={() => handleMoveImage(idx, -1)} className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-30">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" disabled={idx === images.length - 1} onClick={() => handleMoveImage(idx, 1)} className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-30">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="p-1 rounded bg-destructive/60 hover:bg-destructive text-white">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 px-1 bg-gradient-gold text-primary-foreground text-[8px] font-bold rounded">COVER</span>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <input placeholder="Add image URL manually..." value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} className="glass rounded-full px-4 py-2" />
              <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold">Add URL</button>
            </div>

            <div className="flex items-center gap-3 py-2 border-t border-white/5 mt-2">
              <label className="flex items-center gap-2 px-4 py-2 glass rounded-full cursor-pointer hover:bg-white/10 transition text-xs font-semibold">
                <Upload className="w-4 h-4 text-gold" />
                <span>{uploading ? "Uploading..." : "Upload from Computer"}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <span className="text-[10px] text-muted-foreground">Supported format: jpeg, png, webp, svg.</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full glass hover:bg-white/10 transition font-medium text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-glow disabled:opacity-50 text-sm">
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminOrderDetailsModal({ order, onClose, onUpdateStatus, loading }) {
  const formattedDate = new Date(order.created_at || order.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass max-w-2xl w-full rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 flex flex-col gap-4 shadow-card">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-white/5 pb-2">
          <span className="text-xs uppercase tracking-wider text-gold font-bold">Admin Order Inspection</span>
          <h2 className="text-xl font-bold font-display mt-0.5">Order Details</h2>
          <p className="text-xs text-muted-foreground font-mono uppercase mt-0.5">ID: {order.id || order._id}</p>
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          {/* Customer info */}
          <div className="glass rounded-2xl p-4 border border-white/5 space-y-2">
            <h3 className="font-bold text-gold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Details</span>
            </h3>
            <div className="space-y-1">
              <p className="font-semibold text-sm">{order.user_id?.display_name || "Unknown Customer"}</p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3 text-gold" />
                <span>{order.user_id?.email || "No Email recorded"}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Placed: {formattedDate}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="glass rounded-2xl p-4 border border-white/5 space-y-2">
            <h3 className="font-bold text-gold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Shipping Address</span>
            </h3>
            {order.shipping_address ? (
              <div className="space-y-0.5 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground text-xs">{order.shipping_address.name}</p>
                <p>{order.shipping_address.line1}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.country}</p>
                <p>Zip: {order.shipping_address.zip}</p>
              </div>
            ) : (
              <p className="italic text-muted-foreground">No address recorded.</p>
            )}
          </div>
        </div>

        {/* Product items table */}
        <div className="glass rounded-2xl p-4 border border-white/5 space-y-3">
          <h3 className="font-bold text-gold text-sm flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            <span>Ordered Items ({order.items?.length || 0})</span>
          </h3>

          <div className="divide-y divide-white/5 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5">
                    {item.size && `Size: ${item.size} `}
                    {item.color && `Color: ${item.color} `}
                    {`Qty: ${item.quantity}`}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gold">{fmt(Number(item.price))}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Subtotal: {fmt(Number(item.price) * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Status control */}
        <div className="grid sm:grid-cols-2 gap-4 items-center border-t border-white/5 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Total Paid (Demo)</p>
              <p className="text-2xl font-bold font-display text-gradient-gold">{fmt(Number(order.total))}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Paid</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground font-semibold px-2">Modify Order Status</label>
            <select
              value={order.status}
              disabled={loading}
              onChange={(e) => onUpdateStatus(order.id || order._id, e.target.value)}
              className="glass rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide"
            >
              <option value="pending" className="bg-card">Pending</option>
              <option value="processing" className="bg-card">Processing</option>
              <option value="shipped" className="bg-card">Shipped</option>
              <option value="delivered" className="bg-card">Delivered</option>
              <option value="cancelled" className="bg-card">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-semibold border border-white/10 transition cursor-pointer">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminUserDetailsModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass max-w-2xl w-full rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 flex flex-col gap-4 shadow-card">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-white/5 pb-2">
          <span className="text-xs uppercase tracking-wider text-gold font-bold">Admin Customer Profile</span>
          <h2 className="text-xl font-bold font-display mt-0.5">{user.name}</h2>
          <p className="text-xs text-muted-foreground font-mono uppercase mt-0.5">User ID: {user.id}</p>
        </div>

        {/* Profile Grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          {/* User Info */}
          <div className="glass rounded-2xl p-4 border border-white/5 space-y-2">
            <h3 className="font-bold text-gold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>User Information</span>
            </h3>
            <div className="space-y-1 text-muted-foreground">
              <p><span className="font-semibold text-foreground">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-foreground">Phone:</span> {user.phone}</p>
              <p><span className="font-semibold text-foreground">Join Date:</span> {new Date(user.joinDate).toLocaleDateString()}</p>
              <p><span className="font-semibold text-foreground">Role:</span> <span className="uppercase text-gold font-bold">{user.role}</span></p>
            </div>
          </div>

          {/* Spending & Orders summary */}
          <div className="glass rounded-2xl p-4 border border-white/5 space-y-2">
            <h3 className="font-bold text-gold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Purchase Activity</span>
            </h3>
            <div className="space-y-1 text-muted-foreground">
              <p><span className="font-semibold text-foreground">Total Orders placed:</span> {user.totalOrders}</p>
              <p><span className="font-semibold text-foreground">Total Spending:</span> <span className="text-gold font-bold text-sm">{fmt(user.totalSpending)}</span></p>
              <p><span className="font-semibold text-foreground">Last Activity:</span> {new Date(user.lastActivity).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Shipping Addresses */}
        <div className="glass rounded-2xl p-4 border border-white/5 space-y-3">
          <h3 className="font-bold text-gold text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Saved Shipping Addresses ({user.shippingAddresses?.length || 0})</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {user.shippingAddresses && user.shippingAddresses.length > 0 ? (
              user.shippingAddresses.map((addr, idx) => (
                <div key={idx} className="glass rounded-xl p-3 border border-white/5 relative">
                  {addr.is_default && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-gradient-gold text-primary-foreground text-[8px] font-bold rounded">DEFAULT</span>
                  )}
                  <p className="font-semibold text-foreground">{addr.name}</p>
                  <p className="text-muted-foreground mt-1">{addr.line1}</p>
                  <p className="text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                  <p className="text-muted-foreground">{addr.country}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Phone: {addr.phone || "N/A"}</p>
                </div>
              ))
            ) : (
              <p className="col-span-2 italic text-muted-foreground">No saved addresses found.</p>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="glass rounded-2xl p-4 border border-white/5 space-y-3">
          <h3 className="font-bold text-gold text-sm flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4" />
            <span>Customer Order History ({user.orders?.length || 0})</span>
          </h3>
          <div className="divide-y divide-white/5 text-xs max-h-48 overflow-y-auto pr-1">
            {user.orders && user.orders.length > 0 ? (
              user.orders.map((o, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <p className="font-mono text-gold font-semibold">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Placed: {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{fmt(o.total)}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                      o.status === "delivered" ? "text-emerald-400" :
                      o.status === "cancelled" ? "text-destructive" :
                      "text-gold"
                    }`}>{o.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="italic text-muted-foreground py-2 text-center">No orders placed by this customer.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandForm({ categories, onSubmit, loading }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Brand name is required");
    onSubmit({ name: name.trim(), category_id: categoryId });
    setName("");
    setCategoryId("");
  };

  return (
    _jsxs("form", { onSubmit: handleSubmit, className: "grid sm:grid-cols-3 gap-3 items-end", children: [
      _jsxs("div", { className: "flex flex-col gap-1", children: [
        _jsx("label", { className: "text-xs text-muted-foreground font-semibold px-2", children: "Brand Name *" }),
        _jsx("input", { required: true, placeholder: "e.g., Nike, Rolex", value: name, onChange: (e) => setName(e.target.value), className: "glass rounded-full px-4 py-2.5 outline-none focus:ring-2 ring-gold" })
      ] }),
      _jsxs("div", { className: "flex flex-col gap-1", children: [
        _jsx("label", { className: "text-xs text-muted-foreground font-semibold px-2", children: "Assign Category" }),
        _jsxs("select", { value: categoryId, onChange: (e) => setCategoryId(e.target.value), className: "glass rounded-full px-4 py-2.5", children: [
          _jsx("option", { value: "", className: "bg-card", children: "Select category\u2026" }),
          categories.map((c) => _jsx("option", { value: c.id, className: "bg-card", children: c.name }, c.id))
        ] })
      ] }),
      _jsx("button", { disabled: loading, className: "bg-gradient-gold text-primary-foreground py-2.5 rounded-full font-medium disabled:opacity-50", children:
        loading ? "Adding\u2026" : "Add Brand"
      })
    ] })
  );
}

function EditBrandModal({ brand, categories, onClose, onSave, loading }) {
  const [name, setName] = useState(brand.name || "");
  const [categoryId, setCategoryId] = useState(brand.category_id?.id || brand.category_id?._id || brand.category_id || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    onSave(brand.id, {
      name: name.trim(),
      category_id: categoryId || null
    });
  };

  return (
    _jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4", children:
      _jsxs("div", { className: "glass max-w-md w-full rounded-3xl p-6 relative border border-white/10 flex flex-col gap-4", children: [
        _jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition", children:
          _jsx(X, { className: "w-5 h-5" })
        }),
        _jsx("h2", { className: "text-2xl font-bold text-gradient-gold", children: "Edit Brand" }),
        _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          _jsxs("div", { className: "flex flex-col gap-1", children: [
            _jsx("label", { className: "text-xs text-muted-foreground font-semibold px-2", children: "Brand Name *" }),
            _jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), className: "glass rounded-full px-4 py-2.5 outline-none focus:ring-2 ring-gold" })
          ] }),
          _jsxs("div", { className: "flex flex-col gap-1", children: [
            _jsx("label", { className: "text-xs text-muted-foreground font-semibold px-2", children: "Category" }),
            _jsxs("select", { value: categoryId, onChange: (e) => setCategoryId(e.target.value), className: "glass rounded-full px-4 py-2.5", children: [
              _jsx("option", { value: "", className: "bg-card", children: "Unassigned" }),
              categories.map((c) => _jsx("option", { value: c.id, className: "bg-card", children: c.name }, c.id))
            ] })
          ] }),
          _jsxs("div", { className: "flex justify-end gap-2 pt-4 border-t border-white/5", children: [
            _jsx("button", { type: "button", onClick: onClose, className: "px-5 py-2.5 rounded-full glass hover:bg-white/10 transition font-medium text-sm", children: "Cancel" }),
            _jsx("button", { type: "submit", disabled: loading, className: "px-6 py-2.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-glow disabled:opacity-50 text-sm", children: loading ? "Saving..." : "Save changes" })
          ] })
        ] })
      ] })
    })
  );
}