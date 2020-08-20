'use strict';

require(`dotenv`).config();

module.exports = {
  env: process.env.NODE_ENV || `development`,
  app: {
    url:  process.env.APP_URL || `http://localhost`,
    port: process.env.APP_PORT || 8080
  },
  server: {
    port: process.env.SERVER_PORT || 3000,
  },
  db: {
    development: {
      username: process.env.DB_USER_DEVELOPMENT || process.env.DB_USER,
      password: process.env.DB_PASSWORD_DEVELOPMENT || process.env.DB_PASSWORD,
      database: process.env.DB_NAME_DEVELOPMENT || process.env.DB_NAME,
      host: process.env.DB_HOST_DEVELOPMENT || process.env.DB_HOST || `localhost`,
      dialect: `postgres`
    },
    test: {
      username: process.env.DB_USER_TEST,
      password: process.env.DB_PASSWORD_TEST,
      database: process.env.DB_NAME_TEST,
      host: process.env.DB_HOST_TEST || `localhost`,
      dialect: `postgres`
    },
    production: {
      username: process.env.DB_USER_PRODUCTION,
      password: process.env.DB_PASSWORD_PRODUCTION,
      database: process.env.DB_NAME_PRODUCTION,
      host: process.env.DB_HOST_PRODUCTION || `localhost`,
      dialect: `postgres`
    },
  },
};
