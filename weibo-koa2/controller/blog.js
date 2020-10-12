const xss = require('xss')
const { exec } = require('../db/mysql.js')

const getList = async (author, keyword) => {
    let sql = `select id, title, content, createtime, author from blogs where 1 = 1 `
    if (author) {
        sql += `and author = '${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return await exec(sql)
}

const getDetail = async (id) => {
    const sql = `select id, title, content, createtime, author from blogs where id = '${id}'`
    const rows = await exec(sql)
    return rows[0] || null
}

const newBlog = async (blogData = {}) => {
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const createtime = Date.now()
    const author = blogData.author

    const sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', ${createtime}, '${author}')`

    const insetData = await exec(sql)
    return {
        id: insetData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    const title = xss(blogData.title)
    const content = xss(blogData.content)

    const sql = `update blogs set title = '${title}', content = '${content}' where id = ${id}`

    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const delBlog = async (id, author) => {
    const sql = `delete from blogs where id = ${id} and author = '${author}'`

    const result = await exec(sql)

    if (result.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
