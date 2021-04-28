'use strict';

module.exports = ({model, app}) => {
  const {modelName} = model;

  return {
    find(params, populate) {
      return app.entityService.find({params, populate}, {model: modelName});
    }
  }
}
  
