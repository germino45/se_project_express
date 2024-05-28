const router = require("express").Router();

const NotFoundError = require("../utils/errors/notFoundError");

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItem");
const { createUser, login } = require("../controllers/users");
const {
  userInfoValidator,
  loginValidator,
} = require("../middlewares/validation");

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);

router.post("/signup", userInfoValidator, createUser);

router.post("/signin", loginValidator, login);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
