'use strict';

const authorize = (services) => async (req, res, next) => {
  const authorization = req.headers[`authorization`];
  if (!authorization) {
    res.status(401).send(`Not authorized`);
    return;
  }

  try {
    const {userId} = services.jwt.verifyAccess(authorization);
    const user = await services.users.findById(userId);
    if (!user) {
      res.status(401).send(`Not authorized`);
      return;
    }

    res.locals.currentUser = user;
    next();
  } catch (err) {
    res.status(403).send(`Forbidden`);
  }
};

module.exports = authorize;
