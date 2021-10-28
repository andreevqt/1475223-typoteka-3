'use strict';

const BaseJoi = require(`joi`);
const {imageExtension} = require(`../../helpers`);
const Joi = BaseJoi.extend(imageExtension);

module.exports = {
  create: {
    body: Joi.object({
      title: Joi.string().label(`Заголовок`).required().min(30).max(250),
      announce: Joi.string().label(`Анонс публикации`).required(),
      fullText: Joi.string().label(`Полный текст публикации`).required().max(1000),
      category: [
        Joi.array().required().min(1),
        Joi.string().required()
      ],
      picture: Joi.image().label(`Изображение`).allowed([`jpg`, `png`]).allow(null).max(5000),
      createdAt: Joi.string().allow(``).allow(null)
    })
  },
  update: {
    body: Joi.object({
      title: Joi.string().label(`Заголовок`).min(30).max(250),
      announce: Joi.string().label(`Анонс публикации`),
      fullText: Joi.string().label(`Полный текст публикации`).max(1000),
      category: [
        Joi.array().min(1),
        Joi.string()
      ],
      picture: Joi.image().label(`Изображение`).allowed([`jpg`, `png`]).allow(null).max(5000),
      createdAt: Joi.string().allow(``).allow(null)
    })
  }
};
