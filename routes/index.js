const router = require("express").Router();

const { InvalidIdError } = require("../utils/constants");

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItem");

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(InvalidIdError).send({ message: "Route not found" });
});

module.exports = router;
