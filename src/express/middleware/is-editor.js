'use strict';

const {Http} = require(`../../service/constants`);

const isEditor = (_req, res, next) => {
  const {currentUser} = res.locals;
  if (!currentUser || !currentUser.isEditor) {
    res.status(Http.FORBIDDEN).render(`errors/403`);
    return;
  }
  next();
};

module.exports = isEditor;
