'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (_req, res, _next) => res.render(`pages/index`));
router.get(`/search`, (_req, res, _next) => res.render(`pages/search`));
router.get(`/login`, (_req, res, _next) => res.render(`pages/register`));
router.get(`/register`, (_req, res, _next) => res.render(`pages/register`));

module.exports = router;
