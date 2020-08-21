'use strict';
/* eslint-disable no-undef, max-nested-callbacks */

const request = require(`supertest`);
const {API_PREFIX} = require(`../../constants`);
const {services} = require(`./`);
const {server, setup, teardown} = require(`../../test-setup`);

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await teardown();
});

describe(`Categories api endpoint`, () => {
  describe(`GET ${API_PREFIX}/categories`, () => {
    test(`Should return categories list with proper object structure`, async () => {
      const response = await request(server).get(`${API_PREFIX}/categories`);

      const categories = (await services.categories.findAll())
        .map((category) => category.convertToJSON());
      const results = response.body.items;

      expect(categories).toEqual(expect.arrayContaining(results));
      expect(Array.isArray(results)).toBe(true);
      expect(results.length > 0).toBe(true);
      expect(results).toEqual(expect.arrayContaining(categories));
    });
  });
});
