'use strict';

const Base = require(`src/express/api-services/base`);

class Categories extends Base {
  async fetch({hideEmpty = true, ...rest}) {
    const result = await super.fetch(rest);
    if (hideEmpty) {
      result.items = result.items.filter((cat) => cat.articlesCount > 0);
    }
    return result;
  }
}

module.exports = Categories;
