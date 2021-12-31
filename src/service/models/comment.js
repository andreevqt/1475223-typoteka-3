'use strict';

const BaseModel = require(`./base-model`);
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
      const includes = [{
        model: User,
        as: `author`,
        attributes: [`id`, `name`, `email`, `avatar`]
      }, {
        model: Article,
        as: `article`,
        attributes: [`id`, `title`]
      }];
      const excludes = [`authorId`];
      return {include: includes, attributes: {exclude: excludes}};
    }
  }

  Comment.init({
    text: DataTypes.STRING,
    articleId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue(`createdAt`)).format(`DD.MM.YYYY, hh:mm`);
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue(`createdAt`)).format(`DD.MM.YYYY, hh:mm`);
      }
    },
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`
  });

  return Comment;
};
