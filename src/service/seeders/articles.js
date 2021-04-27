'use strict'

module.exports.seed = async function (knex) {
  await knex(`articles`).del();

  return knex(`articles`).insert([
    {
      title: `Test title`,
      announce: `Some test announce`,
      fullText: `Some text`
    }
  ]);
};
