/**
 * Users collection indexes (run before app relies on unique email).
 * @param {import('mongodb').Db} db
 * @param {import('mongodb').MongoClient} client
 */
module.exports = {
  async up(db) {
    await db.collection("users").createIndexes(
      [
        { key: { email: 1 }, unique: true, name: "users_email_unique" },
        { key: { createdAt: -1 }, name: "users_createdAt_desc" },
      ],
      { background: true },
    );
  },

  async down(db) {
    await db.collection("users").dropIndexes([
      "users_email_unique",
      "users_createdAt_desc",
    ]);
  },
};
