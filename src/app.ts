import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routers from "./app/routers";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use("/v1/api", routers);

// Home Route.
const homeRoute = (req: Request, res: Response) => {
  res.status(200).json({
    server: "Active",
    success: true,
    stutas: 200,
    message: "This is Home Route.",
  });
};

app.get("/", homeRoute);
// Error handling middleware
app.use(globalErrorHandler as unknown as express.ErrorRequestHandler);
app.use(notFound as unknown as express.ErrorRequestHandler);
export default app;
