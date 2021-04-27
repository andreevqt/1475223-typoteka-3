'use strict';

const _ = require(`lodash`);

module.exports = async (app) => {
  // set models
  app.models = Object.keys(app.api || []).reduce((acc, apiName) => {
    const api = app.api[apiName];
    for (let modelName in api.models) {
      const model = app.api[apiName].models[modelName];
      // core api ?
      acc[modelName] = model;
    }

    return acc;
  }, {});

  // set routes
  app.routes = Object.keys(app.api || []).reduce((acc, key) => {
    return acc.concat(_.get(app.api[key], 'config.routes') || {});
  }, []);

  // set controllers
  app.controllers = Object.keys(app.api || []).reduce((acc, key) => {
    for (let index in app.api[key].controllers) {
      let controller = app.api[key].controllers[index];
      controller.identity = controller.identity || index;
      acc[index] = controller;
    }

    return acc;
  }, {});
};
