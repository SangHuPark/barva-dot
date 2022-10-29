import * as sortModel from "../model/sortModel.js";
import * as util from "../function/replyFunc.js";
import * as carving from "../function/carving.js";

var reply = {};
var dataReply = {};

export async function newestCheckerboard(req, res) {
    try {
        const checkerboardResult = await sortModel.importNewestCheckerboard();
        const checkerboardArr = await carving.refineCheckerboard(checkerboardResult);

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
        const singleArr = await carving.refineSingle(singleResult, id);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 최신순 보기 피드입니다.', { singleResult: singleArr }));
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
        const checkerboardArr = await carving.refineCheckerboard(checkerboardResult);

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
        const singleArr = await carving.refineSingle(singleResult, id);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult: singleArr }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function genderCheckerboard(req, res) {
    const user_gender = req.body.user_gender;

    try {
        const checkerboardResult = await sortModel.importGenderCheckerboard(user_gender);
        const checkerboardArr = await carving.refineCheckerboard(checkerboardResult);

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
        const singleArr = await carving.refineSingle(singleResult, id);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 남/여 정렬 피드입니다.', { singleResult: singleArr }));
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
        const checkerboardArr = await carving.refineCheckerboard(checkerboardResult);

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
        const singleArr = await carving.refineSingle(singleResult, id);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 다른 사용자 피드입니다.', { singleResult: singleArr }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function otherFollowerList(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        const { otherFollowerResult, myFollowingResult } = await sortModel.importOtherFollower(id, user_nick);

        for ( let i = 0; i < otherFollowerResult.length; i++ ) {
            // 다른 사용자의 팔로워 중 본인인지 검사
            if ( otherFollowerResult[i].follower_id === id ) {
                otherFollowerResult[i].isMe = true;
                const item = otherFollowerResult.splice(i, 1);
                otherFollowerResult.splice(0, 0, item[0]);
                continue;
            }
            // 본인의 팔로잉이 0인지 검사
            if ( myFollowingResult.length === 0 )
                otherFollowerResult[i].isFollowing = false;
            // 아닐 시, 다른 사용자의 팔로워 중 내가 팔로잉 한 사람이 있는지 검사
            else {
                for ( let j = 0; j < myFollowingResult.length; j++ ) {
                    if ( myFollowingResult[j].following_id === otherFollowerResult[i].follower_id ) {
                        otherFollowerResult[i].isFollowing = true;
                        break;
                    } else
                        otherFollowerResult[i].isFollowing = false;
                }
            }
        }

        /*
        const otherFollower = otherFollowerResult.map((list) => {
            if ( list.follower_id === id )
                list.isMe = true;
            else if ( myFollowingResult.includes.call(list.follower_id) )
                list.isFollowing = true;
            else
                list.isFollowing = false;

            return list;
        }); */

        return res.json(util.dataReply(dataReply, true, 200, '해당 사용자의 팔로워 목록입니다.', { otherFollowerResult }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function otherFollowingList(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        const { otherFollowingResult, myFollowingResult } = await sortModel.importOtherFollowing(id, user_nick);
        
        for ( let i = 0; i < otherFollowingResult.length; i++ ) {
            if ( otherFollowingResult[i].following_id === id ) {
                otherFollowingResult[i].isMe = true;
                const item = otherFollowingResult.splice(i, 1);
                otherFollowingResult.splice(0, 0, item[0]);
                continue;
            }

            if ( myFollowingResult.length === 0 )
                otherFollowingResult[i].isFollowing = false;
            else {
                for ( let j = 0; j < myFollowingResult.length; j++ )
                    if ( myFollowingResult[j].following_id === otherFollowingResult[i].following_id ) {
                        otherFollowingResult[i].isFollowing = true;
                        break;
                    } else
                        otherFollowingResult[i].isFollowing = false;
            }
        }

        /*
        const otherFollowing = otherFollowingResult.map((list) => {
            if ( list.following_id === id )
                list.isMe = true;
            else if ( myFollowerResult.includes(list.following_id) )
                list.isFollowing = true;
            else
                list.isFollowing = false;

            return list;
        }); */

        return res.json(util.dataReply(dataReply, true, 200, '해당 사용자의 팔로잉 목록입니다.', { otherFollowingResult }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}