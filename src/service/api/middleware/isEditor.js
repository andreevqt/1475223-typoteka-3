'use strict';

module.exports = (req, res, next) => {
  const {currentUser} = res.locals;
  if (!currentUser.isEditor) {
    res.status(403).send(`Forbidden`);
    return;
  }
  next();
};
