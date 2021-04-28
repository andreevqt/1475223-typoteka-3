'use strict';

const _ = require(`lodash`);
const bookshelf = require(`./bookshelf`);
const buildQuery = require(`./buildQuery`);

class Database {
  constructor(app) {
    this.app = app;
    this.isInitialized = false;
    this.models = new Map;
  }

  async init() {
    if (this.isInitialized) {
      return;
    }
    
    try {
      this.bookshelf = bookshelf(this.app);
      await this.bookshelf.initialize();      
    } catch(err) {
      this.app.log.error(`Ошибка при соединении с БД: ${err.message}`);
      throw err;
    }

    this.app.log.info(`Соединение с БД успешно установлено!`);

    this.isInitialized = true;
  }

  getModel(name) {
    const key = _.toLower(name);
    return _.get(this.app, [`models`, key]);
  }

  query(entity) {
    const model = this.getModel(entity);
    return this.bookshelf.queries({model, app: this.app});
  }

  async destroy() {
    await this.bookshelf.close();
  }
}

module.exports = {
  createDatabase(app) {
    return new Database(app);
  }
};
