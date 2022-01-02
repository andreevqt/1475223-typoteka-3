'use strict';

const {Http} = require(`../../constants`);

const isCurrentUser = (req, res, next) => {
  const {currentUser} = res.locals;
  const userId = +req.params.userId;
  if (currentUser.id !== userId) {
    res.status(Http.FORBIDDEN).send(`Forbidden`);
    return;
  }

  next();
};

module.exports = isCurrentUser;
