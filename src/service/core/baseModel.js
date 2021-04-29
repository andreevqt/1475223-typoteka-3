'use strict';

const _ = require(`lodash`);

module.exports = function (app) {
  const bookshelf = app.connection;
  return bookshelf.Model.extend({}, {
    relationships: function () {
      return this.forge().relationships;
    }
  });
};
