import Joi from "joi";
import * as util from "../function/replyFunc.js";

var dataReply = {};

export async function signUpForm(newUserInfo) {  
    var user_name_pattern = /^[가-힣|a-z|A-Z]+$/;
    var user_nick_pattern = /^[가-힣|a-z|A-Z|0-9]+$/;
    var user_id_pattern = /^[a-z|A-Z|0-9]+$/;
    var user_pw_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;
    
    var signUpSchema = Joi.object().keys({ 
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
    	await signUpSchema.validateAsync(newUserInfo); 

        return true;
    } catch (err) { // 에러 
        console.log(err);

    	return err.message;
    }
}

export async function loginForm(loginData) {
    var user_id_pattern = /^[a-z|A-Z|0-9]+$/;
    var user_pw_pattern = /^[a-z|A-Z|0-9|~!@#$%^&*()_+|<>?:{}]+$/;
    
    var loginSchema = Joi.object().keys({ 
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
        })

    try { // 검사 
    	await loginSchema.validateAsync(loginData); 

        return true;
    } catch (err) { // 에러 
        console.log(err);

    	return err.message;
    }
}

export async function idForm(user_id) {
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

        return true;
    } catch (err) {
        console.log(err);

        return err.message;
    }
}

export async function nickForm(user_nick) {
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

        return true;
    } catch (err) {
        console.log(err);

        return err.message;
    }
}

export async function emailForm(user_email) {
    var emailSchema = Joi.object().keys({
        user_email: Joi.string()
            .email()
            .required(),
    })

    try {
        await emailSchema.validateAsync(user_email);

        return true;
    } catch(err) {
        console.log(err);

        return err.message;
    }
}

export async function findIdForm(findIdData) {
    var user_name_pattern = /^[가-힣|a-z|A-Z]+$/;

    var findIdSchema = Joi.object().keys({
        user_name: Joi.string()
            .min(2)
            .max(10)
            .pattern(new RegExp(user_name_pattern))
            .required(),
        user_email: Joi.string()
            .email()
            .required(),
    })

    try {
        await findIdSchema.validateAsync(findIdData);

        return true;
    } catch(err) {
        console.log(err);

        return err.message;
    }
}