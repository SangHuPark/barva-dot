const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });

exports.createHashedPassword = async (plainPassword) => {
    return new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ hashed_pw: key.toString('base64'), pw_salt: salt });
        });
    });
}

exports.makePasswordHashed = async (userId, plainPassword) => {
    return new Promise(async (resolve, reject) => {
        const salt = await prisma.users
            .findUnique({
                where: {
                    user_id: userId,
                },
            })
            .then((result) => result.pw_salt)
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('base64'));
        });
    });
}

exports.makeAuthNumber = async () => {
    const code = crypto.randomBytes(3).toString('hex');

    return code;
}