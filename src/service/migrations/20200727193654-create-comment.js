'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(`comments`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      articleId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: `articles`
          },
          key: `id`,
        },
        onDelete: `cascade`,
        allowNull: false
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: `users`
          },
          key: `id`,
        },
        onDelete: `cascade`,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal(`NOW()`),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal(`NOW()`),
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable(`comments`);
  }
};
