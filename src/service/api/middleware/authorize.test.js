'use strict';

/* eslint-disable no-undef */

const sinon = require(`sinon`);
const {setup, teardown, data} = require(`../../test-setup`);
const {services} = require(`../routes`);
const authorize = require(`./authorize`)(services);

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  res.locals = {};
  return res;
};

const mockRequest = () => {
  return {
    headers: {}
  };
};

const user = data.users[0];

let req;
let res;
let next;
let clock;

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await teardown();
});

describe(`Should verify that user has access to specific route`, () => {
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = sinon.spy();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  test(`If token is not provided it should return 401 status code`, async () => {
    await authorize(req, res, next);
    expect(res.status.calledWith(401)).toBe(true);
  });

  test(`If user has been autorized successfully then next() should be called once`, async () => {
    const storedUser = await services.users.findByEmail(user.email);
    const token = await services.jwt.generateAccessToken(storedUser);
    req.headers.authorization = token;
    await authorize(req, res, next);
    expect(next.calledOnce).toBe(true);
    expect(typeof res.locals.currentUser).toBe(`object`);
  });

  test(`If encoded userId is wrong it should return 401 status code`, async () => {
    const storedUser = await services.users.findByEmail(user.email);
    storedUser.set(`id`, 999999, {raw: true});
    const token = storedUser.generateToken();
    req.headers.authorization = token;
    await authorize(req, res, next);
    expect(res.status.calledWith(401)).toBe(true);
  });

  test(`If token has been wrong it should return 403 status code`, async () => {
    req.headers.authorization = `babecafe`;
    await authorize(req, res, next);
    expect(res.status.calledWith(403)).toBe(true);
  });

  test(`If token has expired it should return 403`, async () => {
    const storedUser = await services.users.findByEmail(user.email);
    const token = await services.jwt.generateAccessToken(storedUser);
    req.headers.authorization = token;
    clock.tick(`00:15:00`);
    await authorize(req, res, next);
    expect(res.status.calledWith(403)).toBe(true);
  });
});
