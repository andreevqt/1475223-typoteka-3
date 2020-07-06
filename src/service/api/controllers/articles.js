'use strict';
const {http} = require(`../../constants`);

module.exports = (articleService, commentService) => ({
  checkArticle: (req, res, next, id) => {
    const article = articleService.findOne(id);
    if (!article) {
      res.status(http.NOT_FOUND).send(`Not found`);
      return;
    }
    req.locals = {article};
    next();
  },

  checkComment: (req, res, next, id) => {
    const {article} = req.locals;
    const hasComment = article.comments.some((comment) => comment.id === id);
    if (!hasComment) {
      res.status(http.NOT_FOUND).send(`Not found`);
      return;
    }
    next();
  },

  list: (req, res) => {
    const articles = articleService.findAll();
    res.status(http.OK).json(articles);
  },

  get: (req, res) => {
    const {article} = req.locals;
    res.status(http.OK).json(article);
  },

  create: (req, res) => {
    const article = articleService.create(req.body);
    res.status(http.CREATED).json(article);
  },

  update: (req, res) => {
    const {article} = req.locals;
    const updated = articleService.update(article.id, req.body);
    res.status(http.OK).json(updated);
  },

  delete: (req, res) => {
    const {article} = req.locals;
    const deleted = articleService.delete(article.id);
    res.status(http.OK).json(deleted);
  },

  comments: {
    list: (req, res) => {
      const {article} = req.locals;
      const comments = article.comments;
      res.status(http.OK).json(comments);
    },

    create: (req, res) => {
      const {article} = req.locals;
      const comment = commentService.create(article.id, req.body);
      res.status(http.CREATED).send(comment);
    },

    delete: (req, res) => {
      const {article} = req.locals;
      const {commentId} = req.params;
      const deleted = commentService.delete(article.id, commentId);
      res.status(http.OK).send(deleted);
    }
  }
});
