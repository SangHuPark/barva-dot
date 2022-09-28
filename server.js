const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

// 회원 관련 라우터
var loginRouter = require('./API/routes/userRouter/loginRouter.js');
var enrollRouter = require('./API/routes/userRouter/enrollRouter.js');
var duplicatedIdRouter = require('./API/routes/userRouter/duplicatedIdRouter.js');
var duplicatedNickRouter = require('./API/routes/userRouter/duplicatedNickRouter.js');
var authMailRouter = require('./API/routes/userRouter/authMailRouter.js');
var inspectMailRouter = require('./API/routes/userRouter/inspectMailRouter.js');
var findIdRouter = require('./API/routes/userRouter/findIdRouter.js');
var findPwRouter = require('./API/routes/userRouter/findPwRouter.js');
var findPwMailRouter = require('./API/routes/userRouter/findPwMailRouter.js');
var updatePwRouter = require('./API/routes/userRouter/updatePwRouter.js');
var resignRouter = require('./API/routes/userRouter/resignRouter.js');

// 홈 관련 라우터
var profileRouter = require('./API/routes/homeRouter/userProfileRouter.js');

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