import { prisma } from "../function/prisma-client.js";

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

// 오늘의 색상 관련 API
export async function importTodayColor() {
    const todayColor = await prisma.post.findMany({
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

    return todayColor[0];
}

export async function importColorCheckerboard(todayColor) {
    const loadingResult = await prisma.post.findMany({
        where : {
            color_extract: todayColor,
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

export async function importColorSingle(todayColor) {
    const loadingResult = await prisma.post.findMany({
        where : {
            color_extract: todayColor,
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
    const loadingResult = await prisma.post.findMany({
        where : {
            user_gender,
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