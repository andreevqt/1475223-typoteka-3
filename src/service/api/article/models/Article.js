'use strict';

module.exports = {
  tableName: `articles`,
  relationships: {
    author: {
      type: `oneToMany`,
      master: true,
      target: `user`,
      foreignKey: `author_id`
    }
  }
}
