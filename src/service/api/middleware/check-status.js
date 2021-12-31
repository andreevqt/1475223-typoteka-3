'use strict';

const config = require(`../../../../config`);
const {Http} = require(`../../constants`);

const checkStatus = (req, res, next) => {
  const {enabled} = config.server;

  if (req.path === `/api/status`) {
    next();
    return;
  }

  if (!enabled) {
    res.status(Http.SEVICE_UNAVAILABLE).send(`Service Unavailable`);
    return;
  }

  next();
};

module.exports = checkStatus;
