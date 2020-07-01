'use strict';
const {http} = require(`../../constants`);

module.exports = (searchService) => ({
  search: (req, res) => {
    const {query} = req.query;
    const articles = searchService.search(query);
    
    res.status(articles.length > 0 ? http.OK : http.NOT_FOUND).json(articles);
  },
});
