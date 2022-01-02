'use strict';

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

      const includes = [{
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
            SELECT CAST(COUNT(*) as INTEGER) FROM "comments"
            WHERE "articleId" = "Article"."id"
            GROUP BY "articleId"
          )`), `commentsCount`]
        ]
      };

      const orders = [
        [`createdAt`, `desc`]
      ];

      return {include: includes, attributes, order: orders, distinct: true};
    }
  }

  Article.init({
    title: DataTypes.STRING,
    announce: DataTypes.STRING,
    fullText: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue(`createdAt`)).format(`DD.MM.YYYY, HH:mm`);
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue(`createdAt`)).format(`DD.MM.YYYY, HH:mm`);
      }
    },
    picture: {
      type: DataTypes.JSON,
    }
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  });

  return Article;
};
