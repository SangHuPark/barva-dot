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

export async function uploadPost(req, res) {
    const user_id = req.decoded.user_id;
    const post_url = req.files.location;
    const contents = req.body;

    try {
        await mainService.upload(user_id, post_url, contents);

        return res.json(util.makeReply(reply, true, 200, '게시글 업로드가 완료되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}