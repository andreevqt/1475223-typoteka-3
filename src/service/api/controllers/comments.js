'use strict';
const {http} = require(`../../constants`);

module.exports = (services) => ({
  list: async (req, res) => {
    const {page, limit} = req.locals.parsed;
    const comments = await services.comments.paginate(page, limit);
    res.status(http.OK).json(comments);
  }
});
