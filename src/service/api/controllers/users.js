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

    req.locals = req.locals || {};
    req.locals.user = user;

    next();
  },

  list: async (req, res) => {
    const {page, limit} = req.locals.parsed;
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
      const {user} = req.locals;
      const updated = await services.users.update(user, req.body);
      res.status(http.OK).send(updated);
    } catch (err) {
      next(services.users.checkDuplicateEmail(err));
    }
  },

  get: async (req, res) => {
    const {user} = req.locals;
    res.status(http.OK).send(user);
  },

  delete: async (req, res) => {
    const {user} = req.locals;
    const deleted = await services.users.delete(user);
    res.status(http.OK).send(deleted);
  }
});
