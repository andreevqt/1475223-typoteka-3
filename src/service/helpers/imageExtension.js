'use strict';

const compare = (a, b, operator) => {
  /* eslint-disable indent */
  switch (operator) {
    case `=`: return a === b;
    case `>`: return a > b;
    case `<`: return a < b;
    case `>=`: return a >= b;
    case `<=`: return a <= b;
  }

  return null;
  /* eslint-enable */
};

const isNumber = (value) => {
  return typeof value === `number` && !isNaN(value);
};

const isString = (value) => {
  return typeof value === `string`;
};

const isArray = (value) => {
  return Array.isArray(value);
};

const _check = (buffer, headers) => {
  for (const [index, header] of headers.entries()) {
    if (header !== buffer[index]) {
      return false;
    }
  }
  return true;
};

const getType = (buffer) => {
  const check = (headers) => _check(buffer, headers);

  if (check([0xFF, 0xD8, 0xFF])) {
    return {
      ext: `jpg`,
      mime: `image/jpeg`
    };
  }

  if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
    return {
      ext: `png`,
      mime: `image/png`
    };
  }

  return {
    ext: `unknown`,
    mime: `unknown`
  };
};

const imageExtension = (joi) => ({
  type: `image`,
  base: joi.any(),
  messages: {
    'image.base': `{{#label}} must be a bas64 encoded image`,
    'image.allowed': `{{#label}}'s type must be {{#allowed}}`,
    'image.max': `{{#label}} must be less than {{#limit}} kb`,
    'image.min': `{{#label}} must be more than {{#limit}}`
  },

  coerce(value) {
    try {
      return {
        value: Buffer.from(value, `base64`)
      };
    } catch (_ignore) {}
  },

  validate(value, {error}) {
    if (!Buffer.isBuffer(value)) {
      return {value, errors: error(`image.base`)};
    }
  },

  rules: {
    compare: {
      method: false,

      validate(value, helpers, {limit}, {name, operator, args}) {
        const fileSize = value.toString().length / 1024;
        if (compare(fileSize, limit, operator)) {
          return value;
        }

        return helpers.error(`image.${name}`, {limit: args.limit, value});
      },

      args: [
        {
          name: `limit`,
          ref: true,
          assert: isNumber,
          message: `must be a number`
        }
      ]
    },

    max: {
      method(limit) {
        return this.$_addRule({name: `max`, method: `compare`, args: {limit}, operator: `<=`});
      }
    },

    min: {
      method(limit) {
        return this.$_addRule({name: `min`, method: `compare`, args: {limit}, operator: '>='});
      }
    },

    allowed: {
      method(allowed) {
        return this.$_addRule({name: `allowed`, args: {allowed}});
      },

      args: [
        {
          name: `allowed`,
          assert: isArray,
          message: `Must be an array`
        }
      ],

      validate(value, helpers, {allowed}) {
        const {ext} = getType(value);
        if (!allowed.includes(ext)) {
          return helpers.error(`image.allowed`, {allowed: allowed.join(`, `)});
        }

        return value;
      }
    }
  },

  cast: {
    string: {
      from: (value) => Buffer.isBuffer(value),
      to(value) {
        return value.toString(`base64`);
      }
    },

    buffer: {
      from: isString,
      to(value) {
        return Buffer.from(value, `base64`)
      }
    }
  },
});

module.exports = imageExtension;
