const Joi = require('joi');
const util = require('../function/replyFunc.js');

exports.enrollCheck = async (req, res, next) => {  
    const body = req.body; 

    const user_name_pattern = /^[가-힣|a-z|A-Z]+$/;
    const user_nick_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;
    const user_id_pattern = /^[a-z|A-Z|0-9]+$/;
    
    const enrollSchema = Joi.object().keys({ 
        user_name: Joi.string()
            .min(2)
            .max(10)
            .pattern(new RegExp(user_name_pattern))
            .required(),
        user_nick: Joi.string()
            .max(15)
            .pattern(new RegExp(user_nick_pattern))
            .required(),
        user_id: Joi.string()
            .max(15)
            .pattern(new RegExp(user_id_pattern))
            .required(),
        user_pw: Joi.string().min(6).max(15).required(), 
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

exports.nickCheck = async (req, res, next) => {
    const user_nick = req.body.user_nick;

    const user_nick_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;

    const nickSchema = Joi.object().keys({
        user_nick: Joi.string()
            .max(15)
            .pattern(new RegExp(user_nick_pattern))
            .required(),
    })
}