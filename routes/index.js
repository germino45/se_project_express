const router = require("express").Router();

const { InvalidIdError } = require("../utils/errors");

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItem");
const { createUser, login } = require("../controllers/users");

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);

router.post("/signup", createUser);

router.post("/signin", login);

router.use((req, res) => {
  res.status(InvalidIdError).send({ message: "Route not found" });
});

module.exports = router;
