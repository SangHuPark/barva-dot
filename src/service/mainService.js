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

export async function findUserFeed(user_id) {
    const findPostId = await prisma.user.findUnique({
        where : {
            user_id,
        },
        select : {
            id: true,
        }
    })
    .catch((err) => {
        throw new Error(err);
    });

    const findPostResult = await prisma.post.findMany({
        where : {
            post_user: findPostId.id,
        },
        select : {
            created_at: true,
            post_url: true,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return findPostResult;
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

export async function upload(user_id, post_url, contents) {
    const { post_content, user_gender, user_tall } = contents;
    await prisma.post.create({
        data: {
            post_content,
            post_url,
            user_gender,
            user_tall,
            post_user: user_id,
        }
    })
    .catch((err) => {
        throw new Error(err);
    })
}