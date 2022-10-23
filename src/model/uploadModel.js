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
    })
}

/*
export async function likePost() */