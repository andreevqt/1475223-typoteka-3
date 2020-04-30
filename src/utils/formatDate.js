'use strict';

const pad = require(`./pad`);

module.exports = (date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth(), 2);
  const day = pad(date.getDay(), 2);
  const hours = pad(date.getHours(), 2);
  const minutes = pad(date.getMinutes(), 2);
  const seconds = pad(date.getHours(), 2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
