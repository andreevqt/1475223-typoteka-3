'use strict';

const {Joi} = require(`express-validation`);

module.exports = {
  create: {
    body: Joi.object({
      announce: Joi.string().required(),
      title: Joi.string().required(),
      fullText: Joi.string().required().min(50),
      category: [
        Joi.array().required().min(1),
        Joi.string().required()
      ],
      picture: Joi.string(),
      createdDate: Joi.string().allow(``).allow(null)
    })
  },
  update: {
    body: Joi.object({
      announce: Joi.string(),
      title: Joi.string(),
      fullText: Joi.string().min(50),
      category: [
        Joi.array().min(1),
        Joi.string()
      ],
      picture: Joi.string().allow(null),
      createdDate: Joi.string().allow(``).allow(null)
    })
  }
};
