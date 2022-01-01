'use strict';

const articles = require(`./articles`);
const categories = require(`./categories`);
const search = require(`./search`);
const comments = require(`./comments`);
const status = require(`./status`);
const users = require(`./users`);

module.exports = {
  articles,
  categories,
  search,
  comments,
  status,
  users
};
