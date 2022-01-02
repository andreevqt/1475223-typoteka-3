'use strict';

const {Joi} = require(`express-validation`);

const comments = {
  create: {
    body: Joi.object({
      authorId: Joi.number().label(`authorId`).required(),
      text: Joi.string().label(`Текст комментария`).required(),
    })
  },
  update: {
    body: Joi.object({
      authorId: Joi.number().label(`authorId`).required(),
      text: Joi.string().label(`Текст комментария`).required(),
    })
  }
};

module.exports = comments;
