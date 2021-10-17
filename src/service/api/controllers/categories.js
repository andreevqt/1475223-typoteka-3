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
    const {page, limit, ...rest} = req.locals.parsed;
    const categories = await services.categories.paginate(page, limit, rest);
    res.status(http.OK).json(categories);
  },

  get: async (req, res) => {
    const {category} = req.locals;
    res.status(http.OK).json(category);
  },

  create: async (req, res) => {
    const category = await services.categories.create(req.body);
    res.status(http.CREATED).json(category);
  },

  update: async (req, res) => {
    const {category} = req.locals;
    const updated = await services.categories.update(category, req.body);
    res.status(http.OK).json(updated);
  },

  delete: async (req, res) => {
    const {category} = req.locals;
    const deleted = await services.categories.delete(category);
    res.status(http.OK).json(deleted);
  }
});
