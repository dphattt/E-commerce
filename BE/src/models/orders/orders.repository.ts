import Order from "@/models/orders/Order.model";

export async function findOrdersByEmail(email: string) {
  return Order.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
}

export async function findOrderByCodeForEmail(
  orderCode: string,
  email: string,
) {
  return Order.findOne({
    orderCode: orderCode.toUpperCase(),
    userEmail: email,
  }).lean();
}

export async function createOrder(data: Record<string, unknown>) {
  return Order.create(data);
}
