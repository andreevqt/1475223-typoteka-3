'use strict';

module.exports = (req, res, next) => {
  const {currentUser} = res.locals;
  const model = res.locals.article || res.locals.comment;
  if (model.author.id !== currentUser.id) {
    res.status(403).render(`errors/403`);
    return;
  }

  next();
};
