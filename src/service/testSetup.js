'use strict';

const express = require(`express`);
const api = require(`./api/routes`);
const {API_PREFIX} = require(`./constants`);

const app = express();
app.use(express.json());
app.use(API_PREFIX, api.router);

module.exports = {
  app,
  services: api.services,
};
