import { UserSchema } from "../models/user.model";
import { UserRole } from "./enums";
import { hashPassword } from "./hash-utils";

export async function createAdmin() {
  return await UserSchema.findOneAndUpdate({ email: "admin@gmail.com" },
    {
      $set: {
        email: "admin@gmail.com",
        password: hashPassword("Hello@123"),
        role: UserRole[UserRole.ADMIN]
      }
    },
    { upsert: true }).exec();
}
