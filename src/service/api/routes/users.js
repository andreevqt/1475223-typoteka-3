'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {users} = require(`../validators`);
const {validate} = require(`express-validation`);
const {parseQuery, authorize, isCurrentUser, auth} = require(`../middleware`);

const router = new Router();

module.exports = (app, services) => {
  const controller = controllers.users(services);

  app.use(`/users`, router);

  router.param(`userId`, controller.checkUser);

  router
    .route(`/`)
    .get(parseQuery, controller.list)
    .post(validate(users.create, {}, {abortEarly: false}), controller.create);

  router
    .route(`/logout`)
    .delete(authorize(services), controller.logout);

  router
    .route(`/login`)
    .post(auth(services), controller.login);

  router
    .route(`/refresh`)
    .post(controller.refresh);

  router
    .route(`/:userId`)
    .get(controller.get)
    .put([authorize(services), isCurrentUser, validate(users.update, {}, {abortEarly: false})], controller.update)
    .delete([authorize(services), isCurrentUser], controller.delete);
};
