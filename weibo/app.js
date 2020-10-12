const querystring = require('querystring')
const moment = require('moment')
const { set, get } = require('./src/db/redis.js')
const { access } = require('./src/utils/log.js')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

const getCookieExpire = () => {
    const d = new Date()
    d.setTime(d.getTime() + 24 * 3600 * 1000)
    // console.logs('d.toGMTString():', d.toGMTString())
    return d.toGMTString()
}

// const SESSION_DATA = {}

// 用于处理 post data
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', thuck => {
            postData += thuck.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
}

const serverHandle = (req, res) => {
    /** 记录access log **/
    access(`${moment().format('YYYY-MM-DD HH:mm:ss')} —— ${req.method} —— ${req.url} —— ${req.headers['user-agent']}`)
    res.setHeader('Content-Type', 'application/json')
    /** 获取path **/
    const url = req.url
    req.path = url.split('?')[0]
    /** 解析query **/
    req.query = querystring.parse(url.split('?')[1])
    /** 解析cookie **/
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    /** 解析session，使用redis **/
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化redis中session的值
        set(userId, {})
    }
    /** 获取session **/
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化redis中session的值
            set(req.sessionId, {})
            // 设置session
            req.session = {}
        } else {
            // 设置session
            req.session = sessionData
        }
        return getPostData(req)
    }).then(postData => {
        req.body = postData

        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpire()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpire()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }

        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.write('404 Not Found')
        res.end()
    })
}

module.exports = serverHandle
