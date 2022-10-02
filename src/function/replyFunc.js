export function makeReply(reply, isSuccess, code, message) {
    reply.isSuccess = isSuccess;
    reply.code = code;
    reply.message = message;

    return reply;
}

export function dataReply(reply, isSuccess, code, message, data ) {
    reply.isSuccess = isSuccess;
    reply.code = code;
    reply.message = message;
    reply.data = data;

    return reply;
}