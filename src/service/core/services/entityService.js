'use strict';

module.exports = ({db}) => {
  const find = async (opts, {model}) => {
    const {params, populate} = opts;
    return db.query(model).find(params, populate);  
  };
  
  return {
    find
  };
};
