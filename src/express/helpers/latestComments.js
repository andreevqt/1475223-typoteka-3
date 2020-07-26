'use strict';

module.exports = (items, limit = 3) => {
  return items.reduce((acc, item) => {
    return [...acc, ...item.comments];
  }, []).splice(0, limit);
};
