'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/add`, (_req, res, _next) => res.render(`pages/new-post`));
router.get(`/:id`, (_req, res, _next) => res.render(`pages/post`));
router.get(`/edit/:id`, (_req, res, _next) => res.render(`pages/new-post`));
router.get(`/category/:id`, (_req, res, _next) => res.render(`pages/all-categories`));

module.exports = router;
