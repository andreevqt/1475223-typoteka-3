'use strict';

const {Events} = require(`../constants`);

const emmitComments = async (io, services, limit = 4) => {
  const comments = await services.comments.find({order: [[`createdAt`, `desc`]], limit});
  io.emit(Events.COMMENTS_CHANGED, comments);
};

module.exports = emmitComments;
