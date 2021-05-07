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
          return this.belongsTo(relation.target, relation.foreignKey);
        }
      }
    });
  
    const loadedModel = _.assign({
      requireFetch: true,
    }, definition);

    const bookshelfModel = bookshelf.model(key, bookshelf.Model.extend(loadedModel));

    app.models[key] = _.assign(bookshelfModel, app.models[key]);
  });

}

module.exports = mountModels;
