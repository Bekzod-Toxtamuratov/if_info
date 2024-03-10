const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require("cookie-parser");

const mainRouter = require("./routes/index.routes");

const error_handing_middleware = require("./middleware/error_handing_middleware");

const winston = require("winston");
const expressWinston = require("express-winston");
const {
  expressWinstonLogger,
  expressWinstonErrorLogger,
} = require("./middleware/loggerMiddleware");

const app = express();

const PORT = config.get("port") || 3030;
app.use(cookieParser()); // frontend kelyatgan cookie parse qiladi;
app.use(express.json());

app.use(expressWinstonLogger);
app.use(expressWinstonErrorLogger);


app.use("/api", mainRouter);


app.use(error_handing_middleware);

async function start() {
  try {
    await mongoose.connect(config.get("dbUri"));
    app.listen(PORT, () => {
      console.log(`Server is working ${PORT}- ishga tuwdi`);
    });
  } catch (error) {
    console.log("Malumotlar bazasida ulanishda xatolik");
  }
}
start();
