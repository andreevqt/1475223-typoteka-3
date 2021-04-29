'use stict';

module.exports.up = function (knex) {
  return knex.schema
    .createTable(`comments`, function (table) {
      table.increments(`id`).primary();
      table.text(`text`);
      table.integer(`article_id`).unsigned();
      table.integer(`author_id`).unsigned();
      table.foreign(`author_id`).references(`users.id`).onDelete(`CASCADE`);
      table.foreign(`article_id`).references(`articles.id`).onDelete(`CASCADE`);
      table.timestamps();
    })
};

module.exports.down = function (knex) {
  return knex.schema
    .dropTable(`comments`);
}
