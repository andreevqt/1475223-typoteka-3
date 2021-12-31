'use strict';

module.exports = (req, res, next) => {
  const {currentUser} = res.locals;
  const userId = +req.params.userId;
  if (currentUser.id !== userId) {
    res.status(403).send(`Forbidden`);
    return;
  }

  next();
};
