'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (_req, res, _next) => res.render(`pages/my`));
router.get(`/comments`, (_req, res, _next) => res.render(`pages/comments`));

module.exports = router;
