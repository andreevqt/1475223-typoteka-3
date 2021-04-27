'use strict';
const _ = require(`lodash`);

const createBaseModel = require(`../baseModel`);

const mountModels = (app) => {
  const baseModel = createBaseModel(app);
  const bookshelf = app.connection;

  _.forIn(app.models, (definition, key) => {
    const loadedModel = _.assign(baseModel, definition);
    app.models[key] = bookshelf.Model.extend(loadedModel);   
  });

}

module.exports = mountModels;
