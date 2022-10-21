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
    const { post_content, user_gender, user_tall, user_weight } = contents;
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
            user_weight,
            post_users: { 
                connect: {
                    id: user.id,
                }
            },
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

export async function importUserSingle(user_id) {
    const findPostUser = await prisma.user.findUnique({
        where : {
            user_id,
        },
        select : {
            user_nick: true,
            profile_url: true,
            id: true,
        }
    })
    .catch((err) => {
        throw new Error(err);
    });
    
    const singleResult = await prisma.post.findMany({
        where : {
            post_user: findPostUser.id,
        },
        select : {
            post_content: true,
            likeCount: true,
            user_gender: true,
            user_tall: true,
            user_weight: true,
            created_at: true,
            post_url: true,
        },
        orderBy : {
            post_id: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return { findPostUser, singleResult };
}

export async function importNewestCheckerboard() {
    const loadingResult = await prisma.post.findMany({
        select : {
            post_url: true,
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

export async function importNewestSingle() {
    const loadingResult = await prisma.post.findMany({
        where : {
            user
        },
        select : {
            post_content: true,
            likeCount: true,
            user_gender: true,
            user_tall: true,
            user_weight: true,
            created_at: true,
            post_url: true,
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

/** 오늘의 색상 관련 API
export async function importColorCheckerboard() {
    const loadingResult = await prisma.post.findMany({
        select : {
            post_url: true,
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

export async function importColorSingle() {
    const loadingResult = await prisma.post.findMany({
        select : {
            post_content: true,
            likeCount: true,
            user_gender: true,
            user_tall: true,
            user_weight: true,
            created_at: true,
            post_url: true,
        },
        orderBy : {
            post_id: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return loadingResult;
} */

export async function importGenderCheckerboard(user_gender) {
    const loadingResult = await prisma.post.findMany({
        where : {
            user_gender,
        },
        select : {
            post_url: true,
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

export async function importGenderSingle(user_gender) {

}