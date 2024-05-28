const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

module.exports.clothingItemValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "Name" field must be filled in',
      "string.min": 'The minimum length of the "Name" field is 2',
      "string.max": 'The maximum length of the "Name" field is 30',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Image Url" field must be filled in',
      "string.uri": 'The "Image Url" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": "Please select a weather type",
    }),
  }),
});

module.exports.userInfoValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "Name" field must be filled in',
      "string.min": 'The minimum length of the "Name" field is 2',
      "string.max": 'The maximum length of the "Name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Avatar" field must be filled in',
      "string.uri": 'The "Avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "Email" field must be filled in',
      "string.email": 'The "Email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "Password" field must be filled in',
    }),
  }),
});
module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "Email" field must be filled in',
      "string.email": 'The "Email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "Password" field must be filled in',
    }),
  }),
});

module.exports.idValidator = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.empty": 'The "Name" field must be filled in',
      "string.min": 'The minimum length of the "Name" field is 2',
      "string.max": 'The maximum length of the "Name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Avatar" field must be filled in',
      "string.uri": 'The "Avatar" field must be a valid url',
    }),
  }),
});
