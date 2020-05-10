'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (_req, res, _next) => res.render(`pages/all-categories`));

module.exports = router;
