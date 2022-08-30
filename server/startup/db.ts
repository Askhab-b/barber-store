import mongoose from "mongoose";
import winston from "winston";
import 'dotenv/config'

export function initDB() {
  const db = process.env.MONGO_URI || "mongodb://localhost:27017/test";

  mongoose
    .connect(db)
    .then(() => winston.info(`Подключение к базе данных ${db}...`))
    .catch((error) => winston.error(error));
}
