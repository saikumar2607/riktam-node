import { Schema, model } from "mongoose";
const SchemaDef = new Schema({
  email: { type: String },
  password: { type: String },
  role: { type: String },
}, { timestamps: true });
SchemaDef.index({ email: 1 });
export const UserSchema = model("users", SchemaDef);
