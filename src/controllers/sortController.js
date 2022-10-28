import * as sortModel from "../model/sortModel.js";
import * as util from "../function/replyFunc.js";

var reply = {};
var dataReply = {};

export async function newestCheckerboard(req, res) {
    try {
        const checkerboardResult = await sortModel.importNewestCheckerboard();

        const emptyArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
            emptyArr[i] = JSON.parse(checkerboardResult[i].post_url);
        
        const checkerboardArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
            checkerboardArr[i] = emptyArr[i][0];

        return res.json(util.dataReply(dataReply, true, 200, '바둑판 형식의 최신순 보기 피드입니다.', { checkerboardArr }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function newestSingle(req, res) {
    const id = req.decoded.id;
    
    try {
        const singleResult = await sortModel.importNewestSingle();
        
        for (let i = 0; i < singleResult.length; i++) {
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);

            if (singleResult[i].save_posts.length !== 0 && singleResult[i].save_posts[0].stored_user === id) {
                if (singleResult[i].post_id === singleResult[i].save_posts[0].stored_post)
                    singleResult[i].isSave = true;
            }
            else
                singleResult[i].isSave = false;

            delete singleResult[i].save_posts;
        }

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 최신순 보기 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 오늘의 색상 관련 API
export async function colorCheckerboard(req, res) {
    try {
        const todayColor = await sortModel.importTodayColor();

        const checkerboardResult = await sortModel.importColorCheckerboard(todayColor);

        const emptyArr = [];
        for (leti = 0; i < checkerboardResult.length; i++)
            emptyArr[i] = JSON.parse(checkerboardResult[i].post_url);
        
        const checkerboardArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
            checkerboardArr[i] = emptyArr[i][0];

        return res.json(util.dataReply(dataReply, true, 200, '바둑판 형식의 사용자 피드입니다.', { checkerboardArr }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function colorSingle(req, res) {
    try {
        const todayColor = await sortModel.importTodayColor();

        const singleResult = await sortModel.importNewestSingle(todayColor);
        
        for (let i = 0; i < singleResult.length; i++) {
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);
        
            if (singleResult[i].save_posts.length !== 0 && singleResult[i].save_posts[0].stored_user === id) {
                if (singleResult[i].post_id === singleResult[i].save_posts[0].stored_post)
                    singleResult[i].isSave = true;
            }
            else
                singleResult[i].isSave = false;

            delete singleResult[i].save_posts;
        }

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function genderCheckerboard(req, res) {
    const user_gender = req.body.user_gender;

    try {
        const checkerboardResult = await sortModel.importGenderCheckerboard(user_gender);

        const emptyArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
            emptyArr[i] = JSON.parse(checkerboardResult[i].post_url);
        
        const checkerboardArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
            checkerboardArr[i] = emptyArr[i][0];

        return res.json(util.dataReply(dataReply, true, 200, '바둑판 형식의 남/여 정렬 피드입니다.', { checkerboardArr }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function genderSingle(req, res) {
    const id = req.decoded.id;
    const user_gender = req.body.user_gender;

    try {
        const singleResult = await sortModel.importGenderSingle(user_gender);
        
        for (let i = 0; i < singleResult.length; i++) {
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);
            
            if (singleResult[i].save_posts.length !== 0 && singleResult[i].save_posts[0].stored_user === id) {
                if (singleResult[i].post_id === singleResult[i].save_posts[0].stored_post)
                    singleResult[i].isSave = true;
            }
            else
                singleResult[i].isSave = false;

            delete singleResult[i].save_posts;
        }

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 남/여 정렬 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function otherProfile(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        const otherProfileInfo = await sortModel.findOtherProfile(id, user_nick);

        if ( otherProfileInfo.isFollowing === null )
            otherProfileInfo.isFollowing = false;
        else
            otherProfileInfo.isFollowing = true;

        return res.json(util.dataReply(dataReply, true, 200, '요청한 회원의 프로필 정보입니다.', { otherProfileInfo }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function otherCheckerboard(req, res) {
    const user_nick = req.body.user_nick;

    try {
        const checkerboardResult = await sortModel.importOtherCheckerboard(user_nick);
        
        const emptyArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
            emptyArr[i] = JSON.parse(checkerboardResult[i].post_url);
        
        const checkerboardArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
            checkerboardArr[i] = emptyArr[i][0];

        return res.json(util.dataReply(dataReply, true, 200, '바둑판 형식의 다른 사용자 피드입니다.', { checkerboardArr }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function otherSingle(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        const singleResult = await sortModel.importOtherSingle(user_nick);
        
        for (let i = 0; i < singleResult.length; i++) {
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);
            
            if (singleResult[i].save_posts.length !== 0 && singleResult[i].save_posts[0].stored_user === id) {
                if (singleResult[i].post_id === singleResult[i].save_posts[0].stored_post)
                    singleResult[i].isSave = true;
            }
            else
                singleResult[i].isSave = false;

            delete singleResult[i].save_posts;
        }

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 다른 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function otherFollowerList(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        const { otherFollowerResult, myFollowerResult } = await sortModel.importOtherFollower(id, user_nick);

        const otherFollower = otherFollowerResult.map((list) => {
            if ( list.follower_id === id )
                list.isMe = true;
            else if ( myFollowerResult.includes(list.follower_id) )
                list.isFollowing = true;
            else
                list.isFollowing = false;

            return list;
        });

        return res.json(util.dataReply(dataReply, true, 200, '해당 사용자의 팔로워 목록입니다.', { otherFollower }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function otherFollowingList(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        const { otherFollowingResult, myFollowerResult } = await sortModel.importOtherFollowing(id, user_nick);
        
        const otherFollowing = otherFollowingResult.map((list) => {
            if ( list.following_id === id )
                list.isMe = true;
            else if ( myFollowerResult.includes(list.following_id) )
                list.isFollowing = true;
            else
                list.isFollowing = false;

            return list;
        });

        return res.json(util.dataReply(dataReply, true, 200, '해당 사용자의 팔로잉 목록입니다.', { otherFollowing }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}