const env = process.env.NODE_ENV

let MYSQL_CONFIG
let REDIS_CONFIG

if (env === 'development') {
    MYSQL_CONFIG = {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        port: 3306,
        database: 'weibo',
    }
    REDIS_CONFIG = {
        host: '127.0.0.1',
        port: 6379,
    }
}

if (env === 'production') {
    MYSQL_CONFIG = {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        port: 3306,
        database: 'weibo',
    }
    REDIS_CONFIG = {
        host: '127.0.0.1',
        port: 6379,
    }
}

module.exports = {
    MYSQL_CONFIG,
    REDIS_CONFIG
}
