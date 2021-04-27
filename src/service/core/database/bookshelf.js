'use strict';

const initKnex = require(`./knex`);
const mountModels = require(`../mount/mountModels`);
const queries = require(`./queries`);

module.exports = (app) => {
  const initialize = async () => {
    await initKnex(app);
    mountModels(app);
  };

  const close = async () => {
    await app.connection.knex.destroy();
  }

  return {
    initialize,
    close,
    queries
  }
};
