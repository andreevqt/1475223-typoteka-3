'use strict';

const {RefreshToken} = require(`../models`);
const BaseService = require(`./BaseService`);
const jwt = require(`jsonwebtoken`);
const config = require(`../../../config`);

class JWTService extends BaseService {
  verifyAccess(token) {
    return jwt.verify(token, config.jwt.secret.access);
  }

  verifyRefresh(token) {
    return jwt.verify(token, config.jwt.secret.refresh);
  }

  async drop(token) {
    return this._model.destroy({
      where: {
        token
      }
    });
  }

  generateAccessToken(user) {
    return user.generateToken();
  }

  async generateRefreshToken(user) {
    return (await RefreshToken.generate(user)).token;
  }

  async generateTokens(user) {
    return {
      access: this.generateAccessToken(user),
      refresh: await this.generateRefreshToken(user)
    };
  }

  async findByToken(token) {
    return this.findOne({where: {token}});
  }
}

module.exports = JWTService;
