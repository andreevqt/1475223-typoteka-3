'use strict';

const {Sequelize} = require(`sequelize`);
const {Events} = require(`../constants`);

const emitArticles = async (io, services, limit = 4) => {
  const articles = await services.articles.find({order: [[Sequelize.literal(`"commentsCount"`), `desc nulls last`]], limit});
  io.emit(Events.POPULAR_ARTICLES_CHANGED, articles);
};

module.exports = emitArticles;
