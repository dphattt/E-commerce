const User = require("@/models/User.model");

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("email name createdAt");
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    res.json({ user });
  } catch (e) {
    next(e);
  }
}

module.exports = { me };
