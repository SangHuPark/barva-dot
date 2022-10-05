import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

import * as homeService from "../service/homeService.js";
import * as util from "../function/replyFunc.js";

var reply = {};
var dataReply = {};

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

export async function test(req, res) {
    return res.json(util.makeReply(reply, true, 200, "Image Upload Success"));
}