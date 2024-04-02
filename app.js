const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");

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

app.use("/", indexRouter);
app.use(cors());

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
