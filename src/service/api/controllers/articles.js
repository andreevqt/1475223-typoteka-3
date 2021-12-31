'use strict';
const {Http} = require(`../../constants`);

module.exports = (services) => ({
  checkArticle: async (req, res, next, id) => {
    const article = await services.articles.findById(id);
    if (!article) {
      res.status(Http.NOT_FOUND).send(`Not found`);
      return;
    }

    res.locals.article = article;
    next();
  },

  checkComment: async (req, res, next, id) => {
    const {article} = res.locals;

    const comment = await services.comments.findOne({
      where: {
        id,
        articleId: article.id
      }
    });

    if (!comment) {
      res.status(Http.NOT_FOUND).send(`Not found`);
      return;
    }

    res.locals.comment = comment;
    next();
  },

  list: async (req, res) => {
    const {page, limit, ...rest} = res.locals.parsed;
    const articles = await services.articles.paginate(page, limit, rest);
    res.status(Http.OK).json(articles);
  },

  get: (req, res) => {
    const {article} = res.locals;
    res.status(Http.OK).json(article);
  },

  create: async (req, res) => {
    const article = await services.articles.create(req.body);
    res.status(Http.CREATED).json(article);
  },

  update: async (req, res) => {
    const {article} = res.locals;
    const updated = await services.articles.update(article, req.body);
    res.status(Http.OK).json(updated);
  },

  delete: async (req, res) => {
    const {article} = res.locals;
    const deleted = await services.articles.delete(article);
    res.status(Http.OK).json(deleted);
  },

  comments: {
    list: async (req, res) => {
      const {article} = res.locals;
      const comments = await services.comments.findAll(article);
      res.status(Http.OK).json(comments);
    },

    create: async (req, res) => {
      const {article} = res.locals;
      const comment = await services.comments.create(article, req.body);
      res.status(Http.CREATED).json(comment);
    },

    delete: async (req, res) => {
      const {comment} = res.locals;
      const deleted = await services.comments.delete(comment);
      res.status(Http.OK).json(deleted);
    }
  },

  categories: {
    get: async (req, res) => {
      const {categoryId} = req.params;
      const {page, limit} = res.locals.parsed;

      const articles = await services.articles.findByCategory(page, limit, categoryId);
      if (!articles) {
        res.status(Http.NOT_FOUND).send(`404 Not found`);
        return;
      }

      res.status(Http.OK).json(articles);
    },
  }
});
