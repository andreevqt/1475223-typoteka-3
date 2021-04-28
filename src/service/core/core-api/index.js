'use strict';

const _ = require(`lodash`);
const createController = require(`./controller`);
const createService = require(`./service`);


module.exports = ({api, model, app}) => {
  const {modelName} = model;

  const userService = _.get(api, [`services`, modelName], {});
  const userController = _.get(api, [`controllers`, modelName], {});

  const service = Object.assign(createService({model, app}), userService);
  const controller = Object.assign(createController({service, model}), userController);


  return {
    service,
    controller
  };
}

