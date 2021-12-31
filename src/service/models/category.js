'use strict';

const BaseModel = require(`./base-model`);
const moment = require(`moment`);

module.exports = (sequelize, DataTypes) => {
  class Category extends BaseModel {
    static associate(models) {
      Category.belongsToMany(models.Article, {
        through: `articles_categories`,
        foreignKey: `categoryId`,
        as: `articles`,
        timestamps: false,
      });
    }

    static getQueryOptions() {
      const attributes = {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "articles_categories"
              WHERE "categoryId" = "Category"."id"
              GROUP BY "categoryId"
            )`), `articlesCount`
          ]
        ]
      };

      return {attributes};
    }
  }

  Category.init({
    name: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue(`createdAt`)).format(`YYYY-MM-DD, hh:mm`);
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue(`createdAt`)).format(`YYYY-MM-DD, hh:mm`);
      }
    }
  }, {
    sequelize,
    modelName: `Category`,
    tableName: `categories`,
    timestamps: false
  });

  return Category;
};
