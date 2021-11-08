'use strict';

const {Router} = require(`express`);
const router = new Router();
const {logger} = require(`../helpers`);
const api = require(`../api-services`);

module.exports = (_app) => {
  router.get(`/`, async (req, res) => {
    let articles = [];

    try {
      articles = await api.articles.fetch({limit: 4});
    } catch (err) {
      logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
    }

    res.render(`pages/my`, {articles});
  });

  router.get(`/comments`, async (req, res, _next) => {
    let articles = [];

    try {
      articles = await api.articles.fetch({limit: 3});
      for (let article of articles) {
        article.comments = await api.comments.fetch(article.id);
      }
    } catch (err) {
      logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
    }

    res.render(`pages/comments`, {articles});
  });

  return router;
};
