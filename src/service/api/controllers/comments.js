'use strict';
const {Http} = require(`../../constants`);

module.exports = (services) => ({
  list: async (req, res) => {
    const {page, limit, ...rest} = res.locals.parsed;
    const comments = await services.comments.paginate(page, limit, rest);
    res.status(Http.OK).json(comments);
  }
});
