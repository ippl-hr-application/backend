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
import { shiftRoute } from "./features/shift";
import { taskManagementRoute } from "./features/task-management";
import { attendanceRoute } from "./features/attendance";
import { jobPositionRoute } from "./features/job-position";
import { employmentRoute } from "./features/employment-status";
import { documentRoute } from "./features/document-management";
import { companyBranchRoute } from "./features/company-branch";

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
// app.use("/attendance", attendanceRoute);
app.use("/submission", submissionRoute);
app.use("/shift", shiftRoute);
app.use("/profile", profileRoute);
app.use("/account", accountRoute);
app.use("/task-management", taskManagementRoute);
app.use("/job-position", jobPositionRoute);
app.use("/employment-status", employmentRoute);
app.use("/doc", documentRoute);
app.use("/company-branch", companyBranchRoute);

app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.returnError);

export default app;
