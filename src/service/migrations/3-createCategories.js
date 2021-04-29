'use stict';

module.exports.up = function (knex) {
  return knex.schema
    .createTable(`categories`, function (table) {
      table.increments(`id`).primary();
      table.string(`name`, 255);
    })
};

module.exports.down = function (knex) {
  return knex.schema
    .dropTable(`categories`);
}
