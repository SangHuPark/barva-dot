const Joi = require('joi');
const util = require('../function/replyFunc.js');

exports.enrollCheck = async (req, res, next) => {  
    var { user_name, user_nick, user_id, user_pw, user_confirmPw, user_email, marketing } = req.body;
    var body =  { user_name, user_nick, user_id, user_pw, user_confirmPw, user_email, marketing }

    var user_name_pattern = /^[가-힣|a-z|A-Z]+$/;
    var user_nick_pattern = /^[가-힣|a-z|A-Z|0-9]+$/;
    var user_id_pattern = /^[a-z|A-Z|0-9]+$/;
    var user_pw_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;
    
    var enrollSchema = Joi.object().keys({ 
        user_name: Joi.string()
            .min(2)
            .max(10)
            .pattern(new RegExp(user_name_pattern))
            .required(),
        user_nick: Joi.string()
            .min(2)
            .max(15)
            .pattern(new RegExp(user_nick_pattern))
            .required(),
        user_id: Joi.string()
            .min(5)
            .max(15)
            .pattern(new RegExp(user_id_pattern))
            .required(),
        user_pw: Joi.string()
            .min(6)
            .max(15)
            .pattern(new RegExp(user_pw_pattern))
            .required(), 
        user_confirmPw: Joi.string().valid(Joi.in('user_pw')),
        user_email: Joi.string().email().required(),
        marketing: Joi.boolean().required(),
        })
        .with('user_pw', 'user_confirmPw');

    try { // 검사 
    	await enrollSchema.validateAsync(body); 

        return next();
    } catch (err) { // 에러 
        var dataReply = {};

        console.log(err);

    	return res.json(util.dataReply(dataReply, false, 300, "요청한 데이터 형식이 올바르지 않습니다.", { err: err.message }));
    }
}

exports.idCheck = async (req, res, next) => {
    var user_id = req.body;

    var user_id_pattern = /^[a-z|A-Z|0-9]+$/;

    var idSchema = Joi.object().keys({
        user_id: Joi.string()
            .min(5)
            .max(15)
            .pattern(new RegExp(user_id_pattern))
            .required(),
    })

    try {
        await idSchema.validateAsync(user_id);

        return next();
    } catch (err) {
        var dataReply = {};

        console.log(err);

        return res.json(util.dataReply(dataReply, false, 301, "아이디 형식이 올바르지 않습니다.", { err: err.message }));
    }
}

exports.nickCheck = async (req, res, next) => {
    var user_nick = req.body;

    var user_nick_pattern = /^[가-힣|a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;

    var nickSchema = Joi.object().keys({
        user_nick: Joi.string()
            .min(2)
            .max(15)
            .pattern(new RegExp(user_nick_pattern))
            .required(),
    })

    try {
        await nickSchema.validateAsync(user_nick);

        return next();
    } catch (err) {
        var dataReply = {};

        console.log(err);

        return res.json(util.dataReply(dataReply, false, 303, "닉네임 형식이 올바르지 않습니다.", { err: err.message }));
    }
}

exports.emailCheck = async (req, res, next) => {
    var user_email = req.body;

    var emailSchema = Joi.object().keys({
        user_email: Joi.string().email().required(),
    })

    try {
        await emailSchema.validateAsync(user_email);

        return next();
    } catch(err) {
        var dataReply = {};

        console.log(err);

        return res.json(util.dataReply(dataReply, false, 305, "이메일 형식이 올바르지 않습니다.", { err: err.message }));
    }
}

exports.pwCheck = async (req, res, next) => {
    var { user_pw, user_confirmPw } = req.body;
    var newPw = { user_pw, user_confirmPw };

    var user_pw_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;

    var pwSchema = Joi.object().keys({
        user_pw: Joi.string()
            .min(6)
            .max(15)
            .pattern(new RegExp(user_pw_pattern))
            .required(), 
        user_confirmPw: Joi.string().valid(Joi.in('user_pw')),
    })

    try {
        await pwSchema.validateAsync(newPw);

        return next();
    } catch(err) {
        var dataReply = {};

        console.log(err);

        return res.json(util.dataReply(dataReply, false, 312, "비밀번호를 확인하세요.", { err: err.message }));
    }
}