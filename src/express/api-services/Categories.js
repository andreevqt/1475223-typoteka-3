'use strict';

const Base = require(`./Base`);

class Categories extends Base {

  async fetch(params) {
    const result = await super.fetch(params);
    result.items = result.items.filter((cat) => cat.articlesCount > 0);
    return result;
  }
}

module.exports = Categories;
