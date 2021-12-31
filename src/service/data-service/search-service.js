'use strict';

const BaseService = require(`./base-service`);
const {Op} = require(`sequelize`);

class SearchService extends BaseService {
  async search(page, limit, rest) {
    const options = {
      ...rest,
      where: {
        title: {
          [Op.iLike]: `%${rest.query}%`
        }
      }
    };

    return this._services.articles.paginate(page, limit, options);
  }
}

module.exports = SearchService;
