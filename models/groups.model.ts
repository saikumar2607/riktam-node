import { Schema, model, Types } from "mongoose";
const SchemaDef = new Schema({
    name: { type: String, required: [true, `name is required`] },
    createdBy: { type: Types.ObjectId, ref: `users`, required: [true, `Created by is required`] },
    members: { type: [Types.ObjectId], ref: `users`, default: [] },
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

export const GroupSchema = model("groups", SchemaDef);