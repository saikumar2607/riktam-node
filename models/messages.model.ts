import { Schema, model, Types } from "mongoose";
const SchemaDef = new Schema({
    message: { type: String, required: [true, `Message text is required`] },
    from: { type: Types.ObjectId, ref: `users` },
    group: { type: Types.ObjectId, ref: `groups` },
    deleted: { type: Boolean, default: false },
    likes: { type: [Types.ObjectId], ref: `users` },
    dislikes: { type: [Types.ObjectId], ref: `users` }
}, { timestamps: true });

export const Messages = model(`messages`, SchemaDef);