'use strict';
/* eslint-disable no-invalid-this */

const dbService = require(`../db-service`);
const {isClass} = require(`../../utils`);

const fs = require(`fs`);
const path = require(`path`);
const Sequelize = require(`sequelize`);
const basename = path.basename(__filename);
const db = {};

let service = dbService.create();

// Баг: https://github.com/sequelize/sequelize/issues/10557
service.sequelize.addHook(`beforeCount`, function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true;
    options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }

  if (options.include && options.include.length > 0) {
    options.include = null;
  }
});

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf(`.`) !== 0) && (file !== basename) && (file.slice(-3) === `.js`);
  })
  .forEach((file) => {
    const definer = require(path.join(__dirname, file));
    if (!isClass(definer)) {
      const model = definer(service.sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.service = service;
module.exports = db;
