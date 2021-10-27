'use strict';

const {API_PREFIX} = require(`../constants`);
const express = require(`express`);

const {router} = require(`../api/routes`);

const server = express();
server.use(express.json({
  limit: `20mb`
}));
server.use(API_PREFIX, router);

module.exports = server;
