import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const CORS_ORIGIN: string = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// 404 middleware
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export { app };
