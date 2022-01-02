'use strict';

const {Http} = require(`../../constants`);
const {JWTService, UserService} = require(`../../data-service`);

const usersController = (services) => ({
  checkUser: async (_req, res, next, id) => {
    if (!/^[0-9]+$/.test(id)) {
      res.status(Http.BAD_REQUEST).send(`Id should be a number`);
      return;
    }

    const user = await services.users.findById(id);
    if (!user) {
      res.status(Http.NOT_FOUND).send(`Not found`);
      return;
    }

    res.locals.user = user;
    next();
  },

  list: async (req, res) => {
    const {page, limit} = res.locals.parsed;
    const users = await services.users.paginate(page, limit);
    res.status(Http.OK).json(users);
  },

  create: async (req, res, next) => {
    try {
      const user = await services.users.register(req.body);
      res.status(Http.CREATED).send(user);
    } catch (err) {
      next(UserService.checkDuplicateEmail(err));
    }
  },

  update: async (req, res, next) => {
    try {
      const {user} = res.locals;
      const updated = await UserService.update(user, req.body);
      res.status(Http.OK).send(updated);
    } catch (err) {
      next(UserService.checkDuplicateEmail(err));
    }
  },

  get: async (req, res) => {
    const {user} = res.locals;
    res.status(Http.OK).send(user);
  },

  delete: async (req, res) => {
    const {user} = res.locals;
    const deleted = await services.users.delete(user);
    res.status(Http.OK).send(deleted);
  },

  login: async (req, res) => {
    const {user} = res.locals;
    res.status(Http.OK).json(user);
  },

  logout: async (req, res) => {
    const {token} = req.body;
    if (!token) {
      res.sendStatus(Http.BAD_REQUEST);
      return;
    }

    await services.users.logout(token);
    res.status(Http.NO_CONTENT).send(`No Content`);
  },

  refresh: async (req, res) => {
    const {token} = req.body;
    if (!token) {
      res.status(Http.BAD_REQUEST).send(`Bad request`);
      return;
    }

    try {
      const {userId, email} = await JWTService.verifyRefresh(token);
      await services.jwt.drop(email, token);

      const user = await services.users.findById(userId);
      if (!user) {
        res.status(Http.UNAUTHROIZED).send(`Unauthorized`);
        return;
      }

      const tokens = await JWTService.generateTokens(user);
      res.status(Http.OK).json(tokens);
    } catch (err) {
      res.status(Http.FORBIDDEN).send(`Forbidden`);
    }
  }
});

module.exports = usersController;
