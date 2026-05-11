/**
 * Example data migration placeholder: ensure text index or TTL can go here.
 * Currently a no-op up/down so the migration chain demonstrates versioned files.
 * @param {import('mongodb').Db} db
 * @param {import('mongodb').MongoClient} client
 */
module.exports = {
  async up() {
    // Add seed or schema transforms when needed.
  },

  async down() {
    // Roll back transforms when needed.
  },
};
