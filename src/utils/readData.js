'use strict';

const fs = require(`fs`).promises;

module.exports = (file) => {
  return fs.readFile(file, `utf8`).then((data) => data.split(/\r?\n/));
};
