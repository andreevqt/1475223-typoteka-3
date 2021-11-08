'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {parseQuery} = require(`../middleware`);
const {categories} = require(`../validators`);
const {validate} = require(`express-validation`);

const router = new Router();

module.exports = (app, services) => {
  const controller = controllers.categories(services);

  app.use(`/categories`, router);

  router.param(`categoryId`, controller.checkCategory);

  router
    .route(`/`)
    .get(parseQuery, controller.list)
    .post(validate(categories.create), controller.create);

  router
    .route(`/:categoryId`)
    .get(controller.get)
    .put(validate(categories.update), controller.update)
    .delete(controller.delete);
};
