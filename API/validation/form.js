const Joi = require('joi');
const util = require('../function/replyFunc.js');

exports.enrollCheck = async (req, res, next) => {  
    const body = req.body; 

    const user_name_pattern = /^[가-힣|a-z|A-Z]+$/;
    const user_nick_pattern = /^[가-힣|a-z|A-Z|0-9]+$/;
    const user_id_pattern = /^[a-z|A-Z|0-9]+$/;
    const user_pw_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;
    
    const enrollSchema = Joi.object().keys({ 
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
        })
        .with('user_pw', 'user_confirmPw');

    try { // 검사 
    	await enrollSchema.validateAsync(body); 

        return next();
    } catch (err) { // 에러 
        var dataReply = {};

        console.log(err.message);

    	return res.json(util.dataReply(dataReply, false, 400, "요청한 데이터 형식이 올바르지 않습니다.", { err: err.message }));
    }
}

exports.idCheck = async (req, res, next) => {
    const user_id = req.body;

    const user_id_pattern = /^[a-z|A-Z|0-9]+$/;

    const idSchema = Joi.object().keys({
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

        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 401, "아이디 형식이 올바르지 않습니다.", { err: err.message }));
    }
}

exports.nickCheck = async (req, res, next) => {
    const user_nick = req.body.user_nick;

    const user_nick_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;

    const nickSchema = Joi.object().keys({
        user_nick: Joi.string()
            .max(15)
            .pattern(new RegExp(user_nick_pattern))
            .required(),
    })

    try {
        await nickSchema.validateAsync(user_nick);

        return next();
    } catch (err) {
        var dataReply = {};

        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 402, "닉네임 형식이 올바르지 않습니다.", { err: err.message }));
    }
}

exports.emailCheck = async (req, res, next) => {
    const user_email = req.body.user_email;

    const emailSchema = Joi.object().keys({
        user_email: Joi.string().email().required(),
    })

    try {
        await emailSchema.validateAsync(user_email);

        return next();
    } catch(err) {
        var dataReply = {};

        console.log(err.message);

        return res.json(util.dataReply(dataReply, false, 403, "이메일 형식이 올바르지 않습니다.", { err: err.message }));
    }
}