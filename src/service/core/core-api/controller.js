'use strict';

module.exports = ({service, model}) => {

  return {
    async find(req, res) {
      const {query} = req;
      const results = await service.find(query);
      return res.status(200).json(results);
    }
  }
}
