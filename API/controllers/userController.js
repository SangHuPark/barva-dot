const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodeCache = require('node-cache');

dotenv.config();

const userService = require('../service/userService.js');
const cryptoFunc = require('../function/cryptoFunc.js');
const util = require('../function/replyFunc.js');
const mail = require('../validation/mailFunc.js');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authCache = new nodeCache( { stdTTL: 0, checkperiod: 600 } );

var reply = {};
var dataReply = {};

// 회원가입
exports.enroll = async (req, res) => {
    const { user_name, user_nick, user_id, user_pw, user_confirmPw, user_email } = req.body;

    try {
        const { hashed_pw, pw_salt } = await cryptoFunc.createHashedPassword(user_pw);
        const newUserInfo = { user_name, user_nick, user_id, hashed_pw, pw_salt, user_email };
        await userService.insertUser(newUserInfo);

        return res.json(util.makeReply(reply, true, 200, '회원가입을 성공하였습니다.'));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 아이디 중복 검사
exports.duplicatedIdCheck = async (req, res) => {
    const user_id = req.body.user_id;

    try {
        var enrollIdCheck = await userService.existIdCheck(user_id);
        
        if(enrollIdCheck) 
            return res.json(util.makeReply(reply, false, 301, '이미 사용 중인 아이디입니다.')); 
        else
            return res.json(util.makeReply(reply, true, 200, '사용 가능한 아이디입니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 닉네임 중복 검사
exports.duplicatedNickCheck = async (req, res) => {
    const user_nick = req.body.user_nick;

    try {
        var enrollNickCheck = await userService.existNickCheck(user_nick);
        
        if(enrollNickCheck)
            return res.json(util.makeReply(reply, false, 302, '이미 사용 중인 이름입니다.'));
        else
            return res.json(util.makeReply(reply, true, 200, '사용 가능한 이름입니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 인증 메일 전송
exports.sendMail = async (req, res) => {
    const user_email = req.body.user_email;

    authCache.del(user_email);

    try {
        var enrollMailCheck = await userService.existMailCheck(user_email);
            
        if(enrollMailCheck === true) 
            return res.json(util.makeReply(reply, false, 303, '이미 가입된 메일 정보입니다.'));
        
        const authNumber = await cryptoFunc.makeAuthNumber();
        await mail.makeMail(authNumber, user_email);
        authCache.set(user_email, authNumber);

        return res.json(util.dataReply(dataReply, true, 200, "인증번호가 전송되었습니다.", { authNumber }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 인증번호 확인
exports.authUser = async (req, res) => {
    const { user_email, confirmNumber } = req.body;

    try {
        const authNumber = authCache.get(user_email);
        if(confirmNumber === authNumber)
            res.json(util.makeReply(reply, true, 200, '인증이 완료되었습니다.'));
        else
            res.json(util.makeReply(reply, false, 304, '인증번호가 일치하지 않습니다.'));

    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 로그인
exports.login = async (req, res) => {
    const { user_id, user_pw } = req.body;
    const user_name = await userService.importUserName(user_id);

    if(!user_id)
        return res.json(util.makeReply(reply, false, 405, '아이디를 입력해주세요.'));
    if(!user_pw)
        return res.json(util.makeReply(reply, false, 406, '비밀번호를 입력해주세요.'));

    try {
        var loginCheck = await userService.existIdCheck(user_id);
        if(!loginCheck)
            return res.json(util.makeReply(reply, false, 305, '등록되지 않은 회원정보입니다.')); 

        var checkPw = await cryptoFunc.makePasswordHashed(user_id, user_pw);
        if(checkPw !== loginCheck.user_pw)
            return res.json(util.makeReply(reply, false, 306, '비밀번호를 확인하세요.'));

        token = jwt.sign({
            type: 'JWT',
            user_id: user_id,
            user_name : user_name
          }, JWT_SECRET_KEY, {
            expiresIn: '100y',
            issuer: user_name.toString(),
          });
        
        return res.json(util.dataReply(dataReply, true, 200, '로그인 성공, 토큰이 발급되었습니다.', { token }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 회원탈퇴
exports.resign = async (req, res) => {
    const user_pw = req.body.user_pw;
    const user_id = req.decoded.user_id;

    try {
        var resignCheck = await userService.existIdCheck(user_id);
        var checkPw = await cryptoFunc.makePasswordHashed(user_id, user_pw);
        if(checkPw !== resignCheck.user_pw)
            return res.json(util.makeReply(reply, false, 306, '비밀번호를 확인하세요.'));

        await userService.deleteUser(user_id);

        return res.json(util.makeReply(reply, true, 200, '회원탈퇴를 성공하였습니다.'));
    } catch (err) {
        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}