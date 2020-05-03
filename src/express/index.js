'use strict';

const express = require(`express`);
const {
  main,
  articles,
  my,
  categories
} = require(`./routes`);

const DEFAULT_PORT = 8080;

const app = express();

// routes
app.use(`/`, main);
app.use(`/my`, my);
app.use(`/articles`, articles);
app.use(`/categories`, categories);

app.listen(DEFAULT_PORT);
