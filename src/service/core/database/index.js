'use strict';
const initKnex = require(`./knex`)
const bookshelf = require(`./bookshelf`);

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
      this.connector = bookshelf(this.app);
      await this.connector.initialize();      
    } catch(err) {
      this.app.log.error(`Ошибка при соединении с БД: ${err.message}`);
      throw err;
    }

    this.app.log.info(`Соединение с БД успешно установлено!`);

    this.isInitialized = true;
  }

  async destroy() {
    await this.connector.close();
  }
}

module.exports = {
  createDatabase(app) {
    return new Database(app);
  }
}

