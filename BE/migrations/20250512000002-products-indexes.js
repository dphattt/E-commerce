/**
 * Products collection indexes for catalog queries.
 * @param {import('mongodb').Db} db
 * @param {import('mongodb').MongoClient} client
 */
module.exports = {
  async up(db) {
    await db.collection("products").createIndexes(
      [
        { key: { slug: 1 }, unique: true, name: "products_slug_unique" },
        {
          key: { category: 1, createdAt: -1 },
          name: "products_category_createdAt",
        },
      ],
      { background: true },
    );
  },

  async down(db) {
    await db.collection("products").dropIndexes([
      "products_slug_unique",
      "products_category_createdAt",
    ]);
  },
};
