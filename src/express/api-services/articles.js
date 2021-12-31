
'use strict';

const Base = require(`src/express/api-services/base`);
const axios = require(`axios`);
const {Collection} = require(`../helpers`);

class Articles extends Base {
  async fetchByCat({id, ...params}) {
    const items = (await axios.get(`${this.url}/category/${id}`, {params})).data;
    return new Collection(items, items.totalPages, items.currentPage);
  }
}

module.exports = Articles;
