'use strict';

const {Joi} = require(`express-validation`);

module.exports = {
  create: {
    body: Joi.object({
      text: Joi.string().required(),
    })
  },
  update: {
    body: Joi.object({
      text: Joi.string().required(),
    })
  }
};
