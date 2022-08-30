import winston from "winston";
// require("winston-mongodb");
require("express-async-errors");

export function initLogger() {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(new winston.transports.Console());

  // winston.add(new winston.transports.MongoDB, {
  //   db: process.env.MONGO_URI,
  //   level: "info",
  // });
}
