'use strict';

const convertFilter = (key, value) => {
  if (key.includes(`_`)) {
    const [field, operator] = key.split(`_`);

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
  const result = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];
    result[key] = convertFilter(key, value);
  });

  return result;
};

module.exports = {
  convertFilters,
  convertFilter
};
