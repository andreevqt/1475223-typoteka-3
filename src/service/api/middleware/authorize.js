'use strict';

const JWTService = require(`../../data-service/jwt-service`);
const {Http} = require(`../../constants`);

const authorize = (services) => async (req, res, next) => {
  const authorization = req.headers[`authorization`];
  if (!authorization) {
    res.status(Http.UNAUTHROIZED).send(`Not authorized`);
    return;
  }

  try {
    const {userId} = JWTService.verifyAccess(authorization);
    const user = await services.users.findById(userId);
    if (!user) {
      res.status(Http.UNAUTHROIZED).send(`Not authorized`);
      return;
    }

    res.locals.currentUser = user;
    next();
  } catch (err) {
    res.status(Http.FORBIDDEN).send(`Forbidden`);
  }
};

module.exports = authorize;
