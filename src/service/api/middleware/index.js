'use strict';

module.exports = {
  logRequests: require(`./logRequests`),
  parseQuery: require(`./parseQuery`),
  auth: require(`./auth`),
  authorize: require(`./authorize`),
  isCurrentUser: require(`./isCurrentUser`),
  checkStatus: require(`./checkStatus`),
  isEditor: require(`./isEditor`)
};
