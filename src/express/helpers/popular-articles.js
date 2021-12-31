'use strict';

module.exports = (items, limit = 4) => {
  return items.sort((a, b) => b.comments.length - a.comments.length)
    .splice(0, limit);
};
