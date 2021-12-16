'use strict';

const config = require(`../../../config`);
const Articles = require(`./Articles`);
const Categories = require(`./Categories`);
const Search = require(`./Search`);
const Comments = require(`./Comments`);
const Users = require(`./Users`);
const Status = require(`./Status`);
const {API_PREFIX} = require(`../../service/constants`);

const url = `${config.app.url}:${config.server.port}${API_PREFIX}`;

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
