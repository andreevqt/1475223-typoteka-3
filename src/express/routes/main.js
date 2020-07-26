'use strict';

const {Router} = require(`express`);
const axios = require(`axios`);
const {logger} = require(`../../utils`).logger;
const {
  latestArticles,
  latestComments,
  popularArticles,
  insertAt
} = require(`../helpers`);

const router = new Router();

module.exports = (app) => {
  const url = app.get(`api_url`);

  router.get(`/`, async (req, res) => {
    let popular = [];
    let articles = [];
    let comments = [];
    let empty = true;

    try {
      const results = (await axios.get(`${url}/articles`)).data;
      empty = !results.length;

      articles = latestArticles(results);
      popular = popularArticles(results);
      comments = latestComments(results);

    } catch (err) {
      logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
    }

    res.render(`pages/index`, {popular, articles, comments, empty});
  });

  router.get(`/search`, async (req, res) => {
    const {query = null} = req.query;
    let articles = [];

    try {
      if (query) {
        articles = (await axios.get(`${url}/search`, {params: {query}})).data;
        articles = articles.map((article) => {
          const idx = article.title.toLowerCase().indexOf(query.toLowerCase());
          if (idx !== -1) {
            let title = insertAt(article.title, idx, `<b>`);
            title = insertAt(title, idx + `<b>`.length + query.length, `</b>`);
            article.title = title;
          }
          return article;
        });
      }
    } catch (err) {
      logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
    }

    res.render(`pages/search`, {articles, query});
  });

  router.get(`/login`, (_req, res, _next) => res.render(`pages/register`));
  router.get(`/register`, (_req, res, _next) => res.render(`pages/register`));

  return router;
};
