'use strict';

const _ = require(`lodash`);

const OPERATORS = [`eq`, `ne`, `lt`, `lte`, `gt`, `gte`, `in`, `nin`, `contains`, `null`];

const convertFilter = (key, value) => {
  const [field, operator] = key.split(`_`);

  if (operator && OPERATORS.includes(operator)) {
    return {
      field,
      operator,
      value
    };
  }

  return {
    field: key,
    operator: `eq`,
    value
  };
};

const convertFilters = (params) => {
  const result = [];

  Object.keys(params).forEach((key) => {
    const value = params[key];
    result.push(convertFilter(key, value));
  });

  return result;
};

module.exports = {
  convertFilters,
  convertFilter
};
