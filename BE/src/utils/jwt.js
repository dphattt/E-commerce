const jwt = require("jsonwebtoken");

const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
};

function signToken(payload) {
  return jwt.sign(payload, secret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function verifyToken(token) {
  return jwt.verify(token, secret());
}

module.exports = { signToken, verifyToken };
