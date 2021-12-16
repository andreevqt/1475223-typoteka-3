'use strict';

const {Router} = require(`express`);
const router = new Router();
const {logger} = require(`../helpers`);
const api = require(`../api-services`);
const {http} = require(`../../service/constants`);

module.exports = (_app) => {
  router.get(`/`, async (req, res) => {
    const {page} = req.query;
    let articles = [];

    try {
      articles = await api.articles.fetch({limit: 15, page});
    } catch (err) {
      if (err.response) {
        logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
      }
    }

    res.render(`pages/my`, {articles});
  });

  router.get(`/comments`, async (req, res, _next) => {
    const {page} = req.query;
    let comments = [];

    try {
      comments = await api.comments.latest({limit: 15, page});
    } catch (err) {
      if (err.response) {
        logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
      }
    }

    res.render(`pages/comments`, {comments});
  });

  router.post(`/delete/:id`, async (req, res) => {
    const {id} = req.params;
    try {
      await api.articles.delete(id);
    } catch (err) {
      res.status(http.OK).json({errors: err.response.data});
      return;
    }
    res.status(http.OK).send(`OK`);
  });

  router.post(`/delete/:articleId/:commentId`, async (req, res) => {
    const {articleId, commentId} = req.params;
    try {
      await api.comments.delete(articleId, commentId);
    } catch (err) {
      res.status(http.OK).json({errors: err.response.data});
      return;
    }
    res.status(http.OK).send(`OK`);
  });

  return router;
};
