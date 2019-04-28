const {redisHost, redisPort} = require('./keys');
const redis = require('redis');

const client = redis.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () => 1000
});

const subClient = client.duplicate();

const fib = (index) => {
    if(index < 2) return 1;
    return fib(index - 1) + fib(index - 2)
}

subClient.on('message', (channel, message) => {
    client.hset('values', message, fib(parseInt(message)))
})

subClient.subscribe('insert');