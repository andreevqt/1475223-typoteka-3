'use strict';

const {Router} = require(`express`);
const router = new Router();
const axios = require(`axios`);
const {logger} = require(`../../utils`).logger;

module.exports = (app) => {
  const url = app.get(`api_url`);

  router.get(`/`, async (req, res) => {
    let articles = [];

    try {
      const results = (await axios.get(`${url}/articles`)).data;
      articles = results.slice(0, 4);
    } catch (err) {
      logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
    }

    res.render(`pages/my`, {articles});
  });

  router.get(`/comments`, async (req, res, _next) => {
    let articles = [];

    try {
      const results = (await axios.get(`${url}/articles`)).data;
      articles = results.slice(0, 3);
    } catch (err) {
      logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
    }

    res.render(`pages/comments`, {articles});
  });

  return router;
};
