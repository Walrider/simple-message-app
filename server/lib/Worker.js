const {client} = require('../db/redis');

class Worker {
    constructor(queue = process.env.REDIS_MESSAGE_QUEUE, interval = 1000) {
        this.queue = queue;
        this.interval = interval;
        this.printMessage = this.printMessage.bind(this);
    }

    async printMessage() {
        try {
            //get first message in the queue
            const message = await client.lpopAsync(this.queue);

            //remove uuid data from message and print
            if (message) {
                console.log(message.substring(0, message.indexOf("-uuid-")));
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Worker;
