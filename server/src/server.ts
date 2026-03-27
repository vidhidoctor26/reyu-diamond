import express, { type Application, type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
import http from "http";
import helmet from "helmet";
import { apiLimiter } from "./middlewares/rateLimit.middleware";
import connectDB from "./config/db.js";
import cors, { CorsOptions } from "cors";
import routes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { stripeWebhookController } from "./controllers/stripe.webhook.controller.js";
import { initAuctionCron } from "./cron/auction.cron.js";
import logger from "./utils/logger";
import { initSocket } from "./socket/socket";

dotenv.config();
connectDB();

const app: Application = express();

// CORS
const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Stripe webhook
app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(apiLimiter);

// File size error
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "One or more files exceed 20MB limit",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// Routes
app.use("/api/reyu-diamond/", routes);

// Error handler
app.use(errorHandler);

// =========================
// SOCKET + SERVER
// =========================

const server = http.createServer(app);

// ✅ Initialize socket (THIS HANDLES EVERYTHING)
initSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    port: PORT,
    env: process.env.NODE_ENV,
  });

  initAuctionCron();
});