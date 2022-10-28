import { prisma } from "../function/prisma-client.js";

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

export async function insertPost(id, post_url, contents) {
    const { post_content, user_gender, user_tall, user_weight } = contents;

    await prisma.post.create({
        data: {
            post_content,
            post_url,
            user_gender,
            user_tall,
            user_weight,
            post_users: { 
                connect: {
                    id,
                }
            },
        }
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function insertComment(id, comment, post_id) {
    await prisma.comment.create({
        data: {
            comment,
            commenter: id,
            target_post: post_id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function importCommentList(id, post_id) {
    const profileImg = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            profile_url: true,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const commentResult = await prisma.comment.findMany({
        where: {
            target_post: post_id,
        },
        select: {
            comment: true,
            comment_users: {
                select: {
                    user_nick: true,
                    profile_url: true,
                },
            }
        }
    })
    .catch((err) => {
        throw new Error(err);
    });

    return { profileImg, commentResult };
}

export async function insertLikePost(id, post_id) {
    await prisma.like.create({
        data: {
            like_user: id,
            like_post: post_id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const likeCount = await prisma.like.count({
        where: {
            like_post: post_id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    await prisma.post.update({
        where: {
            post_id,
        },
        data: {
            likeCount,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}

export async function cancelLike(id, post_id) {
    await prisma.like.delete({
        where: {
            like_user_like_post: {
                like_user: id,
                like_post: post_id,
            },
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    const likeCount = await prisma.like.count({
        where: {
            like_post: post_id,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });

    await prisma.post.update({
        where: {
            post_id,
        },
        data: {
            likeCount,
        },
    })
    .catch((err) => {
        throw new Error(err);
    });
}