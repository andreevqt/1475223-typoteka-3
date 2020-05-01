'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (_req, res, _next) => res.send(`/my`));
router.get(`/comments`, (_req, res, _next) => res.send(`/my/comments`));

module.exports = router;
