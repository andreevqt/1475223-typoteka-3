'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {articles, comments} = require(`../validators`);
const {validate} = require(`express-validation`);
const {parseQuery} = require(`../middleware`);

const router = new Router();

module.exports = (app, services) => {
  const controller = controllers.articles(services);

  app.use(`/articles`, router);

  router.param(`articleId`, controller.checkArticle);
  router.param(`commentId`, controller.checkComment);

  router
    .route(`/`)
    .get(parseQuery, controller.list)
    .post(validate(articles.create), controller.create);

  router
    .route(`/:articleId`)
    .get(controller.get)
    .put(validate(articles.update), controller.update)
    .delete(controller.delete);

  router
    .route(`/:articleId/comments`)
    .get(controller.comments.list)
    .post(validate(comments.create), controller.comments.create);

  router
    .route(`/:articleId/comments/:commentId`)
    .delete(controller.comments.delete);

  router
    .route(`/category/:categoryId`)
    .get(parseQuery, controller.categories.get);
};
