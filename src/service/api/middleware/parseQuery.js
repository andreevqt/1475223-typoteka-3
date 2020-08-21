'use strict';

const {Sequelize} = require(`sequelize`);

const allowedOrder = [`asc`, `desc`, `popular`];

const allowed = (key) => {
  return allowedOrder.includes(key.toLowerCase());
};

const makeOrder = (order) => {
  if (order === `popular`) {
    return [Sequelize.literal(`"commentsCount"`), `desc`];
  }

  if (order === `asc`) {
    return [`createdAt`, `asc`];
  }

  if (order === `desc`) {
    return [`createdAt`, `desc`];
  }

  return [];
};

module.exports = (req, _res, next) => {
  const {query} = req;

  let parsed = {
    order: [[`createdAt`, `desc`]]
  };

  const order = query[`order`];

  if (order && allowed(order)) {
    parsed.order = [makeOrder(order)];
  }

  const limit = query[`limit`];

  if (limit) {
    parsed.limit = limit;
  }

  const page = query[`page`];
  if (page) {
    parsed.page = +page;
  }

  req.locals = req.locals || {};
  req.locals.parsed = parsed;
  next();
};
