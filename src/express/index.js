'use strict';

const config = require(`../../config`);
const express = require(`express`);
const path = require(`path`);
const {logger} = require(`../utils`).logger;
const {once} = require(`events`);
const {API_PREFIX} = require(`../service/constants`);
const axios = require(`axios`);
const {
  main,
  articles,
  my,
  categories
} = require(`./routes`);

const app = express();

const appUrl = `${config.APP_URL}:${config.APP_PORT}`;
const apiUrl = `${config.APP_URL}:${config.API_SERVER_PORT}${API_PREFIX}`;

app.set(`app_url`, appUrl);
app.set(`api_url`, apiUrl);

app.use(express.urlencoded({
  extended: true
}));

app.use(async (req, res, next) => {
  let cats = [];
  try {
    cats = (await axios.get(`${apiUrl}/categories`)).data;
  } catch (err) {
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

app.use(express.static(path.resolve(__dirname, config.APP_PUBLIC_FOLDER)));

app.use((req, res) => res.status(404).render(`errors/404`));
app.use((req, res) => res.status(500).render(`errors/500`));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

once(app.listen(config.APP_PORT), `listening`)
  .then(() => logger.info(`Ожидаю соединений на  ${config.APP_PORT}`));
