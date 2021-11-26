'use strict';

const BaseService = require(`./BaseService`);

class CommentService extends BaseService {
  async findAll(article) {
    return this._model.findAll({
      ...this._model.getQueryOptions(),
      where: {
        ...(article && {articleId: article.id})
      }
    });
  }

  async create(article, attrs) {
    const articleId = typeof article === `object` ? article.id : article;
    attrs.articleId = articleId;

    /* const user = await this._services.users.findById(attrs.authorId);
    attrs.authorId = user.id; */

    const comment = await this._model.create(attrs);
    return comment.reload();
  }

  async update(comment, attrs) {
    await comment.update({text: attrs.text});
    return comment.reload();
  }
}

module.exports = CommentService;
