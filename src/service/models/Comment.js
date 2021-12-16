'use strict';

/* eslint-disable object-shorthand  */

const BaseModel = require(`./BaseModel`);
const moment = require(`moment`);

module.exports = (sequelize, DataTypes) => {
  class Comment extends BaseModel {
    static associate(models) {
      Comment.belongsTo(models.Article, {
        as: `article`,
        foreignKey: {
          allowNull: false,
        },
        onDelete: `cascade`,
        onUpdate: `no action`
      });
      Comment.belongsTo(models.User, {
        as: `author`,
        foreignKey: {
          allowNull: false
        },
        onDelete: `cascade`,
        onUpdate: `no action`
      });
    }

    static getQueryOptions() {
      const {User, Article} = sequelize.models;
      const include = [{
        model: User,
        as: `author`,
        attributes: [`id`, `name`, `email`, `avatar`]
      }, {
        model: Article,
        as: `article`,
        attributes: [`id`, `title`]
      }];
      const exclude = [`authorId`];
      return {include: include, attributes: {exclude: exclude}};
    }
  }

  Comment.init({
    text: DataTypes.STRING,
    articleId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      get: function () {
        return moment(this.getDataValue(`createdAt`)).format(`YYYY-MM-DD, hh:mm`);
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get: function () {
        return moment(this.getDataValue(`createdAt`)).format(`YYYY-MM-DD, hh:mm`);
      }
    },
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`
  });

  return Comment;
};
