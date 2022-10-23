import { prisma } from "../function/prisma-client.js";

export async function findUserProfile(user_id) {
    const profileResult = await prisma.user.findUnique({
        where : {
            user_id,
        },
        select : {
            user_nick: true,
            profile_url: true,
            user_introduce: true,
        }
    })
    .catch((err) => {
        throw new Error(err);
    });

    return profileResult;
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

export async function importUserCheckerboard(id) {
    const loadingResult = await prisma.post.findMany({
        where: {
            post_user: id,
        },
        select: {
            post_url: true,
        },
        orderBy: {
            post_id: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return loadingResult;
}

export async function importUserSingle(id) {
    const singleResult = await prisma.post.findMany({
        where : {
            post_user: id,
        },
        select : {
            post_content: true,
            likeCount: true,
            user_gender: true,
            user_tall: true,
            user_weight: true,
            created_at: true,
            post_url: true,
            post_users: {
                select: {
                    user_nick: true,
                    profile_url: true,
                },
            },
        },
        orderBy : {
            post_id: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return singleResult;
}

export async function insertSavePost(id, post_id) {
    await prisma.save_post.create({
        data: {
            stored_user: id,
            stored_post: post_id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function insertFollowing(id, user_nick) {
    const findPostUser = await prisma.user.findUnique({
        where: {
            user_nick,
        },
        select: {
            id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    await prisma.follow.create({
        data: {
            follower_id: id,
            following_id: findPostUser,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}