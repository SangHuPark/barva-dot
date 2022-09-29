exports.makeReply = (reply, isSuccess, code, message) => {
    reply.isSuccess = isSuccess;
    reply.code = code;
    reply.message = message;

    return reply;
}

exports.dataReply = (dataReply, isSuccess, code, message, data ) => {
    dataReply.isSuccess = isSuccess;
    dataReply.code = code;
    dataReply.message = message;
    dataReply.data = data;

    return dataReply;
}