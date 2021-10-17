'use strict';

const {Joi} = require(`express-validation`);

module.exports = {
  create: {
    body: Joi.object({
      name: Joi.string().label(`Название`).min(3).required(),
    })
  },
  update: {
    body: Joi.object({
      name: Joi.string().label(`Название`).min(3),
    })
  }
};
