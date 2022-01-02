'use strict';

const {Http} = require(`../../service/constants`);

const checkAuthor = (req, res, next) => {
  const {currentUser} = res.locals;
  const model = res.locals.article || res.locals.comment;
  if (model.author.id !== currentUser.id) {
    res.status(Http.FORBIDDEN).render(`errors/403`);
    return;
  }

  next();
};

module.exports = checkAuthor;
