'use strict';

const {logger} = require(`../../../utils`).logger;

const logRequests = (req, res, next) => {
  logger.debug(`[REQUEST]: ${req.url}`);

  const afterResponse = () => {
    logger.info(`[RESPONSE]: ${res.statusCode}`);
    if (res.statusCode === 404) {
      logger.info(`[ERROR]: 404 - not found. Url: ${req.url}`);
    }
    res.removeListener(`finish`, afterResponse);
    res.removeListener(`close`, afterResponse);
  };

  res.on(`close`, afterResponse);
  res.on(`finish`, afterResponse);

  next();
};

module.exports = logRequests;
