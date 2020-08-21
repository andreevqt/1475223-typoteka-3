'use strict';

const BaseModel = require(`./BaseModel`);

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
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: `Category`,
    tableName: `categories`,
    timestamps: false
  });

  return Category;
};
