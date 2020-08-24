'use strict';

const {Router} = require(`express`);
const router = new Router();
const {logger} = require(`../../utils`).logger;
const upload = require(`../middleware/upload`);
const api = require(`../api-services`);

module.exports = (_app) => {
  router.param(`categoryId`, async (req, res, next, id) => {
    const category = await api.categories.get(id);
    if (!category) {
      res.status(404).render(`errors/404`);
    }

    req.locals = {category};
    next();
  });

  router.get(`/add`, (req, res) => {
    res.render(`pages/new-post`);
  });

  router.post(`/add`, upload.single(`picture`), async (req, res) => {
    const filename = req.file ? req.file.filename : null;
    const formData = {
      picture: filename, category: [], ...req.body
    };

    try {
      await api.articles.create(formData);
    } catch (err) {
      logger.info(err.response.data);
      res.render(`pages/new-post`, {formData});
      return;
    }

    res.redirect(`/my`);
  });

  router.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    let article = null;

    try {
      article = await api.articles.get(id);
      article.comments = await api.comments.fetch(article.id);
    } catch (err) {
      res.status(404).render(`errors/404`);
      return;
    }

    res.render(`pages/post`, {article});
  });

  router.get(`/edit/:id`, async (req, res) => {
    const {id} = req.params;
    let article = null;

    const formData = {
      action: `/articles/edit/${id}`
    };

    try {
      article = await api.articles.get(id);
    } catch (err) {
      res.status(404).render(`errors/404`);
      return;
    }

    res.render(`pages/new-post`, {formData: {...formData, ...article}});
  });

  router.post(`/edit/:id`, upload.single(`picture`), async (req, res) => {
    const {id} = req.params;
    const filename = req.file ? req.file.filename : null;
    const formData = {picture: filename, category: [], ...req.body};

    try {
      await api.articles.update(id, formData);
    } catch (err) {
      logger.info(err.response.data);
      res.status(404).render(`errors/404`);
      return;
    }

    res.redirect(`/my`);
  });

  router.get(`/category/:categoryId`, async (req, res) => {
    const {query, page} = req.query;
    const {category} = req.locals;
    let articles = [];

    try {
      articles = await api.articles.fetchByCat({id: category.id, query, page});
    } catch (err) {
      res.status(404).render(`errors/404`);
      return;
    }

    res.render(`pages/by-category`, {articles, category});
  });

  return router;
};
