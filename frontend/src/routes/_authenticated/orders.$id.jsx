import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  User,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useOrder } from "@/lib/queries";
import { fmt } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  component: OrderDetails,
});

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

const STATUS_COLOR = {
  pending:    "bg-gold/10 text-gold border border-gold/20",
  processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  shipped:    "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  delivered:  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled:  "bg-red-500/10 text-red-400 border border-red-500/20",
};

function OrderDetails() {
  const { id } = Route.useParams();
  const { data: order, isLoading, error } = useOrder(id);

  /* ─── LOADING STATE ─── */
  if (isLoading) {
    return (
      <main className="pt-32 pb-16 text-center max-w-xl mx-auto px-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm font-semibold">Loading order details…</p>
      </main>
    );
  }

  /* ─── ERROR / NOT FOUND STATE ─── */
  if (error || !order) {
    return (
      <main className="pt-32 pb-16 text-center max-w-md mx-auto px-4 space-y-5">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold font-display">Order Not Found</h1>
        <p className="text-muted-foreground text-sm">
          {error?.message === "Failed to fetch order details"
            ? "This order could not be found or you are not authorized to view it."
            : error?.message || "The order you are looking for does not exist."}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-gold text-primary-foreground rounded-full text-xs font-semibold shadow-glow hover:opacity-90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </main>
    );
  }

  /* ─── DATA HELPERS ─── */
  const formattedDate = new Date(order.created_at || order.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const status = order.status?.toLowerCase() || "pending";
  const currentStatusIndex = STATUS_STEPS.indexOf(status) !== -1
    ? STATUS_STEPS.indexOf(status)
    : 0;

  const isCancelled = status === "cancelled";

  /* User info: populated user_id or fallback strings */
  const customerName  = order.user_id?.display_name || order.shipping_address?.name || "—";
  const customerEmail = order.user_id?.email || "—";
  const customerPhone = order.user_id?.phone || "—";

  /* Order ID display */
  const displayId = (order.id || order._id || "").toString().slice(-8).toUpperCase();
  const fullId    = (order.id || order._id || "").toString();

  /* Item subtotal recalculated */
  const itemSubtotal = order.items?.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  ) ?? Number(order.total);

  return (
    <main className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-semibold tracking-wide uppercase mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold font-display text-gradient-gold">Order Details</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Order ID:{" "}
            <span className="font-mono text-gold font-semibold uppercase">#{displayId}</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5 opacity-60">{fullId}</p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          {/* Status Badge */}
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLOR[status] || STATUS_COLOR.pending}`}>
            {status}
          </span>
          {/* Date */}
          <div className="glass px-4 py-2.5 rounded-2xl border border-white/5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold" />
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-semibold">Placed On</p>
              <p className="text-xs font-semibold">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── LEFT / CENTER COLUMN ── */}
        <div className="md:col-span-2 space-y-6">

          {/* DELIVERY PROGRESS (hide if cancelled) */}
          {!isCancelled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 border border-white/5 space-y-6"
            >
              <h2 className="text-lg font-bold font-display text-gold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Delivery Progress
              </h2>

              <div className="relative flex justify-between items-center max-w-sm mx-auto pt-2">
                {/* Track background */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 z-0" />
                {/* Track fill */}
                <div
                  className="absolute top-4 left-0 h-0.5 bg-gradient-gold z-0 transition-all duration-700"
                  style={{
                    width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
                {STATUS_STEPS.map((step, idx) => {
                  const isActive  = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={step} className="flex flex-col items-center z-10 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive
                            ? "bg-black border-gold text-gold shadow-[0_0_10px_#d4af3766]"
                            : "bg-neutral-900 border-white/10 text-muted-foreground"
                        }`}
                      >
                        {isActive && !isCurrent ? (
                          <CheckCircle2 className="w-4 h-4 fill-gold text-black" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider mt-2 transition ${
                          isCurrent
                            ? "text-gold font-extrabold"
                            : isActive
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CANCELLED banner */}
          {isCancelled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 border border-red-500/20 bg-red-500/5 flex items-center gap-4"
            >
              <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
              <div>
                <p className="font-bold text-destructive">Order Cancelled</p>
                <p className="text-xs text-muted-foreground mt-0.5">This order has been cancelled and will not be fulfilled.</p>
              </div>
            </motion.div>
          )}

          {/* ORDER ITEMS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6 border border-white/5 space-y-4"
          >
            <h2 className="text-lg font-bold font-display text-gold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Items Ordered ({order.items?.length ?? 0})
            </h2>

            <div className="divide-y divide-white/5">
              {order.items?.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">No items found in this order.</p>
              )}
              {order.items?.map((item, index) => {
                /* product_id is populated by backend — may be an object or raw id */
                const prod = typeof item.product_id === "object" ? item.product_id : null;
                const imgSrc =
                  prod?.images?.[0] ||
                  item.image ||
                  null;
                const productSlug = prod?.slug || null;
                const itemTotal = Number(item.price) * Number(item.quantity);

                return (
                  <div key={item._id || index} className="py-4 flex gap-4 items-center first:pt-0 last:pb-0">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted border border-white/5 shrink-0 flex items-center justify-center">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      {productSlug ? (
                        <Link
                          to={`/product/${productSlug}`}
                          className="font-semibold text-sm truncate hover:text-gold block transition"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>
                          Qty: <strong className="text-foreground">{item.quantity}</strong>
                        </span>
                        {item.size && (
                          <span>
                            Size: <strong className="text-foreground">{item.size}</strong>
                          </span>
                        )}
                        {item.color && (
                          <span>
                            Color: <strong className="text-foreground">{item.color}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold font-display">{fmt(Number(item.price))}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Subtotal: <span className="text-foreground font-semibold">{fmt(itemTotal)}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CUSTOMER INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-3xl p-6 border border-white/5 space-y-4"
          >
            <h2 className="text-lg font-bold font-display text-gold flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                  <User className="w-3 h-3" /> Name
                </p>
                <p className="text-sm font-semibold">{customerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <p className="text-sm font-semibold break-all">{customerEmail}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </p>
                <p className="text-sm font-semibold">{customerPhone}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6">

          {/* SHIPPING ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 border border-white/5 space-y-4"
          >
            <h2 className="text-lg font-bold font-display text-gold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>

            {order.shipping_address ? (
              <div className="space-y-1.5 text-sm">
                <p className="font-semibold text-base">{order.shipping_address.name}</p>
                <p className="text-muted-foreground">{order.shipping_address.line1}</p>
                <p className="text-muted-foreground">
                  {[
                    order.shipping_address.city,
                    order.shipping_address.state,
                    order.shipping_address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {order.shipping_address.zip && (
                  <p className="text-muted-foreground">
                    Postal Code:{" "}
                    <span className="text-foreground font-semibold font-mono">
                      {order.shipping_address.zip}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No shipping address recorded.</p>
            )}
          </motion.div>

          {/* BILLING SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-3xl p-6 border border-white/5 space-y-4 shadow-glow"
          >
            <h2 className="text-lg font-bold font-display text-gold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Billing Summary
            </h2>

            <div className="space-y-3 text-sm">
              {/* Payment Status */}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Payment Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Paid (Demo)
                </span>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-2">
                {/* Item Subtotal */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    Items Subtotal{" "}
                    <span className="text-[10px]">({order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""})</span>
                  </span>
                  <span className="text-foreground font-semibold">{fmt(itemSubtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Shipping Fees</span>
                  <span className="text-emerald-400 font-semibold uppercase text-[10px]">Free</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Tax</span>
                  <span className="text-foreground font-semibold">Included</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center font-bold text-base border-t border-white/5 pt-3">
                <span>Total Charge</span>
                <span className="text-gradient-gold font-display text-lg">{fmt(Number(order.total))}</span>
              </div>
            </div>
          </motion.div>

          {/* ORDER ID CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-5 border border-white/5 space-y-2"
          >
            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Order Reference</p>
            <p className="font-mono text-gold font-bold text-lg tracking-wider">#{displayId}</p>
            <p className="font-mono text-[9px] text-muted-foreground break-all opacity-50">{fullId}</p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
