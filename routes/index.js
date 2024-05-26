const router = require("express").Router();

const { InvalidIdError } = require("../utils/errorCodes");

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItem");
const { createUser, login } = require("../controllers/users");
const {
  clothingItemValidator,
  userInfoValidator,
  loginValidator,
  idValidator,
} = require("../middlewares/validation");

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);

router.post("/signup", userInfoValidator, createUser);

router.post("/signin", loginValidator, login);

router.use((req, res) => {
  res.status(InvalidIdError).send({ message: "Route not found" });
});

module.exports = router;
