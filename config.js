'use strict';

require(`dotenv`).config();

module.exports = {
  jwt: {
    secret: {
      access: process.env.JWT_SECRET_ACCESS,
      refresh: process.env.JWT_SECRET_REFRESH
    },
    expiresIn: process.env.JWT_EXPIRES_IN || `15m`
  },
  app: {
    key: process.env.APP_KEY,
    url: process.env.APP_URL || `http://localhost:8080`,
    port: process.env.APP_PORT || 8080,
  },
  server: {
    url: process.env.SERVER_URL || `http://localhost:3000`,
    port: process.env.SERVER_PORT || 3000,
    enabled: (process.env.API_ENABLED === `true`) || true
  },
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || `localhost`,
    dialect: `postgres`
  }
};
