'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);

const router = new Router();

module.exports = (app, searchService) => {
  const controller = controllers.search(searchService);

  app.use(`/search`, router);

  router.
    route(`/`).
    get(controller.search);
};
