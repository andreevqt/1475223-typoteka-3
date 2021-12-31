'use strict';

const Base = require(`src/express/api-services/base`);
const {insertAt} = require(`../helpers`);
const {Collection} = require(`../helpers`);

class Search extends Base {
  async fetch(params) {
    let articles = new Collection();
    const {query} = params;
    // call instance method
    articles = await super.fetch(params);
    articles.items = articles.items.map((article) => {
      const idx = article.title.toLowerCase().indexOf(query.toLowerCase());
      if (idx !== -1) {
        let title = insertAt(article.title, idx, `<b>`);
        title = insertAt(title, idx + `<b>`.length + query.length, `</b>`);
        article.title = title;
      }
      return article;
    });

    return articles;
  }
}

module.exports = Search;
