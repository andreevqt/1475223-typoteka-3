'use strict';

module.exports = (v) => {
  return typeof v === `function` && /^\s*class\s+/.test(v.toString());
};
