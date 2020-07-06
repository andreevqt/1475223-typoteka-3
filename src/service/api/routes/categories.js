'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);

const router = new Router();

module.exports = (app, categoryService) => {
  const controller = controllers.categories(categoryService);

  app.use(`/categories`, router);

  router.
    route(`/`).
    get(controller.list);
};
