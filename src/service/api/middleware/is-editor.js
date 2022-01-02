'use strict';

const {Http} = require(`../../constants`);

const isEditor = (_req, res, next) => {
  const {currentUser} = res.locals;
  if (!currentUser.isEditor) {
    res.status(Http.FORBIDDEN).send(`Forbidden`);
    return;
  }
  next();
};

module.exports = isEditor;
