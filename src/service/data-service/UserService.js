'use strict';

const BaseService = require(`./BaseService`);

const {ValidationError} = require(`express-validation`);
const {UniqueConstraintError} = require(`sequelize`);
const cryptoService = require(`../crypto-service`);
const imageService = require(`../image-service`);
const {http} = require(`../constants`);

class UserService extends BaseService {
  checkDuplicateEmail(err) {
    const errors = {
      body: [
        {
          message: `Email уже используется`,
          context: {
            key: `email`
          }
        }
      ]
    };

    if (err instanceof UniqueConstraintError) {
      return new ValidationError(errors, {
        statusCode: http.BAD_REQUEST
      });
    }

    if (err instanceof ValidationError) {
      err.details.body = err.details.body || [];
      err.details.body = [...err.details.body, ...errors.body];
    }

    return err;
  }

  async findByEmail(email) {
    return this.findOne({where: {email}});
  }

  async register(attrs) {
    const {jwt} = this._services;
    const user = await this.create(attrs);

    return {
      ...user.toJSON(),
      tokens: jwt.generateTokens(user)
    };
  }

  async login(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!this.checkPassword(user, password)) {
      return null;
    }

    const {jwt} = this._services;

    return {
      ...user.toJSON(),
      tokens: await jwt.generateTokens(user)
    };
  }

  async logout(token) {
    const {jwt} = this._services;
    return jwt.drop(token);
  }

  async create(attrs) {
    if (attrs.avatar) {
      attrs.avatar = await imageService.makeFromBuffer(attrs.avatar, 74, 74);
    }

    return super.create(attrs);
  }

  async update(user, attrs) {
    if (attrs.avatar) {
      await imageService.remove(user.avatar);
      attrs.avatar = await imageService.makeFromBuffer(attrs.avatar, 74, 74);
    }

    return user.update(attrs);
  }

  checkPassword(user, password) {
    return cryptoService.compare(password, user.password);
  }
}

module.exports = UserService;
