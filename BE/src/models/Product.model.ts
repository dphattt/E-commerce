import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  category: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "products" },
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
