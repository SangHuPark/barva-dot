const jwt = require('jsonwebtoken');
const util = require('../function/replyFunc.js');

exports.auth = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
    
    return next();
  } catch (err) {
    var reply = {};

    console.log(err.message);

    if (err.name === 'TokenExpiredError') {
      return res.json(util.makeReply(reply, false, 419, '토큰이 만료되었습니다'));
    }
    if (err.name === 'JsonWebTokenError') {
      return res.json(util.makeReply(reply, false, 420, '유효하지 않은 토큰입니다'));
    }
  }
};