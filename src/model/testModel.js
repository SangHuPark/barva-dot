import { prisma } from "../function/prisma-client.js";

export async function insertColor(body, post_url, id) {
    const { post_content, color_extract, user_gender, user_tall, user_weight } = body;

    await prisma.post.create({
        data: {
            post_content,
            color_extract,
            post_url,
            user_gender,
            user_tall,
            user_weight,
            post_users: { 
                connect: {
                    id,
                }
            },
        },
    });
}

// 오늘의 색상 관련 API
export async function importTodayColor() {
    const todayColor = await prisma.post.findFirst({
        select : {
            color_extract: true,
        },
        orderBy : {
            likeCount: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return todayColor;
}

export async function importColorCheckerboard(color_extract) {
    const loadingResult = await prisma.post.findMany({
        where : {
            color_extract,
        },
        select : {
            post_url: true,
        },
        orderBy : {
            likeCount: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return loadingResult;
}

export async function importColorSingle(color_extract) {
    const loadingResult = await prisma.post.findMany({
        where : {
            color_extract,
        },
        select : {
            post_id: true,
            post_content: true,
            likeCount: true,
            user_gender: true,
            user_tall: true,
            user_weight: true,
            created_at: true,
            post_url: true,
            post_users: {
                select : {
                    user_nick: true,
                    profile_url: true,
                },
            },
            save_posts: {
                select: {
                    stored_user: true,
                    stored_post: true,
                },
            },
            likes_post: {
                select: {
                    like_user: true,
                    like_post: true,
                },
            },
        },
        orderBy : {
            likeCount: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return loadingResult;
}