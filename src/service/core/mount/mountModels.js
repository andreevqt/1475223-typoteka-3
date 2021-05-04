'use strict';
const _ = require(`lodash`);

const createBaseModel = require(`../baseModel`);

const mountModels = (app) => {
  const bookshelf = app.connection;
  

  _.forIn(app.models, (definition, key) => {
    definition.relationships = definition.relationships || {};
    _.forIn(definition.relationships, (relation, key) => {
      if (relation.type === `oneToMany` && relation.master == true) {
        definition[key] = function () {
          return this.belongsTo(relation.target)
        }
      }
    });
  
    const loadedModel = _.assign({
      requireFetch: true,
    }, definition);

    app.models[key] = bookshelf.model(key, bookshelf.Model.extend(loadedModel));
  });

}

module.exports = mountModels;
