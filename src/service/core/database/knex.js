'use strict';

const init = (app) => {
  let knex;
  const {config} = app;
  
  if (process.env.NODE_ENV === `test`) {
    knex = require(`knex`)({
      client: `sqlite3`,
      connection: {
        filename: `:memory:`
      },
      debug: config.get(`debug`),
      useNullAsDefault: true
    });
  } else {
    knex = require(`knex`)({
      debug: config.get(`debug`),
      client: config.get(`db.client`),
      connection: {
        host: config.get(`db.host`),
        user: config.get(`db.user`),
        password: config.get(`db.password`),
        database: config.get(`db.database`)
      }
    });
  }

  app.connection = knex;

  return knex;
};

module.exports = init;
