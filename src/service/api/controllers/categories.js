'use strict';
const {http} = require(`../../constants`);

module.exports = (categoryService) => ({
  list: (req, res) => {
    const categories = categoryService.findAll();
    res.status(http.OK).json(categories);
  },
});
