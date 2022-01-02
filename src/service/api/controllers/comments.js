'use strict';
const {Http} = require(`../../constants`);

const commentsController = (services) => ({
  list: async (req, res) => {
    const {page, limit, ...rest} = res.locals.parsed;
    const comments = await services.comments.paginate(page, limit, rest);
    res.status(Http.OK).json(comments);
  }
});

module.exports = commentsController;
