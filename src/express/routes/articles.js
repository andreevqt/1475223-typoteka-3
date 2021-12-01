'use strict';

const {Router} = require(`express`);
const router = new Router();
/* const {logger} = require(`../helpers`); */
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

  router.post(`/add`, upload.single(`picture`), async (req, res, next) => {
    const picture = req.file && req.file.buffer.toString(`base64`);
    const attrs = {
      picture, category: [], ...req.body
    };

    try {
      await api.articles.create(attrs);
    } catch (err) {
      if (err.response && err.response.status === 400) {
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

  router.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    let article;

    try {
      article = await api.articles.get(id);
      article.comments = await api.comments.fetch(article.id);
    } catch (err) {
      res.status(404).render(`errors/404`);
      return;
    }

    res.render(`pages/post`, {article});
  });


  router.post(`/:id/comments`, async (req, res, next) => {
    const {id} = req.params;
    const attrs = req.body;

    try {
      await api.comments.create(id, attrs);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        res.json({errors: err.response.data});
        return;
      }

      next(err);
      return;
    }

    res.redirect(`back`);
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

  router.post(`/edit/:id`, upload.single(`picture`), async (req, res, next) => {
    const {id} = req.params;
    const filename = req.file ? req.file.filename : null;
    const formData = {picture: filename, category: [], ...req.body};

    try {
      await api.articles.update(id, formData);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          res.status(404).send(`Not found`);
          return;
        }

        if (err.response.status === 400) {
          res.json({errors: err.response.data});
          return;
        }
      }

      next(err);
      return;
    }

    res.json({
      redirectTo: `/my`
    });
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
