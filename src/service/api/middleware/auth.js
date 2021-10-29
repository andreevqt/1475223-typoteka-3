'use strict';

const auth = (services) => async (req, res, next) => {
  const {email, password} = req.body;
  const user = await services.users.login(email, password);
  if (!user) {
    res.status(403).send(`Forbidden`);
    return;
  }

  res.locals.user = user;
  next();
};

module.exports = auth;
