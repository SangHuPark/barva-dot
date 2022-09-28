const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.existIdCheck = async (user_id) => {
    const idData = await prisma.User.findUnique({ 
        where : {
            user_id,
        }
    });

    return idData;
}

exports.existNickCheck = async (user_nick) => {
    const nickData = await prisma.User.findUnique({ 
        where : {
            user_nick,
        },
    });

    return nickData;
}

exports.existMailCheck = async (user_email) => {
    const mailData = await prisma.User.findUnique({
        where : {
            user_email,
        },
    });

    if(!mailData)
        return false;
    else
        return true;
}

exports.insertUser = async (newUserInfo) => {
    const {
        user_name, user_nick, user_id, hashed_pw, pw_salt, user_email, marketing
    } = newUserInfo;

    const newUser = await prisma.User.create({
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

    return newUser;
}

exports.importUserName = async (user_id) => {
    const importUserInfo = await prisma.User.findUnique({
        where: {
            user_id,
        },
        select: {
            user_name: true,
        },
    });

    return importUserInfo;
}

exports.findUserId = async (user_name, user_email) => {
    const importUserId = await prisma.User.findMany({
        where: {
            user_name,
            user_email,
        },
        select: {
            user_id: true,
        }
    });

    return importUserId;
}

exports.updateUserPw = async (updateUserInfo) => {
    const { user_id, hashed_pw, pw_salt } = updateUserInfo;

    const updateUserResult = await prisma.User.updateMany({
        where: {
            user_id,
        },
        data: {
            user_pw: hashed_pw,
            pw_salt,
        },
    });

    return updateUserResult;
}

exports.deleteUser = async (user_id) => {
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