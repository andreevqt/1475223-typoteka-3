'use strict';

const {Router} = require(`express`);

const articles = require(`./articles`);
const search = require(`./search`);
const categories = require(`./categories`);
const comments = require(`./comments`);
const {Article, Category, User, Comment} = require(`../../models`);

const {
  ArticleService,
  CommentService,
  SearchService,
  CategoryService,
  UserService
} = require(`../../data-service`);

const services = {};

services.users = new UserService(User, services);
services.categories = new CategoryService(Category, services);
services.articles = new ArticleService(Article, services);
services.comments = new CommentService(Comment, services);
services.search = new SearchService(null, services);

const router = new Router();

articles(router, services);
search(router, services);
categories(router, services);
comments(router, services);

module.exports = {
  router,
  services
};
