const xss = require('xss')
const { exec } = require('../db/mysql.js')

const getList = (author, keyword) => {
    let sql = `select id, title, content, createtime, author from blogs where 1 = 1 `
    if (author) {
        sql += `and author = '${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select id, title, content, createtime, author from blogs where id = '${id}'`
    return exec(sql).then(rows => {
        return rows[0] || null
    })
}

const newBlog = (blogData = {}) => {
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const createtime = Date.now()
    const author = blogData.author

    const sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', ${createtime}, '${author}')`
    return exec(sql).then(insetData => {
        return {
            id: insetData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    const title = blogData.title
    const content = blogData.content

    const sql = `update blogs set title = '${title}', content = '${content}' where id = ${id}`
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    const sql = `delete from blogs where id = ${id} and author = '${author}'`
    return exec(sql).then(result => {
        if (result.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
