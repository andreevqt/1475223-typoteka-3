'use strict';

const {http} = require(`../../service/constants`);

module.exports = (req, res, next) => {
  const {currentUser} = res.locals;
  if (!currentUser || !currentUser.isEditor) {
    res.status(http.FORBIDDEN).render(`errors/403`);
    return;
  }
  next();
};
