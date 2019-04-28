const {pgDatabase, pgHost, pgPort, pgUser, pgPassword, redisHost, redisPort} = require('./keys')

const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json()); 

const { Pool } = require('pg')
const pgClient = new Pool({
    user: pgUser,
    host: pgHost,
    database: pgDatabase,
    password: pgPassword,
    port: pgPort
})

pgClient.on('error', () => console.log('Lost PH connection'))

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
.catch(err => console.log(err))


const redis = require('redis')

const client = redis.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () => 1000
});

const publisher = client.duplicate();


app.get('/', (req, res) => {
    res.send('Hello client');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values')
    res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
    client.hgetall('values', (err, values) => {
        res.send(values);
    })
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if(parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    client.hset('values', index, 'Nothing yet!');
    publisher.publish('insert', 'index')

    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

    res.send({
        working: true
    });
})

app.listen(5000, () => {
    console.log('App listening on port 5000!');
});