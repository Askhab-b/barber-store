import rateLimit from "express-rate-limit";
import { Express } from "express";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 20,
  standardHeaders: true, // Информация об ограничении скорости возврата в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
});

export function initRateLimit(app: Express) {
  app.use(limiter);
}
