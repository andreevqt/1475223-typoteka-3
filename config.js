'use strict';

require(`dotenv`).config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || `development`,
  APP_URL: process.env.APP_URL || `http://localhost`,
  APP_PORT: process.env.APP_PORT || 8080,
  APP_PUBLIC_FOLDER: process.env.APP_PUBLIC_FOLDER || `public`,
  API_SERVER_PORT: process.env.API_SERVER_PORT || 3000
};
