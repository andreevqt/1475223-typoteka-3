'use strict';

module.exports.MAX_POSTS_COUNT = 1000;

module.exports.ID_LEN = 6;
module.exports.API_PREFIX = `/api`;
module.exports.API_SERVER_DEFAULT_PORT = 3000;

module.exports.Http = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  SEVICE_UNAVAILABLE: 503,
  NO_CONTENT: 204,
  UNAUTHROIZED: 401,
  FORBIDDEN: 403
};
