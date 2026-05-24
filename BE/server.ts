import "dotenv/config";
import app from "@/app";
import { connectDb } from "@/config/db";

const PORT = Number(process.env.PORT) || 3001;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
