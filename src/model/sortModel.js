import { prisma } from "../function/prisma-client.js";

export async function importNewestCheckerboard() {
    const loadingResult = await prisma.post.findMany({
        select : {
            post_url: true,
        },
        orderBy : {
            created_at: 'desc',
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
            created_at: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return loadingResult;
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

export async function importColorCheckerboard(todayColor) {
    const loadingResult = await prisma.post.findMany({
        where : {
            color_extract: todayColor,
        },
        select : {
            post_url: true,
        },
        orderBy : {
            created_at: 'desc',
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
            created_at: 'desc',
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
            created_at: 'desc',
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
            created_at: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return loadingResult;
}

export async function findOtherProfile(id, user_nick) {
    const profileResult = await prisma.user.findUnique({
        where : {
            user_nick,
        },
        select : {
            id: true,
            user_name: true,
            user_nick: true,
            profile_url: true,
            user_introduce: true,
        }
    })
    .catch((err) => {
        throw new Error(err);
    });

    const countPost = await prisma.post.count({
        where: {
            post_user: profileResult.id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const countFollower = await prisma.follow.count({
        where: {
            following_id: profileResult.id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const countFollowing = await prisma.follow.count({
        where: {
            follower_id: profileResult.id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const isFollowing = await prisma.follow.findFirst({
        where: {
            follower_id: id,
            following_id: profileResult.id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    })

    profileResult.countPost = countPost;
    profileResult.countFollower = countFollower;
    profileResult.countFollowing = countFollowing;
    profileResult.isFollowing = isFollowing;
    delete profileResult.id;

    return profileResult;
}

export async function importOtherCheckerboard(user_nick) {
    const checkerboardResult = await prisma.post.findMany({
        where: {
            post_users: {
                user_nick,
            },
        },
        select: {
            post_url: true,
        },
        orderBy: {
            created_at: 'desc'
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return checkerboardResult;
}

export async function importOtherSingle(user_nick) {
    const singleResult = await prisma.post.findMany({
        where : {
            post_users: {
                user_nick,
            },
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
            created_at: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return singleResult;
}

export async function importOtherFollower(id, user_nick) {
    const otherFollowerResult = await prisma.follow.findMany({
        where: {
            following: {
                user_nick,
            },
        },
        select: {
            follower_id: true,
            follower: {
                select: {
                    user_name: true,
                    user_nick: true,
                    profile_url: true,
                },
            },
        },
        orderBy: {
            created_at: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const myFollowerResult = await prisma.follow.findMany({
        where: {
            follower_id: id,
        },
        select: {
            following_id: true,
        },
    })

    return { otherFollowerResult, myFollowerResult };
}