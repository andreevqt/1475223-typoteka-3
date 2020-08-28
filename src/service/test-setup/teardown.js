'use strict';

const db = require(`../models`).service;

const teardown = async () => {
  await db.close();
};

module.exports = teardown;
