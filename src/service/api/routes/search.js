'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {parseQuery} = require(`../middleware`);

const router = new Router();

const searchRoute = (app, services) => {
  const controller = controllers.search(services);

  app.use(`/search`, router);

  router.
    route(`/`).
    get(parseQuery, controller.search);
};

module.exports = searchRoute;
