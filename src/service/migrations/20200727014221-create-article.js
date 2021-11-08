'use strict';
/* eslint-disable new-cap */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(`articles`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      announce: {
        type: Sequelize.STRING(512)
      },
      fullText: {
        type: Sequelize.TEXT
      },
      picture: {
        type: Sequelize.JSON
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: `users`
          },
          key: `id`
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
    await queryInterface.dropTable(`articles`);
  }
};
