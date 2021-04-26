'use strict';

const _ = require(`lodash`);

require(`dotenv`).config();

const getBool = (envVar, defaultValue) => {
  if (_.isBoolean(envVar)) {
    return envVar;
  }

  if (_.isString(envVar)) {
    if (envVar === 'true') return true;
    if (envVar === 'false') return false;
  }
  
  return defaultValue;
};

const getString = (envVar, defaultValue) => {
  return envVar || defaultValue;
}

const getInteger = (envVar, defaultValue) => {
  if (_.isInteger(envVar)) {
    return envVar;
  }

  if (_.isString(envVar)) {
    return _.toInteger(envVar);
  }

  return defaultValue;
}

const config = {
  env: getString(process.env.NODE_ENV, `development`),
  debug: getBool(process.env.NODE_ENV, false),
  app: {
    url: getString(process.env.APP_URL, `http://localhost`),
    port: getInteger(process.env.APP_PORT, 8080)
  },
  server: {
    port: getInteger(process.env.SERVER_PORT, 3000),
  },
  db: {
    user: getString(process.env.DB_USER),
    password: getString(process.env.DB_PASSWORD),
    database: getString(process.env.DB_DATABASE),
    host: getString(process.env.DB_HOST, `localhost`),
    client: `pg`
  }
}

const get = (key) => {
  return _.get(config, key);
};

const set = (key, value) => {
  _.set(config, key, value);
};

module.exports = {
  get,
  set
};
