const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

var loginRouter = require('./API/routes/loginRouter.js');
var enrollRouter = require('./API/routes/enrollRouter.js');
var duplicatedIdRouter = require('./API/routes/duplicatedIdRouter.js');
var duplicatedNickRouter = require('./API/routes/duplicatedNickRouter.js');
var authMailRouter = require('./API/routes/authMailRouter.js');
var inspectMailRouter = require('./API/routes/inspectMailRouter.js');
var findIdRouter = require('./API/routes/findIdRouter.js');
var findPwRouter = require('./API/routes/findPwRouter.js');
var updatePwRouter = require('./API/routes/updatePwRouter.js');
var resignRouter = require('./API/routes/resignRouter.js');

const app = express();

app.set('port', process.env.PORT || 3003);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRouter);
app.use('/enroll', enrollRouter);
app.use('/duplicatedIdCheck', duplicatedIdRouter);
app.use('/duplicatedNickCheck', duplicatedNickRouter);
app.use('/authMail', authMailRouter);
app.use('/inspectMail', inspectMailRouter);
app.use('/findId', findIdRouter);
app.use('/findPw', findPwRouter);
app.use('/updatePw', updatePwRouter);
app.use('/resign', resignRouter);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), "port connected!!");
});

/** app.use((req, res) => {
    console.log(req.url);
}) */