'use strict';
/* eslint-disable no-undef, max-nested-callbacks */

const request = require(`supertest`);
const {
  API_PREFIX,
  http
} = require(`../../constants`);
const {
  app,
  services
} = require(`../../testSetup`);

const articles = [
  {title: `Продам коллекцию журналов «Огонёк».`},
  {title: `Продам книги Стивена Кинга.`},
  {title: `Куплю книги Стивена Кинга.`},
];

describe(`Search api endpoint`, () => {
  beforeAll(() => {
    services.searchService.items = articles;
  });

  describe(`GET ${API_PREFIX}/search`, () => {
    test(`Should filter articles by title`, async () => {
      const query = `КоЛлекцию`;

      const response = await request(app)
        .get(`${API_PREFIX}/search`)
        .query({query})
        .expect(http.OK);

      const results = response.body;
      expect(Array.isArray(results)).toBe(true);
      expect(results.length > 0).toBe(true);

      const regex = new RegExp(`${query}`, `i`);
      const isArticlesCorrect = results.every((offer) => regex.test(offer.title));

      expect(isArticlesCorrect).toBe(true);
    });

    test(`Should return 404 error and empty array if nothing is found`, async () => {
      const query = `asdsds`;

      const response = await request(app)
        .get(`${API_PREFIX}/search`)
        .query({query});

      expect(response.status).toBe(http.NOT_FOUND);

      const results = response.body;
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });
});
