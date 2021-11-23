import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { APIError, getFormattedError } from "./error-handler";

export function checkRequiredFields(filedsRequired: any, payload: any) {
    if (!Array.isArray(filedsRequired)) {
        throw new APIError(`Fields required must be an array`);
    }
    const payloadKeys = Object.keys(payload);
    const missingFields = filedsRequired.filter(field => !payloadKeys.includes(field));
    if (missingFields.length) {
        throw new APIError(`${missingFields.join(", ")} are required field(s)`);
    }
    let missingDataField = filedsRequired.some(field => !payload[field] || !payload[field].trim().length);
    if (missingDataField) {
        throw new APIError(`${missingDataField} requires a value`);
    }
    return;
}

export async function validateId(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, message_id } = req.params;
        const idToValidate = id || message_id;
        if (!idToValidate) {
            return next(new APIError(`Invalid params`, 400));
        }
        if (!isValidObjectId(idToValidate)) {
            return next(new APIError(`Invalid params`, 400));
        }
        next();
    } catch (error) {
        return next(getFormattedError(error));
    }
}