'use strict';

const csrf = require(`csurf`);

module.exports = [
  csrf({cookie: true}),
  (req, res, next) => {
    res.locals.csrf = req.csrfToken();
    next();
  }
];
