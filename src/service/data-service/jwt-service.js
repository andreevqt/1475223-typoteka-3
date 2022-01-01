'use strict';

const {RefreshToken} = require(`../models`);
const BaseService = require(`./base-service`);
const jwt = require(`jsonwebtoken`);
const config = require(`../../../config`);

class JWTService extends BaseService {
  async findByToken(token) {
    return this.findOne({where: {token}});
  }

  async drop(token) {
    return this._model.destroy({
      where: {
        token
      }
    });
  }

  static verifyAccess(token) {
    return jwt.verify(token, config.jwt.secret.access);
  }

  static verifyRefresh(token) {
    return jwt.verify(token, config.jwt.secret.refresh);
  }

  static generateAccessToken(user) {
    return user.generateToken();
  }

  static async generateRefreshToken(user) {
    return (await RefreshToken.generate(user)).token;
  }

  static async generateTokens(user) {
    return {
      access: this.generateAccessToken(user),
      refresh: await this.generateRefreshToken(user)
    };
  }
}

module.exports = JWTService;
