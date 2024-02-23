const router = require("express").Router();

const { InvalidDataError } = require("../utils/constants");

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItem");

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(InvalidDataError).send({ message: "Route not found" });
});

module.exports = router;
