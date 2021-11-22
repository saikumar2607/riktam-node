import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Messages } from "../../models/messages.model";
import { getFormattedError } from "../../utils/error-handler";
import { checkRequiredFields } from "../../utils/validation-utils";
const { OK } = StatusCodes;

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await Messages.create({
            ...req.body,
            from: res.locals.user._id
        }));
        return;
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await Messages.findByIdAndUpdate(req.params.message_id,
            { $set: { deleted: true } },
            { new: true }
        ).exec());
        return;
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await Messages.find({ group: req.params.id, deleted: false }).exec());
        return;
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function likeMessage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await Messages.findByIdAndUpdate(req.params.message_id,
            {
                $addToSet: { likes: [res.locals.user._id] }
            },
            { new: true }
        ).exec());
        return;
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function undoLike(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await Messages.findByIdAndUpdate(req.params.message_id,
            {
                $pullAll: { likes: [res.locals.user._id] }
            },
            { new: true }).exec());
        return;
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function dislikeMessage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await Messages.findByIdAndUpdate(req.params.message_id,
            {
                $addToSet: { dislikes: [res.locals.user._id] }
            },
            { new: true }).exec());
        return;
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function undoDislike(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await Messages.findByIdAndUpdate(req.params.message_id,
            {
                $pullAll: { dislikes: [res.locals.user._id] }
            },
            { new: true }
        ).exec());
        return;
    } catch (error) {
        next(getFormattedError(error));
    }
}
