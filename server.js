const express = require('express');
const dotenv = require('dotenv');

const router = require('./src/routes/index.js');

dotenv.config();

async function startServer() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.set('port', process.env.PORT || 3003);

    app.use(router());

    app.listen(app.get('port'), () => {
        console.log(`Server start listening on ${app.get('port')} port...`);
    });
}

startServer();

// 회원 관련 라우터
var findIdRouter = require('./src/routes/userRouter/findIdRouter.js');
var findPwRouter = require('./src/routes/userRouter/findPwRouter.js');
var findPwMailRouter = require('./src/routes/userRouter/findPwMailRouter.js');
var updatePwRouter = require('./src/routes/userRouter/updatePwRouter.js');
var resignRouter = require('./src/routes/userRouter/resignRouter.js');

// 홈 관련 라우터
var profileRouter = require('./src/routes/homeRouter/userProfileRouter.js');

// 회원 관련 경로
app.use('/findId', findIdRouter);
app.use('/findPw', findPwRouter);
app.use('/findPwMail', findPwMailRouter);
app.use('/updatePw', updatePwRouter);
app.use('/resign', resignRouter);

// 홈 관련 경로
app.use('/userProfile', profileRouter);

/** app.use((req, res) => {
    console.log(req.url);
}) */