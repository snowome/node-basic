const { login } = require('../controller/user.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const { set } = require('../db/redis.js')

const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // const { username, password } = req.query
        const result = login(username, password)

        return result.then(data => {
            if (data.username) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname
                set(req.sessionId, req.session)
                return new SuccessModel(data)
            }
            return new ErrorModel('用户名或密码不正确')
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    // if (method === 'GET' && req.path === '/api/user/test') {
    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModel('no'))
    // }


}

module.exports = handleUserRouter
