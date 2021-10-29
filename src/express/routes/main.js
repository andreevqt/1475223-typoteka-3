'use strict';

const {Router} = require(`express`);
const {logger} = require(`../helpers`);
const api = require(`../api-services`);
const upload = require(`../middleware/upload`);

const router = new Router();

module.exports = (_app) => {
  router.get(`/`, async (req, res) => {
    const {query, page} = req.query;
    let popular = [];
    let articles = [];
    let comments = [];
    let empty = true;

    try {
      articles = await api.articles.fetch({order: `latest`, query, page});
      popular = await api.articles.fetch({order: `popular`});
      comments = await api.comments.latest();

      empty = !articles.length;
    } catch (err) {
      logger.info(err);
      if (err.response) {
        logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
      }

    }

    res.render(`pages/index`, {popular, articles, comments, empty});
  });

  router.get(`/search`, async (req, res) => {
    const {query, page, limit} = req.query;
    let articles = [];

    if (query) {
      try {
        articles = await api.search.fetch({query, page, limit});
        articles.paginator.append(`query`, query);
      } catch (err) {
        logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
      }
    }

    res.render(`pages/search`, {articles, query});
  });

  router.get(`/login`, (_req, res, _next) => res.render(`pages/login`));

  router.post(`/register`, upload.single(`avatar`), async (req, res, next) => {
    const avatar = req.file && req.file.buffer.toString(`base64`);
    const {name, lastName, password, confirmPassword, email} = req.body;

    if (password !== confirmPassword) {
      res.json({errors: {password: `Пароли должны совпадать`}});
      return;
    }

    const attrs = {
      avatar,
      name: `${name} ${lastName}`,
      password,
      email
    };

    try {
      await api.users.create(attrs);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        res.json({errors: err.response.data});
        return;
      }

      next(err);
      return;
    }

    res.json({
      redirectTo: `/login`
    });
  });

  router.get(`/register`, (_req, res, _next) => res.render(`pages/register`));

  return router;
};
