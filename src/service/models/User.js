'use strict';

const BaseModel = require(`./BaseModel`);

module.exports = (sequelize, DataTypes) => {
  class User extends BaseModel {
    static associate(models) {
      User.hasMany(models.Article, {
        foreignKey: `authorId`
      });
    }
  }

  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: `User`,
    tableName: `users`
  });

  return User;
};
