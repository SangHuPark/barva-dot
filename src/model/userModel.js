import { prisma } from "../function/prisma-client.js";

export async function findUserProfile(id) {
    const profileResult = await prisma.user.findUnique({
        where : {
            id,
        },
        select : {
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
            post_user: id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const countFollower = await prisma.follow.count({
        where: {
            following_id: id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const countFollowing = await prisma.follow.count({
        where: {
            follower_id: id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    profileResult.countPost = countPost;
    profileResult.countFollower = countFollower;
    profileResult.countFollowing = countFollowing;

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
            created_at: 'desc',
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
            post_id: true,
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

export async function deleteSavePost(id, post_id) {
    await prisma.save_post.delete({
        where: {
            stored_user_stored_post: {
                stored_user: id,
                stored_post: post_id,
            },
        },
        
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function importSavePostCheckerboard(id) {
    const loadingResult = await prisma.save_post.findMany({
        where: {
            stored_user: id,
        },
        select: {
            saved_posts: {
                select: {
                    post_url: true,
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

    return loadingResult;
}

export async function importSavePostSingle(id) {
    const singleResult = await prisma.save_post.findMany({
        where: {
            stored_user: id,
        },
        select: {
            saved_posts: {
                select: {
                    post_id: true,
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
            },
        },
        orderBy: {
            created_at: 'desc',
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    return singleResult;
}

export async function insertFollowing(id, user_nick) {
    const findFollowUser = await prisma.user.findUnique({
        where: {
            user_nick,
        },
        select: {
            id: true,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    await prisma.follow.create({
        data: {
            follower_id: id,
            following_id: findFollowUser.id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function deleteFollowing(id, user_nick) {
    const findFollowUser = await prisma.user.findUnique({
        where: {
            user_nick,
        },
        select: {
            id: true,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    await prisma.follow.delete({
        where: {
            follower_id_following_id: {
                follower_id: id,
                following_id: findFollowUser.id,
            },
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}