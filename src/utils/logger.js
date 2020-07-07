'use strict';
const pino = require(`pino`);

let logger = pino({
  name: `pino-and-express`,
  level: process.env.LOG_LEVEL || `info`,
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
