'use strict';
const pino = require(`pino`);

const defaults = {
  name: `pino-and-express`,
  level: process.env.LOG_LEVEL || `info`,
  prettyPrint: true,
  forceColor: true,
  timestamps: true
};

module.exports = (opts = {}, dest) => {
  const destination = process.env.NODE_ENV === `production`
    ? pino.destination(dest)
    : undefined;

  return pino({...defaults, ...opts}, destination);
}

