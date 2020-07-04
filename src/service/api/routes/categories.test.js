'use strict';
/* eslint-disable no-undef */

const request = require(`supertest`);
const {
  API_PREFIX,
  http
} = require(`../../constants`);
const {
  app,
  services
} = require(`../../testSetup`);

const categories = [
  `Журналы`,
  `Игры`,
  `Разное`,
  `Посуда`,
  `Животные`
];

describe(`Categories api endpoint`, () => {
  beforeAll(() => {
    const articles = categories.map((category) => ({category: [category]}));
    services.categoryService.items = articles;
  });

  describe(`GET ${API_PREFIX}/categories`, () => {
    test(`Should return categories list with proper object structure`, async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/categories`)
        .expect(http.OK);

      const results = response.body;

      expect(Array.isArray(results)).toBe(true);
      expect(results.length > 0).toBe(true);

      expect(results).toEqual(expect.arrayContaining(categories));
    });
  });
});
