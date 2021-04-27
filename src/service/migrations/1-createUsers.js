'use stict';

module.exports.up = function (knex) {
  return knex.schema
    .createTable(`users`, function (table) {
      table.increments(`id`).primary();
      table.string(`name`, 255);
      table.timestamps();
    })
};

module.exports.down = function (knex) {
  return knex.schema
    .dropTable(`users`);
}
