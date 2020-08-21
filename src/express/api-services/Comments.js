'use strict';

const axios = require(`axios`);
const Base = require(`./Base`);
const {Collection} = require(`../helpers`);

class Comments extends Base {
  async latest(limit = 5) {
    const items = (await axios.get(`${this.baseUrl}/comments?order=latest&limit=${limit}`)).data;
    return new Collection(items);
  }

  async fetch(articleId, params) {
    return (await axios.get(`${this.url}/${articleId}/comments`, {params})).data;
  }

  async create(offerId, attrs) {
    return (await axios.post(`${this.url}/${offerId}/comments`, attrs)).data;
  }
}

module.exports = Comments;
