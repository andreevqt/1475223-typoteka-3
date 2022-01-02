'use strict';

const redirectIfUser = (_req, res, next) => {
  if (res.locals.currentUser) {
    res.redirect(`back`);
    return;
  }

  next();
};

module.exports = redirectIfUser;
