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
const mountRoutes = require(`./mount/mountRoutes`);
const createEntityService = require(`./services/entityService`);

class App {
  constructor(opts = {}) {
    const {port, dir} = opts;

    this.config = config;
    if (port) {
      this.config.set(`server.port`, port);
    }

    this.app = express();
    this.router = new Router();
    this.log = logger({}, `logs/server.log`);
    this.dir = dir || path.resolve(__dirname, `..`);
    this.models = new Map;

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

    this.entityService = createEntityService({db: this.db});

    this.app.use(express.urlencoded({
      extended: true
    }));

    this.app.use(express.json());

    // mount routes
    mountRoutes(this);

    this.app.use(API_PREFIX, this.router);
    this.app.use((_req, res) => res.status(http.NOT_FOUND).send(`Not found`))

    this.isLoaded = true;
  }

  async destroy() {
    await this.db.destroy();
  }

  async start() {
    if (!this.isLoaded) {
      await this.load();
    }

    await this.listen();
  }

  async listen() {
    const port = this.config.get(`server.port`);
    return once(this.app.listen(port), `listening`)
      .then(() => this.log.info(`[SERVER] Ожидаю соединений на ${port}`))
      .catch((err) => {
        this.log.error(`[ERROR] ${err.msg}`);
      });
  }

  async query(entity) {
    return this.db.query(entity);
  }
}

module.exports = (opts) => {
  const app = new App(opts);
  global.app = app;
  return app;
};
