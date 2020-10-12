const express = require('express')
const router = express.Router()
const { login } = require('../controller/user.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')

router.post('/login', function(req, res, next) {
    const { username, password } = req.body
    const result = login(username, password)

    return result.then(data => {
        if (data.username) {
            // 设置session
            req.session.username = data.username
            req.session.realname = data.realname
            res.json(new SuccessModel(data))
            return
        }
        res.json(new ErrorModel('用户名或密码不正确'))
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

router.get('/test', function (req, res, next) {
    if (req.session.username) {
        res.json({
            code: 0,
            msg: 'ok'
        })
        return
    }
    res.json({
        code: -1,
        msg: 'not ok'
    })
})

module.exports = router
