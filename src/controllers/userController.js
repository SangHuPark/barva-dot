import * as userModel from "../model/userModel.js";
import * as util from "../function/replyFunc.js";
import { awsUpload } from "../function/multer.js";

var reply = {};
var dataReply = {};

// 마이프로필 불러오기
export async function myProfile(req, res) {
    const user_id = req.decoded.user_id;
    
    try {
        const myProfileInfo = await userModel.findUserProfile(user_id);
        
        return res.json(util.dataReply(dataReply, true, 200, '요청한 회원의 프로필 정보입니다.', { myProfileInfo }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 소개글 설정
export async function setProfileIntro(req, res) {
    const user_id = req.decoded.user_id;
    const user_introduce = req.body.user_introduce;

    try {
        await userModel.insertProfileIntro(user_id, user_introduce);

        return res.json(util.makeReply(reply, true, 200, '프로필 소개가 저장되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 바둑판 형식으로 사용자 게시물 불러오기
export async function userCheckerboard(req, res) {
    const id = req.decoded.id;

    try {
        const checkerboardResult = await userModel.importUserCheckerboard(id);
        
        const emptyArr = [];
        for (let i = 0; i < checkerboardResult.length; i++)
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

// 단일 형식으로 사용자 게시물 불러오기
export async function userSingle(req, res) {
    const id = req.decoded.id;

    try {
        const singleResult = await userModel.importUserSingle(id);
        
        for (let i = 0; i < singleResult.length; i++)
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);
        
        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function savePost(req, res) {
    const id = req.decoded.id;
    const post_id = req.body.post_id;

    try {
        await userModel.insertSavePost(id, parseInt(post_id));

        return res.json(util.makeReply(reply, true, 200, '게시글이 저장되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function cancelSavePost(req, res) {
    const id = req.decoded.id;
    const post_id = req.body.post_id;

    try {
        await userModel.deleteSavePost(id, parseInt(post_id));

        return res.json(util.makeReply(reply, true, 200, '게시글 저장을 취소하였습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function addFollowing(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        await userModel.insertFollowing(id, user_nick);

        return res.json(util.makeReply(reply, true, 200, '해당 사용자를 팔로우하였습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function cancelFollowing(req, res) {
    const id = req.decoded.id;
    const user_nick = req.body.user_nick;

    try {
        await userModel.deleteFollowing(id, user_nick);

        return res.json(util.makeReply(reply, true, 200, '해당 사용자를 팔로우 취소하였습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}