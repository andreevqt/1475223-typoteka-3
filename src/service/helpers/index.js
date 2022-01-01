'use strict';

const imageExtension = require(`./image-extension`);
const logger = require(`./logger`);
const emitComments = require(`./emit-comments`);
const emitArticles = require(`./emit-articles`);

module.exports = {
  imageExtension,
  logger,
  emitComments,
  emitArticles
};
