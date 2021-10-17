'use strict';

const {Joi} = require(`express-validation`);

module.exports = {
  create: {
    body: Joi.object({
      title: Joi.string().label(`Заголовок`).required(),
      announce: Joi.string().label(`Анонс публикации`).required(),
      fullText: Joi.string().label(`Полный текст публикации`).required().min(50),
      category: [
        Joi.array().required().min(1),
        Joi.string().required()
      ],
      picture: Joi.string().allow(null),
      createdAt: Joi.string().allow(``).allow(null)
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
      createdAt: Joi.string().allow(``).allow(null)
    })
  }
};
