const redis = require('redis')
const { REDIS_CONFIG } = require('../config/db.js')

const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host)

redisClient.on('error', err => {
    console.log(err)
})

module.exports = redisClient
