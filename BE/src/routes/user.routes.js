const { Router } = require("express");
const { requireAuth } = require("@/middlewares/auth.middleware");
const userController = require("@/controllers/user.controller");

const router = Router();

router.get("/me", requireAuth, userController.me);

module.exports = router;
