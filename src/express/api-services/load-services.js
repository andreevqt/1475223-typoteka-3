'use strict';

const config = require(`../../../config`);
const Articles = require(`./articles`);
const Categories = require(`./categories`);
const Search = require(`./search`);
const Comments = require(`./comments`);
const Users = require(`./users`);
const Status = require(`./status`);
const {API_PREFIX} = require(`../../service/constants`);

const url = config.server.url + API_PREFIX;

const articles = new Articles(url, `articles`);
const categories = new Categories(url, `categories`);
const search = new Search(url, `search`);
const comments = new Comments(url, `articles`);
const users = new Users(url, `users`);
const status = new Status(url, `status`);

module.exports = {
  articles,
  categories,
  search,
  comments,
  users,
  status
};
