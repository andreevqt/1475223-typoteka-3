'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {parseQuery, authorize, isEditor} = require(`../middleware`);
const {categories} = require(`../validators`);
const {validate} = require(`express-validation`);

const router = new Router();

const categoriesRoute = (app, services) => {
  const controller = controllers.categories(services);

  app.use(`/categories`, router);

  router.param(`categoryId`, controller.checkCategory);

  router
    .route(`/`)
    .get(parseQuery, controller.list)
    .post([authorize(services), validate(categories.create, {}, {abortEarly: false})], controller.create);

  router
    .route(`/:categoryId`)
    .get(controller.get)
    .put([authorize(services), isEditor, validate(categories.update)], controller.update)
    .delete([authorize(services), isEditor, controller.checkArticles], controller.delete);
};

module.exports = categoriesRoute;
