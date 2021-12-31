'use strict';

const Paginator = require(`src/express/helpers/paginator/paginator`);

class Collection {
  constructor(items = [], totalPages, currentPage) {
    this._paginator = new Paginator(totalPages, currentPage);
    this._items = items;
  }

  get items() {
    return this._items.items;
  }

  get total() {
    return this._items.total;
  }

  get length() {
    return this._items.items.length;
  }

  get paginator() {
    return this._paginator;
  }

  set items(items) {
    this._items.items = items;
  }

  [Symbol.iterator]() {
    return this._items.items.values();
  }

  links() {
    return this._paginator.links();
  }
}

module.exports = Collection;
