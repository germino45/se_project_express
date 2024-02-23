const express = require("express");
const mongoose = require("mongoose");
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

app.use((req, res, next) => {
  req.user = {
    _id: "65d54e56947157f5af53cced",
  };
  next();
});
app.use("/", indexRouter);

const { PORT = 3001 } = process.env;

console.log("hello world");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
