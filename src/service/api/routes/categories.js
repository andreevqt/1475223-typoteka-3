'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {parseQuery} = require(`../middleware`);

const router = new Router();

module.exports = (app, services) => {
  const controller = controllers.categories(services);

  app.use(`/categories`, router);

  router.param(`categoryId`, controller.checkCategory);

  router
    .route(`/`)
    .get(parseQuery, controller.list);

  router
    .route(`/:categoryId`)
    .get(controller.get);
};
