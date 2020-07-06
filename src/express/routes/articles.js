'use strict';

const {Router} = require(`express`);
const router = new Router();
const axios = require(`axios`);
const {logger} = require(`../../utils`).logger;
const upload = require(`../middleware/upload`);

module.exports = (app) => {
  const url = app.get(`api_url`);

  router.get(`/add`, (req, res) => {
    res.render(`pages/new-post`);
  });

  router.post(`/add`, upload.single(`picture`), async (req, res) => {
    const filename = req.file ? req.file.filename : null;
    const formData = {
      picture: filename, category: [], ...req.body
    };

    try {
      await axios.post(`${url}/articles`, formData);
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
      article = (await axios.get(`${url}/articles/${id}`)).data;
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
      article = (await axios.get(`${url}/articles/${id}`)).data;
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
      await axios.put(`${url}/articles/${id}`, formData);
    } catch (err) {
      logger.info(err.response.data);
      res.status(404).render(`errors/404`);
      return;
    }

    res.redirect(`/my`);
  });

  router.get(`/category/:category`, async (req, res) => {
    const {category} = req.params;
    let articles = [];

    try {
      articles = (await axios.get(`${url}/articles/category/${encodeURI(category)}`)).data;
    } catch (err) {
      res.status(404).render(`errors/404`);
      return;
    }

    res.render(`pages/by-category`, {articles, category});
  });

  return router;
};
