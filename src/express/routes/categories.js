'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (_req, res, _next) => res.send(`/categories`));

module.exports = router;
