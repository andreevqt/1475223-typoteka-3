'use strict';

const BaseService = require(`./BaseService`);

class CommentService extends BaseService {
  async findAll(article) {
    return this._model.findAll({
      ...this._model.getQueryOptions(),
      where: {
        articleId: article.id
      }
    });
  }

  async create(article, attrs) {
    const articleId = typeof article === `object` ? article.id : article;

    const user = await this._services.users.random();
    attrs.authorId = user.id;
    attrs.articleId = articleId;

    const comment = await this._model.create(attrs);
    return comment.reload();
  }

  async update(comment, attrs) {
    await comment.update({text: attrs.text});
    return comment.reload();
  }
}

module.exports = CommentService;
