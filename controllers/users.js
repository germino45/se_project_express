const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const {
  OKResponse,
  InvalidDataError,
  UnauthorizedError,
  InvalidIdError,
  ConflictError,
  InternalError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

/* module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(InternalError).send({ message: "Server Error" });
    });
}; */

// create new user
module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        res
          .status(OKResponse)
          .send({ name: user.name, avatar: user.avatar, email: user.email });
        if (!email) {
          throw new Error({ message: "Email already exists" });
        }
      })
      .catch((err) => {
        console.error(err);
        console.log(err.name);
        if (err.code === 11000) {
          return res
            .status(ConflictError)
            .send({ message: "User already exists" });
        }
        if (err.name === "ValidationError") {
          return res.status(InvalidDataError).send({ message: "Invalid Data" });
        }
        return res.status(InternalError).send({ message: "Server Error" });
      });
  });
};

// login
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (!email || !password) {
        return res.status(InvalidDataError).send({ message: "Invalid Data" });
      }
      return res
        .status(UnauthorizedError)
        .send({ message: "You are unauthorized to view this page" });
    });
};

// get current user info
module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(InvalidIdError).send({ message: "User Not Found" });
      }
      if (err.name === "CastError") {
        return res.status(InvalidDataError).send({ message: "Bad Request" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};

// update user info
module.exports.updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(InvalidIdError).send({ message: "User Not Found" });
      }
      if (err.name === "CastError") {
        return res.status(InvalidDataError).send({ message: "Bad Request" });
      }
      return res.status(InternalError).send({ message: "Server Error" });
    });
};
