'use strict';

const _ = require(`lodash`);

module.exports = async (app) => {
  app.routes = Object.keys(app.api || []).reduce((acc, key) => {
    return acc.concat(_.get(app.api[key], 'config.routes') || {});
  }, []);
};
