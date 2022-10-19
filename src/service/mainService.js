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

export async function insertPost(user_id, post_url, contents) {
    const { post_content, user_gender, user_tall } = contents;
    const user = await prisma.user.findUnique({
        where: {
            user_id,
        },
        select: {
            id: true,
        }
    })
    .catch((err) => {
        throw new Error(err);
    });

    await prisma.post.create({
        data: {
            post_content,
            post_url,
            user_gender,
            user_tall,
            post_users: { 
                connect: {
                    id: user.id,
                }
            },
            user_weight,
        }
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function importUserCheckerboard(user_id) {
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

    const loadingResult = await prisma.post.findMany({
        where: {
            post_user: findPostId.id,
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

export async function importSingle(user_id) {
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
    
    const loadingResult = await prisma.post.findMany({
        where : {
            post_user: findPostId.id,
        },
        select : {
            post_content: true,
            likeCount: true,
            user_gender: true,
            user_tall: true,
            created_at: true,
            post_url: true,
            //user_weight: true,
        },
        orderBy : {
            post_id: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return loadingResult;
}