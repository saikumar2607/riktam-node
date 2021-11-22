import { Schema, model } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";
const SchemaDef = new Schema({
  refresh_token: { type: String },
  userId: { type: String },
}, { timestamps: true });
SchemaDef.plugin(mongoosePaginate);
export const RefreshTokenSchema = model("refresh_tokens", SchemaDef);
