'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (_req, res, _next) => res.send(`/`));
router.get(`/search`, (_req, res, _next) => res.send(`/search`));
router.get(`/login`, (_req, res, _next) => res.send(`/login`));
router.get(`/register`, (_req, res, _next) => res.send(`/register`));

module.exports = router;
