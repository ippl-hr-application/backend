import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { ErrorMiddleware } from "./middlewares";
import { authRoute } from "./features/auth";
import { submissionRoute } from "./features/submission";
import { profileRoute } from "./features/profile";
import { accountRoute } from "./features/account";
import { scheduleRoute } from "./features/schedule";

dotenv.config();
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoute);
app.use("/submission", submissionRoute);
app.use("/schedules", scheduleRoute);
app.use("/profile", profileRoute);
app.use("/account", accountRoute);

app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.returnError);

export default app;
