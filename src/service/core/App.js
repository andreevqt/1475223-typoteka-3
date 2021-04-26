'use strict';

const config = require(`../../../config`);
const express = require(`express`);
const {Router} = require(`express`);

const {once} = require(`events`);

const {API_PREFIX, http} = require(`../constants`);
const {logger} = require(`../../utils`);
const {createDatabase} = require(`./database`);
const loadModules = require(`./load/loadModules`);
const path = require(`path`);
const bootstrap = require(`./load/bootstrap`);

class App {
  constructor(opts = {}) {
    const {port} = opts;

    this.config = config;
    if (port) {
      this.config.set(`server.port`, port);
    }

    this.app = express();
    this.router = new Router();
    this.log = logger({}, `logs/server.log`);
    this.dir = path.resolve(__dirname, `..`);

    this.isLoaded = false;
  }

  async load() {
    if (this.isLoaded) {
      return;
    }

    const modules = await loadModules(this);
    this.api = modules.api;

    await bootstrap(this);

    this.db = createDatabase(this);
    await this.db.init();

    this.app.use(express.urlencoded({
      extended: true
    }));

    this.app.use(express.json());
    this.app.use((_req, res) => res.status(http.NOT_FOUND).send(`Not found`))

    this.isLoaded = true;
  }

  async start() {
    if (!this.isLoaded) {
      await this.load();
    }

    await this.listen();
  }

  async listen() {
    return once(this.app.listen(this.port), `listening`)
      .then(() => this.log.info(`[SERVER] Ожидаю соединений на ${this.port}`))
      .catch((err) => {
        this.log.error(`[ERROR] ${err.msg}`);
      });
  }
}

module.exports = (opts) => {
  const app = new App(opts);
  global.app = app;
  return app;
};
