'use strict';

const {Router} = require(`express`);
const router = new Router();

module.exports = (_app) => {
  router.get(`/`, async (req, res, _next) => {
    res.render(`pages/all-categories`);
  });
  return router;
};
