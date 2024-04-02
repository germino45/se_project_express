const clothingItem = require("../models/clothingItemSchema");
const {
  OKResponse,
  InvalidDataError,
  ForbiddenError,
  InvalidIdError,
  InternalError,
} = require("../utils/errors");

module.exports.getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => {
      res.status(OKResponse).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(InternalError)
        .send({ message: "Unable To Retrieve Data" });
    });
};

module.exports.postItem = (req, res) => {
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
        return res
          .status(InvalidDataError)
          .send({ message: "Cannot Create Item" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(ForbiddenError)
          .send({ message: "Cannot Complete Action" });
      }
      return item.deleteOne().then((user) => {
        res.send(user);
      });
    })
    .then(() => {
      res.status(OKResponse).send({ message: "Deletion Successful" });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(InvalidIdError).send({ message: "Data Not Found" });
      }
      if (err.name === "CastError") {
        return res.status(InvalidDataError).send({ message: "Bad Request" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};

module.exports.likeItem = (req, res) => {
  const user = req.user._id;
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
