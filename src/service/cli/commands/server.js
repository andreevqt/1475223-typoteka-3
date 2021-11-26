'use strict';

const {logger} = require(`../../helpers`);
const config = require(`../../../../config`);
const express = require(`express`);
const {once} = require(`events`);
const api = require(`../../api/routes`);
const {ValidationError} = require(`express-validation`);
const {logRequests, checkStatus} = require(`../../api/middleware`);
const {translateMessage} = require(`../../../utils`);
const path = require(`path`);
const {
  API_PREFIX,
  http
} = require(`../../constants`);

const server = async (manager, args) => {
  const port = args[0] || config.server.port;

  const app = express();
  app.use(express.urlencoded({
    extended: true,
  }));

  app.use(express.json({
    limit: `20mb`
  }));

  app.use(logRequests);
  app.use(checkStatus);

  app.use(API_PREFIX, (req, res, next) => {
    logger.error(`[ROUTE]: ${req.method} ${req.url}`);
    next();
  }, api.router);

  app.use(express.static(path.resolve(__dirname, `../../public`)));

  app.use((req, res) => res.status(http.NOT_FOUND).send(`Not found`));

  app.use((err, req, res, _next) => {
    if (err instanceof ValidationError) {
      const results = err.details;
      const errors = Object.keys(results)
        .reduce((acc, parameter) => {
          return ({
            ...acc,
            [parameter]: results[parameter].reduce(
                (inner, el) => ({...inner, [el.context.key]: translateMessage(el)}),
                {}
            )
          });
        }, {});
      res.status(err.statusCode).json(errors.body);
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
