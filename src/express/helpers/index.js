'use strict';

module.exports = {
  latestArticles: require(`./latest-articles`),
  popularArticles: require(`./popular-articles`),
  latestComments: require(`./latest-comments`),
  insertAt: require(`./insert-at`),
  logger: require(`./logger`),
  Collection: require(`./collection`),
  Paginator: require(`./paginator/paginator`)
};
