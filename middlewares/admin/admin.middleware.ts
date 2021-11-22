import { NextFunction, Request, Response } from "express";
import { RefreshTokenSchema } from "../../models/tokens.model";
import { UserSchema } from "../../models/user.model";
import { APIError, getFormattedError } from "../../utils/error-handler";
import { comparePassword, createJWT, hashPassword } from "../../utils/hash-utils";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "../../utils/enums";
import { checkRequiredFields } from "../../utils/validation-utils";
import { Types } from "mongoose";
const { OK } = StatusCodes;
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    checkRequiredFields(["email", "password"], req.body);
    const userObj: any = await UserSchema.findOne({ email }).exec();
    if (!userObj) {
      return next(new APIError(`No such user found.`));
    }
    if (userObj.role !== UserRole[UserRole.ADMIN]) {
      return next(new APIError(`Uauthorized`, 401));
    }
    if (comparePassword(password, userObj.password)) {
      const token = createJWT({ id: userObj._id });
      RefreshTokenSchema.create({ refresh_token: token, userId: userObj._id });
      res.status(OK).send({ token });
      return;
    }
    return next(new APIError(`Password mismatch.`));
  } catch (error) {
    next(getFormattedError(error));
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    RefreshTokenSchema.remove({ refresh_token: res.locals.token });
    res.status(OK).send("OK");
  } catch (error) {
    next(getFormattedError(error));
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    checkRequiredFields(["email", "password"], req.body);
    let createdUser = await UserSchema.create({
      ...req.body,
      role: UserRole[UserRole.USER],
      password: hashPassword(req.body.password)
    });
    res.status(OK).send(createdUser);
  } catch (error) {
    next(getFormattedError(error));
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(OK).send(await UserSchema.find({ role: { $ne: UserRole[UserRole.ADMIN] } }).select("-password").exec());
  } catch (error) {
    next;
  }
}
export async function editUser(req: Request, res: Response, next: NextFunction) {
  try {
    checkRequiredFields(["email", "password"], req.body);
    let updatedUser = await UserSchema.findByIdAndUpdate(req.params.id,
      { $set: { ...req.body, password: hashPassword(req.body.password) } },
      { new: true }
    ).select("-password").exec();
    res.status(OK).send(updatedUser);
  } catch (error) {
    next(getFormattedError(error));
  }
}