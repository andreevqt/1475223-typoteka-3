'use strict';

module.exports = ({service, model}) => {

  return {
    async find(req, res) {
      const {populate, ...params} = req.query;
      const results = await service.find(params, populate);
      return res.status(200).json(results);
    }
  }
}
