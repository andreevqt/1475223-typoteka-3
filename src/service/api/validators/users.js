'use strict';

const {Joi} = require(`express-validation`);
const NAME_REGEX = /^[ а-яА-Яё]+$/;

const users = {
  create: {
    body: Joi.object({
      name: Joi.string().label(`Имя и фамилия`).regex(NAME_REGEX, `символы русского алфавита`).min(3).max(1000),
      password: Joi.string().label(`Пароль`).required().min(6),
      avatar: Joi.string().label(`Аватар`),
      email: Joi.string().label(`email`).email().required()
    })
  },
  update: {
    body: Joi.object({
      name: Joi.string().regex(NAME_REGEX).min(3).max(1000),
      avatar: Joi.string(),
      email: Joi.string().email()
    })
  },
  resetPassword: {
    body: Joi.object({
      oldPassword: Joi.string().label(`Старый пароль`).required().min(6),
      newPassword: Joi.string().label(`Новый пароль`).required().min(6)
    })
  }
};

module.exports = users;
