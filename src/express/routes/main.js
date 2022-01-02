'use strict';

const {Router} = require(`express`);
const {logger} = require(`../helpers`);
const api = require(`../api-services`);
const upload = require(`../middleware/upload`);
const checkAuth = require(`../middleware/check-auth`);
const redirectIfUser = require(`../middleware/redirect-if-user`);
const {Http} = require(`../../service/constants`);
const {
  MAX_COMMENT_LENGTH,
  MAX_POPULAR_ARTICLES,
  MAX_LATEST_ARTICLES
} = require(`../constants`);

const router = new Router();

const setCookies = (res, tokens) => {
  res.cookie(`access_token`, tokens.access);
  res.cookie(`refresh_token`, tokens.refresh, {httpOnly: true});
};

const clearCookies = (res) => {
  res.clearCookie(`access_token`);
  res.clearCookie(`refresh_token`);
};

const mainRoute = (_app) => {
  router.get(`/`, async (req, res) => {
    const {query, page} = req.query;
    let popular = [];
    let articles = [];
    let comments = [];
    let empty = true;

    try {
      articles = await api.articles.fetch({order: `latest`, query, page});
      popular = await api.articles.fetch({order: `popular`, limit: MAX_POPULAR_ARTICLES});
      if (popular.items.every((item) => !item.commentsCount)) {
        popular.items = [];
      }
      comments = await api.comments.latest({limit: MAX_LATEST_ARTICLES});
      comments.items.forEach((comment) => {
        if (comment.text.length > MAX_COMMENT_LENGTH) {
          comment.text = `${comment.text.slice(0, MAX_COMMENT_LENGTH)}...`;
        }
      });
      empty = !articles.length;
    } catch (err) {
      if (err.response) {
        logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
      }
    }

    res.render(`pages/index`, {popular, articles, comments, empty});
  });

  router.get(`/search`, async (req, res) => {
    const {query, page, limit} = req.query;
    let articles = [];

    if (query) {
      try {
        articles = await api.search.fetch({query, page, limit});
        articles.paginator.append(`query`, query);
      } catch (err) {
        logger.error(`[ERROR] route: ${req.url}, message: status - ${err.response.status}, data - ${err.response.data}`);
      }
    }

    res.render(`pages/search`, {articles, query});
  });

  router.get(`/login`, redirectIfUser, (_req, res, _next) => res.render(`pages/login`));

  router.post(`/login`, async (req, res, next) => {
    const {email, password} = req.body;
    try {
      const {result, errors} = await api.users.login(email, password);
      if (errors) {
        res.json({errors});
        return;
      }
      setCookies(res, result.tokens);
      res.json({redirectTo: result.isEditor ? `/my` : `/`});
    } catch (err) {
      next(err);
    }
  });

  router.post(`/register`, upload.single(`avatar`), async (req, res, next) => {
    const avatar = req.file && req.file.buffer.toString(`base64`);
    const {name, lastName, password, confirmPassword, email} = req.body;

    if (password !== confirmPassword) {
      res.json({errors: {password: `Пароли должны совпадать`}});
      return;
    }

    const attrs = {
      avatar,
      name: `${name} ${lastName}`,
      password,
      email
    };

    try {
      await api.users.register(attrs);
    } catch (err) {
      if (err.response && err.response.status === Http.BAD_REQUEST) {
        res.json({errors: err.response.data});
        return;
      }

      next(err);
      return;
    }

    res.json({
      redirectTo: `/login`
    });
  });

  router.get(`/register`, redirectIfUser, (_req, res, _next) => res.render(`pages/register`));

  router.get(`/logout`, checkAuth, async (req, res, next) => {
    try {
      const token = req.cookies.access_token;
      await api.users.logout(token);
      clearCookies(res);
      res.redirect(`/login`);
    } catch (err) {
      next(err);
    }
  });
  return router;
};

module.exports = mainRoute;
