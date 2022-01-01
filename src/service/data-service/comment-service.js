'use strict';

const BaseService = require(`./base-service`);

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

    const comment = await this._model.create(attrs);
    return comment.reload();
  }

  static async update(comment, attrs) {
    await comment.update({text: attrs.text});
    return comment.reload();
  }
}

module.exports = CommentService;
