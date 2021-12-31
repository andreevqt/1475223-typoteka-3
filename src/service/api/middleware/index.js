'use strict';

module.exports = {
  logRequests: require(`./log-requests`),
  parseQuery: require(`./parse-query`),
  auth: require(`./auth`),
  authorize: require(`./authorize`),
  isCurrentUser: require(`./is-current-user`),
  checkStatus: require(`./check-status`),
  isEditor: require(`./is-editor`)
};
