'use strict';

const {nanoid} = require(`nanoid`);
const {ID_LEN} = require(`../constants`);
const {formatDate} = require(`../../utils`);
const BaseService = require(`./BaseService`);

class ArticleService extends BaseService {
  find(cb) {
    return this._items.filter(cb);
  }

  findAll() {
    return this._items;
  }

  findOne(id) {
    return this._items.find((article) => article.id === id);
  }

  create(attrs) {
    const defaults = {
      id: nanoid(ID_LEN),
      comments: [],
      category: [],
      createdDate: formatDate(new Date()),
      announce: null,
      title: null,
      fullText: null,
      picture: null
    };

    if (!Array.isArray(attrs.category)) {
      attrs.category = [attrs.category];
    }

    // temoprary
    attrs.picture = {
      orig: attrs.picture,
      big: attrs.picture,
      small: attrs.picture
    };

    const newArticle = {...defaults, ...attrs};
    this._items = [
      ...this._items,
      newArticle
    ];

    return newArticle;
  }

  delete(id) {
    const deleted = this._items.find((item) => item.id === id);

    if (!deleted) {
      return null;
    }

    this._items = this._items.filter((article) => article.id !== id);
    return deleted;
  }

  update(articleId, attrs) {
    let updated = null;
    this._items = this._items.map((article) => {
      if (article.id === articleId) {
        updated = {...article, ...attrs};
        return updated;
      }
      return article;
    });

    return updated;
  }
}

module.exports = ArticleService;
