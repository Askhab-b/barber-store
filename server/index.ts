import winston from "winston";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import express from "express";
import 'dotenv/config'

import { initProd } from "@startup/prod";
import { initDB } from "@startup/db";
import { initCORS } from "@startup/cors";
import { initLogger } from "@startup/logging";
import { initPassportJS } from "@startup/passport";
import { initRoutes } from "@routes/index";
import { initRateLimit } from "@startup/rate-limit";

const port = process.env.PORT || 3900;
const app = express();

initPassportJS();
initLogger();
initCORS(app);
initDB();
initProd(app);
initRateLimit(app);

// Создается сессия
app.use(
  session({
    // Используется для вычисления хэша
    secret: process.env.SESSION_KEY!,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true } Когда мы используем HTTPS
    // Сессия сохраняется в базе данных
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/test",
    }),
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

initRoutes(app);

app.listen(port, () => winston.info(`Сервер запущен на порту ${port}...`));
