const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')

/** 同意登录验证 **/
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''

        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                return loginCheckResult
            }
            author = req.session.username
        }
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        }).catch((err) => {
            return new ErrorModel(err)
        })

    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        return getDetail(id).then(data => {
            return new SuccessModel(data)
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        req.body.author = req.session.username
        return newBlog(req.body).then(data => {
            return new SuccessModel(data)
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(data => {
            if (data) {
                return new SuccessModel(data)
            } else {
                return new ErrorModel('更新博客失败')
            }
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const author = req.session.username
        return delBlog(id, author).then(data => {
            if (data) {
                return new SuccessModel(data)
            } else {
                return new ErrorModel('删除博客失败')
            }
        }).catch(err => {
            return new ErrorModel(err)
        })
    }
}

module.exports = handleBlogRouter
