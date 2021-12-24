'use strict';

const {Joi} = require(`express-validation`);

module.exports = {
  create: {
    body: Joi.object({
      name: Joi.string().label(`Заголовок категории`).min(5).max(30).required(),
    })
  },
  update: {
    body: Joi.object({
      name: Joi.string().label(`Заголовок категории`).min(5).max(30),
    })
  }
};
