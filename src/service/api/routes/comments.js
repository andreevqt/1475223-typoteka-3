'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {parseQuery} = require(`../middleware`);

const router = new Router();

module.exports = (app, services) => {
  const controller = controllers.comments(services);

  app.use(`/comments`, router);

  router.
    route(`/`).
    get(parseQuery, controller.list);
};
