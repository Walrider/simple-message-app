const moment = require('moment');
const {client} = require('../db/redis');

class Dispatcher {
    constructor(set = process.env.REDIS_MESSAGES_SET, interval = 1000) {
        this.set = set;
        this.interval = interval;
        this.dispatch = this.dispatch.bind(this);
    }

    async dispatch() {
        try {
            //watch for changes in the set
            await client.watchAsync(this.set);

            //get tasks to dispatch
            const tasksToDispatch = await client.zrangebyscoreAsync(this.set, 0, +moment());

            if (!tasksToDispatch || tasksToDispatch.length === 0) {
                await client.unwatch();
            } else {
                //dispatch first task
                return this.dispatchTask(tasksToDispatch[0]);
            }
        } catch (e) {
            console.log(e);
        }
    };

    dispatchTask(task) {
        const decoded = JSON.parse(task);

        //dispatch task to corresponding queue or rerun dispatch if data was changed
        const results = client.multi()
            .rpush(decoded.queue, decoded.message)
            .zrem(this.set, task)
            .execAsync();
        if (results === null) {
            this.dispatch();
        }
    }
}


module.exports = Dispatcher;
