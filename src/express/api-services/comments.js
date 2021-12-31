'use strict';

const axios = require(`axios`);
const Base = require(`src/express/api-services/base`);
const {Collection} = require(`../helpers`);

class Comments extends Base {
  async latest({limit, page = 1}) {
    const items = (await axios.get(`${this.baseUrl}/comments?order=desc&limit=${limit}&page=${page}`)).data;
    return new Collection(items, items.totalPages, items.currentPage);
  }

  async fetch(articleId, params) {
    return (await axios.get(`${this.url}/${articleId}/comments`, {params})).data;
  }

  async create(articleId, attrs) {
    return (await axios.post(`${this.url}/${articleId}/comments`, attrs)).data;
  }

  async delete(articleId, commentId) {
    return (await axios.delete(`${this.url}/${articleId}/comments/${commentId}`)).data;
  }
}

module.exports = Comments;
