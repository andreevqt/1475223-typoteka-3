'use strict';
const {http} = require(`../../constants`);

module.exports = (services) => ({
  checkArticle: async (req, res, next, id) => {
    const article = await services.articles.findById(id);
    if (!article) {
      res.status(http.NOT_FOUND).send(`Not found`);
      return;
    }

    req.locals = {article};
    next();
  },

  checkComment: async (req, res, next, id) => {
    const {article} = req.locals;

    const comment = await services.comments.findOne({
      where: {
        id,
        articleId: article.id
      }
    });

    if (!comment) {
      res.status(http.NOT_FOUND).send(`Not found`);
      return;
    }

    req.locals = req.locals || {};
    req.locals.comment = comment;
    next();
  },

  list: async (req, res) => {
    const {page, limit, ...rest} = req.locals.parsed;
    const articles = await services.articles.paginate(page, limit, rest);
    res.status(http.OK).json(articles);
  },

  get: (req, res) => {
    const {article} = req.locals;
    res.status(http.OK).json(article);
  },

  create: async (req, res) => {
    const article = await services.articles.create(req.body);
    res.status(http.CREATED).json(article);
  },

  update: async (req, res) => {
    const {article} = req.locals;
    const updated = await services.articles.update(article, req.body);
    res.status(http.OK).json(updated);
  },

  delete: async (req, res) => {
    const {article} = req.locals;
    const deleted = await services.articles.delete(article);
    res.status(http.OK).json(deleted);
  },

  comments: {
    list: async (req, res) => {
      const {article} = req.locals;
      const comments = await services.comments.findAll(article);
      res.status(http.OK).json(comments);
    },

    create: async (req, res) => {
      const {article} = req.locals;
      const comment = await services.comments.create(article, req.body);
      res.status(http.CREATED).json(comment);
    },

    delete: async (req, res) => {
      const {comment} = req.locals;
      const deleted = await services.comments.delete(comment);
      res.status(http.OK).json(deleted);
    }
  },

  categories: {
    get: async (req, res) => {
      const {categoryId} = req.params;
      const {page, limit} = req.locals.parsed;

      const articles = await services.articles.findByCategory(page, limit, categoryId);
      if (!articles) {
        res.status(http.NOT_FOUND).send(`404 Not found`);
        return;
      }

      res.status(http.OK).json(articles);
    },
  }
});
