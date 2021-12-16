'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);

const router = new Router();

module.exports = (app, services) => {
  const controller = controllers.status(services);

  app.use(`/status`, router);

  router
    .route(`/`)
    .get(controller.status);

};
