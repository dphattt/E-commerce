import type { OrderStatus } from "@/features/orders/api/orders.api";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function orderStatusClassName(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "shipping":
      return "bg-sky-100 text-sky-800";
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-zinc-200 text-zinc-600";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}
