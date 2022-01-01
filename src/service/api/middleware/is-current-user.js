'use strict';

const {Http} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {currentUser} = res.locals;
  const userId = +req.params.userId;
  if (currentUser.id !== userId) {
    res.status(Http.FORBIDDEN).send(`Forbidden`);
    return;
  }

  next();
};
