import { NextFunction, Request, Response } from "express";
import { RefreshTokenSchema } from "../../models/tokens.model";
import { UserSchema } from "../../models/user.model";
import { APIError, getFormattedError } from "../../utils/error-handler";
import { comparePassword, createJWT, hashPassword } from "../../utils/hash-utils";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "../../utils/enums";
import { checkRequiredFields } from "../../utils/validation-utils";
const { OK } = StatusCodes;
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        checkRequiredFields(["email", "password"], req.body);
        const userObj: any = await UserSchema.findOne({ email }).exec();
        if (!userObj) {
            return next(new APIError(`No such user found.`));
        }
        if (userObj.role !== UserRole[UserRole.USER]) {
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
        res.status(OK).send({});
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function searchUser(req: Request, res: Response, next: NextFunction) {
    try {
        let searchQuery = { role: UserRole[UserRole.ADMIN], _id: { $ne: res.locals.user._id } };
        const searchKey: string = (req.query.searchKey) as string;
        if (searchKey) {
            Object.assign(searchQuery, { email: new RegExp(searchKey, "i") });
        }
        res.status(OK).send(await UserSchema.find(searchQuery).select("-password").exec());
    } catch (error) {
        next(getFormattedError(error));
    }
}