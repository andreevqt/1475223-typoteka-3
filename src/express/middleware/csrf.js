'use strict';

const csurf = require(`csurf`);

const csrf = [
  csurf({cookie: true}),
  (req, res, next) => {
    res.locals.csrf = req.csrfToken();
    next();
  }
];

module.exports = csrf;
