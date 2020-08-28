'use strict';
/* eslint-disable no-undef */

const Paginator = require(`./Paginator`);

const getTestData = () => {
  return [{
    limit: 5,
    currentPage: 2,
    totalPages: 13,
    items: [
      {value: 1, url: `?page=1`},
      {value: 2, url: `?page=2`},
      {value: 3, url: `?page=3`},
      {value: 4, url: `?page=4`},
      `...`,
      {value: 13, url: `?page=13`}
    ]
  }, {
    limit: 5,
    currentPage: 4,
    totalPages: 13,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 3, url: `?page=3`},
      {value: 4, url: `?page=4`},
      {value: 5, url: `?page=5`},
      `...`,
      {value: 13, url: `?page=13`}
    ]
  }, {
    limit: 5,
    currentPage: 5,
    totalPages: 13,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 4, url: `?page=4`},
      {value: 5, url: `?page=5`},
      {value: 6, url: `?page=6`},
      `...`,
      {value: 13, url: `?page=13`}
    ]
  }, {
    limit: 5,
    currentPage: 11,
    totalPages: 13,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 10, url: `?page=10`},
      {value: 11, url: `?page=11`},
      {value: 12, url: `?page=12`},
      {value: 13, url: `?page=13`}
    ]
  }, {
    limit: 5,
    currentPage: 10,
    totalPages: 13,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 9, url: `?page=9`},
      {value: 10, url: `?page=10`},
      {value: 11, url: `?page=11`},
      `...`,
      {value: 13, url: `?page=13`}
    ]
  }, {
    limit: 10,
    currentPage: 1,
    totalPages: 20,
    items: [
      {value: 1, url: `?page=1`},
      {value: 2, url: `?page=2`},
      {value: 3, url: `?page=3`},
      {value: 4, url: `?page=4`},
      {value: 5, url: `?page=5`},
      {value: 6, url: `?page=6`},
      {value: 7, url: `?page=7`},
      {value: 8, url: `?page=8`},
      {value: 9, url: `?page=9`},
      `...`,
      {value: 20, url: `?page=20`}
    ]
  }, {
    limit: 10,
    currentPage: 2,
    totalPages: 20,
    items: [
      {value: 1, url: `?page=1`},
      {value: 2, url: `?page=2`},
      {value: 3, url: `?page=3`},
      {value: 4, url: `?page=4`},
      {value: 5, url: `?page=5`},
      {value: 6, url: `?page=6`},
      {value: 7, url: `?page=7`},
      {value: 8, url: `?page=8`},
      {value: 9, url: `?page=9`},
      `...`,
      {value: 20, url: `?page=20`}
    ]
  }, {
    limit: 10,
    currentPage: 20,
    totalPages: 20,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 12, url: `?page=12`},
      {value: 13, url: `?page=13`},
      {value: 14, url: `?page=14`},
      {value: 15, url: `?page=15`},
      {value: 16, url: `?page=16`},
      {value: 17, url: `?page=17`},
      {value: 18, url: `?page=18`},
      {value: 19, url: `?page=19`},
      {value: 20, url: `?page=20`},
    ]
  }, {
    limit: 10,
    currentPage: 19,
    totalPages: 20,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 12, url: `?page=12`},
      {value: 13, url: `?page=13`},
      {value: 14, url: `?page=14`},
      {value: 15, url: `?page=15`},
      {value: 16, url: `?page=16`},
      {value: 17, url: `?page=17`},
      {value: 18, url: `?page=18`},
      {value: 19, url: `?page=19`},
      {value: 20, url: `?page=20`},
    ]
  }, {
    limit: 10,
    currentPage: 10,
    totalPages: 20,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 7, url: `?page=7`},
      {value: 8, url: `?page=8`},
      {value: 9, url: `?page=9`},
      {value: 10, url: `?page=10`},
      {value: 11, url: `?page=11`},
      {value: 12, url: `?page=12`},
      {value: 13, url: `?page=13`},
      {value: 14, url: `?page=14`},
      `...`,
      {value: 20, url: `?page=20`},
    ]
  }, {
    limit: 10,
    currentPage: 9,
    totalPages: 20,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 6, url: `?page=6`},
      {value: 7, url: `?page=7`},
      {value: 8, url: `?page=8`},
      {value: 9, url: `?page=9`},
      {value: 10, url: `?page=10`},
      {value: 11, url: `?page=11`},
      {value: 12, url: `?page=12`},
      {value: 13, url: `?page=13`},
      `...`,
      {value: 20, url: `?page=20`},
    ]
  }, {
    limit: 10,
    currentPage: 3,
    totalPages: 5,
    items: [
      {value: 1, url: `?page=1`},
      {value: 2, url: `?page=2`},
      {value: 3, url: `?page=3`},
      {value: 4, url: `?page=4`},
      {value: 5, url: `?page=5`},
    ]
  }, {
    limit: 10,
    currentPage: 1,
    totalPages: 1,
    items: []
  }, {
    limit: 3,
    currentPage: 5,
    totalPages: 20,
    items: [
      {value: 1, url: `?page=1`},
      `...`,
      {value: 5, url: `?page=5`},
      `...`,
      {value: 20, url: `?page=20`},
    ]
  }];
};

describe(`Paginator`, () => {
  describe(`Should paginate items correctly`, () => {
    test(`test pagination`, () => {
      const data = getTestData();

      for (let i = 0; i < data.length; i++) {
        const {items, currentPage, totalPages, limit} = data[i];

        const paginator = new Paginator(totalPages, currentPage);
        paginator.limit = limit;
        paginator.paginate();

        expect(paginator.items).toEqual(expect.objectContaining(items));
      }
    });
  });
});
