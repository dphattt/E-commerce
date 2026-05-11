require("dotenv").config();
require("module-alias/register");

const app = require("@/app");
const { connectDb } = require("@/config/db");

const PORT = Number(process.env.PORT) || 3001;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
