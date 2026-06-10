import { z } from "zod";

const objectIdSchema = z.object({
  id: z.string().trim().min(1),
});

const optionalBooleanQuery = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

export const adminIdParamsSchema = objectIdSchema;

export const adminListUsersQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: z.enum(["user", "admin", "boss"]).optional(),
  status: z.enum(["active", "blocked"]).optional(),
  emailVerified: optionalBooleanQuery,
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  skip: z.coerce.number().int().nonnegative().optional().default(0),
});

export const adminUpdateUserBodySchema = z
  .object({
    name: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(32).optional(),
    role: z.enum(["user", "admin", "boss"]).optional(),
    status: z.enum(["active", "blocked"]).optional(),
    emailVerified: z.boolean().optional(),
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });

const priceSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().trim().min(1).max(8).toUpperCase(),
});

export const adminListProductsQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  skip: z.coerce.number().int().nonnegative().optional().default(0),
});

export const adminCreateProductBodySchema = z.object({
  sourceUrl: z.string().trim().url(),
  title: z.string().trim().min(1).max(240),
  price: priceSchema,
  imageUrls: z.array(z.string().trim().url()).optional().default([]),
  localImagePaths: z.array(z.string().trim()).optional().default([]),
  categories: z.array(z.string().trim().min(1)).optional().default([]),
  scrapedAt: z.coerce.date().optional().default(() => new Date()),
});

export const adminUpdateProductBodySchema = adminCreateProductBodySchema
  .partial()
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });

export const adminCreateVariantBodySchema = z.object({
  sku: z.string().trim().min(1).max(120),
  productSourceUrl: z.string().trim().url().optional(),
  color: z.string().trim().max(80).optional().default(""),
  size: z.string().trim().max(80).optional().default(""),
  price: priceSchema,
  isActive: z.boolean().optional().default(true),
});

export const adminUpdateVariantBodySchema = adminCreateVariantBodySchema
  .omit({ productSourceUrl: true })
  .partial()
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });

export type AdminListUsersQuery = z.infer<typeof adminListUsersQuerySchema>;
export type AdminUpdateUserBody = z.infer<typeof adminUpdateUserBodySchema>;
export type AdminListProductsQuery = z.infer<typeof adminListProductsQuerySchema>;
export type AdminCreateProductBody = z.infer<typeof adminCreateProductBodySchema>;
export type AdminUpdateProductBody = z.infer<typeof adminUpdateProductBodySchema>;
export type AdminCreateVariantBody = z.infer<typeof adminCreateVariantBodySchema>;
export type AdminUpdateVariantBody = z.infer<typeof adminUpdateVariantBodySchema>;
