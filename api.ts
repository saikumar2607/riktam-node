const express = require("express");
import { Request, Response, NextFunction, Application } from "express";
import { StatusCodes } from "http-status-codes";
const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;
import * as adminRouter from "./controllers/admin/admin.controller";
import * as userRouter from "./controllers/users/user.controller";
import * as groupRouter from "./controllers/groups/group.controller";
const app: Application = express();

app.get(`/test-get`, async (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).send("Hello");
});
app.post(`/test-post`, (req: Request, res: Response) => {
  res.send(req.body);
});
app.use(`/admin`, adminRouter);
app.use(`/users`, userRouter);
app.use(`/groups`, groupRouter);

// Error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res
    .status(
      (error as any).code < 600 ? (error as any).code : INTERNAL_SERVER_ERROR
    )
    .send({ errors: [{ error: error.message || (error as any).error }] });
});

export = app;
