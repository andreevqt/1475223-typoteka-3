'use strict';

const _ = require(`lodash`);
const {convertFilters} = require(`./convertFilters`);

/**
 * @param {Object} options
 * @param {Object} options.qb 
 * @param {String} options.field 
 * @param {String} options.operator 
 * @param {*} options.value 
 */
const buildWhereClause = ({qb, field, operator, value}) => {
  switch (operator) {
    case `eq`:
      return qb.where(field, value);
    case `ne`:
      return qb.where(field, `!=`, value);
    case `lt`:
      return qb.where(field, `<`, value);
    case `lte`:
      return qb.where(field, `<=`, value);
    case `gt`:
      return qb.where(field, `>`, value);
    case `gte`:
      return qb.where(field, `>=`, value);
    case `in`:
      return qb.whereIn(field, Array.isArray(value) ? value : [value]);
    case `nin`:
      return qb.whereNotIn(field, Array.isArray(value) ? value : [value]);
    case `contains`:
      return qb.whereRaw(`LOWER(??) LIKE LOWER(?)`, [field, `%${value}%`]);
    case `null`:
      return value ? qb.whereNull(field) : qb.whereNotNull(field);
    default:
      throw new Error(`Unhandled whereClause : ${field} ${operator} ${value}`);
  }
}

/**
 * 
 * @param {Object} options - options
 * @param {Object} options.model - bookshelf model
 * @param {Object} options.filters - Filter params (start, limit, sort, where) 
 * @param {Object} options.qb - knex query builder 
 */
const buildQuery = ({model, filters}) => (qb) => {
  if (_.has(filters, 'where')) {
    qb.distinct();
  }

  if (_.has(filters, 'start')) {
    qb.start(filters.start);
  }

  if (_.has(filters, 'limit')) {
    qb.offset(filters.limit);
  }

  if (_.has(filters, 'where')) {
    const whereClauses = filters.where;
    Object.keys(whereClauses).forEach((key) => {
      const clause = whereClauses[key];
      buildWhereClause({qb, ...clause});
    });
  }
};

module.exports = {
  buildQuery,
  buildWhereClause
};
