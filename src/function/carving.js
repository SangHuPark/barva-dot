export async function refineUserSingle(singleResult, id) {
    for (let i = 0; i < singleResult.length; i++) {
        singleResult[i].post_url = JSON.parse(singleResult[i].post_url);
    
        if (singleResult[i].likes_post.length !== 0 && singleResult[i].likes_post[0].like_user === id) {
            if ( singleResult[i].post_id === singleResult[i].likes_post[0].like_post)
                singleResult[i].isLike = true;
        } else
            singleResult[i].isLike = false;

        delete singleResult[i].likes_post;
    }

    return singleResult;
}

export async function refineSavePostCheckerboard(checkerboardResult) {
    const emptyArr = [];
    
    for (let i = 0; i < checkerboardResult.length; i++)
        emptyArr[i] = JSON.parse(checkerboardResult[i].saved_posts.post_url);
        
    const checkerboardArr = [];
    for (let i = 0; i < checkerboardResult.length; i++)
        checkerboardArr[i] = emptyArr[i][0];

    return checkerboardArr;
}

export async function refineSavePostSingle(singleResult, id) {
    for (let i = 0; i < singleResult.length; i++) {
        singleResult[i].saved_posts.post_url = JSON.parse(singleResult[i].saved_posts.post_url);
        singleResult[i].isSave = true;
        
        if (singleResult[i].saved_posts.likes_post.length !== 0 && singleResult[i].saved_posts.likes_post[0].like_user === id ) {
            if ( singleResult[i].saved_posts.post_id === singleResult[i].saved_posts.likes_post[0].like_post)
                singleResult[i].isLike = true;
        } else
            singleResult[i].isLike = false;

        delete singleResult[i].likes_post;
    }

    return singleResult;
}

export async function refineCheckerboard(checkerboardResult) {
    const emptyArr = [];
    console.log(checkerboardResult);
    for (let i = 0; i < checkerboardResult.length; i++)
        emptyArr[i] = JSON.parse(checkerboardResult[i].post_url);
        
    const checkerboardArr = [];
    for (let i = 0; i < checkerboardResult.length; i++)
        checkerboardArr[i] = emptyArr[i][0];

    return checkerboardArr;
}

export async function refineSingle(singleResult, id) {
    for (let i = 0; i < singleResult.length; i++) {
        singleResult[i].post_url = JSON.parse(singleResult[i].post_url);

        if (singleResult[i].save_posts.length !== 0 && singleResult[i].save_posts[0].stored_user === id) {
            if (singleResult[i].post_id === singleResult[i].save_posts[0].stored_post)
                singleResult[i].isSave = true;
        } else
            singleResult[i].isSave = false;

        if (singleResult[i].likes_post.length !== 0 && singleResult[i].likes_post[0].like_user === id) {
            if ( singleResult[i].post_id === singleResult[i].likes_post[0].like_post)
                singleResult[i].isLike = true;
        } else
            singleResult[i].isLike = false;

        delete singleResult[i].save_posts;
        delete singleResult[i].likes_post;
    }

    return singleResult;
}