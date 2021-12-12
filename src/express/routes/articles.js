'use strict';

const {Router} = require(`express`);
const router = new Router();
const {logger} = require(`../helpers`);
const upload = require(`../middleware/upload`);
const api = require(`../api-services`);
const {http} = require(`../../service/constants`);
const isEditor = require(`../middleware/isEditor`);

module.exports = (_app) => {
  router.param(`categoryId`, async (req, res, next, id) => {
    const category = await api.categories.get(id);
    if (!category) {
      res.status(http.NOT_FOUND).render(`errors/404`);
    }

    res.locals.category = category;
    next();
  });

  router.param(`articleId`, async (req, res, next, id) => {
    const article = await api.articles.get(id);
    if (!article) {
      res.status(http.NOT_FOUND).render(`errors/404`);
    }

    article.comments = await api.comments.fetch(article.id);
    res.locals.article = article;
    next();
  });

  router.get(`/`, async (req, res) => {
    const {query, page} = req.query;
    let articles = [];
    let empty = true;

    try {
      articles = await api.articles.fetch({order: `latest`, query, page});
      empty = !articles.length;
    } catch (err) {
      logger.info(err);
      if (err.response) {
        logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
      }
    }

    res.render(`pages/posts`, {articles, empty});
  });

  router.get(`/add`, isEditor, (req, res) => {
    res.render(`pages/new-post`);
  });

  router.post(`/add`, [isEditor, upload.single(`picture`)], async (req, res, next) => {
    const picture = req.file && req.file.buffer.toString(`base64`);
    const attrs = {
      picture, category: [], ...req.body
    };

    try {
      await api.articles.create(attrs);
    } catch (err) {
      if (err.response && err.response.status === http.BAD_REQUEST) {
        res.json({errors: err.response.data});
        return;
      }

      next(err);
      return;
    }

    res.json({
      redirectTo: `/my`
    });
  });

  router.get(`/:articleId`, async (req, res) => {
    const {article} = res.locals;
    res.render(`pages/post`, {article});
  });


  router.post(`/:articleId/comments`, async (req, res, next) => {
    const {article} = res.locals;
    const attrs = req.body;

    try {
      await api.comments.create(article.id, attrs);
    } catch (err) {
      if (err.response && err.response.status === http.BAD_REQUEST) {
        const errors = err.response.data;
        res.render(`pages/post`, {article, errors});
        return;
      }

      next(err);
      return;
    }

    res.redirect(`/articles/${article.id}`);
  });

  router.get(`/edit/:articleId`, isEditor, async (req, res) => {
    const {article} = res.locals;

    const formData = {
      action: `/articles/edit/${article.id}`
    };

    res.render(`pages/new-post`, {formData: {...formData, ...article}});
  });

  router.post(`/edit/:articleId`, [isEditor, upload.single(`picture`)], async (req, res, next) => {
    const {article} = res.locals;
    const picture = req.file && req.file.buffer.toString(`base64`);
    const formData = {picture, category: [], ...req.body};

    try {
      await api.articles.update(article.id, formData);
      res.json({
        redirectTo: `/my`
      });
    } catch (err) {
      if (err.response) {
        if (err.response.status === http.NOT_FOUND) {
          res.status(http.NOT_FOUND).send(`Not found`);
          return;
        }

        if (err.response.status === http.BAD_REQUEST) {
          res.json({errors: err.response.data});
          return;
        }
      }

      next(err);
    }
  });

  router.get(`/category/:categoryId`, async (req, res) => {
    const {query, page} = req.query;
    const {category} = res.locals;
    let articles = [];

    try {
      articles = await api.articles.fetchByCat({id: category.id, query, page});
    } catch (err) {
      res.status(http.NOT_FOUND).render(`errors/404`);
      return;
    }

    res.render(`pages/by-category`, {articles, category});
  });

  return router;
};
