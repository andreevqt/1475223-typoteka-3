'use strict';

const {randomInt} = require(`../../utils`);

class BaseService {
  constructor(model, services) {
    this._model = model;
    this._services = services;
  }

  async clear() {
    return this._model.destroy({where: {}, force: true, truncate: true, restartIdentity: true, cascade: true});
  }

  async bulkDelete(values) {
    if (!values.length) {
      return;
    }

    let ids = [];

    if (values.every((value) => typeof value === `number`)) {
      ids = values;
    }

    if (values.every((value) => typeof value === `object`)) {
      ids = values.map((value) => value.id);
    }

    this._model.destroy({where: {id: ids}, force: true, truncate: true, cascade: true});
  }

  async bulkCreate(arr) {
    return this._model.bulkCreate(arr);
  }

  async create(attrs) {
    return this._model.create(attrs);
  }

  async findOne(opts = {}) {
    const model = this._model;
    return model.findOne({...model.getQueryOptions(), ...opts});
  }

  async find(opts = {}) {
    const model = this._model;
    return model.findAll({...model.getQueryOptions(), ...opts});
  }

  async findAll() {
    const model = this._model;
    return model.findAll(model.getQueryOptions());
  }

  async paginate(...args) {
    return this._model.paginate(...args);
  }

  async findById(id) {
    const model = this._model;
    return model.findByPk(id, model.getQueryOptions());
  }

  async random() {
    const items = await this.findAll();
    return items[randomInt(0, items.length - 1)];
  }

  async delete(idOrObj) {
    if (!idOrObj) {
      return null;
    }

    const model = typeof idOrObj === `number` ? await this._model.findByPk(idOrObj) : idOrObj;
    if (model) {
      await model.destroy({force: true});
    }

    return model;
  }
}

module.exports = BaseService;
