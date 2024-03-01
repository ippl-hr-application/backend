import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";

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

export default app;