'use strict';
const {Http} = require(`../../constants`);

const search = (services) => ({
  search: async (req, res) => {
    const {page, limit, rest} = res.locals.parsed;
    const {query} = req.query;
    const articles = await services
      .search.search(page, limit, {...rest, query});

    res.status(articles.items.length > 0 ? Http.OK : Http.NOT_FOUND)
      .json(articles);
  },
});

module.exports = search;
