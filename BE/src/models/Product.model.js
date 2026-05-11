const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "products" },
);

module.exports = mongoose.model("Product", productSchema);
