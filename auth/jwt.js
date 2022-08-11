const jwt = require('jsonwebtoken');
const util = require('../function/replyFunc.js');

exports.auth = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
    
    return next();
  } catch (error) {
    var dataReply = {}
    if (error.name === 'TokenExpiredError') {
      return res.json(util.dataReply(dataReply, false, 419, '토큰이 만료되었습니다', { error }));
    }
    if (error.name === 'JsonWebTokenError') {
      return res.json(util.dataReply(dataReply, false, 401, '유효하지 않은 토큰입니다', { error }));
    }
  }
};