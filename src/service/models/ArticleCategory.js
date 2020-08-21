'use strict';

const BaseModel = require(`./BaseModel`);

module.exports = (sequelize, DataTypes) => {
  class ArticleCategory extends BaseModel {
    static associate(models) {
      ArticleCategory.belongsTo(models.Article);
      ArticleCategory.belongsTo(models.Category);
    }
  }

  ArticleCategory.init({
    articleId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: `ArticleCategory`,
    tableName: `articles_categories`,
    timestamps: false
  });

  return ArticleCategory;
};
