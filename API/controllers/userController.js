const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodeCache = require('node-cache');

dotenv.config();

const userService = require('../service/userService.js');
const cryptoFunc = require('../function/cryptoFunc.js');
const util = require('../function/replyFunc.js');
const mail = require('../function/mailFunc.js');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authCache = new nodeCache( { stdTTL: 0, checkperiod: 600 } );

// 회원가입
exports.enroll = async (req, res) => {
    const { user_name, user_nick, user_id, user_pw, user_confirmPw, user_email } = req.body;

    var reply = {};
    var dataReply = {};

    if(!user_name || !user_nick || !user_id || !user_pw || !user_confirmPw || !user_email)
        return res.json(util.makeReply(reply, false, 400, '입력하지 않은 항목이 존재합니다.'));
    if(user_name.length > 10)
        return res.json(util.makeReply(reply, false, 301, '정확한 성명을 입력해주시기 바랍니다.'));
    if(user_nick.length > 15)
        return res.json(util.makeReply(reply, false, 302, '닉네임은 15자를 초과할 수 없습니다.'));
    if(user_id.length > 15)
    //     return res.json(util.makeReply(reply, false, 303, '아이디는 15자를 초과할 수 없습니다.'));
    // if(user_pw.length < 6 || user_pw.length > 15)
    //     return res.json(util.makeReply(reply, false, 304, '비밀번호는 6~15자로 입력해야 합니다.'));
    // if(user_pw !== user_confirmPw)
    //     return res.json(util.makeReply(reply, false, 305, '비밀번호가 일치하지 않습니다.'));

    try {
        var enrollIdCheck = await userService.existIdCheck(user_id);
            if(enrollIdCheck) 
                return res.json(util.makeReply(reply, false, 306, '이미 사용 중인 아이디입니다.'));

        var enrollNickCheck = await userService.existNickCheck(user_name);
            if(enrollNickCheck)
                return res.json(util.makeReply(reply, false, 307, '이미 사용 중인 이름입니다.'));
            
        const { hashed_pw, pw_salt } = await cryptoFunc.createHashedPassword(user_pw);
        const newUserInfo = { user_name, user_nick, user_id, hashed_pw, pw_salt, user_email };
        await userService.insertUser(newUserInfo);

        return res.json(util.makeReply(reply, true, 200, '회원가입을 성공하였습니다.'));
    } catch (err) {
        console.log(err.message);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 중복 검사
exports.duplicateCheck = async (req, res) => {
    var reply = {};
    var dataReply = {};

    if(req.body.user_id) {
        const user_id = req.body.user_id;

        try {
            var enrollIdCheck = await userService.existIdCheck(user_id);
            
            if(enrollIdCheck) 
                return res.json(util.makeReply(reply, false, 306, '이미 사용 중인 아이디입니다.')); 
            else
                return res.json(util.makeReply(reply, true, 200, '사용 가능한 아이디입니다.'));
        } catch (err) {
            console.log(err.message);

            return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
        }
    } else if(req.body.user_nick) {
        const user_nick = req.body.user_nick;

        try {
            var enrollNickCheck = await userService.existNickCheck(user_nick);
            
            if(enrollNickCheck)
                return res.json(util.makeReply(reply, false, 307, '이미 사용 중인 이름입니다.'));
            else
                return res.json(util.makeReply(reply, true, 200, '사용 가능한 이름입니다.'));
        } catch (err) {
            console.log(err.message);

            return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
        }
    } else
        return res.json(util.makeReply(reply, false, 400, '입력하지 않은 항목이 존재합니다.'));
}

// 인증 메일 전송
exports.sendMail = async (req, res) => {
    const user_email = req.body.user_email;

    authCache.del(user_email);

    var reply = {};
    var dataReply = {};

    try {
        var enrollMailCheck = await userService.existMailCheck(user_email);
            
        if(enrollMailCheck === true) 
            return res.json(util.makeReply(reply, false, 308, '이미 가입된 메일 정보입니다.'));
        
        const authNumber = await cryptoFunc.makeAuthNumber();
        await mail.makeMail(authNumber, user_email);
        authCache.set(user_email, authNumber);

        return res.json(util.dataReply(dataReply, true, 200, "인증번호가 전송되었습니다.", { authNumber }));
    } catch (err) {
        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 인증번호 확인
exports.authUser = async (req, res) => {
    const { user_email, confirmNumber } = req.body;

    var reply = {};
    var dataReply = {};

    try {
        const authNumber = authCache.get(user_email);
        if(confirmNumber === authNumber)
            res.json(util.makeReply(reply, true, 200, '인증이 완료되었습니다.'));
        else
            res.json(util.makeReply(reply, false, 309, '인증번호가 일치하지 않습니다.'));

    } catch (err) {
        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 로그인
exports.login = async (req, res) => {
    const { user_id, user_pw } = req.body;
    const user_name = await userService.importUserName(user_id);

    var reply = {};
    var dataReply = {};

    if(!user_id || !user_pw)
        return res.json(util.makeReply(reply, false, 400, '입력하지 않은 항목이 존재합니다.'));

    try {
        var loginCheck = await userService.existIdCheck(user_id);
        if(!loginCheck)
            return res.json(util.makeReply(reply, false, 311, '등록되지 않은 회원정보입니다.')); 

        var checkPw = await cryptoFunc.makePasswordHashed(user_id, user_pw);
        if(checkPw !== loginCheck.user_pw)
            return res.json(util.makeReply(reply, false, 312, '비밀번호를 확인하세요.'));

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
        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 회원탈퇴
exports.resign = async (req, res) => {
    const user_pw = req.body.user_pw;
    const user_id = req.decoded.user_id;
    
    var reply = {};

    try {
        var resignCheck = await userService.existIdCheck(user_id);
        var checkPw = await cryptoFunc.makePasswordHashed(user_id, user_pw);
        if(checkPw !== resignCheck.user_pw)
            return res.json(util.makeReply(reply, false, 312, '비밀번호를 확인하세요.'));

        await userService.deleteUser(user_id);

        return res.json(util.makeReply(reply, true, 200, '회원탈퇴를 성공하였습니다.'));
    } catch (err) {
        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}