'use strict';

const BaseService = require(`./BaseService`);

class SearchService extends BaseService {
  search(query = ``) {
    const regex = new RegExp(`${query}`, `i`);
    return this.items.filter((item) => regex.test(item.title));
  }
}

module.exports = SearchService;
