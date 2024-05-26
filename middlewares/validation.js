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
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().custom(validateURL),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

module.exports.userInfoValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.idValidator = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
  }),
});
