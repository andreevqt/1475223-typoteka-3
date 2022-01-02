'use strict';

const {Router} = require(`express`);
const controllers = require(`../controllers`);
const {articles, comments} = require(`../validators`);
const {validate} = require(`express-validation`);
const {parseQuery, authorize, isEditor, sanitizeDate} = require(`../middleware`);
const sanitizer = sanitizeDate(`createdAt`);

const router = new Router();

const articlesRoute = (app, services) => {
  const controller = controllers.articles(services);

  app.use(`/articles`, router);

  router.param(`articleId`, controller.checkArticle);
  router.param(`commentId`, controller.checkComment);

  router
    .route(`/`)
    .get(parseQuery, controller.list)
    .post([authorize(services), isEditor, validate(articles.create, {}, {abortEarly: false}), sanitizer], controller.create);

  router
    .route(`/:articleId`)
    .get(controller.get)
    .put([authorize(services), isEditor, validate(articles.update, {}, {abortEarly: false}), sanitizer], controller.update)
    .delete(controller.delete);

  router
    .route(`/:articleId/comments`)
    .get(controller.comments.list)
    .post([authorize(services), validate(comments.create, {}, {abortEarly: false})], controller.comments.create);

  router
    .route(`/:articleId/comments/:commentId`)
    .delete([authorize(services), isEditor], controller.comments.delete);

  router
    .route(`/category/:categoryId`)
    .get(parseQuery, controller.categories.get);
};

module.exports = articlesRoute;
