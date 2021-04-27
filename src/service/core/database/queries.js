'use strict';

const _ = require(`lodash`);
const {buildQuery, } = require(`./buildQuery`);
const {convertFilters} = require(`./convertFilters`)

module.exports = ({model, app}) => {
  const selectAttributes = (attributes) => {
    return _.pickBy(attributes, (value, key) => {
      return _.has(model.allAttributes, key);
    });
  };
  
  const convertParams = (params) => {
    const {start, limit, sort, where, ...rest} = params;
    const result = {};
    if (start) {
      result.start = start;
    }

    if (limit) {
      result.limit = limit;
    }

    if (sort) {
      result.sort = sort;
    }

    result.where = where
      ? convertFilters(where)
      : convertFilters(rest);

    return result;
  };

  const find = (params, populate, {transacting} = {}) => {
    const filters = convertParams(params);
    const query = buildQuery({filters});
    return model
      .query(query)
      .fetchAll({
        withRelated: populate,
        transacting
      })
      .then((models) => models.toJSON());
  };

  const findOne = async (params, populate, {transacting} = {}) => {
    const results = await find(params, populate, transacting);
    return results[0] || null;
  };

  const create = async (attributes, {transacting} = {}) => {
    const data = {...selectAttributes(attributes)};
    return (await model.forge(data).save(null, {transacting})).toJSON();
  };

  const update = async (params, attributes, {transacting} = {}) => {
    const entry = await model.where(params).fetch({transacting});
    if (!entry) {
      const err = new Error(`entry.notFound`);
      err.status = 404;
      throw err;
    }

    const data = selectAttributes(attributes);
    const updated = Object.keys(data).length > 0 ? await entry.save(data, {
      transacting
    }) : entry; 

    return findOne(params, null, {transacting});
  };

  const deleteFn = async (id, {transacting} = {}) => {
    const entry = await model.where({id}).fetch({transacting, require: false});
    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    await model.where({id: entry.id}).destroy({transacting, require: false});
    return entry.toJSON();
  };

  return {
    find,
    findOne,
    update,
    create,
    delete: deleteFn
  };
}
