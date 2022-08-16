const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const loginRouter = require('./routes/loginRouter.js');
const enrollRouter = require('./routes/enrollRouter.js');
const resignRouter = require('./routes/resignRouter.js');
const duplicateRouter = require('./routes/duplicateRouter.js');
const authMailRouter = require('./routes/authMailRouter.js');

const app = express();
app.set('port', process.env.PORT || 3003);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRouter)
app.use('/enroll', enrollRouter);
app.use('/resign', resignRouter);
app.use('/duplicateCheck', duplicateRouter);
app.use('/authMail', authMailRouter);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), "port connected!!");
});