const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.existIdCheck = async (user_id) => {
    const idData = await prisma.users.findUnique({ 
        where : {
            user_id,
        }
    });

    if(!idData)
        return false;
    else
        return true;
}

exports.existNameCheck = async (user_name) => {
    const nameData = await prisma.users.findUnique({ 
        where : {
            user_name,
        },
    });

    if(!nameData)
        return false;
    else
        return true;
}

exports.insertUser = async (newUserInfo) => {
    const {
        user_id, hashed_pw, pw_salt, user_name
    } = newUserInfo;

    const newUser = await prisma.users.create({
        data: {
            user_id,
            user_pw: hashed_pw,
            pw_salt,
            user_name,
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
    const importUserInfo = await prisma.users.findUnique({
        where: {
            user_id,
        },
        select: {
            user_name: true,
        },
    });

    return importUserInfo;
}

exports.deleteUser = async (user_id) => {
    const deleteUserInfo = await prisma.users.findUnique({
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

    await prisma.users.delete({
        where: {
            user_id : user_id
        }
    });

    return deleteUserInfo;
}