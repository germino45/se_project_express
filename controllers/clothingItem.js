const clothingItem = require("../models/clothingItemSchema");
const {
  OKResponse,
  InvalidDataError,
  // ForbiddenError,
  InvalidIdError,
  InternalError,
} = require("../utils/errorCodes");

const BadRequestError = require("../utils/errors/BadRequestError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/notFoundError");
const ConflictError = require("../utils/errors/ConflictError");

module.exports.getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      res.status(OKResponse).send(items);
    })
    .catch((err) => {
      next(err);
      // console.error(err);
      // return res
      // .status(InternalError)
      // .send({ message: "Unable To Retrieve Data" });
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
        //return res
        //.status(ForbiddenError)
        //.send({ message: "Cannot Complete Action" });
      }
      return item.deleteOne().then(() => {
        res.status(OKResponse).send({ message: "Deletion Successful" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        new NotFoundError("Data Not Found");
      }
      if (err.name === "CastError") {
        new BadRequestError("Bad Request");
      } else {
        next(err);
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};

module.exports.likeItem = (req, res) => {
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
        return res.status(InvalidIdError).send({ message: "Cannot Find Item" });
      }
      if (err.name === "CastError") {
        return res.status(InvalidDataError).send({ message: "Bad Request" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};

module.exports.dislikeItem = (req, res) => {
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
        return res.status(InvalidIdError).send({ message: "Cannot Find Item" });
      }
      if (err.name === "CastError") {
        return res.status(InvalidDataError).send({ message: "Bad Request" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};
