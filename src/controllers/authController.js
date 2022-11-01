import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodeCache from "node-cache";

dotenv.config();

import * as authModel from "../model/authModel.js";
import * as cryptoFunc from "../function/cryptoFunc.js";
import * as util from "../function/replyFunc.js";
import * as mail from "../function/node-mailer.js";
import * as form from "../middlewares/form.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authCache = new nodeCache( { stdTTL: 0, checkperiod: 600 } );

var reply = {};
var dataReply = {};

// 회원가입
export async function signUp(req, res) {
    const newUserInfo = req.body;
    const { user_name, user_nick, user_id, user_pw, user_email, marketing } = newUserInfo;
    
    try {
        var formResult = await form.signUpForm(newUserInfo);
        if(formResult !== true)
            return res.json(util.dataReply(dataReply, false, 300, "요청한 데이터 형식이 올바르지 않습니다.", { err: formResult }));

        const { hashed_pw, pw_salt } = await cryptoFunc.createHashedPassword(user_pw);
        const insertUserInfo = { user_name, user_nick, user_id, hashed_pw, pw_salt, user_email, marketing };
        await authModel.insertUser(insertUserInfo);

        return res.json(util.makeReply(reply, true, 200, '회원가입을 성공하였습니다.'));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 아이디 중복 검사
export async function isExistId(req, res) {
    const user_id = req.body.user_id;

    try {
        var formResult = await form.idForm( { user_id } );
        if(formResult !== true)
            return res.json(util.dataReply(dataReply, false, 301, '아이디 형식이 올바르지 않습니다.', { err: formResult }));

        var signUpIdCheck = await authModel.existIdCheck(user_id);
        if(signUpIdCheck) 
            return res.json(util.makeReply(reply, false, 302, '이미 사용 중인 아이디입니다.')); 
        else
            return res.json(util.makeReply(reply, true, 200, '사용 가능한 아이디입니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 닉네임 중복 검사
export async function isExistNick(req, res) {
    const user_nick = req.body.user_nick;

    try {
        var formResult = await form.nickForm( { user_nick } );
        if(formResult !== true)
            return res.json(util.dataReply(dataReply, false, 303, "닉네임 형식이 올바르지 않습니다.", { err: formResult }));

        var signUpNickCheck = await authModel.existNickCheck(user_nick);
        if(signUpNickCheck)
            return res.json(util.makeReply(reply, false, 304, '이미 사용 중인 닉네임입니다.'));
        else
            return res.json(util.makeReply(reply, true, 200, '사용 가능한 닉네임입니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 인증 메일 전송
export async function sendMail(req, res) {
    const user_email = req.body.user_email;

    authCache.del(user_email);

    try {
        var formResult = await form.emailForm( { user_email } );
        if(formResult !== true)
            return res.json(util.dataReply(dataReply, false, 305, "이메일 형식이 올바르지 않습니다.", { err: formResult }));

        var signUpMailCheck = await authModel.existMailCheck(user_email);
        if(signUpMailCheck === true) 
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
export async function authMail(req, res) {
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
export async function login(req, res) {
    const loginData = req.body;

    if(!loginData.user_id)
        return res.json(util.makeReply(reply, false, 308, '아이디를 입력해주세요.'));
    if(!loginData.user_pw)
        return res.json(util.makeReply(reply, false, 309, '비밀번호를 입력해주세요.'));

    try {
        var formResult = await form.loginForm(loginData);
        if(formResult !== true)
            return res.json(util.dataReply(dataReply, false, 300, "요청한 데이터 형식이 올바르지 않습니다.", { err: formResult }));

        const userInfo = await authModel.importUserName(loginData.user_id);
        var loginCheck = await authModel.existIdCheck(loginData.user_id);
        if(!loginCheck || userInfo.length === 0)
            return res.json(util.makeReply(reply, false, 310, '등록되지 않은 회원정보입니다.')); 

        var checkPw = await cryptoFunc.makePasswordHashed(loginData.user_id, loginData.user_pw);
        if(checkPw !== loginCheck.user_pw)
            return res.json(util.makeReply(reply, false, 311, '아이디 또는 비밀번호를 확인하세요.'));

        const token = jwt.sign({
            type: 'JWT',
            user_id: loginData.user_id,
            user_name: userInfo.user_name,
            id: userInfo.id,
          }, JWT_SECRET_KEY, {
            expiresIn: '100y',
            issuer: userInfo.user_name,
          });

        return res.json(util.dataReply(dataReply, true, 200, '로그인 성공, 토큰이 발급되었습니다.', { token }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 회원탈퇴
export async function resign(req, res) {
    const user_pw = req.body.user_pw;
    const user_id = req.decoded.user_id;

    try {
        var resignCheck = await authModel.existIdCheck(user_id);
        if(!resignCheck)
            return res.json(util.makeReply(reply, false, 312, '이미 탈퇴한 회원 정보입니다.'));

        var checkPw = await cryptoFunc.makePasswordHashed(user_id, user_pw);
        if(checkPw !== resignCheck.user_pw)
            return res.json(util.makeReply(reply, false, 311, '아이디 또는 비밀번호를 확인하세요.'));

        await authModel.deleteUser(user_id);

        return res.json(util.makeReply(reply, true, 200, '탈퇴되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 아이디 찾기
export async function findId(req, res) {
    const findIdData = req.body;

    try {
        var formResult = await form.findIdForm(findIdData);
        if(formResult !== true)
            return res.json(util.dataReply(dataReply, false, 305, "이름 혹은 이메일 형식이 올바르지 않습니다.", { err: formResult }));

        var findIdInfo = await authModel.findUserId(findIdData);
        
        if(findIdInfo.length === 0)
            return res.json(util.makeReply(reply, false, 314, '해당 이름 혹은 이메일로 가입된 회원정보가 없습니다.'));

        return res.json(util.makeReply(reply, true, 200, `회원님의 아이디는 < ${findIdInfo.user_id} > 입니다.`));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 비밀번호 찾기
export async function findPw(req, res) {
    const user_id = req.body.user_id;

    if(!user_id)
        return res.json(util.makeReply(reply, false, 308, '아이디를 입력해주세요.'));

    try {
        var loginCheck = await authModel.existIdCheck(user_id);
        if(!loginCheck)
            return res.json(util.makeReply(reply, false, 310, '등록되지 않은 회원정보입니다.')); 

        return res.json(util.makeReply(reply, true, 200, '비밀번호 재설정 화면으로 이동합니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 비밀번호 찾기에서 이메일 인증
export async function findPwMail(req, res) {
    const user_email = req.body.user_email;

    authCache.del(user_email);

    try {
        const authNumber = await cryptoFunc.makeAuthNumber();
        const formResult = await form.emailForm( { user_email } );
        if(formResult !== true)
            return res.json(util.dataReply(dataReply, false, 305, "이메일 형식이 올바르지 않습니다.", { err: formResult }));

        var enrollMailCheck = await authModel.existMailCheck(user_email);
        if(enrollMailCheck === true) {
            await mail.makeMail(authNumber, user_email);
            authCache.set(user_email, authNumber);
        } else
            return res.json(util.makeReply(reply, false, 313, '해당 이메일로 가입된 회원정보가 없습니다.'));

        return res.json(util.dataReply(dataReply, true, 200, '인증번호가 전송되었습니다.', { authNumber }));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}

// 비밀번호 재설정
export async function updatePw(req, res) {
    const { user_id, user_updatePw } = req.body;

    try {
        var { hashed_pw, pw_salt } = await cryptoFunc.createHashedPassword(user_updatePw);
        var updateUserInfo = { user_id, hashed_pw, pw_salt };
        await authModel.updateUserPw(updateUserInfo);

        return res.json(util.makeReply(reply, true, 200, '비밀번호가 재설정 되었습니다.'));
    } catch (err) {
        console.log(err);

        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}