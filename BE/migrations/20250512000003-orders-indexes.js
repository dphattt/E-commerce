/**
 * Orders collection indexes for listing by user.
 * @param {import('mongodb').Db} db
 * @param {import('mongodb').MongoClient} client
 */
module.exports = {
  async up(db) {
    await db.collection("orders").createIndexes(
      [
        {
          key: { userId: 1, createdAt: -1 },
          name: "orders_userId_createdAt",
        },
        { key: { status: 1 }, name: "orders_status" },
      ],
      { background: true },
    );
  },

  async down(db) {
    await db.collection("orders").dropIndexes([
      "orders_userId_createdAt",
      "orders_status",
    ]);
  },
};
