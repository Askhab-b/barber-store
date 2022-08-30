import { Express } from "express";
import helmet from "helmet";
import compression from "compression";
import 'dotenv/config'

// Инициализируем сжатие и добавляем заголовки безопасности
export function initProd(app: Express) {
  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
    app.use(compression());
  }
}
