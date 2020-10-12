var express = require('express');
var router = express.Router();
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck.js')

router.get('/list', (req, res, next) => {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''

    if (req.query.isadmin) {
        // const loginCheckResult = loginCheck(req)
        if (req.session.username == null) {
            res.json(new ErrorModel('未登录'))
            return
        }
        author = req.session.username
    }
    const result = getList(author, keyword)
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    }).catch((err) => {
        res.json(new ErrorModel(err))
    })
})
router.get('/detail', (req, res, next) => {
    return getDetail(req.query.id).then(data => {
        res.json(new SuccessModel(data))
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})
router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    return newBlog(req.body).then(data => {
        res.json(new SuccessModel(data))
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})
router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(req.query.id, req.body)
    return result.then(data => {
        if (data) {
            res.json(new SuccessModel(data))
        } else {
            res.join(new ErrorModel('更新博客失败'))
        }
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})
router.post('/del', loginCheck, (req, res, next) => {
    const author = req.session.username
    return delBlog(req.query.id, author).then(data => {
        if (data) {
            res.json(new SuccessModel(data))
        } else {
            res.join(new ErrorModel('删除博客失败'))
        }
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

module.exports = router;
