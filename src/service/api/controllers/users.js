'use strict';

const {http} = require(`../../constants`);

module.exports = (services) => ({
  checkUser: async (req, res, next, id) => {
    if (!/^[0-9]+$/.test(id)) {
      res.status(http.BAD_REQUEST).send(`Id should be a number`);
      return;
    }

    const user = await services.users.findById(id);
    if (!user) {
      res.status(http.NOT_FOUND).send(`Not found`);
      return;
    }

    res.locals.user = user;
    next();
  },

  list: async (req, res) => {
    const {page, limit} = res.locals.parsed;
    const users = await services.users.paginate(page, limit);
    res.status(http.OK).json(users);
  },

  create: async (req, res, next) => {
    try {
      const user = await services.users.register(req.body);
      res.status(http.CREATED).send(user);
    } catch (err) {
      next(services.users.checkDuplicateEmail(err));
    }
  },

  update: async (req, res, next) => {
    try {
      const {user} = res.locals;
      const updated = await services.users.update(user, req.body);
      res.status(http.OK).send(updated);
    } catch (err) {
      next(services.users.checkDuplicateEmail(err));
    }
  },

  get: async (req, res) => {
    const {user} = res.locals;
    res.status(http.OK).send(user);
  },

  delete: async (req, res) => {
    const {user} = res.locals;
    const deleted = await services.users.delete(user);
    res.status(http.OK).send(deleted);
  },

  login: async (req, res) => {
    const {user} = res.locals;
    res.status(http.OK).json(user);
  },

  logout: async (req, res) => {
    const {token} = req.body;
    if (!token) {
      res.sendStatus(http.BAD_REQUEST);
      return;
    }

    await services.users.logout(token);
    res.status(http.NO_CONTENT).send(`No Content`);
  },

  refresh: async (req, res) => {
    const {token} = req.body;
    if (!token) {
      res.status(http.BAD_REQUEST).send(`Bad request`);
      return;
    }

    try {
      const {userId, email} = await services.jwt.verifyRefresh(token);
      await services.jwt.drop(email, token);

      const user = await services.users.findById(userId);
      if (!user) {
        res.status(http.UNAUTHROIZED).send(`Unauthorized`);
        return;
      }

      const tokens = await services.jwt.generateTokens(user);
      res.status(200).json(tokens);
    } catch (err) {
      res.status(http.FORBIDDEN).send(`Forbidden`);
    }
  }
});
