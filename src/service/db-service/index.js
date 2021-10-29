'use strict';

/* eslint-disable indent */

const {Sequelize} = require(`sequelize`);
const config = require(`../../../config`);
const {logger} = require(`../helpers`);

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

    logger.info(`Аутентификация пользователя успешна`);
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

    logger.info(`БД успешно синхронизирована`);
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

    logger.info(`Таблицы успешно удалены`);
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

    logger.info(`Соединение с бд закрыто`);
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

const create = (options = null) => {
  if (options) {
    return new DbService(options);
  }

  const logging = process.env.SEQUELIZE_LOGGING === `true` ? console.log : false;

  const sequelize = process.env.NODE_ENV === `test`
    ? new Sequelize(`sqlite::memory:`, {
      logging,
    })
    : new Sequelize(
      config.db.database,
      config.db.username,
      config.db.password, {
      host: config.db.host,
      dialect: `postgres`,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging
    });

  return new DbService(sequelize);
};

module.exports = {
  create,
  DbService
};
