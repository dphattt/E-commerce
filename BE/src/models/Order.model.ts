import mongoose, { Document, Schema, Types } from "mongoose";

type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

interface IOrder extends Document {
  userId: Types.ObjectId;
  status: OrderStatus;
  total: number;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    total: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: "orders" },
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
