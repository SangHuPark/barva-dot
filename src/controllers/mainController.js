import * as mainService from "../service/mainService.js";
import * as util from "../function/replyFunc.js";
import { awsUpload } from "../function/multer.js";

var reply = {};
var dataReply = {};

// 마이프로필 불러오기
export async function myProfile(req, res) {
    const user_id = req.decoded.user_id;
    
    try {
        const myProfileInfo = await mainService.findUserProfile(user_id);
        
        return res.json(util.dataReply(dataReply, true, 200, '요청한 회원의 프로필 정보입니다.', { myProfileInfo }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 내 프로필 피드 불러오기
export async function myFeed(req, res) {
    const user_id = req.decoded.user_id;

    try {
        const myFeedInfo = await mainService.findUserFeed(user_id);

        return res.json(util.dataReply(dataReply, true, 200, '요청한 회원의 피드 정보입니다.', { myFeedInfo }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 프로필 사진 설정
export async function setProfileImg(req, res, next) {
    const user_id = req.decoded.user_id;
    const profile_url = req.file.location;

    try {
        await mainService.insertProfileImg(user_id, profile_url);

        return res.json(util.makeReply(reply, true, 200, '프로필 사진 설정이 완료되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response'), { err: err.message });
    }
}

// 소개글 설정
export async function setProfileIntro(req, res) {
    const user_id = req.decoded.user_id;
    const user_introduce = req.body.user_introduce;

    try {
        await mainService.insertProfileIntro(user_id, user_introduce);

        return res.json(util.makeReply(reply, true, 200, '프로필 소개가 저장되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 게시물 업로드
export async function uploadPost(req, res) {
    const user_id = req.decoded.user_id;
    const contents = req.body;
    
    const image = req.files;
    const path = [];
    for (let i = 0; i < image.length; i++) {
        path[i] = image[i].location;
    }   
    const post_url = JSON.stringify(path);
    
    try {
        await mainService.insertPost(user_id, post_url, contents);

        return res.json(util.makeReply(reply, true, 200, '게시글 업로드가 완료되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 바둑판 형식으로 사용자 게시물 불러오기
export async function userCheckerboard(req, res) {
    const user_id = req.decoded.user_id;

    try {
        const checkerboardResult = await mainService.importUserCheckerboard(user_id);
        
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
    const user_id = req.decoded.user_id;

    try {
        const singleResult = await mainService.importSingle(user_id);
        
        for (let i = 0; i < singleResult.length; i++)
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);

        console.log(singleResult);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}