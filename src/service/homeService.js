import { prisma } from "../function/prismaFunc.js";

export async function findUserProfile(user_id) {
    const profileResult = await prisma.user.findUnique({
        where : {
            user_id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const findPostResult = await prisma.post.findMany({
        where : {
            post_user: profileResult.id,
        },
        select : {
            post_url: true,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    profileResult.post_url = findPostResult;

    return profileResult;
}

export async function insertProfileImg(user_id, profile_url) {
    await prisma.user.update({
        where: {
            user_id,
        },
        data: {
            profile_url,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function insertProfileIntro(user_id, user_introduce) {
    await prisma.user.update({
        where: {
            user_id,
        },
        data: {
            user_introduce,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}
