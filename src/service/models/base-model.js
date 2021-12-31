'use strict';

const {
  Model
} = require(`sequelize`);

const _ = require(`lodash`);

class BaseModel extends Model {
  async reload() {
    return super.reload(this.constructor.getQueryOptions());
  }
  /*
   * Требуется для тестов т.к метод toJSON
   * не преобразует дату в строку
   */
  convertToJSON() {
    return JSON.parse(JSON.stringify(this.toJSON()));
  }

  toExclude() {
    return [];
  }

  toJSON() {
    return _.omit(super.toJSON(), this.toExclude());
  }

  static async paginate(page = 1, limit = 8, opts) {
    let items;

    const options = {...this.getQueryOptions(), ...opts};
    const total = await this.count(options);
    const totalPages = Math.ceil(total / limit);
    const offset = limit * (page - 1);

    items = total >= limit * (page - 1) ?
      await this.findAll({...options, limit, offset}) : [];

    return {
      currentPage: page,
      total,
      items,
      totalPages
    };
  }

  static getQueryOptions() {
    return {};
  }
}

module.exports = BaseModel;
