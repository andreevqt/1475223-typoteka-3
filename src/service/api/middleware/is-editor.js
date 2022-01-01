'use strict';

const {Http} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {currentUser} = res.locals;
  if (!currentUser.isEditor) {
    res.status(Http.FORBIDDEN).send(`Forbidden`);
    return;
  }
  next();
};
