'use strict';

const BaseModel = require(`./BaseModel`);
const config = require(`../../../config`);
const jwt = require(`jsonwebtoken`);

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends BaseModel {
    static associate(_models) {
    }

    static async generate(user) {
      if (!config.jwt.secret.refresh) {
        throw Error(`JWT secret key is missing`);
      }

      const data = user.getData();

      const token = jwt.sign(data, config.jwt.secret.refresh);
      return this.create({...data, token});
    }
  }

  RefreshToken.init({
    token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: `RefreshToken`,
    tableName: `refresh_token`,
    timestamps: false
  });

  return RefreshToken;
};
