require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.APP_PORT;

//load classes and constants
const set = process.env.REDIS_MESSAGES_SET;
const queue = process.env.REDIS_MESSAGE_QUEUE;
const Dispatcher = require('./lib/Dispatcher');
const Worker = require('./lib/Worker');

//init dispatcher(s) and worker(s)
const worker = new Worker(queue, 1000);
const dispatcher = new Dispatcher(set, 1000);

//require routes files
const apiRoutes = require('./routes/api');

//enable bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Init routes
app.use('/api', apiRoutes);

app.listen(port, async () => {
    console.log(`Started up at port ${ port }`);
    setInterval(dispatcher.dispatch, dispatcher.interval);
    setInterval(worker.printMessage, worker.interval);
});

module.exports = {app};
