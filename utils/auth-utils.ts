import { Request, Response, NextFunction } from "express";
import { RefreshTokenSchema } from "../models/tokens.model";
import { UserSchema } from "../models/user.model";
import { UserRole } from "./enums";
import { APIError } from "./error-handler";
import { verifyJWT } from "./hash-utils";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.headers.authorization && !req.query.token) {
        return next(new APIError(`Missing authentication.`));
    }
    let bearerToken: string = (req.query.token ?
        req.query.token :
        (req.headers.authorization as string).substring(7, (req.headers.authorization as string).length
        )) as string;
    try {
        const tokenObj: any = verifyJWT(bearerToken);
        const validToken = await RefreshTokenSchema.findOne({
            refresh_token: bearerToken,
        });
        if (!validToken) {
            return next(new APIError(`Invalid authentication token`, 401));
        }
        const user = await UserSchema.findById(tokenObj.id).exec();
        if (!user) {
            return next(new APIError(`No such user found`));
            return;
        }
        res.locals.user = user;
        res.locals.token = bearerToken;
        next();
    } catch (error) {
        return next(new APIError(`Unauthorized`, 401));
    }
}

export async function strictlyAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        if (!res.locals.user) {
            return next(new APIError(`Unauthorized`, 401));
        }
        if (res.locals.user.role != UserRole[UserRole.ADMIN]) {
            return next(new APIError(`Unauthorized`, 401));
        }
        next();
    } catch (error) {
        return next(new APIError(`Unauthorized`, 401));
    }
}

export async function strictlyUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!res.locals.user) {
            return next(new APIError(`Unauthorized`, 401));
        }
        if (res.locals.user.role != UserRole[UserRole.USER]) {
            return next(new APIError(`Unauthorized`, 401));
        }
        next();
    } catch (error) {
        return next(new APIError(`Unauthorized`, 401));
    }
}
