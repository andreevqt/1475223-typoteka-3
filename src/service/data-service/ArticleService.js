'use strict';

const BaseService = require(`./BaseService`);
const imageService = require(`../image-service`);

class ArticleService extends BaseService {
  async getCategory(ids) {
    return this._services.categories.find({
      where: {
        id: ids
      }
    });
  }

  async create(attrs) {
    const attrsCopy = {...attrs};
    if (!Array.isArray(attrsCopy.category)) {
      attrsCopy.category = [attrsCopy.category];
    }

    if (attrsCopy.picture) {
      attrsCopy.picture = await imageService.makeThumbnail(attrsCopy.picture, 460, 240);
    }

    if (!attrsCopy.authorId) {
      attrsCopy.authorId = (await this._services.users.random()).id;
    }

    const categories = await this.getCategory(attrsCopy.category);
    if (!categories.length) {
      return null;
    }

    const article = await this._model.create(attrsCopy);
    await article.setCategory(categories);

    return article.reload();
  }

  async update(article, attrs) {
    let categories;
    if (attrs.category) {
      categories = await this.getCategory(attrs.category);
    }

    await imageService.removeThumbnail(offer.picture.small);
    attrs.picture = attrs.picture
      ? await imageService.makeThumbnail(attrs.picture)
      : undefined;

    await article.update(attrs);

    if (categories) {
      await article.setCategory(categories);
    }

    return article.reload();
  }

  async findByCategory(page, limit, categoryId) {
    return this._model.findByCategory(page, limit, categoryId);
  }
}

module.exports = ArticleService;
