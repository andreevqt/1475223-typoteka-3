'use strict';

module.exports = (str, idx, value) => {
  return str.substr(0, idx) + value + str.substr(idx);
};
