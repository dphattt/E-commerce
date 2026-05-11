const { Router } = require("express");
const healthRoutes = require("@/routes/health.routes");
const authRoutes = require("@/routes/auth.routes");
const userRoutes = require("@/routes/user.routes");

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
