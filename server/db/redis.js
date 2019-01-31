const redis = require('redis-promisify');

client = redis.createClient(process.env.REDIS_PORT || null, process.env.REDIS_HOST || null);

module.exports = {client};
