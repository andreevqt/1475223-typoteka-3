'use stict';

module.exports.up = function (knex) {
  return knex.schema
    .createTable(`articles_categories`, function (table) {
      table.increments(`id`).primary();
      table.integer(`article_id`).unsigned();
      table.integer(`category_id`).unsigned();
      table.foreign(`article_id`).references(`articles.id`).onDelete(`CASCADE`);
      table.foreign(`category_id`).references(`categories.id`).onDelete(`CASCADE`);
    })
};

module.exports.down = function (knex) {
  return knex.schema
    .dropTable(`articles_categories`);
}
