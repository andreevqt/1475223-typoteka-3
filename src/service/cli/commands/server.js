'use strict';

const {logger} = require(`../../helpers`);
const config = require(`../../../../config`);
const express = require(`express`);
const http = require(`http`);
const {Server} = require(`socket.io`);
const {once} = require(`events`);
const api = require(`../../api/routes`);
const {ValidationError} = require(`express-validation`);
const {logRequests, checkStatus} = require(`../../api/middleware`);
const {translateMessage} = require(`../../../utils`);
const path = require(`path`);
const {
  API_PREFIX,
  Http
} = require(`../../constants`);

const server = async (manager, args) => {
  const port = args[0] || config.server.port;

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);

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

  app.use((req, res) => res.status(Http.NOT_FOUND).send(`Not found`));

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
    res.status(Http.INTERNAL_SERVER_ERROR).send(`Internal server error`);
  });

  io.on(`connection`, () => {
    socket.on(`COMMENT_CHANGED`);
  })

  return once(server.listen(port), `listening`)
    .then(() => console.log(`[SERVER] Ожидаю соединений на ${port}`))
    .catch((err) => {
      logger.info(`[ERROR] ${err.msg}`);
    });
};

module.exports = server;
