'use strict';
const moment = require(`moment`);

const sanitizeDate = (field = `createdAt`, format = `DD.MM.YYYY`) => (req, _res, next) => {
  req.body[field] = moment(req.body[field], format).format(`YYYY-MM-DD`);
  next();
};

module.exports = sanitizeDate;
