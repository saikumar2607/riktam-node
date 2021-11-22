export const PORT = 7000;
export const BASE_URL = `http://localhost:${PORT}`;
import { Server } from 'http';
import * as app from "../app";
import { GroupSchema } from '../models/groups.model';
import { Messages } from '../models/messages.model';
import { RefreshTokenSchema } from '../models/tokens.model';
import { UserSchema } from '../models/user.model';

let server: Server;

export async function dropTables() {
    return await Promise.all([
        UserSchema.remove({}),
        RefreshTokenSchema.remove({}),
        GroupSchema.remove({}),
        Messages.remove({}),
    ]);
}

export function startServer() {
    return new Promise((resolve, reject) => {
        server = app.listen(PORT, () => {
            resolve(true);
        });
    });
}

export function stopServer() {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
}
