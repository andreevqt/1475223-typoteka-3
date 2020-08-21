'use strict';
const {http} = require(`../../constants`);

module.exports = (services) => ({
  search: async (req, res) => {
    const {page, limit, rest} = req.locals.parsed;
    const {query} = req.query;
    const articles = await services
      .search.search(page, limit, {...rest, query});

    res.status(articles.items.length > 0 ? http.OK : http.NOT_FOUND)
      .json(articles);
  },
});
