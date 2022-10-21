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
        const { findPostUser, singleResult } = await mainService.importUserSingle(user_id);
        
        for (let i = 0; i < singleResult.length; i++) {
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);
            singleResult[i].profile_url = findPostUser.profile_url;
            singleResult[i].user_nick = findPostUser.user_nick;
        }
        
        // singleResult.findPostId = singleResult.findPostId.user_nick;

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function newestCheckerboard(req, res) {
    try {
        const checkerboardResult = await mainService.importNewestCheckerboard();

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

export async function newestSingle(req, res) {
    try {
        const singleResult = await mainService.importNewestSingle();
        
        for (let i = 0; i < singleResult.length; i++)
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

/** 오늘의 색상 관련 API
export async function colorCheckerboard(req, res) {
    try {
        const checkerboardResult = await mainService.importColorCheckerboard();

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

export async function colorSingle(req, res) {
    try {
        const singleResult = await mainService.importNewestSingle();
        
        for (let i = 0; i < singleResult.length; i++)
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
} */

export async function genderCheckerboard(req, res) {
    const user_gender = req.body.user_gender;

    try {
        const checkerboardResult = await mainService.importGenderCheckerboard(user_gender);

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

export async function genderSingle(req, res) {
    const user_gender = req.body.user_gender;

    try {
        const singleResult = await mainService.importGenderSingle(user_gender);
        
        for (let i = 0; i < singleResult.length; i++)
            singleResult[i].post_url = JSON.parse(singleResult[i].post_url);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}