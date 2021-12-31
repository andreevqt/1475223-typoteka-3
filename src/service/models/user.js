'use strict';

const BaseModel = require(`./base-model`);
const cryptoService = require(`../crypto-service/crypto-service`);
const jwt = require(`jsonwebtoken`);
const config = require(`../../../config`);

module.exports = (sequelize, DataTypes) => {
  class User extends BaseModel {

    toExclude() {
      return [`password`, `createdAt`, `updatedAt`];
    }

    generateToken() {
      if (!config.jwt.secret.access) {
        throw Error(`JWT secret key is missing`);
      }

      const data = this.getData();
      return jwt.sign(data, config.jwt.secret.access, {expiresIn: config.jwt.expiresIn});
    }

    getData() {
      return {
        userId: this.id,
        email: this.email
      };
    }

    static associate(models) {
      User.hasMany(models.Article, {
        foreignKey: `authorId`
      });
    }
  }

  User.init({
    isEditor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    name: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(pass) {
        this.setDataValue(`password`, cryptoService.hash(pass));
      }
    },
    avatar: {
      type: DataTypes.JSON,
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: `Email address already in use`
      }
    }
  }, {
    sequelize,
    modelName: `User`,
    tableName: `users`
  });

  return User;
};
