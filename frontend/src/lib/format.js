export const fmt = (n) =>
new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const finalPrice = (price, discount) =>
Math.round(price * (1 - discount / 100));