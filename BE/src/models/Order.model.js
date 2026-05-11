const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    total: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: "orders" },
);

module.exports = mongoose.model("Order", orderSchema);
