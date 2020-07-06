'use strict';

const {Joi} = require(`express-validation`);

module.exports = {
  create: {
    body: Joi.object({
      announce: Joi.string().required(),
      title: Joi.string().required(),
      fullText: Joi.string().required().min(50),
      category: Joi.array().required().min(1),
    })
  },
  update: {
    body: Joi.object({
      announce: Joi.string().required(),
      title: Joi.string().required(),
      fullText: Joi.string().required().min(50),
      category: Joi.array().required().min(1),
    })
  }
};
