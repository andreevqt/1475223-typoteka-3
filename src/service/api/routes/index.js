'use strict';

const {Router} = require(`express`);
const {getMocks} = require(`../../../utils`);

const articles = require(`./articles`);
const categories = require(`./categories`);
const search = require(`./search`);

const {
  ArticleService,
  CategoryService,
  CommentService,
  SearchService
} = require(`../../data-service`);

let mocks = [];

const articleService = new ArticleService(mocks);
const categoryService = new CategoryService(mocks);
const commentService = new CommentService(articleService);
const searchService = new SearchService(mocks);

const router = new Router();

articles(router, articleService, commentService);
categories(router, categoryService);
search(router, searchService);

const loadData = async () => {
  mocks = await getMocks();
  articleService.items = mocks;
  categoryService.items = mocks;
  searchService.items = mocks;
};

module.exports = {
  router,
  services: {
    articleService,
    categoryService,
    commentService,
    searchService
  },
  loadData
};
