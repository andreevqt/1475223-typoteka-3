'use strict';

const axios = require(`axios`);
const {Collection} = require(`../helpers`);
const {Http} = require(`../../service/constants`);

class Base {
  constructor(baseUrl, route) {
    this.baseUrl = baseUrl;
    this.url = `${this.baseUrl}/${route}`;
  }

  async get(id) {
    try {
      const result = (await axios.get(`${this.url}/${id}`)).data;
      return result;
    } catch (err) {
      if (err.response && err.response.status === Http.NOT_FOUND) {
        return null;
      }

      throw err;
    }
  }

  async fetch(params) {
    const items = (await axios.get(this.url, {params})).data;
    return new Collection(items, items.totalPages, items.currentPage);
  }

  async create(attrs) {
    return (await axios.post(this.url, attrs)).data;
  }

  async update(id, attrs) {
    return (await axios.put(`${this.url}/${id}`, attrs)).data;
  }

  async delete(id) {
    return (await axios.delete(`${this.url}/${id}`)).data;
  }
}

module.exports = Base;
