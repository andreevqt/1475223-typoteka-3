'use strict';

const {Http} = require(`../../service/constants`);

module.exports = (req, res, next) => {
  const {currentUser} = res.locals;
  if (!currentUser || !currentUser.isEditor) {
    res.status(Http.FORBIDDEN).render(`errors/403`);
    return;
  }
  next();
};
