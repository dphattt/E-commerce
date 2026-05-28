import { z } from "zod";

export const addItemBodySchema = z.object({
  sku: z.string().trim().min(1, "sku is required"),
  quantity: z.number().int().min(1).default(1),
});

export const updateItemBodySchema = z.object({
  quantity: z.number().int().min(1),
});

export const itemParamsSchema = z.object({
  sku: z.string().trim().min(1),
});

export type AddItemBody = z.infer<typeof addItemBodySchema>;
export type UpdateItemBody = z.infer<typeof updateItemBodySchema>;
export type ItemParams = z.infer<typeof itemParamsSchema>;
