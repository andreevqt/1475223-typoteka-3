'use strict';

const {nanoid} = require(`nanoid`);
const {ID_LEN} = require(`../constants`);

class CommentService {
  constructor(articleService) {
    this.articleService = articleService;
  }

  findAll(offerId) {
    const article = this.articleService.findOne(offerId);
    if (!article) {
      return null;
    }

    return article.comments;
  }

  create(articleId, attrs) {
    const article = this.articleService.findOne(articleId);
    if (!article) {
      return null;
    }

    const comment = {id: nanoid(ID_LEN), ...attrs};
    article.comments = [...article.comments, comment];

    return comment;
  }

  delete(offerId, commentId) {
    const article = this.articleService.findOne(offerId);
    if (!article) {
      return null;
    }

    let deleted = null;

    article.comments = article.comments.filter((comment) => {
      if (comment.id === commentId) {
        deleted = comment;
        return false;
      }
      return true;
    });

    return deleted;
  }

  update(articleId, commentId, attrs) {
    const article = this.articleService.findOne(articleId);
    if (!article) {
      return null;
    }

    let updated = null;
    article.comments = article.comments.map((comment) => {
      if (comment.id === commentId) {
        updated = {...comment, ...attrs};
        return updated;
      }
      return comment;
    });

    return updated;
  }
}

module.exports = CommentService;
