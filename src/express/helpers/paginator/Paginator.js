'use strict';

// https://github.com/jasongrimes/php-paginator

const path = require(`path`);
const pug = require(`pug`);

const MAX_PAGES_TO_SHOW = 10;

class Paginator {
  constructor(totalPages, currentPage = 1) {
    this._limit = MAX_PAGES_TO_SHOW;
    this._currentPage = currentPage;
    this._totalPages = totalPages;
    this._params = {};
    this._items = this.makeItems();
    this._template = path.resolve(__dirname, `pagination.pug`);
  }

  makeItems() {
    const {totalPages, currentPage, limit} = this;
    let items = [];

    if (totalPages <= 1) {
      return items;
    }

    if (totalPages <= limit) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(this.makePage(i));
      }
    } else {
      let slidingStart;
      let slidingEnd;

      const numAdjacents = Math.floor((limit - 3) / 2);

      if (currentPage + numAdjacents > totalPages) {
        slidingStart = totalPages - limit + 2;
      } else {
        slidingStart = currentPage - numAdjacents;
      }

      if (slidingStart < 2) {
        slidingStart = 2;
      }

      slidingEnd = slidingStart + limit - 3;
      if (slidingEnd >= totalPages) {
        slidingEnd = totalPages - 1;
      }

      items.push(this.makePage(1));
      if (slidingStart > 2) {
        items.push(`...`);
      }

      for (let i = slidingStart; i <= slidingEnd; i++) {
        items.push(this.makePage(i));
      }
      if (slidingEnd < totalPages - 1) {
        items.push(`...`);
      }

      items.push(this.makePage(totalPages));
    }

    return items;
  }

  makePage(value) {
    return {
      value,
      url: this.url(value)
    };
  }

  paginate() {
    this._items = this.makeItems();
    return this._items;
  }

  append(name, value) {
    this._params = {...this._params, [name]: value};

    const {totalPages, limit, currentPage} = this;
    this._items = this.makeItems(totalPages, limit, currentPage);
  }

  url(page) {
    const params = {...this._params, page};
    return Object.keys(params).reduce((acc, item, idx) => {
      acc += (idx === 0) ? `?` : `&`;
      acc += `${item}=${encodeURI(params[item])}`;
      return acc;
    }, ``);
  }

  hasMorePages() {
    return this._currentPage < this._totalPages;
  }

  nextPageUrl() {
    return this.url(this._currentPage + 1);
  }

  previousPageUrl() {
    return this.url(this._currentPage - 1);
  }

  onFirstPage() {
    return this._currentPage <= 1;
  }

  links() {
    return pug.renderFile(this._template, {paginator: this});
  }

  set limit(limit) {
    this._limit = limit;
  }

  get items() {
    return this._items;
  }

  get currentPage() {
    return this._currentPage;
  }

  get totalPages() {
    return this._totalPages;
  }

  get limit() {
    return this._limit;
  }

  get params() {
    return this._params;
  }
}

module.exports = Paginator;
