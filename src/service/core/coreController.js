'use strict';

module.exports = ({model, service}) => {
  return {
    async find(req, res) {
      const {query} = req;
      return service.find(query);
    }
  }
}
