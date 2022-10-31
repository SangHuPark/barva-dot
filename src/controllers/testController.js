import * as testModel from "../model/testModel.js";
import * as util from "../function/replyFunc.js";
import * as carving from "../function/carving.js";

var reply = {};
var dataReply = {};

export async function insertColor(req, res) {
    const body = req.body;
    const id = req.decoded.id;

    const image = req.files;
    const path = [];
    for (let i = 0; i < image.length; i++) {
        path[i] = image[i].location;
    }   
    const post_url = JSON.stringify(path);

    try {
        await testModel.insertColor(body, post_url, id);

        return res.json(util.makeReply(reply, true, 200, '잘하고 있어 상후야'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 오늘의 색상 관련 API
export async function colorCheckerboard(req, res) {
    const color_extract = req.body.color_extract;

    try {
        const checkerboardResult = await testModel.importColorCheckerboard(color_extract);
        const checkerboardArr = await carving.refineCheckerboard(checkerboardResult);

        return res.json(util.dataReply(dataReply, true, 200, '바둑판 형식의 사용자 피드입니다.', { checkerboardArr }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

export async function colorSingle(req, res) {
    const id = req.decoded.id;
    const color_extract = req.body.color_extract;
    
    try {
        const singleResult = await testModel.importColorSingle(color_extract);
        const singleArr = await carving.refineSingle(singleResult, id);

        return res.json(util.dataReply(dataReply, true, 200, '단일 게시물 형식의 사용자 피드입니다.', { singleResult: singleArr }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}