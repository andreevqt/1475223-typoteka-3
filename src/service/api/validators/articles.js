'use strict';

const BaseJoi = require(`joi`);
const {imageExtension} = require(`../../helpers`);
const Joi = BaseJoi.extend(imageExtension);

const articles = {
  create: {
    body: Joi.object({
      title: Joi.string().label(`Заголовок`).required().min(30).max(250),
      announce: Joi.string().label(`Анонс публикации`).required().min(30).max(250),
      fullText: Joi.string().label(`Полный текст публикации`).required().max(1000),
      category: [
        Joi.array().label(`Категория`).required().min(1),
        Joi.number().label(`Категория`).required()
      ],
      picture: Joi.image().label(`Изображение`).allowed([`jpg`, `png`]).allow(null).max(5000),
      createdAt: Joi.string().allow(``).allow(null)
    })
  },
  update: {
    body: Joi.object({
      title: Joi.string().label(`Заголовок`).min(30).max(250),
      announce: Joi.string().label(`Анонс публикации`).min(30).max(250),
      fullText: Joi.string().label(`Полный текст публикации`).max(1000),
      category: [
        Joi.array().min(1),
        Joi.number()
      ],
      picture: Joi.image().label(`Изображение`).allowed([`jpg`, `png`]).allow(null).max(5000),
      createdAt: Joi.string().allow(``).allow(null)
    })
  }
};

module.exports = articles;
