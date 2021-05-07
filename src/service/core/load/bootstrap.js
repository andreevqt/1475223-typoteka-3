'use strict';

const _ = require(`lodash`);

const pluralize = require(`pluralize`);


const createCoreApi = require(`../core-api`);

module.exports = async (app) => {
  // set models
  app.models = Object.keys(app.api || []).reduce((acc, apiName) => {
    const api = app.api[apiName];
    for (let modelName in api.models) {
      const model = app.api[apiName].models[modelName];
      model.modelName = modelName;
      model.tableName = model.tableName || pluralize(modelName);

      const { service, controller } = createCoreApi({model, api, app});

      _.set(app.api[apiName], [`service`, modelName], service);
      _.set(app.api[apiName], [`controllers`, modelName], controller);

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
