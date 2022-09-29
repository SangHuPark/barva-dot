const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

// 회원 관련 라우터
var loginRouter = require('./src/routes/userRouter/loginRouter.js');
var enrollRouter = require('./src/routes/userRouter/enrollRouter.js');
var duplicatedIdRouter = require('./src/routes/userRouter/duplicatedIdRouter.js');
var duplicatedNickRouter = require('./src/routes/userRouter/duplicatedNickRouter.js');
var authMailRouter = require('./src/routes/userRouter/authMailRouter.js');
var inspectMailRouter = require('./src/routes/userRouter/inspectMailRouter.js');
var findIdRouter = require('./src/routes/userRouter/findIdRouter.js');
var findPwRouter = require('./src/routes/userRouter/findPwRouter.js');
var findPwMailRouter = require('./src/routes/userRouter/findPwMailRouter.js');
var updatePwRouter = require('./src/routes/userRouter/updatePwRouter.js');
var resignRouter = require('./src/routes/userRouter/resignRouter.js');

// 홈 관련 라우터
var profileRouter = require('./src/routes/homeRouter/userProfileRouter.js');

const app = express();

app.set('port', process.env.PORT || 3003);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 회원 관련 경로
app.use('/login', loginRouter);
app.use('/enroll', enrollRouter);
app.use('/duplicatedIdCheck', duplicatedIdRouter);
app.use('/duplicatedNickCheck', duplicatedNickRouter);
app.use('/authMail', authMailRouter);
app.use('/inspectMail', inspectMailRouter);
app.use('/findId', findIdRouter);
app.use('/findPw', findPwRouter);
app.use('/findPwMail', findPwMailRouter);
app.use('/updatePw', updatePwRouter);
app.use('/resign', resignRouter);

// 홈 관련 경로
app.use('/userProfile', profileRouter);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), "port connected!!");
});

/** app.use((req, res) => {
    console.log(req.url);
}) */