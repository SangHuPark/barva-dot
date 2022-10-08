import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

import * as homeService from "../service/homeService.js";
import * as util from "../function/replyFunc.js";

var reply = {};
var dataReply = {};

// 사용자 프로필 불러오기
export async function myProfile(req, res) {
    const user_id = req.decoded.user_id;
    
    try {
        const userProfileInfo = await homeService.findUserProfile(user_id);
        
        return res.json(util.dataReply(dataReply, true, 200, '요청한 회원의 프로필 정보입니다.', { userProfileInfo }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 프로필 사진 설정
export async function setProfileImg(req, res) {
    const user_id = req.decoded.user_id;
    const profile_url = req.file.location;

    try {
        await homeService.insertProfileImg(user_id, profile_url);

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
        await homeService.insertProfileIntro(user_id, user_introduce);

        return res.json(util.makeReply(reply, true, 200, '프로필 소개가 저장되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function test(req, res) {
    // const image_url = req.file.location;
    return res.json(util.makeReply(reply, true, 200, "Image Upload Success"));
}

export async function send(req, res) {
    const testLocation = 'https://barva-dot.s3.ap-northeast-2.amazonaws.com/7721665045675137.png';
    return res.json(util.dataReply(dataReply, true, 200, "Image import test", { location: testLocation }));
}

export async function array(req, res) {
    const image = req.files;
    const location = image.map(img => img.location);
    
    if ( image === undefined )
        return res.json(util.makeReply(reply, false, 400, '이미지가 존재하지 않습니다.'));

    return res.json(util.dataReply(reply, true, 200, "Image Array Upload Success", location));
}