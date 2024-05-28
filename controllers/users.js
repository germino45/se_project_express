const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { OKResponse } = require("../utils/errorCodes");

const ConflictError = require("../utils/errors/ConflictError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");

const NotFoundError = require("../utils/errors/notFoundError");

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
module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        res
          .status(OKResponse)
          .send({ name: user.name, avatar: user.avatar, email: user.email });
      })
      .catch((err) => {
        console.error(err);
        console.log(err.name);
        if (err.code === 11000) {
          next(new ConflictError("User already exists"));
        }
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid Data"));
        } else {
          next(err);
        }
      });
  });
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Invalid Data"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("You are unauthorized to view this page"));
      } else {
        next(err);
      }
    });
};

// get current user info
module.exports.getCurrentUser = (req, res, next) => {
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
        next(new NotFoundError("User Not Found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad Request"));
      } else {
        next(err);
      }
    });
};

// update user info
module.exports.updateCurrentUser = (req, res, next) => {
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
      if (err.message === "DocumentNotFoundError") {
        next(new NotFoundError("User Not Found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad Request"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};
