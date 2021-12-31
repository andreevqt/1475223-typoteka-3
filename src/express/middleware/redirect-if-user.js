'use strict';

module.exports = (req, res, next) => {
  if (res.locals.currentUser) {
    res.redirect(`back`);
    return;
  }

  next();
};
