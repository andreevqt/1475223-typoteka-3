'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/:id`, (_req, res, _next) => res.send(`/articles/:id`));
router.get(`/add`, (_req, res, _next) => res.send(`/articles/add`));
router.get(`/edit/:id`, (_req, res, _next) => res.send(`/articles/edit/:id`));
router.get(`/category/:id`, (_req, res, _next) => res.send(`/articles/category/:id`));

module.exports = router;
