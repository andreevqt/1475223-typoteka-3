'use strict';

const ArticleService = require(`./article-service`);
const CommentService = require(`./comment-service`);
const CategoryService = require(`./category-service`);
const SearchService = require(`./search-service`);
const UserService = require(`./user-service`);
const JWTService = require(`./jwt-service`);

module.exports = {
  ArticleService,
  CommentService,
  CategoryService,
  SearchService,
  UserService,
  JWTService
};
