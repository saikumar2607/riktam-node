export const PORT = 7000;
export const BASE_URL = `http://localhost:${PORT}`;
import { Server } from 'http';
import * as app from "../app";
import { UserSchema } from '../models/user.model';

let server: Server;

export function dropTables() {
    UserSchema.remove({}).exec();
    return;
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
