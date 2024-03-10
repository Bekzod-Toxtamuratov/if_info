
require("winston-mongodb");
const config = require("config");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint, json, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.MongoDB({
      db: config.get("dbUri"),
      options: {
        useUnifiedTopology: true,
      },
    }),
  ],
});

// logger.exitOnError = false;

// logger.exceptions.handle(
//   new transports.File({ filename: "log/exceptions.log" })
// );

// logger.exceptions.handle(
//   new transports.File({ filename: "log/rejection.log" })
// );

module.exports = logger;
