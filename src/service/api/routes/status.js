'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);

const router = new Router();

const statusRoute = (app, services) => {
  const controller = controllers.status(services);

  app.use(`/status`, router);

  router
    .route(`/`)
    .get(controller.status);

};

module.exports = statusRoute;
