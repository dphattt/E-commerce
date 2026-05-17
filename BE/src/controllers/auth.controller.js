const User = require("@/models/User.model").default;
const { signToken } = require("@/utils/jwt");

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      const err = new Error("email and password are required");
      err.status = 400;
      throw err;
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      const err = new Error("Email already registered");
      err.status = 409;
      throw err;
    }
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name || "",
    });
    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error("email and password are required");
      err.status = 400;
      throw err;
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash",
    );
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }
    const token = signToken({ sub: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login };
