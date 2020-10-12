const router = require('koa-router')()
router.prefix('/api/user')
const { login } = require('../controller/user.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    const result = await login(username, password)

    if (result.username) {
        // 设置session
        ctx.session.username = result.username
        ctx.session.realname = result.realname
        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('用户名或密码不正确')
})
/**
router.get('/session', async (ctx, next) => {
    if (ctx.session.viewCount == null) {
        ctx.session.viewCount = 0
    }
    ctx.session.viewCount++
    ctx.body = {
        code: 0,
        count: ctx.session.viewCount
    }
})
**/

module.exports = router
