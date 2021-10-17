'use strict';

require(`dotenv`).config();

module.exports = {
  app: {
    url: process.env.APP_URL || `http://localhost`,
    port: process.env.APP_PORT || 8080
  },
  server: {
    port: process.env.SERVER_PORT || 3000,
  },
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || `localhost`,
    dialect: `postgres`
  },
};
