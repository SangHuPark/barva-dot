import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function existIdCheck(user_id) {
    const existIdResult = await prisma.User.findUnique({ 
        where : {
            user_id,
        }
    })
    .catch(() => {
        throw new Error(err);
    });

    return existIdResult;
}

export async function existNickCheck(user_nick) {
    const existNickResult =  await prisma.User.findUnique({ 
        where : {
            user_nick,
        },
    })
    .catch(() => {
        throw new Error(err);
    });

    return existNickResult;
}

export async function existMailCheck(user_email) {
    const existMailResult = await prisma.User.findUnique({
        where : {
            user_email,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    if(!existMailResult)
        return false;
    else
        return true;
}

export async function insertUser(newUserInfo) {
    const {
        user_name, user_nick, user_id, hashed_pw, pw_salt, user_email, marketing
    } = newUserInfo;

    await prisma.User.create({
        data: {
            user_name,
            user_nick,
            user_id,
            user_pw: hashed_pw,
            pw_salt,
            user_email,
            marketing: marketing,
        },
    })
    .then((result) => { // 회원 가입 성공 시
        return result;
    })
    .catch((err) => { // 회원 가입 실패 시
        throw new Error(err);
    });

    // return newUser;
}

export async function importUserName(user_id) {
    const importNameResult = await prisma.User.findMany({
        where: {
            user_id,
        },
        select: {
            user_name: true,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return importNameResult[0].user_name;
}

export async function findUserId(findIdData) {
    const findIdResult = await prisma.User.findMany({
        where: {
            user_name: findIdData.user_name,
            user_email: findIdData.user_email,
        },
        select: {
            user_id: true,
        }
    })
    .catch((err) => {
        throw new Error(err);
    });

    return findIdResult;
}

export async function findUserPw(findPwData) {
    await prisma.User.findMany({
        where: {
            user_name: findPwData.user_name,
            user_id: findPwData.user_id,
        },

    })
    .then(() => {
        return true;
    })
    .catch(() => {
        return false;
    })
}

export async function updateUserPw(updateUserInfo) {
    const { user_id, hashed_pw, pw_salt } = updateUserInfo;

    await prisma.User.updateMany({
        where: {
            user_id,
        },
        data: {
            user_pw: hashed_pw,
            pw_salt,
        },
    });

    // return updateUserResult;
}

export async function deleteUser(user_id) {
    const deleteUserInfo = await prisma.User.findUnique({
        where: { 
            user_id,
        },
        select: {
            user_id: true,
            user_name: true,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    await prisma.User.delete({
        where: {
            user_id : user_id
        }
    });

    return deleteUserInfo;
}