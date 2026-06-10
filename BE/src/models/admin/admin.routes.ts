import { Router } from "express";
import {
  requireAdmin,
  requireAuth,
  requireBoss,
} from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import * as adminController from "@/models/admin/admin.controller";
import {
  adminCreateProductBodySchema,
  adminCreateVariantBodySchema,
  adminIdParamsSchema,
  adminListProductsQuerySchema,
  adminListUsersQuerySchema,
  adminUpdateProductBodySchema,
  adminUpdateUserBodySchema,
  adminUpdateVariantBodySchema,
} from "@/models/admin/admin.validation";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get(
  "/users",
  validate(adminListUsersQuerySchema, "query"),
  adminController.listUsers,
);
router.get(
  "/users/:id",
  validate(adminIdParamsSchema, "params"),
  adminController.getUser,
);
router.patch(
  "/users/:id",
  validate(adminIdParamsSchema, "params"),
  validate(adminUpdateUserBodySchema),
  adminController.updateUser,
);
router.delete(
  "/users/:id",
  requireBoss,
  validate(adminIdParamsSchema, "params"),
  adminController.deleteUser,
);

router.get(
  "/products",
  requireBoss,
  validate(adminListProductsQuerySchema, "query"),
  adminController.listProducts,
);
router.post(
  "/products",
  requireBoss,
  validate(adminCreateProductBodySchema),
  adminController.createProduct,
);
router.get(
  "/products/:id",
  requireBoss,
  validate(adminIdParamsSchema, "params"),
  adminController.getProduct,
);
router.patch(
  "/products/:id",
  requireBoss,
  validate(adminIdParamsSchema, "params"),
  validate(adminUpdateProductBodySchema),
  adminController.updateProduct,
);
router.delete(
  "/products/:id",
  requireBoss,
  validate(adminIdParamsSchema, "params"),
  adminController.deleteProduct,
);
router.post(
  "/products/:id/variants",
  requireBoss,
  validate(adminIdParamsSchema, "params"),
  validate(adminCreateVariantBodySchema),
  adminController.createProductVariant,
);
router.patch(
  "/product-variants/:id",
  requireBoss,
  validate(adminIdParamsSchema, "params"),
  validate(adminUpdateVariantBodySchema),
  adminController.updateProductVariant,
);
router.delete(
  "/product-variants/:id",
  requireBoss,
  validate(adminIdParamsSchema, "params"),
  adminController.deleteProductVariant,
);

export default router;
