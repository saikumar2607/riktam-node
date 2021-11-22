import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { hashSync, compareSync } from "bcryptjs";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
const SECRET: string = "API_SECRET";
const ACCESS_TOKEN_LIFETIME = "365d";
const SALTROUNDS = 10;
const ALGORITHM = "aes-256-ctr";
const key = randomBytes(32);
const iv = randomBytes(16);

//  Hash password
export function hashPassword(password: string) {
  try {
    return hashSync(password, SALTROUNDS);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//  Compare Password
export function comparePassword(password: string, hash_password: string) {
  try {
    return compareSync(password, hash_password);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//  Create JWT life time
export function createJWT(id: any) {
  return jwtSign(id, SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
}

//  JWT VERIFY
export function verifyJWT(id: string) {
  try {
    return jwtVerify(id, SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          throw new Error(`Token expired`);
        }
        if (err.name == "JsonWebTokenError") {
          throw new Error(`Invalid token`);
        }
      }
      return decoded;
    });
  } catch (err) {
    throw err;
  }
}
export async function encrypt(text: string) {
  let cipher = createCipheriv(ALGORITHM, key, iv);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

export function decrypt(text: string) {
  var decipher = createDecipheriv(ALGORITHM, key, iv);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

export async function genetePasswordLink(payload?: any) {
  const TOKEN_VALIDITY: number = (process.env.TOKEN_VALIDITY ||
    1 * 60 * 60 * 1000) as number;
  let text = JSON.stringify(
    payload || {
      expires: new Date().getTime() + TOKEN_VALIDITY,
    }
  );
  let token = await encrypt(text);
  return token;
}
