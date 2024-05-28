const clothingItem = require("../models/clothingItemSchema");
const { OKResponse } = require("../utils/errorCodes");

const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/notFoundError");

module.exports.getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      res.status(OKResponse).send(items);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.postItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(OKResponse).send(item);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Cannot Create item"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("Cannot Complete Action");
      }
      return item.deleteOne().then(() => {
        res.status(OKResponse).send({ message: "Deletion Successful" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data Not Found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad Request"));
      } else {
        next(err);
      }
    });
};

module.exports.likeItem = (req, res, next) => {
  const user = req.user._id;
  console.log(user);
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: user } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(OKResponse).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot Find Item"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad Request"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const user = req.user._id;
  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: user } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(OKResponse).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot Find Item"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad Request"));
      } else {
        next(err);
      }
    });
};
