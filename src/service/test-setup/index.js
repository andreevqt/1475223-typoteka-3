'use strict';

const data = require(`./data`);
const server = require(`./server`);
const teardown = require(`./teardown`);
const setup = require(`./setup`);

module.exports = {
  data,
  server,
  teardown,
  setup,
};
