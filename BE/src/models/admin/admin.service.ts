import { isValidObjectId } from "mongoose";
import User, { type UserRole } from "@/models/users/User.model";
import Product from "@/models/products/Product.model";
import ProductVariant from "@/models/products/ProductVariant.model";
import { httpError } from "@/utils/http-error";
import type {
  AdminCreateProductBody,
  AdminCreateVariantBody,
  AdminListProductsQuery,
  AdminListUsersQuery,
  AdminUpdateProductBody,
  AdminUpdateUserBody,
  AdminUpdateVariantBody,
} from "@/models/admin/admin.validation";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertObjectId(id: string) {
  if (!isValidObjectId(id)) {
    throw httpError("Invalid id", 400);
  }
}

export async function listUsers(queryParams: AdminListUsersQuery) {
  const { search, role, status, emailVerified, limit, skip } = queryParams;
  const query: Record<string, unknown> = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [{ email: regex }, { name: regex }, { phone: regex }];
  }
  if (role) query.role = role;
  if (status) query.status = status;
  if (typeof emailVerified === "boolean") query.emailVerified = emailVerified;

  const [users, total] = await Promise.all([
    User.find(query)
      .select(
        "email name phone role status emailVerified authProvider createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return { users, total, limit, skip };
}

export async function getUser(id: string) {
  assertObjectId(id);

  const user = await User.findById(id)
    .select(
      "email name phone role status emailVerified authProvider createdAt updatedAt",
    )
    .lean();
  if (!user) throw httpError("User not found", 404);

  return user;
}

export async function updateUser(
  id: string,
  body: AdminUpdateUserBody,
  currentUserId?: string,
  currentUserRole?: UserRole,
) {
  assertObjectId(id);

  const targetUser = await User.findById(id).select("role").lean();
  if (!targetUser) throw httpError("User not found", 404);

  if (currentUserRole !== "boss") {
    const onlyUpdatesRole =
      Object.keys(body).length === 1 &&
      typeof body.role === "string" &&
      body.role !== "boss";

    if (!onlyUpdatesRole || targetUser.role === "boss") {
      throw httpError("Boss access required", 403);
    }
  }

  if (id === currentUserId && body.role && body.role !== currentUserRole) {
    throw httpError("You cannot change your own role", 400);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true },
  )
    .select(
      "email name phone role status emailVerified authProvider createdAt updatedAt",
    )
    .lean();
  if (!user) throw httpError("User not found", 404);

  return user;
}

export async function deleteUser(id: string, currentUserId?: string) {
  assertObjectId(id);

  if (id === currentUserId) {
    throw httpError("You cannot delete your own account", 400);
  }

  const user = await User.findByIdAndDelete(id).lean();
  if (!user) throw httpError("User not found", 404);
}

export async function listProducts(queryParams: AdminListProductsQuery) {
  const { search, category, limit, skip } = queryParams;
  const query: Record<string, unknown> = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [{ title: regex }, { sourceUrl: regex }];
  }
  if (category) {
    query.categories = new RegExp(`^${escapeRegex(category)}$`, "i");
  }

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return { products, total, limit, skip };
}

export async function getProduct(id: string) {
  assertObjectId(id);

  const product = await Product.findById(id).lean();
  if (!product) throw httpError("Product not found", 404);

  const variants = await ProductVariant.find({
    productSourceUrl: product.sourceUrl,
  }).lean();

  return { ...product, variants };
}

export async function createProduct(body: AdminCreateProductBody) {
  return Product.create(body);
}

export async function updateProduct(id: string, body: AdminUpdateProductBody) {
  assertObjectId(id);

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true },
  ).lean();
  if (!product) throw httpError("Product not found", 404);

  return product;
}

export async function deleteProduct(id: string) {
  assertObjectId(id);

  const product = await Product.findByIdAndDelete(id);
  if (!product) throw httpError("Product not found", 404);

  await ProductVariant.deleteMany({
    productSourceUrl: product.sourceUrl,
  });
}

export async function createProductVariant(
  productId: string,
  body: AdminCreateVariantBody,
) {
  assertObjectId(productId);

  const product = await Product.findById(productId).select("sourceUrl").lean();
  if (!product) throw httpError("Product not found", 404);

  return ProductVariant.create({
    ...body,
    productSourceUrl: body.productSourceUrl ?? product.sourceUrl,
  });
}

export async function updateProductVariant(
  id: string,
  body: AdminUpdateVariantBody,
) {
  assertObjectId(id);

  const variant = await ProductVariant.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true },
  ).lean();
  if (!variant) throw httpError("Variant not found", 404);

  return variant;
}

export async function deleteProductVariant(id: string) {
  assertObjectId(id);

  const variant = await ProductVariant.findByIdAndDelete(id).lean();
  if (!variant) throw httpError("Variant not found", 404);
}
