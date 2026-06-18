import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fmt } from "@/lib/format";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  LayoutDashboard, User, Package, Heart, ShoppingBag, 
  MapPin, Bell, LifeBuoy, Settings, LogOut, Upload, 
  Plus, Trash2, Edit, Check, ChevronRight, MessageSquare, X, ShieldAlert 
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("overview");

  // State for support ticket details modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState("");
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", category: "Other", message: "" });

  // State for Address modals
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ name: "", phone: "", line1: "", city: "", state: "", country: "", zip: "", is_default: false });

  // 1. Fetch User Profile from Backend
  const { data: profile = {}, refetch: refetchProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return await res.json();
    }
  });

  // 2. Fetch User Orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ["my-orders"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return await res.json();
    }
  });

  // 3. Fetch Wishlist Items
  const { data: wishlist = [], refetch: refetchWishlist, isLoading: isWishlistLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      return data.products || [];
    }
  });

  // 4. Fetch Cart Items
  const { data: cart = [], refetch: refetchCart, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      return data.items || [];
    }
  });

  // 5. Fetch Saved Addresses
  const { data: addresses = [], refetch: refetchAddresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: ["addresses"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/addresses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      return await res.json();
    }
  });

  // 6. Fetch Notifications
  const { data: notifications = [], refetch: refetchNotifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ["notifications"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return await res.json();
    }
  });

  // 7. Fetch Support Tickets
  const { data: tickets = [], refetch: refetchTickets, isLoading: isTicketsLoading } = useQuery({
    queryKey: ["support-tickets"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch("/api/support", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return await res.json();
    }
  });

  // MUTATIONS
  // Profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      refetchProfile();
    },
    onError: (e) => toast.error(e.message)
  });

  // Delete Account
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to delete account");
      return await res.json();
    },
    onSuccess: async () => {
      localStorage.removeItem("token");
      await supabase.auth.signOut();
      toast.success("Logged out successfully.");
      navigate({ to: "/" });
    },
    onError: (e) => toast.error(e.message)
  });

  // Address Mutations
  const addAddressMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to add address");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Address added successfully.");
      setIsAddressModalOpen(false);
      refetchAddresses();
    },
    onError: (e) => toast.error(e.message)
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update address");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Address updated successfully.");
      setIsAddressModalOpen(false);
      refetchAddresses();
    },
    onError: (e) => toast.error(e.message)
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to delete address");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Address deleted successfully.");
      refetchAddresses();
    },
    onError: (e) => toast.error(e.message)
  });

  // Notification Mutations
  const readNotificationMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to update notification");
      return await res.json();
    },
    onSuccess: () => {
      refetchNotifications();
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to delete notification");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Notification deleted.");
      refetchNotifications();
    }
  });

  // Support Ticket Mutations
  const createTicketMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Support ticket created successfully.");
      setIsCreateTicketOpen(false);
      setNewTicket({ subject: "", category: "Other", message: "" });
      refetchTickets();
    },
    onError: (e) => toast.error(e.message)
  });

  const replyTicketMutation = useMutation({
    mutationFn: async ({ id, message }) => {
      const res = await fetch(`/api/support/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error("Failed to submit reply");
      return await res.json();
    },
    onSuccess: (data) => {
      setTicketReplyText("");
      setSelectedTicket(data);
      refetchTickets();
      
      // Auto reload after simulated admin response
      setTimeout(() => {
        refetchTickets().then(({ data: freshTickets }) => {
          if (freshTickets) {
            const current = freshTickets.find(t => t.id === data.id);
            if (current) setSelectedTicket(current);
          }
        });
      }, 3000);
    },
    onError: (e) => toast.error(e.message)
  });

  // Cart / Wishlist Actions
  const updateCartQtyMutation = useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ quantity })
      });
      if (!res.ok) throw new Error("Failed to update cart");
      return await res.json();
    },
    onSuccess: () => refetchCart()
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId) => {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Removed from cart");
      refetchCart();
    }
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (!res.ok) throw new Error("Failed to toggle wishlist");
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Wishlist updated");
      refetchWishlist();
    }
  });

  // Profile Avatar Upload Handler
  const [avatarUploading, setAvatarUploading] = useState(false);
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Failed to upload image.");
      const data = await res.json();
      
      updateProfileMutation.mutate({ avatar_url: data.url });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Address edit start
  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      name: addr.name,
      phone: addr.phone || "",
      line1: addr.line1,
      city: addr.city,
      state: addr.state || "",
      country: addr.country,
      zip: addr.zip,
      is_default: addr.is_default
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({ name: "", phone: "", line1: "", city: "", state: "", country: "", zip: "", is_default: false });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data: addressForm });
    } else {
      addAddressMutation.mutate(addressForm);
    }
  };

  // Main Logout flow
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate({ to: "/" });
  };

  // Profile Save Form
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profilePass, setProfilePass] = useState("");
  const [profileConfirmPass, setProfileConfirmPass] = useState("");

  useEffect(() => {
    if (profile) {
      setProfileName(profile.display_name || "");
      setProfilePhone(profile.phone || "");
    }
  }, [profile]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profilePass && profilePass !== profileConfirmPass) {
      return toast.error("Passwords do not match");
    }

    const payload = {
      name: profileName,
      phone: profilePhone
    };

    if (profilePass) {
      payload.password = profilePass;
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        setProfilePass("");
        setProfileConfirmPass("");
      }
    });
  };

  // Settings tab variables
  const [settingsEmail, setSettingsEmail] = useState("");
  const [isSettingsEmailActive, setIsSettingsEmailActive] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (profile) setSettingsEmail(profile.email || "");
  }, [profile]);

  // Sidebar Menu Config
  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package, count: orders.length },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlist.length },
    { id: "cart", label: "Cart", icon: ShoppingBag, count: cart.length },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell, count: notifications.filter(n => !n.read).length },
    { id: "support", label: "Support Tickets", icon: LifeBuoy, count: tickets.filter(t => t.status === "replied").length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (isProfileLoading) {
    return (
      <main className="pt-32 pb-16 text-center max-w-md mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-sm font-semibold">Loading your dashboard account...</p>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Account Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {(profile.display_name?.[0] || profile.email?.[0] || "U").toUpperCase()}
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Upload className="w-4 h-4 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Welcome Back</p>
            <h1 className="text-3xl font-bold font-display mt-0.5">{profile.display_name || profile.email}</h1>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-5 py-2.5 glass rounded-full hover:bg-destructive/10 text-destructive font-semibold text-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-3 lg:pb-0 hide-scrollbar scroll-smooth">
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full lg:rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  active 
                    ? "bg-gradient-gold text-primary-foreground font-semibold shadow-glow" 
                    : "glass hover:bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.count > 0 && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    active ? "bg-primary-foreground text-gold" : "bg-gold text-primary-foreground"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ACTIVE TAB CONTENT CONTENT CONTAINER */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-3xl p-6 md:p-8 border border-white/5 min-h-[50vh] shadow-card"
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-gradient-gold">Account Overview</h2>
                  
                  {/* Summary Cards Grid */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div onClick={() => setActiveTab("orders")} className="glass rounded-2xl p-5 hover:bg-white/5 border border-white/5 cursor-pointer transition flex flex-col gap-2">
                      <Package className="w-6 h-6 text-gold" />
                      <div className="text-3xl font-bold mt-1">{orders.length}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Orders</div>
                    </div>

                    <div onClick={() => setActiveTab("wishlist")} className="glass rounded-2xl p-5 hover:bg-white/5 border border-white/5 cursor-pointer transition flex flex-col gap-2">
                      <Heart className="w-6 h-6 text-gold" />
                      <div className="text-3xl font-bold mt-1">{wishlist.length}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Wishlist Items</div>
                    </div>

                    <div onClick={() => setActiveTab("cart")} className="glass rounded-2xl p-5 hover:bg-white/5 border border-white/5 cursor-pointer transition flex flex-col gap-2">
                      <ShoppingBag className="w-6 h-6 text-gold" />
                      <div className="text-3xl font-bold mt-1">{cart.length}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cart Items</div>
                    </div>
                  </div>

                  {/* Secondary Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Pending Actions</h3>
                      <div className="text-sm space-y-2 text-muted-foreground leading-relaxed">
                        {cart.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0"></span>
                            <span>You have {cart.length} item(s) in your cart. <button onClick={() => setActiveTab("cart")} className="text-gold hover:underline font-semibold">Checkout now</button></span>
                          </div>
                        ) : (
                          <div>Your shopping bag is currently empty.</div>
                        )}
                        {addresses.length === 0 && (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0"></span>
                            <span>Add a shipping address to speed up checkout. <button onClick={() => setActiveTab("addresses")} className="text-gold hover:underline font-semibold">Add Address</button></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Latest Notification</h3>
                      {notifications.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">{notifications[0].title}</p>
                          <p className="text-xs text-muted-foreground truncate">{notifications[0].message}</p>
                          <button onClick={() => setActiveTab("notifications")} className="text-xs text-gold hover:underline font-semibold pt-1 block">View all notifications</button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No recent notifications.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-gradient-gold">My Profile</h2>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted-foreground font-semibold px-2">Full Name</label>
                        <input 
                          required 
                          value={profileName} 
                          onChange={(e) => setProfileName(e.target.value)} 
                          className="glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold text-sm" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted-foreground font-semibold px-2">Phone Number</label>
                        <input 
                          value={profilePhone} 
                          onChange={(e) => setProfilePhone(e.target.value)} 
                          placeholder="+1 (555) 0199" 
                          className="glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold text-sm" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground font-semibold px-2">Email Address (Read Only)</label>
                      <input 
                        disabled 
                        value={profile.email || ""} 
                        className="glass rounded-full px-4 py-3 text-sm opacity-50 cursor-not-allowed" 
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-6">
                      <h3 className="text-sm font-semibold text-gold mb-3">Change Password</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-muted-foreground font-semibold px-2">New Password</label>
                          <input 
                            type="password" 
                            value={profilePass} 
                            onChange={(e) => setProfilePass(e.target.value)} 
                            placeholder="••••••••" 
                            className="glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold text-sm" 
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-muted-foreground font-semibold px-2">Confirm Password</label>
                          <input 
                            type="password" 
                            value={profileConfirmPass} 
                            onChange={(e) => setProfileConfirmPass(e.target.value)} 
                            placeholder="••••••••" 
                            className="glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold text-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-glow hover:opacity-90 transition disabled:opacity-50 mt-4 cursor-pointer"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-gradient-gold">My Orders</h2>
                  
                  {isOrdersLoading ? (
                    <div className="space-y-3">
                      <div className="h-16 w-full glass rounded-xl animate-pulse"></div>
                      <div className="h-16 w-full glass rounded-xl animate-pulse"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">You haven't placed any orders yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(o => (
                        <div key={o.id} className="glass rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold font-display">Order #{o.id.slice(-8).toUpperCase()}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                o.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                                o.status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                                o.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                                "bg-gold/10 text-gold"
                              }`}>
                                {o.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Placed on {new Date(o.created_at).toLocaleDateString()} &middot; {o.items?.length || 0} item(s)
                            </p>
                            
                            {/* Short item preview */}
                            <div className="flex gap-2 pt-2 flex-wrap">
                              {o.items?.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="w-10 h-10 rounded-lg overflow-hidden border border-white/5 bg-muted/60 shrink-0 flex items-center justify-center" title={item.name}>
                                  <Package className="w-4 h-4 text-muted-foreground" />
                                </div>
                              ))}
                              {(o.items?.length ?? 0) > 4 && (
                                <div className="w-10 h-10 rounded-lg border border-white/5 bg-muted/60 flex items-center justify-center shrink-0">
                                  <span className="text-[10px] font-bold text-muted-foreground">+{o.items.length - 4}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:border-l border-white/5 md:pl-4">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Total Price</p>
                              <p className="text-lg font-bold font-display text-gradient-gold">{fmt(Number(o.total))}</p>
                            </div>
                            <Link 
                              to={`/orders/${o.id}`}
                              className="px-4 py-2 bg-gradient-gold text-primary-foreground rounded-full text-xs font-semibold shadow-glow hover:opacity-90 transition whitespace-nowrap"
                            >
                              View Order
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: WISHLIST */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-gradient-gold">My Wishlist</h2>
                  
                  {isWishlistLoading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="h-40 glass rounded-xl animate-pulse"></div>
                      <div className="h-40 glass rounded-xl animate-pulse"></div>
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">Your wishlist is empty. Add products to save them here.</div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map(p => (
                        <div key={p.id} className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-gold/20 transition flex flex-col justify-between h-full">
                          <Link to={`/product/${p.slug}`}>
                            <div className="aspect-square bg-muted relative overflow-hidden">
                              <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                            </div>
                          </Link>
                          <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <Link to={`/product/${p.slug}`} className="font-semibold truncate hover:text-gold block">{p.name}</Link>
                              <div className="text-sm font-display font-semibold mt-1">{fmt(p.price)}</div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={async () => {
                                  // Add to cart from query mutations
                                  const res = await fetch("/api/cart", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${localStorage.getItem("token")}`
                                    },
                                    body: JSON.stringify({ product_id: p.id, quantity: 1 })
                                  });
                                  if (res.ok) {
                                    toast.success("Moved to cart!");
                                    refetchCart();
                                    toggleWishlistMutation.mutate(p.id);
                                  } else {
                                    toast.error("Failed to add to cart");
                                  }
                                }}
                                className="flex-1 bg-gradient-gold text-primary-foreground py-2 rounded-full text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                              >
                                Move to Cart
                              </button>
                              <button 
                                onClick={() => toggleWishlistMutation.mutate(p.id)}
                                className="p-2 glass text-destructive hover:bg-destructive/10 rounded-full transition cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: CART */}
              {activeTab === "cart" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-gradient-gold">Shopping Bag</h2>
                  
                  {isCartLoading ? (
                    <div className="space-y-3">
                      <div className="h-16 w-full glass rounded-xl animate-pulse"></div>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">Your shopping cart is currently empty.</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {cart.map(item => (
                          <div key={item._id} className="glass rounded-2xl p-4 border border-white/5 flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-white/5 shrink-0">
                              <img src={item.product_id?.images?.[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/product/${item.product_id?.slug}`} className="font-semibold truncate hover:text-gold block">{item.product_id?.name}</Link>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.selected_size && `Size: ${item.selected_size}`}
                                {item.selected_size && item.selected_color && " \xB7 "}
                                {item.selected_color && `Color: ${item.selected_color}`}
                              </p>
                              <div className="font-display font-semibold mt-1">{fmt(item.product_id?.price)}</div>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateCartQtyMutation.mutate({ itemId: item._id, quantity: Math.max(1, item.quantity - 1) })}
                                className="w-7 h-7 rounded-full glass hover:bg-white/10 flex items-center justify-center font-bold text-sm cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQtyMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })}
                                className="w-7 h-7 rounded-full glass hover:bg-white/10 flex items-center justify-center font-bold text-sm cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button 
                              onClick={() => removeFromCartMutation.mutate(item._id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Summary & Checkout */}
                      <div className="glass rounded-2xl p-6 border border-white/5 max-w-sm ml-auto space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-semibold font-display">
                            {fmt(cart.reduce((total, item) => total + (item.product_id?.price * item.quantity || 0), 0))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total</span>
                          <span className="text-gradient-gold">
                            {fmt(cart.reduce((total, item) => total + (item.product_id?.price * item.quantity || 0), 0))}
                          </span>
                        </div>
                        <Link 
                          to="/checkout"
                          className="block text-center bg-gradient-gold text-primary-foreground py-3 rounded-full font-semibold shadow-glow hover:opacity-90 transition"
                        >
                          Proceed to Checkout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SAVED ADDRESSES */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-display text-gradient-gold">Saved Addresses</h2>
                    <button 
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-glow hover:opacity-90 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Address</span>
                    </button>
                  </div>
                  
                  {isAddressesLoading ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="h-32 glass rounded-xl animate-pulse"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No saved addresses found. Add an address to speed up checkout.</div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="glass rounded-2xl p-5 border border-white/5 space-y-3 relative group">
                          {addr.is_default && (
                            <span className="absolute top-4 right-4 px-2 py-0.5 bg-gradient-gold text-primary-foreground text-[8px] font-bold rounded">DEFAULT</span>
                          )}
                          <div>
                            <p className="font-semibold text-base">{addr.name}</p>
                            {addr.phone && <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>}
                          </div>
                          
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            <p>{addr.line1}</p>
                            <p>{addr.city}, {addr.state && `${addr.state}, `}{addr.country}</p>
                            <p>Postal Code: {addr.zip}</p>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-white/5 mt-2">
                            <button 
                              onClick={() => handleOpenEditAddress(addr)}
                              className="inline-flex items-center gap-1 text-xs text-gold hover:underline font-semibold cursor-pointer"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => deleteAddressMutation.mutate(addr.id)}
                              className="inline-flex items-center gap-1 text-xs text-destructive hover:underline font-semibold cursor-pointer ml-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-gradient-gold">Notifications</h2>
                  
                  {isNotificationsLoading ? (
                    <div className="space-y-3">
                      <div className="h-12 w-full glass rounded-xl animate-pulse"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">You don't have any notifications yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => { if (!n.read) readNotificationMutation.mutate(n.id); }}
                          className={`glass rounded-2xl p-4 border border-white/5 flex gap-4 items-start transition ${
                            n.read ? "opacity-60" : "hover:border-gold/20 cursor-pointer"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.read ? "bg-white/10" : "bg-gold shadow-[0_0_10px_#d4af37]"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{n.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteNotificationMutation.mutate(n.id); }}
                            className="p-1 text-muted-foreground hover:text-destructive rounded transition cursor-pointer"
                            title="Delete notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: SUPPORT TICKETS */}
              {activeTab === "support" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-display text-gradient-gold">Support Desk</h2>
                    <button 
                      onClick={() => setIsCreateTicketOpen(true)}
                      className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-glow hover:opacity-90 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Open Ticket</span>
                    </button>
                  </div>
                  
                  {isTicketsLoading ? (
                    <div className="space-y-3">
                      <div className="h-16 w-full glass rounded-xl animate-pulse"></div>
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No support tickets found. Click Open Ticket to create one.</div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {tickets.map(t => (
                        <div key={t.id} className="glass rounded-2xl p-5 border border-white/5 space-y-4 hover:border-gold/25 transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-base truncate max-w-[180px]">{t.subject}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Category: {t.category}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              t.status === "open" ? "bg-gold/10 text-gold" :
                              t.status === "replied" ? "bg-indigo-500/10 text-indigo-400" :
                              "bg-white/10 text-muted-foreground"
                            }`}>
                              {t.status}
                            </span>
                          </div>

                          <div className="bg-black/15 rounded-xl p-3 text-xs text-muted-foreground max-h-16 overflow-hidden line-clamp-2 leading-relaxed">
                            {t.message}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <span className="text-[10px] text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</span>
                            <button 
                              onClick={() => setSelectedTicket(t)}
                              className="inline-flex items-center gap-1 text-xs text-gold hover:underline font-semibold cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Conversation ({t.replies?.length || 0})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: SETTINGS */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-gradient-gold">Account Settings</h2>
                  
                  {/* Email Settings */}
                  <div className="glass rounded-2xl p-5 border border-white/5 space-y-4 max-w-md">
                    <h3 className="text-base font-bold text-gold">Email Notification Preferences</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold">Enable Promotions</p>
                          <p className="text-xs text-muted-foreground">Receive custom discount offers and newsletters</p>
                        </div>
                        <input type="checkbox" defaultChecked className="accent-gold w-4 h-4 cursor-pointer" />
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-3">
                        <div>
                          <p className="text-sm font-semibold">Order Tracking Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive updates regarding your shipment statuses</p>
                        </div>
                        <input type="checkbox" defaultChecked disabled className="accent-gold w-4 h-4 opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="glass rounded-2xl p-5 border border-red-500/10 bg-red-500/5 space-y-4 max-w-md">
                    <div className="flex items-center gap-2 text-destructive">
                      <ShieldAlert className="w-5 h-5" />
                      <h3 className="text-base font-bold">Danger Zone</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Permanently delete your NexStore account. This will completely delete your purchase history, addresses, shopping bag, wishlist, and all customer profile logs. This action cannot be undone.
                    </p>
                    <button 
                      onClick={() => setIsDeleteConfirmOpen(true)}
                      className="px-5 py-2.5 bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white rounded-full text-xs font-semibold transition cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* MODAL: CREATE SUPPORT TICKET */}
      <AnimatePresence>
        {isCreateTicketOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-md w-full rounded-3xl p-6 relative border border-white/10 flex flex-col gap-4 shadow-card"
            >
              <button 
                onClick={() => setIsCreateTicketOpen(false)} 
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold font-display text-gradient-gold">Open Support Ticket</h2>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  createTicketMutation.mutate(newTicket);
                }} 
                className="space-y-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-semibold px-2">Subject *</label>
                  <input 
                    required 
                    value={newTicket.subject} 
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} 
                    placeholder="e.g. Missing order shipment" 
                    className="glass rounded-full px-4 py-2.5 outline-none focus:ring-2 ring-gold text-sm" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-semibold px-2">Category *</label>
                  <select 
                    value={newTicket.category} 
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="glass rounded-full px-4 py-2.5 text-sm"
                  >
                    <option value="Order" className="bg-card">Order Issue</option>
                    <option value="Payment" className="bg-card">Payment Issue</option>
                    <option value="Tech Support" className="bg-card">Tech Support</option>
                    <option value="Other" className="bg-card">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-semibold px-2">Your Message *</label>
                  <textarea 
                    required 
                    rows={4}
                    value={newTicket.message} 
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} 
                    placeholder="Provide details about your query..." 
                    className="glass rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-gold text-sm min-h-24" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={createTicketMutation.isPending}
                  className="w-full bg-gradient-gold text-primary-foreground py-2.5 rounded-full font-semibold shadow-glow hover:opacity-90 transition disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {createTicketMutation.isPending ? "Submitting..." : "Submit Ticket"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CHAT CONVERSATION DETAIL */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-xl w-full rounded-3xl p-6 relative border border-white/10 flex flex-col gap-4 shadow-card max-h-[85vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-white/5 pb-2">
                <span className="text-xs uppercase tracking-wider text-gold font-bold">Ticket Discussion</span>
                <h2 className="text-xl font-bold font-display mt-0.5">{selectedTicket.subject}</h2>
                <div className="flex gap-2 items-center mt-1 text-xs text-muted-foreground">
                  <span>Category: {selectedTicket.category}</span>
                  <span>&bull;</span>
                  <span className="capitalize">Status: {selectedTicket.status}</span>
                </div>
              </div>

              {/* Chat Logs */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto py-2 pr-1 flex flex-col gap-1 hide-scrollbar">
                
                {/* Initial Ticket Message */}
                <div className="bg-white/5 rounded-2xl p-4 max-w-[85%] self-start border border-white/5">
                  <p className="text-xs font-semibold text-gold mb-1">You (Original Query)</p>
                  <p className="text-sm leading-relaxed">{selectedTicket.message}</p>
                  <span className="text-[9px] text-muted-foreground block mt-1.5">{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Reply Threads */}
                {selectedTicket.replies?.map((rep, idx) => {
                  const isAdmin = rep.sender === "admin";
                  return (
                    <div 
                      key={idx} 
                      className={`rounded-2xl p-4 max-w-[85%] border ${
                        isAdmin 
                          ? "bg-gold/15 text-foreground self-end border-gold/10 ml-auto" 
                          : "bg-white/5 text-foreground self-start border-white/5"
                      }`}
                    >
                      <p className={`text-xs font-semibold mb-1 ${isAdmin ? "text-gold" : "text-gold"}`}>
                        {isAdmin ? "NexStore Helpdesk" : "You"}
                      </p>
                      <p className="text-sm leading-relaxed">{rep.message}</p>
                      <span className="text-[9px] text-muted-foreground block mt-1.5">
                        {rep.createdAt ? new Date(rep.createdAt).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  replyTicketMutation.mutate({ id: selectedTicket.id, message: ticketReplyText });
                }}
                className="grid grid-cols-[1fr_auto] gap-2 pt-2 border-t border-white/5 items-center"
              >
                <input 
                  required
                  value={ticketReplyText} 
                  onChange={(e) => setTicketReplyText(e.target.value)} 
                  placeholder="Type your response message..." 
                  className="glass rounded-full px-4 py-2.5 outline-none focus:ring-2 ring-gold text-sm" 
                />
                <button 
                  type="submit"
                  disabled={replyTicketMutation.isPending}
                  className="px-5 py-2.5 bg-gradient-gold text-primary-foreground font-semibold rounded-full text-xs shadow-glow hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
                >
                  {replyTicketMutation.isPending ? "Sending..." : "Reply"}
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT ADDRESS */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-md w-full rounded-3xl p-6 relative border border-white/10 flex flex-col gap-4 shadow-card"
            >
              <button 
                onClick={() => setIsAddressModalOpen(false)} 
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold font-display text-gradient-gold">
                {editingAddress ? "Edit Address" : "Add Address"}
              </h2>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-semibold px-2">Full Name *</label>
                    <input 
                      required 
                      value={addressForm.name} 
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} 
                      placeholder="Jane Doe" 
                      className="glass rounded-full px-4 py-2 outline-none focus:ring-2 ring-gold text-xs" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-semibold px-2">Phone *</label>
                    <input 
                      required 
                      value={addressForm.phone} 
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} 
                      placeholder="+1 (555) 0122" 
                      className="glass rounded-full px-4 py-2 outline-none focus:ring-2 ring-gold text-xs" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-semibold px-2">Street Address *</label>
                  <input 
                    required 
                    value={addressForm.line1} 
                    onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} 
                    placeholder="123 Main St, Apt 4B" 
                    className="glass rounded-full px-4 py-2 outline-none focus:ring-2 ring-gold text-xs" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-semibold px-2">City *</label>
                    <input 
                      required 
                      value={addressForm.city} 
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} 
                      placeholder="New York" 
                      className="glass rounded-full px-4 py-2" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-semibold px-2">State / Province</label>
                    <input 
                      value={addressForm.state} 
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} 
                      placeholder="NY" 
                      className="glass rounded-full px-4 py-2" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-semibold px-2">Country *</label>
                    <input 
                      required 
                      value={addressForm.country} 
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} 
                      placeholder="United States" 
                      className="glass rounded-full px-4 py-2" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground font-semibold px-2">Postal Code *</label>
                    <input 
                      required 
                      value={addressForm.zip} 
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })} 
                      placeholder="10001" 
                      className="glass rounded-full px-4 py-2" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input 
                    type="checkbox" 
                    id="is_default"
                    checked={addressForm.is_default} 
                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })} 
                    className="accent-gold w-4 h-4 cursor-pointer" 
                  />
                  <label htmlFor="is_default" className="text-xs text-muted-foreground font-semibold cursor-pointer">Set as default shipping address</label>
                </div>

                <button 
                  type="submit" 
                  disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                  className="w-full bg-gradient-gold text-primary-foreground py-2.5 rounded-full font-semibold shadow-glow hover:opacity-90 transition disabled:opacity-50 mt-2 cursor-pointer text-sm"
                >
                  {addAddressMutation.isPending || updateAddressMutation.isPending ? "Saving..." : "Save Address"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DIALOG: DELETE ACCOUNT */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-sm w-full rounded-3xl p-6 border border-red-500/20 bg-red-950/20 text-center space-y-4 shadow-card"
            >
              <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
              <h2 className="text-xl font-bold font-display text-destructive">Confirm Delete Account</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you absolutely sure you want to delete your account? All order archives, addresses, and saved wishlists will be immediately wiped. This cannot be undone.
              </p>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-full glass hover:bg-white/10 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    deleteAccountMutation.mutate();
                  }}
                  disabled={deleteAccountMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-full bg-destructive text-white font-semibold text-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {deleteAccountMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}