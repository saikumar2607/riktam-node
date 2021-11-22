import * as express from "express";
import * as cors from "cors";
import { Request, Response, NextFunction, Application } from "express";
import { StatusCodes } from "http-status-codes";
import * as logger from "morgan";
import { connect as connectDatabase } from "mongoose";
const app: Application = express();
import * as api from "./api";
import { createAdmin } from "./utils/default-scripts";
const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;
connectDatabase(process.env.MONGO_URL || "mongodb://localhost/riktam-test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger("dev"));
app.get(`/sample-get`, async (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).send("Hello");
});
app.post(`/sample-post`, (req: Request, res: Response) => {
  res.send(req.body);
});
app.use(`/api`, api);

// Default scripts
createAdmin();

/**
 * Global Error handler
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res
    .status(
      (error as any).code < 600 ? (error as any).code : INTERNAL_SERVER_ERROR
    )
    .send({ errors: [{ error: error.message || (error as any).error }] });
});
export = app;
