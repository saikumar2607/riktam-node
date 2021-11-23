import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { GroupSchema } from "../../models/groups.model";
import { getFormattedError } from "../../utils/error-handler";
import { checkRequiredFields } from "../../utils/validation-utils";
const { OK } = StatusCodes;

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await GroupSchema.create({ ...req.body, createdBy: res.locals.user._id }));
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const { _id } = res.locals.user;
        res.status(OK).send(await GroupSchema.find({
            deleted: false,
            $or: [
                { createdBy: _id },
                { members: { $in: [_id] } }]
        }
        ).exec());
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function edit(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await GroupSchema.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true }
        ).exec());
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function deleteGroup(req: Request, res: Response, next: NextFunction) {
    try {
        await GroupSchema.findByIdAndUpdate(req.params.id,
            { $set: { deleted: true } }
        ).exec();
        res.status(OK).send(await list(req, res, next));
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function addMember(req: Request, res: Response, next: NextFunction) {
    try {
        checkRequiredFields(["member"], req.body);
        res.status(OK).send(await GroupSchema.findByIdAndUpdate(req.params.id,
            { $push: { members: req.body.member } },
            { new: true }
        ).exec());
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function deleteMember(req: Request, res: Response, next: NextFunction) {
    try {
        checkRequiredFields(["member"], req.body);
        res.status(OK).send(await GroupSchema.findByIdAndUpdate(req.params.id,
            { $pull: { members: req.body.member } },
            { new: true }
        ).exec());
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function getMembers(req: Request, res: Response, next: NextFunction) {
    try {
        let { members }: any = await GroupSchema.findById(req.params.id)
            .populate({ path: `members` })
            .lean()
            .exec();
        res.status(OK).send({ members });
    } catch (error) {
        next(getFormattedError(error));
    }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(OK).send(await GroupSchema.findById(req.params.id)
            .populate({ path: "members" }).exec()
        );
    } catch (error) {
        next(getFormattedError(error));
    }
}