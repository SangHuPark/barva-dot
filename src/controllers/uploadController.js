import * as uploadModel from "../model/uploadModel.js";
import * as util from "../function/replyFunc.js";
import { awsUpload } from "../function/s3-multer.js";

var reply = {};
var dataReply = {};

// 프로필 사진 설정
export async function setProfileImg(req, res, next) {
    const user_id = req.decoded.user_id;
    const profile_url = req.file.location;

    try {
        await uploadModel.insertProfileImg(user_id, profile_url);

        return res.json(util.makeReply(reply, true, 200, '프로필 사진 설정이 완료되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response'), { err: err.message });
    }
}

// 게시물 업로드
export async function uploadPost(req, res) {
    const id = req.decoded.id;
    const contents = req.body;
    
    const image = req.files;
    const path = [];
    for (let i = 0; i < image.length; i++) {
        path[i] = image[i].location;
    }   
    const post_url = JSON.stringify(path);
    
    try {
        await uploadModel.insertPost(id, post_url, contents);

        return res.json(util.makeReply(reply, true, 200, '게시글 업로드가 완료되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function commentPost(req, res) {
    const id = req.decoded.id;
    const { comment, post_id } = req.body;

    try {
        await uploadModel.insertComment(id, comment, parseInt(post_id));

        return res.json(util.makeReply(reply, true, 200, '댓글이 저장되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function commentList(req, res) {
    const id = req.decoded.id;
    const post_id = req.body.post_id;

    try {
        const { profileImg, commentResult } = await uploadModel.importCommentList(id, post_id);
        
        const profile_url = profileImg.profile_url;

        return res.json(util.dataReply(dataReply, true, 200, '해당 게시글의 댓글 목록입니다.', { profile_url, commentResult }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function likePost(req, res) {
    const id = req.decoded.id;
    const post_id = req.body.post_id;

    try {
        const likeCount = await uploadModel.insertLikePost(id, post_id);

        return res.json(util.dataReply(dataReply, true, 200, '해당 게시글에 좋아요를 추가 하였습니다.', { likeCount }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function cancelLikePost(req, res) {
    const id = req.decoded.id;
    const post_id = req.body.post_id;

    try {
        const likeCount = await uploadModel.cancelLike(id, post_id);

        return res.json(util.dataReply(dataReply, true, 200, '해당 게시글에 좋아요를 취소 하였습니다.', { likeCount }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}