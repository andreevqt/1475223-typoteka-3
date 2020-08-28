'use strict';

const {logger} = require(`../../../utils`).logger;
const config = require(`../../../../config`);
const express = require(`express`);
const {once} = require(`events`);
const api = require(`../../api/routes`);
const {ValidationError} = require(`express-validation`);
const {logRequests} = require(`../../api/middleware`);
const {
  API_PREFIX,
  http
} = require(`../../constants`);

const server = async (manager, args) => {
  const port = args[0] || config.server.port;

  const app = express();
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());
  app.use(logRequests);

  app.use(API_PREFIX, (req, res, next) => {
    logger.error(`[ROUTE]: ${req.method} ${req.url}`);
    next();
  }, api.router);

  app.use((req, res) => res.status(http.NOT_FOUND).send(`Not found`));

  app.use((err, req, res, _next) => {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json(err.details);
      return;
    }

    console.log(`[ERROR] ${err.stack}`);
    res.status(http.INTERNAL_SERVER_ERROR).send(`Internal server error`);
  });

  return once(app.listen(port), `listening`)
    .then(() => console.log(`[SERVER] Ожидаю соединений на ${port}`))
    .catch((err) => {
      logger.info(`[ERROR] ${err.msg}`);
    });
};

module.exports = server;
