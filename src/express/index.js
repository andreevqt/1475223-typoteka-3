'use strict';

const express = require(`express`);
const path = require(`path`);
const {
  main,
  articles,
  my,
  categories
} = require(`./routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

// routes
app.use(`/`, main);
app.use(`/my`, my);
app.use(`/articles`, articles);
app.use(`/categories`, categories);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use((req, res) => res.status(404).render(`errors/404`));
app.use((req, res) => res.status(500).render(`errors/500`));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
