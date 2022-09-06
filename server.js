const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const loginRouter = require('./API/routes/loginRouter.js');
const enrollRouter = require('./API/routes/enrollRouter.js');
const resignRouter = require('./API/routes/resignRouter.js');
const duplicatedIdRouter = require('./API/routes/duplicatedIdRouter.js');
const duplicatedNickRouter = require('./API/routes/duplicatedNickRouter.js');
const authMailRouter = require('./API/routes/authMailRouter.js');
const inspectMail = require('./API/routes/inspectMailRouter.js');

const imageTest = require('./imageTest.js');

const app = express();

app.set('port', process.env.PORT || 3003);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRouter)
app.use('/enroll', enrollRouter);
app.use('/resign', resignRouter);
app.use('/duplicatedIdCheck', duplicatedIdRouter);
app.use('/duplicatedNickCheck', duplicatedNickRouter)
app.use('/authMail', authMailRouter);
app.use('/inspectMail', inspectMail);

app.use('/img', imageTest);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), "port connected!!");
});