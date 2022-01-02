'use strict';

const checkAuth = (req, res, next) => {
  if (!res.locals.currentUser) {
    res.redirect(`/login`);
    return;
  }

  next();
};

module.exports = checkAuth;
