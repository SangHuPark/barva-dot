const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodeCache = require('node-cache');

dotenv.config();

const userService = require('../service/userService.js');
const cryptoFunc = require('../function/cryptoFunc.js');
const util = require('../function/replyFunc.js');
const mail = require('../middlewares/mailFunc.js');
const form = require('../middlewares/form.js');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authCache = new nodeCache( { stdTTL: 0, checkperiod: 600 } );

var reply = {};
var dataReply = {};

// 회원가입
exports.signUp = async (req, res) => {
    const newUserInfo = req.body;
    const { user_name, user_nick, user_id, user_pw, user_email, marketing } = newUserInfo;
    
    try {
        await form.signUpForm(newUserInfo);

        const { hashed_pw, pw_salt } = await cryptoFunc.createHashedPassword(user_pw);
        const insertUserInfo = { user_name, user_nick, user_id, hashed_pw, pw_salt, user_email, marketing };
        await userService.insertUser(insertUserInfo);

        return res.json(util.makeReply(reply, true, 200, '회원가입을 성공하였습니다.'));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 아이디 중복 검사
exports.isExistId = async (req, res) => {
    const user_id = req.body.user_id;

    try {
        await form.idCheck(user_id);

        var enrollIdCheck = await userService.existIdCheck(user_id);
        
        if(enrollIdCheck) 
            return res.json(util.makeReply(reply, false, 302, '이미 사용 중인 아이디입니다.')); 
        else
            return res.json(util.makeReply(reply, true, 200, '사용 가능한 아이디입니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 닉네임 중복 검사
exports.isExistNick = async (req, res) => {
    const user_nick = req.body.user_nick;

    try {
        await form.nickCheck(user_nick);

        var enrollNickCheck = await userService.existNickCheck(user_nick);
        
        if(enrollNickCheck)
            return res.json(util.makeReply(reply, false, 304, '이미 사용 중인 닉네임입니다.'));
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
        await form.emailForm(user_email);

        var enrollMailCheck = await userService.existMailCheck(user_email);
            
        if(enrollMailCheck === true) 
            return res.json(util.makeReply(reply, false, 306, '이미 가입된 메일 정보입니다.'));
        
        const authNumber = await cryptoFunc.makeAuthNumber();
        await mail.makeMail(authNumber, user_email);
        authCache.set(user_email, authNumber);

        return res.json(util.dataReply(dataReply, true, 200, '인증번호가 전송되었습니다.', { authNumber }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 인증번호 확인
exports.authMail = async (req, res) => {
    const { user_email, confirmNumber } = req.body;

    try {
        const authNumber = authCache.get(user_email);
        if(confirmNumber === authNumber)
            res.json(util.makeReply(reply, true, 200, '인증이 완료되었습니다.'));
        else
            res.json(util.makeReply(reply, false, 307, '인증번호가 일치하지 않습니다.'));

    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 로그인
exports.login = async (req, res) => {
    const loginData = req.body;
    const user_name = await userService.importUserName(user_id);

    if(!user_id)
        return res.json(util.makeReply(reply, false, 308, '아이디를 입력해주세요.'));
    if(!user_pw)
        return res.json(util.makeReply(reply, false, 309, '비밀번호를 입력해주세요.'));

    try {
        await form.loginForm(loginData);

        var loginCheck = await userService.existIdCheck(loginData.user_id);
        if(!loginCheck)
            return res.json(util.makeReply(reply, false, 310, '등록되지 않은 회원정보입니다.')); 

        var checkPw = await cryptoFunc.makePasswordHashed(loginData.user_id, loginData.user_pw);
        if(checkPw !== loginCheck.user_pw)
            return res.json(util.makeReply(reply, false, 311, '아이디 또는 비밀번호를 확인하세요.'));

        token = jwt.sign({
            type: 'JWT',
            user_id: user_id,
            user_name: user_name
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
        if(!resignCheck)
            return res.json(util.makeReply(reply, false, 312, '이미 탈퇴한 회원 정보입니다.'));

        var checkPw = await cryptoFunc.makePasswordHashed(user_id, user_pw);
        if(checkPw !== resignCheck.user_pw)
            return res.json(util.makeReply(reply, false, 311, '아이디 또는 비밀번호를 확인하세요.'));

        await userService.deleteUser(user_id);

        return res.json(util.makeReply(reply, true, 200, '탈퇴되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 아이디 찾기
exports.findId = async (req, res) => {
    const { user_name, user_email } = req.body;

    try {
        var findIdInfo = await userService.findUserId(user_name, user_email);
        if(findIdInfo.length === 0)
            return res.json(util.makeReply(reply, false, 313, '해당 이메일로 가입된 회원정보가 없습니다.'));

        console.log(findIdInfo);

        return res.json(util.makeReply(reply, true, 200, `회원님의 아이디는 < ${findIdInfo[0].user_id} > 입니다.`));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 비밀번호 찾기
exports.findPw = async (req, res) => {
    const { user_id } = req.body;

    if(!user_id)
        return res.json(util.makeReply(reply, false, 308, '아이디를 입력해주세요.'));

    try {
        var loginCheck = await userService.existIdCheck(user_id);
        if(!loginCheck)
            return res.json(util.makeReply(reply, false, 310, '등록되지 않은 회원정보입니다.')); 

        return res.json(util.makeReply(reply, true, 200, '비밀번호 재설정 화면으로 이동합니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 비밀번호 찾기에서 이메일 인증
exports.findPwMail = async (req, res) => {
    const user_email = req.body.user_email;

    authCache.del(user_email);

    try {
        var enrollMailCheck = await userService.existMailCheck(user_email);
            
        if(enrollMailCheck === true) {
            const authNumber = await cryptoFunc.makeAuthNumber();
            await mail.makeMail(authNumber, user_email);
            authCache.set(user_email, authNumber);
        } else
            return res.json(util.makeReply(reply, false, 313, '해당 이메일로 가입된 회원정보가 없습니다.'));
        
        const authNumber = await cryptoFunc.makeAuthNumber();
        await mail.makeMail(authNumber, user_email);
        authCache.set(user_email, authNumber);

        return res.json(util.dataReply(dataReply, true, 200, '인증번호가 전송되었습니다.', { authNumber }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 비밀번호 재설정
exports.updatePw = async (req, res) => {
    const { user_id, user_pw } = req.body;

    try {
        var { hashed_pw, pw_salt } = await cryptoFunc.createHashedPassword(user_pw);
        var updateUserInfo = { user_id, hashed_pw, pw_salt };
        await userService.updateUserPw(updateUserInfo);

        return res.json(util.makeReply(reply, true, 200, '비밀번호가 재설정 되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}