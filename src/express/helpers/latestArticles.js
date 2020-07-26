'use strict';

module.exports = (items, limit = 4) => {
  return items.reverse().splice(0, limit);
};
