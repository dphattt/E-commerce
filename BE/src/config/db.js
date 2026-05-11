const mongoose = require("mongoose");

function mongooseUri() {
  const base = (process.env.MONGODB_URL || "mongodb://127.0.0.1:27017").trim();
  const db = process.env.MONGODB_DATABASE || "ecommerce";
  if (base.includes("?")) {
    const [pathPart, query] = base.split("?");
    return `${pathPart.replace(/\/$/, "")}/${db}?${query}`;
  }
  return `${base.replace(/\/$/, "")}/${db}`;
}

async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongooseUri());
  return mongoose.connection;
}

module.exports = { connectDb, mongoose };
