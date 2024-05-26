require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Conected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.use("/", indexRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
