const nodemailer = require('nodemailer');

exports.makeMail = async (authNumber, user_mail) => {
    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'barvadot@gmail.com',
            pass: 'efygzfvizarnldxu'
        }
    });

    const mailOptions = {
        from: 'barvadot@gmail.com',
        to: user_mail,
        subject: '[ barvadot ] 이메일 인증번호',
        text: '- 인증번호 : ' + authNumber
    };

    await smtpTransport.sendMail(mailOptions, (err) => {
        if(err)
            throw new Error(err);
        
        smtpTransport.close();
    })
}