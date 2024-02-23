const User = require("../models/userSchema");
const {
  OKResponse,
  InvalidDataError,
  InvalidIdError,
  InternalError,
} = require("../utils/constants");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(InternalError).send({ message: "Server Error" });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OKResponse).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(InvalidIdError).send({ message: "User Not Found" });
      } else if (err.name === "CastError") {
        return res.status(InvalidDataError).send({ message: "Bad Request" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(InvalidDataError).send({ message: "Invalid Data" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};
