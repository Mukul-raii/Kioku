import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import User from "./routes/user";
import QuickTest from "./routes/quick-test";
import LearningLog from "./routes/learningLog";
import "./libs/redis";
import Review from "./routes/review";
import { clerkMiddleware } from "@clerk/express";
import { errrorHandler } from "./libs/asyncHandler";
import { main } from "./query.test";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(clerkMiddleware());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/v1/user", User);
app.use("/api/v1/learningLog", LearningLog);
app.use("/api/v1/review", Review);
app.use("/api/v1/quick_test",QuickTest );

main()

app.use(errrorHandler);

export { app };
