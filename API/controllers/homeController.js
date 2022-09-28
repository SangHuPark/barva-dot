const dotenv = require('dotenv');

dotenv.config();

const homeService = require('../service/homeService.js');
const util = require('../function/replyFunc.js');

var reply = {};
var dataReply = {};

exports.userProfile = async (req, res) => {
    const user_id = req.decoded.user_id;
    
    try {
        const userProfileInfo = await homeService.findUserProfile(user_id);
        
        return res.json(util.dataReply(dataReply, true, 200, '요청한 회원의 프로필 정보입니다.', { userProfileInfo }));
    } catch (err) {
        console.log(err);
        
        return res.json(util.dataReply(dataReply, false, 500, 'Server error response', { err: err.message }));
    }
}