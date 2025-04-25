import cors from "cors";
import express from "express";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import User from "./routes/user";
import LearningLog from "./routes/learningLog";
import Review from "./routes/review";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(clerkMiddleware())

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/v1/user", User);
app.use("/api/v1/learningLog", LearningLog);
app.use("/api/v1/review", Review);

export { app };
