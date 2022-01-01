'use strict';

const logRequests = require(`./log-requests`);
const parseQuery = require(`./parse-query`);
const auth = require(`./auth`);
const authorize = require(`./authorize`);
const isCurrentUser = require(`./is-current-user`);
const checkStatus = require(`./check-status`);
const isEditor = require(`./is-editor`);

module.exports = {
  logRequests,
  parseQuery,
  auth,
  authorize,
  isCurrentUser,
  checkStatus,
  isEditor
};
