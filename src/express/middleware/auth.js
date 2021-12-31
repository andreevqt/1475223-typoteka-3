'use strict';

const config = require(`../../../config`);
const jwt = require(`jsonwebtoken`);
const api = require(`../api-services`);
const axios = require(`axios`);
const {logger} = require(`../helpers`);

const auth = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  const setHeaders = (token) => {
    axios.defaults.headers.authorization = token;
  };

  const getUID = (token) => {
    const decoded = jwt.verify(token, config.jwt.secret.access);
    return decoded.userId;
  };

  const setCookies = (tokens) => {
    res.cookie(`access_token`, tokens.access);
    res.cookie(`refresh_token`, tokens.refresh, {httpOnly: true});
  };

  if (accessToken) {
    setHeaders(accessToken);

    if (!res.locals.currentUser) {
      let userId;
      try {
        userId = getUID(accessToken);
      } catch (err) {
        // refresh
        try {
          const tokens = await api.users.refresh(refreshToken);
          setHeaders(tokens.access);
          setCookies(tokens);
          userId = getUID(tokens.access);
        } catch (_err) {
          logger.debug(`failed to refresh token for user, do nothing`);
        }
      }

      try {
        res.locals.currentUser = await api.users.get(userId);
      } catch (err) {
        res.locals.currentUser = null;
      }
    }
  }

  next();
};

module.exports = auth;
