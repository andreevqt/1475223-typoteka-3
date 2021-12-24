'use strict';
const {http} = require(`../../constants`);

module.exports = (services) => ({
  checkCategory: async (req, res, next, id) => {
    const category = await services.categories.findById(id);
    if (!category) {
      res.status(http.NOT_FOUND).send(`Not found`);
      return;
    }

    res.locals.category = category;
    next();
  },

  checkArticles: async (req, res, next) => {
    const {category} = res.locals;
    if (+category.dataValues.articlesCount > 0) {
      res.status(http.BAD_REQUEST).send(`Category ${category.name} has related articles`);
      return;
    }

    next();
  },

  list: async (req, res) => {
    const {page, limit, ...rest} = res.locals.parsed;
    const categories = await services.categories.paginate(page, limit, rest);
    res.status(http.OK).json(categories);
  },

  get: async (req, res) => {
    const {category} = res.locals;
    res.status(http.OK).json(category);
  },

  create: async (req, res) => {
    const category = await services.categories.create(req.body);
    res.status(http.CREATED).json(category);
  },

  update: async (req, res) => {
    const {category} = res.locals;
    const updated = await services.categories.update(category, req.body);
    res.status(http.OK).json(updated);
  },

  delete: async (req, res) => {
    const {category} = res.locals;
    const deleted = await services.categories.delete(category);
    res.status(http.OK).json(deleted);
  }
});
