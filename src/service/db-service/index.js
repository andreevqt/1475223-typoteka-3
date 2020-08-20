'use strict';

/* eslint-disable indent */

const {Sequelize} = require(`sequelize`);
const config = require(`../../../config`);
const {logger} = require(`../../utils`).logger;

class DbService {
  constructor(db) {
    this._db = db;
  }

  async auth() {
    let res;

    try {
      res = await this._db.authenticate();
    } catch (err) {
      logger.error(`Ошибка при аутентификации пользователя БД`);
      throw err;
    }

    logger.error(`Аутентификация пользователя успешна`);
    return res;
  }

  async sync() {
    let res;

    try {
      res = await this._db.sync({force: true});
    } catch (err) {
      logger.error(`Ошибка синзронизации БД`);
      throw err;
    }

    logger.error(`БД успешно синхронизирована`);
    return res;
  }

  async drop() {
    let res;

    try {
      res = await this._db.drop();
    } catch (err) {
      logger.error(`Ошибка при удалении таблиц`);
      throw err;
    }

    logger.error(`Таблицы успешно удалены`);
    return res;
  }

  async close() {
    let res;

    try {
      res = await this._db.close();
    } catch (err) {
      logger.error(`Ошибка при закрытии соединения`);
      throw err;
    }

    logger.error(`Соединение с бд закрыто`);
    return res;
  }

  get sequelize() {
    return this._db;
  }

  async bulkInsert(...args) {
    return this.sequelize.queryInterface.bulkInsert(...args);
  }

  async bulkDelete(...args) {
    return this.sequelize.queryInterface.bulkDelete(...args);
  }
}

const create = (obj = null) => {
  if (obj) {
    return new DbService(obj);
  }

  let sequelize;
  switch (config.env) {
    case `production`:
      sequelize = new Sequelize(
        config.db.production.database,
        config.db.production.username,
        config.db.production.password, {
        host: config.db.production.host,
        dialect: `postgres`,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        logging: false
      }
      );
      break;
    case `test`:
      sequelize = new Sequelize(
        config.db.test.database,
        config.db.test.username,
        config.db.test.password, {
        host: config.db.test.host,
        dialect: `postgres`,
        pool: {
          max: 1,
          min: 0,
          idle: 10000,
          evict: 0
        },
        logging: false
      });
      break;
    default:
      sequelize = new Sequelize(
        config.db.development.database,
        config.db.development.username,
        config.db.development.password, {
        host: config.db.development.host,
        dialect: `postgres`,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        logging: false
      });
  }

  return new DbService(sequelize);
};

module.exports = {
  create,
  DbService
};
