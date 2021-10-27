'use strict';

const {Joi} = require(`express-validation`);

module.exports = {
  create: {
    body: Joi.object({
      text: Joi.string().label(`Текст комментария`).required(),
    })
  },
  update: {
    body: Joi.object({
      text: Joi.string().label(`Текст комментария`).required(),
    })
  }
};
