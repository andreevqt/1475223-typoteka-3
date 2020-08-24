'use strict';

const config = require(`../../config`);
const express = require(`express`);
const path = require(`path`);
const {logger} = require(`../utils`).logger;
const {once} = require(`events`);
const {API_PREFIX, http} = require(`../service/constants`);
const api = require(`./api-services`);

const {
  main,
  articles,
  my,
  categories
} = require(`./routes`);

const app = express();

const appUrl = `${config.app.url}:${config.app.port}`;
const apiUrl = `${config.app.url}:${config.server.port}${API_PREFIX}`;

app.set(`app_url`, appUrl);
app.set(`api_url`, apiUrl);

app.use(express.urlencoded({
  extended: true
}));

app.use(async (req, res, next) => {
  let cats = [];
  try {
    cats = await api.categories.fetch();
  } catch (err) {
    console.log(err);
    logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
  }
  res.locals.categories = cats;
  res.locals.formData = {
    action: `/articles/add`,
    category: []
  };
  next();
});

// routes
app.use(`/`, main(app));
app.use(`/my`, my(app));
app.use(`/articles`, articles(app));
app.use(`/categories`, categories(app));

app.use(express.static(path.resolve(__dirname, `public`)));

app.use((req, res) => res.status(http.NOT_FOUND).render(`errors/404`));
app.use((req, res) => res.status(http.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

once(app.listen(config.app.port), `listening`)
  .then(() => logger.info(`Ожидаю соединений на  ${config.app.port}`));
