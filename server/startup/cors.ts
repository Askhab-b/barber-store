import cors from "cors";
import { Express } from "express";
import 'dotenv/config'

export function initCORS(app: Express) {
  app.use(
    cors({
      origin: [`https://${process.env.HOST}`, `http://${process.env.HOST}`, `${process.env.HOST}`],
      methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
      credentials: true, // вкл set cookie
    })
  );
}
