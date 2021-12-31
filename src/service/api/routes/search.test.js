'use strict';

const request = require(`supertest`);
const {API_PREFIX, Http} = require(`../../constants`);
const {services} = require(`./`);
const {server, setup, teardown} = require(`../../test-setup`);

const articlesData = [
  {title: `Продам коллекцию журналов «Огонёк».`, authorId: 1},
  {title: `Продам книги Стивена Кинга.`, authorId: 1},
  {title: `Куплю книги Стивена Кинга.`, authorId: 1},
];

beforeAll(async () => {
  await setup();
  await services.articles.bulkCreate(articlesData);
});

afterAll(async () => {
  await teardown();
});

describe.skip(`Search api endpoint`, () => {
  describe(`GET ${API_PREFIX}/search`, () => {
    test(`Should filter articles by title`, async () => {
      const query = `ПрОдАм`;

      const response = await request(server)
        .get(`${API_PREFIX}/search`)
        .query({query})
        .expect(Http.OK);

      const results = response.body.items;
      expect(Array.isArray(results)).toBe(true);
      expect(results.length > 0).toBe(true);

      const regex = new RegExp(`^${query}`, `i`);
      const isArticlesCorrect = results.every((article) => {
        return regex.test(article.title);
      });

      expect(isArticlesCorrect).toBe(true);
    });

    test(`Should return 404 error and empty array if nothing has found`, async () => {
      const query = `asdsds`;

      const response = await request(server)
        .get(`${API_PREFIX}/search`)
        .query({query})
        .expect(Http.NOT_FOUND);

      expect(response.status).toBe(Http.NOT_FOUND);

      const results = response.body.items;
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });
});
