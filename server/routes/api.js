const express = require('express');
const router = express.Router();

const moment = require('moment');
const uuidv4 = require('uuid/v4');
const {client} = require('../db/redis');

const Dispatcher = require('../lib/Dispatcher');
const Worker = require('../lib/Worker');

router.post('/messages/echoAtTime', async (req, res) => {
    try {
        //parse body and exclude -uuid-
        const message = req.body.message.replace('-uuid-', '');
        const time = req.body.time.trim();

        //use default SET and QUEUE
        const set = process.env.REDIS_MESSAGES_SET;
        const queue = process.env.REDIS_MESSAGE_QUEUE;

        //Input validation
        if (!message) {
            return res.status(400).send("Message shouldn't be empty");
        }
        if (!time || isNaN(moment(time))) {
            return res.status(400).send("Time format is incorrect. Please use YYYY-MM-DD HH:mm:ss:SSS");
        }

        //Add message to sorted set using unix timestamp as a score
        //and make sure message is unique using uuid
        await client.zaddAsync(set, +moment(time), JSON.stringify({
            'queue': queue,
            'message': message + '-uuid-' + uuidv4()
        }));

        //Format response
        let response = `Message "${ message }" will be published`;
        if (moment(time) < moment()) {
            response += ' now';
        } else {
            response += ` on ${ moment(time).format("dddd, MMMM Do YYYY, HH:mm:ss:SSS") }`;
        }

        return res.status(200).send(response);
    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
});

module.exports = router;
