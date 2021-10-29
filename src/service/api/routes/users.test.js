'use strict';
/* eslint-disable no-undef, max-nested-callbacks */

const request = require(`supertest`);
const {API_PREFIX, http} = require(`../../constants`);
const {services} = require(`./`);
const {server, setup, teardown} = require(`../../test-setup`);

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await teardown();
});

describe(`Users api endpoint`, () => {
  let testUser;

  const attrs = {
    name: `Джон Доу`,
    email: `test@email.com`,
    password: `123456aa`
  };

  beforeEach(async () => {
    await services.users.create(attrs);
    testUser = await services.users.login(attrs.email, attrs.password);
  });

  afterEach(async () => {
    await services.users.logout(testUser.tokens.access);
    await services.users.delete(testUser.id);
  });

  describe(`GET ${API_PREFIX}/users`, () => {
    test(`Should return users list with proper object structure`, async () => {
      const response = await request(server).get(`${API_PREFIX}/users`)
        .expect(http.OK);

      const users = (await services.users.findAll())
        .map((user) => user.convertToJSON());
      const results = response.body.items;

      expect(users).toEqual(expect.arrayContaining(results));
      expect(Array.isArray(results)).toBe(true);
      expect(results.length > 0).toBe(true);
      expect(results).toEqual(expect.arrayContaining(users));
    });
  });

  describe(`GET ${API_PREFIX}/users/:userId`, () => {
    test(`Should get a user by userId`, async () => {
      const storedUser = (await services.users.findById(testUser.id)).convertToJSON();

      const response = await request(server)
        .get(`${API_PREFIX}/users/${storedUser.id}`)
        .expect(http.OK);

      const user = response.body;
      expect(storedUser).toEqual(expect.objectContaining(user));
    });

    test(`Should return 404 error if userId is wrong`, async () => {
      const response = await request(server)
        .get(`${API_PREFIX}/users/1234`);

      expect(response.status).toBe(http.NOT_FOUND);
    });

    test(`Should return 400 error if userId isn't a string`, async () => {
      const response = await request(server)
        .get(`${API_PREFIX}/users/123asd`);

      expect(response.status).toBe(http.BAD_REQUEST);
    });
  });

  describe(`POST ${API_PREFIX}/users`, () => {
    const toCreate = {
      name: `Джейн Доу`,
      email: `test1234@email.com`,
      password: `123456aa`
    };

    test(`Should create a user`, async () => {
      const response = await request(server)
        .post(`${API_PREFIX}/users`)
        .send(toCreate)
        .expect(http.CREATED);

      const user = response.body;
      expect(user.name).toEqual(toCreate.name);
      expect(user.email).toEqual(toCreate.email);

      await services.users.delete(user.id);
    });

    test(`Should return 400 status code if attributes are wrong`, async () => {
      let response;

      // Name consists of latin characters
      response = await request(server)
        .post(`${API_PREFIX}/users`)
        .send({...toCreate, name: `sdsdsd`});
      expect(response.status).toBe(http.BAD_REQUEST);

      // duplicate email
      response = await request(server)
        .post(`${API_PREFIX}/users`)
        .send({...toCreate, email: attrs.email});
      expect(response.status).toBe(http.BAD_REQUEST);

      // password less than 6
      response = await request(server)
        .post(`${API_PREFIX}/users`)
        .send({...toCreate, password: `123`});
      expect(response.status).toBe(http.BAD_REQUEST);

      // email isn't valid
      response = await request(server)
        .post(`${API_PREFIX}/users`)
        .send({...toCreate, email: `asdad`});
      expect(response.status).toBe(http.BAD_REQUEST);
    });
  });

  describe(`PUT ${API_PREFIX}/users`, () => {
    test(`Should update a user`, async () => {
      const toUpdate = {
        name: `Дженни Доу`,
      };

      const response = await request(server)
        .put(`${API_PREFIX}/users/${testUser.id}`)
        .set(`authorization`, testUser.tokens.access)
        .send(toUpdate)
        .expect(http.OK);

      const updated = response.body;
      expect(updated).toEqual(expect.objectContaining(toUpdate));
    });
  });

  describe(`DELETE ${API_PREFIX}/users`, () => {
    test(`Should delete a user`, async () => {
      const response = await request(server)
        .delete(`${API_PREFIX}/users/${testUser.id}`)
        .set(`authorization`, testUser.tokens.access)
        .expect(http.OK);

      const deleted = response.body;
      expect(testUser).toEqual(expect.objectContaining(deleted));
    });
  });
});
