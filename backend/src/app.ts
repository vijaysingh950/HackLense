import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import accountRoutes from "@/routes/account";
import eventRoutes from "@/routes/event";
import submissionRoutes from "@/routes/submission";
import { validateAuthToken } from "./middlewares/validateAuthToken";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(validateAuthToken());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
  return;
});

app.use("/account", accountRoutes);
app.use("/event", eventRoutes);
app.use("/submissions", submissionRoutes);

export default app;
