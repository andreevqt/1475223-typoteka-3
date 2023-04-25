'use strict';

const config = require(`../../config`);
const express = require(`express`);
const path = require(`path`);
const { logger } = require(`./helpers`);
const { once } = require(`events`);
const { API_PREFIX, Http, Events } = require(`../service/constants`);
const api = require(`./api-services`);
const auth = require(`./middleware/auth`);
const checkAuth = require(`./middleware/check-auth`);
const isEditor = require(`./middleware/is-editor`);
const csrf = require(`./middleware/csrf`);
const cookieParser = require(`cookie-parser`);
const {
  main,
  articles,
  my,
  categories
} = require(`./routes`);

const app = express();

const appUrl = config.app.url;
const apiUrl = config.server.url + API_PREFIX;
const wsUrl = config.server.url;

app.set(`app_url`, appUrl);
app.set(`api_url`, apiUrl);

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser(config.app.key));
app.use(express.static(path.resolve(__dirname, `public`)));
app.use(csrf);

app.use(async (req, res, next) => {
  const status = await api.status.getStatus();
  next(status === `down` && new Error(`API server недоступен`));
});

app.use(async (req, res, next) => {
  let cats = [];
  try {
    cats = await api.categories.fetch({
      order: `desc`,
      limit: 50
    });
  } catch (err) {
    if (err.response) {
      logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
    }
  }
  res.locals.meta = {
    apiUrl,
    wsUrl,
    Events,
  };

  res.locals.categories = cats;
  res.locals.formData = {
    action: `/articles/add`,
    category: []
  };
  next();
});

app.use(auth);
// routes
app.use(`/`, main(app));
app.use(`/my`, [checkAuth, isEditor], my(app));
app.use(`/articles`, articles(app));
app.use(`/categories`, [checkAuth, isEditor], categories(app));

app.use((_req, res) => res.status(Http.NOT_FOUND).render(`errors/404`));
app.use((err, _req, res, _next) => res.status(Http.INTERNAL_SERVER_ERROR).render(`errors/500`, { message: err.message }));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

once(app.listen(config.app.port), `listening`)
  .then(() => logger.info(`Ожидаю соединений на  ${config.app.port}`));
