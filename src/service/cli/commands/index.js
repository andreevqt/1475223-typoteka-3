'use strict';

const generate = require(`./generate`);
const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const filldb = require(`./fill-db`);
const secret = require(`./secret`);

module.exports = {
  generate,
  help,
  version,
  server,
  fill,
  filldb,
  secret
};
