'use strict';

const insertAt = (str, idx, value) => {
  return str.substr(0, idx) + value + str.substr(idx);
};

module.exports = insertAt;
