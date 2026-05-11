function notFoundHandler(req, res) {
  res.status(404).json({ message: "Not found", path: req.originalUrl });
}

function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value",
      ...(err.keyPattern && { fields: Object.keys(err.keyPattern) }),
    });
  }
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  } else if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ message });
}

module.exports = { notFoundHandler, errorHandler };
