require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const url = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DATABASE || "ecommerce";

module.exports = {
  mongodb: {
    url,
    databaseName,
    options: {},
  },
  migrationsDir: "migrations",
  changelogCollectionName: "migration_changelog",
  migrationFileExtension: ".js",
};
