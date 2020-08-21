'use strict';
const {http} = require(`../../constants`);

module.exports = (services) => ({
  checkCategory: async (req, res, next, id) => {
    const category = await services.categories.findById(id);
    if (!category) {
      res.status(http.NOT_FOUND).send(`Not found`);
      return;
    }

    req.locals = {category};
    next();
  },

  list: async (req, res) => {
    const {page, limit} = req.locals.parsed;
    const categories = await services.categories.paginate(page, limit);
    res.status(http.OK).json(categories);
  },

  get: async (req, res) => {
    const {category} = req.locals;
    res.status(http.OK).json(category);
  }
});
