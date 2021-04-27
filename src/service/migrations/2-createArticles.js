'use stict';

module.exports.up = function (knex) {
  return knex.schema
    .createTable(`articles`, function (table) {
      table.increments(`id`).primary();
      table.string(`title`, 255);
      table.string(`announce`, 512);
      table.text(`fullText`);
      /* table.json(`picture`);
      table.integer(`authorId`).unsigned();
      table.foreign(`authorId`).references(`users.id`);
      table.timestamps(); */
    })
};

module.exports.down = function (knex) {
  return knex.schema
    .dropTable(`articles`);
}
