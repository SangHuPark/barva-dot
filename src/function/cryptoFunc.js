import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });

export async function createHashedPassword(plainPassword) {
    return new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ hashed_pw: key.toString('base64'), pw_salt: salt });
        });
    });
}

export async function makePasswordHashed(userId, plainPassword) {
    return new Promise(async (resolve, reject) => {
        const salt = await prisma.User.findMany({
                where: {
                    user_id: userId,
                },
            });

        crypto.pbkdf2(plainPassword, salt[0].pw_salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('base64'));
        });
    });
}

export async function makeAuthNumber() {
    const code = crypto.randomBytes(3).toString('hex');

    return code;
}