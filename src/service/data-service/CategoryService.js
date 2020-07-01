'use strict';

const BaseService = require(`./BaseService`);

class CategoryService extends BaseService {
  getCategories() {
    const categories = this._items
      .reduce((acc, item) => ([...acc, ...item.category]), []);

    return [...new Set(categories)];
  }

  findAll() {
    return this.getCategories();
  }

  findOne(category) {
    const categories = this.getCategories();
    return categories.find((cat) => cat === category);
  }
}

module.exports = CategoryService;
