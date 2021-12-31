'use strict';

/* eslint-disable object-shorthand */

const BaseModel = require(`./base-model`);
const {Sequelize} = require(`sequelize`);
const moment = require(`moment`);

module.exports = (sequelize, DataTypes) => {
  class Article extends BaseModel {
    static associate(models) {
      Article.belongsToMany(models.Category, {
        through: `articles_categories`,
        foreignKey: `articleId`,
        as: `category`,
        timestamps: false,
      });
      Article.hasMany(models.Comment, {
        foreignKey: `articleId`,
        as: `comments`
      });
      Article.belongsTo(models.User, {
        as: `author`,
        onDelete: `cascade`,
        onUpdate: `no action`
      });
    }

    static findByCategory(page, limit, categoryId) {
      const escaped = sequelize.escape(categoryId);
      return this.paginate(page, limit, {
        where: {
          id: {
            [Sequelize.Op.in]: [sequelize.literal(`(SELECT "articleId" FROM "articles_categories" WHERE "categoryId" = ${escaped})`)]
          }
        }
      });
    }

    static getQueryOptions() {
      const {User, Category} = sequelize.models;

      const include = [{
        model: User, as: `author`,
        attributes: [`id`, `name`, `email`]
      }, {
        model: Category,
        as: `category`,
        attributes: [`id`, `name`],
        through: {attributes: []}
      }];

      const attributes = {
        exclude: [
          `authorId`,
        ],
        include: [
          [sequelize.literal(`(
            SELECT COUNT(*) FROM "comments"
            WHERE "articleId" = "Article"."id"
            GROUP BY "articleId"
          )`), `commentsCount`]
        ]
      };

      const order = [
        [`createdAt`, `desc`]
      ];

      return {include: include, attributes, order: order};
    }
  }

  Article.init({
    title: DataTypes.STRING,
    announce: DataTypes.STRING,
    fullText: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      get: function () {
        return moment(this.getDataValue(`createdAt`)).format(`DD.MM.YYYY, hh:mm`);
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get: function () {
        return moment(this.getDataValue(`createdAt`)).format(`DD.MM.YYYY, hh:mm`);
      }
    },
    picture: {
      type: DataTypes.JSON,
      /* set: function (value) {
        const picture = {
          orig: `/img/${value}`,
          big: `/img/${value}`,
          small: `/img/${value}`
        };
        this.setDataValue(`picture`, picture);
      } */
    }
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  });

  return Article;
};
