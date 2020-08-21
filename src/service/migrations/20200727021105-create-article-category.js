'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(`articles_categories`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: `articles`,
          },
          key: `id`
        },
        onDelete: `cascade`,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: `categories`,
          },
          key: `id`
        },
        onDelete: `cascade`,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable(`articles_categories`);
  }
};
