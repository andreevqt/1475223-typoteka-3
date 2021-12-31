'use strict';

const MAX_POSTS_COUNT = 1000;
const ID_LEN = 6;
const API_PREFIX = `/api`;
const API_SERVER_DEFAULT_PORT = 3000;

const Http = {
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

const MimeSignatures = {
  JPEG: [0xFF, 0xD8, 0xFF],
  PNG: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
};

const File = {
  EXT_POS: -3,
};

module.exports = {
  MAX_POSTS_COUNT,
  ID_LEN,
  API_PREFIX,
  API_SERVER_DEFAULT_PORT,
  Http,
  MimeSignatures,
  File
};
