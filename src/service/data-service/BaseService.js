'use strict';

class BaseService {
  constructor(items) {
    this._items = items;
  }

  set items(items) {
    this._items = items;
  }

  get items() {
    return this._items;
  }

  clear() {
    this._items = [];
  }
}

module.exports = BaseService;
